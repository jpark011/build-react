import React from "./react/index.js";

export function App(props) {
  return (
    <div id="foo">
      <a onClick={() => alert("clicked!")}>bar</a>
      <b />
      <h1>{props.name}</h1>
    </div>
  );
}
