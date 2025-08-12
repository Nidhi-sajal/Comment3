import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SocialConnectionsProps {
  teamId?: string;
}

const platforms = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: (
      <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    bgColor: 'bg-gradient-to-tr from-purple-500 to-pink-500',
    description: 'Connect your Instagram business account to automate comment replies and engagement.',
  },
  {
    id: 'reddit',
    name: 'Reddit',
    icon: (
      <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.238 15.348c.085-.084.085-.221 0-.306-.465-.462-1.194-.687-2.238-.687s-1.773.225-2.238.687c-.085.085-.085.222 0 .306.084.085.222.085.306 0 .408-.408.958-.585 1.932-.585s1.524.177 1.932.585c.084.085.222.085.306 0z"/>
        <circle cx="15.5" cy="10.5" r="1.5"/>
        <circle cx="8.5" cy="10.5" r="1.5"/>
        <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0z"/>
      </svg>
    ),
    bgColor: 'bg-orange-500',
    description: 'Your Reddit account is connected and ready for automated comment responses.',
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    icon: (
      <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    bgColor: 'bg-black',
    description: 'Connect your X account to automate replies and grow your presence safely.',
  },
];

export default function SocialConnections({ teamId }: SocialConnectionsProps) {
  const { toast } = useToast();

  // Get team integrations
  const { data: integrations = [] } = useQuery({
    queryKey: ['/api/teams', teamId, 'integrations'],
    enabled: !!teamId,
  });

  // Start OAuth flow mutation
  const startOAuthMutation = useMutation({
    mutationFn: async (platform: string) => {
      const response = await apiRequest('GET', `/api/integrations/${platform}/oauth/start`);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    },
    onError: () => {
      toast({
        title: "Connection Failed",
        description: "Failed to start OAuth flow. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Disconnect integration mutation
  const disconnectMutation = useMutation({
    mutationFn: async (integrationId: string) => {
      await apiRequest('DELETE', `/api/integrations/${integrationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teams', teamId, 'integrations'] });
      toast({
        title: "Disconnected",
        description: "Account disconnected successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Disconnection Failed",
        description: "Failed to disconnect account. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getIntegrationStatus = (platformId: string) => {
    const integration = (integrations as any[]).find((int: any) => int.platform === platformId);
    return integration ? 'connected' : 'not_connected';
  };

  const getIntegrationId = (platformId: string) => {
    const integration = (integrations as any[]).find((int: any) => int.platform === platformId);
    return integration?.id;
  };

  const handleConnect = (platformId: string) => {
    startOAuthMutation.mutate(platformId);
  };

  const handleDisconnect = (platformId: string) => {
    const integrationId = getIntegrationId(platformId);
    if (integrationId) {
      disconnectMutation.mutate(integrationId);
    }
  };

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Connect Your Social Media</h1>
        <p className="text-text-secondary">Link Instagram, Reddit, and X to enable automated replies.</p>
      </div>
      
      {/* Connection Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {platforms.map((platform, index) => {
          const status = getIntegrationStatus(platform.id);
          const isConnected = status === 'connected';
          
          return (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-all duration-300 h-full" data-testid={`card-${platform.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`${platform.bgColor} p-3 rounded-xl`}>
                      {platform.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-text-primary">{platform.name}</h3>
                      <Badge 
                        variant={isConnected ? "default" : "destructive"}
                        className={isConnected ? "bg-green-500" : ""}
                        data-testid={`status-${platform.id}`}
                      >
                        {isConnected ? (
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                            Connected
                          </div>
                        ) : (
                          'Not Connected'
                        )}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-text-secondary mb-4 text-sm">{platform.description}</p>
                  
                  {isConnected ? (
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => handleDisconnect(platform.id)}
                      disabled={disconnectMutation.isPending}
                      data-testid={`button-disconnect-${platform.id}`}
                    >
                      {disconnectMutation.isPending ? 'Disconnecting...' : 'Disconnect'}
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
                      onClick={() => handleConnect(platform.id)}
                      disabled={startOAuthMutation.isPending}
                      data-testid={`button-connect-${platform.id}`}
                    >
                      {startOAuthMutation.isPending ? 'Connecting...' : `Connect ${platform.name}`}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
