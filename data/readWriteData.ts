import Amiibo, { ABILITY } from '../util/amiibo';
import sign from '../util/checksum';
import { calcKeyARaw } from '../util/pwd215';
import encrypt from '../util/re_encrypt';
import decrypt from '../util/decrypt';
import CardIO from '../util/cardIO';

import { readFileSync, writeFileSync } from 'fs';


const main = async (newData: number[]) => {
  const card = new CardIO();
  await card.init();

  // perosonality from count values 16 - 24

  // personality values from 0 - 17

  console.log(`place card on reader when ready`);
  const data = (await card.read()) as Buffer;
  writeFileSync(`./temp.bin`, decrypt(data));
  writeFileSync(`./temp_old_dec.bin`, decrypt(data));

  const pw = calcKeyARaw(Buffer.from([...data.slice(0, 3), ...data.slice(4, 8)]));
  const amiibo = new Amiibo(`./temp.bin`);

  const debugVals = new Array(0x1B4 - 0xE0).fill(0)

  for (const [i, v] of debugVals.entries()) {
    if (360 - 0xE0 <= i && i <= 360 - 0xE0) debugVals[i] = 0xFF;
    else if (360 - 0xE0 <= i && i < 418 - 0xE0) debugVals[i] = 0xFF;
  }
  debugVals[401 - 0xE0] = 0xFF;

  debugVals[410 - 0xE0] = 0xFF;
  debugVals[411 - 0xE0] = 0x00;
  debugVals[412 - 0xE0] = 0x00;
  debugVals[413 - 0xE0] = 0x00;


  // 360: grappler
  // 361: grabs as a counter
  // 362: spaces moves away from the opponent
  // 363: rushdown grabs
  // 364: ?
  // 365: ?
  // 366: "no chill mode"
  // 367: more setups?
  // 368: ?
  // 369: supposedly grabbing??
  // 370: ?
  // 371: more baits??
  // 372:
  // ...
  // 410: speicals

  amiibo.debug(0, debugVals); // clears the data
  amiibo.costume = Math.round(Math.random() * 8); // for at least a little variety

  amiibo.ability1 = ABILITY.none1;
  amiibo.ability2 = ABILITY.none1;
  amiibo.ability3 = ABILITY.none1;
  amiibo.gift = 0x0000;

  amiibo.cpuExp = 0x0ACD;
  amiibo.lvExp = 0x0000;

  amiibo.tauntRate = 0;

  //amiibo.personality = Buffer.from(newData);
  amiibo.save();

  sign(`./temp.bin`);
  writeFileSync('./temp_dec.bin', readFileSync('./temp.bin'));
  encrypt(`./temp.bin`, '.');
  await card.write(`./temp.bin`, pw);
}

let arr = new Array(58).fill(0x00);
main(arr);

export default main;