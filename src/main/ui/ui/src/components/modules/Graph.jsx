import React, {useEffect, useRef} from 'react'
import Chart from "chart.js";

const Graph = ({ data }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!data)
            return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        new Chart(ctx, data);
    }, [data]);

    return (
        <canvas ref={ canvasRef } />
    )
}

export default Graph;