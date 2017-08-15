# Sow String

[See documentation](https://ezaca.github.io/sowstring/docs/) or TL&DR below.

# Usage

Include the minified script:

```html
<script type="text/javascript" src="dist/sowstring.min.js"></script>
```

Or require it on NodeJS in the way you like, we suggest:

```js
var SowString = require('sowstring').SowString
var UnsowString = require('sowstring').UnsowString
```

Call one of the functions below when needed.

`function SowString(String value, Object options=undefined): Array`
Converts an indented string to a tree-like structure.

`function UnsowString(Array value, Object options=undefined): String`
Reverts the process making a similar string from the tree-like structure.

# Contribute

The current library seems stable enough to use. It is simple enough to maintain, anyway. You don't need to fear, just take a look in the lonely file inside `src` directory.

If someone want to contribute, here are some suggestions:

- [ ] Test library and track bugs
- [ ] Spell check on documentation
- [ ] Implement more options and features
- [ ] Plant a tree
- [ ] Discover the meaning of the life
