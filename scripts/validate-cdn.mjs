import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const CDN_BASE_JS = 'https://cdn.jsdelivr.net/npm/@inclusiv-ds';
const VERSIONS = {
  button: '0.1.0',
  input: '0.1.0',
  tokens: '0.1.0',
};

const CDN_URLS = [
  `${CDN_BASE_JS}/button@${VERSIONS.button}/components/iv-button.js`,
  `${CDN_BASE_JS}/input@${VERSIONS.input}/components/iv-input.js`,
  `${CDN_BASE_JS}/tokens@${VERSIONS.tokens}/src/tokens.css`,
];

console.log('🔍 Validando URLs CDN...\n');

let hasErrors = false;

for (const url of CDN_URLS) {
  console.log(`📦 Verificando: ${url}`);
  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (response.ok) {
      console.log(`   ✅ OK (${response.status})`);
    } else {
      console.log(`   ❌ ERROR (${response.status})`);
      hasErrors = true;
    }
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
    hasErrors = true;
  }
}

console.log('\n✨ Validación CDN completada');

if (hasErrors) {
  console.log('\n⚠️  Algunas URLs fallaron. Revisa los errores arriba.');
  process.exit(1);
} else {
  console.log('\n✅ Todas las URLs CDN están disponibles.');
  process.exit(0);
}
