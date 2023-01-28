import { App } from "./app.js";
import React from "./react/index.js";

const container = document.getElementById("root");
React.render(<App name="foo" />, container);
