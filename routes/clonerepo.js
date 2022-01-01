const router=require('express').Router();
const express = require('express');
router.use(express.json());
const simplegit=require('simple-git');
const path=require('path');
const Path = path.join(__dirname, 'uploads');


router.post('/clone2',(req,res)=>{

    const USER = req.body.USER;
    const PASS = req.body.PASS;
    const REPO = req.body.REPO;
    const remote = `https://${USER}:${PASS}@${REPO}`;
  
    simplegit(Path).silent(true).clone(remote).then(()=> fun()).catch((err)=> fun1(err))
    function fun(){
      res.status(200).send({
        "status":"ok",
        "code":200,
        "message":"git clone successfully created"
      })
    }
    function fun1(err){
            res.status(500).send({
                "status":"fail",
                "code":500,
                "message":err.message.fatal
            });
    }
})

module.exports=router