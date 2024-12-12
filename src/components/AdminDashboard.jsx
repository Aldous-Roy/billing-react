import React, { useState, useEffect } from "react";

const AdminDashboard = ({
  onLogout,
  items = [],
  setItems,
  coupons = [],
  orderHistory = [],
  customers = [],
}) => {
  const [searchQuery, setSearchQuery] = useState("");
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

  useEffect(() => {
    let filtered = items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    filtered = filtered.sort((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price
    );
    setFilteredItems(filtered);
  }, [searchQuery, sortOrder, items]);

  const handleAddItem = () => {
    const newItemData = {
      ...newItem,
      id: Date.now(), // Use timestamp as unique ID
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
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? { ...i, quantity: i.quantity + Number(quantityToAdd) }
          : i
      )
    );
    setQuantityToAddMap((prev) => ({ ...prev, [item.id]: 0 }));
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
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded w-full sm:w-auto"
        />
        <button
          onClick={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
          className="bg-gray-300 text-black px-4 py-2 rounded w-full sm:w-auto ml-4"
        >
          Sort by Price ({sortOrder === "asc" ? "Ascending" : "Descending"})
        </button>
        <button
          onClick={() => setShowAddItemModal(true)}
          className="bg-green-500 text-white px-4 py-2 rounded ml-4"
        >
          Add New Product
        </button>
      </div>

      <ul className="space-y-3 mb-6">
        {filteredItems.map((item) => (
          <li
            key={item.id}
            className="p-3 border rounded flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0"
          >
            <span>
              {item.name} - ₹{item.price.toFixed(2)} ({item.quantity} left)
            </span>
            <div className="flex space-x-2">
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
                Add Quantity
              </button>
              <button
                onClick={() => setItemToDelete(item.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

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
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newItem.discountApplicable}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      discountApplicable: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                Discount Applicable
              </label>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;