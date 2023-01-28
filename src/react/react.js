import { performUnitOfWork } from "./fiber.js";
import { TEXT_ELEMENT, PLACEMENT, DELETION, UPDATE } from "./const.js";
import { isEvent, isGone, isProp, isNew } from "./utils.js";

export let deletions = null;
let nextUnitOfWork = null;
let wipRoot = null;
let currentRoot = null;

export function createDom(fiber) {
  const dom =
    fiber.type === TEXT_ELEMENT
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  updateDom(dom, {}, fiber.props);

  return dom;
}

function updateDom(dom, prevProps, nextProps) {
  Object.keys(prevProps)
    .filter(isProp)
    .filter(isGone(prevProps, nextProps))
    .forEach((key) => {
      dom[key] = "";
    });

  Object.keys(prevProps)
    .filter(isEvent)
    .filter(isGone(prevProps, nextProps) || isNew(prevProps, nextProps))
    .forEach((key) => {
      const eventType = key.toLowerCase().substring(2);

      dom.removeEventListener(eventType, prevProps[key]);
    });

  Object.keys(nextProps)
    .filter(isProp)
    .filter(isNew(prevProps, nextProps))
    .forEach((key) => {
      dom[key] = nextProps[key];
    });

  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((key) => {
      const eventType = key.toLowerCase().substring(2);

      dom.addEventListener(eventType, nextProps[key]);
    });
}

function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }
  const parentDom = fiber.parent.dom;

  switch (fiber.effectTag) {
    case PLACEMENT:
      fiber.dom && parentDom.appendChild(fiber.dom);
      break;
    case DELETION:
      parentDom.removeChild(fiber.dom);
      break;
    case UPDATE:
      updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

export function render(element, container) {
  deletions = [];
  nextUnitOfWork = wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
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
