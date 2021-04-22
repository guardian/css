//import { StyleSheet } from '@emotion/sheet'
//import hash from "@emotion/hash";

export let debug = false; // set to true for debug logging

// CSS is a simplified model for CSS, but sufficient for our purposes. The body
// is an ordered collection of strings (presumably CSS rules). CSS itself
// doesn't nest so this can be flat too.
export interface CSS {
	selector: string;
	body: string[];
}

const lexRule = (raw: string): [string | null, string] => {
	for (let i = 0; i < raw.length; i = i + 1) {
		switch (raw[i]) {
			case "{":
				return [null, raw];
			case ";":
				return [raw.slice(0, i + 1).trim(), raw.slice(i + 1)];
		}
	}

	return [raw, ""]; // asume entire thing is rule if no terminating semi-colon.
};

const lexNested = (raw: string): [string | null, string | null, string] => {
	let netBrackets = 0; // track nested brackets
	let start = 0;

	for (let i = 0; i < raw.length; i = i + 1) {
		switch (raw[i]) {
			case ";":
				if (netBrackets === 0) return [null, null, raw];
				break;
			case "{":
				netBrackets = netBrackets + 1;
				if (!start) start = i; // exclude opening bracket
				break;
			case "}":
				netBrackets = netBrackets - 1;
				if (netBrackets === 0) {
					// the end
					const selector = raw.slice(0, start);
					const body = raw.slice(start + 1, i);
					const remaining = raw.slice(i + 1);
					return [selector, body, remaining];
				}
				break;
		}
	}

	return [null, null, raw];
};

// isPseudo is a very crude test for beginning of pseudo-element, pseudo-class,
// or media-query.
const isPseudo = (s: string): boolean => s === ":" || s === "@";

export const parse = (raw: string, topClass: string): CSS[] => {
	let css: CSS[] = [
		{
			selector: topClass,
			body: [],
		},
	];

	let remaining = raw;
	let currentCSS = css[0];

	while (remaining.length) {
		var [selector, body, rest] = lexNested(remaining);
		log("nested", selector, ",", body, ",", rest);
		if (selector && body) {
			const nestedSelector = isPseudo(selector[0])
				? `${topClass}${selector}`
				: `${topClass} ${selector}`;
			css = css.concat(parse(body, nestedSelector));
			remaining = rest;
			continue;
		}

		var [rule, rest] = lexRule(remaining);
		log("rule", rule, ",", rest);
		if (rule) {
			remaining = rest;
			currentCSS.body.push(rule);
			continue;
		}

		log(remaining);
		break;
	}

	return css;
};

export const serialise = (css: CSS): string => {
	return `${css.selector}{${css.body.join("")}}`;
};

const log = (...things: any[]): void => {
	if (debug) {
		console.log(...things);
	}
};

// DOM element to insert CSS rules into
//const DEFAULT_CONTAINER = "head";

// Cache is used for interpolation purposes.
// const cache = new Map<string, string>();

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
 * @returns an array of CSS rules or throws an error if invalid CSS
 */
/* export const css = (
	strings: TemplateStringsArray,
	...args: string[]
): Rule[] => {
	// zip strings and args together
	let res = "";

	strings.forEach((s, i) => {
		res += s.trim();
		const arg = args[i];

		// if a grouping element :focus { .. }
		// then take it and grab middle

		if (arg) {
			const fromCache = cache.get(arg);
			res += fromCache ? fromCache : args[i].trim();
		}

		//
	});

	console.log("-----");

	const h = hash(res);
	cache.set(h, res);
	return h;
}; */

// handle interpolation, then nesting

/* const unnest(css: string): Rule[] => {
	// identify nested parts, extract, and lift.

	const rules = []
} */

// type Cache = Map<String, String>;

/**
 * serialise takes a Cache of CSS rules and converts it into a single string.
 * Useful for server-side rendering.
 */
/* const serialise = (cache: Cache): string => {
	return 'TODO';
}

interface Options {}

/**
 * mount adds styles to an HTML element (so is intended for client-side use).
 */
/* const mount = (el: HTMLElement, cache: Cache, options: Options): void => {

}



export const cssGen = ()

// This is for testing purposes - as doesn't hash things
export const cssRules = (
	strings: TemplateStringsArray,
	...args: string[]
): string[] => {
	return ["TODO"];
};
 */
