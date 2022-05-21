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

function correctFeatureName(s) {
  return s.replace(/\W/g,'').toLowerCase();
}

class Preprocessor {
  constructor(obj) {
    this.mapper = obj;
    // for (const [feature, [valueMap, defaultVal]] of
    //      Object.entries(obj)) {
    //     // console.log(Object.entries(valueMap));
    //     for (const [className, value] of Object.entries(valueMap)) {
    //       console.log(className, value);
    //     }

    //     console.log(`${feature}: ${valueMap} ${defaultVal}`);
    // }
  }

  // inputs  { 'Feature':"abcd", "NumFeature":132 }
  // outputs { 'Feature': tf.Tensor(123,...), ...}
  execute(inputs) {
    let result = Object.create(null);
    for (const [feature, value] of Object.entries(inputs)) {
      console.log(feature);
      let featureName = correctFeatureName(feature);
      if (typeof value == 'string') {
        let classMap = this.mapper[feature]
        if (!classMap) throw Error(`Feature ${feature} is not found!`)
        // console.log(classMap, value);
        let [valueMap, defaultVal] = classMap;
        let encoded_value = valueMap[value] || defaultVal;
        result[featureName] = encoded_value;
      } else {
        result[featureName] = value;
      }
      result[featureName] = tf.tensor([result[featureName]], [1,1], 'float32')
    }
    return result;
  }

  static fromJson(obj) {
    return new Preprocessor(obj)
  }
}

class Model {
  constructor(model, prep) {
    this.model = model;
    this.prep = prep;
  }

  async predict(inputs) {
    let prepared_inputs = this.prep.execute(inputs)
    let outputs = await this.model.predict(prepared_inputs)
    console.log(outputs.dataSync());
    return outputs
  }

  static async fromDir(path) {
    path = path.endsWith('/') ? path : path + '/'
    let model = await tf.loadGraphModel(path + 'model.json');
    let prepJson = await $.getJSON(path + 'preprocessing.json')
    let prep = Preprocessor.fromJson(prepJson)
    return new Model(model, prep)
  }
}

const MODEL_PATH = 'models/tfjs_model/prediction/';
let MODEL = undefined;
async function loadModel() {
  // MODEL = await tf.loadGraphModel(MODEL_PATH); 
  MODEL = await Model.fromDir(MODEL_PATH)
  let inp = {
    'Feature':'abcd',
    "NumFeature":123,
  }
  console.log(
    MODEL.predict(inp)
  );
  // let prep = await $.getJSON('models/tfjs_model/prediction/preprocessing.json')
  // console.log(prep);
}


function main() {
  loadModel()
}

main();