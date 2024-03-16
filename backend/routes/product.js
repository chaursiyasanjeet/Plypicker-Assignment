const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Product = require("../models/product");

//fetching product details
router.get("/products", async (req, res, next) => {
  try {
    const allProducts = await Product.find();

    res.json({
      status: "SUCCESS",
      message: "product fetched successfully",
      product: allProducts,
    });
    return;
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//Fetching product details by id
router.get("/products/:id", async (req, res, next) => {
  try {
    const productId = req.params.id;
    const productDetails = await Product.findById(productId);

    res.json({
      status: "SUCCESS",
      message: "product fetched successfully",
      product: productDetails,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
