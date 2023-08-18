import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import "./App.css";

const circleData = [
    {
        x: 100,
        y: 200,
        radius: 50,
        color: "red",
        title: "Red",
        description: "This is a red circle.",
        time: "now",
        children: [
            {
                radius: 30,
                color: "pink",
                title: "Pink",
                description: "This is a pink circle.",
                time: "later"
            },
            {
                radius: 15,
                color: "salmon",
                title: "Salmon",
                description: "This is a salmon circle.",
                time: "future"
            }
        ]
    },
    {
        x: 300,
        y: 200,
        radius: 60,
        color: "blue",
        title: "Blue",
        description: "This is a blue circle.",
        time: "future",
        children: [
            {
                radius: 40,
                color: "lightblue",
                title: "Light Blue",
                description: "This is a light blue circle.",
                time: "now"
            },
            { radius: 20, color: "cyan", title: "Cyan", description: "This is a cyan circle.", time: "later" }
        ]
    },
    {
        x: 450, // Side by side with previous
        y: 200,
        radius: 100,
        color: "green",
        title: "Main 3",
        description: "Description for Main Circle 3",
        time: "now",

        children: [
            {
                radius: 70,
                color: "lightgreen",
                title: "Child 3.1",
                description: "Description for Child Circle 3.1",
                time: "later"
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
        time: "future",
        children: [
            {
                radius: 80,
                color: "violet",
                title: "Child 4.1",
                description: "Description for Child Circle 4.1",
                time: "future"
            }
        ]
    },
    {
        x: 860, // Overlapping slightly
        y: 270,
        radius: 120,
        color: "orange",
        title: "Main 5",
        time: "now",
        description: "Description for Main Circle 5"
    },
    {
        x: 1100,
        y: 270,
        radius: 100,
        color: "cyan",
        title: "Main A",
        time: "future",
        description: "Description A",
        children: [
            {
                radius: 60,
                color: "lightcyan",
                title: "Child A1",
                description: "Description A1",
                time: "future"
            }
        ]
    },
    {
        x: 1300,
        y: 270,
        radius: 110,
        color: "magenta",
        title: "Main B",
        description: "Description B",
        time: "now"
    }
];

function D3Library() {
    const svgRef = useRef();
    const [selectedData, setSelectedData] = useState(null);
    const [filter, setFilter] = useState({
        now: true,
        future: true,
        later: true
    });

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

        svg.selectAll("*").remove();

        circleData.forEach((circle) => {
            if (!filter[circle.time]) return;

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
                .attr("dy", "0.35em")
                .text(circle.title);

            circle.children?.forEach((child) => {
                if (!filter[child.time]) return;

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
    }, [selectedData, filter]);

    return (
        <div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={filter.now}
                        onChange={() => setFilter((prev) => ({ ...prev, now: !prev.now }))}
                    />{" "}
                    Now
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={filter.future}
                        onChange={() => setFilter((prev) => ({ ...prev, future: !prev.future }))}
                    />{" "}
                    Future
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={filter.later}
                        onChange={() => setFilter((prev) => ({ ...prev, later: !prev.later }))}
                    />{" "}
                    Later
                </label>
            </div>
            <svg ref={svgRef}></svg>
            <div className="info-panel">{selectedData}</div>
        </div>
    );
}

export default D3Library;
