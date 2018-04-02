import {h, renderToString} from 'ink';
import PropTypes from 'prop-types';
import gradientString from 'gradient-string';

const Gradient = props => {
	if (props.name && props.colors) {
		throw new Error('The `name` and `colors` props are mutually exclusive');
	}

	const gradient = props.name ? gradientString[props.name] : gradientString(props.colors);
	const text = renderToString(<span>{props.children}</span>);
	return <span>{gradient.multiline(text)}</span>;
};

Gradient.propTypes = {
	children: PropTypes.any.isRequired,
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
