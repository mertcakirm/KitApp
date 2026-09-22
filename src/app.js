const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());          
app.use(express.json());  

app.use("/api/auth", require("./routes/AuthRoutes"));
app.use("/api/admin", require("./routes/AdminRoutes"));
app.use("/api/category", require("./routes/CategoryRoutes"));
app.use("/api/books", require("./routes/BookRoutes"));
app.use("/api/users", require("./routes/UserRoutes"));

module.exports = app;
