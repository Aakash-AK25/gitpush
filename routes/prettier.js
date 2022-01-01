const router=require('express').Router();
const express = require('express');
router.use(express.json());
const prettier = require('prettier');
const fs = require('fs');


router.get('/javafile/:name', (req, res) => {
    fs.readFile('uploads/'+req.params.name, 'utf-8', (err, buf) => {
      const fordat = prettier.format(buf, {
        parser: 'java',
        tabWidth: 4,
      });
      fs.writeFile('uploads/'+req.params.name, fordat, (err) => {
        console.log('Successfully Written to File.');
      });
    });
    res.send('success');
});
router.get('/pythonfile/:name', (req, res) => {
    fs.readFile('uploads/'+req.params.name, 'utf-8', (err, buf) => {
      const fordat = prettier.format(buf, {
        parser: 'python',
        plugins:["@unibeautify/beautifier-black"],
        tabWidth: 2,
      });
      fs.writeFile('uploads/'+req.params.name, fordat, (err) => {
        console.log('Successfully Written to File.');
      });
    });
    res.send('success');
});

module.exports=router;