import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PostsTableProps {
  teamId?: string;
}

const platformIcons = {
  reddit: (
    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M14.238 15.348c.085-.084.085-.221 0-.306-.465-.462-1.194-.687-2.238-.687s-1.773.225-2.238.687c-.085.085-.085.222 0 .306.084.085.222.085.306 0 .408-.408.958-.585 1.932-.585s1.524.177 1.932.585c.084.085.222.085.306 0z"/>
      <circle cx="15.5" cy="10.5" r="1.5"/>
      <circle cx="8.5" cy="10.5" r="1.5"/>
      <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0z"/>
    </svg>
  ),
  instagram: (
    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  x: (
    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
};

const platformColors = {
  reddit: 'bg-orange-500',
  instagram: 'bg-gradient-to-tr from-purple-500 to-pink-500',
  x: 'bg-black',
};

export default function PostsTable({ teamId }: PostsTableProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  // Get team posts
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['/api/teams', teamId, 'posts', selectedPlatform !== 'all' ? selectedPlatform : undefined],
    enabled: !!teamId,
  });

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInHours = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const getStatusBadge = (repliedCount: number, commentCount: number) => {
    const percentage = commentCount > 0 ? (repliedCount / commentCount) * 100 : 0;
    
    if (percentage >= 75) {
      return <Badge className="bg-green-500 text-white" data-testid="badge-status-high">Excellent</Badge>;
    } else if (percentage >= 50) {
      return <Badge className="bg-yellow-500 text-white" data-testid="badge-status-medium">Good</Badge>;
    } else if (percentage > 0) {
      return <Badge className="bg-orange-500 text-white" data-testid="badge-status-low">Needs Attention</Badge>;
    } else {
      return <Badge variant="secondary" data-testid="badge-status-none">No Replies</Badge>;
    }
  };

  if (isLoading) {
    return (
      <section>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Recent Posts & Comments</h2>
          <p className="text-text-secondary">Monitor your social media activity and AI-generated responses.</p>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-pulse">Loading posts...</div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Recent Posts & Comments</h2>
          <p className="text-text-secondary">Monitor your social media activity and AI-generated responses.</p>
        </div>
        
        {/* Platform Filter */}
        <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
          <SelectTrigger className="w-48" data-testid="select-platform-filter">
            <SelectValue placeholder="Filter by platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="reddit">Reddit</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="x">X (Twitter)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Posts Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {(posts as any[]).length === 0 ? (
            <div className="text-center py-12">
              <div className="text-text-secondary mb-4">
                <svg className="h-16 w-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">No posts found</h3>
              <p className="text-text-secondary mb-4">Connect your social media accounts to see posts and comments here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Platform</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Post Preview</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Comments</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">AI Reply Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(posts as any[]).map((post: any, index: number) => (
                    <motion.tr 
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                      data-testid={`table-row-${index}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`${platformColors[post.platform as keyof typeof platformColors]} p-2 rounded-lg`}>
                            {platformIcons[post.platform as keyof typeof platformIcons]}
                          </div>
                          <span className="ml-2 text-sm font-medium capitalize" data-testid={`text-platform-${index}`}>
                            {post.platform}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-text-primary font-medium" data-testid={`text-post-title-${index}`}>
                          {post.title || 'Untitled Post'}
                        </div>
                        <div className="text-sm text-text-secondary" data-testid={`text-post-meta-${index}`}>
                          {post.integration.displayName} • {formatTimeAgo(post.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-text-primary font-medium" data-testid={`text-comment-count-${index}`}>
                          {post.commentCount || 0} comments
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(post.repliedCount || 0, post.commentCount || 0)}
                          <span className="text-sm text-text-secondary" data-testid={`text-reply-count-${index}`}>
                            {post.repliedCount || 0} replied
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary/80"
                          data-testid={`button-view-post-${index}`}
                        >
                          View
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
