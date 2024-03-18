const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Product = require("../models/product");
const ProductReview = require("../models/productReview");
const verifyAuth = require("../middelware/verifyAuth");
const uploadImage = require("../middelware/uploadImage");
const dotenv = require("dotenv");

dotenv.config();

//All product change requests
router.get("/allRequests", verifyAuth, async (req, res, next) => {
  try {
    //If user is admin then all product to review will be sent
    if (req.userExist.admin) {
      const reviews = await ProductReview.find();
      return res.status(200).json({
        status: "SUCCESS",
        productReview: reviews,
        userDetails: {
          name: req.userExist.name,
          email: req.userExist.email,
        },
      });
    }

    //If user is team member the only product which request to review will be sent
    const productReview = await ProductReview.find({
      userId: req.userExist._id,
    });

    res.status(200).json({
      status: "SUCCESS",
      productReview: productReview,
      userDetails: {
        name: req.userExist.name,
        email: req.userExist.email,
      },
    });
  } catch (error) {
    next(error);
  }
});

//product change request details
router.get("/request/:id", verifyAuth, async (req, res, next) => {
  try {
    const productId = req.params.id;
    const reviews = await ProductReview.findById(productId);

    res.status(200).json({
      status: "SUCCESS",
      productReview: reviews,
    });
  } catch (error) {
    next(error);
  }
});

//Submission of request
router.post(
  "/submitRequest/:id",
  verifyAuth,
  uploadImage.array("images"),
  async (req, res, next) => {
    try {
      const dataToUpdate = req.body;
      const productId = req.params.id;

      //If an image is also sent for updating
      if (req.files && req.files.length > 0) {
        const imageUrl = `${process.env.BACKEND_URL}/images/${
          req.files[req.files.length - 1].filename
        }`;
        dataToUpdate.image = imageUrl;
      }

      //If review request coming from admin
      if (req.userExist.admin) {
        const updatedData = await Product.findByIdAndUpdate(
          productId,
          dataToUpdate,
          {
            new: true,
          }
        );

        return res.status(200).json({
          status: "SUCCESS",
          message: "Product Details Updated Successfully",
          productDetails: updatedData,
        });
      }

      //If review requested from team member
      //checking all previous update for same user and same product
      const checkPreviousUpdate = await ProductReview.find(
        {
          productId: productId,
          userId: req.userExist._id,
        },
        { status: 1 }
      );

      //checking if same request is pending
      for (const item of checkPreviousUpdate) {
        if (item.status === "pending") {
          return res.status(409).json({
            status: "FAILED",
            message: "Previous update has not been approved yet",
          });
        }
      }

      //Processing the request for approval
      dataToUpdate.userId = req.userExist._id;
      dataToUpdate.productId = productId;
      const productToReview = new ProductReview(dataToUpdate);
      await productToReview.save();
      return res
        .status(202)
        .json({ status: "SUCCESS", message: "Submitted for update" });
    } catch (error) {
      next(error);
    }
  }
);

//Reviw the request by admin
router.post("/reviewRequest/:id", verifyAuth, async (req, res, next) => {
  try {
    if (!req.userExist.admin) {
      return res.status(403).json({
        status: "FAILED",
        message: "You are not authorized",
      });
    }

    const productRequestId = req.params.id;
    const { approve } = req.body;

    //If request needs to be rejected
    if (!approve) {
      const updatedDoc = await ProductReview.findOneAndUpdate(
        { _id: productRequestId },
        { $set: { status: "rejected" } },
        { new: true }
      );

      return res.status(200).json({
        status: "SUCCESS",
        message: "Request Rejected",
      });
    }

    //If request needs to be approved
    const requestDataToChange = await ProductReview.findById(productRequestId);
    const dataToUpdate = {
      productName: requestDataToChange.productName,
      price: requestDataToChange.price,
      image: requestDataToChange.image.pop(),
      productDescription: requestDataToChange.productDescription,
      department: requestDataToChange.department,
    };

    const updatingData = await Product.findByIdAndUpdate(
      requestDataToChange.productId,
      dataToUpdate
    );

    await ProductReview.findOneAndUpdate(
      { _id: productRequestId },
      { $set: { status: "approved" } },
      { new: true }
    );

    return res.status(200).json({
      status: "SUCCESS",
      message: "Request Approved",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
