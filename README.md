# @guardian/css

A smaller (in API and bundlesize) version of Emotion. Note, we do (in gratitude)
reuse both @emotion/sheet and @emotion/hash though.

## Getting started

@guardian/css only supports defining CSS via tagged template literals. First,
configure a Cache. There are two types:

-   `StaticCache` - outputs styles as a string (for server-side or static
    client-side use)
-   `DynamicCache` - injects styles into the document (for client-side use)

Instantiate what you need, and then pass it to `cssGen`:

    $ const cache = StaticCache();
    $ const css = cssGen(cache);

You can then use `css` similar to @emotion. For example:

    $ // interpolation
    $ const someStyles = css`color: ${brand.blue}`;

    $ // nesting of pseudo-elements, pseudo-classes, and media-queries
    $ const nestedStyles = css`
    $ ::after { ... }
    $ `;

Note, `css` here is not as fully featured as Emotion's. In particular, it does
not support:

-   `&` - in Emotion this is used to add a parent selector but is not included
    here because it is considered an anti-pattern and can be achieved in other
    ways.

## Development

    $ yarn build // build production bundle
    $ yarn serve // test out with local server
    $ yarn test // run unit tests
