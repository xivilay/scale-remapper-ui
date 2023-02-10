/* eslint-disable no-undef */

// existing methods used for plugin params retrieval
export const setParameterValueNotifyingHost = (paramId, value) =>
  global.setParameterValueNotifyingHost?.(paramId, value);

export const sendComputedKeysData = (value) =>
  global.sendComputedKeysData?.(value);