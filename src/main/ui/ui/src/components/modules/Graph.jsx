import React, {useEffect, useRef, useState} from 'react'
import { Chart, registerables } from "chart.js";
import zoomPlugin from 'chartjs-plugin-zoom'
import 'chartjs-adapter-moment'
import "react-hammerjs"

const Graph = ({ data, style, callback}) => {
    const canvasRef = useRef(null);
    const [chart, setChart] = useState(null);

    useEffect(() => {
        if (callback)
            callback(canvasRef.current)
    }, [callback])

    useEffect(() => {
        if (!data)
            return;

        Chart.register(...registerables)
        Chart.register(zoomPlugin);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (chart !== null)
            chart.destroy();

        setChart(new Chart(ctx, data))
    }, [data]);

    return (
        <div style={{...style}} className={ 'chart-wrapper' }>
            <canvas ref={ canvasRef } />
        </div>
    )
}

export default Graph;