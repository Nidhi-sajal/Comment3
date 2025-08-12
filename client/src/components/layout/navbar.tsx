import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center" data-testid="link-home">
            <div className="flex-shrink-0 flex items-center">
              <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span className="ml-2 text-xl font-bold text-text-primary">SocialAI</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#features" className="text-text-secondary hover:text-primary transition-colors duration-300 px-3 py-2 text-sm font-medium" data-testid="link-features">Features</a>
              <a href="#pricing" className="text-text-secondary hover:text-primary transition-colors duration-300 px-3 py-2 text-sm font-medium" data-testid="link-pricing">Pricing</a>
              <Link href="/dashboard" className="text-text-secondary hover:text-primary transition-colors duration-300 px-3 py-2 text-sm font-medium" data-testid="link-dashboard">Dashboard</Link>
              <Link href="/auth" className="text-text-secondary hover:text-primary transition-colors duration-300 px-3 py-2 text-sm font-medium" data-testid="link-login">Login</Link>
            </div>
          </div>
          
          {/* CTA Button */}
          <div className="hidden md:block">
            <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" data-testid="button-get-access">
              Get Instant Access
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-text-secondary hover:text-primary focus:outline-none"
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-white border-t border-gray-200"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#features" className="text-text-secondary hover:text-primary block px-3 py-2 text-base font-medium">Features</a>
            <a href="#pricing" className="text-text-secondary hover:text-primary block px-3 py-2 text-base font-medium">Pricing</a>
            <Link href="/dashboard" className="text-text-secondary hover:text-primary block px-3 py-2 text-base font-medium">Dashboard</Link>
            <Link href="/auth" className="text-text-secondary hover:text-primary block px-3 py-2 text-base font-medium">Login</Link>
            <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-xl font-semibold">
              Get Instant Access
            </Button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
