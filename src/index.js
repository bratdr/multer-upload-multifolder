const express = require("express");
const multer = require("multer");
const path = require("path");
const Image = require("./models/images");
const sequelize = require("./config/Database");

const app = express();

// Serve static files from the images directory
app.use("/images", express.static(path.join(__dirname, "../images")));

// Serve the HTML form
app.use(express.static(path.join(__dirname, "../public")));

// Define storage engine with dynamic destination
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = req.params.folder; // expecting 'banner' or 'project'
    let uploadPath = "";

    if (folder === "banner") {
      uploadPath = path.join(__dirname, "../images/banner");
    } else if (folder === "project") {
      uploadPath = path.join(__dirname, "../images/project");
    } else {
      return cb(new Error("Invalid folder type"), false);
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Endpoint to handle image uploads
app.post("/upload/:folder", upload.single("image"), async (req, res) => {
  const folder = req.params.folder;
  const file = req.file;

  if (!file) {
    return res.status(400).send("No file uploaded.");
  }

  // Construct the full URL
  const fileUrl = `${req.protocol}://${req.get("host")}/images/${folder}/${
    file.filename
  }`;

  // Save file information to the database
  try {
    const imageRecord = await Image.create({
      filename: file.filename,
      folder: folder,
      path: fileUrl,
    });

    res.status(200).json({
      message: "File uploaded successfully",
      file: imageRecord,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save file info to the database" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
