module.exports = class Options {
    constructor(userOptions) {
        this.useHeading = !! userOptions.useHeading
        this.emptyLines = !! userOptions.emptyLines
        this.fixIndent = !! userOptions.fixIndent

        if (typeof userOptions.tabReplace === 'number')
            this.tabReplace = String(' ').repeat(userOptions.tabReplace)
        else
            this.tabReplace = String(userOptions.tabReplace || '    ')

        if (typeof userOptions.intercept === 'function')
            this.intercept = userOptions.intercept
        else if (userOptions.intercept)
            throw new TypeError('Option `intercept` must be a function')

        if (typeof userOptions.error === 'function')
            this.error = userOptions.error
        else if (userOptions.error)
            throw new TypeError('Option `error` must be a function')
    }
}