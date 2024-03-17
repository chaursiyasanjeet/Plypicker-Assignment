const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const {
  errorMiddelware,
  pageNotFound,
} = require("./middelware/errorMiddelware");

const axios = require("axios");
const auth = require("./routes/auth");
const product = require("./routes/product");
const Product = require("./models/product");
const productReview = require("./routes/productReview");

const app = express();

dotenv.config();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//For accessing image thourgh link
app.use("/images", express.static("assets"));

app.get("/", (req, res) => {
  res.json({ status: "ACTIVE", message: "Server is running" });
});

//routings
app.use(auth);
app.use(product);
app.use(productReview);

//error handler page not found
app.use((req, res, next) => {
  const err = new Error("page not found");
  err.status = 404;
  next(err);
});

//error handler middleware
app.use(pageNotFound);
app.use(errorMiddelware);

//saving the products through api
const saveProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count > 0) {
      console.log(
        "Product collection already contains data. Skipping insertion."
      );
      return;
    }

    const result1 = await axios.get(
      "https://64e0caef50713530432cafa1.mockapi.io/api/products"
    );

    const result2 = await Product.insertMany(result1.data);
    console.log(`${result2.length} products saved to the database.`);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

app.listen(process.env.PORT, async (error) => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    await saveProducts();
    console.log(`server is running on http://localhost:${process.env.PORT}`);
  } catch (err) {
    console.log(err);
  }
});
