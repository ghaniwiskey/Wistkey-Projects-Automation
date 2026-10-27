// Test Manager CLI.
//   node test-manager/cli.mjs app [--port 7358] [--open]   start the web app (npm run tm)
//   node test-manager/cli.mjs new <slug> --url <baseUrl> [--name "App"] [--env staging] [--prefix APP] [--read-only]
//                                                          scaffold projects/<slug> from projects/_template (npm run tm:new -- ...)
//   node test-manager/cli.mjs report                       rebuild reports/index.html (npm run tm:report)
//   node test-manager/cli.mjs lint                         check test cases, POM specs, bugs, plans (npm run tm:lint)
import { projectSlugs, rel } from './lib/workspace.mjs';

const [cmd = 'app', ...rest] = process.argv.slice(2);
const args = {};
for (let i = 0; i < rest.length; i++) {
  if (!rest[i].startsWith('--')) continue;
  const k = rest[i].slice(2);
  args[k] = rest[i + 1] && !rest[i + 1].startsWith('--') ? rest[++i] : true;
}

if (cmd === 'app') {
  const { startServer } = await import('./server.mjs');
  await startServer({ port: Number(args.port || process.env.QA_APP_PORT || 7358), open: !!args.open });
} else if (cmd === 'new') {
  const slug = rest.find((x) => !x.startsWith('--') && !Object.values(args).includes(x));
  if (!slug || !args.url) { console.log('Usage: node test-manager/cli.mjs new <slug> --url <baseUrl> [--name "App"] [--env staging] [--prefix APP] [--read-only]'); process.exit(1); }
  const { createProject } = await import('./lib/store.mjs');
  try {
    const r = createProject({ slug, url: args.url, name: args.name, env: args.env, prefix: args.prefix, readOnly: !!args['read-only'] });
    console.log(`Created projects/${r.slug} (test IDs ${r.prefix}-001..., env ${r.env}, writes ${r.allowWrites ? 'allowed' : 'skipped'})`);
    console.log(`Run its smoke test: npx playwright test --project=${r.slug}`);
  } catch (e) { console.error(e.message); process.exit(1); }
} else if (cmd === 'report') {
  const { buildHtmlReport } = await import('./lib/html-report.mjs');
  const { buildMissingRunReports } = await import('./lib/run-report.mjs');
  buildMissingRunReports();
  const r = buildHtmlReport();
  console.log(`Overview report: ${rel(r.out)} (${r.kb} KB, ${r.projects} project(s))`);
} else if (cmd === 'lint') {
  const { lintSlug } = await import('./lib/lint.mjs');
  let errors = 0;
  for (const slug of projectSlugs()) {
    const { E, W } = lintSlug(slug);
    errors += E.length;
    console.log(`${slug}: ${E.length} error(s), ${W.length} warning(s)`);
    for (const e of E) console.log(`  ERROR ${e}`);
    for (const w of W) console.log(`  warn  ${w}`);
  }
  process.exit(errors ? 1 : 0);
} else {
  console.log('Usage: node test-manager/cli.mjs <app|new|report|lint>');
  process.exit(1);
}
