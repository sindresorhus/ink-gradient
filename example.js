import process from 'node:process';
import React from 'react';
import {render, Box, Text} from 'ink';
import BigText from 'ink-big-text';
import Gradient from './dist/index.js';

process.env.FORCE_COLOR = '1';

render(
	React.createElement(
		Gradient,
		{name: 'retro'},
		React.createElement(
			Box,
			{borderStyle: 'round', padding: 1},
			React.createElement(Text, null, 'Gradient with Box children'),
			React.createElement(Text, null, 'Split ', 'text ', 'children'),
			React.createElement(BigText, {text: 'Hello'}),
			React.createElement(Text, null, '0'),
		),
	),
);
