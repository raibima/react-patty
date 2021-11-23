import {useState} from 'react';
import {TodoListProvider, useTodoList} from '../TodoList';

export default function TodoList() {
  return (
    <TodoListProvider>
      <h1>Todo List</h1>
      <TodoListApp />
    </TodoListProvider>
  );
}

function TodoListApp() {
  const [todo, setTodo] = useState('');
  const {add, todos, toggleCompleted} = useTodoList();
  return (
    <div>
      <input
        placeholder="Press enter to submit"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && todo.length > 0) {
            add(todo);
            setTodo('');
          }
        }}
      />
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <label>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleCompleted(todo.id)}
              />
              {todo.text}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
