import React from "./react/index.js";

const element = (
  <div id="foo">
    <a onClick={() => alert("clicked!")}>bar</a>
    <b />
  </div>
);

const container = document.getElementById("root");
React.render(element, container);
