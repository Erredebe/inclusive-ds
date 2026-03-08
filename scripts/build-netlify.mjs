import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execSync } from 'node:child_process';

const root = resolve(process.cwd());
const outDir = join(root, 'netlify-dist');
const playgroundDist = join(root, 'apps', 'stencil-playground', 'dist');
const storybookDist = join(root, 'apps', 'storybook', 'storybook-static');

const run = (cmd) => {
  execSync(cmd, { stdio: 'inherit', cwd: root });
};

rmSync(outDir, { recursive: true, force: true });

run('pnpm --filter @inclusiv-ds/button build');
run('pnpm --filter @inclusiv-ds/input build');
run('pnpm --filter @inclusiv-ds/stencil-playground build');
run('pnpm --filter @inclusiv-ds/storybook build:storybook');

cpSync(playgroundDist, outDir, { recursive: true });
mkdirSync(join(outDir, 'storybook'), { recursive: true });
cpSync(storybookDist, join(outDir, 'storybook'), { recursive: true });

writeFileSync(
  join(outDir, '_redirects'),
  ['/storybook /storybook/index.html 200', '/storybook/* /storybook/index.html 200', ''].join('\n'),
  'utf8',
);
