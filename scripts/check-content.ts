/**
 * Build gate — runs before `next build` (see package.json). Importing the
 * content modules triggers their module-scope assertions, so duplicate
 * slugs or malformed dates fail the build here with the slug named,
 * whether or not any page imports the content yet.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";

async function main(): Promise<void> {
  const { projects, spineProjects, undatedWork } = await import(
    "../content/projects"
  );
  const { packages } = await import("../content/packages");

  // caseStudy: true asserts "an MDX body exists" (edge case #3) — verify.
  const caseStudies = projects.filter((p) => p.caseStudy);
  for (const p of caseStudies) {
    const path = join(process.cwd(), "content", "case-studies", `${p.slug}.mdx`);
    if (!existsSync(path)) {
      throw new Error(
        `Project "${p.slug}" has caseStudy: true but no content/case-studies/${p.slug}.mdx body.`,
      );
    }
  }

  // A cover path that 404s would break edge case #1's guarantee silently.
  for (const p of projects) {
    if (p.cover && !existsSync(join(process.cwd(), "public", p.cover.src))) {
      throw new Error(
        `Project "${p.slug}" cover ${p.cover.src} does not exist under public/.`,
      );
    }
  }

  console.log(
    `content ok — ${projects.length} projects ` +
      `(${spineProjects.length} on the spine, ${undatedWork.length} undated, ` +
      `${caseStudies.length} case studies), ${packages.length} packages`,
  );
}

main().catch((error: unknown) => {
  console.error(
    `Content check failed: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exit(1);
});
