const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const DBCON = require("./Database/db.js");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
DBCON();
//routes
const addCollection = require("./routes/addCollection.js");
const getCollections = require("./routes/getCollections.js");
const addProduct = require("./routes/addProduct.js");
const getProducts = require("./routes/getProducts.js");
const getProductById = require("./routes/getProductById.js");
const getProductsByIds = require("./routes/getProductsByIds.js");
const checkout = require("./routes/checkout.js");
const addOrder = require("./routes/addOrder.js");
const randomCollection = require("./routes/randomCollection.js");
const getOrders = require("./routes/getOrders.js");
const getSpecificOrder = require("./routes/getSpecificOrder.js");
const updateOrder = require("./routes/updateOrder.js");
const getAllProducts = require("./routes/getAllProducts.js");
const getSpecificProduct = require("./routes/getSpecificProduct.js");
const updateProduct = require("./routes/updateProduct.js");
const search = require("./routes/search.js");
//routes
// route registration
app.use("/api/addCollection", addCollection);
app.use("/api/addProduct", addProduct);
app.use("/api/getCollections", getCollections);
app.use("/api/getProducts", getProducts);
app.use("/api/getProductById", getProductById);
app.use("/api/getProductsByIds", getProductsByIds);
app.use("/api/create-payment-intent", checkout);
app.use("/api/addOrder", addOrder);
app.use("/api/getRandomCollection", randomCollection);
app.use("/api/getOrders", getOrders);
app.use("/api/getSpecificOrder", getSpecificOrder);
app.use("/api/updateOrder", updateOrder);
app.use("/api/getAllProducts", getAllProducts);
app.use("/api/getSpecificProduct", getSpecificProduct);
app.use("/api/updateProduct", updateProduct);
app.use("/api/search", search);
// route registration

app.listen(process.env.PORT, () => {
  console.log("Server is running");
});
