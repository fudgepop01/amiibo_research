import { NFC } from 'nfc-pcsc';
import { writeFileSync, readFileSync } from 'fs';

const parseBytes = (name, data, length) => {

	if (!(data instanceof Buffer) && typeof data !== 'string') {
		throw new Error(`${name} must an instance of Buffer or a HEX string.`);
	}

	if (Buffer.isBuffer(data)) {

		if (data.length !== length) {
			throw new Error(`${name} must be ${length} bytes long.`);
		}

		return data;

	}

	if (typeof data === 'string') {

		if (data.length !== length * 2) {
			throw new Error(`${name} must be a ${length * 2} char HEX string.`);
		}

		return Buffer.from(data, 'hex');

	}

	throw new Error(`${name} must an instance of Buffer or a HEX string.`);

};

const nfc = new NFC();

const main = (sourcePath, pw) => {
  return new Promise((resolve, reject) => {
    console.log('inPromise')
    nfc.on('reader', reader => {
      console.log('onreader');
      reader.on('card', async card => {
        console.log(`now processing: ${sourcePath} | pw: ${pw}`);

        const toWrite = readFileSync(sourcePath);
        const password = parseBytes('Password', pw, 4);
        const cmd = Buffer.from([
          0xff, // Class
          0x00, // Direct Transmit (see ACR122U docs)
          0x00, // ...
          0x00, // ...
          0x07, // Length of Direct Transmit payload
          // Payload (7 bytes)
          0xd4, // Data Exchange Command (see PN533 docs)
          0x42, // InCommunicateThru
          0x1b, // PWD_AUTH
          ...password,
        ]);

        const response = await reader.transmit(cmd, 7);

        reader.logger.debug('pwd_auth response', response);

        if (response[2] !== 0x00 || response.length < 7) {
          console.error("auth failed");
          reader.on('card.off', card => {
            nfc.close();
            reject();
          });
        }

        for (let i = 1; i <= 3; i++) {
          try {
            console.log(`writing data`)
            await reader.write(0xE0 / 4, toWrite.slice(0xE0, 0x1B4), 4);
            console.log('written!\n -- please remove card');
            reader.on('card.off', card => {
              nfc.close();
              resolve();
            });
          }
          catch (e) {
            console.log(e.message);
            if (i === 3) {
              console.error("failed to write\n -- please remove card");
              reader.on('card.off', card => {
                nfc.close();
                reject();
              });
            }
          }
        }
      });
    });
  });
}

export default main;