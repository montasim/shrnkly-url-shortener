import { readFile } from 'node:fs/promises';

const manifestPath = '.next/server/middleware.js.nft.json';
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const nativeAddons = manifest.files.filter((file) => file.endsWith('.node'));

if (nativeAddons.length > 0) {
    console.error('Unsupported native addons found in Next.js middleware:');
    for (const addon of nativeAddons) {
        console.error(`- ${addon}`);
    }
    process.exitCode = 1;
} else {
    console.log('Next.js middleware trace contains no native addons.');
}
