const router = require('express').Router();
const express = require('express');
router.use(express.json());
const path = require('path');
const uploadpath = path.dirname(require.main.filename)
const Path = path.join(uploadpath, 'uploads');
const { validateToken } = require('./authtoken');
const simplegit = require('simple-git');
const orgmodel = require('./orgmodel');
const usermodel = require('./usermodels');
const repomodel = require('./repomodel');
const assignmodel = require('./repoassignmodel');
const dirTree = require("directory-tree");
const crypto = require('crypto');
var fs = require('fs');
const dree = require('dree');
const getError=require('./errors/error_config.json')

router.post('/clone2', validateToken, (req, res) => {
    var a = orgmodel.findOne({
        where: {
            orgid: req.decoded.name
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
                var body = { 'orgid': req.decoded.name, 'userid': req.decoded.id, 'reponame': final1, 'createdby': ct, 'path': dir }
                repomodel.create(body).then((body) => {
                    res.status(200).send({
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

// router.get('/tree/:repoid', (req, res) => {
//     repomodel.findOne({
//         where: {
//             id: req.params.repoid
//         }
//     }).then((a) => {
//         console.log(a.path);
//         const tree = dirTree(a.path);
//         res.send(tree)
//     })
//     // var str = JSON.stringify(tree);
//     // str = str.replace(/\"name\":/g, "\"text\":");
//     // str = str.replace(/\"path\":/g, "\"id\":");
// })
router.get('/tree1/:repoid', (req, res) => {
    repomodel.findOne({
        where: {
            id:req.params.repoid
        }
    }).then((a) => {
        const tree = dree.scan(a.path);
        var str = JSON.stringify(tree);
        str = str.replace(/\"name\":/g, "\"text\":");
        str = str.replace(/\"path\":/g, "\"id\":");
        res.send(JSON.parse(str))
    })

});

router.get('/fileread/:filepath', (req, res) => {
    var str = req.params.filepath
    var tr = str.replace(/[\^]/g, '/');
    fs.readFile(tr, 'utf8', (err, buf) => {
        res.send(buf)
    })
})
module.exports = router