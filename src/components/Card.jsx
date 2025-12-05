import React from "react";

const StatCard = ({ title, value, icon, color }) => (
  <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
    <div className={`card text-white shadow-sm h-100 ${color}`}>
      <div className="card-body d-flex align-items-center justify-content-between flex-wrap">
        <div className="mb-2">
          <h6 className="fw-semibold mb-1">{title}</h6>
          <h3 className="fw-bold">{value}</h3>
        </div>
        <div className="fs-1">{icon}</div>
      </div>
    </div>
  </div>
);

export default Card;
