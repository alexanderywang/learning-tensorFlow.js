import React, { useState } from "react";
import * as ml5 from "ml5";

const ClassifyImage = () => {
  // const initialState = {
  //   buttonText: "Click",
  //   imageURL: "",
  //   ready: false,
  //   predictionLabel: "",
  //   predictionConfidence: "",
  //   predicted: false
  // }
  const [buttonText, setButtonText] = useState("Click");
  const [imageURL, setImageURL] = useState("");
  const [ready, setReady] = useState(false);
  const [predictionLabel, setPredictionLabel] = useState("");
  const [predictionConfidence, setPredictionConfidence] = useState("");
  const [predicted, setPredicted] = useState(false);

  const loadImage = event => {
    const image = event.target.files[0];
    setImageURL(window.URL.createObjectURL(image));
  };
  /*******
   * Here we have an asynchronous function called classifyImage.
   * Inside this function, we first define our Image Classifier by loading the MobileNet data as the training set.
   * Once this classifier is ready, we set the ready state to true.
   * Then, we select the image inserted by the user and pass it to the classfier and run the predict function.
   * We save the highest prediction’s label and confidence level in the state object.

   *******/
  const classifyImage = async () => {
    const classifier = await ml5.imageClassifier("MobileNet");
    setReady(true);
    const image = document.getElementById("image");
    classifier.predict(image, 1, (err, results) => {
      console.log("results", results);
      setPredictionLabel(results[0].label);
      setPredictionConfidence(results[0].confidence);
      setPredicted(true);

      // this.setState({
      //   predictionLabel: results[0].label,
      //   predictionConfidence: results[0].confidence,
      //   predicted: true
      // });
    });
  };
  return (
    <div className="App">
      <input type="file" accept="image/*" onChange={loadImage} />
      {imageURL && (
        <div>
          <img id="image" src={imageURL} alt="to be classified" height={500} />
          <button onClick={classifyImage}>Classify</button>
        </div>
      )}
      {predicted && (
        <p>
          The app is {predictionConfidence * 100}% sure that this is{" "}
          {predictionLabel.split(",").join(" or ")}
        </p>
      )}
    </div>
  );
};

export default ClassifyImage;
