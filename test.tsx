import process from 'node:process';
import React from 'react';
import test from 'ava';
import {Text} from 'ink';
import {render} from 'ink-testing-library';
import stripAnsi from 'strip-ansi';
import Gradient from './source/index.js';

test('render', t => {
	process.env.FORCE_COLOR = 1;

	const text = `
		██╗   ██╗ ███╗   ██╗ ██╗  ██████╗  ██████╗  ██████╗  ███╗   ██╗ ███████╗
		██║   ██║ ████╗  ██║ ██║ ██╔════╝ ██╔═══██╗ ██╔══██╗ ████╗  ██║ ██╔════╝
		██║   ██║ ██╔██╗ ██║ ██║ ██║      ██║   ██║ ██████╔╝ ██╔██╗ ██║ ███████╗
		██║   ██║ ██║╚██╗██║ ██║ ██║      ██║   ██║ ██╔══██╗ ██║╚██╗██║ ╚════██║
		╚██████╔╝ ██║ ╚████║ ██║ ╚██████╗ ╚██████╔╝ ██║  ██║ ██║ ╚████║ ███████║
	`.trim().split('\n').map(line => line.trimStart()).join('\n');

	const {lastFrame} = render(
		<Gradient name='rainbow'>
			<Text>{text}</Text>
		</Gradient>,
	);

	console.log(lastFrame());
	t.snapshot(stripAnsi(lastFrame()));

	delete process.env.FORCE_COLOR;
});
