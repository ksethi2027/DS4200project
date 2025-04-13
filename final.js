// Average O3 levels for each city
const data = [
    { city: "Kolkata", O3: 101.99 },
    { city: "Delhi", O3: 101.42 },
    { city: "Mumbai", O3: 100.83 },
    { city: "Bangalore", O3: 100.16 },
    { city: "Chennai", O3: 98.81 }
];

// Define dimensions and margins
const width = 700, height = 450, margin = { top: 50, right: 50, bottom: 60, left: 70 };

// Create the SVG container
const svg = d3.select("#barplot")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Set up scales
const x = d3.scaleBand()
    .domain(data.map(d => d.city))
    .range([margin.left, width - margin.right])
    .padding(0.3);

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
    .attr("fill", "skyblue"); 
    
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
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .style("font-family", "Arial, sans-serif")
    .style("font-weight", "bold")
    .text("Average O3 Levels by City");

// X-axis label
svg.append("text")
    .attr("x", width / 2)
    .attr("y", height - 10)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("font-family", "Arial, sans-serif")
    .attr("class", "axis-label")
    .text("City");

// Y-axis label
svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("font-family", "Arial, sans-serif")
    .attr("class", "axis-label")
    .text("O3 Level (μg/m³)");

const globalAverageO3 = 25;

// Add a line for the global average O3 level
svg.append("line")
    .attr("x1", margin.left)
    .attr("x2", width - margin.right)
    .attr("y1", y(globalAverageO3))
    .attr("y2", y(globalAverageO3))
    .attr("stroke", "firebrick")  
    .attr("stroke-width", 3)
    .attr("stroke-dasharray", "5,5");

// Add label for the global average line
svg.append("text")
    .attr("x", width - 10)
    .attr("y", y(globalAverageO3) - 5)
    .attr("text-anchor", "end")
    .style("fill", "firebrick")
    .style("font-size", "14px")
    .style("font-family", "Arial, sans-serif")
    .text(`Global Avg O3: ${globalAverageO3} μg/m³`);

