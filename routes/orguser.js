const router = require('express').Router();
const express = require('express');
router.use(express.json());
const { validateToken } = require('./authtoken');
const orgmodel = require('./orgmodel');
const usermodel = require('./usermodels');
const repomodel = require('./repomodel');
const crypto = require('crypto');


router.post('/orguserreg', validateToken, (req, res) => {
    if (req.decoded.role == "2") {
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
                if(!req.body.orgid){
                    req.body.orgid=req.decoded.name
                }
                var body = req.body;
                usermodel.create(body).then((body) => {
                    res.send({ 'data': body })
                }).catch(error => {
                    res.status(404).send({ 'data': error })
                })
            }
            else {
                res.send({ 'data': req.body });
            }
        })
    }
    else {

    }
})

router.get('/usertable', validateToken, (req, res) => {
    if (req.decoded.role == "2") {
        usermodel.findAll({
            where: {
                orgid:req.decoded.name
            }
        }).then((usermodel) => {
            console.log(usermodel)
            res.json({ 'status': 'pass', 'data': usermodel });
        });
    }
    else { }
})

router.get('/orgrepotable', validateToken, (req, res) => {
    if (req.decoded.role == "2") {
        repomodel.findAll({
            where:{
                orgid:req.decoded.name
            }
        }).then((repomodel) => {
            res.json({ 'status': 'pass', 'data': repomodel });
        });
    }
    else {

    }
})

module.exports = router