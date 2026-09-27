import { notFound } from "next/navigation";
import { getPortfolioContent } from "@/lib/contentful";
import { PortfolioLongform } from "@/components/longform/portfolio-longform";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await getPortfolioContent();
  const post = content.posts.find((item) => item.slug === slug && !item.placeholder);

  if (!post) notFound();

  return (
    <PortfolioLongform
      label="Blog"
      title={post.title}
      meta={post.publishedAt}
      excerpt={post.excerpt}
      body={post.body}
      tags={post.tags}
      images={post.heroImage ? [post.heroImage] : []}
    />
  );
}
