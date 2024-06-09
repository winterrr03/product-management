const express = require("express");
const multer  = require('multer');
const router = express.Router();

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const upload = multer();

const controller = require("../../controllers/admin/product-category.controller");
const validate = require("../../validates/admin/product.validate");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create", 
  upload.single('thumbnail'),
  uploadCloud.uploadSingle,
  validate.createPost,
  controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single('thumbnail'),
  uploadCloud.uploadSingle,
  validate.createPost,
  controller.editPatch
);

module.exports = router;