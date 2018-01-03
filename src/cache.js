module.exports = class Cache {
    constructor (options) {
        this.options
        this.items = []
    }

    push (item) {
        this.items.push (item)
    }

    flush (treeBuilder) {
        var item
        for (item of this.items) {
            treeBuilder.push (item)
        }
        this.length = 0
    }

    flushExceptTrailingWhitespaces (treeBuilder) {
        var i, countTrailing = 0
        for (i=this.items.length-1; i>=0; i--) {
            if (! this.items.empty)
                break
            countTrailing ++
        }
        for (i=0; i<this.items.length - countTrailing; i++) {
            treeBuilder.push (this.items.shift())
        }
    }
}