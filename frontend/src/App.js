import React, { useState, useEffect, useMemo } from "react";
import { CustomModal as Modal } from "./components/Modal";
import axios from "axios";

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

const TabList = ({viewCompleted, displayCompleted}) => {
  return (
    <div className="nav nav-tabs">
      <span
        className={viewCompleted ? "nav-link active" : "nav-link"}
        onClick={() => displayCompleted(true)}
      >
        Complete
      </span>
      <span
        className={viewCompleted ? "nav-link" : "nav-link active"}
        onClick={() => displayCompleted(false)}
      >
        Incomplete
      </span>
    </div>
  );
};

const Items = ({todoList, viewCompleted, handleDelete, editItem}) => {
  const newItems = useMemo(() => todoList.filter(
    (item) => item.completed === viewCompleted
  ), [todoList, viewCompleted]);

  return newItems.map((item) => (
    <li
      key={item.id}
      className="list-group-item d-flex justify-content-between align-items-center"
    >
      <span
        className={`todo-title mr-2 ${
          viewCompleted ? "completed-todo" : ""
        }`}
        title={item.description}
      >
        {item.title}
      </span>
      <span>
        <button
          className="btn btn-secondary mr-2"
          onClick={() => editItem(item)}
        >
          Edit
        </button>
        <button
          className="btn btn-danger"
          onClick={() => handleDelete(item)}
        >
          Delete
        </button>
      </span>
    </li>
  ));
};

export const App = () => {
  const [viewCompleted, setViewCompleted] = useState(false);

  const [todoList, setTodoList] = useState([]);

  const [modal, setModal] = useState(false);

  const [activeItem, setActiveItem] = useState({
    title: '',
    description: '',
    completed: false,
  });

  const refreshList = () => {
    axios
    .get("/api/todos/")
    .then((res) => setTodoList(res.data))
    .catch((err) => console.log(err));
  };

  useEffect(() => {
    refreshList();
  }, []);


  const toggle = () => {
    setModal(!modal);
  };

  const handleSubmit = (item) => {
    toggle();

    if (item.id) {
      axios
        .put(`/api/todos/${item.id}/`, item)
        .then((res) => refreshList());
        return;
    }
    axios
      .post('api/todos/', item)
      .then((res) => refreshList());
  };

  const handleDelete = (item) => {
    axios
      .delete(`/api/todos/${item.id}/`)
      .then((res) => refreshList());
  };

  const createItem = () => {
    const item = { title: "", description: "", completed: false };

    setActiveItem(item);
    toggle();
  };

  const editItem = (item) => {
    setActiveItem(item);
    toggle();
  };

  const displayCompleted = (status) => {
    if (status) {
      return setViewCompleted(true);
    }

    return setViewCompleted(false);
  };

  return (
      <main className="container">
        <h1 className="text-white text-uppercase text-center my-4">Todo app</h1>
        <div className="row">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="mb-4">
                <button
                  className="btn btn-primary"
                  onClick={createItem}
                >
                  Add task
                </button>
              </div>
              <TabList viewCompleted={viewCompleted} displayCompleted={displayCompleted} />
              <ul className="list-group list-group-flush border-top-0">
                <Items viewCompleted={viewCompleted} todoList={todoList} handleDelete={handleDelete} editItem={editItem} />
              </ul>
            </div>
          </div>
        </div>
        {modal && (
          <Modal
            inputItem={activeItem}
            toggle={toggle}
            onSave={handleSubmit}
          />
        )}
      </main>
    );
};
