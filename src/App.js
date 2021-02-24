import React, { useState } from "react";
import "./App.css";
import ClassifyImage from "./components/ClassifyImage";
import Regression from "./components/Regression";

const App = () => {
  return (
    <div className="App">
      <div>{/* <ClassifyImage /> */}</div>
      <div>
        <Regression />
      </div>
    </div>
  );
};

export default App;
