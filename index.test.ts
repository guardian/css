import { parse } from "./index";
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
			body: ["color: blue;", { selector: "a", body: ["color: red;"] }],
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
