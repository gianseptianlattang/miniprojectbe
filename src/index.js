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
db.sequelize.sync({ force: true });

//routes
const {
  authRouter,
  profileRouter,
  blogRouter,
  passwordRouter,
} = require("./routers");

//middleware
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/blog", blogRouter);
app.use("/password", passwordRouter);

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
