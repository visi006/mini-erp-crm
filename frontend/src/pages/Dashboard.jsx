function Dashboard() {
  return (
    <div className="dashboard">

      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome to Mini ERP CRM</p>
        </div>
      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <h3>Total Customers</h3>
          <p>0</p>
        </div>

        <div className="stat-card">
          <h3>Total Products</h3>
          <p>0</p>
        </div>

        <div className="stat-card">
          <h3>Low Stock Products</h3>
          <p>0</p>
        </div>

        <div className="stat-card">
          <h3>Total Challans</h3>
          <p>0</p>
        </div>

      </div>

      <div className="dashboard-section">
        <h2>Recent Challans</h2>

        <p>No challans available yet.</p>
      </div>

      <div className="dashboard-section">
        <h2>Low Stock Products</h2>

        <p>No low stock products.</p>
      </div>

    </div>
  );
}

export default Dashboard;