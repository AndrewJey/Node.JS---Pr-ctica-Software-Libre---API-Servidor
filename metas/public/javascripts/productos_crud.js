'use strict';
document.addEventListener('DOMContentLoaded',()=>{
  const form=document.getElementById('form'),body=document.getElementById('products-body');
  const status=document.getElementById('estado'),message=document.getElementById('mensaje');
  const search=document.getElementById('buscar'),description=document.getElementById('descripcion'),id=document.getElementById('id');
  let products=[],busy=false,sequence=0;
  async function api(url,options={}){
    const response=await fetch(url,{...options,headers:{Accept:'application/json',...(options.body?{'Content-Type':'application/json'}:{}),...options.headers}});
    const data=await response.json().catch(()=>({error:'Respuesta no válida del servidor.'}));
    if(!response.ok)throw new Error(data.error || 'No se pudo completar la operación.');
    return data;
  }
  function render(){
    const term=search.value.trim().toLocaleLowerCase('es');
    const rows=products.filter(p=>p.descripcion.toLocaleLowerCase('es').includes(term));
    body.replaceChildren();
    for(const product of rows){
      const row=document.createElement('tr');
      const name=document.createElement('td');name.dataset.label='Descripción';name.textContent=product.descripcion;
      const image=document.createElement('td');image.dataset.label='Imagen';
      if(product.picture?.startsWith('/images/')){
        const img=document.createElement('img');img.src=product.picture;img.alt=product.descripcion;img.className='thumbnail';img.loading='lazy';image.append(img);
      }else image.textContent='Sin imagen';
      const actions=document.createElement('td');actions.dataset.label='Acciones';actions.className='actions';
      for(const [label,action] of [['Editar',()=>open(product)],['Eliminar',()=>remove(product)]]){
        const button=document.createElement('button');button.type='button';button.textContent=label;button.className=label==='Eliminar'?'danger':'secondary';
        button.setAttribute('aria-label',`${label} ${product.descripcion}`);button.disabled=busy;button.addEventListener('click',action);actions.append(button);
      }
      row.append(name,image,actions);body.append(row);
    }
    status.textContent=products.length===0?'Aún no hay productos. Crea el primero.':rows.length===0?'No hay coincidencias.':`${rows.length} de ${products.length} productos`;
  }
  async function load(){
    const current=++sequence;status.textContent='Cargando productos…';body.setAttribute('aria-busy','true');
    try{const data=await api('/api/v1/products');if(current!==sequence)return;products=data.productos;render();}
    catch(error){if(current===sequence)status.textContent=error.message+' Puedes actualizar la lista para reintentar.';}
    finally{if(current===sequence)body.removeAttribute('aria-busy');}
  }
  function open(product){
    if(busy)return;
    form.reset();id.value=product?.id || '';description.value=product?.descripcion || '';
    document.getElementById('formTitle').textContent=product?'Editar producto':'Nuevo producto';
    message.textContent='';form.hidden=false;description.focus();
  }
  function setBusy(value){busy=value;document.querySelectorAll('button').forEach(button=>button.disabled=value);}
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(busy || !form.reportValidity())return;
    const value=description.value.trim();if(!value){message.textContent='La descripción es obligatoria.';return;}
    setBusy(true);++sequence;
    try{await api('/api/v1/products'+(id.value?'/'+id.value:''),{method:id.value?'PUT':'POST',body:JSON.stringify({descripcion:value})});
      form.hidden=true;form.reset();message.textContent='Producto guardado.';await load();
    }catch(error){message.textContent=error.message;}
    finally{setBusy(false);body.removeAttribute('aria-busy');}
  });
  async function remove(product){
    if(busy || !window.confirm(`¿Eliminar «${product.descripcion}»?`))return;
    setBusy(true);++sequence;
    try{await api('/api/v1/products/'+product.id,{method:'DELETE'});message.textContent='Producto eliminado.';await load();}
    catch(error){message.textContent=error.message;}
    finally{setBusy(false);body.removeAttribute('aria-busy');}
  }
  document.getElementById('nuevo').addEventListener('click',()=>open());
  document.getElementById('cancel').addEventListener('click',()=>{form.hidden=true;form.reset();});
  document.getElementById('refrescar').addEventListener('click',load);search.addEventListener('input',render);load();
});
