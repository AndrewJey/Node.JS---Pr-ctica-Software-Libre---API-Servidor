'use strict';
const {test,before,beforeEach,after}=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs/promises');
const {execFile}=require('node:child_process');
const {promisify}=require('node:util');
const {once}=require('node:events');

const url=new URL(process.env.DATABASE_URL || 'postgresql://invalid/invalid');
if(process.env.NODE_ENV!=='test' || process.env.METAS_TEST_DATABASE!=='1' || !/^\/codex_metas_test_[a-z0-9_]+$/.test(url.pathname))
  throw new Error('Las pruebas requieren NODE_ENV=test, METAS_TEST_DATABASE=1 y una base desechable nueva codex_metas_test_<nombre>.');
const models=require('../models');
const {uploadDir}=require('../lib/uploads');
let server,base,migrationProof;
const headers={Accept:'application/json','Content-Type':'application/json'};
const call=(endpoint,method='GET',data)=>fetch(base+endpoint,{method,headers,body:data===undefined?undefined:JSON.stringify(data),redirect:'manual'});
const migrate=(...args)=>promisify(execFile)(process.execPath,[require.resolve('sequelize-cli/lib/sequelize'),'db:migrate',...args],{cwd:path.resolve(__dirname,'..'),env:process.env});
const uploads=()=>fs.readdir(uploadDir).catch(error=>error.code==='ENOENT'?[]:Promise.reject(error));

before(async()=>{
  const [tables]=await models.sequelize.query("SELECT tablename FROM pg_tables WHERE schemaname='public'");
  assert.equal(tables.length,0,'Usa una base nueva; las pruebas no borran una base preexistente.');
  await migrate('--to','20170530010005-create_table_usuario_meta_valor.js');
  await models.sequelize.query(`
    INSERT INTO categoria_clientes(id,descripcion) VALUES(900001,'Migración');
    INSERT INTO clientes(id,nombre,email,telefono,categoria_cliente_id) VALUES(900001,'Migración','migration@example.com','0',900001);
    INSERT INTO productos(id,descripcion,picture) VALUES(900001,'Migración','');
    INSERT INTO usuarios(id,nombre,email,clave) VALUES(900001,'Fixture','fixture@example.com','fixture-local');
    INSERT INTO metas(id,descripcion,valor_esperado,fecha_limite,producto_id) VALUES(900001,'Migración',100,CURRENT_TIMESTAMP,900001);
    INSERT INTO usuario_meta(id,meta_id,usuario_id) VALUES(900001,900001,900001);
    INSERT INTO usuario_meta_valor(id,um_id,cliente_id,valor) VALUES(900001,900001,900001,123);
  `);
  await migrate();await migrate();
  const [rows]=await models.sequelize.query('SELECT usuario_meta_id,valor FROM usuario_meta_valor WHERE id=900001');
  const [columns]=await models.sequelize.query("SELECT column_name FROM information_schema.columns WHERE table_name='usuario_meta_valor'");
  const [applied]=await models.sequelize.query('SELECT name FROM "SequelizeMeta"');
  migrationProof={row:rows[0],columns:columns.map(c=>c.column_name),applied:applied.length};
  server=require('../app').listen(0,'127.0.0.1');await once(server,'listening');base='http://127.0.0.1:'+server.address().port;
});
beforeEach(async()=>{
  await models.sequelize.query('TRUNCATE usuario_meta_valor,usuario_meta,metas,usuarios,clientes,productos,categoria_clientes RESTART IDENTITY CASCADE');
});
after(async()=>{
  if(server){server.close();await once(server,'close');}
  await models.sequelize.close();
});

test('all migrations apply twice and the historic alteration preserves rows',()=>{
  assert.equal(migrationProof.applied,8);
  assert.deepEqual(migrationProof.row,{usuario_meta_id:900001,valor:123});
  assert.equal(migrationProof.columns.includes('um_id'),false);
});
test('product CRUD works without a photo, trims Unicode and ignores server-managed fields',async()=>{
  let response=await call('/api/v1/products','POST',{descripcion:' Café con leche ',id:99,picture:'/etc/passwd'});
  assert.equal(response.status,201);const product=await response.json();
  assert.equal(product.id,1);assert.equal(product.descripcion,'Café con leche');assert.equal(product.picture,'');
  response=await call('/api/v1/products/1','PUT',{descripcion:'Té actualizado'});assert.equal(response.status,200);
  assert.equal((await response.json()).descripcion,'Té actualizado');
  assert.equal((await (await call('/api/v1/products')).json()).productos.length,1);
  assert.equal((await call('/api/v1/products/1','DELETE')).status,200);
  assert.equal((await call('/api/v1/products/1')).status,404);
});
test('invalid product data never inserts or partially updates',async()=>{
  for(const descripcion of ['', ' ', 'x'.repeat(256), ['array'], 7])
    assert.equal((await call('/api/v1/products','POST',{descripcion})).status,400);
  assert.equal(await models.productos.count(),0);
  await call('/api/v1/products','POST',{descripcion:'Original'});
  assert.equal((await call('/api/v1/products/1','PUT',{descripcion:' '})).status,400);
  assert.equal((await models.productos.findByPk(1)).descripcion,'Original');
});
test('invalid and missing IDs have 400/404 responses',async()=>{
  for(const resource of ['products','clients'])for(const method of ['GET','PUT','DELETE']){
    assert.equal((await call('/api/v1/'+resource+'/abc',method,method==='PUT'?{}:undefined)).status,400);
    assert.equal((await call('/api/v1/'+resource+'/999',method,method==='PUT'?{}:undefined)).status,404);
  }
});
test('uploaded PNG uses a generated path, is served safely and is removed on delete',async()=>{
  const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aPo8AAAAASUVORK5CYII=','base64');
  const form=new FormData();form.set('descripcion','Con imagen');form.set('picture',new Blob([png],{type:'image/png'}),'../../fuera.png');
  const response=await fetch(base+'/api/v1/products',{method:'POST',headers:{Accept:'application/json'},body:form});
  assert.equal(response.status,201);const product=await response.json();
  assert.match(product.picture,/^\/images\/uploads\/[a-f0-9-]+\.png$/);
  const image=await fetch(base+product.picture);assert.equal(image.status,200);assert.equal(image.headers.get('x-content-type-options'),'nosniff');
  assert.deepEqual(Buffer.from(await image.arrayBuffer()),png);
  assert.equal((await uploads()).length,1);
  await call('/api/v1/products/'+product.id,'DELETE');assert.deepEqual(await uploads(),[]);
});
test('bad and oversized uploads are rejected without rows or files',async()=>{
  for(const [data,type,status] of [['<svg onload="alert(1)"></svg>','image/svg+xml',400],[Buffer.alloc(5*1024*1024+1),'image/png',413]]){
    const form=new FormData();form.set('descripcion','No guardar');form.set('picture',new Blob([data],{type}),'bad.png');
    const response=await fetch(base+'/api/v1/products',{method:'POST',headers:{Accept:'application/json'},body:form});
    assert.equal(response.status,status);
  }
  assert.equal(await models.productos.count(),0);assert.deepEqual(await uploads(),[]);
});
test('client CRUD persists valid category and text, escapes HTML and validates before editing',async()=>{
  const category=await models.categoria_clientes.create({descripcion:'General'});
  const name='<img src=x onerror=alert(1)>';
  let response=await call('/api/v1/clients','POST',{nombre:name,email:'cafe@example.com',telefono:'+506 8888-8888',categoria_cliente_id:category.id});
  assert.equal(response.status,201);const client=await response.json();assert.equal(client.nombre,name);
  const page=await fetch(base+'/api/v1/clients',{headers:{Accept:'text/html'}});const html=await page.text();
  assert.match(html,/&lt;img/);assert.equal(html.includes(name),false);
  response=await call('/api/v1/clients/'+client.id,'PUT',{nombre:'No guardar',email:'invalid',telefono:'9'});
  assert.equal(response.status,400);assert.equal((await models.clientes.findByPk(client.id)).nombre,name);
  response=await call('/api/v1/clients/'+client.id,'PUT',{nombre:'Nuevo',email:'nuevo@example.com',telefono:'1',categoria_cliente_id:''});
  assert.equal(response.status,200);assert.equal((await response.json()).categoria_cliente_id,null);
  assert.equal((await call('/api/v1/clients/'+client.id,'DELETE')).status,200);
});
test('missing category or invalid client values never write',async()=>{
  const data={nombre:'Cliente',email:'valid@example.com',telefono:'1'};
  for(const extra of [{nombre:' '},{email:'bad'},{telefono:'x'.repeat(51)},{categoria_cliente_id:999},{nombre:['bad']}])
    assert.equal((await call('/api/v1/clients','POST',{...data,...extra})).status,400);
  assert.equal(await models.clientes.count(),0);
});
test('categories include zero counts and keep equal descriptions as distinct groups',async()=>{
  const one=await models.categoria_clientes.create({descripcion:'Iguales'});
  await models.categoria_clientes.create({descripcion:'Iguales'});
  await models.clientes.create({nombre:'Uno',email:'uno@example.com',telefono:'1',categoria_cliente_id:one.id});
  const rows=await(await call('/api/v1/clients/categorias')).json();
  assert.deepEqual(rows,[['Iguales',1],['Iguales',0]]);
});
test('browser form without photo redirects 303, and invalid forms preserve values',async()=>{
  const response=await fetch(base+'/api/v1/products',{method:'POST',headers:{Accept:'text/html','Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({descripcion:'Formulario sin foto'}),redirect:'manual'});
  assert.equal(response.status,303);
  const invalid=await fetch(base+'/api/v1/clients',{method:'POST',headers:{Accept:'text/html','Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({nombre:'Conservar este nombre',email:'invalid',telefono:'1'})});
  assert.equal(invalid.status,400);assert.match(await invalid.text(),/Conservar este nombre/);
});
test('asynchronous database failures return a controlled error and server remains usable',async()=>{
  const original=models.productos.findAll;
  try{
    models.productos.findAll=async()=>{throw new Error('internal-test-detail');};
    const response=await call('/api/v1/products');assert.equal(response.status,500);assert.doesNotMatch(await response.text(),/internal-test-detail|stack/i);
  }finally{models.productos.findAll=original;}
  assert.equal((await call('/api/v1/products')).status,200);
});
test('foreign-key conflict returns 409 and preserves the referenced product',async()=>{
  const product=await models.productos.create({descripcion:'Usado',picture:''});
  await models.metas.create({descripcion:'Meta',valor_esperado:100,fecha_limite:new Date(),producto_id:product.id});
  assert.equal((await call('/api/v1/products/'+product.id,'DELETE')).status,409);
  assert.ok(await models.productos.findByPk(product.id));
});
test('demo categories can be added twice without duplicates or deletion',async()=>{
  await models.categoria_clientes.create({descripcion:'Conservar'});
  for(let run=0;run<2;run++)await promisify(execFile)(process.execPath,['scripts/demo.js'],{cwd:path.resolve(__dirname,'..'),env:process.env});
  const rows=await models.categoria_clientes.findAll({order:[['descripcion','ASC']]});
  assert.deepEqual(rows.map(row=>row.descripcion),['Conservar','Frecuente','General']);
});
test('malformed JSON is rejected and health and pages are available',async()=>{
  const bad=await fetch(base+'/api/v1/products',{method:'POST',headers,body:'{bad'});assert.equal(bad.status,400);
  for(const endpoint of ['/health','/metas'])assert.equal((await call(endpoint)).status,200);
  for(const endpoint of ['/','/api/v1/products','/api/v1/products/new','/api/v1/clients','/api/v1/clients/new','/api/v1/clients/categorias']){
    const response=await fetch(base+endpoint,{headers:{Accept:'text/html'}});assert.equal(response.status,200,endpoint);assert.match(await response.text(),/name="viewport"/);
  }
});
