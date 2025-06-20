import React, { useEffect, useState } from "react";

const username = "nanceap";
const apiBaseUrl = "https://playground.4geeks.com/todo";

const List = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    fetch(`${apiBaseUrl}/users/${username}`)
      .then((res) => {
        if (res.status === 404) {
          return fetch(`${apiBaseUrl}/users/${username}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
          });
        }
        return res;
      })
      .then(() => getTasks());
  }, []);

  const getTasks = () => {
    fetch(`${apiBaseUrl}/users/${username}`)
      .then((res) => res.json())
      .then((data) => setTasks(data.todos || []));
  };

  const handleAddTask = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      const newTask = {
        label: inputValue,
        done: false
      };

      fetch(`${apiBaseUrl}/todos/${username}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask)
      }).then(() => {
        setInputValue("");
        getTasks();
      });
    }
  };

  const handleDelete = (taskId) => {
    fetch(`${apiBaseUrl}/todos/${username}/${taskId}`, {
      method: "DELETE"
    }).then(() => getTasks());
  };

  const handleDeleteAll = () => {
    fetch(`${apiBaseUrl}/users/${username}`, {
      method: "DELETE"
    }).then(() => {
      setTasks([]);
      fetch(`${apiBaseUrl}/users/${username}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      }).then(() => getTasks());
    });
  };

  return (
    <div className="todo-container">
      <h1 className="text-center my-4">TODO List</h1>
      <input
        type="text"
        className="form-control"
        placeholder="Agregar tarea"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleAddTask}
      />

      <ul className="list-group mt-2">
        {tasks.length === 0 ? (
          <li className="list-group-item text-muted">
            No hay tareas, añadir tareas
          </li>
        ) : (
          tasks.map((task) => (
            <li
              key={task.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {task.label}
              <button
                className="btn btn-sm text-danger delete-btn"
                onClick={() => handleDelete(task.id)}
              >
                ❌
              </button>
            </li>
          ))
        )}
      </ul>

      <div className="footer text-muted px-2 py-1">
        {tasks.length} tarea{tasks.length !== 1 ? "s" : ""} pendiente
      </div>

      <button className="btn btn-danger mt-2" onClick={handleDeleteAll}>
        Eliminar todas
      </button>
    </div>
  );
};

export default List;








