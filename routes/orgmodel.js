const router=require('express').Router();
const db=require('../app/config/db.config');
const Sequelize=require('sequelize');
const { DataTypes }=Sequelize;



const organization=db.define('organization',{orgid:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},Organizationname:{type:DataTypes.STRING},address:{type:DataTypes.STRING},city:{type:DataTypes.STRING},state:{type:DataTypes.STRING},userlimit:{type:DataTypes.STRING}})

const accesstoken=db.define('accesstoken',{id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},accesstoken:{type:DataTypes.STRING},userid:{type:DataTypes.STRING}})


module.exports=organization