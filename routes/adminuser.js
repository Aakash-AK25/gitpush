const router = require('express').Router();
const express = require('express');
router.use(express.json());
const { validateToken } = require('./authtoken');
const orgmodel = require('./orgmodel');
const usermodel = require('./usermodels');
const crypto = require('crypto');


router.post('/adminreg', validateToken, (req, res) => {
    if (req.decoded.role == "1") {
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

router.get('/adusertable', validateToken, (req, res) => {
    if (req.decoded.role == "1") {
        usermodel.findAll({
            where: {
                role: '1'
            }
        }).then((usermodel) => {
            res.json({ 'status': 'pass', 'data': usermodel });
        });
    }
    else { }
})

router.get('/allusertable', validateToken, (req, res) => {
    if (req.decoded.role == "1") {
        usermodel.findAll().then((usermodel) => {
            res.json({ 'status': 'pass', 'data': usermodel });
        });
    }
    else {

    }
})

module.exports = router