import express from "express";
import "dotenv/config" ; 
import {prism , connectDB}  from "./config/db.config.js"
const app = express();
const PORT = process.env.PORT||   3000;
connectDB() ; 


app.get("/", (req, res) => {
  // Send an HTML response as a string
  res.send("<h1>Hello Bitches</h1>");
});
process.on("SIGINT", async () => {
  await prism.$disconnect();
  console.log("🛑 Prisma disconnected.");
  process.exit(0);
});
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
