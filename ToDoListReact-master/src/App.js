import React, { useEffect, useState } from "react";
import service from "./service.js";

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);

  async function getTodos() {
    const todos = await service.getTasks();
    setTodos(todos);
  }

  async function createTodo(e) {
    e.preventDefault();
    await service.addTask(newTodo);
    setNewTodo(""); //clear input
    await getTodos(); //refresh tasks list (in order to see the new one)
  }

  async function updateCompleted(todo, isComplete) {
    await service.setCompleted(todo.idItems,todo.name, isComplete);
    await getTodos(); //refresh tasks list (in order to see the updated one)
  }

  async function deleteTodo(idItems) {
    await service.deleteTask(idItems);
    await getTodos(); //refresh tasks list
  }

  useEffect(() => {
    getTodos();
  }, []);

  console.log("todos", todos);

  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <form onSubmit={createTodo}>
          <input
            className="new-todo"
            placeholder="Well, let's take on the day"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
        </form>
      </header>
      <section className="main" style={{ display: "block" }}>
        <ul className="todo-list">
        {todos && todos.map((todo,index) => {
            return (
              <li className={todo.isComplete ? "completed" : ""} key={index}>
                <div className="view">
                  <input
                    className="toggle"
                    type="checkbox"
                    defaultChecked={todo.isComplete}
                    onChange={(e) => {updateCompleted(todo, e.target.checked);console.log("todo",todo.name);console.log(e.target.checked)}}
                  />
                  <label>{todo.name}</label>
                  <button
                    className="destroy"
                    onClick={() => {deleteTodo(todo.idItems);console.log(todo.idItems)}}
                  ></button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </section>
  );
}

export default App;
