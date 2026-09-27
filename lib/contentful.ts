export type PortfolioWork = {
  title: string;
  slug: string;
  year: string;
  summary: string;
  body?: string;
  role?: string;
  outcomes: string[];
  tags: string[];
  note: string;
  href: string;
  repositoryUrl?: string;
  liveUrl?: string;
  image?: string;
  gallery?: string[];
};

export type PortfolioExperience = {
  company: string;
  role: string;
  period: string;
  description: string;
  highlights: string[];
  tags: string[];
  accent: string;
  image?: string;
};

export type PortfolioPost = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  publishedAt: string;
  tags: string[];
  heroImage?: string;
  placeholder?: boolean;
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
  fields?: Record<string, unknown>;
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
  tagline: "",
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
    highlights: ["Shipped production-facing tooling", "Worked across distributed services"],
    tags: ["Java", "AWS", "Distributed Systems"],
    accent: "#ff9900",
    image: "/amazon.jpg",
  },
  {
    company: "EA",
    role: "Software Engineering Intern",
    period: "Summer 2024",
    description: "Developed gameplay systems and internal development tools. Contributed to production pipelines used across multiple studio teams.",
    highlights: ["Built internal development tools", "Contributed to shared production pipelines"],
    tags: ["C++", "Python", "Game Dev"],
    accent: "#0b4ea2",
    image: "/electronic_arts.jpg",
  },
];

const fallbackWork: PortfolioWork[] = [
  {
    year: "2024",
    title: "Conduit",
    slug: "conduit",
    summary: "A zero-dependency pub/sub broker with a single-binary footprint and aggressive throughput goals.",
    body: "Conduit explores what a compact message broker can look like when deployment simplicity is treated as a core product constraint. The work focuses on protocol design, predictable performance, and an operational model that stays understandable under load.",
    role: "Independent project",
    outcomes: ["Single-binary deployment", "Zero runtime dependencies", "Throughput-oriented architecture"],
    tags: ["Rust", "TCP", "Systems"],
    note: "open source · 3.2k ★",
    href: "#",
    image: "/globe.svg",
  },
  {
    year: "2024",
    title: "Patchwork",
    slug: "patchwork",
    summary: "Schema migration tooling for teams that want safer deploys and fewer surprises in production.",
    body: "Patchwork is a workflow for planning and applying database changes with more context than a raw migration file can provide. It is designed around reviewability, explicit rollout stages, and safer recovery when production does not behave like a local environment.",
    role: "Independent project",
    outcomes: ["Reviewable migration plans", "Safer staged rollouts", "Clearer recovery paths"],
    tags: ["Go", "PostgreSQL", "gRPC"],
    note: "used in production at 4 companies",
    href: "#",
    image: "/window.svg",
  },
];

const fallbackPosts: PortfolioPost[] = [
  {
    title: "Writing, soon",
    slug: "writing-soon",
    excerpt: "Longer notes on software, product decisions, and the systems behind the work will live here.",
    body: "This journal is ready for its first entry. Publish a blogPost in Contentful and it will appear here automatically.",
    publishedAt: "Coming soon",
    tags: ["Journal"],
    placeholder: true,
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function stringField(fields: Record<string, unknown> | undefined, key: string) {
  const value = fields?.[key];
  return typeof value === "string" ? value : undefined;
}

function stringArrayField(fields: Record<string, unknown> | undefined, key: string) {
  const value = fields?.[key];
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  if (typeof value === "string") return value.split(",").map(i => i.trim()).filter(Boolean);
  return undefined;
}

function richTextField(fields: Record<string, unknown> | undefined, key: string) {
  const value = fields?.[key];
  if (typeof value === "string") return value;

  const collectText = (node: unknown): string => {
    if (!isRecord(node)) return "";
    if (typeof node.value === "string") return node.value;
    if (!Array.isArray(node.content)) return "";
    const content = node.content.map(collectText).filter(Boolean).join("");
    return node.nodeType === "paragraph" || node.nodeType === "heading-2" ? `${content}\n\n` : content;
  };

  const result = collectText(value).trim();
  return result || undefined;
}

function getAssetUrl(fields: Record<string, unknown> | undefined, key: string, assets: ContentfulAsset[]): string | undefined {
  const field = fields?.[key];
  const sys = isRecord(field) && isRecord(field.sys) ? field.sys : undefined;
  const linkId = typeof sys?.id === "string" ? sys.id : undefined;
  if (!linkId) return undefined;
  const asset = assets.find(a => a.sys.id === linkId);
  const url = asset?.fields?.file?.url;
  return url ? (url.startsWith("//") ? `https:${url}` : url) : undefined;
}

function getAssetUrls(fields: Record<string, unknown> | undefined, key: string, assets: ContentfulAsset[]): string[] | undefined {
  const links = fields?.[key];
  if (!Array.isArray(links)) return undefined;
  
  const urls: string[] = [];
  for (const link of links) {
    const sys = isRecord(link) && isRecord(link.sys) ? link.sys : undefined;
    const linkId = typeof sys?.id === "string" ? sys.id : undefined;
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
    description: richTextField(fields, "description") ?? fallbackHero.description,
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
    highlights: stringArrayField(fields, "highlights") ?? [],
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
    slug: stringField(fields, "slug") ?? slugify(title),
    year: stringField(fields, "year") ?? "2024",
    summary: stringField(fields, "summary") ?? "",
    body: richTextField(fields, "body") ?? stringField(fields, "longDescription"),
    role: stringField(fields, "role"),
    outcomes: stringArrayField(fields, "outcomes") ?? [],
    tags: stringArrayField(fields, "tags") ?? [],
    note: stringField(fields, "note") ?? "",
    href: stringField(fields, "href") ?? "#",
    repositoryUrl: stringField(fields, "repositoryUrl"),
    liveUrl: stringField(fields, "liveUrl"),
    image: getAssetUrl(fields, "image", assets),
    gallery: getAssetUrls(fields, "gallery", assets),
  };
}

function mapPostEntry(entry: ContentfulEntry, assets: ContentfulAsset[]): PortfolioPost | null {
  const fields = entry.fields;
  const title = stringField(fields, "title");
  if (!title) return null;

  return {
    title,
    slug: stringField(fields, "slug") ?? slugify(title),
    excerpt: stringField(fields, "excerpt") ?? stringField(fields, "summary") ?? "",
    body: richTextField(fields, "body") ?? "",
    publishedAt: stringField(fields, "publishedAt") ?? "",
    tags: stringArrayField(fields, "tags") ?? [],
    heroImage: getAssetUrl(fields, "heroImage", assets),
  };
}

export async function getPortfolioContent() {
  const [heroRes, contactRes, workRes, expRes, postsRes] = await Promise.all([
    getContentfulData("portfolioHero"),
    getContentfulData("portfolioContact"),
    getContentfulData("workItem"),
    getContentfulData("experienceItem"),
    getContentfulData("blogPost"),
  ]);

  const heroItem = heroRes?.items?.[0] ? mapHeroEntry(heroRes.items[0]) : null;
  const contactItem = contactRes?.items?.[0] ? mapContactEntry(contactRes.items[0]) : null;
  
  const workItems = (workRes?.items ?? [])
    .map(entry => mapWorkEntry(entry, workRes?.includes?.Asset ?? []))
    .filter((item): item is PortfolioWork => Boolean(item));
    
  const experienceItems = (expRes?.items ?? [])
    .map(entry => mapExperienceEntry(entry, expRes?.includes?.Asset ?? []))
    .filter((item): item is PortfolioExperience => Boolean(item));

  const posts = (postsRes?.items ?? [])
    .map(entry => mapPostEntry(entry, postsRes?.includes?.Asset ?? []))
    .filter((item): item is PortfolioPost => Boolean(item));

  return {
    hero: heroItem ?? fallbackHero,
    contact: contactItem ?? fallbackContact,
    workItems: workItems.length > 0 ? workItems : fallbackWork,
    experience: experienceItems.length > 0 ? experienceItems : fallbackExperience,
    posts: posts.length > 0 ? posts : fallbackPosts,
  };
}

export function getFallbackPortfolioContent() {
  return {
    hero: fallbackHero,
    contact: fallbackContact,
    workItems: fallbackWork,
    experience: fallbackExperience,
    posts: fallbackPosts,
  };
}
