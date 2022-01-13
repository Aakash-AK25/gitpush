const router=require('express').Router();
const express = require('express');
router.use(express.json());
var csrf = require('csurf')   
var csrfProtection = csrf({ cookie: true })
var cookieparser=require('cookie-parser');


router.use(cookieparser())

router.get('/',csrfProtection,function(req,res){
    res.render('pages/loginpage',{csrfToken:req.csrfToken()});
});

router.get('/orglogin',csrfProtection,function(req,res){
    res.render('pages/orglogin',{csrfToken:req.csrfToken()});
});

router.get('/clonegit',function(req,res){
    res.render('pages/clonegit');
});

router.get('/register',function(req,res){
    res.render('pages/regpage');
});

router.get('/login',function(req,res){
    res.render('pages/loginpage');
});

router.get('/alluser',function(req,res){
    res.render('pages/alluers');
});

router.get('/project',csrfProtection,function(req,res){
    res.render('pages/orglogin',{csrfToken:req.csrfToken()},);
});
router.get('/user',csrfProtection,function(req,res){
    res.render('pages/orglogin',{csrfToken:req.csrfToken()},);
});
router.get('/organizationusers',csrfProtection,function(req,res){
    res.render('pages/userlistcreate',{csrfToken:req.csrfToken()},);
});
router.get('/Organization',csrfProtection,function(req,res){
    res.render('pages/organi',{csrfToken:req.csrfToken()},);
});
router.get('/Adminuser',csrfProtection,function(req,res){
    res.render('pages/admintable',{csrfToken:req.csrfToken()});
});
router.get('/editor',function(req,res){
    res.render('pages/index');
});
router.get('/userlog',function(req,res){
    res.render('pages/userlog');
});

module.exports=router;