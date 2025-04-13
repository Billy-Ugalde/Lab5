import { useState, useEffect } from 'react';
import React from 'react';
import './App.css';

function App() {
  interface Todo {
    description: string;
    completed?: boolean
    completedDate?: string
    id: number;
  }

  const [id, setId] = useState<number>();
  const [todoDescription, setTodoDescription] = useState('');
  const [todoList, setTodoList] = useState<Todo[]>([]);
  
  const [findId, setFindId] = useState<number>();
  const [updateDescription, setUpdateDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  
  useEffect(() => {
    const savedTodos = localStorage.getItem('todoList');
    if (savedTodos) {
      setTodoList(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    if (todoList.length > 0) {  
      localStorage.setItem('todoList', JSON.stringify(todoList));
    }
  }, [todoList]);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoDescription(e.target.value);
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setId(value === '' ? undefined : Number(value));
  };

  const handleClick = () => {
    if (!todoDescription.trim()) {
      alert('La descripción no puede estar vacía');
      return;
    }

    if (id === undefined || isNaN(id)) {
      alert('Debes ingresar un ID válido');
      return;
    }

    const idExists = todoList.some(todo => todo.id === id);
    if (idExists) {
      alert('El ID ya existe. No puedes duplicar IDs.');
      return;
    }

    const tempTodoList = [...todoList];
    const newTodo = {
      description: todoDescription.trim(),
      id: id
    };
    tempTodoList.unshift(newTodo);
    setTodoList(tempTodoList);
    setTodoDescription('');
    setId(undefined);
  };

 
  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateDescription(e.target.value);
  };

  const handleFindIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFindId(value === '' ? undefined : Number(value));
  };

  const handleFindTodo = () => {
    if (findId === undefined || isNaN(findId)) {
      alert('Debes ingresar un ID válido para buscar');
      setIsEditing(false);
      return;
    }

    const found = todoList.find(todo => todo.id === findId);
    if (found) {
      setIsEditing(true);
      setUpdateDescription(found.description);
    } else {
      alert('Todo no encontrado');
      setIsEditing(false);
    }
  };

  const handleUpdate = () => {
    if (!updateDescription.trim()) {
      alert('La nueva descripción no puede estar vacía');
      return;
    }

    const updatedTodoList = todoList.map(todo => {
      if (todo.id === findId) {
        return {
          ...todo,
          description: updateDescription.trim()
        };
      }
      return todo;
    });

    setIsEditing(false);
    setUpdateDescription('');
    setFindId(undefined);
    setTodoList(updatedTodoList);
  };

  const handleCheckboxChange = (index: number) => {
    const updatedList = [...todoList]
    const todo = updatedList[index]
    
    todo.completed = !todo.completed
    todo.completedDate = todo.completed ? new Date().toLocaleString() : undefined

    const completedTasks = updatedList.filter((t) => t.completed)
    const incompleteTasks = updatedList.filter((t) => !t.completed)
    setTodoList([...incompleteTasks, ...completedTasks])
  }


  return (
    <>
      <div style={{ border: '1px solid red', padding: 10 }}>
        <div>
          <input
            type="text"
            value={todoDescription}
            onChange={handleChange}
            placeholder="Descripción nueva"
            style={{ marginRight: 10 }}
          />
          <input
            type="number"
            value={id ?? ''}
            onChange={handleIdChange}
            placeholder="ID nuevo"
            style={{ marginRight: 10 }}
          />
          <button onClick={handleClick}>Add Item</button>
        </div>

        <br />

        {}
        <div>
          <input
            type="number"
            value={findId ?? ''}
            onChange={handleFindIdChange}
            placeholder="ID para buscar"
            style={{ marginRight: 10 }}
          />
          <button onClick={handleFindTodo}>Find </button>

          {isEditing && (
            <>
              <input
                type="text"
                value={updateDescription}
                onChange={handleUpdateChange}
                placeholder="Nueva descripción"
                style={{ marginRight: 10, marginTop: 10 }}
              />
              <button onClick={handleUpdate}>Update Item</button>
            </>
          )}
        </div>

        <br />

        {}
        <div><strong>Todos Here:</strong></div>
        <ul>
          {todoList.map((todo, index) => (
             <li key={index}>
             <input
               type="checkbox"
               checked={todo.completed}
               onChange={() => handleCheckboxChange(index)}
             />
             <p>Description:  {todo.description}, Id:  {todo.id} </p>
             {todo.completed && (
               <span>
                 (Hecho en: {todo.completedDate})
               </span>
             )}
           </li>
          ))}
        </ul>

      </div>
    </>
  );
}

export default App;
