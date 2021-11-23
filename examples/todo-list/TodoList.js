import {createState} from 'react-patty/sync';
import {useValue, useDispatch} from 'react-patty';

let id = 0;

const TodoList = createState([], (prev, action) => {
  switch (action.type) {
    case 'ADD':
      return [...prev, {id: id++, text: action.payload.text, completed: false}];
    case 'TOGGLE_COMPLETED':
      return prev.map((todo) => {
        if (todo.id === action.payload.id) {
          return {...todo, completed: !todo.completed};
        }
        return todo;
      });
    default:
      return prev;
  }
});

if (process.env.NODE_ENV !== 'production') {
  TodoList.displayName = 'TodoList';
}

export const TodoListProvider = TodoList.Provider;

export function useTodoList() {
  const dispatch = useDispatch(TodoList);
  return {
    todos: useValue(TodoList),
    add: (text) => dispatch({type: 'ADD', payload: {text}}),
    toggleCompleted: (id) =>
      dispatch({type: 'TOGGLE_COMPLETED', payload: {id}}),
  };
}
