import * as maboii from 'maboii';
import * as fs from 'fs';

const keys = maboii.loadMasterKeys([...fs.readFileSync(__dirname + "/../Amiibo Bin Dump/key_retail.bin")]);

// for (const file of fs.readdirSync("enc_custom")) {
//   const unpacked = maboii.pack(keys, [...fs.readFileSync(`dec_custom/${file}`)]);
//   fs.writeFileSync(`re_enc_custom/${file}`, Buffer.from(unpacked.packed));
// }
const main = (filePath, outDir) => {
  const packed = maboii.pack(keys, [...fs.readFileSync(`${outDir}/${filePath}`)]);
  fs.writeFileSync(`${outDir}/${filePath}`, Buffer.from(packed));
}

export default main;