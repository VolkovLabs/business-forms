/**
 * Mock @grafana/scenes
 * mostly prevent IntersectionObserver is not defined
 */
const getVariables = jest.fn();
const getTimeRange = jest.fn();

module.exports = {
  sceneGraph: {
    getVariables,
    getTimeRange,
  },
};
