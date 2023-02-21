const recordsPerPage = require("../config/pagination");
const Product = require("../models/ProductModel");

const getProducts = async (req, res, next) => {
  try {
    let queryCondition = false;
    let query = {};
    let priceQueryCondition = {};

    if (req.query.price) {
      queryCondition = true;
      priceQueryCondition = { price: { $lte: req.query.price } };
    }

    let ratingQueryCondition = {};
    if (req.query.rating) {
      queryCondition = true;
      ratingQueryCondition = { rating: { $in: req.query.rating.split(",") } };
    }

    if (!queryCondition) {
      query = {
        $and: [priceQueryCondition, ratingQueryCondition],
      };
    }

    //pagination

    const pageNum = Number(req.query.pageNum) || 1;
    //res.json({pageNum})
    // sort by name, price etc based on input on frontend
    let sort = {};
    const sortOption = req.query.sort || "";
    //console.log(sortOption)
    if (sortOption) {
      let sortOpt = sortOption.split("_");
      sort = { [sortOpt[0]]: Number(sortOpt[1]) }; // NOTE: [] used here to create dynamic key name
      //console.log(sort)
    }
    const totalProducts = await Product.countDocuments({});
    const products = await Product.find(query)
      .skip(recordsPerPage * (pageNum - 1))
      .sort(sort)
      .limit(recordsPerPage);
    res.json({
      products,
      pageNum,
      paginationLinksNumber: Math.ceil(totalProducts / recordsPerPage),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getProducts;
