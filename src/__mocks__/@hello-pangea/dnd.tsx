const actual = jest.requireActual('@grafana/ui');

/**
 * Mock DragDropContext
 */
const DragDropContextMock = ({ children }) => children;

const DragDropContext = jest.fn(DragDropContextMock);

/**
 * Mock Droppable
 */
const DroppableMock = ({ children }) => children({});

const Droppable = jest.fn(DroppableMock);

/**
 * Draggable
 */
const DraggableMock = ({ children }) =>
  children(
    {
      draggableProps: {},
    },
    {}
  );

const Draggable = jest.fn(DraggableMock);

/**
 * Set mocks
 */
beforeEach(() => {
  DragDropContext.mockImplementation(DragDropContextMock);
  Droppable.mockImplementation(DroppableMock);
  Draggable.mockImplementation(DraggableMock);
});

module.exports = {
  ...actual,
  DragDropContext,
  Droppable,
  Draggable,
};
