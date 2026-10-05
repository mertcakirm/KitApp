const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const corsOptions = require('./config/cors');

app.use(cors(corsOptions));          
app.use(express.json());  

const rootUploadsPath = path.join(process.cwd(), 'uploads');
const srcUploadsPath = path.join(__dirname, 'uploads');

console.log('--- STATİK DOSYA KONTROLÜ ---');
console.log('Ana dizin uploads yolu:', rootUploadsPath, 'Var mı?:', fs.existsSync(rootUploadsPath));
if (fs.existsSync(path.join(rootUploadsPath, 'covers'))) {
  console.log('covers içindeki dosyalar:', fs.readdirSync(path.join(rootUploadsPath, 'covers')));
}

app.use('/uploads', express.static(rootUploadsPath));
app.use('/uploads', express.static(srcUploadsPath));

app.use("/api/auth", require("./routes/AuthRoutes"));
app.use("/api/admin", require("./routes/AdminRoutes"));
app.use("/api/category", require("./routes/CategoryRoutes"));
app.use("/api/books", require("./routes/BookRoutes"));
app.use("/api/users", require("./routes/UserRoutes"));

module.exports = app;
