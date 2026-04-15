const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
require("dotenv").config();

const requestLogger = require("./middleware/requestLogger");
const indexRoutes = require("./routes/index");
const studentRoutes = require("./routes/students");
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const adminRoutes = require("./routes/admin");
const teacherRoutes = require("./routes/laerer");
const companyRoutes = require("./routes/bedrift");
const studentRoleRoutes = require("./routes/elev");

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
app.use(
  session({
    secret: process.env.SESSION_SECRET || "session-secret-lokal",
    resave: false,
    saveUninitialized: false
  })
);

// Gjør brukerinfo tilgjengelig i alle EJS-visninger.
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

app.use("/", indexRoutes);
app.use("/elever", studentRoutes);
app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/admin", adminRoutes);
app.use("/laerer", teacherRoutes);
app.use("/bedrift", companyRoutes);
app.use("/elev", studentRoleRoutes);

app.listen(PORT, () => {
  console.log(`Server kjører på http://localhost:${PORT}`);
});
