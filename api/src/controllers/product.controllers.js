const { response, request } = require("express");
const {
  getProductsFromDb,
  getProductsByName,
} = require("../helpers/getProductsFromDb");
const { createProductInDb } = require("../helpers/createProduct");
const { updateProductInDb } = require("../helpers/updateProduct");


const getProducts = async (req = request, res = response) => {
  try {
    let { name } = req.query;
    const products = await getProductsFromDb();
    if (!products.length) {
      return res.status(404).send("No products found");
    }

    if (name) {
      let foundProductsByName = await getProductsByName(name);

      if (!foundProductsByName) {
        return res.status(404).send("Please enter a valid name");
      }

      return res.status(200).send(foundProductsByName);
    }
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const createProduct = async (req = request, res = response) => {
  try {
    let { name, type, color, gender, size, rating, price, description, image } =
      req.body;

    let productsFromDb = await getProductsFromDb();

    if (
      !name ||
      !type ||
      !color ||
      !gender ||
      !size ||
      !rating ||
      !price ||
      !description ||
      !image
    ) {
      return res.status(400).send("Please enter all the data");
    }
    if (productsFromDb.length && productsFromDb.some((e) => e.name === name)) {
      return res
        .status(400)
        .send("That product was already created, try with a new one");
    }

    let newProduct = await createProductInDb(
      name,
      type,
      color,
      gender,
      size,
      rating,
      price,
      description,
      image
    );
    res.status(201).send(newProduct && "Product succesfully created!");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateProduct = async (req = request, res = response) => {
  try {
    let {
      id,
      name,
      type,
      color,
      gender,
      size,
      rating,
      price,
      description,
      image,
    } = req.body;
    if (id.length < 20) {
      return res.status(404).send("Invalid ID");
    }

    let update = await updateProductInDb(
      id,
      name,
      type,
      color,
      gender,
      size,
      rating,
      price,
      description,
      image
    );

    res.status(200).send(update);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
module.exports = {
  getProducts,
  createProduct,
  updateProduct,
};
