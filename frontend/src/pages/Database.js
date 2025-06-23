import React, { useState, useEffect } from "react";

const API_URL = "/api/items";

const Database = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ id: "", name: "" });

  const fetchItems = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addItem = async () => {
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setForm({ id: "", name: "" });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const updateItem = async () => {
    try {
      await fetch(`${API_URL}/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name }),
      });
      setForm({ id: "", name: "" });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteItem = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Database</h2>
      <div className="mb-3">
        <input
          type="text"
          name="id"
          placeholder="ID"
          value={form.id}
          onChange={handleChange}
          className="mr-2"
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="mr-2"
        />
        <button className="btn btn-primary mr-2" onClick={addItem}>
          Add
        </button>
        <button className="btn btn-secondary" onClick={updateItem}>
          Update
        </button>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteItem(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Database;
