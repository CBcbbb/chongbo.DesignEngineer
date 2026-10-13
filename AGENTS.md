<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Deployments (Vercel)

- Every push to `main` creates one production deployment, and a push to `preview` creates a preview deployment. Pushes to any other branch create none: `vercel.json` sets `git.deploymentEnabled` so only those two deploy.
- Batch commits and push once. Don't push after every small commit; finish a set of changes, check them locally (`npm run build`), then push them together.
- Don't push empty commits or click Redeploy just to retry. If a deployment fails, read the build log first.
- The project is on a Vercel Pro trial team until 26 October 2026, then falls back to Hobby (100 deployments a day). If a push is rate limited, wait rather than retrying.
