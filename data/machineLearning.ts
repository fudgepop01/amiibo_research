import '../node_modules/@tensorflow/tfjs-node/dist/index'
import * as tfl from '../node_modules/@tensorflow/tfjs-layers/dist/index';
import * as tf from '../node_modules/@tensorflow/tfjs-core/dist/index';
import ch from 'chalk';

import { readFileSync, readdirSync, createWriteStream } from 'fs';
import writeToCard from './readWriteData';

import readline from 'readline-promise';

const classNames = [
  'normal',
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
];

const initLearning = async (epochCount: number, modelName: string, inputs: any, outputs: any) => {
  inputs.pop();
  outputs.pop();

  // 1117 nodes of data,
  // 58 inputs
  const trainShape = [inputs.length, 58];

  // 1117 labels
  const trainLabels = outputs.map(v => {
    const map = new Array(classNames.length).fill(0);
    map[classNames.indexOf(v)] = 1;
    return map;
  });

  // want to map values to a value between 0 and 1
  const preprocessed = inputs.map(input => input.map(val => val / 255));

  const inputTensor = tf.tensor(preprocessed, trainShape);
  const outputTensor = tf.tensor(trainLabels, [inputs.length, 25]);

  let model;
  if (readdirSync(`${__dirname}`).includes(`${modelName}.json`)) {
    model = await tfl.loadLayersModel(`file://${__dirname}/${modelName}.json/model.json`);
  } else {
    model = tfl.sequential();
    model.add(tfl.layers.dense({inputShape: [58], units: 1, activation: "elu"}));
    model.add(tfl.layers.dense({units: 25, activation: "softmax"}));
  }

  model.compile({
    optimizer: "adam",
    loss: "categoricalCrossentropy",
    metrics: "accuracy"
  })

  await model.fit(inputTensor, outputTensor, {
    epochs: epochCount,
    batchSize: inputs.length
  });

  await model.save(`file://${__dirname}/${modelName}.json`);

  return model;
}

const trainABit = async (amount: number, model: tfl.Sequential, inputs: any, outputs: any) => {
  const trainShape = [inputs.length, 58];

  // 1117 labels
  const trainLabels = outputs.map(v => {
    const map = new Array(classNames.length).fill(0);
    map[classNames.indexOf(v)] = 1;
    return map;
  });

  // want to map values to a value between 0 and 1
  const preprocessed = inputs.map(input => input.map(val => val / 255));

  const inputTensor = tf.tensor(preprocessed, trainShape);
  const outputTensor = tf.tensor(trainLabels, [inputs.length, 25]);

  await model.fit(inputTensor, outputTensor, {
    epochs: amount,
    batchSize: inputs.length
  });
}

const gatherData = async (model: tfl.Sequential, modelName: string, amount: number, inputs: any, outputs: any) => {

  const inLog = createWriteStream('./inputs.csv', {
    flags: 'a+'
  });
  const outLog = createWriteStream('./outputs.txt', {
    flags: 'a+'
  });

  const rl = readline.createInterface({
    input: process.stdin
  });


  for (let i = 0; i < amount; i++) {
    let ranked: any[];
    let testData: any[];
    let leniency = 0;
    while (!ranked || parseFloat(ranked[ranked.length - 1][ranked[0].length - 1]) < (1 - leniency * 0.01)) {
      testData = Array(58).fill(0).map((v, index) => {
        if (!((0x07 <= index && index <= 0x0B ) || 0x11 <= index)) return (Math.round(Math.floor(Math.random() * 0xFF) /* * 0x7F + 0x00 */)) / 255;
        else return v;
      });
      const testTensor = tf.tensor([
        testData
      ]);
      const prediction = await (model.predict(testTensor, {batchSize: 1}) as any).data();
      ranked = [...prediction].map((val: number, index) => [
        ch.yellow(`${Math.floor(val * 100000) / 1000}%`.padStart(10, ' ')),
        ch.cyan(classNames[index].padStart(15, ' ')),
        val
      ])
      .sort((a, b) => (a[a.length - 1] as number) - (b[b.length - 1] as number));
      leniency++;
    }

    const rankedToString = ranked
      .map((arr, index) => [ch.greenBright(`${(classNames.length - index).toString().padStart(2, ' ')})`), ...arr].join(' | '))
      .join('\n')
    console.log(rankedToString);
    console.log(ch.bold(ch.redBright(`leniency: ${leniency}`)));
    try {
      await writeToCard(testData.map(v => v * 255));
    } catch (e) {
      console.log('failed - skipping...')
      continue;
    }

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

    inLog.write(`${testData.map(v => (v * 255).toString(16).padStart(2, '0')).join(',')}\n`, 'utf8');
    outLog.write(`${personality}\n`);

    inputs.push(testData.map(v => v * 255));
    outputs.push(personality);

    await trainABit(50, model, inputs, outputs);
    await model.save(`file://${__dirname}/${modelName}.json`);

  }

  process.exit();
}

const main = async () => {
  const inputs = readFileSync('./inputs.csv', 'utf8').split('\n').map(dataSet => dataSet.split(',').map(val => parseInt(val, 16)));
  const outputs = readFileSync('outputs.txt', 'utf8').split('\n');
  const modelName = 'fromScratch'

  const algorithm = await initLearning(50, modelName, inputs, outputs);
  gatherData(algorithm, modelName, 20, inputs, outputs);
}

main();


// each label is an integer between 0 and 24 (inclusive)

// model:
// I have:
// 58 input variables
//
// From this, I want to predict / generate:
// one of 25 different values
