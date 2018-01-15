module.exports = function toJSON (options) {
    var json = { children: [] }
    var self = this
    Object.defineProperty (json, 'stringify', {
        writable: false,
        enumerable: false,
        value: function (filter, indent) {
            return JSON.stringify (json, filter, indent)
        }
    })

    function recursive (jsonfield, item) {
        // Process current
        var obj
        if (item.isNode)
        {
            obj = { heading: undefined, children: [] }
            if (item.heading)
                obj.heading = String(item.heading.text || '')
            jsonfield.children.push (obj)
        }
        else
            jsonfield.children.push (String(item.text || ''))

        // Process children
        if (! item.isNode)
            return
        let it
        for (it of item.children) {
            recursive (obj, it)
        }
    }
    let it
    for (it of this.children)
        recursive (json, it)
    return json
}