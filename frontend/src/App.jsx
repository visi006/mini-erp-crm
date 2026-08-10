import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";

function DashboardLayout() {
  return (
    <div>
      <Navbar />
      <Sidebar />

      <main>
        <Dashboard />
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={<DashboardLayout />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;