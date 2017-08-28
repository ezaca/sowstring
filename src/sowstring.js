/**
 * Sow a string to crop a tree. This package transforms an indented string
 * into a Javascript array, where nodes are arrays and items are strings.
 * 
 * @license <https://spdx.org/licenses/MIT.html> The MIT License
 * @contributor Eliakim Zacarias <https://github.com/ezaca>
 */

function SowString(passedValue, passedOptions)
{
    // Fix options:
    var options = Object(passedOptions)
    options.indentMultiple = Number(options.indentMultiple) || 0
    if (options.tabReplace===undefined) options.tabReplace=String(' ').repeat(4)
    if (options.emptyLines===undefined) options.emptyLines=false
    if (options.useHeading===undefined) options.useHeading=false
    // Capture lines:
    var lines = String(passedValue)
    .replace(/\r\n?/g, '\n')
    .replace(/\t/g, options.tabReplace)
    .trimRight()
    .split('\n')
    // Make result:
    var result = []
    result.parent = null
    result.useHeading = options.useHeading

    function grow(parentArray, currentSpaces, lineIndex, level){
        var node, ln, indent, idx = lineIndex
        parentArray.isNode = true
        parentArray.level = level
        parentArray.indent = currentSpaces
        while(idx < lines.length)
        {
            ln = lines[idx].trimLeft()
            indent = lines[idx].length - ln.length
            if (options.indentMultiple)
            {
                indent = Math.floor(indent / options.indentMultiple) * options.indentMultiple
                ln = lines[idx].substr(indent)
            }
            // Being the line empty,
            // we treat it as special case and continue to next line
            if (! ln.length)
            {
                if (options.emptyLines)
                    parentArray.push("")
                idx++
                continue
            }
            // Being the new indent lower than the old,
            // we reached the end of our node and return the control.
            if (currentSpaces > indent)
                return idx
            // Being the new indent equal to the old,
            // we have a new sibling item.
            if (currentSpaces === indent)
            {
                parentArray.push(ln)
                idx++
                continue
            }
            // Being the new indent greater than the old,
            // we reached a new level and a new child node will be called.
            if (parentArray.length && (parentArray[parentArray.length-1] instanceof Array) && (parentArray[parentArray.length-1].indent !== indent))
            {
                let parentExpectation = parentArray.indent
                let siblingExpectation = parentArray[parentArray.length-1].indent
                let cruelRealWorld = indent
                throw new Error('Bad indentation at line '+(idx+1)+
                                ', we expected '+parentExpectation+
                                ', '+siblingExpectation+
                                ' or more spaces, but received only '+cruelRealWorld)
            }
            node = []
            node.parent = parentArray
            if (options.useHeading)
                node.heading = parentArray.pop();
            idx = grow(node, indent, idx, level+1)
            node.pushIndex = parentArray.push(node)-1
        }
        return idx
    }

    grow(result, 0, 0, 0)
    return result
}

function UnsowString(passedTree, passedOptions)
{
    if (! passedTree instanceof Array)
        throw new Error('Invalid tree to unsow (argument 1)')
    var options = Object(passedOptions)
    if (typeof options.each !== 'function') options.each = null
    if (typeof options.useHeading === 'undefined') options.useHeading = Boolean(passedTree.useHeading)
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
            result.push(String(' ').repeat(node.parent.indent) + node.heading)

        for(var item of node)
        {
            if(item instanceof Array)
                crop(item)
            else
            if (options.each)
                result.push(options.each(node, item))
            else
                result.push(String(' ').repeat(node.indent) + item)
        }
    }

    crop(passedTree)
    return result.join('\n')
}

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