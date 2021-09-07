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
        Chart.pluginService.register({
            beforeInit: function(chart) {
                // We get the chart data
                const data = chart.config.data;

                // For every dataset ...
                for (let i = 0; i < data.datasets.length; i++) {
                    // We get the dataset's function and calculate the value
                    const fct = data.datasets[i].function;
                    if (!fct)
                        continue;

                    data.datasets[i].data = [];
                    // For every label ...
                    for (let j = 0; j < data.labels.length; j++) {
                        const x = Math.round((new Date(data.labels[j]).getTime() - new Date(data.labels[0]).getTime()) / (1000 * 60 * 60 * 24));
                        const y = fct(x);
                        // Then we add the value to the dataset data
                        data.datasets[i].data.push(y);
                    }
                }
            }
        });

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