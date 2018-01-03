/**
 * This package transforms an indented string into a Javascript array,
 * where nodes are arrays and items are strings.
 * 
 * @license <https://spdx.org/licenses/MIT.html> The MIT License
 * @contributor Eliakim Zacarias <https://github.com/ezaca>
 */

var Options = require ('./options')
var Node, Leaf
{
    let Items = require ('./items')
    Node = Items.Node
    Leaf = Items.Leaf
}
var IndentManager = require ('./indents')
var Cache = require ('./cache')
var StringReader = require('./string-reader')
var TreeBuilder = require ('./tree-builder')
var createInterceptor = require ('./interceptor')

function SowString(userGivenText, userGivenOptions)
{
    var options = new Options (userGivenOptions)
    var lines = new StringReader (userGivenText, options)
    var result = new TreeBuilder (options)
    var indents = new IndentManager (options)
    var cache = new Cache (options)

    var leaf, node, interceptor, interceptorResult, hasIndentError

    function discardOrCache () {
        if (interceptorResult.cache)
            cache.push(leaf)
        return interceptor.discard || interceptorResult.cache
    }

    while (lines.next ()) {
        interceptorResult = null
        interceptor = null

        // ----------------------------
        // Empty nodes
        // ----------------------------
        if (lines.currentIsEmpty)
        {
            leaf = new Leaf (lines.currentIndent, lines.lineNum, '')
            cache.push (leaf)
            continue
        }

        leaf = new Leaf (lines.lineNum, lines.currentIndent, lines.currentLine)
        leaf.level = indents.getLevelFromIndent (leaf.indent)

        // ----------------------------
        // Interceptor
        // ----------------------------
        if (options.intercept)
        {
            interceptorResult = {}
            interceptor = createInterceptor (leaf, indents, interceptorResult)
            options.intercept.call (interceptor)
            if (discardOrCache())
                continue
        }

        hasIndentError =
            indents.isValidLevel (leaf.level) ||
            indents.isValidIndent (leaf.indent)

        // ----------------------------
        // Indent errors
        // ----------------------------
        if (hasIndentError && options.error) {
            if (! interceptor) {
                interceptorResult = {}
                interceptor = createInterceptor (leaf, indents, interceptorResult)
            }
            options.error.call (interceptor)
            if (discardOrCache())
                continue
        }

        if (leaf.level === null) {
            if (leaf.indent === null)
                throw new Error ('Line has no valid indent or level value')
            leaf.level = indents.getLevelFromIndent (leaf.indent)
        }

        if (leaf.indent === null) {
            leaf.level = indents.getIndentFromLevel (leaf.level)
        }

        if (! indents.isValidLevel (leaf.level))
        {
            if (! options.fixIndent)
                throw new Error ('Invalid indent on line '+lines.lineNum)
            cache.push (leaf)
            continue
        }

        // ----------------------------
        // Node passed
        // ----------------------------

        if (indents.isSibling (leaf.level)) {
            cache.flush (result)
            result.push (leaf)
            continue
        } else

        if (indents.isChild (leaf.level)) {
            var node = new Node (lines.lineNum)
            node.level = indents.currentLevel
            result.checkHeadingSetup (node)
            cache.flush (result)
            result.enter (node)
            indents.enter (leaf.indent)
            result.push (leaf)
            continue
        } else

        if (indents.isParent (leaf.level)) {
            cache.flush (result)
            while (! indents.isLevel (leaf.level)) {
                indents.leave ()
                result.leave ()
            }
            result.push (leaf)
        } else

            throw new Error ('SowString crashed (a node is not child, parent or sibling)')
    }

    cache.flush (result)
    return result.tree
}

function UnsowString(passedTree, passedOptions)
{
    if (! passedTree instanceof Array)
        throw new Error('Invalid tree to unsow (argument 1)')
    var options = Object(passedOptions)
    if (typeof options.each !== 'function') options.each = null
    if (typeof options.useHeading === 'undefined') options.useHeading = Boolean(passedTree.options.useHeading)
    var result = [];

    function crop(node)
    {
        if (node.parent && options.each)
        {
            let value = options.each(node, undefined)
            if (value !== undefined)
                result.push(value)
        } else
        if (node.parent && options.useHeading)
            result.push(String(' ').repeat(node.parent.heading.indent) + node.heading.text)

        for(var item of node.children)
        {
            if(item instanceof Node)
                crop(item)
            else
            if (options.each)
                result.push(options.each(node, item))
            else
            if (! item.text.trim())
                result.push(item.text)
            else
                result.push(String('  ').repeat(item.level) + item.text)
        }
    }

    crop(passedTree)
    return result.join('\n')
}

SowString.Node = Node
SowString.Leaf = Leaf

if (typeof window !== "undefined")
{
    window.SowString = SowString
    window.UnsowString = UnsowString
}
if ((typeof module !== "undefined") && (module.exports))
{
    module.exports.SowString = SowString
    module.exports.UnsowString = UnsowString
}