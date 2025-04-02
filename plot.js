const pm25Data = [
    { city: "Kolkata", PM25: 85.2 },
    { city: "Delhi", PM25: 92.5 },
    { city: "Mumbai", PM25: 78.4 },
    { city: "Bangalore", PM25: 69.8 },
    { city: "Chennai", PM25: 75.1 }
];

const margin = { top: 60, right: 40, bottom: 60, left: 70 },
      width = 700 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

const svg = d3.select("#lineplot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const xScale = d3.scalePoint()
    .domain(pm25Data.map(d => d.city))
    .range([0, width])
    .padding(0.5);

const yScale = d3.scaleLinear()
    .domain([0, d3.max(pm25Data, d => d.PM25)])
    .nice()
    .range([height, 0]);

//X Axis
svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

//Y Axis
svg.append("g")
    .call(d3.axisLeft(yScale));

//Line path generator
const line = d3.line()
    .x(d => xScale(d.city))
    .y(d => yScale(d.PM25));

const path = svg.append("path")
    .datum(pm25Data)
    .attr("fill", "none")
    .attr("stroke", "#E63946")
    .attr("stroke-width", 3)
    .attr("d", line);

const totalLength = path.node().getTotalLength();

path
    .attr("stroke-dasharray", totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", 0);

const dotsGroup = svg.append("g");

dotsGroup.selectAll("circle")
    .data(pm25Data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.city))
    .attr("cy", d => yScale(d.PM25))
    .attr("r", 0)
    .attr("fill", "#E63946")
    .transition()
    .delay((d, i) => 500 + i * 250)
    .duration(400)
    .attr("r", 6);

//Value labels
dotsGroup.selectAll("text")
    .data(pm25Data)
    .enter()
    .append("text")
    .attr("x", d => xScale(d.city))
    .attr("y", d => yScale(d.PM25) - 12)
    .attr("text-anchor", "middle")
    .style("fill", "#333")
    .style("font-size", "12px")
    .style("opacity", 0)
    .text(d => d.PM25.toFixed(1))
    .transition()
    .delay((d, i) => 800 + i * 250)
    .duration(300)
    .style("opacity", 1);

//Chart title
svg.append("text")
    .attr("x", width / 2)
    .attr("y", -20)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .style("font-family", "sans-serif")
    .text("PM2.5 Levels in Indian Cities");

//Axis labels
svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .text("City");

svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -50)
    .attr("text-anchor", "middle")
    .text("PM2.5 (μg/m³)");