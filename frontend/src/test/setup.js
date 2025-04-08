import '@testing-library/jest-dom'

// Mock for matchMedia which is not available in jsdom
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};
