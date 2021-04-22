import { parse, serialise } from "./index";
import type { CSS } from "./index";

test("parse simple rule", () => {
	const input = `color: blue;`;
	const topClass = "foo";

	const got = parse(input, topClass);
	const want: CSS[] = [{ selector: topClass, body: ["color: blue;"] }];

	expect(got).toEqual(want);
});

test("parse nested rule", () => {
	const topClass = "foo";
	const input = `color: blue;a{color: red;}`;

	const got = parse(input, topClass);
	const want: CSS[] = [
		{
			selector: topClass,
			body: ["color: blue;"],
		},
		{
			selector: `${topClass} a`,
			body: ["color: red;"],
		},
	];

	expect(got).toEqual(want);
});

test("parse nested pseudo", () => {
	const topClass = "foo";
	const input = `color: blue;::after{content: "→";}`;

	const got = parse(input, topClass);
	const want: CSS[] = [
		{
			selector: topClass,
			body: ["color: blue;"],
		},
		{
			selector: `${topClass}::after`,
			body: [`content: "→";`],
		},
	];

	expect(got).toEqual(want);
});

test("parse multi-nest", () => {
	const topClass = "foo";
	const input = `color: blue;a{text-decoration: underline;::after{content: "→";}}display:block;`;

	const got = parse(input, topClass);
	const want: CSS[] = [
		{
			selector: topClass,
			body: ["color: blue;", "display:block;"],
		},
		{
			selector: `${topClass} a`,
			body: ["text-decoration: underline;"],
		},
		{
			selector: `${topClass} a::after`,
			body: [`content: "→";`],
		},
	];

	expect(got).toEqual(want);
});

test("serialise", () => {
	const input = {
		selector: ".foo",
		body: ["color: blue;", "display: block;"],
	};

	const got = serialise(input);
	const want = `.foo{color: blue;display: block;}`;

	expect(got).toEqual(want);
});
