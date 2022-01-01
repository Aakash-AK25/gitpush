const router = require('express').Router();
const express = require('express');
router.use(express.json());
const { validateToken } = require('./authtoken');

const orgmodel = require('./orgmodel')


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

router.get('/orgtable', validateToken, (req, res) => {
    if (req.decoded.role == "1") {
        orgmodel.findAll().then((orgmodel) => {
            res.json({ 'status': 'pass', 'data': orgmodel });
        });
    }
    else {

    }
})

module.exports = router