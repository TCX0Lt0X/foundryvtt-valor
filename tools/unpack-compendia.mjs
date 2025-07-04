import { extractPack } from '@foundryvtt/foundryvtt-cli';
import { recurseFolders } from './folder-utils.mjs';
import { ansi } from './ansi.mjs';
import { promises as fs } from 'fs';
import path from 'path';

let unpackedCount = 0;
const modulePath = process.cwd();
const packs = await recurseFolders("./packs");

for (const pack of packs) {
  console.log(`Extracting ${ansi.green}${pack}${ansi.normal}`);

  const targetFolder = "./src/" + pack;
  let sourceError = false;

  // clean folders
  try {
    for(const file of await fs.readdir(targetFolder)) {
      await fs.unlink(path.join(targetFolder, file));
    }
  } catch(err) {
    if (err.code !== "ENOENT") {
      console.log(`  ${ansi.red}${err}${ansi.normal}`);
      sourceError = true;
    }
  }  
  if (sourceError) continue;

  await extractPack(
    `${modulePath}/${pack}`, `${modulePath}/src/${pack}`,
    {
      yaml: false,
      transformName: (doc) => {
        if (doc.name) {
          const type = doc._key.split("!")[1];
          const prefix = ['actors', 'items'].includes(type) ? doc.type : type;
          const cleanFilename = doc.name.replace(/\W/g, "_");
          return `${prefix}_${cleanFilename}_${doc._id}.json`
        } else {
          return `${doc._id}.json`;
        }
      }
    }
  );
  unpackedCount++;
}

console.log(`Extracted ${ansi.green}${unpackedCount}${ansi.normal} compendium packs.`);
