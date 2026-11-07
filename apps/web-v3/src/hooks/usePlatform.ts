export const isAndroid = () =>
  typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent);
