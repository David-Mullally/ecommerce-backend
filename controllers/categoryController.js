const Category = require("../models/CategoryModel");

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({}).sort({ name: "asc" }).orFail();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

const newCategory = async (req, res, next) => {
  try {
    const { category } = req.body;
    if (!category) {
      res.status(400).send("Category field is required");
    }
    const categoryExists = await Category.findOne({ name: category });
    if (categoryExists) {
      res.status(400).send("This category already exists");
    } else {
      const categoryCreated = await Category.create({ name: category });
      res.status(201).send({ categoryCreated: categoryCreated });
    }
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  //return res.send(req.params.category)
  try {
    if(req.params.category !== "Choose category"){
        const categoryExists = await Category.findOne({name: decodeURIComponent(req.params.category)}).orFail()
        await categoryExists.remove()
        res.json({categoryDeleted: true})

    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, newCategory, deleteCategory };
