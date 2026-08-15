export type PortfolioWork = {
  title: string;
  year: string;
  summary: string;
  tags: string[];
  note: string;
  href: string;
  image?: string;
  gallery?: string[];
};

export type PortfolioExperience = {
  company: string;
  role: string;
  period: string;
  description: string;
  tags: string[];
  accent: string;
  image?: string;
};

export type PortfolioHero = {
  firstName: string;
  lastName: string;
  tagline: string;
  description: string;
};

export type PortfolioContact = {
  email: string;
  responseTime: string;
  githubUrl: string;
  linkedinUrl: string;
};

type ContentfulEntry = {
  sys?: { id?: string; contentType?: { sys?: { id?: string } } };
  fields?: Record<string, any>;
};

type ContentfulAsset = {
  sys: { id: string };
  fields: { file?: { url?: string } };
};

type ContentfulResponse = {
  items?: ContentfulEntry[];
  includes?: { Asset?: ContentfulAsset[] };
};

type CollectionOptions = {
  spaceId: string;
  accessToken: string;
  contentType: string;
};

const fallbackHero: PortfolioHero = {
  firstName: "Affan",
  lastName: "Khan.",
  tagline: "Creative portfolio",
  description: "I build digital experiences with a strong point of view, then connect the content layer so the site stays alive.",
};

const fallbackContact: PortfolioContact = {
  email: "hello@example.com",
  responseTime: "Response time usually same day.",
  githubUrl: "https://github.com/",
  linkedinUrl: "https://linkedin.com/",
};

const fallbackExperience: PortfolioExperience[] = [
  {
    company: "Amazon",
    role: "Software Engineering Intern",
    period: "Summer 2025",
    description: "Built internal tooling and services at scale. Worked within a distributed systems team, shipping features that impacted millions of users.",
    tags: ["Java", "AWS", "Distributed Systems"],
    accent: "#ff9900",
    image: "/amazon.jpg",
  },
  {
    company: "EA",
    role: "Software Engineering Intern",
    period: "Summer 2024",
    description: "Developed gameplay systems and internal development tools. Contributed to production pipelines used across multiple studio teams.",
    tags: ["C++", "Python", "Game Dev"],
    accent: "#0b4ea2",
    image: "/electronic_arts.jpg",
  },
];

const fallbackWork: PortfolioWork[] = [
  {
    year: "2024",
    title: "Conduit",
    summary: "A zero-dependency pub/sub broker with a single-binary footprint and aggressive throughput goals.",
    tags: ["Rust", "TCP", "Systems"],
    note: "open source · 3.2k ★",
    href: "#",
    image: "/globe.svg",
  },
  {
    year: "2024",
    title: "Patchwork",
    summary: "Schema migration tooling for teams that want safer deploys and fewer surprises in production.",
    tags: ["Go", "PostgreSQL", "gRPC"],
    note: "used in production at 4 companies",
    href: "#",
    image: "/window.svg",
  },
];

function stringField(fields: Record<string, any> | undefined, key: string) {
  const value = fields?.[key];
  return typeof value === "string" ? value : undefined;
}

function stringArrayField(fields: Record<string, any> | undefined, key: string) {
  const value = fields?.[key];
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  if (typeof value === "string") return value.split(",").map(i => i.trim()).filter(Boolean);
  return undefined;
}

function getAssetUrl(fields: Record<string, any> | undefined, key: string, assets: ContentfulAsset[]): string | undefined {
  const linkId = fields?.[key]?.sys?.id;
  if (!linkId) return undefined;
  const asset = assets.find(a => a.sys.id === linkId);
  const url = asset?.fields?.file?.url;
  return url ? (url.startsWith("//") ? `https:${url}` : url) : undefined;
}

function getAssetUrls(fields: Record<string, any> | undefined, key: string, assets: ContentfulAsset[]): string[] | undefined {
  const links = fields?.[key];
  if (!Array.isArray(links)) return undefined;
  
  const urls: string[] = [];
  for (const link of links) {
    const linkId = link?.sys?.id;
    if (linkId) {
      const asset = assets.find(a => a.sys.id === linkId);
      const url = asset?.fields?.file?.url;
      if (url) urls.push(url.startsWith("//") ? `https:${url}` : url);
    }
  }
  return urls.length > 0 ? urls : undefined;
}

function getCollectionUrl({ spaceId, accessToken, contentType }: CollectionOptions) {
  const params = new URLSearchParams({
    access_token: accessToken,
    content_type: contentType,
    order: "-sys.createdAt",
  });
  return `https://cdn.contentful.com/spaces/${spaceId}/entries?${params.toString()}`;
}

async function getContentfulData(contentType: string): Promise<ContentfulResponse | null> {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_DELIVERY_TOKEN;

  if (!spaceId || !accessToken) return null;

  try {
    const response = await fetch(getCollectionUrl({ spaceId, accessToken, contentType }), {
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

function mapHeroEntry(entry: ContentfulEntry): PortfolioHero | null {
  const fields = entry.fields;
  if (!fields) return null;
  return {
    firstName: stringField(fields, "firstName") ?? fallbackHero.firstName,
    lastName: stringField(fields, "lastName") ?? fallbackHero.lastName,
    tagline: stringField(fields, "tagline") ?? fallbackHero.tagline,
    description: stringField(fields, "description") ?? fallbackHero.description,
  };
}

function mapContactEntry(entry: ContentfulEntry): PortfolioContact | null {
  const fields = entry.fields;
  if (!fields) return null;
  return {
    email: stringField(fields, "email") ?? fallbackContact.email,
    responseTime: stringField(fields, "responseTime") ?? fallbackContact.responseTime,
    githubUrl: stringField(fields, "githubUrl") ?? fallbackContact.githubUrl,
    linkedinUrl: stringField(fields, "linkedinUrl") ?? fallbackContact.linkedinUrl,
  };
}

function mapExperienceEntry(entry: ContentfulEntry, assets: ContentfulAsset[]): PortfolioExperience | null {
  const fields = entry.fields;
  const company = stringField(fields, "company");
  if (!company) return null;
  return {
    company,
    role: stringField(fields, "role") ?? "Role",
    period: stringField(fields, "period") ?? "Period",
    description: stringField(fields, "description") ?? "",
    tags: stringArrayField(fields, "tags") ?? [],
    accent: stringField(fields, "accent") ?? "#ffffff",
    image: getAssetUrl(fields, "image", assets),
  };
}

function mapWorkEntry(entry: ContentfulEntry, assets: ContentfulAsset[]): PortfolioWork | null {
  const fields = entry.fields;
  const title = stringField(fields, "title");
  if (!title) return null;
  return {
    title,
    year: stringField(fields, "year") ?? "2024",
    summary: stringField(fields, "summary") ?? "",
    tags: stringArrayField(fields, "tags") ?? [],
    note: stringField(fields, "note") ?? "",
    href: stringField(fields, "href") ?? "#",
    image: getAssetUrl(fields, "image", assets),
    gallery: getAssetUrls(fields, "gallery", assets),
  };
}

export async function getPortfolioContent() {
  const [heroRes, contactRes, workRes, expRes] = await Promise.all([
    getContentfulData("portfolioHero"),
    getContentfulData("portfolioContact"),
    getContentfulData("workItem"),
    getContentfulData("experienceItem"),
  ]);

  const heroItem = heroRes?.items?.[0] ? mapHeroEntry(heroRes.items[0]) : null;
  const contactItem = contactRes?.items?.[0] ? mapContactEntry(contactRes.items[0]) : null;
  
  const workItems = (workRes?.items ?? [])
    .map(entry => mapWorkEntry(entry, workRes?.includes?.Asset ?? []))
    .filter((item): item is PortfolioWork => Boolean(item));
    
  const experienceItems = (expRes?.items ?? [])
    .map(entry => mapExperienceEntry(entry, expRes?.includes?.Asset ?? []))
    .filter((item): item is PortfolioExperience => Boolean(item));

  return {
    hero: heroItem ?? fallbackHero,
    contact: contactItem ?? fallbackContact,
    workItems: workItems.length > 0 ? workItems : fallbackWork,
    experience: experienceItems.length > 0 ? experienceItems : fallbackExperience,
  };
}

export function getFallbackPortfolioContent() {
  return {
    hero: fallbackHero,
    contact: fallbackContact,
    workItems: fallbackWork,
    experience: fallbackExperience,
  };
}