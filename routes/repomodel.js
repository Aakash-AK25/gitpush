const router=require('express').Router();
const db=require('../app/config/db.config');
const Sequelize=require('sequelize');
const { DataTypes }=Sequelize;



const repo=db.define('repo',{id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},orgid:{type:DataTypes.STRING},userid:{type:DataTypes.STRING},reponame:{type:DataTypes.STRING},path:{type:DataTypes.STRING},createdby:{type:DataTypes.STRING}})


module.exports=repo