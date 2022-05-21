// import * as tf from '@tensorflow/tfjs';

// // Define a model for linear regression.
// // const model = tf.sequential();
// // model.add(tf.layers.dense({units: 1, inputShape: [1]}));

// // // Prepare the model for training: Specify the loss and the optimizer.
// // model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

// // // Generate some synthetic data for training.
// // const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
// // const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

// // // Train the model using the data.
// // model.fit(xs, ys).then(() => {
// //   // Use the model to do inference on a data point the model hasn't seen before:
// //   model.predict(tf.tensor2d([5], [1, 1])).print();
// // });
// import fs from 'fs';

// // let model = tf.loadGraphModel('models/tfjs_model/model.json')
// // console.log(fs.readFileSync('models/tfjs_model/model.json', {encoding:'utf-8'}))

// fs.readFile(MODEL_PATH, 'utf8', (err, data) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log(data);
// });
const MODEL_PATH = 'models/tfjs_model/model.json';
let MODEL = undefined;
async function loadModel() {
  MODEL = await tf.loadGraphModel(MODEL_PATH); 
  console.log(MODEL);
}


function main() {
  loadModel()
}

main();