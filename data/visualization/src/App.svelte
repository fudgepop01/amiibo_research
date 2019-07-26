<script>
	import randomColor from 'randomcolor';
	import Stardust from 'stardust-core';
	import StardustWebGL from 'stardust-webgl';
	import * as d3 from 'd3'

	import { onMount } from 'svelte';
	import db from './db.js';

	import Grid from './Grid.svelte';

	const wait = (ms) => {return new Promise(resolve => setTimeout(() => resolve(), ms))}

	const labels = [
		'normal',
		'cautious',
		'realistic',
		'unflappable',
		'light',
		'quick',
		'lightning fast',
		'enthusiastic',
		'aggressive',
		'offensive',
		'reckless',
		'thrill seeker',
		'daredevil',
		'versatile',
		'tricky',
		'technician',
		'show-off',
		'flashy',
		'entertainer',
		'cool',
		'logical',
		'sly',
		'laid back',
		'wild',
		'lively'
	]
	let chart;
	let grid;
	let ch;
	let opts = {
		margin: {
			top: 20,
			right: 20,
			bottom: 30,
			left: 50
		},
		xmin: 0,
		xmax: 57,
		ymin: 0,
		ymax: 255,
		enableDepth: false,
		depth: 0,
		renderLimit: 10,
		label: 'lightning fast',
		selection: false,
		selectedIndex: 0,
		unselectedOpacity: 0.2,
		customFilter: `\
(v, i) => {
  let index = 0;
  let range = [0, 256];
  return range[0] <= v.data[index] && v.data[index] < range[1];
}`
	}
	let mounted = false;

	async function handleChange(key, value, update=true) {
		if (mounted) {
			opts[key] = value;

			fetchAndRender(opts);
			grid.updateOpts(opts);
		}
	}

	let circles;
	const circleSpec = Stardust.mark.circle();
	let platform;

	async function fetchAndRender({margin, xmin, xmax, ymin, ymax, label, selection, selectedIndex, unselectedOpacity, customFilter}) {
		let dataSet = db.filter({label}).value();
		dataSet = dataSet.filter(eval(customFilter));

		platform.clear([0,0,0,0]);

		circles = Stardust.mark.create(circleSpec, platform);

		circles.attr("center", (d) => [
			margin.left + (d.index - xmin) * (1240 - margin.left - margin.right) / (xmax - xmin),
			(691 - margin.bottom) - ((d.val - ymin) * (691 - margin.top - margin.bottom) / (ymax - ymin))
		]);

		circles.attr("radius", (d) => {
			return 10
		});

		circles.attr("color", (d) => {
			if (selection) {
				if (selectedIndex == -1) return [0,0,0,unselectedOpacity]
				return (d.groupIndex === selectedIndex) ? [0,0,0,1] : [0.5,0.5,0.5,unselectedOpacity]
			} else {
				return [...(d.color), 0.5]
			}

		});

		const mapped = [];

		for (const [groupIndex, entry] of dataSet.entries()) {
			const groupColor = randomColor({
				hue: ['red', 'green', 'blue',][groupIndex % 3],
				seed: groupIndex,
				format: 'rgbArray'
			}).map(v => v / 255);
			for (const [index, val] of entry.data.entries()) {
				mapped.push({
					val,
					groupIndex,
					color: groupColor,
					index
				})
			}
		}

		if (selection && selectedIndex != -1) {
			for (const [index, val] of dataSet[selectedIndex].data.entries()) {
				mapped.push({
					val,
					groupIndex: selectedIndex,
					index
				})
			}
		}

		circles.data(mapped);
		circles.render();
	}

	onMount(async () => {
		platform = Stardust.platform("webgl-2d", chart, 1240, 691);

		fetchAndRender(opts);
		grid.init();

		mounted = true;
	})
</script>

<style>
	#container {
		width: 1240px;
		height: 100%;
		display: inline-block;
		position: absolute;
	}
	#controlPanel {
		float: right;
		height: 100%;
		width: calc(100vw - 1300px);
		display: inline-block;
		background-color: #DDD;
	}
</style>

<div id="container">
	<canvas bind:this={chart}></canvas>
</div>
<Grid bind:this={grid} opts={opts}></Grid>

<div id="controlPanel">
	<select on:change={(e) => handleChange('label', e.target.value)}>
		<option value="normal">normal</option>
		<option value="cautious">cautious</option>
		<option value="realistic">realistic</option>
		<option value="unflappable">unflappable</option>
		<option value="light">light</option>
		<option value="quick">quick</option>
		<option value="lightning fast" selected>lightning fast</option>
		<option value="enthusiastic">enthusiastic</option>
		<option value="aggressive">aggressive</option>
		<option value="offensive">offensive</option>
		<option value="reckless">reckless</option>
		<option value="thrill seeker">thrill seeker</option>
		<option value="daredevil">daredevil</option>
		<option value="versatile">versatile</option>
		<option value="tricky">tricky</option>
		<option value="technician">technician</option>
		<option value="show-off">show-off</option>
		<option value="flashy">flashy</option>
		<option value="entertainer">entertainer</option>
		<option value="cool">cool</option>
		<option value="logical">logical</option>
		<option value="sly">sly</option>
		<option value="laid back">laid back</option>
		<option value="wild">wild</option>
		<option value="lively">lively</option>
	</select>

	<label for="xmin">xmin</label>
	<input id="xmin" type="number" value="0" on:change={(e) => handleChange('xmin', e.target.value)}>
	<label for="xmax">xmax</label>
	<input id="xmax" type="number" value="57" on:change={(e) => handleChange('xmax', e.target.value)}>
	<label for="ymin">ymin</label>
	<input id="ymin" type="number" value="0" on:change={(e) => handleChange('ymin', e.target.value)}>
	<label for="ymax">ymax</label>
	<input id="ymax" type="number" value="255" on:change={(e) => handleChange('ymax', e.target.value)}>
	<label for="selectionQ">selection?</label>
	<input id="selectionQ" type="checkbox" on:change={(e) => handleChange('selection', e.target.checked)}>
	<label for="selected">selected</label>
	<input id="selected" type="number" value="0" on:change={(e) => handleChange('selectedIndex', e.target.value)}>
	<label for="unselectedOpacity">unselected opacity</label>
	<input id="unselectedOpacity" type="number" value="0.2" max="1" step="0.01" on:change={(e) => handleChange('unselectedOpacity', e.target.value)}>
	<label for="filter">filter</label>
	<textArea id="filter" style="font-family: monospace; font-size: 10px" value="0.2" max="1" step="0.01" rows="8" cols="50" on:change={(e) => handleChange('customFilter', e.target.value)}>
		{opts.customFilter}
	</textArea>
</div>