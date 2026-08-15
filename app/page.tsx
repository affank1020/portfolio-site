import { getFallbackPortfolioContent, getPortfolioContent } from "@/lib/contentful";
import PortfolioPage from "@/components/portfolio-page";

export default async function Home() {
  const content = await getPortfolioContent();
  const fallback = getFallbackPortfolioContent();

  return (
    <PortfolioPage
      hero={content.hero}
      contact={content.contact}
      experienceItems={content.experience}
      workItems={content.workItems}
    />
  );
}
