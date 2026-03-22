import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const AddResource = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    imageUrl: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post('/resources', form);
      alert('Resource added successfully');
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding resource');
    }
  };

  return (
    <div>
      <Navbar />

      <div className="form-page">
        <form className="resource-form" onSubmit={handleSubmit}>
          <h2>Add Resource</h2>

          <input name="title" placeholder="Title" onChange={handleChange} required />
          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            required
          />
          <input name="category" placeholder="Category" onChange={handleChange} required />
          <input name="condition" placeholder="Condition" onChange={handleChange} required />
          <input
            name="imageUrl"
            placeholder="Image URL (optional)"
            onChange={handleChange}
          />

          <button type="submit">Add Resource</button>
        </form>
      </div>
    </div>
  );
};

export default AddResource;