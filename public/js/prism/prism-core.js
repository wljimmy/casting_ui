/* PrismJS 1.29.0
https://prismjs.com/download.html#themes=prism&languages=markup+css+clike+javascript */
/// <reference lib="WebWorker"/>

var _self = (typeof window !== 'undefined')
	? window   // if in browser
	: (
		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
			? self // if in worker
			: {}   // if in node js
	);

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me>
 * @namespace
 * @public
 */
var Prism = (function (_self) {

	// https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers#Passing_data_by_transferring_ownership_(transferable_objects)
	var supportTransferableObject = typeof WorkerGlobalScope !== 'undefined' && typeof OffscreenCanvas !== 'undefined';

	var Prism = {
		/**
		 * @type {Object.<string, Language>}
		 * @public
		 */
		languages: {},

		/**
		 * @type {Object.<string, Plugin>}
		 * @public
		 */
		plugins: {},

		/**
		 * @param {string} text
		 * @param {Grammar} grammar
		 * @param {Language} language
		 * @returns {string}
		 * @public
		 * @example
		 * Prism.highlight(var code = "var a = 0;", Prism.languages.javascript, "javascript");
		 */
		highlight: function (text, grammar, language) {
			var env = {
				code: text,
				grammar: grammar,
				language: language
			};
			Prism.hooks.run('before-tokenize', env);
			if (!env.grammar) {
				throw new Error('The language "' + env.language + '" has no grammar.');
			}
			env.tokens = Prism.tokenize(env.code, env.grammar);
			Prism.hooks.run('after-tokenize', env);
			return Token.stringify(encodeTokenTokens(env.tokens), env.language);
		},

		/**
		 * @param {string} text
		 * @param {Grammar} grammar
		 * @returns {TokenStream}
		 * @public
		 * @example
		 * Prism.tokenize(var code = "var a = 0;", Prism.languages.javascript);
		 */
		tokenize: function (text, grammar) {
			var rest = grammar.rest;
			if (rest) {
				for (var token in rest) {
					grammar[token] = rest[token];
				}

				delete grammar.rest;
			}

			var tokenList = new LinkedList();
			addAfter(tokenList, tokenList.head, text);

			matchGrammar(text, tokenList, grammar, tokenList.head, 0);

			return toArray(tokenList);
		},

		/**
		 * @public
		 */
		hooks: {
			all: {},

			/**
			 * @param {string} name
			 * @param {HookCallback} callback
			 */
			add: function (name, callback) {
				var hooks = Prism.hooks.all;
				hooks[name] = hooks[name] || [];
				hooks[name].push(callback);
			},

			/**
			 * @param {string} name
			 * @param {Object} env
			 */
			run: function (name, env) {
				var callbacks = Prism.hooks.all[name];

				if (!callbacks || !callbacks.length) {
					return;
				}

				for (var i = 0, callback; callback = callbacks[i++];) {
					callback(env);
				}
			}
		},

		/**
		 * @type {Object.<string, string>}
		 * @public
		 */
		manual: {
			disableWorkerMessageHandler: _self.disableWorkerMessageHandler,
			disableAutoloader: _self.disableAutoloader
		}
	};

	var Token = Prism.Token = function (type, content, alias, matchedStr) {
		this.type = type;
		this.content = content;
		this.alias = alias;
		// Copy of the full string this token was created from
		this.length = (matchedStr || '').length | 0;
	};

	Token.stringify = function stringify(o, language) {
		if (typeof o == 'string') {
			return o;
		}
		if (Array.isArray(o)) {
			var s = '';
			o.forEach(function (e) {
				s += stringify(e, language);
			});
			return s;
		}

		var env = {
			type: o.type,
			content: stringify(o.content, language),
			tag: 'span',
			classes: ['token', o.type],
			attributes: {},
			language: language
		};

		var aliases = o.alias;
		if (aliases) {
			if (Array.isArray(aliases)) {
				Array.prototype.push.apply(env.classes, aliases);
			} else {
				env.classes.push(aliases);
			}
		}

		Prism.hooks.run('wrap', env);

		var attributes = '';
		for (var name in env.attributes) {
			attributes += ' ' + name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
		}

		return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + attributes + '>' + env.content + '</' + env.tag + '>';
	};

	/**
	 * @param {string} text
	 * @param {LinkedList<string | Token>} tokenList
	 * @param {any} grammar
	 * @param {LinkedListNode<string | Token>} startNode
	 * @param {number} startPos
	 * @param {RematchOptions}