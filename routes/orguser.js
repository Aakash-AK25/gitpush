const router = require('express').Router();
const express = require('express');
router.use(express.json());
const { validateToken } = require('./authtoken');
const orgmodel = require('./orgmodel');
const usermodel = require('./usermodels');
const repomodel = require('./repomodel');
const assignmodel = require('./repoassignmodel');
const crypto = require('crypto');
const { Op, Model, DataTypes, where } = require("sequelize");
const getError=require('./errors/error_config.json')


router.post('/orguserreg', validateToken, (req, res) => {
    usermodel.findOne({
        where: {
            email: req.body.email
        }
    }).then((a) => {
        if (a == null) {
            req.body.password = crypto.createHash('sha256').update(req.body.password).digest('base64')
            if (!req.body.role) {
                req.body.role = '3'
            }
            if (!req.body.Is_Active) {
                req.body.Is_Active = '1'
            }
            if (!req.body.orgid) {
                req.body.orgid = req.decoded.name
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
                    "status":{
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
                "status":{
                "code":601,
                "status":getError[601],
                "message":"User already present"
                }
            });
        }
    })
})

router.get('/usertable', validateToken, (req, res) => {
    usermodel.findAll({
        where: {
            orgid: req.decoded.name,
            id:{[Op.ne]:req.decoded.id}
        }
    }).then((usermodel) => {
        usermodel.forEach(
            (user) => {
                if (user.role == "2") {
                    user.role = 'admin'
                }
                if (user.role == "3") {
                    user.role = "user"
                }
            }
        );
        res.json({
            "session": {
            "token":req.token.split(".")[1],
            "validity":String(req.decoded.exp),
            "specialMessage":""
        },
            "data":usermodel,
            "status":{
            "code":200,
            "status":getError[0],
            "message":"success"
            }
        });
    });
})

router.get('/orgrepotable', validateToken, (req, res) => {
    repomodel.findAll({
        where: {
            orgid: req.decoded.name
        }
    }).then((repomodel) => {
        res.json({
            "session": {
            "token":req.token.split(".")[1],
            "validity":String(req.decoded.exp),
            "specialMessage":""
        },
            "data":repomodel,
            "status":{
            "code":200,
            "status":getError[0],
            "message":"Success"
            }
        });
    });
})

router.get('/userprojecttable', validateToken, (req, res) => {
    const assuser = assignmodel.findAll({
        where: {
            userid: req.decoded.id
        },
        attributes: ["repoid"],
        group: ["repoid"]
    }).then(async (a) => {
        var v = a.map(users => users.repoid);
        var v1 = repomodel.findAll({
            where: {
                id: { [Op.in]: v}
            }
        }).then((a) => {
            res.send({
                "session": {
                "token":req.token.split(".")[1],
                "validity":String(req.decoded.exp),
                "specialMessage":""
            },
                "data":a,
                "status":{
                "code":200,
                "status":getError[0],
                "message":"Success"
                }
            })
        })
    })
})
module.exports = router