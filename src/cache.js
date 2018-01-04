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
        this.items.length = 0
    }
}