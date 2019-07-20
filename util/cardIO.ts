import { NFC } from 'nfc-pcsc';
import { readFileSync } from 'fs';
import ch from 'chalk';

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

class CardIO {
  nfc: any;
  reader: any;

  data: Buffer;

  constructor() {
    this.nfc = new NFC;
  }

  init() {
    return new Promise((resolve) => {
      this.nfc.on('reader', (reader) => {
        this.reader = reader;
        resolve();
      });
    })
  }

  read() {
    return new Promise((resolve) => {
      const handler = async (card) => {
        const data = await this.reader.read(0, 540);
        this.reader.off('card', handler);
        this.data = data;
        resolve(data);
      }

      this.reader.on('card', handler);
    });
  }

  write(sourcePath, pw) {
    return new Promise(async (resolve, reject) => {
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

        const response = await this.reader.transmit(cmd, 7);

        this.reader.logger.debug('pwd_auth response', response);

        if (response[2] !== 0x00 || response.length < 7) {
          console.error("auth failed");
          this.reader.on('card.off', card => {
            reject();
          });
        }

        console.log(`writing data`)

        for (let chunk = 0x4; chunk <= 0x82; chunk++) {
          if (this.data.slice(chunk * 4, (chunk + 1) * 4).join(',') === toWrite.slice(chunk * 4, (chunk + 1) * 4).join(',')) continue;
          for (let i = 1; i <= 20; i++) {
            try {
              await this.reader.write(chunk, toWrite.slice(chunk * 4, (chunk + 1) * 4), 4)
              break;
            }
            catch (e) {
              if (i === 20) {
                console.error(`failed on 0x${chunk.toString(16)}`);
                reject()
              }
            }
          }
        }

        console.log(ch.bold(ch.cyanBright(`~~ Written! ~~`)));

        this.reader.on('card.off', card => {
          resolve();
        });
    })
  }
}

export default CardIO;