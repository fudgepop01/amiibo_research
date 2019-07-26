<script>
  import * as d3 from 'd3'
  import { onMount } from 'svelte';

  let svg;

  export let opts;
  let {xmin, xmax, ymin, ymax, margin} = opts
  $: width = 1240 - margin.left - margin.right;
  $: height = 691 - margin.top - margin.bottom;

  let xScale = d3.scaleLinear();
  let yScale = d3.scaleLinear();

  let xAxisCall = d3.axisBottom();
  let yAxisCall = d3.axisLeft();

  let xGridCall = d3.axisBottom();
  let yGridCall = d3.axisLeft();

  export function updateOpts(opts) {
    margin = opts.margin;
    xmin = opts.xmin;
    xmax = opts.xmax;
    ymin = opts.ymin;
    ymax = opts.ymax;

    xScale.domain([xmin, xmax]).range([0, width]);
    yScale.domain([ymin, ymax]).range([height, 0]);

    updateGrid();
  }

  function updateGrid() {
    let t = d3.transition().duration(200);

    svg.selectAll(".grid.x").transition(t).call(xGridCall);
    svg.selectAll(".grid.y").transition(t).call(yGridCall);

    svg.select(".x_axis").transition(t).call(xAxisCall);
    svg.select(".y_axis").transition(t).call(yAxisCall);
  }

  export async function init() {
    xScale.range([0, width]).domain([xmin, xmax]);
    yScale.range([height, 0]).domain([ymin, ymax]);

    xAxisCall.scale(xScale);
    yAxisCall.scale(yScale);

    xGridCall.scale(xScale);
    yGridCall.scale(yScale);

			svg
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("class", "main_g")
			.attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")

      svg = d3.select(".main_g");

			svg.append("g")
				.attr("class", "grid x")
				.attr("transform", "translate(0," + height + ")")
				.call(
          xGridCall
            .ticks(24)
						.tickSize(-height)
						.tickFormat("")
				)
			svg.append("g")
				.attr("class", "grid y")
				.call(
          yGridCall
            .ticks(20)
						.tickSize(-width)
						.tickFormat("")
				)
      svg.append("g")
        .attr("class", "x_axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxisCall.ticks(24).tickSize(10).tickFormat(v => v.toString().includes(".") ? "" : `${v}\n(${v.toString(16).padStart(2, '0')})` ));
      svg.append("g")
        .attr("class", "y_axis")
				.call(yAxisCall.ticks(20).tickSize(10));
  }

  onMount(async () => {
    svg = d3.select("#grid");
	})
</script>

<style>
  :global(.grid line) {
		stroke: lightgrey;
		opacity: 0.7;
		shape-rendering: crispEdges;
	}
</style>

<svg id="grid"></svg>