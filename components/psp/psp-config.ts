import type {
  PortfolioWork,
  PortfolioHero,
  PortfolioContact,
  PortfolioExperience,
} from "@/lib/contentful";
import type { XmbCategory, XmbLayoutConfig } from "./types";
import {
  HomeIcon,
  ProjectsIcon,
  ExperienceIcon,
  ContactIcon,
} from "./xmb-icons";

/**
 * Layout dimensions configuration.
 * Adjusted for higher vertical placement, larger icons, and generous spacing.
 */
export const DEFAULT_XMB_CONFIG: XmbLayoutConfig = {
  crossX: 0.24,        // 24% from left
  crossY: 0.28,        // Moved higher (28% from top, well above halfway line)
  hGap: 180,           // Increased horizontal gap between category icons
  vGap: 64,            // Increased vertical gap between sub-items
  aboveClear: 110,     // Increased clearance above middle strip
  belowClear: 140,     // Increased clearance below middle strip for label & spacing
  iconActiveSize: 84,  // Scaled up active category icon
  iconInactiveSize: 56,// Scaled up inactive category icon
};

export interface BuildCategoriesInput {
  hero: PortfolioHero;
  workItems: PortfolioWork[];
  experienceItems: PortfolioExperience[];
  contact: PortfolioContact;
}

/**
 * Helper builder to convert raw portfolio data into modular XMB categories.
 * Adding a new category or sub-option is as simple as adding an object to this array.
 */
export function buildXmbCategories({
  hero,
  workItems,
  experienceItems,
  contact,
}: BuildCategoriesInput): XmbCategory[] {
  return [
    {
      id: "home",
      label: "Home",
      icon: HomeIcon,
      items: [
        {
          id: "hero-intro",
          title: `${hero.firstName} ${hero.lastName}`,
          subtitle: hero.tagline,
          description: hero.description,
        },
      ],
    },
    {
      id: "projects",
      label: "Projects",
      icon: ProjectsIcon,
      items: workItems.map((w, idx) => ({
        id: `project-${idx}`,
        title: w.title,
        subtitle: `${w.year} — ${w.note}`,
        description: w.summary,
        tags: w.tags,
        href: w.href,
      })),
    },
    {
      id: "experience",
      label: "Experience",
      icon: ExperienceIcon,
      items: experienceItems.map((e, idx) => ({
        id: `exp-${idx}`,
        title: e.company,
        subtitle: `${e.role} · ${e.period}`,
        description: e.description,
        tags: e.tags,
      })),
    },
    {
      id: "contact",
      label: "Contact",
      icon: ContactIcon,
      items: [
        {
          id: "contact-email",
          title: "Email",
          subtitle: contact.email,
          description: `Direct contact — ${contact.responseTime}`,
          href: `mailto:${contact.email}`,
        },
        {
          id: "contact-github",
          title: "GitHub",
          subtitle: contact.githubUrl,
          description: "Open profile on GitHub",
          href: contact.githubUrl,
        },
        {
          id: "contact-linkedin",
          title: "LinkedIn",
          subtitle: contact.linkedinUrl,
          description: "Connect on LinkedIn",
          href: contact.linkedinUrl,
        },
      ],
    },
  ];
}
