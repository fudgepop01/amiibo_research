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
    model.add(tfl.layers.inputLayer({inputShape: [58]}));
    model.add(tfl.layers.dense({units: 53, useBias: true, activation: "relu"}));
    model.add(tfl.layers.dense({units: 38, useBias: true, activation: "relu"}));
    model.add(tfl.layers.dense({units: 32, useBias: true, activation: "relu"}));
    model.add(tfl.layers.dense({units: 25, useBias: true, activation: "softmax"}));
  }

  model.compile({
    optimizer: tf.train.adam(0.01),
    loss: "categoricalCrossentropy",
    metrics: "accuracy"
  })

  await model.fit(inputTensor, outputTensor, {
    epochs: epochCount,
    batchSize: 1,
    shuffle: true,
    validationSplit: 0.25
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
    batchSize: 100,
    shuffle: true,
    validationSplit: 0.25
  });
}

const predictBestTarget = async (limit: number, target: number, model: tfl.Sequential) => {
  let currentBestPrediction: any[];
  let inputData;
  for (let tracker = 0; tracker < limit; tracker++) {
    inputData = Array(58).fill(0).map((v, index) => {
      if (true /* !((0x07 <= index && index <= 0x0B ) || 0x11 <= index) */) return (Math.round(Math.floor(Math.random() * 0xFF) /* * 0x7F + 0x00 */)) / 255;
      else return v;
    });
    const testTensor = tf.tensor([
      inputData
    ]);
    const prediction = await (model.predict(testTensor, {batchSize: 128}) as any).data();

    if (!currentBestPrediction || prediction[target] > currentBestPrediction[target]) {
      currentBestPrediction = prediction;
    }
  }

  return {
    inputData,
    prediction: currentBestPrediction
  };
}

const formatOutput = (bestPrediction: any[], target: number) => {
  let ranked: any[] = [...bestPrediction].map((val: number, index) => [
    ch.yellow(`${Math.floor(val * 100000) / 1000}%`.padStart(10, ' ')),
    ch.cyan(classNames[index].padStart(15, ' ')),
    val
  ])
  .sort((a, b) => (a[a.length - 1] as number) - (b[b.length - 1] as number));

  const rankedToFormatted = ranked
    .map((arr, index) => [ch.greenBright(`${(classNames.length - index).toString().padStart(2, ' ')})`), ...arr].join(' | '))

  console.log(rankedToFormatted.join('\n'));
  console.log(ch.bold(ch.cyanBright("target:")));
  console.log(rankedToFormatted[rankedToFormatted.findIndex(v => v.includes(classNames[target]))]);
}

const askForPersonality = async (rl: readline) => {
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
  return personality
}

const gatherData = async (model: tfl.Sequential, modelName: string, amount: number, inputs: any, outputs: any) => {

  console.log(model.summary());

  const inLog = createWriteStream('./inputs.csv', {
    flags: 'a+'
  });
  const outLog = createWriteStream('./outputs.txt', {
    flags: 'a+'
  });

  const rl = readline.createInterface({
    input: process.stdin
  });

  // TODO: convert to do-while statement
  // first pass
  let target = Math.floor(Math.random() * classNames.length);
  console.log(ch.red("waiting for first prediction..."));
  let {inputData, prediction} = await predictBestTarget(2000, target, model);

  for (let i = 0; i < amount; i++) {
    formatOutput(prediction, target);

    try {
      await writeToCard(inputData.map(v => v * 255));
    } catch (e) {
      console.log('failed - skipping...')
      continue;
    }

    // do these things in parallel
    let personality = '';
    let nextBestTarget: any[];
    let nextInputData: any[];
    await Promise.all([
      (async () => {
        target = Math.floor(Math.random() * classNames.length);
        let temp = await predictBestTarget(7500, target, model);
        nextInputData = temp.inputData;
        nextBestTarget = temp.prediction;
      })(),
      (async () => {
        personality = await askForPersonality(rl);
      })()
    ])

    inLog.write(`${inputData.map(v => (v * 255).toString(16).padStart(2, '0')).join(',')}\n`, 'utf8');
    outLog.write(`${personality}\n`);

    inputs.push(inputData.map(v => v * 255));
    outputs.push(personality);

    await trainABit(50, model, inputs, outputs);
    await model.save(`file://${__dirname}/${modelName}.json`);

    prediction = nextBestTarget;
    inputData = nextInputData;
  }

  process.exit();
}

const main = async () => {
  const inputs = readFileSync('./inputs.csv', 'utf8').split('\n').map(dataSet => dataSet.split(',').map(val => parseInt(val, 16)));
  const outputs = readFileSync('outputs.txt', 'utf8').split('\n');
  const modelName = 'xxxxxxx'

  const algorithm = await initLearning(10, modelName, inputs, outputs);
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
