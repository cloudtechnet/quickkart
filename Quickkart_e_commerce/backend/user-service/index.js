<<<<<<< HEAD
const express = require("express");
const app = express();

app.use(express.json());

app.post("/login", (req, res) => {
  res.json({ message: "User logged in" });
});

=======
const express = require("express");
const app = express();

app.use(express.json());

app.post("/login", (req, res) => {
  res.json({ message: "User logged in" });
});

>>>>>>> 364fa4719a5f4ea8ad34d7d78fa2a4a304db08f5
app.listen(3002, () => console.log("User Service running"));