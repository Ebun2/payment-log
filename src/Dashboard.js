 import axios from "axios";
import React, {useEffect} from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";



function Dashboard({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const getHeaderTitle = () => {
  if (location.pathname.endsWith("/report")) return "Report";
  if (location.pathname.endsWith("/upload")) return "Upload";
  if (location.pathname.endsWith("/transactioncharts")) return "Transaction Charts";
  return "Payment Log";
};

  

  const handleLogout = () => {
    onLogout();              // 🔥 clears login state in App.js
    navigate("/login");      // 🔥 redirect back to login page
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Admin</h2>
        <nav>
          <ul>
            <li><Link to="home">Payment Log</Link></li>
            <li><Link to="transactioncharts">Transaction Charts</Link></li>
            <li><Link to="report">Report</Link></li>
            <li><Link to="upload">Upload</Link></li>
          </ul>
        </nav>
        <button onClick={handleLogout}>Logout</button>
      </aside> 

      {/* Main Content */}
      <div className="main">
        <header className="header">
          <h1>{getHeaderTitle()}</h1>
        </header>

        <main className="content">
          <Outlet />
        </main>

        <footer className="footer">
          <p>© 2025 Admin Dashboard | Powered by React</p>
        </footer>
      </div>
    </div>
  );
}

export default Dashboard;

