import { Link, useLocation } from "wouter";
import { Home, Plus, MessageCircle, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: Home, current: true },
  { name: 'Connect Accounts', href: '/dashboard/connect', icon: Plus, current: false },
  { name: 'Manage Intents', href: '/dashboard/intents', icon: MessageCircle, current: false },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings, current: false },
];

export default function Sidebar({ isCollapsed = false }: SidebarProps) {
  const [location] = useLocation();

  return (
    <div className={cn(
      "bg-bg-dark text-white flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-700">
        <Link href="/" className="flex items-center" data-testid="link-sidebar-home">
          <svg className="h-8 w-8 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          {!isCollapsed && (
            <span className="ml-3 text-xl font-bold">SocialAI</span>
          )}
        </Link>
      </div>
      
      {/* Sidebar Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href || location.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-3 rounded-lg transition-colors duration-200",
                isActive
                  ? "text-white bg-primary/20"
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              )}
              data-testid={`sidebar-link-${item.name.toLowerCase().replace(' ', '-')}`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="ml-3">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
