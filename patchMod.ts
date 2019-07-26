import Amiibo, { ABILITY } from './util/amiibo';
import sign from './util/checksum';
import { calcKeyARaw } from './util/pwd215';
import encrypt from './util/re_encrypt';
import decrypt from './util/decrypt';
import CardIO from './util/cardIO';

import { readFileSync, writeFileSync } from 'fs';

const testOffset = 360;

const main = async (fileBase, count) => {
  const card = new CardIO();
  await card.init();

  for (let i = (count % 8) + 1; i <= 8; i++) {
    console.log(`please place card ${i} on reader`);

    const data = (await card.read()) as Buffer;

    const pw = calcKeyARaw(Buffer.from([...data.slice(0, 3), ...data.slice(4, 8)]));

    writeFileSync(`./dec_custom/${fileBase}${i}.bin`, decrypt(data));

    const amiibo = new Amiibo(`./dec_custom/${fileBase}${i}.bin`);


    const debugVals = new Array(0x1B4 - 0xE0).fill(0x00);

    // debugVals[testOffset + count + (360 - 0xE0)] = 0xFF;
    // debugVals[testOffset + count - 0xE0] = 0xFF; //0b10000000 >> (count % 8);

    debugVals[360 - 0xE0] = 0xFF; // aggression
    debugVals[361 - 0xE0] = 0xFF; // ^

    // debugVals[392 - 0xE0] = 0xFF; // jab
    // debugVals[393 - 0xE0] = 0xFF; // forward tilt
    // debugVals[394 - 0xE0] = 0xFF; // up tilt
    // debugVals[395 - 0xE0] = 0xFF; // up tilt (again)
    // debugVals[396 - 0xE0] = 0xFF; // down tilt
    // debugVals[397 - 0xE0] = 0xFF; // forward smash
    // debugVals[398 - 0xE0] = 0xFF; // up smash
    // debugVals[399 - 0xE0] = 0xFF; // down smash
    // debugVals[400 - 0xE0] = 0xFF; // down smash (common) + neutral special (rare)
    // debugVals[401 - 0xE0] = 0x01; // neutral special (grounded)
    // debugVals[402 - 0xE0] = 0x02; // side special (grounded)
    // debugVals[403 - 0xE0] = 0xFF; // up special (grounded)
    // debugVals[404 - 0xE0] = 0xFF; // down special
    // debugVals[405 - 0xE0] = 0xFF; // up special

    // debugVals[406 - 0xE0] = 0xFF; // forward air
    // debugVals[407 - 0xE0] = 0xFF; // back air
    // debugVals[408 - 0xE0] = 0xFF; // up air
    // debugVals[409 - 0xE0] = 0xFF; // down air

    // debugVals[410 - 0xE0] = 0xFF; // neutral special
    // debugVals[411 - 0xE0] = 0xFF; // side special (aerial)
    // debugVals[412 - 0xE0] = 0xFF; // up special (aerial)
    // debugVals[413 - 0xE0] = 0xFF; // down special (aerial)



    // amiibo.personality[testOffset] = Buffer.from();
    // amiibo.personality[Math.floor(count / 8) + testOffset] = 0b10000000 >> (count % 8);

    amiibo.debug(0, debugVals); // clears the data

    amiibo.ability1 = ABILITY.none1;
    amiibo.ability2 = ABILITY.none1;
    amiibo.ability3 = ABILITY.none1;
    amiibo.gift = 0x0000;

    amiibo.cpuExp = 0x0ACD;
    amiibo.lvExp = 0x0000;

    amiibo.tauntRate = 0;
    amiibo.costume = Math.floor(Math.random() * 8);

    //amiibo.personality[0] = 0b10000000; // sets attack bit

    amiibo.save();

    sign(`./dec_custom/${fileBase}${i}.bin`);
    writeFileSync(`./re_enc_custom/${fileBase}${i}.bin`, readFileSync(`./dec_custom/${fileBase}${i}.bin`));
    encrypt(`./${fileBase}${i}.bin`, './re_enc_custom');
    await card.write(`./re_enc_custom/${fileBase}${i}.bin`, pw);

    count++;
    let out = `0x${(count).toString(16)}\n`;
    out += `testing: 0x${((Math.floor(count / 8)) + testOffset).toString(16)}\n`;
    out += `relative: 0x${((Math.floor(count / 8)) + testOffset + 0x88).toString(16)}\n`;
    out += `absolute: 0x${((Math.floor(count / 8)) + testOffset + 0x88 + 0xE0).toString(16)}\n`;
    writeFileSync('./count.txt', out);
  }
  console.log('success!');
}

main('fritz', parseInt(readFileSync('./count.txt', 'utf8').split('\n')[0], 16));