const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "cchikee_db",
  "postgres",
  "P@ssw0rd",
  {
    host: "localhost",
    dialect: "postgres",
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");
    await sequelize.sync();
    console.log("✅ Models synced with database — tables ready");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
};

module.exports = { sequelize, connectDB };
