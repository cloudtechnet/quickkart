const express = require("express");
const app = express();

const products = [
  { id: 1, name: "Laptop", price: 50000 },
  { id: 2, name: "Mobile", price: 20000 }
];

app.get("/products", (req, res) => {
  res.json(products);
});

app.listen(3001, () => console.log("Product Service running"));