export const sampleCustomers = [
  { id: 100, username: "admin", password: "admin", role: "Admin" }, // Plain text
  { id: 101, username: "John", password: "john", role: "Customer" },
  { id: 102, username: "Mark", password: "mark", role: "Customer" },
];

export const sampleItems = [
  {
    id: 1,
    name: "Dove",
    category: "Conditioner",
    price: 25,
    quantity: 10,
    discount: true,
  },
  {
    id: 2,
    name: "Pantene",
    category: "Conditioner",
    price: 30,
    quantity: 10,
    discount: true,
  },
  {
    id: 4,
    name: "Lux",
    category: "Soap",
    price: 15,
    quantity: 10,
    discount: false,
  },
  {
    id: 5,
    name: "Dove",
    category: "Soap",
    price: 30,
    quantity: 5,
    discount: true,
  },
];

export const discountCoupons = {
  PROMO10: { discount: 10, remainingUses: 10 },
};
