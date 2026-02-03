import process from 'node:process';
import React from 'react';
import test from 'ava';
import {Text, Box} from 'ink';
import {render} from 'ink-testing-library';
import stripAnsi from 'strip-ansi';
import gradientString from 'gradient-string';
import Gradient from './source/index.js';

test.serial('render', t => {
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

test.serial('should support Box components as children', t => {
	process.env.FORCE_COLOR = 1;

	const {lastFrame} = render(
		<Gradient name='retro'>
			<Box borderStyle='round'>
				<Text>Hello</Text>
			</Box>
		</Gradient>,
	);

	// The test should not throw an error about Box being nested in Text
	t.truthy(lastFrame());

	console.log(lastFrame());

	delete process.env.FORCE_COLOR;
});

test.serial('should support empty Box components as children', t => {
	process.env.FORCE_COLOR = 1;

	const {lastFrame} = render(
		<Gradient name='retro'>
			<Box borderStyle='round'/>
		</Gradient>,
	);

	t.truthy(lastFrame());

	delete process.env.FORCE_COLOR;
});

test.serial('should support Box components with custom Text children', t => {
	process.env.FORCE_COLOR = 1;

	function BigText({text}: {text: string}) {
		return <Text>{text}</Text>;
	}

	const {lastFrame} = render(
		<Gradient name='retro'>
			<Box borderStyle='round'>
				<BigText text='Hello'/>
			</Box>
		</Gradient>,
	);

	t.truthy(lastFrame());

	delete process.env.FORCE_COLOR;
});

test.serial('should apply gradient to zero text children', t => {
	process.env.FORCE_COLOR = 1;

	const originalGradient = gradientString.retro;
	const stubGradient = Object.assign((text: string) => `__${text}__`, {
		multiline: (text: string) => `__${text}__`,
	});

	t.teardown(() => {
		gradientString.retro = originalGradient;
	});

	gradientString.retro = stubGradient;

	const {lastFrame} = render(
		<Gradient name='retro'>
			<Text>{0}</Text>
		</Gradient>,
	);

	const frame = lastFrame();

	t.true(stripAnsi(frame).includes('__0__'));

	delete process.env.FORCE_COLOR;
});

test.serial('should apply gradient to leaf components', t => {
	process.env.FORCE_COLOR = 1;

	function LeafText({text}: {text: string}) {
		return <Text>{text}</Text>;
	}

	const originalGradient = gradientString.retro;
	const stubGradient = Object.assign((text: string) => `__${text}__`, {
		multiline: (text: string) => `__${text}__`,
	});

	t.teardown(() => {
		gradientString.retro = originalGradient;
	});

	gradientString.retro = stubGradient;

	const {lastFrame} = render(
		<Gradient name='retro'>
			<Box borderStyle='round'>
				<LeafText text='Hello'/>
			</Box>
		</Gradient>,
	);

	t.true(stripAnsi(lastFrame()).includes('__Hello__'));

	delete process.env.FORCE_COLOR;
});

test.serial('should preserve gradient continuity for split Text children', t => {
	process.env.FORCE_COLOR = 1;

	const originalGradient = gradientString.retro;
	const receivedText: string[] = [];
	const stubGradient = Object.assign((text: string) => text, {
		multiline(text: string) {
			receivedText.push(text);
			return `__${text}__`;
		},
	});

	t.teardown(() => {
		gradientString.retro = originalGradient;
	});

	gradientString.retro = stubGradient;

	const {lastFrame} = render(
		<Gradient name='retro'>
			<Text>
				Hello{' '}World
			</Text>
		</Gradient>,
	);

	t.true(stripAnsi(lastFrame()).includes('__Hello World__'));
	t.is(receivedText.length, 1);
	t.is(receivedText[0], 'Hello World');

	delete process.env.FORCE_COLOR;
});

test.serial('should wrap top-level split text children', t => {
	process.env.FORCE_COLOR = 1;

	const originalGradient = gradientString.retro;
	const receivedText: string[] = [];
	const stubGradient = Object.assign((text: string) => text, {
		multiline(text: string) {
			receivedText.push(text);
			return `__${text}__`;
		},
	});

	t.teardown(() => {
		gradientString.retro = originalGradient;
	});

	gradientString.retro = stubGradient;

	const {lastFrame} = render(
		<Gradient name='retro'>
			Hello{' '}World
		</Gradient>,
	);

	t.true(stripAnsi(lastFrame()).includes('__Hello World__'));
	t.is(receivedText.length, 1);
	t.is(receivedText[0], 'Hello World');

	delete process.env.FORCE_COLOR;
});

test.serial('should keep Text siblings separate inside Box', t => {
	process.env.FORCE_COLOR = 1;

	const originalGradient = gradientString.retro;
	const receivedText: string[] = [];
	const stubGradient = Object.assign((text: string) => text, {
		multiline(text: string) {
			receivedText.push(text);
			return text;
		},
	});

	t.teardown(() => {
		gradientString.retro = originalGradient;
	});

	gradientString.retro = stubGradient;

	render(
		<Gradient name='retro'>
			<Box>
				<Text>First </Text>
				<Text>Second</Text>
			</Box>
		</Gradient>,
	);

	t.is(receivedText.length, 2);
	t.is(receivedText[0], 'First ');
	t.is(receivedText[1], 'Second');

	delete process.env.FORCE_COLOR;
});

test.serial('should not collapse Text siblings in column layout', t => {
	process.env.FORCE_COLOR = 1;

	const originalGradient = gradientString.retro;
	const stubGradient = Object.assign((text: string) => text, {
		multiline(text: string) {
			return text;
		},
	});

	t.teardown(() => {
		gradientString.retro = originalGradient;
	});

	gradientString.retro = stubGradient;

	const {lastFrame} = render(
		<Gradient name='retro'>
			<Box flexDirection='column'>
				<Text>First</Text>
				<Text>Second</Text>
			</Box>
		</Gradient>,
	);

	const lines = stripAnsi(lastFrame()).split('\n');
	t.is(lines[0].trimEnd(), 'First');
	t.is(lines[1].trimEnd(), 'Second');

	delete process.env.FORCE_COLOR;
});

test.serial('should render Text siblings as separate lines when Box is outside Gradient', t => {
	process.env.FORCE_COLOR = 1;

	const {lastFrame} = render(
		<Box flexDirection='column'>
			<Gradient colors={['red', 'blue']}>
				<Text>First</Text>
				<Text>Second</Text>
				<Text>Third</Text>
			</Gradient>
		</Box>,
	);

	const lines = stripAnsi(lastFrame()).split('\n');
	t.is(lines[0].trimEnd(), 'First');
	t.is(lines[1].trimEnd(), 'Second');
	t.is(lines[2].trimEnd(), 'Third');

	delete process.env.FORCE_COLOR;
});

test.serial('should ignore falsy children inside Text when applying gradient', t => {
	process.env.FORCE_COLOR = 1;

	const originalGradient = gradientString.retro;
	const receivedText: string[] = [];
	const stubGradient = Object.assign((text: string) => text, {
		multiline(text: string) {
			receivedText.push(text);
			return text;
		},
	});

	t.teardown(() => {
		gradientString.retro = originalGradient;
	});

	gradientString.retro = stubGradient;

	const shouldRender = false;
	render(
		<Gradient name='retro'>
			<Box>
				<Text>First{shouldRender && ' Ignored'} </Text>
				<Text>Second</Text>
			</Box>
		</Gradient>,
	);

	t.is(receivedText.length, 2);
	t.is(receivedText[0], 'First ');
	t.is(receivedText[1], 'Second');

	delete process.env.FORCE_COLOR;
});

test.serial('should ignore falsy children inside Box when applying gradient', t => {
	process.env.FORCE_COLOR = 1;

	const originalGradient = gradientString.retro;
	const receivedText: string[] = [];
	const stubGradient = Object.assign((text: string) => text, {
		multiline(text: string) {
			receivedText.push(text);
			return text;
		},
	});

	t.teardown(() => {
		gradientString.retro = originalGradient;
	});

	gradientString.retro = stubGradient;

	const shouldRender = false;
	render(
		<Gradient name='retro'>
			<Box>
				<Text>First </Text>
				{shouldRender && <Text>Ignored</Text>}
				<Text>Second</Text>
			</Box>
		</Gradient>,
	);

	t.is(receivedText.length, 2);
	t.is(receivedText[0], 'First ');
	t.is(receivedText[1], 'Second');

	delete process.env.FORCE_COLOR;
});

test.serial('should ignore null and undefined children inside Box when applying gradient', t => {
	process.env.FORCE_COLOR = 1;

	const originalGradient = gradientString.retro;
	const receivedText: string[] = [];
	const stubGradient = Object.assign((text: string) => text, {
		multiline(text: string) {
			receivedText.push(text);
			return text;
		},
	});

	t.teardown(() => {
		gradientString.retro = originalGradient;
	});

	gradientString.retro = stubGradient;

	const undefinedChild = undefined;
	const nullChild = null;
	render(
		<Gradient name='retro'>
			<Box>
				<Text>First </Text>
				{undefinedChild}
				{nullChild}
				<Text>Second</Text>
			</Box>
		</Gradient>,
	);

	t.is(receivedText.length, 2);
	t.is(receivedText[0], 'First ');
	t.is(receivedText[1], 'Second');

	delete process.env.FORCE_COLOR;
});

test.serial('should ignore falsy children inside nested Box when applying gradient', t => {
	process.env.FORCE_COLOR = 1;

	const originalGradient = gradientString.retro;
	const receivedText: string[] = [];
	const stubGradient = Object.assign((text: string) => text, {
		multiline(text: string) {
			receivedText.push(text);
			return text;
		},
	});

	t.teardown(() => {
		gradientString.retro = originalGradient;
	});

	gradientString.retro = stubGradient;

	const shouldRender = false;
	render(
		<Gradient name='retro'>
			<Box>
				<Box>
					<Text>First </Text>
					{shouldRender && <Text>Ignored</Text>}
					<Text>Second</Text>
				</Box>
			</Box>
		</Gradient>,
	);

	t.is(receivedText.length, 2);
	t.is(receivedText[0], 'First ');
	t.is(receivedText[1], 'Second');

	delete process.env.FORCE_COLOR;
});

test.serial('should apply gradient separately for sibling Text components without Box', t => {
	process.env.FORCE_COLOR = 1;

	const originalGradient = gradientString.retro;
	const receivedText: string[] = [];
	const stubGradient = Object.assign((text: string) => text, {
		multiline(text: string) {
			receivedText.push(text);
			return `__${text}__`;
		},
	});

	t.teardown(() => {
		gradientString.retro = originalGradient;
	});

	gradientString.retro = stubGradient;

	const {lastFrame} = render(
		<Gradient name='retro'>
			<Text>First </Text>
			<Text>Second</Text>
		</Gradient>,
	);

	t.true(stripAnsi(lastFrame()).includes('__First __'));
	t.true(stripAnsi(lastFrame()).includes('__Second__'));
	t.is(receivedText.length, 2);
	t.is(receivedText[0], 'First ');
	t.is(receivedText[1], 'Second');

	delete process.env.FORCE_COLOR;
});

test.serial('should apply gradient to component-owned text', t => {
	process.env.FORCE_COLOR = 1;

	function Wrapper({children}: {children: React.ReactNode}) {
		return (
			<Text>
				Prefix {children} Suffix
			</Text>
		);
	}

	const originalGradient = gradientString.retro;
	const receivedText: string[] = [];
	const stubGradient = Object.assign((text: string) => text, {
		multiline(text: string) {
			receivedText.push(text);
			return `__${text}__`;
		},
	});

	t.teardown(() => {
		gradientString.retro = originalGradient;
	});

	gradientString.retro = stubGradient;

	const {lastFrame} = render(
		<Gradient name='retro'>
			<Wrapper>Inner</Wrapper>
		</Gradient>,
	);

	t.true(stripAnsi(lastFrame()).includes('__Prefix Inner Suffix__'));
	t.true(receivedText.some(text => text.includes('Prefix Inner Suffix')));

	delete process.env.FORCE_COLOR;
});

test.serial('should apply gradient to component-owned text with element children', t => {
	process.env.FORCE_COLOR = 1;

	function Wrapper({children}: {children: React.ReactNode}) {
		return (
			<Text>
				Prefix {children} Suffix
			</Text>
		);
	}

	const originalGradient = gradientString.retro;
	const receivedText: string[] = [];
	const stubGradient = Object.assign((text: string) => text, {
		multiline(text: string) {
			receivedText.push(text);
			return `__${text}__`;
		},
	});

	t.teardown(() => {
		gradientString.retro = originalGradient;
	});

	gradientString.retro = stubGradient;

	const {lastFrame} = render(
		<Gradient name='retro'>
			<Wrapper>
				<Text>Inner</Text>
			</Wrapper>
		</Gradient>,
	);

	t.true(stripAnsi(lastFrame()).includes('__Prefix Inner Suffix__'));
	t.true(receivedText.some(text => text.includes('Prefix Inner Suffix')));

	delete process.env.FORCE_COLOR;
});
