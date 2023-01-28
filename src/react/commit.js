import { PLACEMENT, DELETION, UPDATE } from "./const.js";
import { updateDom } from "./react.js";

export function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  let parentFiber = fiber.parent;
  while (!parentFiber.dom) {
    parentFiber = parentFiber.parent;
  }
  const parentDom = parentFiber.dom;

  switch (fiber.effectTag) {
    case PLACEMENT:
      fiber.dom && parentDom.appendChild(fiber.dom);
      break;
    case DELETION:
      deleteFiber(fiber, parentDom);
      break;
    case UPDATE:
      updateDom(fiber.dom, fiber.alternate.props, fiber.props);
      break;
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function deleteFiber(fiber, parentDom) {
  if (fiber.dom) {
    parentDom.removeChild(fiber.dom);
  } else {
    deleteFiber(fiber.child, parentDom);
  }
}
