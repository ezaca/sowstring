module.exports = function toString (options) {
    var result = []
    var tabs = options.tabs || '  '

    function recursive (node, indent) {
        console.log('[Treating Node] '+node.lineNum)
        var item, s, sindent
        sindent = tabs.repeat(indent)
        for (item of node.children) {
            console.log('[Treating item] '+item.lineNum)
            s = undefined
            if (item.isNode)
            {
                if (item.heading && options.details)
                    s = (node.heading.text || '[Empty]') + ' [Node, line '+node.lineNum+']'
                else
                if (item.heading)
                    s = (node.heading.text || '')
                else
                if (! item.heading && options.details)
                    s = '[Node started on line '+node.lineNum+']'
            } else
            if (! item.isNode) {
                if (options.details)
                    s = (node.text || '[Empty]') + ' [Text, line '+node.lineNum+']'
                else
                    s = node.text || ''
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