import type {
  PortfolioWork,
  PortfolioHero,
  PortfolioContact,
  PortfolioExperience,
  PortfolioPost,
  PortfolioCollection,
} from "@/lib/contentful";
import type { XmbCategory, XmbItem, XmbLayoutConfig } from "./types";
import {
  HomeIcon,
  ProjectsIcon,
  ExperienceIcon,
  ContactIcon,
  BlogIcon,
  SettingsIcon,
} from "./xmb-icons";
import { PSP_THEME_NAMES, PSP_THEMES, type PspThemeName } from "./psp-themes";
import { getCollectionView } from "@/lib/portfolio-collections";

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
  themeName: PspThemeName;
  reduceMotion: boolean;
  settingsView: "root" | "theme";
  collections: PortfolioCollection[];
  openCollectionId: string | null;
}

function projectItem(work: PortfolioWork): XmbItem {
  return {
    id: `project-${work.slug}`,
    kind: "project",
    title: work.title,
    eyebrow: work.role,
    subtitle: [work.year, work.note].filter(Boolean).join(" — "),
    description: work.summary,
    body: work.body,
    image: work.image,
    gallery: work.gallery,
    highlights: work.outcomes,
    tags: work.tags,
    href: work.href,
    links: work.links,
    detailHref: `/projects/${work.slug}`,
    activationLabel: "View more",
  };
}

function postItem(post: PortfolioPost): XmbItem {
  return {
    id: `post-${post.slug}`,
    kind: "post",
    title: post.title,
    subtitle: post.publishedAt,
    description: post.excerpt,
    body: post.body,
    tags: post.tags,
    detailHref: post.placeholder ? undefined : `/blog/${post.slug}`,
    activationLabel: post.placeholder ? undefined : "Read article",
  };
}

function collectionItems<T extends { collectionId?: string }>(
  section: "projects" | "blog",
  collections: PortfolioCollection[],
  openCollectionId: string | null,
  entries: T[],
  mapEntry: (entry: T) => XmbItem,
): XmbItem[] {
  const { openCollection, contained, folders, ungrouped } = getCollectionView(
    section,
    collections,
    openCollectionId,
    entries,
  );

  if (openCollection) {
    return [
      {
        id: `collection-back-${openCollection.id}`,
        kind: "folder",
        title: `Back to ${section === "projects" ? "Projects" : "Blog"}`,
        subtitle: openCollection.title,
        description: openCollection.description,
        action: "collection-back",
        activationLabel: "Go back",
      },
      ...contained.map(mapEntry),
    ];
  }

  const folderItems: XmbItem[] = folders.map(({ collection, count }) => ({
      id: `collection-${collection.id}`,
      kind: "folder",
      title: collection.title,
      subtitle: `${count} ${section === "projects" ? (count === 1 ? "project" : "projects") : (count === 1 ? "post" : "posts")}`,
      description: collection.description,
      image: collection.image,
      action: "open-collection",
      actionValue: collection.id,
      activationLabel: "Open folder",
  }));

  return [...folderItems, ...ungrouped.map(mapEntry)];
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
  collections,
  openCollectionId,
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
    ...PSP_THEME_NAMES.map((name) => ({
      id: `theme-${name}`,
      kind: "setting" as const,
      title: PSP_THEMES[name].label,
      subtitle: themeName === name ? "Active theme" : "Theme",
      description: PSP_THEMES[name].description,
      fontFamily: PSP_THEMES[name].font,
      action: "theme" as const,
      actionValue: name,
      selected: themeName === name,
      activationLabel: themeName === name ? "Active" : "Apply theme",
    })),
  ];

  const categories: XmbCategory[] = [
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
          href: hero.cvUrl,
          downloadName: hero.cvUrl ? "Affan-Khan-CV.pdf" : undefined,
          activationLabel: hero.cvUrl ? "Download CV" : undefined,
        },
      ],
    },
    {
      id: "projects",
      label: "Projects",
      icon: ProjectsIcon,
      items: collectionItems("projects", collections, openCollectionId, workItems, projectItem),
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
      id: "blog",
      label: "Blog",
      icon: BlogIcon,
      items: collectionItems("blog", collections, openCollectionId, posts, postItem),
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
          subtitle: PSP_THEMES[themeName].label,
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

  return categories.filter((category) => category.id !== "projects" || category.items.length > 0);
}
