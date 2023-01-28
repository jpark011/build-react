import React, { useState } from "./react/index.js";

export function Counter() {
  const [count, setCount] = useState(0);

  return <h1 onClick={() => setCount((count) => count + 1)}>{count}</h1>;
}
