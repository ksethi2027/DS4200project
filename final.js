//average O3 levels for each city
const data = [
    { city: "Kolkata", O3: 101.99 },
    { city: "Delhi", O3: 101.42 },
    { city: "Mumbai", O3: 100.83 },
    { city: "Bangalore", O3: 100.16 },
    { city: "Chennai", O3: 98.81 }
];

// Define dimensions and margins
const width = 600, height = 400, margin = { top: 50, right: 50, bottom: 50, left: 60 };

// Create the SVG container
const svg = d3.select("#barplot")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Set up scales
const x = d3.scaleBand()
    .domain(data.map(d => d.city))
    .range([margin.left, width - margin.right])
    .padding(0.4);

const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.O3)])
    .nice()
    .range([height - margin.bottom, margin.top]);

// Draw bars
svg.append("g")
    .selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.city))
    .attr("y", d => y(d.O3))
    .attr("height", d => height - margin.bottom - y(d.O3))
    .attr("width", x.bandwidth())
    .attr("fill", "steelblue");

// Add values on top of bars
svg.append("g")
    .selectAll(".bar-label")
    .data(data)
    .enter().append("text")
    .attr("class", "bar-label")
    .attr("x", d => x(d.city) + x.bandwidth() / 2)
    .attr("y", d => y(d.O3) - 5) // Position slightly above the bar
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("fill", "black")
    .text(d => d.O3.toFixed(2));

// Add x-axis
svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-15)")
    .style("text-anchor", "end");

// Add y-axis
svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

// Add chart title
svg.append("text")
    .attr("x", width / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Average O3 Levels by City");

// X-axis label
svg.append("text")
    .attr("x", width / 2)
    .attr("y", height - 10)
    .attr("text-anchor", "middle")
    .attr("class", "axis-label")
    .text("City");

// Y-axis label
svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .attr("class", "axis-label")
    .text("O3 Level");

// Add legend
const legend = svg.append("g")
    .attr("transform", `translate(${width - 130}, ${margin.top})`);

legend.append("rect")
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", "steelblue");

legend.append("text")
    .attr("x", 20)
    .attr("y", 12)
    .text("O3 Level")
    .attr("alignment-baseline", "middle")
    .attr("font-size", "12px");