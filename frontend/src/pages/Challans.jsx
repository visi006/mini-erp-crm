import { useEffect, useState } from "react";

function Challans() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [challans, setChallans] = useState(() => {
    const savedChallans = localStorage.getItem("challans");

    return savedChallans
      ? JSON.parse(savedChallans)
      : [];
  });

  const [showForm, setShowForm] = useState(false);
  const [selectedChallan, setSelectedChallan] = useState(null);
  const [editingChallan, setEditingChallan] = useState(null);

  const [formData, setFormData] = useState({
    customerId: "",
    status: "Draft",
    notes: "",
  });

  const [lineItems, setLineItems] = useState([
    {
      productId: "",
      quantity: 1,
    },
  ]);

  // ================= LOAD DATA =================

  useEffect(() => {
    const savedCustomers =
      JSON.parse(localStorage.getItem("customers")) || [];

    const savedProducts =
      JSON.parse(localStorage.getItem("products")) || [];

    setCustomers(savedCustomers);
    setProducts(savedProducts);
  }, []);

  // ================= SAVE CHALLANS =================

  useEffect(() => {
    localStorage.setItem(
      "challans",
      JSON.stringify(challans)
    );
  }, [challans]);

  // ================= FORM CHANGE =================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= LINE ITEM CHANGE =================

  const handleLineItemChange = (
    index,
    field,
    value
  ) => {
    const updatedItems = [...lineItems];

    updatedItems[index][field] = value;

    setLineItems(updatedItems);
  };

  // ================= ADD PRODUCT =================

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        productId: "",
        quantity: 1,
      },
    ]);
  };

  // ================= REMOVE PRODUCT =================

  const removeLineItem = (index) => {
    if (lineItems.length === 1) {
      return;
    }

    const updatedItems = lineItems.filter(
      (_, itemIndex) => itemIndex !== index
    );

    setLineItems(updatedItems);
  };

  // ================= GENERATE CHALLAN NUMBER =================

  const generateChallanNumber = () => {
    if (challans.length === 0) {
      return "CH-0001";
    }

    const numbers = challans.map((challan) => {
      const number =
        challan.challanNumber?.replace(
          "CH-",
          ""
        );

      return Number(number) || 0;
    });

    const highestNumber = Math.max(...numbers);

    return `CH-${String(
      highestNumber + 1
    ).padStart(4, "0")}`;
  };

  // ================= RESET FORM =================

  const resetForm = () => {
    setFormData({
      customerId: "",
      status: "Draft",
      notes: "",
    });

    setLineItems([
      {
        productId: "",
        quantity: 1,
      },
    ]);

    setEditingChallan(null);
    setShowForm(false);
  };

  // ================= EDIT CHALLAN =================

  const handleEditChallan = (challan) => {
    setEditingChallan(challan);

    setFormData({
      customerId: String(challan.customerId),
      status: challan.status,
      notes: challan.notes || "",
    });

    setLineItems(
      challan.items.map((item) => ({
        productId: String(item.productId),
        quantity: item.quantity,
      }))
    );

    setSelectedChallan(null);
    setShowForm(true);
  };

  // ================= CREATE / UPDATE =================

  const handleSubmit = (e) => {
    e.preventDefault();

    // Customer validation
    if (!formData.customerId) {
      alert("Please select a customer.");
      return;
    }

    // Product validation
    const validItems = lineItems.filter(
      (item) => item.productId
    );

    if (validItems.length === 0) {
      alert("Please add at least one product.");
      return;
    }

    // Duplicate product validation
    const productIds = validItems.map(
      (item) => String(item.productId)
    );

    const hasDuplicates =
      new Set(productIds).size !==
      productIds.length;

    if (hasDuplicates) {
      alert(
        "The same product cannot be added more than once."
      );
      return;
    }

    // Quantity validation
    for (const item of validItems) {
      if (
        !item.quantity ||
        Number(item.quantity) <= 0
      ) {
        alert(
          "Please enter a valid quantity for every product."
        );
        return;
      }
    }

    // Find customer
    const customer = customers.find(
      (item) =>
        String(item.id) ===
        String(formData.customerId)
    );

    if (!customer) {
      alert("Customer not found.");
      return;
    }

    // ================= PRODUCT SNAPSHOT =================

    const preparedItems = [];

    for (const item of validItems) {
      const product = products.find(
        (productItem) =>
          String(productItem.id) ===
          String(item.productId)
      );

      if (!product) {
        alert(
          "One of the selected products was not found."
        );
        return;
      }

      preparedItems.push({
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        quantity: Number(item.quantity),
        unitPrice: Number(product.unitPrice),
        amount:
          Number(item.quantity) *
          Number(product.unitPrice),
      });
    }

    // ================= STOCK CALCULATION =================

    let updatedProducts = [...products];

    /*
      Editing rules:

      Confirmed -> Confirmed
      Restore old stock, then deduct new stock.

      Confirmed -> Draft
      Restore old stock.

      Confirmed -> Cancelled
      Restore old stock.

      Draft -> Confirmed
      Deduct new stock.

      Draft -> Draft
      No stock change.

      Draft -> Cancelled
      No stock change.
    */

    // Restore stock from old confirmed challan
    if (
      editingChallan &&
      editingChallan.status === "Confirmed"
    ) {
      editingChallan.items.forEach(
        (oldItem) => {
          updatedProducts =
            updatedProducts.map(
              (product) => {
                if (
                  String(product.id) ===
                  String(oldItem.productId)
                ) {
                  return {
                    ...product,
                    currentStock:
                      Number(
                        product.currentStock
                      ) +
                      Number(oldItem.quantity),
                  };
                }

                return product;
              }
            );
        }
      );
    }

    // Check stock only for Confirmed
    if (formData.status === "Confirmed") {
      for (const item of preparedItems) {
        const product = updatedProducts.find(
          (productItem) =>
            String(productItem.id) ===
            String(item.productId)
        );

        if (!product) {
          alert(
            `Product ${item.productName} not found.`
          );
          return;
        }

        const availableStock = Number(
          product.currentStock
        );

        if (
          Number(item.quantity) >
          availableStock
        ) {
          alert(
            `Insufficient stock for ${item.productName}. Available stock: ${availableStock}`
          );

          return;
        }
      }
    }

    // Deduct stock for confirmed challan
    if (formData.status === "Confirmed") {
      preparedItems.forEach(
        (item) => {
          updatedProducts =
            updatedProducts.map(
              (product) => {
                if (
                  String(product.id) ===
                  String(item.productId)
                ) {
                  return {
                    ...product,
                    currentStock:
                      Number(
                        product.currentStock
                      ) -
                      Number(item.quantity),
                  };
                }

                return product;
              }
            );
        }
      );
    }

    // Save products
    setProducts(updatedProducts);

    localStorage.setItem(
      "products",
      JSON.stringify(updatedProducts)
    );

    // ================= TOTALS =================

    const totalQuantity =
      preparedItems.reduce(
        (total, item) =>
          total + Number(item.quantity),
        0
      );

    const subtotal =
      preparedItems.reduce(
        (total, item) =>
          total + Number(item.amount),
        0
      );

    const tax = 0;
    const discount = 0;

    const grandTotal =
      subtotal + tax - discount;

    // ================= UPDATE =================

    if (editingChallan) {
      const updatedChallan = {
        ...editingChallan,

        customerId: customer.id,

        customerName:
          customer.name,

        businessName:
          customer.businessName || "",

        items: preparedItems,

        totalQuantity,

        subtotal,

        tax,

        discount,

        grandTotal,

        status:
          formData.status,

        notes:
          formData.notes,

        challanNumber:
          editingChallan.challanNumber,

        createdBy:
          editingChallan.createdBy,

        createdDate:
          editingChallan.createdDate,

        updatedDate:
          new Date().toLocaleString(),
      };

      setChallans(
        (currentChallans) =>
          currentChallans.map(
            (challan) =>
              challan.id ===
              editingChallan.id
                ? updatedChallan
                : challan
          )
      );

      alert(
        `${editingChallan.challanNumber} updated successfully!`
      );

      resetForm();

      return;
    }

    // ================= CREATE =================

    const newChallan = {
      id: Date.now(),

      challanNumber:
        generateChallanNumber(),

      customerId:
        customer.id,

      customerName:
        customer.name,

      businessName:
        customer.businessName || "",

      items:
        preparedItems,

      totalQuantity,

      subtotal,

      tax,

      discount,

      grandTotal,

      status:
        formData.status,

      notes:
        formData.notes,

      createdBy:
        "Admin",

      createdDate:
        new Date().toLocaleString(),
    };

    setChallans(
      (currentChallans) => [
        ...currentChallans,
        newChallan,
      ]
    );

    alert(
      `Challan ${newChallan.challanNumber} created successfully!`
    );

    resetForm();
  };

  // ============================
  // RETURN
  // ============================

  return (
    <div className="page-container">

      {/* ================= HEADER ================= */}

      <div className="page-header">

        <div>

          <h1>
            Sales Challans
          </h1>

          <p>
            Create and manage sales challans
          </p>

        </div>

        <button
          className="primary-button"
          onClick={() => {

            setEditingChallan(null);
            setSelectedChallan(null);

            setFormData({
              customerId: "",
              status: "Draft",
              notes: "",
            });

            setLineItems([
              {
                productId: "",
                quantity: 1,
              },
            ]);

            setShowForm(true);
          }}
        >
          + Create Challan
        </button>

      </div>

      {/* ================= FORM ================= */}

      {showForm ? (

        <div className="form-container">

          {/* Form Header */}

          <div className="form-header">

            <div>

              <h2>
                {editingChallan
                  ? "Edit Sales Challan"
                  : "Create Sales Challan"}
              </h2>

              <p>
                {editingChallan
                  ? "Update challan information"
                  : "Add customer and product details"}
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

          <form
            onSubmit={handleSubmit}
          >

            {/* ================= CUSTOMER ================= */}

            <div className="form-grid">

              <div className="form-field">

                <label>
                  Customer
                </label>

                <select
                  name="customerId"
                  value={
                    formData.customerId
                  }
                  onChange={
                    handleChange
                  }
                  required
                >

                  <option value="">
                    Select Customer
                  </option>

                  {customers.map(
                    (customer) => (

                      <option
                        key={
                          customer.id
                        }
                        value={
                          customer.id
                        }
                      >
                        {customer.name}

                        {customer.businessName
                          ? ` - ${customer.businessName}`
                          : ""}
                      </option>

                    )
                  )}

                </select>

              </div>

              {/* Status */}

              <div className="form-field">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={
                    formData.status
                  }
                  onChange={
                    handleChange
                  }
                >

                  <option value="Draft">
                    Draft
                  </option>

                  <option value="Confirmed">
                    Confirmed
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>

                </select>

              </div>

            </div>

            {/* ================= PRODUCTS ================= */}

            <div
              style={{
                marginTop: "25px",
              }}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  marginBottom:
                    "15px",
                }}
              >

                <div>

                  <h3>
                    Products
                  </h3>

                  <p>
                    Add one or more products
                  </p>

                </div>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={
                    addLineItem
                  }
                >
                  + Add Product
                </button>

              </div>

              {lineItems.map(
                (item, index) => {

                  const selectedProduct =
                    products.find(
                      (product) =>
                        String(
                          product.id
                        ) ===
                        String(
                          item.productId
                        )
                    );

                  return (

                 <div
  key={index}
  style={{
    display: "grid",
    gridTemplateColumns:
      "minmax(250px, 2fr) minmax(120px, 1fr) minmax(120px, 1fr) 90px",
    gap: "12px",
    alignItems: "end",
    marginBottom: "15px",
    padding: "15px",
    background: "#f8f9fa",
    borderRadius: "8px",
  }}
>

                      {/* Product */}

                      <div className="form-field">

                        <label>
                          Product
                        </label>

                        <select
                          value={
                            item.productId
                          }
                          onChange={(
                            e
                          ) =>
                            handleLineItemChange(
                              index,
                              "productId",
                              e.target.value
                            )
                          }
                          required
                        >

                          <option value="">
                            Select Product
                          </option>

                          {products.map(
                            (
                              product
                            ) => (

                              <option
                                key={
                                  product.id
                                }
                                value={
                                  product.id
                                }
                              >
                                {
                                  product.name
                                }{" "}
                                (
                                {
                                  product.sku
                                }
                                )
                              </option>

                            )
                          )}

                        </select>

                      </div>

                      {/* Quantity */}

                      <div className="form-field">

                        <label>
                          Quantity
                        </label>

                        <input
                          type="number"
                          min="1"
                          value={
                            item.quantity
                          }
                          onChange={(
                            e
                          ) =>
                            handleLineItemChange(
                              index,
                              "quantity",
                              e.target.value
                            )
                          }
                          required
                        />

                      </div>

                      {/* Rate */}

                      <div className="form-field">

                        <label>
                          Rate
                        </label>

                        <input
                          type="text"
                          value={
                            selectedProduct
                              ? `₹${selectedProduct.unitPrice}`
                              : "₹0"
                          }
                          readOnly
                        />

                      </div>

                      {/* Remove */}

                      <button
                        type="button"
                        onClick={() =>
                          removeLineItem(
                            index
                          )
                        }
                        disabled={
                          lineItems.length ===
                          1
                        }
                        style={{
                          height:
                            "42px",
                        }}
                      >
                        Remove
                      </button>

                    </div>

                  );
                }
              )}

            </div>

            {/* ================= NOTES ================= */}

            <div className="form-field">

              <label>
                Notes
              </label>

              <textarea
                name="notes"
                value={
                  formData.notes
                }
                onChange={
                  handleChange
                }
                placeholder="Enter challan notes"
                rows="3"
              />

            </div>

            {/* ================= BUTTONS ================= */}

            <div className="form-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={
                  resetForm
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
              >
                {editingChallan
                  ? "Update Challan"
                  : "Create Challan"}
              </button>

            </div>

          </form>

        </div>

      ) : (

        <>

          {/* ================= VIEW CHALLAN ================= */}

          {selectedChallan ? (

            <div className="details-container">

              {/* Header */}

              <div className="details-header">

                <div>

                  <h2>
                    Challan Details
                  </h2>

                  <p>
                    View complete sales
                    challan information
                  </p>

                </div>

                <button
                  className="close-button"
                  onClick={() =>
                    setSelectedChallan(
                      null
                    )
                  }
                >
                  ✕
                </button>

              </div>

              {/* ================= INFORMATION ================= */}

              <div className="details-grid">

                <div className="detail-item">

                  <span>
                    Challan Number
                  </span>

                  <strong>
                    {
                      selectedChallan.challanNumber
                    }
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Customer
                  </span>

                  <strong>
                    {
                      selectedChallan.customerName
                    }
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Business Name
                  </span>

                  <strong>
                    {
                      selectedChallan.businessName ||
                      "N/A"
                    }
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Status
                  </span>

                  <strong>
                    {
                      selectedChallan.status
                    }
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Created By
                  </span>

                  <strong>
                    {
                      selectedChallan.createdBy
                    }
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Created Date
                  </span>

                  <strong>
                    {
                      selectedChallan.createdDate
                    }
                  </strong>

                </div>

              </div>

              {/* ================= PRODUCTS ================= */}

              <div className="detail-section">

                <h3>
                  Products
                </h3>

                <div className="table-container">

                  <table>

                    <thead>

                      <tr>

                        <th>
                          Product
                        </th>

                        <th>
                          SKU
                        </th>

                        <th>
                          Quantity
                        </th>

                        <th>
                          Rate
                        </th>

                        <th>
                          Amount
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {selectedChallan.items.map(
                        (
                          item,
                          index
                        ) => (

                          <tr
                            key={
                              index
                            }
                          >

                            <td>
                              {
                                item.productName
                              }
                            </td>

                            <td>
                              {
                                item.sku
                              }
                            </td>

                            <td>
                              {
                                item.quantity
                              }
                            </td>

                            <td>
                              ₹
                              {
                                item.unitPrice
                              }
                            </td>

                            <td>
                              ₹
                              {
                                item.amount
                              }
                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </div>

              {/* ================= SUMMARY ================= */}

              <div className="detail-section">

                <h3>
                  Challan Summary
                </h3>

                <div className="details-grid">

                  <div className="detail-item">

                    <span>
                      Total Quantity
                    </span>

                    <strong>
                      {
                        selectedChallan.totalQuantity
                      }
                    </strong>

                  </div>

                  <div className="detail-item">

                    <span>
                      Subtotal
                    </span>

                    <strong>
                      ₹
                      {
                        selectedChallan.subtotal
                      }
                    </strong>

                  </div>

                  <div className="detail-item">

                    <span>
                      Tax
                    </span>

                    <strong>
                      ₹
                      {
                        selectedChallan.tax
                      }
                    </strong>

                  </div>

                  <div className="detail-item">

                    <span>
                      Discount
                    </span>

                    <strong>
                      ₹
                      {
                        selectedChallan.discount
                      }
                    </strong>

                  </div>

                  <div className="detail-item">

                    <span>
                      Grand Total
                    </span>

                    <strong>
                      ₹
                      {
                        selectedChallan.grandTotal
                      }
                    </strong>

                  </div>

                </div>

              </div>

              {/* ================= NOTES ================= */}

              <div className="detail-section">

                <span>
                  Notes
                </span>

                <p>
                  {
                    selectedChallan.notes ||
                    "No notes added"
                  }
                </p>

              </div>

              {/* ================= ACTIONS ================= */}

              <div className="form-actions">

                <button
                  className="secondary-button"
                  onClick={() =>
                    handleEditChallan(
                      selectedChallan
                    )
                  }
                >
                  Edit Challan
                </button>

                <button
                  className="secondary-button"
                  onClick={() =>
                    setSelectedChallan(
                      null
                    )
                  }
                >
                  Back
                </button>

              </div>

            </div>

          ) : (

            /* ================= CHALLAN LIST ================= */

            <div className="table-container">

              <table>

                <thead>

                  <tr>

                    <th>
                      Challan No.
                    </th>

                    <th>
                      Customer
                    </th>

                    <th>
                      Total Qty
                    </th>

                    <th>
                      Total Amount
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Created By
                    </th>

                    <th>
                      Created Date
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {challans.length > 0 ? (

                    challans
                      .slice()
                      .reverse()
                      .map(
                        (challan) => (

                          <tr
                            key={
                              challan.id
                            }
                          >

                            <td>
                              {
                                challan.challanNumber
                              }
                            </td>

                            <td>
                              {
                                challan.customerName
                              }
                            </td>

                            <td>
                              {
                                challan.totalQuantity
                              }
                            </td>

                            <td>
                              ₹
                              {
                                challan.grandTotal
                              }
                            </td>

                            <td>
                              {
                                challan.status
                              }
                            </td>

                            <td>
                              {
                                challan.createdBy
                              }
                            </td>

                            <td>
                              {
                                challan.createdDate
                              }
                            </td>

                            <td>

                              <button
                                onClick={() =>
                                  setSelectedChallan(
                                    challan
                                  )
                                }
                              >
                                View
                              </button>

                              <button
                                onClick={() =>
                                  handleEditChallan(
                                    challan
                                  )
                                }
                                style={{
                                  marginLeft:
                                    "8px",
                                }}
                              >
                                Edit
                              </button>

                            </td>

                          </tr>

                        )
                      )

                  ) : (

                    <tr>

                      <td
                        colSpan="8"
                        style={{
                          textAlign:
                            "center",
                          padding:
                            "20px",
                        }}
                      >
                        No challans
                        created yet.
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          )}

        </>

      )}

    </div>
  );
}

export default Challans;