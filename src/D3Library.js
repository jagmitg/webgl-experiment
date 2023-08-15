import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import "./App.css";

const circleData = [
    {
        x: 100,
        y: 200,
        radius: 80,
        color: "red",
        title: "Main 1",
        description: "Description for Main Circle 1",
        children: [
            {
                radius: 50,
                color: "pink",
                title: "Child 1.1",
                description: "Description for Child Circle 1.1"
            },
            {
                radius: 25,
                color: "salmon",
                title: "Child 1.2",
                description: "Description for Child Circle 1.2"
            }
        ]
    },
    {
        x: 250, // Overlapping with the previous circle
        y: 200,
        radius: 90,
        color: "blue",
        title: "Main 2",
        description: "Description for Main Circle 2",
        children: [
            {
                radius: 60,
                color: "lightblue",
                title: "Child 2.1",
                description: "Description for Child Circle 2.1"
            },
            { radius: 30, color: "cyan", title: "Child 2.2", description: "Description for Child Circle 2.2" }
        ]
    },
    {
        x: 450, // Side by side with previous
        y: 200,
        radius: 100,
        color: "green",
        title: "Main 3",
        description: "Description for Main Circle 3",
        children: [
            {
                radius: 70,
                color: "lightgreen",
                title: "Child 3.1",
                description: "Description for Child Circle 3.1"
            }
        ]
    },
    {
        x: 650, // Side by side
        y: 250,
        radius: 110,
        color: "purple",
        title: "Main 4",
        description: "Description for Main Circle 4",
        children: [
            {
                radius: 80,
                color: "violet",
                title: "Child 4.1",
                description: "Description for Child Circle 4.1"
            }
        ]
    },
    {
        x: 860, // Overlapping slightly
        y: 270,
        radius: 120,
        color: "orange",
        title: "Main 5",
        description: "Description for Main Circle 5"
    },
    {
        x: 1100,
        y: 270,
        radius: 100,
        color: "cyan",
        title: "Main A",
        description: "Description A",
        children: [{ radius: 60, color: "lightcyan", title: "Child A1", description: "Description A1" }]
    },
    {
        x: 1300,
        y: 270,
        radius: 110,
        color: "magenta",
        title: "Main B",
        description: "Description B"
    }
];

function D3Library() {
    const svgRef = useRef();
    const [selectedData, setSelectedData] = useState(null);

    useEffect(() => {
        const svg = d3
            .select(svgRef.current)
            .style("width", 1020)
            .style("height", 800)
            .attr("viewBox", `0 0 1020 800`)
            .style("overflow", "visible");

        const zoom = d3
            .zoom()
            .scaleExtent([0.5, 5])
            .on("zoom", (event) => {
                svg.attr("transform", event.transform);
            });

        svg.call(zoom);

        // Reset previously drawn circles
        svg.selectAll("*").remove();

        circleData.forEach((circle) => {
            // Parent Circle
            const parent = svg.append("g");

            parent
                .append("circle")
                .attr("cx", circle.x)
                .attr("cy", circle.y)
                .attr("r", circle.radius)
                .attr("fill", circle.color)
                .classed("selectable-circle", true)
                .on("click", () => {
                    setSelectedData(circle.description);
                    d3.selectAll(".selected").classed("selected", false);
                    d3.select(this).classed("selected", true);
                });

            parent
                .append("text")
                .attr("x", circle.x)
                .attr("y", circle.y)
                .attr("text-anchor", "middle")
                .attr("dy", "0.35em") // to vertically center the text
                .text(circle.title);

            // Children Circles (Concentric Circles)
            circle.children?.forEach((child) => {
                const childGroup = svg.append("g");

                childGroup
                    .append("circle")
                    .attr("cx", circle.x)
                    .attr("cy", circle.y)
                    .attr("r", child.radius)
                    .attr("fill", child.color)
                    .classed("selectable-circle", true)
                    .on("click", () => {
                        setSelectedData(child.description);
                        d3.selectAll(".selected").classed("selected", false);
                        d3.select(this).classed("selected", true);
                    });

                childGroup
                    .append("text")
                    .attr("x", circle.x)
                    .attr("y", circle.y)
                    .attr("text-anchor", "middle")
                    .attr("dy", "0.35em")
                    .text(child.title);
            });
        });
    }, [selectedData]);

    return (
        <div>
            <svg ref={svgRef}></svg>
            <div className="info-panel">{selectedData}</div>
        </div>
    );
}

export default D3Library;
