"use client"

import { useRef, useEffect } from "react"
import { Chart, Tooltip, Legend, DoughnutController, ArcElement } from "chart.js"

const CircleGraph = ({data}: any) => {
    console.log("data")
    console.log(data)
    const chartRref = useRef(null);
    useEffect(() => {
        Chart.register(DoughnutController, ArcElement, Tooltip, Legend);
        if (chartRref.current) {
            if (chartRref.current.chart) {
                chartRref.current.chart.destroy()
            }
        }

        const context = chartRref.current.getContext("2d");
        const newChart = new Chart(context, {
            type: "doughnut",
            data: data,
            options: {
                responsive: true
            }
        },

        )
        chartRref.current.chart = newChart;
    }, [])

    return (
        <canvas ref={chartRref}></canvas>
    )
}

export default CircleGraph