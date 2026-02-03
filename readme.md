# ink-gradient

> Gradient color component for [Ink](https://github.com/vadimdemedes/ink)

![](screenshot.png)

## Install

```sh
npm install ink-gradient
```

## Usage

```js
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

## API

### `<Gradient>`

It accepts a string or Ink component as `children`. For example, [`<Box/>`](https://github.com/vadimdemedes/ink#box).

#### Props

##### children

The content to colorize.

Multiple `<Text>` children are treated as separate nodes, which preserves layout when `<Gradient>` is placed inside a `<Box flexDirection="column">`.

If you want a continuous gradient across multiple lines, pass a single string or a single `<Text>` with `\n`.

##### name

Type: `string`

The name of a [built-in gradient](https://github.com/bokub/gradient-string#available-built-in-gradients).

Mutually exclusive with `colors`.

##### colors

Type: `string[] | object[]`

[Colors to use to make the gradient.](https://github.com/bokub/gradient-string#initialize-a-gradient)

Mutually exclusive with `name`.

## Related

- [ink-big-text](https://github.com/sindresorhus/ink-big-text) - Awesome text component for Ink
- [ink-link](https://github.com/sindresorhus/ink-link) - Link component for Ink
