$(document).ready(function() {
  getData();
});

function getData() {
  $.getJSON('/api/v1/clients/categorias', {}, function(json, textStatus) {
      draw_chart(json);
  });
}

function draw_chart(data) {
  Highcharts.chart('chart', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false
    },
    title: {
        text: 'Categoria de clientes',
        align: 'center',
        verticalAlign: 'middle',
        y: 40
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            dataLabels: {
                enabled: true,
                distance: -50,
                style: {
                    fontWeight: 'bold',
                    color: 'white'
                }
            },
            startAngle: -90,
            endAngle: 90,
            center: ['50%', '75%']
        }
    },
    series: [{
        type: 'pie',
        name: 'Categoría de Clientes',
        innerSize: '50%',
        data: data
    }]
  });
}
