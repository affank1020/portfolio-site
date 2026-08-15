"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ThemeName } from "@/lib/theme";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface SiteHeaderProps {
  activeSection: string;
  themeName: ThemeName;
  setThemeName: React.Dispatch<React.SetStateAction<ThemeName>>;
  accentColor: string;
}

export function SiteHeader({ activeSection, themeName, setThemeName, accentColor }: SiteHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="fixed left-0 right-0 top-0 z-30 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <span className="text-sm font-medium text-foreground/60" style={{ fontFamily: "'Geist Mono', monospace" }}>
          affan.khan
        </span>
        
        <div className="flex items-center gap-4">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = activeSection === item.label.toLowerCase();
              return (
                <a 
                  key={item.label} 
                  href={item.href} 
                  className={`text-sm transition-colors duration-150 ${isActive ? "text-foreground font-medium" : "text-foreground/50 hover:text-foreground"}`}
                  style={isActive ? { color: accentColor } : {}}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
          
          <ThemeToggle themeName={themeName} onToggle={() => setThemeName((current) => (current === "light" ? "dark" : "light"))} />

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-1 text-foreground/70 hover:text-foreground transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isMobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-14 left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border/20 shadow-lg md:hidden flex flex-col py-4 px-6 gap-4"
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.label.toLowerCase();
              return (
                <a 
                  key={item.label} 
                  href={item.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-base transition-colors duration-150 ${isActive ? "text-foreground font-medium" : "text-foreground/60 hover:text-foreground"}`}
                  style={isActive ? { color: accentColor } : {}}
                >
                  {item.label}
                </a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
