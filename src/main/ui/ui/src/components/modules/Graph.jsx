import React, {useEffect, useRef, useState} from 'react'
import Chart from "chart.js";
import Zoom from 'chartjs-plugin-zoom'
import "react-hammerjs"

const Graph = ({ data }) => {
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
        <div style={wrapStyle}>
            <canvas ref={ canvasRef } />
        </div>
    )
}

const wrapStyle = {
    marginTop: 'min(4vw, 32px)'
}

export default Graph;