function createBarChart(canvasId, labels, ingresos, gastos) {
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
                        text: 'Monto ($)',
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
                                label += ': $' + context.parsed.y;
                            }
                            return label;
                        }
                    }
                }
            }
        }
    };

    const ctx = document.getElementById(canvasId).getContext('2d');
    const chart = new Chart(ctx, config);

    
    window.addEventListener('resize', () => {
        chart.resize();
    });
    
}
function createLineChart(canvasId, labels, ingresos, gastos) {
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
                        text: 'Monto ($)',
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
                                label += ': $' + context.parsed.y;
                            }
                            return label;
                        }
                    }
                }
            }
        }
    };

    const ctx = document.getElementById(canvasId).getContext('2d');
    const chart = new Chart(ctx, config);

    window.addEventListener('resize', () => {
        chart.resize();
    });
}
function getRandomColor() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `#${randomColor}`;
}

function createPieChart(canvasId, labels, values) {
    const borderColors = labels.map(() => getRandomColor())
    const backgroundColors = borderColors.map((color) => color+"80");
    

    const data = {
        labels: labels,
        datasets: [{
            label: 'Distribución',
            data: values,
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
                                label += ': $' + context.parsed; // Muestra el monto
                            }
                            return label;
                        }
                    }
                }
            }
        }
    };

    const ctx = document.getElementById(canvasId).getContext('2d');
    const chart = new Chart(ctx, config);

    window.addEventListener('resize', () => {
        chart.resize();
    });
}

