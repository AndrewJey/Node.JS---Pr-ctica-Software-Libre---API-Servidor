'use strict';
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const Module=require('node:module');
const pug=require('pug');
const root=path.resolve(__dirname,'..');
let scripts=0,templates=0;
function visit(folder){
  for(const entry of fs.readdirSync(folder,{withFileTypes:true})){
    if(entry.isDirectory()){
      if(!['node_modules','var','.git','.vs','.idea'].includes(entry.name))visit(path.join(folder,entry.name));
      continue;
    }
    const file=path.join(folder,entry.name);
    if(/\.(?:js|cjs)$/.test(entry.name) || entry.name==='www' || entry.name==='.sequelizerc'){
      const source=fs.readFileSync(file,'utf8').replace(/^#![^\n]*\n/,'');
      new vm.Script(Module.wrap(source),{filename:file});scripts++;
    }else if(entry.name.endsWith('.pug')){pug.compileFile(file);templates++;}
  }
}
visit(root);console.log(`Sintaxis correcta: ${scripts} scripts y ${templates} plantillas. No se inició servidor ni conexión de base de datos.`);
