const login=require('express').Router();
const express=require('express');
login.use(express.json());
const crypto=require('crypto');
const jwt=require('jsonwebtoken');
const usermodel = require('./usermodels')
const orgmodel = require('./orgmodel')
const repo = require('./repomodel');
const organization = require('./orgmodel');
const accmodel=require('./accesmodel');
const { validateToken } = require('./authtoken');
const getError=require('./errors/error_config.json')

login.post('/l/login',(req,res)=>{
    var password=crypto.createHash('sha256').update(req.body.password).digest('base64');
    var a=usermodel.findOne({
        where:{
            email:req.body.email,
        }
    }).then((a)=>{
        if(a==null){
           res.send({
            "session": {
            "token":"",
            "validity":"",
            "specialMessage":""
        },
            "data":req.body,
            "status":{
            "code":101,
            "status":getError[101],
            "message":"User not found"
            }
        })
        }
        else if(a.password==password){
            const user={name:a.orgid,id:a.id,role:a.role}
            if(a.role=="1"){
                role='admin';
            }
            else if(a.role=="2"){
                role='org';
            }
            else{
                role='user';
            }
            const accesstoken=generatetoken(user)
            accmodel.create({accesstoken:accesstoken,userid:a.id}).then(()=>{
                res.send({
                    "session": {
                    "token":accesstoken.split(".")[1],
                    "validity":"",
                    "specialMessage":""
                },
                    "data":{'accesstoken':accesstoken,'role':role},
                    "status":{
                    "code":200,
                    "status":getError[0],
                    "message":"Successfully loggedin"
                    }
                })
            })
        }
        else{
            res.send({
                "session": {
                "token":"",
                "validity":"",
                "specialMessage":""
            },
                "data":req.body,
                "status":{
                "code":101,
                "status":getError[101],
                "message":"password incorrect"
                }
            });
        }
    }).catch((error)=>{
        console.log(error);
    })
    
    //     else{
    //         const email=result[0].email
    //         const password=result[0].password
    //         if(hpassword==password){
    //             const user={name:email}
    //             const accesstoken=generatetoken(user)
    //             res.send({accesstoken:accesstoken})
    //         }
    //         else{
    //             res.send('password incorrect')
    //         }
    //     }
    // })
})

login.get('/getname',validateToken,(req,res)=>{
    var id=req.decoded.name
     orgmodel.findOne({
         where:{
             orgid:id
         }
     }).then((a)=>{
         res.send({'orgname':a.Organizationname})
     })
})

login.get('/getuname',validateToken,(req,res)=>{
    var id=req.decoded.id
     usermodel.findOne({
         where:{
             id:id
         }
     }).then((a)=>{
         res.send({'name':a.Name})
     })
})

function generatetoken(user){
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'2h'})
}

module.exports=login