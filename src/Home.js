import React, { useEffect, useState } from "react";
import { axiosInstance } from "./axios";

function Home() {
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalAmount: 0,
    successCount: 0,
    successAmount: 0,
    failedCount: 0,
    failedAmount: 0,
  });

  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    email: "",
    name: "",
    membershipId: "",
    status: "",
    productCode: "",
    reference: "",
    account: "",
    amount: "",
    date: "",
  });

  
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; 

  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axiosInstance.post(
          "https://stag-gw.arm.com.ng/armonev2/wallet/transactionledgers/fetchfulltransactiondetails", { 
              "pageNumber": 1,
  "pageSize": 10
             }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }, 
          }
        );

        console.log(data?.data?.data)
        setUsers(data?.data?.data || []);

        const transformed = data.map((user, index) => ({
          ...user,
          membershipId: `MID-${1000 + index}`,
          transactionStatus: Math.random() > 0.5 ? "Successful" : "Failed",
          productCode: `P-${Math.floor(Math.random() * 900 + 100)}`,
          transactionReference: `TXN-${Math.random()
            .toString(36)
            .substring(2, 10)
            .toUpperCase()}`,
          accountNumber: Math.floor(
            1000000000 + Math.random() * 9000000000
          ).toString(),
          amount: Math.floor(Math.random() * 10000) + 1000,
          createdAt: new Date(),
        }));

        setUsers(transformed);
        console.log("Transformed users:", transformed);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  // Compute stats from users
  useEffect(() => {
    if (users.length > 0) {
      const success = users.filter((u) => u.transactionStatus === "Successful");
      const failed = users.filter((u) => u.transactionStatus === "Failed");

      setStats({
        totalTransactions: users.length,
        totalAmount: users.reduce((sum, u) => sum + u.amount, 0),
        successCount: success.length,
        successAmount: success.reduce((sum, u) => sum + u.amount, 0),
        failedCount: failed.length,
        failedAmount: failed.reduce((sum, u) => sum + u.amount, 0),
      });
    }
  }, [users]);

  // Filtering
  const filteredUsers = users.filter((user) => {
    const dateString = new Date(user.createdAt).toLocaleDateString();
    return (
      (filters.email === "" ||
        user.email.toLowerCase().includes(filters.email.toLowerCase())) &&
      (filters.name === "" ||
        user.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (filters.membershipId === "" ||
        user.membershipId
          .toLowerCase()
          .includes(filters.membershipId.toLowerCase())) &&
      (filters.status === "" ||
        user.transactionStatus
          ?.toLowerCase()
          .includes(filters.status.toLowerCase())) &&
      (filters.productCode === "" ||
        user.productCode?.toLowerCase().includes(filters.productCode.toLowerCase())) &&
      (filters.reference === "" ||
        user.transactionReference
          ?.toLowerCase()
          .includes(filters.reference.toLowerCase())) &&
      (filters.account === "" ||
        user.accountNumber?.toLowerCase().includes(filters.account.toLowerCase())) &&
      (filters.amount === "" || user.amount?.toString().includes(filters.amount)) &&
      (filters.date === "" || dateString.includes(filters.date))
    );
  });

  // Pagination Logic
  // Pagination

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + rowsPerPage);

  const handleFilterChange = (column, value) => {
    setFilters({ ...filters, [column]: value });
    setCurrentPage(1);
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Dashboard Overview */}
      <h2 className="overview-title">Dashboard Overview</h2>
      <div className="overview-container">
        <div className="overview-card">
          <h3>Total Transactions</h3>
          <div className="overview-details">
            <p><strong>Count:</strong> {stats.totalTransactions}</p>
            <p><strong>Amount:</strong> ₦{stats.totalAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className="overview-card">
          <h3>Successful Transactions</h3>
          <div className="overview-details">
            <p><strong>Count:</strong> {stats.successCount}</p>
            <p><strong>Amount:</strong> ₦{stats.successAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className="overview-card">
          <h3>Unsuccessful Transactions</h3>
          <div className="overview-details">
            <p><strong>Count:</strong> {stats.failedCount}</p>
            <p><strong>Amount:</strong> ₦{stats.failedAmount.toLocaleString()}</p>
          </div>
        </div>
      </div>
 
      {/* User Table */}
      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>S/N</th>
              <th>Email</th>
              <th>Name</th>
              <th>Membership ID</th>
              <th>Transaction Status</th>
              <th>Product Code</th>
              <th>Transaction Ref</th>
              <th>Account Number</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>

            <tr>
              <th></th>
              {Object.keys(filters).map((key) => (
                <th key={key}>
                  <input
                    type="text"
                    value={filters[key]}
                    onChange={(e) => handleFilterChange(key, e.target.value)}
                    placeholder="Filter..."
                  />
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <p>Testing...</p>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{startIndex + index + 1}</td>
                <td>{user.email}</td>
                <td>{user.name}</td>
                <td>{user.membershipId}</td>
                <td>{user.transactionStatus}</td>
                <td>{user.productCode}</td>
                <td>{user.transactionRefrence}</td>
                <td>{user.accountNumber}</td>
                <td>₦{user.amount.toLocaleString()}</td>
                <td>{new Date(user.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          style={{ marginRight: "10px" }}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          style={{ marginLeft: "10px" }}
        >
          Next
        </button>
      </div> */}
    </div>
  );
}

export default Home;
