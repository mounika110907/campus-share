import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../services/api';

const BorrowRequests = () => {
  const [incoming, setIncoming] = useState([]);
  const [mine, setMine] = useState([]);

  const fetchData = async () => {
    try {
      const incomingRes = await API.get('/borrow/incoming');
      const mineRes = await API.get('/borrow/mine');
      setIncoming(incomingRes.data);
      setMine(mineRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/borrow/${id}/status`, { status });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating request');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="page-padding">
        <h2>Incoming Borrow Requests</h2>

        <div className="grid">
          {incoming.map((req) => (
            <div key={req._id} className="card">
              <h3>{req.resource?.title}</h3>
              <p><strong>Borrower:</strong> {req.borrower?.name}</p>
              <p><strong>Department:</strong> {req.borrower?.department}</p>
              <p><strong>From:</strong> {new Date(req.startDate).toLocaleDateString()}</p>
              <p><strong>To:</strong> {new Date(req.endDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {req.status}</p>

              {req.status === 'pending' && (
                <div className="btn-group">
                  <button onClick={() => updateStatus(req._id, 'accepted')}>
                    Accept
                  </button>
                  <button
                    className="danger-btn"
                    onClick={() => updateStatus(req._id, 'rejected')}
                  >
                    Reject
                  </button>
                </div>
              )}

              {req.status === 'accepted' && (
                <button onClick={() => updateStatus(req._id, 'returned')}>
                  Mark Returned
                </button>
              )}
            </div>
          ))}
        </div>

        <h2>My Borrow Requests</h2>

        <div className="grid">
          {mine.map((req) => (
            <div key={req._id} className="card">
              <h3>{req.resource?.title}</h3>
              <p><strong>Owner:</strong> {req.owner?.name}</p>
              <p><strong>From:</strong> {new Date(req.startDate).toLocaleDateString()}</p>
              <p><strong>To:</strong> {new Date(req.endDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {req.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BorrowRequests;