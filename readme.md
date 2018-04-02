# ink-gradient [![Build Status](https://travis-ci.org/sindresorhus/ink-gradient.svg?branch=master)](https://travis-ci.org/sindresorhus/ink-gradient)

> Gradient color component for [Ink](https://github.com/vadimdemedes/ink)

![](screenshot.png)


## Install

```
$ npm install ink-gradient
```


## Usage

```js
const {h, render} = require('ink');
const Gradient = require('ink-gradient');

render(
	<div>
		<Gradient name="rainbow">
			{`

	██╗   ██╗ ███╗   ██╗ ██╗  ██████╗  ██████╗  ██████╗  ███╗   ██╗ ███████╗
	██║   ██║ ████╗  ██║ ██║ ██╔════╝ ██╔═══██╗ ██╔══██╗ ████╗  ██║ ██╔════╝
	██║   ██║ ██╔██╗ ██║ ██║ ██║      ██║   ██║ ██████╔╝ ██╔██╗ ██║ ███████╗
	██║   ██║ ██║╚██╗██║ ██║ ██║      ██║   ██║ ██╔══██╗ ██║╚██╗██║ ╚════██║
	╚██████╔╝ ██║ ╚████║ ██║ ╚██████╗ ╚██████╔╝ ██║  ██║ ██║ ╚████║ ███████║

			`}
		</Gradient>
	</div>
);
//=>
```


## API

### `<Gradient>`

It accepts a string or Ink component as `children`, for example, [`ink-box`](https://github.com/sindresorhus/ink-box).

#### Props

##### name

Type: `string`

Name of a [built-in gradient](https://github.com/bokub/gradient-string#available-built-in-gradients).

##### colors

Type: `string[]` `Object[]`

[Colors to use to make the gradient.](https://github.com/bokub/gradient-string#initialize-a-gradient)


## Related

- [ink-box](https://github.com/sindresorhus/ink-box) - Box component for Ink
- [ink-link](https://github.com/sindresorhus/ink-link) - Link component for Ink


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
