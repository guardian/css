import { StyleSheet } from "@emotion/sheet";
import hash from "@emotion/hash";

export let debug = true; // set to true for debug logging

// CSS is a simplified model for CSS, but sufficient for our purposes. The body
// is an ordered collection of strings (presumably CSS declarations). CSS itself
// doesn't nest so this can be flat too.
export interface CSS {
	selector: string;
	body: string[];
}

const lexDeclaration = (raw: string): [string | null, string] => {
	for (let i = 0; i < raw.length; i = i + 1) {
		switch (raw[i]) {
			case "{":
				return [null, raw];
			case ";":
				return [raw.slice(0, i + 1).trim(), raw.slice(i + 1)];
		}
	}

	return [raw, ""]; // asume entire thing is declaration if no terminating semi-colon.
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
					const selector = raw.slice(0, start).trim();
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

		var [declaration, rest] = lexDeclaration(remaining);
		log("declaration", declaration, ",", rest);
		if (declaration) {
			remaining = rest;
			currentCSS.body.push(declaration);
			continue;
		}

		log(remaining);
		break;
	}

	return css;
};

// serialise returns a CSS rule from a CSS data structure.
export const serialise = (css: CSS): string => {
	return `${css.selector}{${css.body.join("")}}`;
};

const log = (...things: any[]): void => {
	if (debug) {
		console.log(...things);
	}
};

// Cache helps avoid work and is used to output styles to a target.
interface Cache {
	add: (style: CSS) => void;
	flush: () => void;
	serialise: () => string;
}

/**
 * StaticCache is suitable for use server-side or on the client when you know
 * your styles won't change. Simply call its `serialise` method when done to
 * output CSS, which you can then wrap in style tags and insert.
 */
export const StaticCache = (): Cache => {
	let data: CSS[] = [];

	return {
		add: (style: CSS) => {
			data.push(style);
		},
		flush: () => {
			data = [];
		},
		serialise: (): string => data.map(serialise).join(""),
	};
};

/**
 * DynamicCache is suitable for dynamic client-side use. It adds rules to the
 * document in the specified container element.
 *
 * Many thanks to @emotion/sheet, which is used under the hood for this.
 *
 * @param container target HTML element to inject rules into. Typically
 * `document.head` but you can set this to an iframe or shadow-dom or other as
 * required.
 * @param key added as `data-emotion` attribute to identify the source of rules.
 * @param speedy boolean flag to determine how rules are added. If true, then
 * rules are added into a single stylesheet via insertRule, which is fast but
 * prevents editing of rules in dev tools. If false, then a separate style
 * element is added for each rule, which is slow but better for debugging (e.g.
 * local development).
 */
export const DynamicCache = (
	container: HTMLElement,
	key: string,
	speedy: boolean
): Cache => {
	const sheet = new StyleSheet({
		key,
		container,
		speedy,
	});

	return {
		add: (style: CSS) => {
			log("adding styles!", style);
			const rule = serialise(style);
			log("rule is: ", rule);
			sheet.insert(rule);
		},
		flush: () => {
			sheet.flush();
		},
		serialise: (): string => sheet.container.innerHTML,
	};
};

/**
 * cssGen is the main utility of this library. It accepts a Cache and returns a
 * tagged template literal function, which you can use as follows:
 *
 * ```typescript
 * const css = cssGen(myCache);
 * css`
 *     color: blue;
 *     width: red;
 * `;
 * ```
 *
 * You can place any normal CSS in the template literal. You can also do nesting
 * for pseudo-elements, pseudo-classes, and media-queries. E.g.
 *
 * ```typescript
 * css`
 *     color: blue;
 *     :first-child { ... }
 *     ::after { ... }
 *     @media(...) { ... }
 * `;
 * ```
 *
 * @returns a CSS selector to use in your HTML.
 */
export const cssGen = (
	cache: Cache
): ((strings: TemplateStringsArray, ...args: string[]) => string) => {
	const css = (strings: TemplateStringsArray, ...args: string[]): string => {
		// zip strings and args together
		let res = "";

		strings.forEach((s, i) => {
			res += s.trim();
			res += args[i] || "";
		});
		const topClass = "css-" + hash(res);
		const rules = parse(res, "." + topClass);

		// add to cache
		rules.forEach((r) => cache.add(r));

		return topClass;
	};

	return css;
};
