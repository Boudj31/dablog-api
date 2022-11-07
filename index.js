require("dotenv").config();
const express = require('express')
const app = express();
require("./models/dbConfig")
const postsRoutes = require('./routes/postsController');
const userRoutes = require('./routes/userController')
const todoRoutes = require("./routes/todoController")
const categoryRoutes = require("./routes/categoryController")
const bodyParser = require("body-parser");
const cors = require('cors');



app.use("/", postsRoutes);
app.use(cors());
app.use(bodyParser.json());
app.use("/api/posts", postsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes );
app.use("/api/categories", categoryRoutes);




app.listen(process.env.PORT, () => console.log("Server started at port: 1337"))