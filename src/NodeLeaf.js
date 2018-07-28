var NodeToString = require ('./toString')
var NodeToJSON = require ('./toJSON')

class Node {
    constructor (lineNum) {
        this.lineNum = lineNum
        this.level = undefined
        this.heading = undefined
        this.children = []
    }

    get isNode () { return true }
    get text () { return this.heading.text; }
    get indent () { return this.heading.indent; }
    get indentedValue () { return this.heading.indentedValue; }
    get empty () { return this.heading.empty; }

    push (item) {
        this.children.push (item)
    }

    pop () {
        return this.children.pop ()
    }

    *[Symbol.iterator] () {
        var item
        for (item of this.children)
            yield item
    }

    *entries () {
        var item, index
        for ([item, index] of this.children.entries())
            yield [item, index]
    }

    each (callback) {
        var item
        for (item of this.children)
        {
            callback.apply (undefined, [item])
            if (item.isNode)
                item.each (callback)
        }
    }

    toJSON (options) {
        return NodeToJSON.apply (this, [options || {}])
    }

    toString (options) {
        return NodeToString.apply (this, [options || {}])
    }
}

class Leaf {
    constructor (lineNum, indent, text) {
        this.lineNum = lineNum
        this.level = undefined
        this.indent = indent
        this.text = text
    }

    get isNode () { return false }
    get empty () { return ! this.value }
    get indentedValue () { return String(' ').repeat(this.indent) + this.value }

    toString () {
        if (this.empty)
            return ''
        return this.indentedValue
    }
}

module.exports = {
    Node,
    Leaf,
}