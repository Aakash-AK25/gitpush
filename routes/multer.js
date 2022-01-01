const mul=require('express').Router();
const multer=require('multer');
    var storage=multer.diskStorage({
        destination:function(req,file,callback){
           callback(null,"uploads")
        },
        filename:function(req,file,callback){
           callback(null,file.originalname)
        }
    })
    var uploadstorage=multer({storage:storage})
mul.post('/upload',uploadstorage.single("file"),(req,res)=>{
    console.log(req.file)
    return res.send(req.file.path)
})
module.exports=mul