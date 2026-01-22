import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ name: "", age: "" });
  const [editId, setEditId] = useState(null);

  // Fetch all patients
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/patients");
      setPatients(res.data);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  };

  // Add or Update patient
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Update existing patient
        await axios.put(`http://127.0.0.1:5000/patients/${editId}`, {
          name: form.name,
          age: Number(form.age)
        });
        setEditId(null);
      } else {
        // Create new patient
        await axios.post("http://127.0.0.1:5000/patients", {
          name: form.name,
          age: Number(form.age)
        });
      }
      setForm({ name: "", age: "" });
      fetchPatients();
    } catch (err) {
      console.error("Error saving patient:", err);
    }
  };

  // Delete patient
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/patients/${id}`);
      fetchPatients();
    } catch (err) {
      console.error("Error deleting patient:", err);
    }
  };

  // Edit patient (populate form)
  const handleEdit = (patient) => {
    setForm({ name: patient.name, age: patient.age });
    setEditId(patient._id);
  };

  return (
    <div className="container mt-4">
      <h2>Hospital Management - Patients</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-3">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="form-control mb-2"
          required
        />
        <input
          type="number"
          placeholder="Age"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
          className="form-control mb-2"
          required
        />
        <button className="btn btn-primary">
          {editId ? "Update Patient" : "Add Patient"}
        </button>
      </form>

      {/* Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th><th>Age</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.age}</td>
              <td>{p.status}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(p)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(p._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {patients.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">No patients found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
