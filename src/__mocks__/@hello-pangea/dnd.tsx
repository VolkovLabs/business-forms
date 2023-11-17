const actual = jest.requireActual('@grafana/ui');

/**
 * Mock DragDropContext
 */
const DragDropContext = jest.fn(({ children }) => children);

/**
 * Mock Droppable
 */
const Droppable = jest.fn(({ children }) => children({}));

/**
 * Draggable
 */
const Draggable = jest.fn(({ children }) =>
  children(
    {
      draggableProps: {},
    },
    {}
  )
);

module.exports = {
  ...actual,
  DragDropContext,
  Droppable,
  Draggable,
};
