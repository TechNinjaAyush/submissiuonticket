import express from "express";
import "dotenv/config";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { prism, connectDB } from "./config/db.config.js";
import authroutes from "./routes/authroutes.js";
import Dashboardroutes from "./routes/DashboardRoutes.js"
const app = express();
app.use(cookieParser());
const corsOptions = {
  origin: "http://localhost:5173", // Replace with your frontend origin
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;
connectDB();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  // Send an HTML response as a string
  res.send("<h1>Hello Bitches</h1>");
});

app.use('/auth' , authroutes) ; 
app.use('/dashboard' , Dashboardroutes) ;
process.on("SIGINT", async () => {
  await prism.$disconnect();
  console.log("🛑 Prisma disconnected.");
  process.exit(0);
});
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
