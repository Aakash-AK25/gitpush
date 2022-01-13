const router = require('express').Router();
const express = require('express');
router.use(express.json());
const { validateToken } = require('./authtoken');
const crypto = require('crypto');
const orgmodel = require('./orgmodel')
const repomodel = require('./repomodel')
const usermodel = require('./usermodels')
const simplegit = require('simple-git');
const path = require('path');
const uploadpath = path.dirname(require.main.filename)
const Path = path.join(uploadpath, 'uploads');
var fs = require('fs');
const getError=require('./errors/error_config.json')
// const orgmodel = require('./orgmodel')



router.post('/orgreg', validateToken, (req, res) => {
    if (req.decoded.role == "1") {
        orgmodel.findOne({
            where: {
                Organizationname: req.body.Organizationname
            }
        }).then((a) => {
            if (a == null) {
                var body = req.body;
                orgmodel.create(body).then((body) => {
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
                        "message":"Organization Created Successfully"
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
                    "code":901,
                    "status":getError[901],
                    "message":"Organization already Presents"
                    }
                });
            }
        })
    }
})

router.get('/orgtable', validateToken, (req, res) => {
    if (req.decoded.role == "1") {
        orgmodel.findAll().then((orgmodel) => {
            res.json({
                "session": {
                "token":req.token.split(".")[1],
                "validity":String(req.decoded.exp),
                "specialMessage":""
            },
                "data":orgmodel,
                "status":{
                "code":200,
                "status":getError[0],
                "message":"Success"
                }
            });
        });
    }
})

router.get('/orgrepolistable/:orgid', validateToken, (req, res) => {
    repomodel.findAll({
        where: {
            orgid: req.params.orgid
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
router.get('/adminusertable/:orgid', validateToken, (req, res) => {
    usermodel.findAll({
        where: {
            orgid: req.params.orgid
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
            "message":"Success"
            }
        });
    });
})
router.post('/adminorguserreg', validateToken, (req, res) => {
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
                "data":req.body,
                "status":{
                "code":601,
                "status":getError[601],
                "message":"User already presents"
                }
            });
        }
    })
})

router.post('/clone1', validateToken, (req, res) => {
    var a = orgmodel.findOne({
        where: {
            orgid:req.body.orgid
        }
    }).then((a) => {
        clone(a.Organizationname)
    })
    function clone(a) {
        const USER = req.body.USER;
        const PASS = req.body.PASS;
        const REPO = req.body.REPO;
        const remote = `https://${USER}:${PASS}@${REPO}`;
        var dirr = REPO.split("/")
        var len = dirr.length
        const lastfold = dirr[len - 1].split('.');
        const final = a + "/" + lastfold[0]
        const final1 = lastfold[0]
        const dir = path.join(Path, final);
        console.log(final)
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        simplegit(dir).silent(false).clone(remote).then((log) => fun(log)).catch((err) => fun1(err))
        function fun(log) {
            console.log(log)
            usermodel.findOne({
                where: {
                    id: req.decoded.id
                }
            }).then((usermodel) => {
                var ct = usermodel.Name
                var body = { 'orgid': req.body.orgid, 'userid': req.decoded.id, 'reponame': final1, 'createdby': ct, 'path': dir }
                repomodel.create(body).then((body) => {
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
                        "message":"git cloned successfully"
                        }
                    })
                })
            })
        }
    }
    function fun1(err) {
        res.send({
            "session": {
            "token":req.token.split(".")[1],
            "validity":String(req.decoded.exp),
            "specialMessage":""
        },
            "data":body,
            "status":{
            "code":104,
            "status":getError[104],
            "message":err.message
            }
        });
    }
})
module.exports = router