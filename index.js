const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute= require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const cors = require("cors")
const PORT = process.env.PORT || 5000

const methodOverride = require('method-override');
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');

dotenv.config()
app.use(express.json());
app.use(cors())
app.use(methodOverride('_method'));
// app.use("/images", express.static(path.join(__dirname,"/images")))
mongoose.set('strictQuery',true)


const uri = process.env.MONGO_URL;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    })
    .then(console.log("Connected to MongoDb"))
    .catch((err)=> console.log(err));

    // const storage = multer.diskStorage({
    //     destination: (req, file, callb) => {
    //       callb(null, "images");
    //     },
    //     filename: (req, file, callb) => {
    //       callb(null,"file.png");
    //       //callb(null, req.body.name)
    //     },
    //   });

    // const upload = multer({ storage: storage });
    // app.post("/api/upload", upload.single("file"), (req, res) => {
    // res.status(200).json("File has been uploaded");
    // })


    const storage = new GridFsStorage({
      url: uri,
      file: (req, file) => {
          return new Promise((resolve, reject) => {
              crypto.randomBytes(16, (err, buf) => {
                  if (err) {
                      return reject(err);
                  }
                  const filename = buf.toString('hex') + path.extname(file.originalname);
                  const fileInfo = {
                      filename: filename,
                      bucketName: 'uploads'
                  };
                  resolve(fileInfo);
              });
          });
      }
  })

  const upload = multer({ storage });
  const imageRouter = require('./routes/image');
  app.use('/api/upload', imageRouter(upload));

app.use("/api/auth",authRoute)
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);



app.listen(PORT,() => {
    console.log("Backend is running")
})

