class Node {
    constructor (lineNum) {
        this.parent = parent
        this.lineNum = lineNum
        this.level = undefined
        this.heading = undefined
        this.children = []
    }

    get isNode () { return true }

    push (item) {
        this.children.push (item)
    }

    pop () {
        return this.children.pop ()
    }
}

class Leaf {
    constructor (lineNum, value, indent) {
        this.parent = parent
        this.lineNum = lineNum
        this.level = undefined
        this.indent = undefined
        this.value = value
    }

    get isNode () { return false }
    get empty () { return ! this.value.length }
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