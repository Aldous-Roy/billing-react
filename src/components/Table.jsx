import React, { useState, useEffect } from "react";

const Table = ({
  onLogout,
  items = [],
  setItems,
  coupons = [],
  orderHistory = [],
  customers = [],
}) => {
  const [searchQuery, setSearchQuery] = useState("");
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
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "asc",
  });

  useEffect(() => {
    let filtered = items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortConfig.key) {
      filtered = filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredItems(filtered);
  }, [searchQuery, sortConfig, items]);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        return {
          key,
          direction: prevConfig.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

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

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded w-full sm:w-auto"
        />
        <button
          onClick={() => setShowAddItemModal(true)}
          className="bg-green-500 text-white px-4 py-2 rounded ml-4"
        >
          Add New Product
        </button>
      </div>

      <table className="table-auto w-full border-collapse border border-gray-300 mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th
              className="border border-gray-300 px-4 py-2 text-left cursor-pointer"
              onClick={() => handleSort("name")}
            >
              Product Name
              {sortConfig.key === "name" && (sortConfig.direction === "asc" ? " 🔼" : " 🔽")}
            </th>
            <th
              className="border border-gray-300 px-4 py-2 text-left cursor-pointer"
              onClick={() => handleSort("price")}
            >
              Price (₹)
              {sortConfig.key === "price" && (sortConfig.direction === "asc" ? " 🔼" : " 🔽")}
            </th>
            <th
              className="border border-gray-300 px-4 py-2 text-left cursor-pointer"
              onClick={() => handleSort("quantity")}
            >
              Quantity
              {sortConfig.key === "quantity" && (sortConfig.direction === "asc" ? " 🔼" : " 🔽")}
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
    </div>
  );
};

export default Table;