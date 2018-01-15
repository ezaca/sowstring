# Sow String

This package allows to parse indented strings and get Javascript objects, which are easier to manage than a bunch of characters!

[Read complete documentation](https://ezaca.github.io/sowstring/docs/).

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
console.log("Node:", myTree.children[0].text)
console.log("Sub-node:", myTree.children[1].children[0].text)
console.log("Iterable:")
for (var node of myTree)
    if (node instanceof SowString.Leaf) // We don't care about tree nodes, only leaves
        console.log (node.text)
```

This will output:
```
Node: Node 1
Sub-node: Sub node 1-A
Iterable:
Node 1
Node 2
Node 3
```

That's it!

# Usage

Include the minified script:

```html
<script type="text/javascript" src="dist/sowstring.js"></script>
```

Or require it on NodeJS in the way you like, we suggest:

```js
var SowString = require('sowstring').SowString
```

Call the functions below to parse.

`function SowString(String value, Object options=undefined): Node`
Converts an indented string to a tree-like structure.

[See documentation](https://ezaca.github.io/sowstring/docs/) [version 1.5] for details and options.

# Contribute

If someone want to contribute, here we have some suggestions:

- Use the library
- Test library and track bugs
- Implement more options and features
- Plant a tree
- Discover the meaning of the life
