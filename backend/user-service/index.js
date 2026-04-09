const express = require("express");
const app = express();

app.use(express.json());

app.post("/login", (req, res) => {
  res.json({ message: "User logged in" });
});

app.listen(3002, () => console.log("User Service running"));