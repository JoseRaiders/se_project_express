const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => console.error(err));

app.use((req, res, next) => {
  req.user = {
    _id: "67eb42c90a0f10ee7a249aed",
  };
  next();
});

app.use(express.json());
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}...`);
});

// owner ID 67eb42c90a0f10ee7a249aed
