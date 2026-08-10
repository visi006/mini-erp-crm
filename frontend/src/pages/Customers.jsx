import { useState } from "react";

function Customers() {
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [customers, setCustomers] = useState([
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
    },
  ]);

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

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add customer
  const handleSubmit = (e) => {
    e.preventDefault();

    const newCustomer = {
      id: Date.now(),
      ...formData,
    };

    setCustomers((currentCustomers) => [
      ...currentCustomers,
      newCustomer,
    ]);

    setShowForm(false);

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
  };

  // Search customers
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

      {/* ================= HEADER ================= */}

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
            setSelectedCustomer(null);
            setShowForm(true);
          }}
        >
          + Add Customer
        </button>

      </div>

      {/* ================= CUSTOMER DETAILS ================= */}

      {selectedCustomer && (
        <div className="details-container">

          <div className="details-header">

            <div>
              <h2>Customer Details</h2>

              <p>
                View customer information and follow-up notes
              </p>
            </div>

            <button
              type="button"
              className="close-button"
              onClick={() => setSelectedCustomer(null)}
            >
              ✕
            </button>

          </div>

          <div className="details-grid">

            <div className="detail-item">
              <span>Customer Name</span>
              <strong>
                {selectedCustomer.name}
              </strong>
            </div>

            <div className="detail-item">
              <span>Business Name</span>
              <strong>
                {selectedCustomer.businessName || "Not provided"}
              </strong>
            </div>

            <div className="detail-item">
              <span>Mobile</span>
              <strong>
                {selectedCustomer.mobile}
              </strong>
            </div>

            <div className="detail-item">
              <span>Email</span>
              <strong>
                {selectedCustomer.email || "Not provided"}
              </strong>
            </div>

            <div className="detail-item">
              <span>GST Number</span>
              <strong>
                {selectedCustomer.gstNumber || "Not provided"}
              </strong>
            </div>

            <div className="detail-item">
              <span>Customer Type</span>
              <strong>
                {selectedCustomer.customerType}
              </strong>
            </div>

            <div className="detail-item">
              <span>Status</span>
              <strong>
                {selectedCustomer.status}
              </strong>
            </div>

            <div className="detail-item">
              <span>Follow-up Date</span>
              <strong>
                {selectedCustomer.followUpDate || "Not set"}
              </strong>
            </div>

          </div>

          <div className="detail-section">

            <span>Address</span>

            <p>
              {selectedCustomer.address ||
                "No address provided"}
            </p>

          </div>

          <div className="detail-section">

            <span>Notes</span>

            <p>
              {selectedCustomer.notes ||
                "No notes added"}
            </p>

          </div>

        </div>
      )}

      {/* ================= ADD CUSTOMER FORM ================= */}

      {showForm ? (

        <div className="form-container">

          <div className="form-header">

            <h2>Add Customer</h2>

            <button
              type="button"
              className="close-button"
              onClick={() => setShowForm(false)}
            >
              ✕
            </button>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              {/* Customer Name */}

              <div className="form-field">

                <label>
                  Customer Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter customer name"
                  required
                />

              </div>

              {/* Mobile */}

              <div className="form-field">

                <label>
                  Mobile
                </label>

                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  required
                />

              </div>

              {/* Email */}

              <div className="form-field">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                />

              </div>

              {/* Business Name */}

              <div className="form-field">

                <label>
                  Business Name
                </label>

                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Enter business name"
                />

              </div>

              {/* GST Number */}

              <div className="form-field">

                <label>
                  GST Number
                </label>

                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  placeholder="Enter GST number"
                />

              </div>

              {/* Customer Type */}

              <div className="form-field">

                <label>
                  Customer Type
                </label>

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

              {/* Status */}

              <div className="form-field">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >

                  <option value="Active">
                    Active
                  </option>

                  <option value="Lead">
                    Lead
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                </select>

              </div>

              {/* Follow-up Date */}

              <div className="form-field">

                <label>
                  Follow-up Date
                </label>

                <input
                  type="date"
                  name="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* Address */}

            <div className="form-field">

              <label>
                Address
              </label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter customer address"
                rows="3"
              />

            </div>

            {/* Notes */}

            <div className="form-field">

              <label>
                Notes
              </label>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Enter follow-up notes"
                rows="3"
              />

            </div>

            {/* Buttons */}

            <div className="form-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
              >
                Save Customer
              </button>

            </div>

          </form>

        </div>

      ) : (

        /* ================= CUSTOMER LIST ================= */

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

          {/* Table */}

          <div className="table-container">

            <table>

              <thead>

                <tr>

                  <th>
                    Name
                  </th>

                  <th>
                    Business
                  </th>

                  <th>
                    Mobile
                  </th>

                  <th>
                    Type
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Follow-up
                  </th>

                  <th>
                    Action
                  </th>

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

                        <button
                          onClick={() =>
                            setSelectedCustomer(customer)
                          }
                        >
                          View
                        </button>

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