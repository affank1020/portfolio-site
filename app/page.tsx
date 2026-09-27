import { getPortfolioContent } from "@/lib/contentful";
import PortfolioPage from "@/components/portfolio-page";

export default async function Home() {
  const content = await getPortfolioContent();
  return (
    <PortfolioPage
      hero={content.hero}
      contact={content.contact}
      experienceItems={content.experience}
      workItems={content.workItems}
      posts={content.posts}
      collections={content.collections}
    />
  );
}
