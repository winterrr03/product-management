const Product = require("../../models/product.model");
const filterHelper = require("../../helpers/filter.helper");
const paginationHelper = require("../../helpers/pagination.helper");

// [GET] admin/products
module.exports.index = async (req, res) => {
  const find = {
    deleted: false
  };

  // Filter
  const filterStatus = filterHelper(req);

  if (req.query.status) {
    find.status = req.query.status;
  }
  // End filter

  // Search
  let keyword = "";

  if (req.query.keyword) {
    keyword = req.query.keyword;
    const regex = new RegExp(keyword, "i");
    find.title = regex;
  }
  // End Search

  // Pagination
  const countRecords = await Product.countDocuments(find);
  const objectPagination = paginationHelper(req, countRecords);
  // End Pagination
  
  const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip).sort({ position: "desc" });

  res.render("admin/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: keyword,
    objectPagination: objectPagination
  });
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Product.updateOne({
    _id: id
  }, {
    status: status
  });
  res.redirect(`back`);
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");
  console.log(type);
  console.log(ids);

  switch (type) {
    case "active":
    case "inactive":
      await Product.updateMany({
        _id: { $in: ids }
      }, {
        status: type
      });
      break;
    case "delete-all":
      await Product.updateMany({
        _id: { $in: ids }
      }, {
        deleted: true,
        deletedAt: new Date()
      });
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Product.updateOne({
          _id: id
        }, {
          position: position
        });
      }
      break;
    default:
      break;
  }
  
  res.redirect(`back`);
}

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await Product.updateOne({
    _id: id
  }, {
    deleted: true,
    deletedAt: new Date()
  });

  res.redirect(`back`);
}