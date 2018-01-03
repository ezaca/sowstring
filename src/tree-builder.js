var Node = require ('./items').Node

module.exports = class TreeBuilder {
    constructor (options) {
        this.options = options
        this.tree = new Node (1)
        this.tree.parent = null
        this.tree.options = {
            useHeading: options.useHeading,
        }
        this.current = this.tree
    }
    
    checkHeadingSetup (node) {
        if (! this.options.useHeading)
            return
        let heading = this.current.pop ()
        if (! heading)
            console.error ('SowString Internal Error: there is no node to use as heading (but should be there), using undefined')
        node.heading = heading
    }

    enter (node) {
        node.parent = this.current
        this.push (node)
        this.current = node
    }

    leave () {
        this.current = this.current.parent
    }

    push (leaf) {
        leaf.parent = this.current
        this.current.push (leaf)
    }
}