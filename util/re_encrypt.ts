import * as maboii from 'maboii';
import * as fs from 'fs';

const keys = maboii.loadMasterKeys([...fs.readFileSync(__dirname + "/../Amiibo Bin Dump/key_retail.bin")]);

const main = (filePath, outDir) => {
  const packed = maboii.pack(keys, [...fs.readFileSync(`${outDir}/${filePath}`)]);
  fs.writeFileSync(`${outDir}/${filePath}`, Buffer.from(packed));
}

export default main;