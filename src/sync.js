const sequelize = require("./config/Database");
const Image = require("./models/images.js");

const syncDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await sequelize.sync({ force: true }); // Use force: true only in development
    console.log("Database synchronized.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  } finally {
    await sequelize.close();
  }
};

syncDb();
