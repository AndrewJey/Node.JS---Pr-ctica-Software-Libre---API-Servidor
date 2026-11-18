'use strict';
const router = require('express').Router();
const models = require('../models');
const {HttpError,wantsJSON,id,text,record} = require('../lib/http');
const categories = () => models.categoria_clientes.findAll({order:[['descripcion','ASC'],['id','ASC']]});
router.get('/', async(req,res) => {
  res.set('Cache-Control','no-store');
  if(wantsJSON(req)) return res.json({clientes:await models.clientes.findAll({order:[['id','ASC']]})});
  res.render('clientes/index',{clientes:await models.clientes.all()});
});
router.get('/new',async(req,res)=>res.render('clientes/form',{cliente:{},categorias:await categories(),error:''}));
router.get('/categorias',async(req,res)=>{
  const categorias=await models.categoria_clientes.all();
  if(wantsJSON(req)) return res.json(categorias.map(c=>[c.descripcion,c.cantidad_clientes]));
  res.render('clientes/categorias',{categorias});
});
router.get('/:id',async(req,res)=>{
  const cliente=await record(models.clientes,req.params.id);
  if(wantsJSON(req)) return res.json(cliente);
  res.render('clientes/form',{cliente,categorias:await categories(),error:''});
});
async function save(req,res,editing){
  try{
    const existing=editing?await record(models.clientes,req.params.id):null;
    const data={nombre:text(req.body?.nombre,'El nombre'),email:text(req.body?.email,'El email'),telefono:text(req.body?.telefono,'El teléfono',50)};
    if(!require('sequelize').Validator.isEmail(data.email)) throw new HttpError(400,'El email no es válido.');
    const category=req.body?.categoria_cliente_id;
    data.categoria_cliente_id=category===undefined || category===null || category===''?null:id(category);
    if(data.categoria_cliente_id && !await models.categoria_clientes.findByPk(data.categoria_cliente_id))
      throw new HttpError(400,'La categoría seleccionada no existe.');
    const saved=editing?await existing.update(data):await models.clientes.create(data);
    if(wantsJSON(req)) return res.status(editing?200:201).json(saved);
    res.redirect(303,'/api/v1/clients');
  }catch(error){
    if(!wantsJSON(req) && error.status===400) return res.status(400).render('clientes/form',{
      cliente:{...req.body,id:editing?req.params.id:undefined},categorias:await categories(),error:error.message});
    throw error;
  }
}
router.post('/',(req,res)=>save(req,res,false));
router.put('/:id',(req,res)=>save(req,res,true));
router.delete('/:id',async(req,res)=>{
  const cliente=await record(models.clientes,req.params.id);await cliente.destroy();
  if(wantsJSON(req)) return res.json({status:'ok'});
  res.redirect(303,'/api/v1/clients');
});
module.exports=router;
