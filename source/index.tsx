import React, {type FC as ReactFC, type ReactNode} from 'react';
import {Transform} from 'ink';
import PropTypes, {type Validator} from 'prop-types';
import gradientString, {type Gradient as GradientStringType} from 'gradient-string';
import stripAnsi from 'strip-ansi';

export type GradientName =
	| 'cristal'
	| 'teen'
	| 'mind'
	| 'morning'
	| 'vice'
	| 'passion'
	| 'fruit'
	| 'instagram'
	| 'atlas'
	| 'retro'
	| 'summer'
	| 'pastel'
	| 'rainbow';

export type GradientColors = Array<string | Record<string, unknown>>;

export type Props = {
	readonly children: ReactNode;

	/**
	The name of a [built-in gradient](https://github.com/bokub/gradient-string#available-built-in-gradients).

	Mutually exclusive with `colors`.
	*/
	readonly name?: GradientName;

	/**
	[Colors to use to make the gradient.](https://github.com/bokub/gradient-string#initialize-a-gradient)

	Mutually exclusive with `name`.
	*/
	readonly colors?: GradientColors;
};

/**
@example
```
import React from 'react';
import {render} from 'ink';
import Gradient from 'ink-gradient';
import BigText from 'ink-big-text';

render(
	<Gradient name="rainbow">
		<BigText text="unicorns"/>
	</Gradient>
);
```
*/
const Gradient: ReactFC<Props> = props => { // eslint-disable-line react/function-component-definition
	if (props.name && props.colors) {
		throw new Error('The `name` and `colors` props are mutually exclusive');
	}

	let gradient: GradientStringType;
	if (props.name) {
		gradient = gradientString[props.name];
	} else if (props.colors) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		gradient = gradientString(props.colors as any); // TODO: Make stronger type.
	} else {
		throw new Error('Either `name` or `colors` prop must be provided');
	}

	const applyGradient = (text: string) => gradient.multiline(stripAnsi(text));

	return <Transform transform={applyGradient}>{props.children}</Transform>;
};

Gradient.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node,
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
		'rainbow',
	]),
	colors: PropTypes.arrayOf(
		PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object,
		]),
	) as Validator<GradientColors>,
};

export default Gradient;
