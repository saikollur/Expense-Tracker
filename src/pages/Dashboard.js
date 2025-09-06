// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import api from "../services/api";
import Charts from "../components/Charts"; // 👈 import your chart component

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ title: "", amount: "", category: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // fetch list
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Add or update
  const submitForm = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.amount || !form.category) {
      setError("Please fill all fields");
      return;
    }

    try {
      const payload = { ...form, amount: Number(form.amount) };

      if (editingId) {
        const res = await api.put(`/expenses/${editingId}`, payload);
        setExpenses((prev) =>
          prev.map((ex) => (ex._id === editingId ? res.data : ex))
        );
        setEditingId(null);
      } else {
        const res = await api.post("/expenses", payload);
        setExpenses((prev) => [res.data, ...prev]);
      }

      setForm({ title: "", amount: "", category: "" });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Operation failed");
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense._id);
    setForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this expense?");
    if (!ok) return;
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Delete failed");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h1>Expense Tracker</h1>

      {/* Form */}
      <form onSubmit={submitForm} style={{ marginBottom: 20 }}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={{ marginRight: 8 }}
        />
        <input
          placeholder="Amount"
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          style={{ marginRight: 8 }}
        />
        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          style={{ marginRight: 8 }}
        />
        <button type="submit">
          {editingId ? "Update Expense" : "Add Expense"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({ title: "", amount: "", category: "" });
            }}
            style={{ marginLeft: 8 }}
          >
            Cancel
          </button>
        )}
      </form>

      {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h2>Your expenses</h2>
          {expenses.length === 0 ? (
            <div>No expenses yet</div>
          ) : (
            <table
              width="100%"
              border="1"
              cellPadding="8"
              style={{ borderCollapse: "collapse" }}
            >
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp._id}>
                    <td>{exp.title}</td>
                    <td>{exp.amount}</td>
                    <td>{exp.category}</td>
                    <td>{new Date(exp.date).toLocaleString()}</td>
                    <td>
                      <button onClick={() => handleEdit(exp)}>Edit</button>
                      <button
                        onClick={() => handleDelete(exp._id)}
                        style={{ marginLeft: 8 }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* 📊 Charts Section */}
          {expenses.length > 0 && (
            <div style={{ marginTop: 40 }}>
              <h2>Spending Overview</h2>
              <Charts expenses={expenses} /> {/* 👈 pass expenses here */}
            </div>
          )}
        </>
      )}
    </div>
  );
}
