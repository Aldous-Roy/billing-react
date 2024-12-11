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
      id: items.length + 1, // New unique item ID
      price: parseFloat(newItem.price),
      quantity: parseInt(newItem.quantity),
    };
    setItems([...items, newItemData]);
    setNewItem({ name: "", category: "", price: "", quantity: "", discountApplicable: false });
  };

  const handleIncreaseQuantity = (item) => {
    // Ensure the quantity is updated by adding `quantityToAdd` as a number
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
    <div>
      <h2>Admin Dashboard</h2>
      <button onClick={onLogout}>Logout</button>

      <h3>Items</h3>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} - ${item.price} ({item.quantity} left)
            <button onClick={() => handleIncreaseQuantity(item)}>Increase Quantity</button>
            <button onClick={() => setItemToDelete(item.id)}>Delete Item</button>
          </li>
        ))}
      </ul>

      {itemToDelete && (
        <div>
          <h4>Are you sure you want to delete this item?</h4>
          <button onClick={() => handleDeleteItem(itemToDelete)}>Yes</button>
          <button onClick={() => setItemToDelete(null)}>No</button>
        </div>
      )}

      <h3>Add a New Item</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddItem();
        }}
      >
        <input
          type="text"
          placeholder="Item Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category"
          value={newItem.category}
          onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
        />
        <label>
          Discount Applicable:
          <input
            type="checkbox"
            checked={newItem.discountApplicable}
            onChange={(e) =>
              setNewItem({ ...newItem, discountApplicable: e.target.checked })
            }
          />
        </label>
        <button type="submit">Add Item</button>
      </form>

      <h3>Increase / Decrease  Item Quantity</h3>
      <input
        type="number"
        value={quantityToAdd}
        onChange={(e) => setQuantityToAdd(e.target.value)}
        placeholder="Quantity to Add"
      />
      <button onClick={() => handleIncreaseQuantity(items.find((item) => item.id === 1))}>
        Increase Quantity
      </button>
    </div>
  );
};

export default AdminDashboard;