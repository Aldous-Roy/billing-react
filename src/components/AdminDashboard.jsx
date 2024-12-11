import React, { useState } from "react";
import { Link } from "react-router-dom";

const AdminDashboard = ({
  onLogout,
  items,
  setItems,
  coupons,
  orderHistory,
}) => {
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    discountApplicable: false,
  });
  const [quantityToAdd, setQuantityToAdd] = useState(0);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleAddItem = () => {
    const newItemData = {
      ...newItem,
      id: items.length + 1, // unique item ID
      price: parseFloat(newItem.price),
      quantity: parseInt(newItem.quantity),
    };
    setItems([...items, newItemData]);
    setNewItem({ name: "", category: "", price: "", quantity: "", discountApplicable: false });
  };

  const handleIncreaseQuantity = (item) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + Number(quantityToAdd) } : i
      )
    );
    setQuantityToAdd(0); // Reset quantity to add after the update
  };

  const handleDeleteItem = (itemId) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    setItemToDelete(null); // Reset the delete item state
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Admin Dashboard</h2>
      <button
        onClick={onLogout}
        className="bg-red-500 text-white p-2 rounded mb-6"
      >
        Logout
      </button>

      <h3 className="text-2xl font-semibold mb-3">Items</h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between">
            <span>
              {item.name} - ${item.price} ({item.quantity} left)
            </span>
            <div>
              <button
                onClick={() => handleIncreaseQuantity(item)}
                className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
              >
                Increase Quantity
              </button>
              <button
                onClick={() => setItemToDelete(item.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete Item
              </button>
            </div>
          </li>
        ))}
      </ul>

      {itemToDelete && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h4 className="text-lg font-medium">Are you sure you want to delete this item?</h4>
          <div className="mt-3">
            <button
              onClick={() => handleDeleteItem(itemToDelete)}
              className="bg-green-500 text-white px-4 py-2 rounded mr-3"
            >
              Yes
            </button>
            <button
              onClick={() => setItemToDelete(null)}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              No
            </button>
          </div>
        </div>
      )}

      <h3 className="text-2xl font-semibold mt-6 mb-3">Add a New Item</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddItem();
        }}
        className="space-y-4"
      >
        <input
          type="text"
          placeholder="Item Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="p-2 border rounded w-full"
        />
        <input
          type="text"
          placeholder="Category"
          value={newItem.category}
          onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
          className="p-2 border rounded w-full"
        />
        <input
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          className="p-2 border rounded w-full"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
          className="p-2 border rounded w-full"
        />
        <label className="flex items-center space-x-2">
          <span>Discount Applicable</span>
          <input
            type="checkbox"
            checked={newItem.discountApplicable}
            onChange={(e) =>
              setNewItem({ ...newItem, discountApplicable: e.target.checked })
            }
            className="h-5 w-5"
          />
        </label>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded mt-4"
        >
          Add Item
        </button>
      </form>

      <h3 className="text-2xl font-semibold mt-6 mb-3">Increase / Decrease Item Quantity</h3>
      <div className="flex items-center space-x-3">
        <input
          type="number"
          value={quantityToAdd}
          onChange={(e) => setQuantityToAdd(e.target.value)}
          placeholder="Quantity to Add"
          className="p-2 border rounded"
        />
        <button
          onClick={() => handleIncreaseQuantity(items.find((item) => item.id === 1))}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Increase Quantity
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;