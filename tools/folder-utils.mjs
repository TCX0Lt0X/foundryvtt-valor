import { promises as fs } from 'fs';

export const recurseFolders = async function(path) {
  const folder = await fs.readdir(path);
  const parentFolders = [];
  for (let child of folder) {
    if (child === 'packs') continue;
    const mergedPath = path + "/" + child;
    const fStat = await fs.stat(mergedPath);
    if (fStat.isDirectory()) {
      const folderContents = await recurseFolders(mergedPath);
      if (folderContents.length > 0) {
        parentFolders.push(...folderContents);
      } else {
        parentFolders.push(mergedPath);
      }
    }
  }
  return parentFolders;
}
