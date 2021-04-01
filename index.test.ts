import { css } from "./index";
import hash from "@emotion/hash";

test("interpolation", () => {
	const a = css`
		margin: 0 auto;
	`;
	const got = css`
		color: blue;
		${a}
	`;

	const want = hash("color: blue;margin: 0 auto;");
	expect(got).toBe(want);
});

test.todo("& selector");

test.todo(": pseudo-selectors");
