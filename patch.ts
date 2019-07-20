import { readFileSync, writeFileSync } from 'fs';
import CardIO from './util/cardIO';
import { calcKeyARaw } from './util/pwd215';

async function main() {
  const card = new CardIO();
  await card.init();
  const data = (await card.read()) as Buffer;

  writeFileSync(`./enc_custom/fritz8.bin`, data);
}

main();
