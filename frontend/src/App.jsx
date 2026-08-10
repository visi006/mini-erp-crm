import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import CustomerDetails from "./pages/CustomerDetails";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";

function DashboardLayout({ children }) {
  return (
    <div>
      <Navbar />
      <Sidebar />

      <main>
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

  <Route path="/login" element={<Login />} />

  <Route
    path="/dashboard"
    element={<DashboardLayout />}
  />

  <Route
    path="/customers"
    element={<Customers />}
  />

  <Route
    path="/customers/:id"
    element={<CustomerDetails />}
  />

</Routes>
    </BrowserRouter>
  );
}

export default App;