'use strict';
const router=require('express').Router();
const models=require('../models');
router.get('/',async(req,res)=>res.json({metas:await models.metas.findAll({order:[['id','ASC']]})}));
module.exports=router;
