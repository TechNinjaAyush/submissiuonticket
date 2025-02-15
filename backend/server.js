import express from "express";
import "dotenv/config"
const app = express();
const PORT = process.env.PORT||   3000;

app.get("/", (req, res) => {
  // Send an HTML response as a string
  res.send("<h1>Hello Bitches</h1>");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
