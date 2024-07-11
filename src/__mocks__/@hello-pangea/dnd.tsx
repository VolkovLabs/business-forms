const actual = jest.requireActual('@grafana/ui');

/**
 * Mock DragDropContext
 */
const DragDropContextMock = ({ children }: any) => children;

const DragDropContext = jest.fn(DragDropContextMock);

/**
 * Mock Droppable
 */
const DroppableMock = ({ children }: any) => children({});

const Droppable = jest.fn(DroppableMock);

/**
 * Draggable
 */
const DraggableMock = ({ children }: any) =>
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
