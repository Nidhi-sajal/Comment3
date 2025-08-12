import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTeamSchema, insertIntegrationSchema, insertPostSchema, insertSuggestionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Middleware for Clerk JWT verification (simplified for this implementation)
  const requireAuth = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // In production, verify the Clerk JWT here
    // For now, we'll simulate a user ID from the token
    req.userId = 'user-123'; // This would come from the verified JWT
    next();
  };

  // Auth endpoints
  app.get('/api/auth/me', requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUserByClerkId(req.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/auth/sync', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user exists
      let user = await storage.getUserByEmail(userData.email);
      
      if (!user) {
        // Create new user
        user = await storage.createUser(userData);
        
        // Create default team
        const team = await storage.createTeam({
          ownerUserId: user.id,
          name: `${user.name}'s Team`,
        });
        
        await storage.createActivityLog({
          teamId: team.id,
          actorUserId: user.id,
          type: 'user_created',
          payload: { userId: user.id, teamId: team.id },
        });
      }
      
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Team endpoints
  app.get('/api/teams', requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUserByClerkId(req.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const teams = await storage.getUserTeams(user.id);
      res.json(teams);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Integration OAuth endpoints
  app.get('/api/integrations/:platform/oauth/start', requireAuth, async (req: any, res) => {
    try {
      const { platform } = req.params;
      const state = `${req.userId}-${Date.now()}`;
      
      let redirectUrl = '';
      
      switch (platform) {
        case 'reddit':
          redirectUrl = `https://www.reddit.com/api/v1/authorize?client_id=${process.env.REDDIT_CLIENT_ID}&response_type=code&state=${state}&redirect_uri=${process.env.REDDIT_REDIRECT_URI}&duration=permanent&scope=read+submit+identity`;
          break;
        case 'instagram':
          redirectUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.META_APP_ID}&redirect_uri=${process.env.META_REDIRECT_URI}&state=${state}&scope=instagram_basic,instagram_manage_comments,pages_show_list`;
          break;
        case 'x':
          redirectUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.X_CLIENT_ID}&redirect_uri=${process.env.X_REDIRECT_URI}&state=${state}&scope=tweet.read+tweet.write+users.read+offline.access`;
          break;
        default:
          return res.status(400).json({ error: 'Unsupported platform' });
      }
      
      res.json({ redirectUrl });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/integrations/:platform/oauth/callback', async (req, res) => {
    try {
      const { platform } = req.params;
      const { code, state } = req.query;
      
      if (!code || !state) {
        return res.status(400).json({ error: 'Missing code or state parameter' });
      }
      
      // Extract user ID from state
      const userId = (state as string).split('-')[0];
      const user = await storage.getUserByClerkId(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Get user's default team
      const teams = await storage.getUserTeams(user.id);
      const team = teams[0];
      
      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }
      
      // Exchange code for access token (simplified implementation)
      // In production, make actual OAuth token exchange requests
      const mockIntegration = await storage.createIntegration({
        teamId: team.id,
        platform: platform as 'reddit' | 'instagram' | 'x',
        platformAccountId: `${platform}_user_${Date.now()}`,
        displayName: `${platform} Account`,
        accessToken: `mock_access_token_${Date.now()}`,
        refreshToken: `mock_refresh_token_${Date.now()}`,
        scopes: ['read', 'write'],
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
        meta: { platform, connectedAt: new Date() },
      });
      
      await storage.createActivityLog({
        teamId: team.id,
        actorUserId: user.id,
        type: 'integration_connected',
        payload: { platform, integrationId: mockIntegration.id },
      });
      
      // Redirect to frontend dashboard
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5000'}/dashboard?connected=${platform}`);
    } catch (error) {
      res.status(500).json({ error: 'OAuth callback failed' });
    }
  });

  // Integration management
  app.get('/api/teams/:teamId/integrations', requireAuth, async (req, res) => {
    try {
      const { teamId } = req.params;
      const integrations = await storage.getTeamIntegrations(teamId);
      res.json(integrations);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.delete('/api/integrations/:id', requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      
      const integration = await storage.getIntegration(id);
      if (!integration) {
        return res.status(404).json({ error: 'Integration not found' });
      }
      
      await storage.deleteIntegration(id);
      
      const user = await storage.getUserByClerkId(req.userId);
      if (user) {
        await storage.createActivityLog({
          teamId: integration.teamId,
          actorUserId: user.id,
          type: 'integration_disconnected',
          payload: { platform: integration.platform, integrationId: id },
        });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Posts and comments
  app.get('/api/teams/:teamId/posts', requireAuth, async (req, res) => {
    try {
      const { teamId } = req.params;
      const { platform, limit } = req.query;
      
      let posts = await storage.getTeamPosts(teamId, limit ? parseInt(limit as string) : 50);
      
      if (platform) {
        posts = posts.filter(post => post.platform === platform);
      }
      
      // Get comment counts for each post
      const postsWithCounts = await Promise.all(
        posts.map(async (post) => {
          const comments = await storage.getPostComments(post.id);
          const suggestions = await storage.getPostSuggestions(post.id);
          const repliedCount = suggestions.filter(s => s.status === 'posted').length;
          
          return {
            ...post,
            commentCount: comments.length,
            repliedCount,
          };
        })
      );
      
      res.json(postsWithCounts);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // AI suggestions
  app.post('/api/posts/:postId/suggestions', requireAuth, async (req: any, res) => {
    try {
      const { postId } = req.params;
      const { intentId, mode = 'draft' } = req.body;
      
      const post = await storage.getPost(postId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      // Create pending suggestion
      const suggestion = await storage.createSuggestion({
        postId,
        generatedBy: 'ai',
        intentId,
        text: '', // Will be filled by worker
        tone: 'neutral',
        confidence: 0,
        status: 'pending',
        workerLogs: { mode, requestedAt: new Date() },
      });
      
      // In production, enqueue AI generation job here
      // For now, simulate AI response after a delay
      setTimeout(async () => {
        try {
          const aiResponse = `This is an AI-generated response to the post "${post.title || 'Untitled'}". The response is contextual and engaging.`;
          
          await storage.updateSuggestion(suggestion.id, {
            text: aiResponse,
            confidence: 0.85,
            workerLogs: { 
              completedAt: new Date(),
              aiProvider: 'gemini',
              tokens: 150
            },
          });
        } catch (error) {
          console.error('Error updating suggestion:', error);
        }
      }, 2000);
      
      res.json({ suggestionId: suggestion.id, status: 'pending' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/suggestions/:id/approve', requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { autoPost = false } = req.body;
      
      const user = await storage.getUserByClerkId(req.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const suggestion = await storage.updateSuggestion(id, {
        status: autoPost ? 'posted' : 'approved',
        approvedBy: user.id,
      });
      
      if (autoPost) {
        // In production, enqueue posting job here
        // For now, simulate successful posting
        setTimeout(async () => {
          try {
            await storage.updateSuggestion(id, {
              status: 'posted',
              workerLogs: {
                postedAt: new Date(),
                platformResponse: { success: true, commentId: `comment_${Date.now()}` }
              },
            });
          } catch (error) {
            console.error('Error updating posted suggestion:', error);
          }
        }, 1000);
      }
      
      res.json({ success: true, jobId: autoPost ? `job_${Date.now()}` : null });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/posts/:postId/suggestions', requireAuth, async (req, res) => {
    try {
      const { postId } = req.params;
      const suggestions = await storage.getPostSuggestions(postId);
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
