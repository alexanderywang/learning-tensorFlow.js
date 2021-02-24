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
  const [xValues, setXValues] = useState([]);
  const [yValues, setYValues] = useState([]);
  const [xInputShape, setXInputShape] = useState([]);
  const [yInputShape, setYInputShape] = useState([]);
  // const [epochs, setEpochs] = useState(250);
  const [guess, setGuess] = useState(0);

  const setValues = e => {
    if (e.target.name === "xValues") {
      const xVals = e.target.value.split(",").map(str => str * 1);
      setXValues(xVals);
      setXInputShape([xValues.length, 1]);
    } else if (e.target.name === "yValues") {
      const yVals = e.target.value.split(",").map(str => str * 1);
      setYValues(yVals);
      setYInputShape([yValues.length, 1]);
    } else if (e.target.name === "guess") {
      setGuess(e.target.value * 1);
    }
  };
  const loadValues = e => {
    e.preventDefault();
    if (
      xValues.length < 5 ||
      yValues.length < 5 ||
      !xInputShape.length ||
      !yInputShape.length
    ) {
      console.log("not enough values");
      return;
    }
    console.log(xValues, yValues, xInputShape, yInputShape, guess);
    learnLinear();
  };

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
    // hardcoded:
    // const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]); // xvalues, shape of the array 6 rows and 1 column
    // const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1]);
    //dynamic
    const xs = tf.tensor2d(xValues, [xValues.length, 1]);
    const ys = tf.tensor2d(yValues, [yValues.length, 1]);
    console.log("model:", model);

    try {
      await model.fit(xs, ys, { epochs: 250 });
      const pred = model.predict(tf.tensor2d([guess], [1, 1]));
      console.log("prediction:", pred);
      setPrediction(pred);
    } catch (err) {
      console.log(err);
    }
    // train the model. inputs are xs, outputs are ys, epochs are # of iterations
    // await model.fit(xs, ys, { epochs: 250 });

    // document.getElementById("output field").innerText = model.predict(
    //   tf.tensor2d([20], [1, 1])
    // );
    // setPrediction(model.predict(tf.tensor2d([guess], [1, 1])));
  };

  // return <div>{prediction}</div>;
  return (
    <div>
      <form onSubmit={loadValues}>
        <h4>
          Please provide a minimum of 5 data points to learn from, separated by
          commas
        </h4>
        <h3>x values:</h3>
        <input type="text" name="xValues" onChange={setValues} />

        <h3>y values:</h3>
        <input type="text" name="yValues" onChange={setValues} />
        {/* <input
          type="number"
          name="epochs"
          placeholder={epochs}
          onChange={e => setEpochs(e.target.value)}
        >
          How many epochs (cycles) do you want to run? more is better
        </input> */}

        <h3>What value would you like me to predict for linear regression?</h3>
        <input type="number" name="guess" onChange={setValues} />
        <br></br>
        <button type="submit" onSubmit={loadValues}>
          Do some predicting!
        </button>
        <br></br>
      </form>
      <br></br>
      <div>Predicted value: {prediction}</div>
    </div>
  );
};

export default Regression;

/*
TODO
allow customizable input for (x,y), minimum 5 points?
allow customizable input for epochs

button to predict if given a new X value
return prediction

make new /pages with routes for practice with react-router
*/
