import React, { useState, useEffect } from "react";
import Table from "./Table";

const AdminDashboard = ({
  onLogout,
  items = [],
  setItems,
  coupons = [],
  orderHistory = [],
  customers = [],
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchPrice, setSearchPrice] = useState("");
  const [searchQuantity, setSearchQuantity] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filteredItems, setFilteredItems] = useState(items);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    discountApplicable: false,
  });
  const [quantityToAddMap, setQuantityToAddMap] = useState({});
  const [itemToDelete, setItemToDelete] = useState(null);
  const [sortColumn, setSortColumn] = useState("name");

  // Update filtered items whenever search query, sort order, or items change
  useEffect(() => {
    let filtered = items.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(searchName.toLowerCase());
      const priceMatch = item.price.toString().includes(searchPrice);
      const quantityMatch = item.quantity.toString().includes(searchQuantity);
      return nameMatch && priceMatch && quantityMatch;
    });

    filtered = filtered.sort((a, b) => {
      if (sortColumn === "price") {
        return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
      }
      if (sortColumn === "quantity") {
        return sortOrder === "asc" ? a.quantity - b.quantity : b.quantity - a.quantity;
      }
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });

    setFilteredItems(filtered);
  }, [searchName, searchPrice, searchQuantity, sortOrder, sortColumn, items]);

  const handleAddItem = () => {
    const newItemData = {
      ...newItem,
      id: Date.now(),
      price: parseFloat(newItem.price),
      quantity: parseInt(newItem.quantity),
    };

    setItems((prev) => [...prev, newItemData]);

    setShowAddItemModal(false);
    setNewItem({
      name: "",
      category: "",
      price: "",
      quantity: "",
      discountApplicable: false,
    });
  };

  const handleIncreaseQuantity = (item) => {
    const quantityToAdd = quantityToAddMap[item.id] || 0;
    if (quantityToAdd <= 0) {
      alert("Enter a valid quantity to add.");
      return;
    }

    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? { ...i, quantity: i.quantity + Number(quantityToAdd) }
          : i
      )
    );
    setQuantityToAddMap((prev) => ({ ...prev, [item.id]: 0 }));
    alert("Quantity modified successfully");
  };

  const handleDeleteItem = (itemId) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    setItemToDelete(null);
  };

  const topSellingItems = orderHistory
    .flatMap((order) => order.items || [])
    .reduce((acc, item) => {
      acc[item.name] = (acc[item.name] || 0) + item.quantity;
      return acc;
    }, {});

  const salesLast24Hours = orderHistory
    .filter(
      (order) =>
        new Date(order.date) > new Date(new Date() - 24 * 60 * 60 * 1000)
    )
    .reduce((sum, order) => sum + parseFloat(order.totalCost || 0), 0);

  const customerCount = customers.length;

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
        Admin Dashboard
      </h2>
      <button
        onClick={onLogout}
        className="bg-red-500 text-white py-2 px-4 rounded mb-6 w-full sm:w-auto"
      >
        Logout
      </button>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-6">
        <div className="p-4 bg-green-100 rounded shadow">
          <h3 className="text-lg font-bold">Top-Selling Items</h3>
          <ul>
            {Object.entries(topSellingItems).map(([name], index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </div>
        <div className="p-4 bg-blue-100 rounded shadow">
          <h3 className="text-lg font-bold">Sales in Last 24 Hours</h3>
          <p>₹{parseFloat(salesLast24Hours).toFixed(2)}</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded shadow">
          <h3 className="text-lg font-bold">Customer Count</h3>
          <p>{customerCount}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="p-2 border rounded w-full sm:w-auto"
        />
        <input
          type="text"
          placeholder="Search by Price"
          value={searchPrice}
          onChange={(e) => setSearchPrice(e.target.value)}
          className="p-2 border rounded w-full sm:w-auto"
        />
        <input
          type="text"
          placeholder="Search by Quantity"
          value={searchQuantity}
          onChange={(e) => setSearchQuantity(e.target.value)}
          className="p-2 border rounded w-full sm:w-auto"
        />
        <button
          onClick={() =>
            setShowAddItemModal(true)
          }
          className="bg-green-500 text-white px-4 py-2 rounded ml-4"
        >
          Add New Product
        </button>
      </div>

      {/* Table with Sorting Buttons in Header */}
      <table className="table-auto w-full border-collapse border border-gray-300 mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">
              <div className="flex justify-between items-center">
                <span>Product Name</span>
                <button
                  onClick={() => {
                    setSortColumn("name");
                    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                  }}
                  className="text-sm text-gray-500"
                >
                  {sortColumn === "name" && sortOrder === "asc" ? "↓" : "↑"}
                </button>
              </div>
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              <div className="flex justify-between items-center">
                <span>Price (₹)</span>
                <button
                  onClick={() => {
                    setSortColumn("price");
                    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                  }}
                  className="text-sm text-gray-500"
                >
                  {sortColumn === "price" && sortOrder === "asc" ? "↓" : "↑"}
                </button>
              </div>
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              <div className="flex justify-between items-center">
                <span>Quantity</span>
                <button
                  onClick={() => {
                    setSortColumn("quantity");
                    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                  }}
                  className="text-sm text-gray-500"
                >
                  {sortColumn === "quantity" && sortOrder === "asc"
                    ? "↓"
                    : "↑"}
                </button>
              </div>
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.id} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{item.name}</td>
              <td className="border border-gray-300 px-4 py-2">
                ₹{item.price.toFixed(2)}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.quantity}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Add Qty"
                    value={quantityToAddMap[item.id] || 0}
                    onChange={(e) =>
                      setQuantityToAddMap((prev) => ({
                        ...prev,
                        [item.id]: e.target.value,
                      }))
                    }
                    className="border rounded w-16 px-2"
                  />
                  <button
                    onClick={() => handleIncreaseQuantity(item)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Add Qty
                  </button>
                  <button
                    onClick={() => setItemToDelete(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {itemToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <p>Are you sure you want to delete this item?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setItemToDelete(null)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteItem(itemToDelete)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddItemModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Add New Product</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddItem();
              }}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Product Name"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Category"
                value={newItem.category}
                onChange={(e) =>
                  setNewItem({ ...newItem, category: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Price"
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({ ...newItem, price: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={newItem.quantity}
                onChange={(e) =>
                  setNewItem({ ...newItem, quantity: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="discountApplicable"
                  checked={newItem.discountApplicable}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      discountApplicable: e.target.checked,
                    })
                  }
                />
                <label htmlFor="discountApplicable">
                  Discount Applicable
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 px-4 rounded"
              >
                Add Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;