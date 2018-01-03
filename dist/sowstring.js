/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Node = function () {
    function Node(lineNum) {
        _classCallCheck(this, Node);

        this.lineNum = lineNum;
        this.level = undefined;
        this.heading = undefined;
        this.children = [];
    }

    _createClass(Node, [{
        key: 'push',
        value: function push(item) {
            this.children.push(item);
        }
    }, {
        key: 'pop',
        value: function pop() {
            return this.children.pop();
        }
    }, {
        key: 'isNode',
        get: function get() {
            return true;
        }
    }]);

    return Node;
}();

var Leaf = function () {
    function Leaf(lineNum, indent, text) {
        _classCallCheck(this, Leaf);

        this.lineNum = lineNum;
        this.level = undefined;
        this.indent = indent;
        this.text = text;
    }

    _createClass(Leaf, [{
        key: 'toString',
        value: function toString() {
            if (this.empty) return '';
            return this.indentedValue;
        }
    }, {
        key: 'isNode',
        get: function get() {
            return false;
        }
    }, {
        key: 'empty',
        get: function get() {
            return !this.value.length;
        }
    }, {
        key: 'indentedValue',
        get: function get() {
            return String(' ').repeat(this.indent) + this.value;
        }
    }]);

    return Leaf;
}();

module.exports = {
    Node: Node,
    Leaf: Leaf
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(2);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * This package transforms an indented string into a Javascript array,
 * where nodes are arrays and items are strings.
 * 
 * @license <https://spdx.org/licenses/MIT.html> The MIT License
 * @contributor Eliakim Zacarias <https://github.com/ezaca>
 */

var Options = __webpack_require__(3);
var Node, Leaf;
{
    var Items = __webpack_require__(0);
    Node = Items.Node;
    Leaf = Items.Leaf;
}
var IndentManager = __webpack_require__(4);
var Cache = __webpack_require__(5);
var StringReader = __webpack_require__(6);
var TreeBuilder = __webpack_require__(7);
var createInterceptor = __webpack_require__(8);

function SowString(userGivenText, userGivenOptions) {
    var options = new Options(userGivenOptions);
    var lines = new StringReader(userGivenText, options);
    var result = new TreeBuilder(options);
    var indents = new IndentManager(options);
    var cache = new Cache(options);

    var leaf, node, interceptor, interceptorResult, hasIndentError;

    function discardOrCache() {
        if (interceptorResult.cache) cache.push(leaf);
        return interceptor.discard || interceptorResult.cache;
    }

    while (lines.next()) {
        interceptorResult = null;
        interceptor = null;

        // ----------------------------
        // Empty nodes
        // ----------------------------
        if (lines.currentIsEmpty) {
            leaf = new Leaf(lines.currentIndent, lines.lineNum, '');
            cache.push(leaf);
            continue;
        }

        leaf = new Leaf(lines.lineNum, lines.currentIndent, lines.currentLine);
        leaf.level = indents.getLevelFromIndent(leaf.indent);

        // ----------------------------
        // Interceptor
        // ----------------------------
        if (options.intercept) {
            interceptorResult = {};
            interceptor = createInterceptor(leaf, indents, interceptorResult);
            options.intercept.call(interceptor);
            if (discardOrCache()) continue;
        }

        hasIndentError = indents.isValidLevel(leaf.level) || indents.isValidIndent(leaf.indent);

        // ----------------------------
        // Indent errors
        // ----------------------------
        if (hasIndentError && options.error) {
            if (!interceptor) {
                interceptorResult = {};
                interceptor = createInterceptor(leaf, indents, interceptorResult);
            }
            options.error.call(interceptor);
            if (discardOrCache()) continue;
        }

        if (leaf.level === null) {
            if (leaf.indent === null) throw new Error('Line has no valid indent or level value');
            leaf.level = indents.getLevelFromIndent(leaf.indent);
        }

        if (leaf.indent === null) {
            leaf.level = indents.getIndentFromLevel(leaf.level);
        }

        if (!indents.isValidLevel(leaf.level)) {
            if (!options.fixIndent) throw new Error('Invalid indent on line ' + lines.lineNum);
            cache.push(leaf);
            continue;
        }

        // ----------------------------
        // Node passed
        // ----------------------------

        if (indents.isSibling(leaf.level)) {
            cache.flush(result);
            result.push(leaf);
            continue;
        } else if (indents.isChild(leaf.level)) {
            var node = new Node(lines.lineNum);
            node.level = indents.currentLevel;
            result.checkHeadingSetup(node);
            cache.flush(result);
            result.enter(node);
            indents.enter(leaf.indent);
            result.push(leaf);
            continue;
        } else if (indents.isParent(leaf.level)) {
            cache.flush(result);
            while (!indents.isLevel(leaf.level)) {
                indents.leave();
                result.leave();
            }
            result.push(leaf);
        } else throw new Error('SowString crashed (a node is not child, parent or sibling)');
    }

    cache.flush(result);
    return result.tree;
}

function UnsowString(passedTree, passedOptions) {
    if (!passedTree instanceof Array) throw new Error('Invalid tree to unsow (argument 1)');
    var options = Object(passedOptions);
    if (typeof options.each !== 'function') options.each = null;
    if (typeof options.useHeading === 'undefined') options.useHeading = Boolean(passedTree.options.useHeading);
    var result = [];

    function crop(node) {
        if (node.parent && options.each) {
            var value = options.each(node, undefined);
            if (value !== undefined) result.push(value);
        } else if (node.parent && options.useHeading) result.push(String(' ').repeat(node.parent.heading.indent) + node.heading.text);

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = node.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var item = _step.value;

                if (item instanceof Node) crop(item);else if (options.each) result.push(options.each(node, item));else if (!item.text.trim()) result.push(item.text);else result.push(String('  ').repeat(item.level) + item.text);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }

    crop(passedTree);
    return result.join('\n');
}

SowString.Node = Node;
SowString.Leaf = Leaf;

if (typeof window !== "undefined") {
    window.SowString = SowString;
    window.UnsowString = UnsowString;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports.SowString = SowString;
    module.exports.UnsowString = UnsowString;
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function Options(givenOptions) {
    _classCallCheck(this, Options);

    var userOptions = givenOptions || {};
    this.useHeading = !!userOptions.useHeading;
    this.emptyLines = !!userOptions.emptyLines;
    this.fixIndent = !!userOptions.fixIndent;

    if (typeof userOptions.tabReplace === 'number') this.tabReplace = String(' ').repeat(userOptions.tabReplace);else this.tabReplace = String(userOptions.tabReplace || '    ');

    if (typeof userOptions.intercept === 'function') this.intercept = userOptions.intercept;else if (userOptions.intercept) throw new TypeError('Option `intercept` must be a function');

    if (typeof userOptions.error === 'function') this.error = userOptions.error;else if (userOptions.error) throw new TypeError('Option `error` must be a function');
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
    function IndentManager(options) {
        _classCallCheck(this, IndentManager);

        this.options = options;
        this.levels = [];
        this.enter(0);
    }

    _createClass(IndentManager, [{
        key: 'enter',
        value: function enter(indent) {
            if (indent < this.greaterIndent) throw new Error('SowString has messed up its indentation register due to internal errors');
            this.levels.push(indent);
        }
    }, {
        key: 'leave',
        value: function leave() {
            this.levels.pop();
        }
    }, {
        key: 'isValidIndent',
        value: function isValidIndent(indent) {
            if (indent === null) return false;
            if (indent > this.greaterIndent) return true;
            var i = void 0;
            for (i = this.levels.length - 1; i >= 0; i--) {
                if (indent === this.levels[i]) return true;
            }
            return false;
        }
    }, {
        key: 'isValidLevel',
        value: function isValidLevel(level) {
            if (level === null) return false;
            return level >= 0 && level <= this.levels.length;
        }
    }, {
        key: 'getIndentOf',
        value: function getIndentOf(level) {
            if (level < 0) throw new ReferenceError('SowString trees do not have negative levels');
            if (level >= this.levels.length) return this.greaterIndent + 1;
            return this.levels[level];
        }
    }, {
        key: 'getLevelFromIndent',
        value: function getLevelFromIndent(indent) {
            if (indent > this.greaterIndent) return this.levels.length;
            var i = 0;
            for (i = this.levels.length - 1; i >= 0; i--) {
                if (indent === this.levels[i]) return i;
            }
            return null;
        }
    }, {
        key: 'getIndentFromLevel',
        value: function getIndentFromLevel(level) {
            if (level < 0) return 0;
            if (level >= this.levels.length) return this.greaterIndent + 1;
            return this.levels[level];
        }
    }, {
        key: 'isLevel',
        value: function isLevel(level) {
            return this.currentLevel === level;
        }
    }, {
        key: 'isSibling',
        value: function isSibling(level) {
            return this.currentLevel === level;
        }
    }, {
        key: 'isChild',
        value: function isChild(level) {
            return level > this.currentLevel;
        }
    }, {
        key: 'isParent',
        value: function isParent(level) {
            return level >= 0 && level < this.currentLevel;
        }
    }, {
        key: 'currentLevel',
        get: function get() {
            return this.levels.length - 1;
        }
    }, {
        key: 'greaterIndent',
        get: function get() {
            return this.levels[this.levels.length - 1] || 0;
        }
    }, {
        key: 'childLevel',
        get: function get() {
            return this.levels.length;
        }
    }, {
        key: 'parentLevel',
        get: function get() {
            return this.levels.length - 2;
        }
    }]);

    return IndentManager;
}();

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
    function Cache(options) {
        _classCallCheck(this, Cache);

        this.options;
        this.items = [];
    }

    _createClass(Cache, [{
        key: "push",
        value: function push(item) {
            this.items.push(item);
        }
    }, {
        key: "flush",
        value: function flush(treeBuilder) {
            var item;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    item = _step.value;

                    treeBuilder.push(item);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this.length = 0;
        }
    }, {
        key: "flushExceptTrailingWhitespaces",
        value: function flushExceptTrailingWhitespaces(treeBuilder) {
            var i,
                countTrailing = 0;
            for (i = this.items.length - 1; i >= 0; i--) {
                if (!this.items.empty) break;
                countTrailing++;
            }
            for (i = 0; i < this.items.length - countTrailing; i++) {
                treeBuilder.push(this.items.shift());
            }
        }
    }]);

    return Cache;
}();

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
    function StringReader(plainText, options) {
        _classCallCheck(this, StringReader);

        var parsed = String(plainText || '').replace(/\r\n?/g, '\n').replace(/\t/g, options.tabReplace);

        if (!options.emptyLines) {
            parsed = parsed.replace(/\n\n+/g, '\n').replace(/^\n+/g, '').trimRight();
        }

        this.lines = parsed.split('\n');
        if (this.lines.length === 1 && !this.lines[0].trim()) this.lines.pop();
        this.current = -1;
    }

    _createClass(StringReader, [{
        key: 'prev',
        value: function prev() {
            this.current--;
            return this.current >= 0;
        }
    }, {
        key: 'next',
        value: function next() {
            this.current++;
            return !this.eof;
        }
    }, {
        key: 'isEmpty',
        value: function isEmpty(index) {
            return !this.lines[index].trimLeft().length;
        }
    }, {
        key: 'getLine',
        value: function getLine(index) {
            return this.lines[index].trimLeft();
        }
    }, {
        key: 'getIndent',
        value: function getIndent(index) {
            // TO-DO: This is simpler than RegExp, but what about performance?
            var before = String(this.lines[index] || '');
            var after = before.trimLeft();
            return before.length - after.length;
        }
    }, {
        key: 'eof',
        get: function get() {
            return this.current >= this.lines.length;
        }
    }, {
        key: 'currentLine',
        get: function get() {
            return this.getLine(this.current);
        }
    }, {
        key: 'currentIndent',
        get: function get() {
            return this.getIndent(this.current);
        }
    }, {
        key: 'currentIsEmpty',
        get: function get() {
            return !this.lines[this.current].trimLeft().length;
        }
    }, {
        key: 'lineNum',
        get: function get() {
            if (this.eof || this.current < 0) return null;
            return this.current + 1;
        }
    }]);

    return StringReader;
}();

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Node = __webpack_require__(0).Node;

module.exports = function () {
    function TreeBuilder(options) {
        _classCallCheck(this, TreeBuilder);

        this.options = options;
        this.tree = new Node(1);
        this.tree.parent = null;
        this.tree.options = {
            useHeading: options.useHeading
        };
        this.current = this.tree;
    }

    _createClass(TreeBuilder, [{
        key: 'checkHeadingSetup',
        value: function checkHeadingSetup(node) {
            if (!this.options.useHeading) return;
            var heading = this.current.pop();
            if (!heading) console.error('SowString Internal Error: there is no node to use as heading (but should be there), using undefined');
            node.heading = heading;
        }
    }, {
        key: 'enter',
        value: function enter(node) {
            node.parent = this.current;
            this.push(node);
            this.current = node;
        }
    }, {
        key: 'leave',
        value: function leave() {
            this.current = this.current.parent;
        }
    }, {
        key: 'push',
        value: function push(leaf) {
            leaf.parent = this.current;
            this.current.push(leaf);
        }
    }]);

    return TreeBuilder;
}();

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function createInterceptor(leaf, indents, result) {
    var originalIndent = leaf.indent;
    var originalLevel = leaf.level;

    return {
        get startIndent() {
            return originalIndent;
        },
        get startLevel() {
            return originalLevel;
        },

        get text() {
            return leaf.text;
        },
        set text(text) {
            leaf.text = text;
        },

        get level() {
            return leaf.level;
        },
        set level(level) {
            leaf.level = level;
            result.cache = false;
            result.discard = false;
            leaf.indent = null;
            if (indents.isValidLevel(level)) leaf.indent = indents.getIndentFromLevel(level);
        },

        get indent() {
            return leaf.indent;
        },
        set indent(indent) {
            leaf.indent = indent;
            result.cache = false;
            result.discard = false;
            leaf.level = null;
            leaf.indent = indents.getLevelFromIndent(indent);
        },

        setProp: function setProp(name, value) {
            if (['constructor', 'prototype', 'indent', 'level', 'lineNum', 'parent', 'children'].indexOf(name) >= 0) throw new Error('The field name "' + name + '" is reserved on SowString nodes');
            leaf[name] = value;
        },
        getProp: function getProp(name) {
            return leaf[name];
        },
        setChild: function setChild() {
            leaf.level = indents.childLevel;
            leaf.indent = null;
            result.cache = false;
            result.discard = false;
        },
        setParent: function setParent() {
            leaf.level = indents.parentLevel;
            if (leaf.level < 0) leaf.level = 0;
            leaf.indent = null;
            result.cache = false;
            result.discard = false;
        },
        setSibling: function setSibling() {
            leaf.level = indents.currentLevel;
            leaf.indent = null;
            result.cache = false;
            result.discard = false;
        },
        setSiblingOfNext: function setSiblingOfNext() {
            result.cache = true;
            leaf.level = null;
            leaf.indent = null;
            result.discard = false;
        },
        touchIndent: function touchIndent() {
            result.touchIndent = true;
        },
        discard: function discard() {
            result.discard = true;
            result.cache = false;
            leaf.level = null;
            leaf.indent = null;
        },
        hasErrors: function hasErrors() {
            var level = leaf.level;
            if (level === null) level = indents.getLevelFromIndent(leaf.indent);
            return indents.isValidLevel(this.level);
        }
    };
};

/***/ })
/******/ ]);
//# sourceMappingURL=sowstring.js.map