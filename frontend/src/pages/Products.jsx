import { useEffect, useState } from "react";

const defaultProducts = [
  {
    id: 1,
    name: "Wireless Keyboard",
    sku: "KEY001",
    category: "Electronics",
    unitPrice: 1200,
    currentStock: 25,
    minimumStock: 10,
    location: "Warehouse A",
  },
  {
    id: 2,
    name: "Wireless Mouse",
    sku: "MOU001",
    category: "Electronics",
    unitPrice: 800,
    currentStock: 6,
    minimumStock: 10,
    location: "Warehouse A",
  },
];

function Products() {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem("products");

    return savedProducts
      ? JSON.parse(savedProducts)
      : defaultProducts;
  });

  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    unitPrice: "",
    currentStock: "",
    minimumStock: "",
    location: "",
  });

  useEffect(() => {
    localStorage.setItem(
      "products",
      JSON.stringify(products)
    );
  }, [products]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      sku: "",
      category: "",
      unitPrice: "",
      currentStock: "",
      minimumStock: "",
      location: "",
    });

    setEditingProductId(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const productData = {
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      unitPrice: Number(formData.unitPrice),
      currentStock: Number(formData.currentStock),
      minimumStock: Number(formData.minimumStock),
      location: formData.location,
    };

    if (editingProductId) {
      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === editingProductId
            ? {
                ...product,
                ...productData,
              }
            : product
        )
      );

      alert("Product updated successfully!");
    } else {
      const newProduct = {
        id: Date.now(),
        ...productData,
      };

      setProducts((currentProducts) => [
        ...currentProducts,
        newProduct,
      ]);

      alert("Product added successfully!");
    }

    resetForm();
  };

  const handleEdit = (product) => {
    setEditingProductId(product.id);

    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      unitPrice: product.unitPrice,
      currentStock: product.currentStock,
      minimumStock: product.minimumStock,
      location: product.location,
    });

    setShowForm(true);
  };

  const filteredProducts = products.filter((product) => {
    const search = searchTerm.toLowerCase();

    return (
      product.name.toLowerCase().includes(search) ||
      product.sku.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search) ||
      product.location.toLowerCase().includes(search)
    );
  });

  return (
    <div className="page-container">

      {/* ================= HEADER ================= */}

      <div className="page-header">

        <div>
          <h1>Products & Inventory</h1>

          <p>
            Manage products, stock and warehouse locations
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => {
            setEditingProductId(null);

            setFormData({
              name: "",
              sku: "",
              category: "",
              unitPrice: "",
              currentStock: "",
              minimumStock: "",
              location: "",
            });

            setShowForm(true);
          }}
        >
          + Add Product
        </button>

      </div>

      {/* ================= ADD / EDIT FORM ================= */}

      {showForm ? (

        <div className="form-container">

          <div className="form-header">

            <div>
              <h2>
                {editingProductId
                  ? "Edit Product"
                  : "Add Product"}
              </h2>

              <p>
                {editingProductId
                  ? "Update product information"
                  : "Enter product information"}
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

              {/* Product Name */}

              <div className="form-field">

                <label>
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />

              </div>

              {/* SKU */}

              <div className="form-field">

                <label>
                  SKU / Product Code
                </label>

                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="Enter SKU"
                  required
                />

              </div>

              {/* Category */}

              <div className="form-field">

                <label>
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Enter category"
                  required
                />

              </div>

              {/* Unit Price */}

              <div className="form-field">

                <label>
                  Unit Price
                </label>

                <input
                  type="number"
                  name="unitPrice"
                  value={formData.unitPrice}
                  onChange={handleChange}
                  placeholder="Enter unit price"
                  min="0"
                  required
                />

              </div>

              {/* Current Stock */}

              <div className="form-field">

                <label>
                  Current Stock
                </label>

                <input
                  type="number"
                  name="currentStock"
                  value={formData.currentStock}
                  onChange={handleChange}
                  placeholder="Enter current stock"
                  min="0"
                  required
                />

              </div>

              {/* Minimum Stock */}

              <div className="form-field">

                <label>
                  Minimum Stock Alert
                </label>

                <input
                  type="number"
                  name="minimumStock"
                  value={formData.minimumStock}
                  onChange={handleChange}
                  placeholder="Enter minimum stock"
                  min="0"
                  required
                />

              </div>

              {/* Location */}

              <div className="form-field">

                <label>
                  Location / Warehouse
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Example: Warehouse A"
                  required
                />

              </div>

            </div>

            {/* FORM BUTTONS */}

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
                {editingProductId
                  ? "Update Product"
                  : "Save Product"}
              </button>

            </div>

          </form>

        </div>

      ) : (

        <>

          {/* ================= SEARCH ================= */}

          <div className="search-section">

            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

          </div>

          {/* ================= PRODUCT TABLE ================= */}

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
                    Category
                  </th>

                  <th>
                    Unit Price
                  </th>

                  <th>
                    Stock
                  </th>

                  <th>
                    Min Stock
                  </th>

                  <th>
                    Location
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredProducts.length > 0 ? (

                  filteredProducts.map((product) => {

                    const isLowStock =
                      product.currentStock <=
                      product.minimumStock;

                    return (
                      <tr key={product.id}>

                        <td>
                          {product.name}
                        </td>

                        <td>
                          {product.sku}
                        </td>

                        <td>
                          {product.category}
                        </td>

                        <td>
                          ₹{product.unitPrice}
                        </td>

                        <td>

                          <span
                            style={{
                              fontWeight: "bold",
                              color: isLowStock
                                ? "red"
                                : "inherit",
                            }}
                          >
                            {product.currentStock}
                          </span>

                          {isLowStock && (
                            <span
                              style={{
                                marginLeft: "6px",
                                fontSize: "12px",
                                color: "red",
                              }}
                            >
                              Low Stock
                            </span>
                          )}

                        </td>

                        <td>
                          {product.minimumStock}
                        </td>

                        <td>
                          {product.location}
                        </td>

                        <td>

                          <button
                            onClick={() =>
                              handleEdit(product)
                            }
                          >
                            Edit
                          </button>

                        </td>

                      </tr>
                    );
                  })

                ) : (

                  <tr>

                    <td
                      colSpan="8"
                      style={{
                        textAlign: "center",
                        padding: "20px",
                      }}
                    >
                      No products found
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

export default Products;