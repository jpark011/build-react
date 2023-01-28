const TEXT_ELEMENT = "TEXT_ELEMENT";
const CHILDREN = "children";

export function render(element, container) {
  const dom =
    element.type === TEXT_ELEMENT
      ? document.createTextNode("")
      : document.createElement(element.type);

  Object.entries(element.props)
    .filter(([key]) => key !== CHILDREN)
    .forEach(([key, value]) => (dom[key] = value));

  element.props.children.forEach((child) => render(child, dom));

  container.appendChild(dom);
}

export function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

function createTextElement(text) {
  return createElement(TEXT_ELEMENT, { nodeValue: text });
}
