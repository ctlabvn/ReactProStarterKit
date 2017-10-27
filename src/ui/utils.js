const KEYCODE_Z = 90;
const KEYCODE_Y = 89;

export const ORDER_TYPE = {
  TAKE_AWAY: 2,
  DELIVERY: 3,
};

export const getSiblings = node => {
  let child = node.parentNode.firstChild;

  const siblings = [];
  for (; child; child = child.nextSibling)
    if (child.nodeType === 1 && child !== node) siblings.push(child);
  return siblings;
};

export const isUndo = e => {
  return (
    (e.ctrlKey || e.metaKey) &&
    e.keyCode === (e.shiftKey ? KEYCODE_Y : KEYCODE_Z)
  );
};

export const isRedo = e => {
  return (
    (e.ctrlKey || e.metaKey) &&
    e.keyCode === (e.shiftKey ? KEYCODE_Z : KEYCODE_Y)
  );
};

export const getSelection = el => {
  let start, end, rangeEl, clone;

  if (el.selectionStart !== undefined) {
    start = el.selectionStart;
    end = el.selectionEnd;
  } else {
    try {
      el.focus();
      rangeEl = el.createTextRange();
      clone = rangeEl.duplicate();

      rangeEl.moveToBookmark(document.selection.createRange().getBookmark());
      clone.setEndPoint("EndToStart", rangeEl);

      start = clone.text.length;
      end = start + rangeEl.text.length;
    } catch (e) {
      /* not focused or not visible */
    }
  }

  return { start, end };
};

export const setSelection = (el, selection) => {
  let rangeEl;

  try {
    if (el.selectionStart !== undefined) {
      el.focus();
      el.setSelectionRange(selection.start, selection.end);
    } else {
      el.focus();
      rangeEl = el.createTextRange();
      rangeEl.collapse(true);
      rangeEl.moveStart("character", selection.start);
      rangeEl.moveEnd("character", selection.end - selection.start);
      rangeEl.select();
    }
  } catch (e) {
    /* not focused or not visible */
  }
};

export const getCurrentLocation = () => {
  const defaultCoords = { latitude: 21.0595054, longitude: 105.7787773 };
  return new Promise(function(resolve, reject) {
    if (window.location.hostname === "localhost") return resolve(defaultCoords);

    if (navigator.geolocation) {
      // Call getCurrentPosition with success and failure callbacks
      navigator.geolocation.getCurrentPosition(
        function(ret) {
          resolve(ret.coords);
        },
        function(ret) {
          // reject(ret)
          console.log(ret);
          resolve(defaultCoords);
        }
      );
    } else {
      alert("Sorry, your browser does not support geolocation services.");
      resolve(defaultCoords);
    }
  });
};

export const validateLogin = (values) => {
  const errors = {}
  // first time it is empty
  if(!values) return errors
  if (!values.email) errors.email = 'Enter email'
  if (!values.password) errors.password = 'Enter password'

  return errors
};

export const extractMessage = (message) => {
  let messageValue = message.general;
  for(let key in message){
    if(key !== 'general'){
      messageValue = message[key];
      break;
    }
  }
  return messageValue;
}