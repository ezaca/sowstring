/**
 * This package transforms an indented string into a Javascript array,
 * where nodes are arrays and items are strings.
 * 
 * @license <https://spdx.org/licenses/MIT.html> The MIT License
 * @contributor Eliakim Zacarias <https://github.com/ezaca>
 */

var Options = require ('./Options')
var Node, Leaf
{
    let Items = require ('./NodeLeaf')
    Node = Items.Node
    Leaf = Items.Leaf
}
var IndentManager = require ('./IndentManager')
var Cache = require ('./cache')
var StringReader = require('./StringReader')
var TreeBuilder = require ('./TreeBuilder')
var createInterceptor = require ('./createInterceptor')

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
        return interceptorResult.discard || interceptorResult.cache
    }

    while (lines.next ()) {
        interceptorResult = null
        interceptor = null

        // ----------------------------
        // Empty nodes
        // ----------------------------
        if (lines.currentIsEmpty)
        {
            leaf = new Leaf (lines.lineNum, lines.currentIndent, '')
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

        hasIndentError = !(
            indents.isValidLevel (leaf.level) ||
            indents.isValidIndent (leaf.indent)
        )

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
            leaf.indent = indents.getIndentFromLevel (leaf.level)
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
            result.enter (node)
            indents.enter (leaf.indent)
            cache.flush (result)
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

SowString.Node = Node
SowString.Leaf = Leaf

if (typeof window !== "undefined")
{
    window.SowString = SowString
}
if ((typeof module !== "undefined") && (module.exports))
{
    module.exports.SowString = SowString
}