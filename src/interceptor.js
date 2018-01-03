module.exports = function createInterceptor (leaf, indents, result) {
    var originalIndent = leaf.indent
    var originalLevel = leaf.level

    return {
        get startIndent () { return originalIndent },
        get startLevel () { return originalLevel },

        get text () { return leaf.text },
        set text (value) { leaf.text = value },

        get level () { return leaf.level },
        set level (value) {
            leaf.level = value
            result.cache = false
            result.discard = false
            leaf.indent = null
            if (indents.isValidLevel (value))
                leaf.indent = indents.getIndentFromLevel (value)
        },

        get indent () { return leaf.indent },
        set indent (value) {
            leaf.indent = value
            result.cache = false
            result.discard = false
            leaf.level = null
            leaf.indent = indents.getLevelFromIndent (value)
        },

        setProp (name, value) {
            if (['constructor', 'prototype', 'indent', 'level', 'lineNum', 'parent', 'children'].indexOf(name) >= 0)
                throw new Error ('The field name "'+name+'" is reserved on SowString nodes')
            leaf[name] = value
        },

        getProp (name) {
            return leaf[name]
        },

        setChild () {
            leaf.level = indents.childLevel
            leaf.indent = null
            result.cache = false
            result.discard = false
        },

        setParent () {
            leaf.level = indents.parentLevel
            if (leaf.level < 0)
                leaf.level = 0
            leaf.indent = null
            result.cache = false
            result.discard = false
        },

        setSibling () {
            leaf.level = indents.currentLevel
            leaf.indent = null
            result.cache = false
            result.discard = false
        },

        setSiblingOfNext () {
            result.cache = true
            leaf.level = null
            leaf.indent = null
            result.discard = false
        },

        touchIndent () {
            result.touchIndent = true
        },

        discard () {
            result.discard = true
            result.cache = false
            leaf.level = null
            leaf.indent = null
        },

        hasErrors () {
            var level = leaf.level
            if (level === null)
                level = indents.getLevelFromIndent(leaf.indent)
            return indents.isValidLevel (this.level)
        },
    }
}