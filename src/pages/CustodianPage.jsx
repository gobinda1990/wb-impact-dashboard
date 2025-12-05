import React, { useEffect, useState } from 'react';
import { fetchCustodianAssets } from '../services/dashboardService';

const PAGE_SIZE = 8;

const CustodianAssetsPage = () => {
  const [assets, setAssets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchCustodianAssets();
        setAssets(data);
        setFiltered(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load assets.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 🔍 Search & filter
  useEffect(() => {
    let data = assets;

    if (searchTerm) {
      data = data.filter(
        (a) =>
          a.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.assetType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      data = data.filter((a) => a.status === statusFilter);
    }

    setFiltered(data);
    setPage(1);
  }, [searchTerm, statusFilter, assets]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="container-fluid mt-4">
      <h2 className="text-primary mb-4">📦 My Assets</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filters */}
      <div className="card shadow-sm border-0 mb-3">
        <div className="card-body row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label fw-bold">Search</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search asset name, type, or serial number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label fw-bold">Status</label>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="ACTIVE">Active</option>
              <option value="IN_USE">In Use</option>
              <option value="TRANSFERRED">Transferred</option>
              <option value="DISPOSED">Disposed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading && <p>Loading assets...</p>}

      {!loading && filtered.length > 0 && (
        <div className="card shadow-sm border-0">
          <div className="card-body table-responsive">
            <table className="table table-striped align-middle">
              <thead className="table-primary">
                <tr>
                  <th>#</th>
                  <th>Asset Name</th>
                  <th>Type</th>
                  <th>Serial No</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Project</th>
                  <th>Cost</th>
                  <th>Purchase Date</th>
                  <th>Last Audit</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((a, idx) => (
                  <tr key={a.assetId}>
                    <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                    <td>{a.assetName}</td>
                    <td>{a.assetType}</td>
                    <td>{a.serialNumber}</td>
                    <td>
                      <span
                        className={`badge ${
                          a.status === 'ACTIVE'
                            ? 'bg-success'
                            : a.status === 'IN_USE'
                            ? 'bg-primary'
                            : a.status === 'TRANSFERRED'
                            ? 'bg-warning text-dark'
                            : 'bg-secondary'
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td>{a.location}</td>
                    <td>{a.projectName}</td>
                    <td>₹{a.cost?.toLocaleString()}</td>
                    <td>{a.purchaseDate}</td>
                    <td>{a.lastAuditDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="card-footer d-flex justify-content-between align-items-center">
            <span className="text-muted small">
              Showing {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="btn-group">
              <button
                className="btn btn-outline-primary btn-sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                ◀ Prev
              </button>
              <button
                className="btn btn-outline-primary btn-sm"
                disabled={page === totalPages || filtered.length === 0}
                onClick={() => setPage(page + 1)}
              >
                Next ▶
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center text-muted py-4">No assets found.</div>
      )}
    </div>
  );
};

export default CustodianAssetsPage;
