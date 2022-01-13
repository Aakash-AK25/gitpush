const router=require('express').Router();
const db=require('../app/config/db.config');
const Sequelize=require('sequelize');
const { DataTypes }=Sequelize;




const repoaasign=db.define('assignrepo',{id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},repoid:{type:DataTypes.STRING},orgid:{type:DataTypes.STRING},userid:{type:DataTypes.STRING},username:{type:DataTypes.STRING}})

module.exports=repoaasign