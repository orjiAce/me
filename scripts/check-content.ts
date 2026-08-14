/**
 * Build gate — runs before `next build` (see package.json). Importing the
 * content modules triggers their module-scope assertions, so duplicate
 * slugs or malformed dates fail the build here with the slug named,
 * whether or not any page imports the content yet.
 */
async function main(): Promise<void> {
  const { projects, spineProjects, undatedWork } = await import(
    "../content/projects"
  );
  const { packages } = await import("../content/packages");
  console.log(
    `content ok — ${projects.length} projects ` +
      `(${spineProjects.length} on the spine, ${undatedWork.length} undated), ` +
      `${packages.length} packages`,
  );
}

main().catch((error: unknown) => {
  console.error(
    `Content check failed: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exit(1);
});
