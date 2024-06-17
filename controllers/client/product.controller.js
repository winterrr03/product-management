const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({ position: "desc" });

    const newProducts = products.map(item => {
        item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(0);
        return item;
    });

    res.render("client/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: newProducts
    });
}

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
    const slugCategory = req.params.slugCategory;

    const category = await ProductCategory.findOne({
        slug: slugCategory,
        deleted: false,
        status: "active"
    });

    const getSubCategory = async (parentId) => {
        const subs = await ProductCategory.find({
            parent_id: parentId,
            deleted: false,
            status: "active"
        });

        let allSub = [...subs];

        for (const sub of subs) {
            const childs = await getSubCategory(sub.id);
            allSub = allSub.concat(childs);
        }

        return allSub;
    }

    const listCategory = await getSubCategory(category.id);

    const listCategoryId = listCategory.map(item => item.id);

    const products = await Product.find({
        product_category_id: { $in: [category.id, ...listCategoryId] },
        deleted: false,
        status: "active"
      }).sort({ position: "desc" });
    
      for (const item of products) {
        item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(0);
    }

    res.render("client/pages/products/index", {
        pageTitle: category.title,
        products: products
    });
}

// [GET] /products/detail/:slug
module.exports.detail = async (req, res) => {
    const slug = req.params.slug;

    const product = await Product.findOne({
        slug: slug,
        deleted: false,
        status: "active"
    });

    if (product.product_category_id) {
        const category = await ProductCategory.findOne({
            _id: product.product_category_id,
            deleted: false,
            status: "active"
        });
        product.category = category;
    }

    product.priceNew = (product.price * (100 - product.discountPercentage) / 100).toFixed(0);

    if (product) {
        res.render("client/pages/products/detail", {
            pageTitle: product.title,
            product: product
        })
    } else {
        res.redirect("/products");
    }
}