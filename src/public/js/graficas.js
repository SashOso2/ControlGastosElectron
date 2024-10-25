function destroyChart(ctx) {
    const chartInstance = Chart.getChart(ctx.canvas); // Obtiene el gráfico asociado al canvas
    if (chartInstance) {
        chartInstance.destroy(); // Destruye el gráfico si existe
    }
}
function getRandomColor() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `#${randomColor}`;
}

//--------------------------------------//
function createBarChart(canvasId, labels, ingresos, gastos) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    destroyChart(ctx);
    
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Ingresos',
                data: ingresos,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
            {
                label: 'Gastos',
                data: gastos,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Monto (S/)',
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Mes',
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (context.parsed.y !== null) {
                                label += ': ' + FormatoSoles(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            }
        }
    };

    
    const chart = new Chart(ctx, config);
    window.addEventListener("resize",()=>{
        chart.resize()
    })
    
}
function createLineChart(canvasId, labels, ingresos, gastos) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Ingresos',
                data: ingresos,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
            {
                label: 'Gastos',
                data: gastos,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
            }
        ]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Monto (S/)',
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Mes',
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (context.parsed.y !== null) {
                                label += ': ' +FormatoSoles(context.parsed.y) ;
                            }
                            return label;
                        }
                    }
                }
            }
        }
    };

    const chart = new Chart(ctx, config);
    

    window.addEventListener('resize', () => {
        chart.resize();
    });
}
function createPieChart(canvasId, labels, values) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    destroyChart(ctx);
    // Filtra las etiquetas y valores para eliminar los que son 0
    const filteredData = labels.reduce((acc, label, index) => {
        if (values[index] !== 0) {
            acc.labels.push(label);
            acc.values.push(values[index]);
        }
        return acc;
    }, { labels: [], values: [] });

    const borderColors = filteredData.labels.map(() => getRandomColor());
    const backgroundColors = borderColors.map(color => color + "80");

    const data = {
        labels: filteredData.labels,
        datasets: [{
            label: 'Distribución',
            data: filteredData.values,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
        }]
    };

    const config = {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (context.parsed !== null) {
                                label += ': ' + FormatoSoles(context.parsed); // Muestra el monto
                            }
                            return label;
                        }
                    }
                }
            }
        }
    };

    const chart = new Chart(ctx, config);
    window.addEventListener("resize",()=>{
        chart.resize()
    })
}


