const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const requestLogger = require("./middleware/requestLogger");
const indexRoutes = require("./routes/index");
const studentRoutes = require("./routes/students");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/opplaeringskontor";

// Koble til lokal MongoDB (eller URI fra .env)
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Koblet til MongoDB");
  })
  .catch((error) => {
    console.error("Feil ved tilkobling til MongoDB:", error.message);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(requestLogger);

app.use("/", indexRoutes);
app.use("/elever", studentRoutes);

app.listen(PORT, () => {
  console.log(`Server kjører på http://localhost:${PORT}`);
});
