import { spawn } from 'node:child_process';

const mode = process.argv[2] ?? 'storybook';

const map = {
  stencil: ['run', 'start:stencil'],
  storybook: ['run', 'start:storybook'],
};

const args = map[mode];

if (!args) {
  console.error(`Modo no soportado: ${mode}`);
  console.error('Usa: pnpm run start stencil | pnpm run start storybook');
  process.exit(1);
}

const child = spawn('pnpm', args, {
  stdio: 'inherit',
  shell: true,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
