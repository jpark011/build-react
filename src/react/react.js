import { performUnitOfWork } from "./fiber.js";
import { TEXT_ELEMENT } from "./const.js";
import { isEvent, isGone, isProp, isNew } from "./utils.js";
import { commitWork } from "./commit.js";

export let deletions = null;
export let currentRoot = null;
export let wipRoot = null;
let nextUnitOfWork = null;

export function setWipRoot(root) {
  wipRoot = root;
}

export function setNextUnitOfWork(work) {
  nextUnitOfWork = work;
}

export function resetDeletions() {
  deletions = [];
}

export function createDom(fiber) {
  const dom =
    fiber.type === TEXT_ELEMENT
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  updateDom(dom, {}, fiber.props);

  return dom;
}

export function updateDom(dom, prevProps, nextProps) {
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
