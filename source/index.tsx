import {
	type FC as ReactFC,
	type ReactNode,
	type Key,
	Children,
	isValidElement,
	cloneElement,
} from 'react';
import {Box, Transform, Text} from 'ink';
import gradientString from 'gradient-string';
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

type GradientStringType = ReturnType<typeof gradientString>;

export type Props = {
	/**
	The content to colorize.

	Multiple `<Text>` children are treated as separate nodes, which preserves layout when `<Gradient>` is placed inside a `<Box flexDirection="column">`.

	If you want a continuous gradient across multiple lines, pass a single string or a single `<Text>` with `\n`.
	*/
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
		gradient = gradientString(props.colors as any); // Note: `gradient-string` types are too loose to express this safely.
	} else {
		throw new Error('Either `name` or `colors` prop must be provided');
	}

	const applyGradient = (text: string) => gradient.multiline(stripAnsi(text));

	const containsBoxDescendant = (nodeChildren: ReactNode): boolean => {
		let hasBox = false;

		const search = (value: ReactNode) => {
			Children.forEach(value, child => {
				if (hasBox) {
					return;
				}

				if (!isValidElement(child)) {
					return;
				}

				if (child.type === Box) {
					hasBox = true;
					return;
				}

				const childProps = child.props as Record<string, unknown>;
				if (Object.hasOwn(childProps, 'children')) {
					search(childProps['children'] as ReactNode);
				}
			});
		};

		search(nodeChildren);
		return hasBox;
	};

	const hasChildrenProp = (props: Record<string, unknown>) => Object.hasOwn(props, 'children');
	const isPlainTextNode = (node: ReactNode): node is string | number => typeof node === 'string' || typeof node === 'number';
	const isNonRenderableChild = (node: ReactNode) => node === null || node === undefined || typeof node === 'boolean';
	const childrenCount = Children.count(props.children);

	// Check if children is just a string/number (simple case)
	if (isPlainTextNode(props.children)) {
		return <Transform transform={applyGradient}>{props.children}</Transform>;
	}

	if (childrenCount === 1 && !containsBoxDescendant(props.children)) {
		return <Transform transform={applyGradient}>{props.children}</Transform>;
	}

	// For complex children (components), apply gradient to text nodes directly
	const applyGradientToChildren = (children: ReactNode): ReactNode => {
		const nodes: ReactNode[] = [];
		let bufferedText = '';
		let nodeIndex = 0;

		const createKey = () => `gradient-node-${nodeIndex++}`;

		const pushTransformed = (node: ReactNode, key: Key) => {
			nodes.push(<Transform key={key} transform={applyGradient}>{node}</Transform>);
		};

		const flushText = () => {
			if (bufferedText === '') {
				return;
			}

			const text = bufferedText;
			bufferedText = '';
			pushTransformed(<Text>{text}</Text>, createKey());
		};

		Children.forEach(children, child => {
			if (isNonRenderableChild(child)) {
				return;
			}

			if (isPlainTextNode(child)) {
				bufferedText += String(child);
				return;
			}

			flushText();

			if (isValidElement(child)) {
				const childKey = child.key ?? createKey();
				const childProps = child.props as Record<string, unknown>;

				if (child.type === Text) {
					pushTransformed(child, childKey);
					return;
				}

				if (child.type === Box) {
					if (hasChildrenProp(childProps)) {
						const childChildren = childProps['children'] as ReactNode;
						nodes.push(cloneElement(child, {key: childKey}, applyGradientToChildren(childChildren)));
						return;
					}

					nodes.push(cloneElement(child, {key: childKey}));
					return;
				}

				if (hasChildrenProp(childProps)) {
					const childChildren = childProps['children'] as ReactNode;
					if (!containsBoxDescendant(childChildren)) {
						pushTransformed(child, childKey);
						return;
					}

					nodes.push(cloneElement(child, {key: childKey}, applyGradientToChildren(childChildren)));
					return;
				}

				pushTransformed(child, childKey);
				return;
			}

			nodes.push(child);
		});

		flushText();

		return nodes;
	};

	return <>{applyGradientToChildren(props.children)}</>;
};

export default Gradient;
