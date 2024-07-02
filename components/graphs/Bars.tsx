"use client"

import { useRef, useEffect } from "react"
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js"

const BarsGraph = ({data}: any) => {
    const chartRref = useRef(null);
    useEffect(() => {
        Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);
        if (chartRref.current) {
            if (chartRref.current.chart) {
                chartRref.current.chart.destroy()
            }
        }

        const context = chartRref.current.getContext("2d");
        const newChart = new Chart(context, {
            type: "bar",
            data: data,
            options: {
                scales: {
                    x: {
                        type: "category"
                    },
                    y: {
                        beginAtZero: true,
                        type: "linear"
                    }
                }
            }
        },

        )
        chartRref.current.chart = newChart;
    }, [])

    return (
        <canvas ref={chartRref}></canvas>
    )
}

export default BarsGraph