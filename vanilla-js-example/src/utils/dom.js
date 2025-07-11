// DOM操作のユーティリティ関数
export function $(selector) {
  return document.querySelector(selector);
}

export function $$(selector) {
  return document.querySelectorAll(selector);
}

export function createElement(tag, className = '', content = '') {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (content) element.innerHTML = content;
  return element;
}

export function addEventListener(element, event, handler) {
  if (typeof element === 'string') {
    element = $(element);
  }
  element?.addEventListener(event, handler);
}

export function addEventListenerAll(selector, event, handler) {
  $$(selector).forEach(element => {
    element.addEventListener(event, handler);
  });
}

export function show(element) {
  if (typeof element === 'string') {
    element = $(element);
  }
  element.style.display = 'block';
}

export function hide(element) {
  if (typeof element === 'string') {
    element = $(element);
  }
  element.style.display = 'none';
}

export function setHTML(element, html) {
  if (typeof element === 'string') {
    element = $(element);
  }
  element.innerHTML = html;
}

export function getValue(element) {
  if (typeof element === 'string') {
    element = $(element);
  }
  return element.value;
}

export function setValue(element, value) {
  if (typeof element === 'string') {
    element = $(element);
  }
  element.value = value;
}
