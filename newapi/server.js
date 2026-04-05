const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({
  origin: "http://localhost:4200",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// import all models before connectDB so sequelize.sync() registers all tables
require("./models/userModel");
require("./models/itemsModel");
require("./models/categoryModel");

const Product      = require("./models/productModel");
const ProductImage = require("./models/productImageModel");
const Category     = require("./models/categoryModel");
const Cart         = require("./models/cartModel");
const Wishlist     = require("./models/wishlistModel");
const Coupon       = require("./models/couponModel");
const Order        = require("./models/orderModel");
const OrderItem    = require("./models/orderItemModel");

// product <-> productImage
Product.hasMany(ProductImage,   { as: "images", foreignKey: "product_id", onDelete: "CASCADE", hooks: true });
ProductImage.belongsTo(Product, { foreignKey: "product_id" });

// cart associations
const User = require("./models/userModel");
Cart.belongsTo(User,    { foreignKey: "user_id" });
Cart.belongsTo(Product, { as: "product", foreignKey: "product_id" });

// wishlist associations
Wishlist.belongsTo(User,    { foreignKey: "user_id" });
Wishlist.belongsTo(Product, { as: "product", foreignKey: "product_id" });

// order associations
Order.hasMany(OrderItem, { as: "items", foreignKey: "order_id", onDelete: "CASCADE", hooks: true });
OrderItem.belongsTo(Order,   { foreignKey: "order_id" });
OrderItem.belongsTo(Product, { as: "product", foreignKey: "product_id" });

// product <-> category (three FK associations)
Product.belongsTo(Category, { as: "levelOneCategory", foreignKey: "level_one_category" });
Product.belongsTo(Category, { as: "levelTwoCategory", foreignKey: "level_two_category" });
Product.belongsTo(Category, { as: "category",         foreignKey: "category_id" });

const { connectDB } = require("./database/connection");

connectDB();

app.get("/", (_req, res) => {
  res.send("Server running");
});

app.use("/api", require("./routers/indexRouter"));

app.listen(3000, () => {
  console.log("🚀 Server started on port 3000");
});
