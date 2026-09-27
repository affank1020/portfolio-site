import { notFound } from "next/navigation";
import { getPortfolioContent } from "@/lib/contentful";
import { PortfolioLongform } from "@/components/longform/portfolio-longform";

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await getPortfolioContent();
  const project = content.workItems.find((item) => item.slug === slug);

  if (!project) notFound();

  const links = [
    project.liveUrl ? { label: "Open project", href: project.liveUrl } : null,
    project.repositoryUrl ? { label: "View repository", href: project.repositoryUrl } : null,
    project.href && project.href !== "#" ? { label: "Project link", href: project.href } : null,
  ].filter((link): link is { label: string; href: string } => Boolean(link));

  return (
    <PortfolioLongform
      label="Case study"
      title={project.title}
      meta={[project.role, project.year, project.note].filter(Boolean).join(" · ")}
      excerpt={project.summary}
      body={project.body || project.summary}
      tags={project.tags}
      highlights={project.outcomes}
      images={project.gallery}
      links={links}
    />
  );
}
