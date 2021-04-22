# @guardian/css

A smaller (in API and bundlesize) version of Emotion. Note, we do (in gratitude)
reuse both @emotion/sheet and @emotion/hash though.

Specifically, the interface exposed is limited to:

-   `css` - the 'old-school' version of this which returns a string classname
    and does not require JSX integration
-   `globalCss` - like `css` but injects styles globally. This is invariably
    necessary even if it goes against scoped CSS.
-   `cssRule` - like `css` but without side-effects. It simply returns the rule
    that would normally be added to the DOM. Useful for testing purposes.

Note, `css` here is not as fully featured as Emotion's. In particular, it does
not support:

-   `&` - this is used to add a parent selector. This is not included here
    because it is considered an anti-pattern and you can achieve this in other
    ways.
