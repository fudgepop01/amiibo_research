import Amiibo from './util/amiibo';
import sign from './util/checksum';
import { calcKeyARaw } from './util/pwd215';
import encrypt from './util/re_encrypt';
import decrypt from './util/decrypt';
import CardIO from './util/cardIO';

import { readFileSync, writeFileSync } from 'fs';

const testOffset = 0x00;

const main = async (fileBase, count) => {
  const card = new CardIO();
  await card.init();

  for (let i = (count % 8) + 1; i <= 8; i++) {
    console.log(`please place card ${i} on reader`);
    const data = (await card.read()) as Buffer;

    writeFileSync(`./enc_custom/${fileBase}${i}.bin`, data);

    const pw = calcKeyARaw(Buffer.from([...data.slice(0, 3), ...data.slice(4, 8)]));

    writeFileSync(`./enc_custom/${fileBase}${i}.bin`, data);
    writeFileSync(`./dec_custom/${fileBase}${i}.bin`, decrypt(data));

    const amiibo = new Amiibo(`./dec_custom/${fileBase}${i}.bin`);

    amiibo.debug(0, []); // clears the data
    // amiibo.attack = 1;
    // amiibo.defense = 0;
    amiibo.costume = i - 1;
    amiibo.personality[0] = 0b10000000; // sets attack bit

    amiibo.personality[Math.floor(count / 8) + testOffset] = 0b10000000 >> (count % 8);

    // if (i % 2 === 0) amiibo.personality[count] = 0x0F;
    // else amiibo.personality[count] = 0xF0;
    amiibo.save();

    sign(`./dec_custom/${fileBase}${i}.bin`);
    encrypt(`./${fileBase}${i}.bin`, './re_enc_custom');
    await card.write(`./re_enc_custom/${fileBase}${i}.bin`, pw);

    count++;
    // let out = `0x${(count).toString(16)}\n`;
    // out += `testing: 0x${((Math.floor(count / 8)) + testOffset).toString(16)}\n`;
    // out += `relative: 0x${((Math.floor(count / 8)) + testOffset + 0x88).toString(16)}\n`;
    // out += `absolute: 0x${((Math.floor(count / 8)) + testOffset + 0x88 + 0xE0).toString(16)}\n`;
    writeFileSync('./count.txt', out);
  }
  console.log('success!');
}

main('fritz', parseInt(readFileSync('./count.txt', 'utf8').split('\n')[0], 16));