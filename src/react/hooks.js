import { wipFiber } from "./fiber.js";
import {
  currentRoot,
  resetDeletions,
  setNextUnitOfWork,
  setWipRoot,
  wipRoot,
} from "./react.js";

let hookIndex = null;

export function setHookIndex(index) {
  hookIndex = index;
}

export function useState(initial) {
  const oldHook = wipFiber.alternate?.hooks?.[hookIndex];
  const hook = {
    state: oldHook?.state ?? initial,
    queue: [],
  };
  const actions = oldHook?.queue ?? [];
  actions.forEach((action) => (hook.state = action(hook.state)));

  function setState(action) {
    hook.queue.push(action);
    setWipRoot({
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    });
    setNextUnitOfWork(wipRoot);
    resetDeletions();
  }

  wipFiber.hooks.push(hook);
  hookIndex++;
  return [hook.state, setState];
}
