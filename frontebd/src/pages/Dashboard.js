import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ResourceCard from '../components/ResourceCard';
import NotificationPanel from '../components/NotificationPanel';
import API from '../services/api';

const Dashboard = () => {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState('');

  const fetchResources = async () => {
    try {
      const res = await API.get('/resources');
      setResources(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const filteredResources = resources.filter((resource) =>
    resource.title.toLowerCase().includes(search.toLowerCase()) ||
    resource.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Navbar />

      <div className="dashboard-layout">
        <div className="main-content">
          <h2>Available Resources</h2>

          <input
            className="search-box"
            type="text"
            placeholder="Search by title or category"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="grid">
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource._id}
                resource={resource}
                refresh={fetchResources}
              />
            ))}
          </div>
        </div>

        <NotificationPanel />
      </div>
    </div>
  );
};

export default Dashboard;