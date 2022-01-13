const router = require('express').Router();
const express = require('express');
router.use(express.json());
const { validateToken } = require('./authtoken');
const orgmodel = require('./orgmodel');
const usermodel = require('./usermodels');
const crypto = require('crypto');
const getError=require('./errors/error_config.json')

router.post('/adminreg',validateToken, (req, res) => {
    usermodel.findOne({
        where: {
            email: req.body.email
        }
    }).then((a) => {
        if (a == null) {
            req.body.password = crypto.createHash('sha256').update(req.body.password).digest('base64')
            if (!req.body.role) {
                req.body.role = '1'
            }
            if (!req.body.Is_Active) {
                req.body.Is_Active = '1'
            }
            var body = req.body;
            usermodel.create(body).then((body) => {
                res.send({
                    "session": {
                    "token":req.token.split(".")[1],
                    "validity":String(req.decoded.exp),
                    "specialMessage":""
                },
                    "data":body,
                    "status": {
                    "code":200,
                    "status":getError[0],
                    "message":"User Created Successfully"
                    }
                })
            }).catch(error => {
                res.status(404).send({ 'data': error })
            })
        }
        else {
            res.send({
                "session": {
                "token":req.token.split(".")[1],
                "validity":String(req.decoded.exp),
                "specialMessage":""
            },
                "data":body,
                "status": {
                "code":601,
                "status":getError[601],
                "message":"Email Id already registered"
                }
            });
        }
    })
})

router.get('/adusertable', validateToken, (req, res) => {
    if (req.decoded.role == "1") {
        usermodel.findAll({
            where: {
                role: '1'
            }
        }).then((usermodel) => {
            res.json( {
                "session": {
                "token":req.token.split(".")[1],
                "validity":String(req.decoded.exp),
                "specialMessage":""
            },
                "data": usermodel,
                "status": {
                "code": 200,
                "status":getError[0],
                "message": "Success"
                }
            })
       })
    }
})

router.get('/allusertable', validateToken, (req, res) => {
    if (req.decoded.role == "1") {
        usermodel.findAll().then((usermodel) => {
            usermodel.forEach(
                (user) => {
                    if (user.role == "2") {
                        user.role = 'admin'
                    }
                    if (user.role == "3") {
                        user.role = "user"
                    }
                    if (user.role == "1") {
                        user.role = "super admin"
                    }
                }
            );
            res.json({
                "session": {
                "token":req.token.split(".")[1],
                "validity":String(req.decoded.exp),
                "specialMessage":""
                },
                "data": usermodel,
                "status": {
                "code": 200,
                "status":getError[0],
                "message": "Success"
                }
            });
        });
    }
})

module.exports = router