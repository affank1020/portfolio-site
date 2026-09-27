import assert from "node:assert/strict";
import test from "node:test";

import { getPortfolioEndYear, sortByMostRecentYear } from "../lib/portfolio-sort.ts";

test("uses a single year as the item's recency", () => {
  assert.equal(getPortfolioEndYear("2025"), 2025);
});

test("uses the second year in a year range", () => {
  assert.equal(getPortfolioEndYear("2022-2024"), 2024);
  assert.equal(getPortfolioEndYear("2023 – 2025"), 2025);
});

test("returns null when no supported year is present", () => {
  assert.equal(getPortfolioEndYear("Coming soon"), null);
  assert.equal(getPortfolioEndYear(""), null);
});

test("orders projects by their end year, newest first", () => {
  const projects = [
    { title: "Older range", year: "2020-2022" },
    { title: "Newest single", year: "2025" },
    { title: "Newest range", year: "2023-2026" },
    { title: "Recent single", year: "2024" },
  ];

  assert.deepEqual(
    sortByMostRecentYear(projects).map((project) => project.title),
    ["Newest range", "Newest single", "Recent single", "Older range"],
  );
});

test("keeps equal years stable and puts undated projects last", () => {
  const projects = [
    { title: "First 2024 project", year: "2024" },
    { title: "Undated", year: "TBC" },
    { title: "Second 2024 project", year: "2022-2024" },
  ];

  assert.deepEqual(
    sortByMostRecentYear(projects).map((project) => project.title),
    ["First 2024 project", "Second 2024 project", "Undated"],
  );
});
