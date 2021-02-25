import React, { useState } from "react";
import * as tf from "@tensorflow/tfjs";

/****************
     * model.fit doesn't seem to be working. Uncaught (in promise) TypeError: Cannot read property 'shape' of undefined

     *******************/


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
    // console.log(xValues, yValues, xInputShape, yInputShape, guess);
    learnLinear();
  };

  const learnLinear = async () => {
    // define model for linear regression
    const model = tf.sequential();
    // model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    /*
    The prediction values differs at each refresh because at each refresh there is a new training. The model weights are initialized with random values. During the training, the weights can either converge to optimum values or diverge. It depends on many parameters. Actually even the best model will not always converge at a fixed number of training epochs.

To always have the same value, the initial values of the weights can be set with fixed data. But again how to find this data that will lead to a best prediction ? That's not always easy to find those weights. A simple way to initialize a layer weights would be to use the kernelInitializer of the layer.

This new layer will have its weights initialized with 0. It is possible to use ones as well. Others initializers are possible. With fixed weights, the prediction will not change. But in practice weights are rarely initialized because of what is mentioned above unless one know for a certainty what possible values will lead to a good accuracy. What is done on the other hand is to track the model accuracy and create a checkpoint once there is a model with a satisfying accuracy.
*/
    model.add(
      tf.layers.dense({
        inputShape: [1],
        units: 1,
        useBias: true,
        kernelInitializer: "zeros"
      })
    );

    // const model = tf.sequential({
    //   layers: [tf.layers.dense({ units: 1, inputShape: [1] })]
    // });

    // prepare model for training: specify loss and optimizer
    // console.log("created?", JSON.stringify(model.outputs[0].shape));
    // tf.tensor([1, 2, 3, 4]).print();
    // tf.tensor([1, 2, 3, 4], [2, 2]).print();
    // tf.tensor2d([1, 2, 3, 4], [4, 1]).print();

    model.compile({
      loss: "meanSquaredError",
      optimizer: "sgd"
    });

    // tensors. synthetic data for training
    // hardcoded:
    const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]); // xvalues, shape of the array 6 rows and 1 column
    const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1]);
    //dynamic
    // const xs = tf.tensor2d(xValues, [xValues.length, 1]);
    // const ys = tf.tensor2d(yValues, [yValues.length, 1]);

    /****************
     * model.fit doesn't seem to be working. Uncaught (in promise) TypeError: Cannot read property 'shape' of undefined

     */

    await model.fit(xs, ys, { epochs: 250 });
    const pred = model.predict(tf.tensor2d([10], [1, 1]));
    console.log("prediction:", pred, JSON.stringify(pred));
    setPrediction(pred);
    console.log("model:", model);

    // try {
    //   await model.fit(xs, ys, { epochs: 250 });
    //   const pred = await model.predict(tf.tensor2d([guess], [1, 1]));
    //   console.log("prediction:", JSON.stringify(pred));
    //   setPrediction(pred);
    // } catch (err) {
    //   console.log(err);
    // }
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
      {prediction && <div>Predicted value: `${prediction.id}`</div>}
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
