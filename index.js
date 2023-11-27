const express = require("express");
const bodyParser = require('body-parser');
const path = require('node:path');
const app = express();
const db = require('./models')

const multer  = require('multer');


const weatherRoute = require('./route/wheater/user.route')
const authRoute = require("./route/auth/auth.route");
const articleRoute = require("./route/artikel/route.index")
const lmsRoute = require("./route/LMS/lms.route")
const uploadImages = require("./route/upload.route")


db.sequelize
    .authenticate()
    .then(() => {
        console.log('Koneksi ke database berhasil.');
    })
    .catch(err => {
        console.log('Gagal koneksi ke database: ', err);
    })

app.use(express.json())

app.get('/', (req, res) => {
    return res.status(200).json({
        message: "selamat datang du aplikasi node.hs + expressjs + sequelize + SQL"
})
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use("/weather",weatherRoute);
app.use("/auth", authRoute);
app.use("/article",articleRoute);
app.use("/lms",lmsRoute);
app.use("/upload",uploadImages);

app.use('/images',express.static('images'))

const port = 8002;

app.listen(port, () =>{
    console.log(`server starter on port ${port}`)
})

