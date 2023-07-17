const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
const express = require("express");
const app = express();
app.use(express.json());

const PORT = process.env.PORT;

//db
const db = require("./models");
db.sequelize.sync({});

//routes
const { authRouter } = require("./routers");

//middleware
app.use("/auth", authRouter);
app.use("/profile", profileRouter);

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
