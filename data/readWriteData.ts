import Amiibo, { ABILITY } from '../util/amiibo';
import sign from '../util/checksum';
import { calcKeyARaw } from '../util/pwd215';
import encrypt from '../util/re_encrypt';
import decrypt from '../util/decrypt';
import CardIO from '../util/cardIO';

import { readFileSync, writeFileSync } from 'fs';


export default async (newData: number[]) => {
  const card = new CardIO();
  await card.init();

  // perosonality from count values 16 - 24

  // personality values from 0 - 17

  console.log(`place card on reader when ready`);
  const data = (await card.read()) as Buffer;
  writeFileSync(`./temp.bin`, decrypt(data));

  const pw = calcKeyARaw(Buffer.from([...data.slice(0, 3), ...data.slice(4, 8)]));
  const amiibo = new Amiibo(`./temp.bin`);
  amiibo.debug(0, new Array(0x1B4 - 0xE0).fill(0)); // clears the data
  amiibo.costume = Math.round(Math.random() * 8); // for at least a little variety

  amiibo.ability1 = ABILITY.none1;
  amiibo.ability2 = ABILITY.none1;
  amiibo.ability3 = ABILITY.none1;

  amiibo.cpuExp = 0xFFFF;

  amiibo.personality = Buffer.from(newData);
  amiibo.save();

  sign(`./temp.bin`);
  writeFileSync('./temp_dec.bin', readFileSync('./temp.bin'));
  encrypt(`./temp.bin`, '.');
  await card.write(`./temp.bin`, pw);
}