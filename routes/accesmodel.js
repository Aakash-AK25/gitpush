const router=require('express').Router();
const db=require('../app/config/db.config');
const Sequelize=require('sequelize');
const { DataTypes }=Sequelize;




const accesstoken=db.define('accesstoken',{id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},accesstoken:{type:DataTypes.STRING},userid:{type:DataTypes.STRING}})


module.exports=accesstoken