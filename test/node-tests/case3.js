module.exports = function Test2 () {
    this.sowstring = this.SowString (this.content, {
        'error': function () {
            this.text = 'Invalid indent detected '+this.indent+'/'+this.level
            this.setSibling()
        },

        'intercept': function () {
            let m
            if (m = this.text.match (/^\s*set\s+text\s+to\s+(.*)/i))
                this.text = m[1]
        }
    })
}