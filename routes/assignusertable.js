const router = require('express').Router();
const express = require('express');
router.use(express.json());
const { validateToken } = require('./authtoken');
const orgmodel = require('./orgmodel');
const usermodel = require('./usermodels');
const repomodel = require('./repomodel');
const assignmodel = require('./repoassignmodel');
const { Op, Model, DataTypes, where } = require("sequelize");
const sequelize = require('sequelize');
const getError=require('./errors/error_config.json')

// assignmodel.belongsTo(usermodel)
// usermodel.hasMany(assignmodel)



router.get('/repoasstbl/:id', validateToken, (req, res) => {
    assignmodel.findAll({
        where: {
            repoid: req.params.id,
            orgid: req.decoded.name
        }
    }).then((assignmodel) => {
        res.send({
            "session": {
            "token":req.token.split(".")[1],
            "validity":String(req.decoded.exp),
            "specialMessage":""
        },
            "data":assignmodel,
            "status": {
            "code":200,
            "status":getError[0],
            "message":"Success"
            }
        })
    })
})

router.get('/repounasstbl/:repoid', validateToken, (req, res) => {
    const assuser = assignmodel.findAll({
        where: { repoid: req.params.repoid},
        attributes: ["userid"],
        group: ["userid"]
    }).then(async (a) => {
        var v = a.map(users => users.userid);
        console.log(v)
        var v1 = usermodel.findAll({
            where: {
                id: { [Op.notIn]: v },
                role:{[Op.ne]:"2"},
                orgid: req.decoded.name
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

router.post('/adassing', validateToken, (req, res) => {
    var body = { 'userid': req.body.userid, 'username': req.body.username, 'repoid': req.body.repoid, 'orgid': req.decoded.name }
    assignmodel.create(body).then((body) => {
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
            "message":"Successfully assigned"
            }
        })
    })
})

router.delete('/deleteassing/:repoid/:id', validateToken, async (req, res) => {
    assignmodel.destroy({
        where: {
            userid: req.params.id,
            repoid: req.params.repoid
        }
    }).then(function (rowDeleted) {
        if (rowDeleted === 1) {
            res.send({
                "session": {
                "token":req.token.split(".")[1],
                "validity":String(req.decoded.exp),
                "specialMessage":""
            },
                "data":{"userid":req.params.id,"repoid":req.params.repoid},
                "status":{
                "code":200,
                "status":getError[0],
                "message":"Successfully deleted"
                }
            })
        }
    }, function (err) {
        console.log(err);
    });

})

//admincntrl
router.get('/adminrepoasstbl/:id/:orgid', validateToken, (req, res) => {
    assignmodel.findAll({
        where: {
            repoid: req.params.id,
            orgid: req.params.orgid
        }
    }).then((assignmodel) => {
        res.send({
            "session": {
            "token":req.token.split(".")[1],
            "validity":String(req.decoded.exp),
            "specialMessage":""
        },
            "data":assignmodel,
            "status": {
            "code":200,
            "status":getError[0],
            "message":"Success"
            }
        })
    })
})

router.get('/adminrepounasstbl/:repoid/:orgid', validateToken, (req, res) => {
    const assuser = assignmodel.findAll({
        where: { repoid: req.params.repoid },
        attributes: ["userid"],
        group: ["userid"]
    }).then(async (a) => {
        var v = a.map(users => users.userid);
        console.log(v)
        var v1 = usermodel.findAll({
            where: {
                id: { [Op.notIn]: v },
                orgid: req.params.orgid,
                role:{[Op.ne]:"2"}
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

router.post('/adminadassing', validateToken, (req, res) => {
    var body = { 'userid': req.body.userid, 'username': req.body.username, 'repoid': req.body.repoid, 'orgid': req.body.orgid }
    assignmodel.create(body).then((body) => {
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
            "message":"Successfully assigned"
            }
        })
    })
})

router.delete('/admindeleteassing/:repoid/:id', validateToken, async (req, res) => {
    assignmodel.destroy({
        where: {
            userid:req.params.id,
            repoid:req.params.repoid
        }
    }).then(function (rowDeleted) {
        if (rowDeleted === 1) {
            res.send({
                "session": {
                "token":req.token.split(".")[1],
                "validity":String(req.decoded.exp),
                "specialMessage":""
            },
                "data":{"userid":req.params.id,"repoid":req.params.repoid},
                "status":{
                "code":200,
                "status":getError[0],
                "message":"Successfully deleted"
                }
            })
        }
    }, function (err) {
        console.log(err);
    });

})
router.get('/userasstbl/:id', validateToken, (req, res) => {
    assignmodel.findAll({
        where: {
            userid: req.params.id,
            orgid: req.decoded.name,
        },
        attributes: ["repoid"],
        group: ["repoid"]
    }).then(async(a) => {
        var v = a.map(users => users.repoid);
        var v1 = repomodel.findAll({
            where: {
                id: { [Op.in]: v },
                orgid: req.decoded.name,
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

router.get('/userunasstbl/:id', validateToken, (req, res) => {
    const assuser = assignmodel.findAll({
        where: { userid: req.params.id },
        attributes: ["repoid"],
        group: ["repoid"]
    }).then(async (a) => {
        var v = a.map(users => users.repoid);
        console.log(v)
        var v1 = repomodel.findAll({
            where: {
                id: { [Op.notIn]: v },
                orgid: req.decoded.name,
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

router.post('/repoadassing', validateToken, (req, res) => {
    usermodel.findOne({
        where: {
            id: req.body.userid
        }
    }).then((a) => {
        var body = { 'userid': req.body.userid, 'username':a.Name, 'repoid': req.body.repoid, 'orgid': req.decoded.name }
        assignmodel.create(body).then((body) => {
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
                "message":"Successfully assigned"
                }
            })
        })
    })
})
router.get('/adminuserunasstbl/:id', validateToken, (req, res) => {
    const assuser = assignmodel.findAll({
        where: { userid: req.params.id },
        attributes: ["repoid"],
        group: ["repoid"]
    }).then(async (a) => {
        var v = a.map(users => users.repoid);
        console.log(v)
        var v1 = repomodel.findAll({
            where: {
                id: { [Op.notIn]: v },
                orgid: req.decoded.name,
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

router.post('/adminrepoadassing', validateToken, (req, res) => {
    usermodel.findOne({
        where: {
            id: req.body.userid
        }
    }).then((a) => {
        var body = { 'userid': req.body.userid, 'username':a.Name, 'repoid': req.body.repoid, 'orgid': req.body.orgid }
        assignmodel.create(body).then((body) => {
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
                "message":"Successfully assigned"
                }
            })
        })
    })
})
//admin

router.get('/adminuserasstbl/:id/:orgid', validateToken, (req, res) => {
    assignmodel.findAll({
        where: {
            userid: req.params.id,
            orgid: req.params.orgid
        },
        attributes: ["repoid"],
        group: ["repoid"]
    }).then(async(a) => {
        var v = a.map(users => users.repoid);
        var v1 = repomodel.findAll({
            where: {
                id: { [Op.in]: v },
                orgid: req.params.orgid
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

router.get('/adminuserunasstbl/:id/:orgid', validateToken, (req, res) => {
    const assuser = assignmodel.findAll({
        where: { userid: req.params.id },
        attributes: ["repoid"],
        group: ["repoid"]
    }).then(async (a) => {
        var v = a.map(users => users.repoid);
        console.log(v)
        var v1 = repomodel.findAll({
            where: {
                id: { [Op.notIn]: v },
                orgid: req.params.orgid
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