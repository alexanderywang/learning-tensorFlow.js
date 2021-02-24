import React, { useState } from "react";
import * as tf from "@tensorflow/tfjs";

/****
 * npm install @tensorflow/tfjs
 * Train a model with input data
 * learnLinear is async because learning takes time. make it a habit to make it async
 * tf.sequential: outputs of one layer are the inputs to the next. simple stack of layers with no branching or skipping
 * dense layer: all the nodes are connected to each other in a layer. easy to define a simple neural network this way
 * compile after defining model. specify loss function. optimizer sgd: stochastic gradient descent
 *****/
const Regression = () => {
  const [prediction, setPrediction] = useState(0);

  const learnLinear = async () => {
    // define model for linear regression
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    // prepare model for training: specify loss and optimizer
    model.compile({
      loss: "meanSquaredError",
      optimizer: "sgd"
    });

    // tensors. synthetic data for training
    const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]); // xvalues, shape of the array 6 rows and 1 column
    const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1]);

    // train the model. inputs are xs, outputs are ys, epochs are # of iterations
    await model.fit(xs, ys, { epochs: 250 });

    // document.getElementById("output field").innerText = model.predict(
    //   tf.tensor2d([20], [1, 1])
    // );
    setPrediction(model.predict(tf.tensor2d([10], [1, 1])));
  };

  return <div>{prediction}</div>;
};

export default Regression;
