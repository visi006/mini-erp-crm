import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside>
      <h3>Menu</h3>

      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>

        <li>
          <Link to="/customers">Customers</Link>
        </li>

        <li>
          <Link to="/products">Products</Link>
        </li>

        <li>
          <Link to="/inventory">Inventory</Link>
        </li>

        <li>
          <Link to="/challans">Challans</Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;