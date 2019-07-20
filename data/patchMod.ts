import Amiibo, { ABILITY } from '../util/amiibo';
import sign from '../util/checksum';
import { calcKeyARaw } from '../util/pwd215';
import encrypt from '../util/re_encrypt';
import decrypt from '../util/decrypt';
import CardIO from '../util/cardIO';
import readline from 'readline-promise';

import { readFileSync, writeFileSync, createWriteStream } from 'fs';

const inLog = createWriteStream('./inputs.csv', {
  flags: 'a+'
});
const outLog = createWriteStream('./outputs.txt', {
  flags: 'a+'
});
const outAbility = createWriteStream('./abilities.txt', {
  flags: 'a+'
});

const rl = readline.createInterface({
  input: process.stdin
});

let count = 16;
let other = 0x0D;

const main = async () => {
  const card = new CardIO();
  await card.init();
  let chunkSize = 1;
  let countLimit = 16;

  // perosonality from count values 16 - 24

  // personality values from 0 - 17

  while (true) {
    console.log(`place card on reader when ready to continue, (count: ${count})`);
    const data = (await card.read()) as Buffer;
    writeFileSync(`./temp.bin`, decrypt(data));

    const pw = calcKeyARaw(Buffer.from([...data.slice(0, 3), ...data.slice(4, 8)]));

    const amiibo = new Amiibo(`./temp.bin`);

    // largest possible float: 7FEFFFFFFFFFFFFF
    let params = new Array(0x1B4 - 0xE0).fill(0);

    amiibo.debug(0, params); // clears the data
    amiibo.costume = Math.round(Math.random() * 8); // for at least a little variety

    amiibo.ability1 = ABILITY.none1;
    amiibo.ability2 = ABILITY.none1;
    amiibo.ability3 = ABILITY.none1;

    amiibo.cpuExp = 0xFFFF;

    for (const i of amiibo.personality.keys()) {
      //const val = Math.floor(Math.random() * 0xFF) + 1;
      if (/* (7 <= i && i < 7 + 5) || */ (7 <= i && i < 7+5) || i >= 17) amiibo.personality.set([0x00], i);
      else if (i === count && ((0 <= i && i < 7) || (12 <= i && i < 18))) amiibo.personality.set([0xFF], i);
    }
    amiibo.personality.set([0xFF], 0);
    amiibo.personality.set([0xFF], other);

    const personalityHex = [...(amiibo.personality as any as any[]).values()].map(v => v.toString(16).padStart(2, '0')).join(',');
    amiibo.save();


    sign(`./temp.bin`);
    writeFileSync('./temp_dec.bin', readFileSync('./temp.bin'));
    encrypt(`./temp.bin`, '.');
    await card.write(`./temp.bin`, pw);

    count++;
    if (count === 7) count = 12;

    let personality = '';
    while (!(['normal',
      'cautious',
      'realistic',
      'unflappable',
      'light',
      'quick',
      'lightning fast',
      'enthusiastic',
      'aggressive',
      'offensive',
      'reckless',
      'thrill seeker',
      'daredevil',
      'versatile',
      'tricky',
      'technician',
      'show-off',
      'flashy',
      'entertainer',
      'cool',
      'logical',
      'sly',
      'laid back',
      'wild',
      'lively'
    ].includes(personality))) {
      console.log('personality?');
      personality = await rl.questionAsync('personality?');
    }
    inLog.write(personalityHex + '\n', 'utf8');
    outLog.write(personality + '\n', 'utf8');

    if (count > countLimit) {
      console.log('done');
      process.exit();
    }
  }
}

main();