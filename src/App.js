import React, { useState } from "react";
import * as ml5 from "ml5";
import "./App.css";
import ClassifyImage from "./components/ClassifyImage";

const App = () => {
  return (
    <div className="App">
      <ClassifyImage />
    </div>
  );
};

export default App;
