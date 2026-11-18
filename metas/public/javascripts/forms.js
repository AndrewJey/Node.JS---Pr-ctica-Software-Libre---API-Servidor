'use strict';
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('form[data-submit-once]').forEach(form=>form.addEventListener('submit',event=>{
    if(form.dataset.busy==='true'){event.preventDefault();return;}
    if(form.dataset.confirm && !window.confirm(form.dataset.confirm)){event.preventDefault();return;}
    form.dataset.busy='true';form.querySelectorAll('button[type="submit"]').forEach(button=>button.disabled=true);
  }));
});
window.addEventListener('pageshow',()=>{
  document.querySelectorAll('form[data-submit-once]').forEach(form=>{
    delete form.dataset.busy;form.querySelectorAll('button[type="submit"]').forEach(button=>button.disabled=false);
  });
});
