//import { StyleSheet } from '@emotion/sheet'
import hash from "@emotion/hash";

// DOM element to insert CSS rules into
//const DEFAULT_CONTAINER = "head";

// Cache is used for interpolation purposes.
const cache = new Map<string, string>();

/**
 * css is the main utility of this library. It is used as tagged template
 * literal as follows:
 *
 *     css`
 * 	       color: blue;
 *         width: red;
 *     `
 *
 * You can place any CSS in the template literal.
 *
 * CSS is side-effecty. The passed CSS is registered centrally.
 *
 * TODO - really it should be configurable which registry css uses to allow
 * for controlling overlap and where css is outputted.
 *
 * @returns classname - a unique (string) classname to use in your JSX/markup.
 */
export const css = (
	strings: TemplateStringsArray,
	...args: string[]
): string => {
	// zip strings and args together
	let res = "";

	strings.forEach((s, i) => {
		res += s.trim();
		const arg = args[i];
		if (arg) {
			const fromCache = cache.get(arg);
			res += fromCache ? fromCache : args[i].trim();
		}
	});

	const h = hash(res);
	cache.set(h, res);
	return h;
};
