/* eslint-disable no-undef */

// existing methods used for plugin params retrieval
export const beginParameterChangeGesture = (paramId) =>
  global.beginParameterChangeGesture(paramId);

export const endParameterChangeGesture = (paramId) =>
  global.endParameterChangeGesture(paramId);

export const setParameterValueNotifyingHost = (paramId, value) =>
  global.setParameterValueNotifyingHost?.(paramId, value);