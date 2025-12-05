import React, { useEffect, useState } from 'react';
import { fetchReports } from '../services/dashboardService';
import { getUserRole } from '../services/authService';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = getUserRole();

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchReports();
        setReports(data);
      } catch (err) {
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, []);

  return (
    <div className="container-fluid mt-4">
      <h2>Reports</h2>
      <div className="card">
        <div className="card-body">
          {loading ? (
            <p>Loading reports...</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Date</th>
                  {role !== 'Staff' && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {reports.map((r, i) => (
                  <tr key={i}>
                    <td>{r.title}</td>
                    <td>{r.type}</td>
                    <td>{new Date(r.date).toLocaleDateString()}</td>
                    {role !== 'Staff' && (
                      <td>
                        {role === 'Admin' && <button className="btn btn-sm btn-danger me-2">Delete</button>}
                        <button className="btn btn-sm btn-primary">View</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
