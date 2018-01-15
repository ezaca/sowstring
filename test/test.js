/**
 * ----------------------------------------------------------------------------
 * User configurable options
 * ----------------------------------------------------------------------------
 */

var userOptions = {
    amount_of_cases_to_test: 3,
    first_test_number: 1,
    case_directory_with_trailing_slash: __dirname+'/node-tests/',
    case_file_prefix: "case",
    case_file_content_extension: ".txt",
    case_file_test_extension: ".json",
    sowstring_directory: __dirname+'/..',
}

/**
 * ----------------------------------------------------------------------------
 * Case Test class
 * ----------------------------------------------------------------------------
 */

class TestCase {
    constructor (userOptions, file_index) {
        this.content = undefined // Plain string content
        this.json = undefined // Test JSON
        this.options = undefined // Options extracted from JSON
        this.sowstring = undefined // SowString Node instance

        let filename =
            userOptions.case_directory_with_trailing_slash +
            userOptions.case_file_prefix +
            file_index
        this.filename = filename
        this.$loadFileContent (filename + userOptions.case_file_content_extension)
        this.$loadFileTest (filename + userOptions.case_file_test_extension)
    }

    run () {
        this.$getOptions ()
        if (this.json.parse !== 'manual')
            this.$parseSowString ()
        if (this.json.exec === true)
            this.$execRequire ()
        else
            this.$validateTest ()
    }

    $loadFileContent (filename) {
        try { this.content = ''+fs.readFileSync (filename) }
        catch (e) { throw new Error ('Could not load indented text "'+filename+'":\n|   '+e.message) }
    }

    $loadFileTest (filename) {
        var json
        try { json = ''+fs.readFileSync (filename) }
        catch (e) { throw new Error ('Could not load test case "'+filename+'":\n|   '+e.message) }

        try { this.json = JSON.parse (json) }
        catch (e) { throw new Error ('Could not parse JSON "'+filename+'":\n|   '+e.message) }
    }

    $getOptions () {
        this.options = {}
        if (this.json.options)
            this.options = this.json.options
    }

    $parseSowString () {
        this.sowstring = SowString (this.content, this.options)
        // This is, actually, a test!
        if (! this.sowstring instanceof SowString.Node)
            throw new Error ('SowString tree is not an instance of SowString.Node')
    }

    $execRequire () {
        let func = require (this.filename + '.js')
        let context = {
            'SowString': SowString,
            'sowstring': this.sowstring,
            'json': this.json,
            'options': this.options,
            'content': this.content,
            'filename': this.filename,
        }
        func.apply (context, [context])
        this.sowstring = context.sowstring
    }

    $validateTest () {
        var assert
        if (! this.json.tests || ! this.json.tests.length)
            throw new Error ('There is no assertion specified')
        
        for (assert of this.json.tests) {
            let node = this.$getNodeByAccessString (assert.access)

            // Assertion => missing: Boolean
            if (assert.missing) {
                if (! node.object)
                    continue
                throw new Error ('Node '+assert.access+' exists (line '+node.object.lineNum+')')
            }
            else if (node.error)
                throw new Error (node.error)
            else if (! node.object)
                throw new Error ('Node '+assert.access+' does not exist')

            // Assertion => node: Boolean
            if ((assert.node === true) && ! (node.object instanceof SowString.Node))
                throw new Error ('Item '+assert.access+' should be a node/array, but it isn\'t (line '+node.object.lineNum+')')
            else
            if ((assert.node === false) && ! (node.object instanceof SowString.Leaf))
                throw new Error ('Item '+assert.access+' should be a leaf/value, but it isn\'t (line '+node.object.lineNum+')')

            // Assertion => text: String
            if (assert.text !== undefined) {
                if (node.object.heading)
                    throw new Error ('This item is a Node, therefore, there is no `text` field, only `heading.text` (line '+node.object.lineNum+')')
                if (! node.object.text) {
                    if (assert.text)
                        throw new Error ('Leaf text is not "'+assert.text+'" (line '+node.object.lineNum+'), but undefined')
                } else
                if (String(node.object.text) !== String(assert.text))
                    throw new Error ('Leaf text is not "'+assert.text+'" (line '+node.object.lineNum+'), but "'+node.object.text+'"')
            }
            
            // Assertion => heading: String
            if (assert.heading !== undefined) {
                if (! node.object.heading)
                    throw new Error ('This item has no heading (expected: "'+assert.heading+'", line '+node.object.lineNum+')')
                if (! node.object.heading.text) {
                    if (assert.heading) {}
                        throw new Error ('Node heading text is not "'+assert.heading+'" (line '+node.object.lineNum+'), but undefined')
                } else
                if (String(node.object.heading.text) !== String(assert.heading))
                    throw new Error ('Node heading text is not "'+assert.heading+'" (line '+node.object.lineNum+'), but: '+node.object.heading.text)
            }
        }
    }

    $getNodeByAccessString (access) {
        var whatWeHave = this.sowstring
        var accessArray = access.split('.')
        var soFar = 'Tree'
        for (var item of accessArray) {
            soFar += '.' + item
            if (! (whatWeHave instanceof SowString.Node))
                return {'error': 'Specified access is trying to enter a non-node item ('+soFar+')'}
            if (! whatWeHave.children[item])
                return {'error':'Invalid index for node children ('+soFar+', item '+item+' evalutes to false)'}
            whatWeHave = whatWeHave.children[item]
        }
        return {'object': whatWeHave}
    }
}

/**
 * ----------------------------------------------------------------------------
 * Code to run all tests
 * ----------------------------------------------------------------------------
 */

var fs = require ('fs');
var SowString = require (userOptions.sowstring_directory).SowString;
var plain_test_results = [];

(function(){
    let file_index = []
    let first_iteration = userOptions.first_test_number
    let last_iteration = first_iteration + userOptions.amount_of_cases_to_test

    for (file_index = first_iteration; file_index < last_iteration; file_index ++) {
        let tcase
        try {
            tcase = new TestCase (userOptions, file_index)
            tcase.run ()
            plain_test_results.push({"index": file_index, "success":true, "tree": tcase.sowstring})
        } catch (e) {
            plain_test_results.push ({"index": file_index, "success":false, "error":e, "tree": (tcase?tcase.sowstring:null)})
        }
    }
})();

/**
 * ----------------------------------------------------------------------------
 * Display results
 * ----------------------------------------------------------------------------
 */

(function(){
    let failure = 0
    let success = 0

    console.log('')
    console.log('+-------------------------------------------------------------------------------')
    var result
    for (result of plain_test_results) {
        console.log('|')
        console.log('| Case n. '+result.index)
        if (result.success){
            console.log('|   Passed.');
            success ++
        } else {
            console.log('|   Failed: '+result.error.message);
            failure ++
        }
        try {
            if (result.tree)
                fs.writeFileSync (userOptions.case_directory_with_trailing_slash + userOptions.case_file_prefix + result.index + '.log', result.tree.toString ({details:true}))
        } catch (e) { console.log('| (Error when saving log: '+e.message+')') }
        console.log('|')
        console.log('+-------------------------------------------------------------------------------')
    }
    console.log('| Total: '+plain_test_results.length+' case(s)')
    console.log('|   Success: '+success+' case(s)')
    console.log('|   Failure: '+failure+' case(s)')
    console.log('+-------------------------------------------------------------------------------')
    console.log('')
})()

/**
 * End of File "test.js"
 */