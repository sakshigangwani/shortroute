const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const urlRoutes = require("./routes/urlRoutes");

dotenv.config();

const app = express();

connectDB();

app.use(cors({
  origin: "*"
}))
app.use(express.json());

app.use("/api", urlRoutes);
app.use("/", urlRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});