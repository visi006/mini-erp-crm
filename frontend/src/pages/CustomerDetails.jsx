import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [followUpNote, setFollowUpNote] = useState("");

  useEffect(() => {
    const savedCustomers =
      JSON.parse(localStorage.getItem("customers")) || [];

    const foundCustomer = savedCustomers.find(
      (item) => String(item.id) === String(id)
    );

    setCustomer(foundCustomer || null);
  }, [id]);

  const handleAddFollowUp = (e) => {
    e.preventDefault();

    if (!followUpNote.trim()) {
      return;
    }

    const savedCustomers =
      JSON.parse(localStorage.getItem("customers")) || [];

    const newFollowUp = {
      id: Date.now(),
      note: followUpNote,
      date: new Date().toLocaleString(),
    };

    const updatedCustomers = savedCustomers.map(
      (item) => {
        if (String(item.id) === String(id)) {
          return {
            ...item,
            followUps: [
              ...(item.followUps || []),
              newFollowUp,
            ],
          };
        }

        return item;
      }
    );

    localStorage.setItem(
      "customers",
      JSON.stringify(updatedCustomers)
    );

    const updatedCustomer = updatedCustomers.find(
      (item) => String(item.id) === String(id)
    );

    setCustomer(updatedCustomer);
    setFollowUpNote("");
  };

  if (!customer) {
    return (
      <div className="page-container">

        <h1>Customer Not Found</h1>

        <p>
          The requested customer could not be found.
        </p>

        <Link to="/customers">
          <button className="primary-button">
            Back to Customers
          </button>
        </Link>

      </div>
    );
  }

  return (
    <div className="page-container">

      {/* Header */}
      <div className="page-header">

        <div>
          <h1>Customer Details</h1>

          <p>
            View customer information and CRM follow-ups
          </p>
        </div>

        <Link to="/customers">
          <button className="secondary-button">
            ← Back to Customers
          </button>
        </Link>

      </div>

      {/* Customer Information */}
      <div className="details-container">

        <div className="details-header">

          <div>
            <h2>{customer.name}</h2>

            <p>
              {customer.businessName ||
                "Business name not provided"}
            </p>
          </div>

        </div>

        <div className="details-grid">

          <div className="detail-item">
            <span>Customer Name</span>
            <strong>{customer.name}</strong>
          </div>

          <div className="detail-item">
            <span>Business Name</span>
            <strong>
              {customer.businessName || "Not provided"}
            </strong>
          </div>

          <div className="detail-item">
            <span>Mobile</span>
            <strong>{customer.mobile}</strong>
          </div>

          <div className="detail-item">
            <span>Email</span>
            <strong>
              {customer.email || "Not provided"}
            </strong>
          </div>

          <div className="detail-item">
            <span>GST Number</span>
            <strong>
              {customer.gstNumber || "Not provided"}
            </strong>
          </div>

          <div className="detail-item">
            <span>Customer Type</span>
            <strong>
              {customer.customerType}
            </strong>
          </div>

          <div className="detail-item">
            <span>Status</span>
            <strong>{customer.status}</strong>
          </div>

          <div className="detail-item">
            <span>Follow-up Date</span>
            <strong>
              {customer.followUpDate || "Not set"}
            </strong>
          </div>

        </div>

        <div className="detail-section">

          <span>Address</span>

          <p>
            {customer.address ||
              "No address provided"}
          </p>

        </div>

        <div className="detail-section">

          <span>Notes</span>

          <p>
            {customer.notes ||
              "No notes added"}
          </p>

        </div>

      </div>

      {/* Follow-up Notes */}
      <div className="details-container">

        <h2>Add Follow-up Note</h2>

        <p>
          Record CRM follow-up activity for this customer.
        </p>

        <form onSubmit={handleAddFollowUp}>

          <div className="form-field">

            <label>
              Follow-up Note
            </label>

            <textarea
              value={followUpNote}
              onChange={(e) =>
                setFollowUpNote(e.target.value)
              }
              placeholder="Enter follow-up details..."
              rows="4"
            />

          </div>

          <button
            type="submit"
            className="primary-button"
          >
            + Add Follow-up Note
          </button>

        </form>

      </div>

      {/* Follow-up History */}
      <div className="details-container">

        <h2>Follow-up History</h2>

        {customer.followUps &&
        customer.followUps.length > 0 ? (

          customer.followUps
            .slice()
            .reverse()
            .map((followUp) => (

              <div
                key={followUp.id}
                className="detail-section"
              >

                <span>
                  {followUp.date}
                </span>

                <p>
                  {followUp.note}
                </p>

              </div>

            ))

        ) : (

          <p>
            No follow-up notes added yet.
          </p>

        )}

      </div>

    </div>
  );
}

export default CustomerDetails;