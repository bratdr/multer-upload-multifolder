const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("multer_multifolder", "root", "brata", {
  host: "localhost",
  dialect: "mysql",
  port: 3306,
});

module.exports = sequelize;
