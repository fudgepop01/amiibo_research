import { writeFileSync, readFileSync } from 'fs';
import * as CRC32 from 'crc-32';

const fname = 'common/ai/nfp_learning_param';

const labels = readFileSync('./ParamLabels.txt', 'utf8').split('\n').map(pair => pair.split(','));
let file = readFileSync(`./${fname}.xml`, 'utf8');

for (const [hash, label] of labels) {
  file = file.replace(new RegExp(`${hash}`, 'g'), label)
}

// console.log(CRC32.buf([0x1a, 0x35, 0xc6, 0x02, 0xf5]));

writeFileSync(`./${fname}_DH.xml`, file);
