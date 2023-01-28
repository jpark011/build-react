import { Counter } from "./Counter.js";
import React from "./react/index.js";

export function App(props) {
  return (
    <div id="foo">
      <a onClick={() => alert("clicked!")}>bar</a>
      <h1>{props.name}</h1>
      <br />
      <Counter />
    </div>
  );
}
