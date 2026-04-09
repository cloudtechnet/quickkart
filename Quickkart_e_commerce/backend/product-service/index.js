<<<<<<< HEAD
const express = require("express");
const app = express();

const products = [
  { id: 1, name: "Laptop", price: 50000 },
  { id: 2, name: "Mobile", price: 20000 }
];

app.get("/products", (req, res) => {
  res.json(products);
});

=======
const express = require("express");
const app = express();

const products = [
  { id: 1, name: "Laptop", price: 50000 },
  { id: 2, name: "Mobile", price: 20000 }
];

app.get("/products", (req, res) => {
  res.json(products);
});

>>>>>>> 364fa4719a5f4ea8ad34d7d78fa2a4a304db08f5
app.listen(3001, () => console.log("Product Service running"));