import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../services/api';

const MyResources = () => {
  const [resources, setResources] = useState([]);

  const fetchMyResources = async () => {
    try {
      const res = await API.get('/resources/mine');
      setResources(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteResource = async (id) => {
    try {
      await API.delete(`/resources/${id}`);
      fetchMyResources();
    } catch (error) {
      alert('Error deleting resource');
    }
  };

  useEffect(() => {
    fetchMyResources();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="page-padding">
        <h2>My Resources</h2>

        <div className="grid">
          {resources.map((resource) => (
            <div key={resource._id} className="card">
              <h3>{resource.title}</h3>
              <p>{resource.description}</p>
              <p><strong>Category:</strong> {resource.category}</p>
              <p><strong>Status:</strong> {resource.availability ? 'Available' : 'Unavailable'}</p>

              <button
                className="danger-btn"
                onClick={() => deleteResource(resource._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyResources;