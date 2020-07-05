import React from 'react';
import {serial as test} from 'ava';
import {Text} from 'ink';
import {render} from 'ink-testing-library';
import clearModule from 'clear-module';

test('render', t => {
	// Render color here too when https://github.com/chalk/supports-color/issues/78 is fixed
	process.env.FORCE_COLOR = 1;
	clearModule('.');
	const Gradient = require('.');

	const text = `
		██╗   ██╗ ███╗   ██╗ ██╗  ██████╗  ██████╗  ██████╗  ███╗   ██╗ ███████╗
		██║   ██║ ████╗  ██║ ██║ ██╔════╝ ██╔═══██╗ ██╔══██╗ ████╗  ██║ ██╔════╝
		██║   ██║ ██╔██╗ ██║ ██║ ██║      ██║   ██║ ██████╔╝ ██╔██╗ ██║ ███████╗
		██║   ██║ ██║╚██╗██║ ██║ ██║      ██║   ██║ ██╔══██╗ ██║╚██╗██║ ╚════██║
		╚██████╔╝ ██║ ╚████║ ██║ ╚██████╗ ╚██████╔╝ ██║  ██║ ██║ ╚████║ ███████║
	`.trim().split('\n').map(line => line.trimLeft()).join('\n');

	const {lastFrame} = render(
		<Gradient name="rainbow">
			<Text>{text}</Text>
		</Gradient>
	);

	console.log(lastFrame());
	t.snapshot(lastFrame());

	delete process.env.FORCE_COLOR;
});
