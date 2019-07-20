import * as maboii from 'maboii';
import * as fs from 'fs';

const keys = maboii.loadMasterKeys([...fs.readFileSync("Amiibo Bin Dump/key_retail.bin")]);

const chars = {};
const range = [0x00, 0x10];
for (const file of fs.readdirSync("encrypted")) {
  const unpacked = maboii.unpack(keys, [...fs.readFileSync(`encrypted/${file}`)]).unpacked;

  chars[file.substring(0, file.length - 4)] = unpacked.slice(range[0], range[1])
}

const order = fs.readFileSync('./order.txt', 'utf8').split('\n');
let out = `num,charName`;
for (let i = range[0]; i < range[1]; i++) {
  out += `,${i.toString(16).toUpperCase().padStart(2, '0')}`;
}
out += '\n'
for (const [i, charName] of order.entries()) {
  if (!chars[charName]) continue;

  out += `${i},${charName},`;
  out += chars[charName].map(val => val.toString(2).padStart(8, '0')).join(',');
  out += '\n';
}
fs.writeFileSync('./out.csv', out);