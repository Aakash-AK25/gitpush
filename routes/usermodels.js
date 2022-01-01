const router=require('express').Router();
const db=require('../app/config/db.config');
const Sequelize=require('sequelize');
const { DataTypes }=Sequelize;


const user=db.define('user',{id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},orgid:{type:DataTypes.STRING},Name:{type:DataTypes.STRING},email:{type:DataTypes.STRING},phone:{type:DataTypes.STRING},password:{type:DataTypes.STRING},role:{type:DataTypes.INTEGER},Is_Active:{type:DataTypes.INTEGER}})



module.exports=user