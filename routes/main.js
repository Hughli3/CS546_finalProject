const express = require("express");
const router = express.Router();
const fs = require('fs') 

const multer = require('multer');
const upload = multer({dest: __dirname + '/uploads/images'});

router.get("/", async (req, res) => {
    res.render('posts/index');
});

router.post("/update", upload.single('avatar'), async (req, res) => {  
    if(!req.file) {
        console.log('no file input');
    } else if(req.file.mimetype.split("/")[0] != "image") {
        fs.unlinkSync(req.file.path)
        console.log("type error, image only");
    } else {
        let suffix = "."+req.file.originalname.split('.').pop()
        let oldPath = req.file.path
        let newPath = oldPath.replace("routes\\uploads","public") + suffix

        let fileName = req.file.filename + suffix
        //在数据库中存文件名，然后直接在模板中调用名字就行。

        fs.rename(oldPath, newPath, function(err){if(err) console.log(err)})

        res.render('posts/index', {img:fileName});
    }
});

router.get("/:name", async (req, res) => {
    // console.log(req.params.name)
    if(!fs.existsSync("./public/images/"+req.params.name)){
        console.log("file is not exists");
    } else {
        console.log(fs.existsSync("./public/images/"+req.params.name));
        fs.unlinkSync("./public/images/"+req.params.name)
        console.log("file is removed");
        console.log(fs.existsSync("./public/images/"+req.params.name));
    }
});

module.exports = router;