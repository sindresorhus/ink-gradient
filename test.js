import React from 'react';
import {serial as test} from 'ava';
import {render} from 'ink-testing-library';
import clearModule from 'clear-module';
import stripAnsi from 'strip-ansi';

test('render', t => {
	// Render color here too when https://github.com/chalk/supports-color/issues/78 is fixed
	process.env.FORCE_COLOR = 1;
	clearModule('.');
	const Gradient = require('.');

	const {lastFrame} = render(
		<Gradient name="rainbow">
			{`

	██╗   ██╗ ███╗   ██╗ ██╗  ██████╗  ██████╗  ██████╗  ███╗   ██╗ ███████╗
	██║   ██║ ████╗  ██║ ██║ ██╔════╝ ██╔═══██╗ ██╔══██╗ ████╗  ██║ ██╔════╝
	██║   ██║ ██╔██╗ ██║ ██║ ██║      ██║   ██║ ██████╔╝ ██╔██╗ ██║ ███████╗
	██║   ██║ ██║╚██╗██║ ██║ ██║      ██║   ██║ ██╔══██╗ ██║╚██╗██║ ╚════██║
	╚██████╔╝ ██║ ╚████║ ██║ ╚██████╗ ╚██████╔╝ ██║  ██║ ██║ ╚████║ ███████║

			`}
		</Gradient>
	);
	console.log(lastFrame());
	t.snapshot(stripAnsi(lastFrame()));

	delete process.env.FORCE_COLOR;
});
