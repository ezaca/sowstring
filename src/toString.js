module.exports = function toString (options) {
    var result = []
    var tabs = options.tabs || '  '

    function recursive (node, indent) {
        var item, s, sindent
        sindent = tabs.repeat(indent)
        for (item of node.children) {
            s = undefined
            if (item.isNode)
            {
                if (item.heading && options.details)
                    s = (item.heading.text || '[Empty]') + ' [Node, line '+item.lineNum+']'
                else
                if (item.heading)
                    s = (item.heading.text || '')
                else
                if (! item.heading && options.details)
                    s = '[Node started on line '+item.lineNum+']'
            } else
            if (! item.isNode) {
                if (options.details)
                    s = (item.text || '[Empty]') + ' [Text, line '+item.lineNum+']'
                else
                    s = item.text || ''
            }
            if (s !== undefined)
                result.push (sindent + s)
            if (item.isNode)
                recursive (item, indent + 1)
        }
    }

    recursive (this, 0)
    return result.join ('\n')
}