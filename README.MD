# Sow String

This package contains a function to transform a string with good indentation to a Javascript array, where nodes with subnodes are array objects and nodes with no subnodes are string literals.

[See documentation](https://ezaca.github.io/sowstring/docs/) or TL&DR below.

# What does it really do?

Supose you have:
```
Node 1
    Sub node 1-A
    Sub node 1-B
Node 2
    Sub node 2-A
Node 3
```

With the `SowString` function you can access the tree this way:
```js
var myTree = SowString(myIndentedTextAbove)
myTree       // array with 5 items ("Node 1", array, "Node 2", array, "Node 3")
myTree[0]    // "Node 1" string
myTree[1]    // array with 2 items
myTree[1][0] // "SubNode 1-A" string
myTree[1][1] // "SubNode 1-B" string
myTree[2]    // "Node 2" string
myTree[3]    // array with 1 item

var myTree = SowString(myIndentedTextAbove, {useHeading:true})
myTree            // array with 3 items (array, array, "Node 3")
myTree[0]         // array with 2 item
myTree[0].heading // "Node 1" string
myTree[0].isNode  // true
myTree[0][0]      // "Sub Node 1-A" string
myTree[0][0].isNode // undefined, which evalutes to false
myTree[1]         // array with 1 item
myTree[1].heading // "Node 2" string
myTree[2]         // "Node 3" string
myTree[2].heading // undefined because it is string
```

With `UnsowString` you can use your array to have your indented text back.

That's it!

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

[See documentation](https://ezaca.github.io/sowstring/docs/) for details and options.

# Contribute

The current library seems stable enough to use. It is simple enough to maintain, anyway. You don't need to fear, just take a look in the lonely file inside `src` directory.

If someone want to contribute, here we have some suggestions:

- Test library and track bugs
- Spell check on documentation
- Implement more options and features
- Plant a tree
- Discover the meaning of the life
