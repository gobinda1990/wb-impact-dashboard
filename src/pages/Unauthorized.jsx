import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center">
        <div className="display-1 text-danger fw-bold mb-3">🚫</div>
        <h2 className="text-dark mb-3">Access Denied</h2>
        <p className="text-muted mb-4">
          You do not have permission to view this page.  
          Please contact your administrator if you believe this is a mistake.
        </p>
        <button
          className="btn btn-primary px-4"
          onClick={() => navigate('/dashboard')}
        >
          Go Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
