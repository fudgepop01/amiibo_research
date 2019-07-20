import { NFC } from 'nfc-pcsc';
import { writeFileSync } from 'fs';

const nfc = new NFC();

const main = () => {
  return new Promise((resolve) => {
    nfc.on('reader', reader => {
      reader.on('card', async card => {
        const data = await reader.read(0, 540);
        await nfc.close();
        resolve(data);
      });
    });
  });
}

export default main;