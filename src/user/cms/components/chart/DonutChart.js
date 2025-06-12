import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = ({ chartData }) => {
    // Fungsi untuk menghasilkan warna acak yang menarik
    const generateColors = (numColors) => {
        const colors = [];
        for (let i = 0; i < numColors; i++) {
            const hue = (i * 360 / numColors) % 360;
            colors.push(`hsl(${hue}, 70%, 60%)`);
        }
        return colors;
    };
    
    const data = {
        labels: chartData.map(item => item.kategori_nama),
        datasets: [
            {
                label: 'Pengeluaran',
                data: chartData.map(item => item.total),
                backgroundColor: generateColors(chartData.length),
                borderColor: '#ffffff',
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%', // Membuat lubang di tengah lebih besar
        plugins: {
            legend: {
                position: 'bottom', // Pindahkan legenda ke bawah
                labels: {
                    padding: 20,
                    boxWidth: 12,
                    font: {
                        size: 14
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed !== null) {
                            // Format sebagai mata uang Rupiah
                            label += new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(context.parsed);
                        }
                        return label;
                    }
                }
            }
        }
    };

    return <Doughnut data={data} options={options} />;
};

export default DonutChart;