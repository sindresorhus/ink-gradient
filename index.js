import React from 'react';
import {Transform} from 'ink';
import PropTypes from 'prop-types';
import gradientString from 'gradient-string';
import stripAnsi from 'strip-ansi';

const Gradient = props => {
	if (props.name && props.colors) {
		throw new Error('The `name` and `colors` props are mutually exclusive');
	}

	const gradient = props.name ? gradientString[props.name] : gradientString(props.colors);
	const applyGradient = text => gradient.multiline(stripAnsi(text));

	return <Transform transform={applyGradient}>{props.children}</Transform>;
};

Gradient.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node
	]).isRequired,
	name: PropTypes.oneOf([
		'cristal',
		'teen',
		'mind',
		'morning',
		'vice',
		'passion',
		'fruit',
		'instagram',
		'atlas',
		'retro',
		'summer',
		'pastel',
		'rainbow'
	]),
	colors: PropTypes.arrayOf(
		PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object
		])
	)
};

module.exports = Gradient;
