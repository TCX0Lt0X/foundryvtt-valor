import { compilePack } from '@foundryvtt/foundryvtt-cli';
import { recurseFolders } from './folder-utils.mjs';
import { ansi } from './ansi.mjs';

let packedCount = 0;
const modulePath = process.cwd();
const packs = (await recurseFolders("./src/packs"))
  .map(p => p.replace(/^.\/src\//gs, "./"));

for (const pack of packs) {
  console.log(`Compiling ${ansi.green}${pack}${ansi.normal}`);
  await compilePack(
    `${modulePath}/src/${pack}`,
    `${modulePath}/${pack}`,
    { yaml: false }
  );
  packedCount++;
}

console.log(`Compiled ${ansi.green}${packedCount}${ansi.normal} compendium packs.`);
