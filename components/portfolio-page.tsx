"use client";

import { useEffect, useState } from "react";
import type { PortfolioWork, PortfolioHero, PortfolioContact, PortfolioExperience } from "@/lib/contentful";
import { applyThemeVariables, themes, type ThemeName } from "@/lib/theme";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { HeroSection } from "@/components/sections/hero-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { ContactSection } from "@/components/sections/contact-section";
import { ProjectModal } from "@/components/ui/project-modal";

export default function PortfolioPage({ workItems, hero, contact, experienceItems }: { workItems: PortfolioWork[]; hero: PortfolioHero; contact: PortfolioContact; experienceItems: PortfolioExperience[] }) {
  const [activeProject, setActiveProject] = useState<PortfolioWork | null>(null);
  const [activeSection, setActiveSection] = useState("");
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["projects", "experience", "contact"];
      let current = "";
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200) {
            current = section;
          }
        }
      }
      
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
        current = "contact";
      }

      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [themeName, setThemeName] = useState<ThemeName>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = window.localStorage.getItem("portfolio-theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      setThemeName(storedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setThemeName("dark");
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      applyThemeVariables(document.documentElement.style, themeName);
      document.documentElement.style.colorScheme = themeName;
      window.localStorage.setItem("portfolio-theme", themeName);
    }
  }, [themeName, mounted]);

  const theme = themes[themeName];

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-50 origin-left opacity-80"
        style={{ scaleX, backgroundColor: theme.accent }}
      />
      
      <SiteHeader 
        activeSection={activeSection}
        themeName={themeName}
        setThemeName={setThemeName}
        accentColor={theme.accent}
      />

      <HeroSection accentColor={theme.accent} heroData={hero} />
      
      <ProjectsSection 
        workItems={workItems} 
        themeAccent={theme.accent} 
        setActiveProject={setActiveProject} 
      />

      <ExperienceSection themeAccent={theme.accent} experienceItems={experienceItems} />
      
      <ContactSection themeAccent={theme.accent} contactData={contact} />

      <AnimatePresence>
        {activeProject && (
          <ProjectModal item={activeProject} accent={theme.accent} onClose={() => setActiveProject(null)} />
        )}
      </AnimatePresence>

      <SiteFooter />
    </div>
  );
}