var Productos = {
  getData: function() {
    return $.getJSON('/api/v1/products');
  },
  insert: function (data) {
    return $.post('/api/v1/products', data);
  },
  update: function (id, data) {
    return $.ajax({
      url: '/api/v1/products/' + id,
      type: 'PUT',
      dataType: 'json',
      data: data,
    });
  },
  delete: function (id) {
    return $.ajax({url: '/api/v1/products/' + id, type: 'DELETE'});
  }
};

var refrescar = function() {
  $('#form input').val('');
  var tabla = $('#datos');
  Productos.getData().done(function(json) {
    $('#datos tr:not(:first)').remove();
    json.productos.forEach(function(producto) {
        tabla.append(
          '<tr>' + 
            '<td>' + producto.descripcion +'</td>'+
            '<td>' +
              '<a class="edit" descripcion='+ producto.descripcion +' id='+ producto.id +' href="#">Editar</a>'+
              '<a class="delete" id='+ producto.id +' href="#">Eliminar</a>'+
            '</td>'+
          '</tr>');
        $('#cancel').click();
    });
  });
}

$(document).ready(function() {
  refrescar();
  $('#refrescar').click(function(event) {
    refrescar();
  });

  $('#nuevo').click(function(event) {
    $('#form').show();
  });

  $('#cancel').click(function(event) {
    $('#form').hide();
  });

  $('#save').click(function(event) {
    var id = $('#id').val();
    var descripcion = $('#descripcion').val();
    if (id) {
      Productos.update(id, {descripcion: descripcion}).done(refrescar);
      return;
    }
    Productos.insert({descripcion: descripcion}).done(refrescar);
  });

  $('#datos').on('click', '.edit', function(event) {
    event.preventDefault();
    $('#form').show();
    $('#descripcion').val($(this).attr('descripcion'));    
    $('#id').val($(this).attr('id'));    
  });

  $('#datos').on('click', '.delete', function(event) {
    event.preventDefault();
    Productos.delete($(this).attr('id')).done(refrescar);    
  });
});

