import { CHILDREN } from "./const.js";

export function isEvent(key) {
  return key.startsWith("on");
}

export function isProp(key) {
  return key !== CHILDREN && !isEvent(key);
}

export function isNew(prev, next) {
  return (key) => prev[key] !== next[key];
}
export function isGone(prev, next) {
  return (key) => !(key in next);
}
