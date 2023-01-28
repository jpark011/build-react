import { performUnitOfWork } from "./fiber.js";
import { TEXT_ELEMENT, CHILDREN } from "./const.js";

let nextUnitOfWork = null;
let wipRoot = null;

export function createDom(fiber) {
  const dom =
    fiber.type === TEXT_ELEMENT
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  Object.entries(fiber.props)
    .filter(([key]) => key !== CHILDREN)
    .forEach(([key, value]) => (dom[key] = value));

  return dom;
}

function commitRoot() {
  commitWork(wipRoot.child);
  wipRoot = null;
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }
  const parentDom = fiber.parent.dom;
  parentDom.appendChild(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

export function render(element, container) {
  nextUnitOfWork = wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
  };
}

function workLoop(deadline) {
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = (deadline.timeRemaining?.() ?? 0) < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);
