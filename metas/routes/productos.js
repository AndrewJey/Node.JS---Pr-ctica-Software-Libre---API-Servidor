'use strict';
const router = require('express').Router();
const models = require('../models');
const {wantsJSON, text, record} = require('../lib/http');
const {savePicture, removePicture} = require('../lib/uploads');

router.get('/', async (req,res) => {
  if (!wantsJSON(req)) return res.render('productos/index_ajax');
  res.set('Cache-Control','no-store');
  res.json({productos:await models.productos.findAll({order:[['id','ASC']]})});
});
router.get('/new', (req,res) => res.render('productos/form',{producto:{},error:''}));
router.get('/:id', async (req,res) => {
  const producto = await record(models.productos,req.params.id);
  if (wantsJSON(req)) return res.json(producto);
  res.render('productos/form',{producto,error:''});
});
async function save(req,res,editing) {
  let picture;
  try {
    const product = editing ? await record(models.productos,req.params.id) : null;
    const descripcion = text(req.body?.descripcion,'La descripción');
    picture = await savePicture(req.files?.picture);
    const previous = product?.picture;
    const data = {descripcion};
    if (picture || !editing) data.picture = picture || '';
    const saved = editing ? await product.update(data) : await models.productos.create(data);
    if (picture && previous) await removePicture(previous,models.productos);
    if (wantsJSON(req)) return res.status(editing?200:201).json(saved);
    res.redirect(303,'/api/v1/products');
  } catch(error) {
    if (picture) await removePicture(picture,models.productos);
    if (!wantsJSON(req) && error.status === 400) return res.status(400).render('productos/form',{
      producto:{descripcion:req.body?.descripcion || '',id:editing?req.params.id:undefined},error:error.message});
    throw error;
  }
}
router.post('/', (req,res) => save(req,res,false));
router.put('/:id', (req,res) => save(req,res,true));
router.delete('/:id', async (req,res) => {
  const product = await record(models.productos,req.params.id);
  const picture = product.picture;
  await product.destroy();
  await removePicture(picture,models.productos);
  if (wantsJSON(req)) return res.json({status:'ok'});
  res.redirect(303,'/api/v1/products');
});
module.exports=router;
