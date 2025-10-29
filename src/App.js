// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Login from "./Login";
// import Dashboard from "./Dashboard";
// import Home from "./Home";
// import Report from "./Report";
// import Upload from "./Upload";
// import TransactionCharts from "./TransactionCharts";

// <Route path="/charts" element={<TransactionCharts />} />

// function App() {
//   // Track login state in React
//   const [isLoggedIn, setIsLoggedIn] = useState(
//     localStorage.getItem("isLoggedIn") === "true"
//   );

//   useEffect(() => {
//     const handleStorageChange = () => {
//       setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
//     };

//     window.addEventListener("storage", handleStorageChange);

//     return () => {
//       window.removeEventListener("storage", handleStorageChange);
//     };
//   }, []);

//   // When user logs in, update state + localStorage
//   const handleLogin = () => {
//     localStorage.setItem("isLoggedIn", "true");
//     setIsLoggedIn(true);
//   };

//   // When user logs out, clear everything
//   const handleLogout = () => {
//     localStorage.removeItem("isLoggedIn");
//     setIsLoggedIn(false);
//   };

//   return (
//     <Router>
//       <Routes>
//         {/* Login Page */}
//         <Route
//           path="/login"
//           element={
//             !isLoggedIn ? (
//               <Login onLogin={handleLogin} />
//             ) : (
//               <Navigate to="/dashboard/home" replace />
//             )
//           }
//         />

//         {/* Dashboard (Protected) */}
//         <Route
//           path="/dashboard"
//           element={
//             isLoggedIn ? (
//               <Dashboard onLogout={handleLogout} />
//             ) : (
//               <Navigate to="/login" replace />
//             )
//           }
//         >
//           <Route index element={<Navigate to="home" replace />} />
//           <Route path="home" element={<Home />} />
//           <Route path="report" element={<Report />} />
//           <Route path="upload" element={<Upload />} />
//         </Route>

//         {/* Default route */}
//         <Route path="/" element={<Navigate to="/login" replace />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Home from "./Home";
import Report from "./Report";
import Upload from "./Upload";
import TransactionCharts from "./TransactionCharts";
import { decryptData, encryptData } from "./encryption";
import { enc } from "crypto-js";
import { axiosInstance } from "./axios";


function App() {
  // Track login state in React
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === true
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === true);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // When user logs in, update state + localStorage
  const handleLogin = async (email, password) => {

    try {

       const response = await axiosInstance.post("https://stag-gw.arm.com.ng/armonev2/auth/login", {
        email: email,
        password: password,
        isPasswordEncrypted: false
      });

      const { token, user } =  response.data;
      console.log("Login successful. Token:", response.data);
      // Save token to local storage (optional)
      localStorage.setItem("token", response.data.data.token);

    

      // Call the parent function (for navigation)
      setIsLoggedIn(true);
      // window.location.replace("/dashboard/home");
      
    } catch (error) {
      alert("Login failed. Please check your credentials and try again.");
      console.error("Login error:", error);
      return;
    }








    

  //    if (email === "admin@test.com" && password === "12345") {
      
  // localStorage.setItem("isLoggedIn", "true");
  // const encryptedData = encryptData({ email, password });


  // console.log(encryptedData); // Log the encrypted data to the console
  // console.log(decryptData(encryptedData))
  //   setIsLoggedIn(true);
  //     // window.location.replace("/dashboard/home");
  //   } else {
  //     alert("Invalid credentials");
  //   }

   
  };

  // When user logs out, clear everything
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route
          path="/login"
          element={
            !isLoggedIn ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to="/dashboard/home" replace />
            )
          }
        />

        {/* Dashboard (Protected) */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="report" element={<Report />} />
          <Route path="upload" element={<Upload />} />
          <Route path="transactioncharts" element={<TransactionCharts />} />
        </Route>

        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

