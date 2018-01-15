module.exports = class StringReader {
    constructor (plainText, options) {
        let parsed = String(plainText || '')
        .replace(/\r\n?/g, '\n')
        .replace(/\n$/, '')
        .replace(/\t/g, options.tabReplace)

        this.lines = parsed.split('\n')
        if ((this.lines.length === 1) && (! this.lines[0].trim()))
            this.lines.pop()
        this.current = -1
        this.options = options
    }

    get eof () {
        return this.current >= this.lines.length
    }

    get currentLine () {
        return this.getLine (this.current)
    }

    get currentIndent () {
        return this.getIndent (this.current)
    }

    get currentIsEmpty () {
        return ! this.lines[this.current].trimLeft().length
    }

    get lineNum () {
        if (this.eof || (this.current < 0))
            return null
        return this.current + 1
    }

    prev () {
        this.current --
        return this.current >= 0
    }

    next() {
        this.current ++
        if (! this.options.emptyLines)
            while (! this.eof && this.isEmpty(this.current))
                this.current ++
        return ! this.eof
    }

    isEmpty (index) {
        return ! this.lines[index].trimLeft().length
    }

    getLine (index) {
        return this.lines[index].trimLeft()
    }

    getIndent (index) {
        // TO-DO: This is simpler than RegExp, but what about performance?
        let before = String (this.lines [index] || '')
        let after = before.trimLeft()
        return before.length - after.length
    }
}