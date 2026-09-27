import type {
  PortfolioWork,
  PortfolioHero,
  PortfolioContact,
  PortfolioExperience,
  PortfolioPost,
} from "@/lib/contentful";
import type { XmbCategory, XmbLayoutConfig } from "./types";
import {
  HomeIcon,
  ProjectsIcon,
  ExperienceIcon,
  ContactIcon,
  JournalIcon,
  SettingsIcon,
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
  posts: PortfolioPost[];
  contact: PortfolioContact;
  themeName: string;
  reduceMotion: boolean;
  settingsView: "root" | "theme";
}

/**
 * Helper builder to convert raw portfolio data into modular XMB categories.
 * Adding a new category or sub-option is as simple as adding an object to this array.
 */
export function buildXmbCategories({
  hero,
  workItems,
  experienceItems,
  posts,
  contact,
  themeName,
  reduceMotion,
  settingsView,
}: BuildCategoriesInput): XmbCategory[] {
  const themeItems = [
    {
      id: "settings-back",
      kind: "setting" as const,
      title: "Back to settings",
      subtitle: "Settings",
      description: "Return to the main settings menu.",
      action: "settings-back" as const,
      activationLabel: "Go back",
    },
    {
      id: "theme-midnight",
      kind: "setting" as const,
      title: "Midnight",
      subtitle: themeName === "midnight" ? "Active theme" : "Theme",
      description: "High-contrast monochrome with a quiet blue signal glow.",
      action: "theme" as const,
      actionValue: "midnight",
      selected: themeName === "midnight",
      activationLabel: themeName === "midnight" ? "Active" : "Apply theme",
    },
    {
      id: "theme-aurora",
      kind: "setting" as const,
      title: "Aurora",
      subtitle: themeName === "aurora" ? "Active theme" : "Theme",
      description: "Cool violet and cyan light moving beneath the XMB.",
      action: "theme" as const,
      actionValue: "aurora",
      selected: themeName === "aurora",
      activationLabel: themeName === "aurora" ? "Active" : "Apply theme",
    },
    {
      id: "theme-ember",
      kind: "setting" as const,
      title: "Ember",
      subtitle: themeName === "ember" ? "Active theme" : "Theme",
      description: "A warm amber signal over deep charcoal.",
      action: "theme" as const,
      actionValue: "ember",
      selected: themeName === "ember",
      activationLabel: themeName === "ember" ? "Active" : "Apply theme",
    },
    {
      id: "theme-arctic",
      kind: "setting" as const,
      title: "Arctic",
      subtitle: themeName === "arctic" ? "Active theme" : "Theme",
      description: "Silver-blue tones inspired by the original system interface.",
      action: "theme" as const,
      actionValue: "arctic",
      selected: themeName === "arctic",
      activationLabel: themeName === "arctic" ? "Active" : "Apply theme",
    },
  ];

  return [
    {
      id: "home",
      label: "Home",
      icon: HomeIcon,
      items: [
        {
          id: "hero-intro",
          kind: "home",
          title: "About Me",
          // subtitle: `Hi, I’m ${hero.firstName} ${hero.lastName}.`,
          description: hero.description,
        },
      ],
    },
    {
      id: "projects",
      label: "Projects",
      icon: ProjectsIcon,
      items: workItems.map((w) => ({
        id: `project-${w.slug}`,
        kind: "project",
        title: w.title,
        eyebrow: w.role,
        subtitle: `${w.year} — ${w.note}`,
        description: w.summary,
        body: w.body,
        highlights: w.outcomes,
        tags: w.tags,
        href: w.href,
        detailHref: `/projects/${w.slug}`,
        activationLabel: "View case study",
      })),
    },
    {
      id: "experience",
      label: "Experience",
      icon: ExperienceIcon,
      items: experienceItems.map((e, idx) => ({
        id: `exp-${idx}`,
        kind: "experience",
        title: e.company,
        image: e.image,
        subtitle: `${e.role} · ${e.period}`,
        description: e.description,
        highlights: e.highlights,
        tags: e.tags,
      })),
    },
    {
      id: "journal",
      label: "Journal",
      icon: JournalIcon,
      items: posts.map((post) => ({
        id: `post-${post.slug}`,
        kind: "post",
        title: post.title,
        subtitle: post.publishedAt,
        description: post.excerpt,
        body: post.body,
        tags: post.tags,
        detailHref: post.placeholder ? undefined : `/journal/${post.slug}`,
        activationLabel: post.placeholder ? undefined : "Read article",
      })),
    },
    {
      id: "contact",
      label: "Contact",
      icon: ContactIcon,
      items: [
        {
          id: "contact-email",
          kind: "contact",
          title: "Email",
          subtitle: contact.email,
          description: `Direct contact — ${contact.responseTime}`,
          href: `mailto:${contact.email}`,
        },
        {
          id: "contact-github",
          kind: "contact",
          title: "GitHub",
          subtitle: contact.githubUrl,
          description: "Open profile on GitHub",
          href: contact.githubUrl,
        },
        {
          id: "contact-linkedin",
          kind: "contact",
          title: "LinkedIn",
          subtitle: contact.linkedinUrl,
          description: "Connect on LinkedIn",
          href: contact.linkedinUrl,
        },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      icon: SettingsIcon,
      items: settingsView === "theme" ? themeItems : [
        {
          id: "settings-theme",
          kind: "setting",
          title: "Theme",
          subtitle: themeName.charAt(0).toUpperCase() + themeName.slice(1),
          description: "Choose the colour and ambient-light profile for the XMB.",
          action: "settings-theme",
          activationLabel: "Open themes",
        },
        {
          id: "motion",
          kind: "setting",
          title: "Reduced motion",
          subtitle: reduceMotion ? "On" : "Off",
          description: "Reduce springs, drifting light, and interface movement.",
          action: "motion",
          selected: reduceMotion,
          activationLabel: reduceMotion ? "Turn off" : "Turn on",
        },
      ],
    },
  ];
}
