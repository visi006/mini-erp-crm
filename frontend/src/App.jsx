import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import RoleProtectedRoute from "./components/RoleProtectedRoute";
import Challans from "./pages/Challans";
import StockMovement from "./pages/StockMovement";
import Products from "./pages/Products";
import CustomerDetails from "./pages/CustomerDetails";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";

function DashboardLayout({ children }) {
  return (
    <div className="app-layout">

      <Sidebar />

      <div className="main-section">

        <Navbar />

        <main>
          {children}
        </main>

      </div>

    </div>
  );
}

function ProtectedPage({ children }) {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ================= LOGIN ================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* ================= DASHBOARD ================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedPage>
              <Dashboard />
            </ProtectedPage>
          }
        />

        {/* ================= CUSTOMERS ================= */}

       <Route
  path="/customers"
  element={
    <RoleProtectedRoute
      allowedRoles={["Admin", "Sales"]}
    >
      <ProtectedPage>
        <Customers />
      </ProtectedPage>
    </RoleProtectedRoute>
  }
/>
        {/* ================= CUSTOMER DETAILS ================= */}

        <Route
          path="/customers/:id"
          element={
            <ProtectedPage>
              <CustomerDetails />
            </ProtectedPage>
          }
        />

        {/* ================= PRODUCTS ================= */}

       <Route
  path="/products"
  element={
    <RoleProtectedRoute
      allowedRoles={["Admin", "Warehouse"]}
    >
      <ProtectedPage>
        <Products />
      </ProtectedPage>
    </RoleProtectedRoute>
  }
/>

        {/* ================= INVENTORY ================= */}

       <Route
  path="/inventory"
  element={
    <RoleProtectedRoute
      allowedRoles={["Admin", "Warehouse"]}
    >
      <ProtectedPage>
        <Products />
      </ProtectedPage>
    </RoleProtectedRoute>
  }
/>

        {/* ================= STOCK MOVEMENT ================= */}

        <Route
  path="/stock-movement"
  element={
    <RoleProtectedRoute
      allowedRoles={["Admin", "Warehouse"]}
    >
      <ProtectedPage>
        <StockMovement />
      </ProtectedPage>
    </RoleProtectedRoute>
  }
/>

        {/* ================= CHALLANS ================= */}

       <Route
  path="/challans"
  element={
    <RoleProtectedRoute
      allowedRoles={["Admin", "Sales"]}
    >
      <ProtectedPage>
        <Challans />
      </ProtectedPage>
    </RoleProtectedRoute>
  }
/>
        {/* ================= DEFAULT ================= */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        {/* ================= 404 ================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;