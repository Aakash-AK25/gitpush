const router=require('express').Router();
const express = require('express');
router.use(express.json());
const dree = require('dree');
const fs = require('fs');


router.get('/tree1',(req,res)=>{
    const tree = dree.scan('uploads/Skin-Disease-Classifier');
    var str = JSON.stringify(tree);
    str = str.replace(/\"name\":/g, "\"text\":");
    str = str.replace(/\"path\":/g, "\"id\":");
    res.send(JSON.parse(str))
});

router.get('/fileread/:filepath',(req,res)=>{
    var str=req.params.filepath
    var tr=str.replace(/[\^]/g,'/');
      fs.readFile(tr,'utf8',(err,buf)=>{
          res.send(buf)
      })
})

module.exports=router;
