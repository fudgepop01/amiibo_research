import { readFileSync, writeFileSync } from 'fs';

const ins = readFileSync('./inputs.csv', 'utf8').split('\n').map(r => r.split(',').map(v => parseInt(v, 16)));
const outs = readFileSync('./outputs.txt', 'utf8').split('\n');

const mapped = outs.map(
  (label, index) => {
    return {
      label,
      data: ins[index]
    }
  }
)

writeFileSync('./mapped.json', JSON.stringify(mapped), 'utf8');