import { writeFileSync, readFileSync } from 'fs';

const code = readFileSync('./AI_Global_Constants.txt', 'utf8');
let constants = '';

let lastValue = -1;
for (const line of code.split('\n')) {
  if (line.includes(`&local_68,`)) {

    const lineData: {
      type?: "TITLE" | "ENTRY";
      data?: string;
    } = {}
    if (line.includes('FUN_710276f130')) lineData.type = "TITLE";
    else if (line.includes('FUN_710276f4a0')) lineData.type = "ENTRY"

    lineData.data = line.substring(line.indexOf(`&local_68,`) + 10, line.lastIndexOf(`)`));
    lineData.data = lineData.data.replace(/"/g, '').replace(/,/g, ' \t ');

    const splitted = lineData.data.split(' \t ');
    const valChunk = splitted[splitted.length - 1];
    const thisValue = parseInt(valChunk)
    // console.log(lastValue, splitted.join(','), thisValue)
    if (lineData.type === 'TITLE' || lineData.type === null || isNaN(thisValue) || thisValue <= lastValue) {
      lastValue = -1
      if (!constants.endsWith('...\n')) constants += '...\n'
    } else {
      lastValue = thisValue;
    }
    if (lineData.type) constants += `${lineData.type} \t ${lineData.data}\n`;
  }
  
}

writeFileSync('./AI_Global_Constants_Parsed.csv', constants, 'utf8');