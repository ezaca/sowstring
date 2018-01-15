module.exports = class IndentManager {
    constructor (options) {
        this.options = options
        this.levels = []
        this.enter (0)
    }

    get currentLevel () {
        return this.levels.length - 1
    }

    get greaterIndent () {
        return this.levels [this.levels.length-1] || 0
    }

    get childLevel () {
        return this.levels.length
    }

    get parentLevel () {
        return this.levels.length - 2
    }

    enter (indent) {
        if (indent < this.greaterIndent)
            throw new Error ('SowString has messed up its indentation register due to internal errors')
        this.levels.push (indent)
    }

    leave () {
        this.levels.pop ()
    }

    isValidIndent (indent) {
        if (indent === null)
            return false
        if (indent > this.greaterIndent)
            return true
        let i
        for (i=this.levels.length-1; i>=0; i--) {
            if (indent === this.levels [i])
                return true
        }
        return false
    }

    isValidLevel (level) {
        if (level === null)
            return false
        return (level >= 0) && (level <= this.levels.length)
    }

    getIndentOf (level) {
        if (level < 0)
            throw new ReferenceError ('SowString trees do not have negative levels')
        if (level >= this.levels.length)
            return this.greaterIndent + 1
        return this.levels [level]
    }

    getLevelFromIndent (indent) {
        if (indent > this.greaterIndent)
            return this.levels.length
        let i = 0
        for (i=this.levels.length-1; i>=0; i--) {
            if (indent === this.levels [i])
                return i
        }
        return null
    }

    getIndentFromLevel (level) {
        if (level < 0)
            return 0
        if (level >= this.levels.length)
            return this.greaterIndent + 1
        return this.levels [level]
    }

    isLevel (level) {
        return this.currentLevel === level
    }

    isSibling (level) {
        return this.currentLevel === level
    }

    isChild (level) {
        return level > this.currentLevel
    }

    isParent (level) {
        return (level >= 0) && (level < this.currentLevel)
    }
}