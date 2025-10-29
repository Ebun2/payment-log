import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#4CAF50", "#FF5252"]; 
function TransactionCharts() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );
        const data = await response.json();

        const transformed = data.map((user, index) => {
          // Generate random hour between 0-23 for better distribution
          const randomHour = Math.floor(Math.random() * 24);
          const randomDate = new Date();
          randomDate.setHours(randomHour);

          return {
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
            createdAt: randomDate,
          };
        });

        setUsers(transformed);
        setLoading(false);
        console.log("Transformed users for charts:", transformed);
      } catch (err) {
        console.error("Error fetching users:", err);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  
  const groupByTime = (data) => {
    const buckets = {
      "00:00 - 06:00": 0,
      "06:00 - 12:00": 0,
      "12:00 - 18:00": 0,
      "18:00 - 24:00": 0,
    };

    data.forEach((txn) => {
      if (!txn.createdAt) return;
      const hour = new Date(txn.createdAt).getHours();
      if (hour < 6) buckets["00:00 - 06:00"]++;
      else if (hour < 12) buckets["06:00 - 12:00"]++;
      else if (hour < 18) buckets["12:00 - 18:00"]++;
      else buckets["18:00 - 24:00"]++;
    });

    return Object.keys(buckets).map((key) => ({
      timeRange: key,
      count: buckets[key],
    }));
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Loading transaction data...</p>
      </div>
    );
  }

  // Calculate pie chart data
  const successCount = users.filter(
    (u) => u.transactionStatus === "Successful"
  ).length;
  const failCount = users.filter(
    (u) => u.transactionStatus === "Failed"
  ).length;

  const pieData = [
    { name: "Successful", value: successCount },
    { name: "Unsuccessful", value: failCount },
  ];

  // Calculate bar chart data
  const barData = groupByTime(users);

  const renderCustomLabel = ({ name, percent }) => {
    return `${name}: ${(percent * 100).toFixed(1)}%`;
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5",width: "100%" }}>
      <h2 style={{ color: "#800000", marginBottom: "20px", fontSize: "24px" }}>
        Transaction Analytics
      </h2>

      {/* Stats Summary */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        marginBottom: "30px"
      }}>
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          textAlign: "center"
        }}>
          <h3 style={{ margin: "0 0 10px 0", fontSize: "16px", color: "#666" }}>Total Transactions</h3>
          <p style={{ fontSize: "32px", fontWeight: "bold", color: "#333", margin: 0 }}>
            {users.length}
          </p>
        </div>
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          textAlign: "center"
        }}>
          <h3 style={{ margin: "0 0 10px 0", fontSize: "16px", color: "#666" }}>Successful</h3>
          <p style={{ fontSize: "32px", fontWeight: "bold", color: "#4CAF50", margin: "0 0 5px 0" }}>
            {successCount}
          </p>
          <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
            {users.length > 0 ? ((successCount / users.length) * 100).toFixed(1) : 0}% of total
          </p>
        </div>
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          textAlign: "center"
        }}>
          <h3 style={{ margin: "0 0 10px 0", fontSize: "16px", color: "#666" }}>Unsuccessful</h3>
          <p style={{ fontSize: "32px", fontWeight: "bold", color: "#FF5252", margin: "0 0 5px 0" }}>
            {failCount}
          </p>
          <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
            {users.length > 0 ? ((failCount / users.length) * 100).toFixed(1) : 0}% of total
          </p>
        </div>
      </div>

      {/* Charts Container */}
      <div
        style={{
          display: "grid",
           gridTemplateColumns: "1fr 1fr",
          gap: "30px",
          marginTop: "30px",
        }}
      >
        {/* Pie Chart */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              textAlign: "center",
              marginBottom: "20px",
              color: "#333",
              fontSize: "18px",
            }}
          >
            Transaction Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={450}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={140}
                label={renderCustomLabel}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              textAlign: "center",
              marginBottom: "20px",
              color: "#333",
              fontSize: "18px",
            }}
          >
            Transactions by Time of Day (6-Hour Intervals)
          </h3>
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timeRange" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#800000" name="Transaction Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default TransactionCharts;