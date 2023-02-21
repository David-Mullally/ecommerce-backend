const recordsPerPage = require("../config/pagination");
const Product = require("../models/ProductModel");

const getProducts = async (req, res, next) => {
  try {
    const pageNum = Number(req.query.pageNum) || 1;
      const totalProducts = await Product.countDocuments({});
    //res.json({pageNum})
      // sort by name, price etc based on input on frontend
      let sort ={};
      const sortOption = req.query.sort || ""
      //console.log(sortOption)
      if (sortOption) {
          let sortOpt = sortOption.split("_")
          sort = { [sortOpt[0]]: Number(sortOpt[1]) }  // NOTE: [] used here to create dynamic key name
          //console.log(sort)
      }
    const products = await Product.find({})
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
