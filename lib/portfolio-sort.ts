/**
 * Returns the year that should determine a portfolio item's recency.
 * A range such as "2022-2024" is treated as 2024.
 */
export function getPortfolioEndYear(value: string): number | null {
  const years = value.match(/\b(?:19|20)\d{2}\b/g);
  if (!years?.length) return null;
  return Number(years.at(-1));
}

export function sortByMostRecentYear<T extends { year: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const aYear = getPortfolioEndYear(a.year);
    const bYear = getPortfolioEndYear(b.year);

    if (aYear === null && bYear === null) return 0;
    if (aYear === null) return 1;
    if (bYear === null) return -1;
    return bYear - aYear;
  });
}
