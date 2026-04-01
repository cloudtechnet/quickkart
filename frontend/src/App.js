import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/products")
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1>QuickKart</h1>
      {products.map(p => (
        <div key={p.id}>
          <h3>{p.name}</h3>
          <p>Price: ₹{p.price}</p>
        </div>
      ))}
    </div>
  );
}

export default App;