const express = require("express");
const routes = express.Router();

const adminRouter = require("./v1/adminRoute");
const billRouter = require("./v1/billRoute");
const carRouter = require("./v1/carRoute");
const cartRouter = require("./v1/cartRoute");
const customerRouter = require("./v1/customerRoute");

routes.use("/api/v1/admins", adminRouter);
routes.use("/api/v1/bills", billRouter);
routes.use("/api/v1/cars", carRouter);
routes.use("/api/v1/carts", cartRouter);
routes.use("/api/v1/customers", customerRouter);

module.exports = routes;
