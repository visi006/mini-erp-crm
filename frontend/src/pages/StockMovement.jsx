import { useEffect, useState } from "react";

function StockMovement() {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState(() => {
    const savedMovements =
      localStorage.getItem("stockMovements");

    return savedMovements
      ? JSON.parse(savedMovements)
      : [];
  });

  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    type: "IN",
    reason: "",
    createdBy: "Admin",
  });

  useEffect(() => {
    const savedProducts =
      JSON.parse(localStorage.getItem("products")) || [];

    setProducts(savedProducts);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "stockMovements",
      JSON.stringify(movements)
    );
  }, [movements]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.productId) {
      alert("Please select a product.");
      return;
    }

    if (!formData.quantity || Number(formData.quantity) <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    if (!formData.reason.trim()) {
      alert("Please enter a reason.");
      return;
    }

    const quantity = Number(formData.quantity);

    const selectedProduct = products.find(
      (product) =>
        String(product.id) === String(formData.productId)
    );

    if (!selectedProduct) {
      alert("Product not found.");
      return;
    }

    if (
      formData.type === "OUT" &&
      quantity > selectedProduct.currentStock
    ) {
      alert("Not enough stock available.");
      return;
    }

    const updatedProducts = products.map((product) => {
      if (
        String(product.id) === String(formData.productId)
      ) {
        const newStock =
          formData.type === "IN"
            ? product.currentStock + quantity
            : product.currentStock - quantity;

        return {
          ...product,
          currentStock: newStock,
        };
      }

      return product;
    });

    localStorage.setItem(
      "products",
      JSON.stringify(updatedProducts)
    );

    setProducts(updatedProducts);

    const newMovement = {
      id: Date.now(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      sku: selectedProduct.sku,
      quantity: quantity,
      type: formData.type,
      reason: formData.reason,
      createdBy: formData.createdBy,
      timestamp: new Date().toLocaleString(),
    };

    setMovements((currentMovements) => [
      ...currentMovements,
      newMovement,
    ]);

    setFormData({
      productId: "",
      quantity: "",
      type: "IN",
      reason: "",
      createdBy: "Admin",
    });

    alert("Stock movement recorded successfully!");
  };

  return (
    <div className="page-container">

      {/* Header */}

      <div className="page-header">

        <div>
          <h1>Stock Movement</h1>

          <p>
            Record stock IN and OUT movements
          </p>
        </div>

      </div>

      {/* Movement Form */}

      <div className="form-container">

        <div className="form-header">

          <div>
            <h2>Record Stock Movement</h2>

            <p>
              Update product stock and maintain movement history
            </p>
          </div>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            {/* Product */}

            <div className="form-field">

              <label>
                Product
              </label>

              <select
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Product
                </option>

                {products.map((product) => (

                  <option
                    key={product.id}
                    value={product.id}
                  >
                    {product.name} ({product.sku})
                  </option>

                ))}

              </select>

            </div>

            {/* Quantity */}

            <div className="form-field">

              <label>
                Quantity Changed
              </label>

              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
                min="1"
                required
              />

            </div>

            {/* Type */}

            <div className="form-field">

              <label>
                Movement Type
              </label>

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
              >

                <option value="IN">
                  IN
                </option>

                <option value="OUT">
                  OUT
                </option>

              </select>

            </div>

            {/* Created By */}

            <div className="form-field">

              <label>
                Created By
              </label>

              <input
                type="text"
                name="createdBy"
                value={formData.createdBy}
                onChange={handleChange}
                placeholder="Enter name"
                required
              />

            </div>

          </div>

          {/* Reason */}

          <div className="form-field">

            <label>
              Reason
            </label>

            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Example: New stock received"
              rows="3"
              required
            />

          </div>

          <div className="form-actions">

            <button
              type="submit"
              className="primary-button"
            >
              Record Movement
            </button>

          </div>

        </form>

      </div>

      {/* Movement History */}

      <div className="details-container">

        <div className="details-header">

          <div>
            <h2>Stock Movement History</h2>

            <p>
              All stock IN and OUT transactions
            </p>
          </div>

        </div>

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
                  Type
                </th>

                <th>
                  Reason
                </th>

                <th>
                  Created By
                </th>

                <th>
                  Timestamp
                </th>

              </tr>

            </thead>

            <tbody>

              {movements.length > 0 ? (

                movements
                  .slice()
                  .reverse()
                  .map((movement) => (

                    <tr key={movement.id}>

                      <td>
                        {movement.productName}
                      </td>

                      <td>
                        {movement.sku}
                      </td>

                      <td>
                        {movement.quantity}
                      </td>

                      <td>

                        <strong>
                          {movement.type}
                        </strong>

                      </td>

                      <td>
                        {movement.reason}
                      </td>

                      <td>
                        {movement.createdBy}
                      </td>

                      <td>
                        {movement.timestamp}
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
                    No stock movements recorded yet.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default StockMovement;