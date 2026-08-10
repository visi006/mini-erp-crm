import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const defaultCustomers = [
  {
    id: 1,
    name: "Rahul Traders",
    businessName: "Rahul Enterprises",
    mobile: "9876543210",
    email: "rahul@example.com",
    gstNumber: "29ABCDE1234F1Z5",
    customerType: "Wholesale",
    address: "Bangalore, Karnataka",
    status: "Active",
    followUpDate: "2026-08-15",
    notes: "Regular customer",
    followUps: [],
  },
  {
    id: 2,
    name: "ABC Stores",
    businessName: "ABC Retail",
    mobile: "9123456789",
    email: "abc@example.com",
    gstNumber: "29XYZAB5678C1Z2",
    customerType: "Retail",
    address: "Bangalore, Karnataka",
    status: "Lead",
    followUpDate: "2026-08-18",
    notes: "New lead",
    followUps: [],
  },
];

function Customers() {
  const [customers, setCustomers] = useState(() => {
    const savedCustomers = localStorage.getItem("customers");

    return savedCustomers
      ? JSON.parse(savedCustomers)
      : defaultCustomers;
  });

  const [showForm, setShowForm] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    businessName: "",
    gstNumber: "",
    customerType: "Retail",
    address: "",
    status: "Active",
    followUpDate: "",
    notes: "",
  });

  useEffect(() => {
    localStorage.setItem(
      "customers",
      JSON.stringify(customers)
    );
  }, [customers]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      mobile: "",
      email: "",
      businessName: "",
      gstNumber: "",
      customerType: "Retail",
      address: "",
      status: "Active",
      followUpDate: "",
      notes: "",
    });

    setEditingCustomerId(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingCustomerId) {
      setCustomers((currentCustomers) =>
        currentCustomers.map((customer) =>
          customer.id === editingCustomerId
            ? {
                ...customer,
                ...formData,
              }
            : customer
        )
      );

      alert("Customer updated successfully!");
    } else {
      const newCustomer = {
        id: Date.now(),
        ...formData,
        followUps: [],
      };

      setCustomers((currentCustomers) => [
        ...currentCustomers,
        newCustomer,
      ]);

      alert("Customer added successfully!");
    }

    resetForm();
  };

  const handleEdit = (customer) => {
    setEditingCustomerId(customer.id);

    setFormData({
      name: customer.name || "",
      mobile: customer.mobile || "",
      email: customer.email || "",
      businessName: customer.businessName || "",
      gstNumber: customer.gstNumber || "",
      customerType: customer.customerType || "Retail",
      address: customer.address || "",
      status: customer.status || "Active",
      followUpDate: customer.followUpDate || "",
      notes: customer.notes || "",
    });

    setShowForm(true);
  };

  const filteredCustomers = customers.filter((customer) => {
    const search = searchTerm.toLowerCase();

    return (
      customer.name.toLowerCase().includes(search) ||
      customer.businessName.toLowerCase().includes(search) ||
      customer.mobile.includes(search) ||
      customer.customerType.toLowerCase().includes(search) ||
      customer.status.toLowerCase().includes(search)
    );
  });

  return (
    <div className="page-container">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Customers</h1>

          <p>
            Manage your customers and CRM follow-ups
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => {
            setEditingCustomerId(null);

            setFormData({
              name: "",
              mobile: "",
              email: "",
              businessName: "",
              gstNumber: "",
              customerType: "Retail",
              address: "",
              status: "Active",
              followUpDate: "",
              notes: "",
            });

            setShowForm(true);
          }}
        >
          + Add Customer
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm ? (
        <div className="form-container">

          <div className="form-header">
            <div>
              <h2>
                {editingCustomerId
                  ? "Edit Customer"
                  : "Add Customer"}
              </h2>

              <p>
                {editingCustomerId
                  ? "Update customer information"
                  : "Enter customer information"}
              </p>
            </div>

            <button
              type="button"
              className="close-button"
              onClick={resetForm}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              <div className="form-field">
                <label>Customer Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter customer name"
                  required
                />
              </div>

              <div className="form-field">
                <label>Mobile</label>

                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  required
                />
              </div>

              <div className="form-field">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                />
              </div>

              <div className="form-field">
                <label>Business Name</label>

                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Enter business name"
                />
              </div>

              <div className="form-field">
                <label>GST Number</label>

                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  placeholder="Enter GST number"
                />
              </div>

              <div className="form-field">
                <label>Customer Type</label>

                <select
                  name="customerType"
                  value={formData.customerType}
                  onChange={handleChange}
                >
                  <option value="Retail">
                    Retail
                  </option>

                  <option value="Wholesale">
                    Wholesale
                  </option>

                  <option value="Distributor">
                    Distributor
                  </option>
                </select>
              </div>

              <div className="form-field">
                <label>Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Lead">
                    Lead
                  </option>

                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </div>

              <div className="form-field">
                <label>Follow-up Date</label>

                <input
                  type="date"
                  name="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleChange}
                />
              </div>

            </div>

            <div className="form-field">
              <label>Address</label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter customer address"
                rows="3"
              />
            </div>

            <div className="form-field">
              <label>Notes</label>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Enter customer notes"
                rows="3"
              />
            </div>

            <div className="form-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={resetForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
              >
                {editingCustomerId
                  ? "Update Customer"
                  : "Save Customer"}
              </button>

            </div>

          </form>
        </div>
      ) : (
        <>
          {/* Search */}
          <div className="search-section">

            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

          </div>

          {/* Customer Table */}
          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Business</th>
                  <th>Mobile</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Follow-up</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (

                    <tr key={customer.id}>

                      <td>
                        {customer.name}
                      </td>

                      <td>
                        {customer.businessName}
                      </td>

                      <td>
                        {customer.mobile}
                      </td>

                      <td>
                        {customer.customerType}
                      </td>

                      <td>
                        {customer.status}
                      </td>

                      <td>
                        {customer.followUpDate ||
                          "Not set"}
                      </td>

                      <td>

                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                          }}
                        >

                          {/* View */}
                          <Link
                            to={`/customers/${customer.id}`}
                          >
                            <button>
                              View
                            </button>
                          </Link>

                          {/* Edit */}
                          <button
                            onClick={() =>
                              handleEdit(customer)
                            }
                          >
                            Edit
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))
                ) : (

                  <tr>

                    <td
                      colSpan="7"
                      style={{
                        textAlign: "center",
                        padding: "20px",
                      }}
                    >
                      No customers found
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>
        </>
      )}

    </div>
  );
}

export default Customers;