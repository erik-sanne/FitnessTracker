import React, {useEffect, useRef, useState} from 'react'
import Chart from "chart.js";
import Zoom from 'chartjs-plugin-zoom'
import "react-hammerjs"

const Graph = ({ data, style}) => {
    const canvasRef = useRef(null);
    const [chart, setChart] = useState(null);

    useEffect(() => {
        if (!data)
            return;

        Chart.plugins.register(Zoom);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (chart !== null)
            chart.destroy();

        setChart(new Chart(ctx, data))
    }, [data]);

    return (
        <div style={{...wrapStyle, ...style}}>
            <canvas ref={ canvasRef } />
        </div>
    )
}

const wrapStyle = {
    marginTop: 'min(4vw, 32px)'
}

export default Graph;