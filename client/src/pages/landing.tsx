import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";
import { MessageCircle, Clock, ShieldCheck, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const socialIcons = {
  reddit: (
    <svg className="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M14.238 15.348c.085-.084.085-.221 0-.306-.465-.462-1.194-.687-2.238-.687s-1.773.225-2.238.687c-.085.085-.085.222 0 .306.084.085.222.085.306 0 .408-.408.958-.585 1.932-.585s1.524.177 1.932.585c.084.085.222.085.306 0z"/>
      <circle cx="15.5" cy="10.5" r="1.5"/>
      <circle cx="8.5" cy="10.5" r="1.5"/>
      <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0z"/>
    </svg>
  ),
  linkedin: (
    <svg className="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  instagram: (
    <svg className="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  x: (
    <svg className="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
};

export default function Landing() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: MessageCircle,
      title: "AI Comment Replies",
      description: "Engage instantly with smart, human-like responses that match your brand voice and tone perfectly."
    },
    {
      icon: Clock,
      title: "Save Hours Daily",
      description: "No more drowning in repetitive replies. Automate your engagement while maintaining authenticity."
    },
    {
      icon: ShieldCheck,
      title: "Safe Growth",
      description: "Avoid spam flags with natural variation and smart pacing that keeps your accounts safe."
    }
  ];

  const userAvatars = [
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80",
    "https://images.unsplash.com/photo-1494790108755-2616c27cb946?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80",
  ];

  return (
    <div className="min-h-screen bg-bg-light text-text-primary font-inter">
      {/* Navbar */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="ml-2 text-xl font-bold text-text-primary">SocialAI</span>
              </div>
            </div>
            
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

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="hero-gradient py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            {/* Left Column */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6 leading-tight">
                Grow on <span className="text-primary">Reddit</span> & <span className="text-secondary">LinkedIn</span> without getting suspended
              </h1>
              <p className="text-xl text-text-secondary mb-8 leading-relaxed">
                Build your brand — with our AI-powered automation & safe growth roadmap.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" data-testid="button-get-instant-access">
                  Get Instant Access
                </Button>
                <Button variant="outline" className="border-2 border-text-secondary hover:border-primary text-text-secondary hover:text-primary px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300" data-testid="button-learn-more">
                  Learn More
                </Button>
              </div>
            </motion.div>
            
            {/* Right Column - Social Media Icons Animation */}
            <div className="mt-12 lg:mt-0 relative">
              <div className="relative h-96 w-full flex items-center justify-center">
                {/* Reddit Icon */}
                <motion.div 
                  animate={{
                    y: [0, -10, -20, -10, 0],
                    rotate: [0, 2, 0, -2, 0]
                  }}
                  transition={{
                    duration: 6,
                    ease: "easeInOut",
                    repeat: Infinity,
                    delay: 0
                  }}
                  className="absolute top-12 left-8 social-icon"
                >
                  <div className="bg-orange-500 p-6 rounded-2xl shadow-lg transform rotate-12">
                    {socialIcons.reddit}
                  </div>
                </motion.div>
                
                {/* LinkedIn Icon */}
                <motion.div 
                  animate={{
                    y: [0, -10, -20, -10, 0],
                    rotate: [0, 2, 0, -2, 0]
                  }}
                  transition={{
                    duration: 6,
                    ease: "easeInOut",
                    repeat: Infinity,
                    delay: 2
                  }}
                  className="absolute top-8 right-12 social-icon"
                >
                  <div className="bg-blue-600 p-6 rounded-2xl shadow-lg transform -rotate-6">
                    {socialIcons.linkedin}
                  </div>
                </motion.div>
                
                {/* Instagram Icon */}
                <motion.div 
                  animate={{
                    y: [0, -10, -20, -10, 0],
                    rotate: [0, 2, 0, -2, 0]
                  }}
                  transition={{
                    duration: 6,
                    ease: "easeInOut",
                    repeat: Infinity,
                    delay: 4
                  }}
                  className="absolute bottom-16 left-12 social-icon"
                >
                  <div className="bg-gradient-to-tr from-purple-500 to-pink-500 p-6 rounded-2xl shadow-lg transform rotate-6">
                    {socialIcons.instagram}
                  </div>
                </motion.div>
                
                {/* X (Twitter) Icon */}
                <motion.div 
                  animate={{
                    y: [0, -10, -20, -10, 0],
                    rotate: [0, 2, 0, -2, 0]
                  }}
                  transition={{
                    duration: 6,
                    ease: "easeInOut",
                    repeat: Infinity,
                    delay: 6
                  }}
                  className="absolute bottom-8 right-8 social-icon"
                >
                  <div className="bg-black p-6 rounded-2xl shadow-lg transform -rotate-12">
                    {socialIcons.x}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Powerful Features for Safe Growth
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Everything you need to build your social media presence without risking your accounts
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 bg-bg-light rounded-2xl card-shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
                data-testid={`feature-card-${index}`}
              >
                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-4">{feature.title}</h3>
                <p className="text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8"
          >
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {userAvatars.map((avatar, index) => (
                  <img 
                    key={index}
                    className="w-10 h-10 rounded-full border-2 border-white" 
                    src={avatar}
                    alt={`User avatar ${index + 1}`}
                    data-testid={`avatar-${index}`}
                  />
                ))}
              </div>
              <span className="ml-4 text-text-primary font-semibold" data-testid="text-user-count">Loved by 115+ creators</span>
            </div>
            <div className="flex items-center">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, index) => (
                  <svg key={index} className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20" data-testid={`star-${index}`}>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bg-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center mb-4">
                <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="ml-2 text-xl font-bold">SocialAI</span>
              </div>
              <p className="text-gray-400">
                Grow your social media presence safely with AI-powered automation.
              </p>
            </div>
            
            {/* Product Column */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors" data-testid="footer-link-features">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors" data-testid="footer-link-pricing">Pricing</a></li>
                <li><a href="#roadmap" className="text-gray-400 hover:text-white transition-colors" data-testid="footer-link-roadmap">Roadmap</a></li>
              </ul>
            </div>
            
            {/* Company Column */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors" data-testid="footer-link-about">About</a></li>
                <li><a href="#careers" className="text-gray-400 hover:text-white transition-colors" data-testid="footer-link-careers">Careers</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors" data-testid="footer-link-contact">Contact</a></li>
              </ul>
            </div>
            
            {/* Legal Column */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#privacy" className="text-gray-400 hover:text-white transition-colors" data-testid="footer-link-privacy">Privacy Policy</a></li>
                <li><a href="#terms" className="text-gray-400 hover:text-white transition-colors" data-testid="footer-link-terms">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p data-testid="text-copyright">&copy; 2025 SocialAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
