<<<<<<< HEAD
const express = require("express");
const app = express();

app.use(express.json());

app.post("/order", (req, res) => {
  res.json({ message: "Order placed successfully" });
});

=======
const express = require("express");
const app = express();

app.use(express.json());

app.post("/order", (req, res) => {
  res.json({ message: "Order placed successfully" });
});

>>>>>>> 364fa4719a5f4ea8ad34d7d78fa2a4a304db08f5
app.listen(3003, () => console.log("Order Service running"));