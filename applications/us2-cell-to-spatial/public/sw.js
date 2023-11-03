var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod2) => function __require() {
  return mod2 || (0, cb[__getOwnPropNames(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod2, isNodeMode, target) => (target = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod2 || !mod2.__esModule ? __defProp(target, "default", { value: mod2, enumerable: true }) : target,
  mod2
));

// node_modules/rdf-canonize/lib/IdentifierIssuer.js
var require_IdentifierIssuer = __commonJS({
  "node_modules/rdf-canonize/lib/IdentifierIssuer.js"(exports, module) {
    "use strict";
    module.exports = class IdentifierIssuer {
      /**
       * Creates a new IdentifierIssuer. A IdentifierIssuer issues unique
       * identifiers, keeping track of any previously issued identifiers.
       *
       * @param prefix the prefix to use ('<prefix><counter>').
       * @param existing an existing Map to use.
       * @param counter the counter to use.
       */
      constructor(prefix, existing = /* @__PURE__ */ new Map(), counter = 0) {
        this.prefix = prefix;
        this._existing = existing;
        this.counter = counter;
      }
      /**
       * Copies this IdentifierIssuer.
       *
       * @return a copy of this IdentifierIssuer.
       */
      clone() {
        const { prefix, _existing, counter } = this;
        return new IdentifierIssuer(prefix, new Map(_existing), counter);
      }
      /**
       * Gets the new identifier for the given old identifier, where if no old
       * identifier is given a new identifier will be generated.
       *
       * @param [old] the old identifier to get the new identifier for.
       *
       * @return the new identifier.
       */
      getId(old) {
        const existing = old && this._existing.get(old);
        if (existing) {
          return existing;
        }
        const identifier = this.prefix + this.counter;
        this.counter++;
        if (old) {
          this._existing.set(old, identifier);
        }
        return identifier;
      }
      /**
       * Returns true if the given old identifer has already been assigned a new
       * identifier.
       *
       * @param old the old identifier to check.
       *
       * @return true if the old identifier has been assigned a new identifier,
       *   false if not.
       */
      hasId(old) {
        return this._existing.has(old);
      }
      /**
       * Returns all of the IDs that have been issued new IDs in the order in
       * which they were issued new IDs.
       *
       * @return the list of old IDs that has been issued new IDs in order.
       */
      getOldIds() {
        return [...this._existing.keys()];
      }
    };
  }
});

// node_modules/setimmediate/setImmediate.js
var require_setImmediate = __commonJS({
  "node_modules/setimmediate/setImmediate.js"(exports) {
    (function(global2, undefined2) {
      "use strict";
      if (global2.setImmediate) {
        return;
      }
      var nextHandle = 1;
      var tasksByHandle = {};
      var currentlyRunningATask = false;
      var doc = global2.document;
      var registerImmediate;
      function setImmediate2(callback) {
        if (typeof callback !== "function") {
          callback = new Function("" + callback);
        }
        var args = new Array(arguments.length - 1);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
        }
        var task = { callback, args };
        tasksByHandle[nextHandle] = task;
        registerImmediate(nextHandle);
        return nextHandle++;
      }
      function clearImmediate(handle) {
        delete tasksByHandle[handle];
      }
      function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
          case 0:
            callback();
            break;
          case 1:
            callback(args[0]);
            break;
          case 2:
            callback(args[0], args[1]);
            break;
          case 3:
            callback(args[0], args[1], args[2]);
            break;
          default:
            callback.apply(undefined2, args);
            break;
        }
      }
      function runIfPresent(handle) {
        if (currentlyRunningATask) {
          setTimeout(runIfPresent, 0, handle);
        } else {
          var task = tasksByHandle[handle];
          if (task) {
            currentlyRunningATask = true;
            try {
              run(task);
            } finally {
              clearImmediate(handle);
              currentlyRunningATask = false;
            }
          }
        }
      }
      function installNextTickImplementation() {
        registerImmediate = function(handle) {
          process.nextTick(function() {
            runIfPresent(handle);
          });
        };
      }
      function canUsePostMessage() {
        if (global2.postMessage && !global2.importScripts) {
          var postMessageIsAsynchronous = true;
          var oldOnMessage = global2.onmessage;
          global2.onmessage = function() {
            postMessageIsAsynchronous = false;
          };
          global2.postMessage("", "*");
          global2.onmessage = oldOnMessage;
          return postMessageIsAsynchronous;
        }
      }
      function installPostMessageImplementation() {
        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
          if (event.source === global2 && typeof event.data === "string" && event.data.indexOf(messagePrefix) === 0) {
            runIfPresent(+event.data.slice(messagePrefix.length));
          }
        };
        if (global2.addEventListener) {
          global2.addEventListener("message", onGlobalMessage, false);
        } else {
          global2.attachEvent("onmessage", onGlobalMessage);
        }
        registerImmediate = function(handle) {
          global2.postMessage(messagePrefix + handle, "*");
        };
      }
      function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
          var handle = event.data;
          runIfPresent(handle);
        };
        registerImmediate = function(handle) {
          channel.port2.postMessage(handle);
        };
      }
      function installReadyStateChangeImplementation() {
        var html2 = doc.documentElement;
        registerImmediate = function(handle) {
          var script = doc.createElement("script");
          script.onreadystatechange = function() {
            runIfPresent(handle);
            script.onreadystatechange = null;
            html2.removeChild(script);
            script = null;
          };
          html2.appendChild(script);
        };
      }
      function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
          setTimeout(runIfPresent, 0, handle);
        };
      }
      var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global2);
      attachTo = attachTo && attachTo.setTimeout ? attachTo : global2;
      if ({}.toString.call(global2.process) === "[object process]") {
        installNextTickImplementation();
      } else if (canUsePostMessage()) {
        installPostMessageImplementation();
      } else if (global2.MessageChannel) {
        installMessageChannelImplementation();
      } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        installReadyStateChangeImplementation();
      } else {
        installSetTimeoutImplementation();
      }
      attachTo.setImmediate = setImmediate2;
      attachTo.clearImmediate = clearImmediate;
    })(typeof self === "undefined" ? typeof global === "undefined" ? exports : global : self);
  }
});

// node_modules/rdf-canonize/lib/MessageDigest-browser.js
var require_MessageDigest_browser = __commonJS({
  "node_modules/rdf-canonize/lib/MessageDigest-browser.js"(exports, module) {
    "use strict";
    require_setImmediate();
    var crypto2 = self.crypto || self.msCrypto;
    module.exports = class MessageDigest {
      /**
       * Creates a new MessageDigest.
       *
       * @param algorithm the algorithm to use.
       */
      constructor(algorithm) {
        if (!(crypto2 && crypto2.subtle)) {
          throw new Error("crypto.subtle not found.");
        }
        if (algorithm === "sha256") {
          this.algorithm = { name: "SHA-256" };
        } else if (algorithm === "sha1") {
          this.algorithm = { name: "SHA-1" };
        } else {
          throw new Error(`Unsupported algorithm "${algorithm}".`);
        }
        this._content = "";
      }
      update(msg) {
        this._content += msg;
      }
      async digest() {
        const data = new TextEncoder().encode(this._content);
        const buffer = new Uint8Array(
          await crypto2.subtle.digest(this.algorithm, data)
        );
        let hex = "";
        for (let i = 0; i < buffer.length; ++i) {
          hex += buffer[i].toString(16).padStart(2, "0");
        }
        return hex;
      }
    };
  }
});

// node_modules/rdf-canonize/lib/Permuter.js
var require_Permuter = __commonJS({
  "node_modules/rdf-canonize/lib/Permuter.js"(exports, module) {
    "use strict";
    module.exports = class Permuter {
      /**
       * A Permuter iterates over all possible permutations of the given array
       * of elements.
       *
       * @param list the array of elements to iterate over.
       */
      constructor(list) {
        this.current = list.sort();
        this.done = false;
        this.dir = /* @__PURE__ */ new Map();
        for (let i = 0; i < list.length; ++i) {
          this.dir.set(list[i], true);
        }
      }
      /**
       * Returns true if there is another permutation.
       *
       * @return true if there is another permutation, false if not.
       */
      hasNext() {
        return !this.done;
      }
      /**
       * Gets the next permutation. Call hasNext() to ensure there is another one
       * first.
       *
       * @return the next permutation.
       */
      next() {
        const { current, dir } = this;
        const rval = current.slice();
        let k = null;
        let pos = 0;
        const length = current.length;
        for (let i = 0; i < length; ++i) {
          const element = current[i];
          const left = dir.get(element);
          if ((k === null || element > k) && (left && i > 0 && element > current[i - 1] || !left && i < length - 1 && element > current[i + 1])) {
            k = element;
            pos = i;
          }
        }
        if (k === null) {
          this.done = true;
        } else {
          const swap = dir.get(k) ? pos - 1 : pos + 1;
          current[pos] = current[swap];
          current[swap] = k;
          for (const element of current) {
            if (element > k) {
              dir.set(element, !dir.get(element));
            }
          }
        }
        return rval;
      }
    };
  }
});

// node_modules/rdf-canonize/lib/NQuads.js
var require_NQuads = __commonJS({
  "node_modules/rdf-canonize/lib/NQuads.js"(exports, module) {
    "use strict";
    var RDF = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
    var RDF_LANGSTRING = RDF + "langString";
    var XSD_STRING = "http://www.w3.org/2001/XMLSchema#string";
    var TYPE_NAMED_NODE = "NamedNode";
    var TYPE_BLANK_NODE = "BlankNode";
    var TYPE_LITERAL = "Literal";
    var TYPE_DEFAULT_GRAPH = "DefaultGraph";
    var REGEX = {};
    (() => {
      const iri = "(?:<([^:]+:[^>]*)>)";
      const PN_CHARS_BASE = "A-Za-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD";
      const PN_CHARS_U = PN_CHARS_BASE + "_";
      const PN_CHARS = PN_CHARS_U + "0-9-\xB7\u0300-\u036F\u203F-\u2040";
      const BLANK_NODE_LABEL = "(_:(?:[" + PN_CHARS_U + "0-9])(?:(?:[" + PN_CHARS + ".])*(?:[" + PN_CHARS + "]))?)";
      const bnode = BLANK_NODE_LABEL;
      const plain = '"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"';
      const datatype = "(?:\\^\\^" + iri + ")";
      const language = "(?:@([a-zA-Z]+(?:-[a-zA-Z0-9]+)*))";
      const literal = "(?:" + plain + "(?:" + datatype + "|" + language + ")?)";
      const ws = "[ \\t]+";
      const wso = "[ \\t]*";
      const subject = "(?:" + iri + "|" + bnode + ")" + ws;
      const property = iri + ws;
      const object = "(?:" + iri + "|" + bnode + "|" + literal + ")" + wso;
      const graphName = "(?:\\.|(?:(?:" + iri + "|" + bnode + ")" + wso + "\\.))";
      REGEX.eoln = /(?:\r\n)|(?:\n)|(?:\r)/g;
      REGEX.empty = new RegExp("^" + wso + "$");
      REGEX.quad = new RegExp(
        "^" + wso + subject + property + object + graphName + wso + "$"
      );
    })();
    module.exports = class NQuads {
      /**
       * Parses RDF in the form of N-Quads.
       *
       * @param input the N-Quads input to parse.
       *
       * @return an RDF dataset (an array of quads per http://rdf.js.org/).
       */
      static parse(input) {
        const dataset = [];
        const graphs = {};
        const lines = input.split(REGEX.eoln);
        let lineNumber = 0;
        for (const line of lines) {
          lineNumber++;
          if (REGEX.empty.test(line)) {
            continue;
          }
          const match = line.match(REGEX.quad);
          if (match === null) {
            throw new Error("N-Quads parse error on line " + lineNumber + ".");
          }
          const quad = { subject: null, predicate: null, object: null, graph: null };
          if (match[1] !== void 0) {
            quad.subject = { termType: TYPE_NAMED_NODE, value: match[1] };
          } else {
            quad.subject = { termType: TYPE_BLANK_NODE, value: match[2] };
          }
          quad.predicate = { termType: TYPE_NAMED_NODE, value: match[3] };
          if (match[4] !== void 0) {
            quad.object = { termType: TYPE_NAMED_NODE, value: match[4] };
          } else if (match[5] !== void 0) {
            quad.object = { termType: TYPE_BLANK_NODE, value: match[5] };
          } else {
            quad.object = {
              termType: TYPE_LITERAL,
              value: void 0,
              datatype: {
                termType: TYPE_NAMED_NODE
              }
            };
            if (match[7] !== void 0) {
              quad.object.datatype.value = match[7];
            } else if (match[8] !== void 0) {
              quad.object.datatype.value = RDF_LANGSTRING;
              quad.object.language = match[8];
            } else {
              quad.object.datatype.value = XSD_STRING;
            }
            quad.object.value = _unescape(match[6]);
          }
          if (match[9] !== void 0) {
            quad.graph = {
              termType: TYPE_NAMED_NODE,
              value: match[9]
            };
          } else if (match[10] !== void 0) {
            quad.graph = {
              termType: TYPE_BLANK_NODE,
              value: match[10]
            };
          } else {
            quad.graph = {
              termType: TYPE_DEFAULT_GRAPH,
              value: ""
            };
          }
          if (!(quad.graph.value in graphs)) {
            graphs[quad.graph.value] = [quad];
            dataset.push(quad);
          } else {
            let unique = true;
            const quads = graphs[quad.graph.value];
            for (const q of quads) {
              if (_compareTriples(q, quad)) {
                unique = false;
                break;
              }
            }
            if (unique) {
              quads.push(quad);
              dataset.push(quad);
            }
          }
        }
        return dataset;
      }
      /**
       * Converts an RDF dataset to N-Quads.
       *
       * @param dataset (array of quads) the RDF dataset to convert.
       *
       * @return the N-Quads string.
       */
      static serialize(dataset) {
        if (!Array.isArray(dataset)) {
          dataset = NQuads.legacyDatasetToQuads(dataset);
        }
        const quads = [];
        for (const quad of dataset) {
          quads.push(NQuads.serializeQuad(quad));
        }
        return quads.sort().join("");
      }
      /**
       * Converts RDF quad components to an N-Quad string (a single quad).
       *
       * @param {Object} s - N-Quad subject component.
       * @param {Object} p - N-Quad predicate component.
       * @param {Object} o - N-Quad object component.
       * @param {Object} g - N-Quad graph component.
       *
       * @return {string} the N-Quad.
       */
      static serializeQuadComponents(s, p, o, g) {
        let nquad = "";
        if (s.termType === TYPE_NAMED_NODE) {
          nquad += `<${s.value}>`;
        } else {
          nquad += `${s.value}`;
        }
        nquad += ` <${p.value}> `;
        if (o.termType === TYPE_NAMED_NODE) {
          nquad += `<${o.value}>`;
        } else if (o.termType === TYPE_BLANK_NODE) {
          nquad += o.value;
        } else {
          nquad += `"${_escape(o.value)}"`;
          if (o.datatype.value === RDF_LANGSTRING) {
            if (o.language) {
              nquad += `@${o.language}`;
            }
          } else if (o.datatype.value !== XSD_STRING) {
            nquad += `^^<${o.datatype.value}>`;
          }
        }
        if (g.termType === TYPE_NAMED_NODE) {
          nquad += ` <${g.value}>`;
        } else if (g.termType === TYPE_BLANK_NODE) {
          nquad += ` ${g.value}`;
        }
        nquad += " .\n";
        return nquad;
      }
      /**
       * Converts an RDF quad to an N-Quad string (a single quad).
       *
       * @param quad the RDF quad convert.
       *
       * @return the N-Quad string.
       */
      static serializeQuad(quad) {
        return NQuads.serializeQuadComponents(
          quad.subject,
          quad.predicate,
          quad.object,
          quad.graph
        );
      }
      /**
       * Converts a legacy-formatted dataset to an array of quads dataset per
       * http://rdf.js.org/.
       *
       * @param dataset the legacy dataset to convert.
       *
       * @return the array of quads dataset.
       */
      static legacyDatasetToQuads(dataset) {
        const quads = [];
        const termTypeMap = {
          "blank node": TYPE_BLANK_NODE,
          IRI: TYPE_NAMED_NODE,
          literal: TYPE_LITERAL
        };
        for (const graphName in dataset) {
          const triples = dataset[graphName];
          triples.forEach((triple) => {
            const quad = {};
            for (const componentName in triple) {
              const oldComponent = triple[componentName];
              const newComponent = {
                termType: termTypeMap[oldComponent.type],
                value: oldComponent.value
              };
              if (newComponent.termType === TYPE_LITERAL) {
                newComponent.datatype = {
                  termType: TYPE_NAMED_NODE
                };
                if ("datatype" in oldComponent) {
                  newComponent.datatype.value = oldComponent.datatype;
                }
                if ("language" in oldComponent) {
                  if (!("datatype" in oldComponent)) {
                    newComponent.datatype.value = RDF_LANGSTRING;
                  }
                  newComponent.language = oldComponent.language;
                } else if (!("datatype" in oldComponent)) {
                  newComponent.datatype.value = XSD_STRING;
                }
              }
              quad[componentName] = newComponent;
            }
            if (graphName === "@default") {
              quad.graph = {
                termType: TYPE_DEFAULT_GRAPH,
                value: ""
              };
            } else {
              quad.graph = {
                termType: graphName.startsWith("_:") ? TYPE_BLANK_NODE : TYPE_NAMED_NODE,
                value: graphName
              };
            }
            quads.push(quad);
          });
        }
        return quads;
      }
    };
    function _compareTriples(t1, t2) {
      if (!(t1.subject.termType === t2.subject.termType && t1.object.termType === t2.object.termType)) {
        return false;
      }
      if (!(t1.subject.value === t2.subject.value && t1.predicate.value === t2.predicate.value && t1.object.value === t2.object.value)) {
        return false;
      }
      if (t1.object.termType !== TYPE_LITERAL) {
        return true;
      }
      return t1.object.datatype.termType === t2.object.datatype.termType && t1.object.language === t2.object.language && t1.object.datatype.value === t2.object.datatype.value;
    }
    var _escapeRegex = /["\\\n\r]/g;
    function _escape(s) {
      return s.replace(_escapeRegex, function(match) {
        switch (match) {
          case '"':
            return '\\"';
          case "\\":
            return "\\\\";
          case "\n":
            return "\\n";
          case "\r":
            return "\\r";
        }
      });
    }
    var _unescapeRegex = /(?:\\([tbnrf"'\\]))|(?:\\u([0-9A-Fa-f]{4}))|(?:\\U([0-9A-Fa-f]{8}))/g;
    function _unescape(s) {
      return s.replace(_unescapeRegex, function(match, code, u, U) {
        if (code) {
          switch (code) {
            case "t":
              return "	";
            case "b":
              return "\b";
            case "n":
              return "\n";
            case "r":
              return "\r";
            case "f":
              return "\f";
            case '"':
              return '"';
            case "'":
              return "'";
            case "\\":
              return "\\";
          }
        }
        if (u) {
          return String.fromCharCode(parseInt(u, 16));
        }
        if (U) {
          throw new Error("Unsupported U escape");
        }
      });
    }
  }
});

// node_modules/rdf-canonize/lib/URDNA2015.js
var require_URDNA2015 = __commonJS({
  "node_modules/rdf-canonize/lib/URDNA2015.js"(exports, module) {
    "use strict";
    var IdentifierIssuer = require_IdentifierIssuer();
    var MessageDigest = require_MessageDigest_browser();
    var Permuter = require_Permuter();
    var NQuads = require_NQuads();
    module.exports = class URDNA2015 {
      constructor({
        createMessageDigest = () => new MessageDigest("sha256"),
        canonicalIdMap = /* @__PURE__ */ new Map(),
        maxDeepIterations = Infinity
      } = {}) {
        this.name = "URDNA2015";
        this.blankNodeInfo = /* @__PURE__ */ new Map();
        this.canonicalIssuer = new IdentifierIssuer("_:c14n", canonicalIdMap);
        this.createMessageDigest = createMessageDigest;
        this.maxDeepIterations = maxDeepIterations;
        this.quads = null;
        this.deepIterations = null;
      }
      // 4.4) Normalization Algorithm
      async main(dataset) {
        this.deepIterations = /* @__PURE__ */ new Map();
        this.quads = dataset;
        for (const quad of dataset) {
          this._addBlankNodeQuadInfo({ quad, component: quad.subject });
          this._addBlankNodeQuadInfo({ quad, component: quad.object });
          this._addBlankNodeQuadInfo({ quad, component: quad.graph });
        }
        const hashToBlankNodes = /* @__PURE__ */ new Map();
        const nonNormalized = [...this.blankNodeInfo.keys()];
        let i = 0;
        for (const id of nonNormalized) {
          if (++i % 100 === 0) {
            await this._yield();
          }
          await this._hashAndTrackBlankNode({ id, hashToBlankNodes });
        }
        const hashes = [...hashToBlankNodes.keys()].sort();
        const nonUnique = [];
        for (const hash of hashes) {
          const idList = hashToBlankNodes.get(hash);
          if (idList.length > 1) {
            nonUnique.push(idList);
            continue;
          }
          const id = idList[0];
          this.canonicalIssuer.getId(id);
        }
        for (const idList of nonUnique) {
          const hashPathList = [];
          for (const id of idList) {
            if (this.canonicalIssuer.hasId(id)) {
              continue;
            }
            const issuer = new IdentifierIssuer("_:b");
            issuer.getId(id);
            const result = await this.hashNDegreeQuads(id, issuer);
            hashPathList.push(result);
          }
          hashPathList.sort(_stringHashCompare);
          for (const result of hashPathList) {
            const oldIds = result.issuer.getOldIds();
            for (const id of oldIds) {
              this.canonicalIssuer.getId(id);
            }
          }
        }
        const normalized = [];
        for (const quad of this.quads) {
          const nQuad = NQuads.serializeQuadComponents(
            this._componentWithCanonicalId(quad.subject),
            quad.predicate,
            this._componentWithCanonicalId(quad.object),
            this._componentWithCanonicalId(quad.graph)
          );
          normalized.push(nQuad);
        }
        normalized.sort();
        return normalized.join("");
      }
      // 4.6) Hash First Degree Quads
      async hashFirstDegreeQuads(id) {
        const nquads = [];
        const info = this.blankNodeInfo.get(id);
        const quads = info.quads;
        for (const quad of quads) {
          const copy = {
            subject: null,
            predicate: quad.predicate,
            object: null,
            graph: null
          };
          copy.subject = this.modifyFirstDegreeComponent(
            id,
            quad.subject,
            "subject"
          );
          copy.object = this.modifyFirstDegreeComponent(
            id,
            quad.object,
            "object"
          );
          copy.graph = this.modifyFirstDegreeComponent(
            id,
            quad.graph,
            "graph"
          );
          nquads.push(NQuads.serializeQuad(copy));
        }
        nquads.sort();
        const md = this.createMessageDigest();
        for (const nquad of nquads) {
          md.update(nquad);
        }
        info.hash = await md.digest();
        return info.hash;
      }
      // 4.7) Hash Related Blank Node
      async hashRelatedBlankNode(related, quad, issuer, position) {
        let id;
        if (this.canonicalIssuer.hasId(related)) {
          id = this.canonicalIssuer.getId(related);
        } else if (issuer.hasId(related)) {
          id = issuer.getId(related);
        } else {
          id = this.blankNodeInfo.get(related).hash;
        }
        const md = this.createMessageDigest();
        md.update(position);
        if (position !== "g") {
          md.update(this.getRelatedPredicate(quad));
        }
        md.update(id);
        return md.digest();
      }
      // 4.8) Hash N-Degree Quads
      async hashNDegreeQuads(id, issuer) {
        const deepIterations = this.deepIterations.get(id) || 0;
        if (deepIterations > this.maxDeepIterations) {
          throw new Error(
            `Maximum deep iterations (${this.maxDeepIterations}) exceeded.`
          );
        }
        this.deepIterations.set(id, deepIterations + 1);
        const md = this.createMessageDigest();
        const hashToRelated = await this.createHashToRelated(id, issuer);
        const hashes = [...hashToRelated.keys()].sort();
        for (const hash of hashes) {
          md.update(hash);
          let chosenPath = "";
          let chosenIssuer;
          const permuter = new Permuter(hashToRelated.get(hash));
          let i = 0;
          while (permuter.hasNext()) {
            const permutation = permuter.next();
            if (++i % 3 === 0) {
              await this._yield();
            }
            let issuerCopy = issuer.clone();
            let path = "";
            const recursionList = [];
            let nextPermutation = false;
            for (const related of permutation) {
              if (this.canonicalIssuer.hasId(related)) {
                path += this.canonicalIssuer.getId(related);
              } else {
                if (!issuerCopy.hasId(related)) {
                  recursionList.push(related);
                }
                path += issuerCopy.getId(related);
              }
              if (chosenPath.length !== 0 && path > chosenPath) {
                nextPermutation = true;
                break;
              }
            }
            if (nextPermutation) {
              continue;
            }
            for (const related of recursionList) {
              const result = await this.hashNDegreeQuads(related, issuerCopy);
              path += issuerCopy.getId(related);
              path += `<${result.hash}>`;
              issuerCopy = result.issuer;
              if (chosenPath.length !== 0 && path > chosenPath) {
                nextPermutation = true;
                break;
              }
            }
            if (nextPermutation) {
              continue;
            }
            if (chosenPath.length === 0 || path < chosenPath) {
              chosenPath = path;
              chosenIssuer = issuerCopy;
            }
          }
          md.update(chosenPath);
          issuer = chosenIssuer;
        }
        return { hash: await md.digest(), issuer };
      }
      // helper for modifying component during Hash First Degree Quads
      modifyFirstDegreeComponent(id, component) {
        if (component.termType !== "BlankNode") {
          return component;
        }
        return {
          termType: "BlankNode",
          value: component.value === id ? "_:a" : "_:z"
        };
      }
      // helper for getting a related predicate
      getRelatedPredicate(quad) {
        return `<${quad.predicate.value}>`;
      }
      // helper for creating hash to related blank nodes map
      async createHashToRelated(id, issuer) {
        const hashToRelated = /* @__PURE__ */ new Map();
        const quads = this.blankNodeInfo.get(id).quads;
        let i = 0;
        for (const quad of quads) {
          if (++i % 100 === 0) {
            await this._yield();
          }
          await Promise.all([
            this._addRelatedBlankNodeHash({
              quad,
              component: quad.subject,
              position: "s",
              id,
              issuer,
              hashToRelated
            }),
            this._addRelatedBlankNodeHash({
              quad,
              component: quad.object,
              position: "o",
              id,
              issuer,
              hashToRelated
            }),
            this._addRelatedBlankNodeHash({
              quad,
              component: quad.graph,
              position: "g",
              id,
              issuer,
              hashToRelated
            })
          ]);
        }
        return hashToRelated;
      }
      async _hashAndTrackBlankNode({ id, hashToBlankNodes }) {
        const hash = await this.hashFirstDegreeQuads(id);
        const idList = hashToBlankNodes.get(hash);
        if (!idList) {
          hashToBlankNodes.set(hash, [id]);
        } else {
          idList.push(id);
        }
      }
      _addBlankNodeQuadInfo({ quad, component }) {
        if (component.termType !== "BlankNode") {
          return;
        }
        const id = component.value;
        const info = this.blankNodeInfo.get(id);
        if (info) {
          info.quads.add(quad);
        } else {
          this.blankNodeInfo.set(id, { quads: /* @__PURE__ */ new Set([quad]), hash: null });
        }
      }
      async _addRelatedBlankNodeHash({ quad, component, position, id, issuer, hashToRelated }) {
        if (!(component.termType === "BlankNode" && component.value !== id)) {
          return;
        }
        const related = component.value;
        const hash = await this.hashRelatedBlankNode(
          related,
          quad,
          issuer,
          position
        );
        const entries = hashToRelated.get(hash);
        if (entries) {
          entries.push(related);
        } else {
          hashToRelated.set(hash, [related]);
        }
      }
      // canonical ids for 7.1
      _componentWithCanonicalId(component) {
        if (component.termType === "BlankNode" && !component.value.startsWith(this.canonicalIssuer.prefix)) {
          return {
            termType: "BlankNode",
            value: this.canonicalIssuer.getId(component.value)
          };
        }
        return component;
      }
      async _yield() {
        return new Promise((resolve) => setImmediate(resolve));
      }
    };
    function _stringHashCompare(a, b) {
      return a.hash < b.hash ? -1 : a.hash > b.hash ? 1 : 0;
    }
  }
});

// node_modules/rdf-canonize/lib/URGNA2012.js
var require_URGNA2012 = __commonJS({
  "node_modules/rdf-canonize/lib/URGNA2012.js"(exports, module) {
    "use strict";
    var MessageDigest = require_MessageDigest_browser();
    var URDNA2015 = require_URDNA2015();
    module.exports = class URDNA2012 extends URDNA2015 {
      constructor() {
        super();
        this.name = "URGNA2012";
        this.createMessageDigest = () => new MessageDigest("sha1");
      }
      // helper for modifying component during Hash First Degree Quads
      modifyFirstDegreeComponent(id, component, key) {
        if (component.termType !== "BlankNode") {
          return component;
        }
        if (key === "graph") {
          return {
            termType: "BlankNode",
            value: "_:g"
          };
        }
        return {
          termType: "BlankNode",
          value: component.value === id ? "_:a" : "_:z"
        };
      }
      // helper for getting a related predicate
      getRelatedPredicate(quad) {
        return quad.predicate.value;
      }
      // helper for creating hash to related blank nodes map
      async createHashToRelated(id, issuer) {
        const hashToRelated = /* @__PURE__ */ new Map();
        const quads = this.blankNodeInfo.get(id).quads;
        let i = 0;
        for (const quad of quads) {
          let position;
          let related;
          if (quad.subject.termType === "BlankNode" && quad.subject.value !== id) {
            related = quad.subject.value;
            position = "p";
          } else if (quad.object.termType === "BlankNode" && quad.object.value !== id) {
            related = quad.object.value;
            position = "r";
          } else {
            continue;
          }
          if (++i % 100 === 0) {
            await this._yield();
          }
          const hash = await this.hashRelatedBlankNode(
            related,
            quad,
            issuer,
            position
          );
          const entries = hashToRelated.get(hash);
          if (entries) {
            entries.push(related);
          } else {
            hashToRelated.set(hash, [related]);
          }
        }
        return hashToRelated;
      }
    };
  }
});

// node_modules/rdf-canonize/lib/URDNA2015Sync.js
var require_URDNA2015Sync = __commonJS({
  "node_modules/rdf-canonize/lib/URDNA2015Sync.js"(exports, module) {
    "use strict";
    var IdentifierIssuer = require_IdentifierIssuer();
    var MessageDigest = require_MessageDigest_browser();
    var Permuter = require_Permuter();
    var NQuads = require_NQuads();
    module.exports = class URDNA2015Sync {
      constructor({
        createMessageDigest = () => new MessageDigest("sha256"),
        canonicalIdMap = /* @__PURE__ */ new Map(),
        maxDeepIterations = Infinity
      } = {}) {
        this.name = "URDNA2015";
        this.blankNodeInfo = /* @__PURE__ */ new Map();
        this.canonicalIssuer = new IdentifierIssuer("_:c14n", canonicalIdMap);
        this.createMessageDigest = createMessageDigest;
        this.maxDeepIterations = maxDeepIterations;
        this.quads = null;
        this.deepIterations = null;
      }
      // 4.4) Normalization Algorithm
      main(dataset) {
        this.deepIterations = /* @__PURE__ */ new Map();
        this.quads = dataset;
        for (const quad of dataset) {
          this._addBlankNodeQuadInfo({ quad, component: quad.subject });
          this._addBlankNodeQuadInfo({ quad, component: quad.object });
          this._addBlankNodeQuadInfo({ quad, component: quad.graph });
        }
        const hashToBlankNodes = /* @__PURE__ */ new Map();
        const nonNormalized = [...this.blankNodeInfo.keys()];
        for (const id of nonNormalized) {
          this._hashAndTrackBlankNode({ id, hashToBlankNodes });
        }
        const hashes = [...hashToBlankNodes.keys()].sort();
        const nonUnique = [];
        for (const hash of hashes) {
          const idList = hashToBlankNodes.get(hash);
          if (idList.length > 1) {
            nonUnique.push(idList);
            continue;
          }
          const id = idList[0];
          this.canonicalIssuer.getId(id);
        }
        for (const idList of nonUnique) {
          const hashPathList = [];
          for (const id of idList) {
            if (this.canonicalIssuer.hasId(id)) {
              continue;
            }
            const issuer = new IdentifierIssuer("_:b");
            issuer.getId(id);
            const result = this.hashNDegreeQuads(id, issuer);
            hashPathList.push(result);
          }
          hashPathList.sort(_stringHashCompare);
          for (const result of hashPathList) {
            const oldIds = result.issuer.getOldIds();
            for (const id of oldIds) {
              this.canonicalIssuer.getId(id);
            }
          }
        }
        const normalized = [];
        for (const quad of this.quads) {
          const nQuad = NQuads.serializeQuadComponents(
            this._componentWithCanonicalId({ component: quad.subject }),
            quad.predicate,
            this._componentWithCanonicalId({ component: quad.object }),
            this._componentWithCanonicalId({ component: quad.graph })
          );
          normalized.push(nQuad);
        }
        normalized.sort();
        return normalized.join("");
      }
      // 4.6) Hash First Degree Quads
      hashFirstDegreeQuads(id) {
        const nquads = [];
        const info = this.blankNodeInfo.get(id);
        const quads = info.quads;
        for (const quad of quads) {
          const copy = {
            subject: null,
            predicate: quad.predicate,
            object: null,
            graph: null
          };
          copy.subject = this.modifyFirstDegreeComponent(
            id,
            quad.subject,
            "subject"
          );
          copy.object = this.modifyFirstDegreeComponent(
            id,
            quad.object,
            "object"
          );
          copy.graph = this.modifyFirstDegreeComponent(
            id,
            quad.graph,
            "graph"
          );
          nquads.push(NQuads.serializeQuad(copy));
        }
        nquads.sort();
        const md = this.createMessageDigest();
        for (const nquad of nquads) {
          md.update(nquad);
        }
        info.hash = md.digest();
        return info.hash;
      }
      // 4.7) Hash Related Blank Node
      hashRelatedBlankNode(related, quad, issuer, position) {
        let id;
        if (this.canonicalIssuer.hasId(related)) {
          id = this.canonicalIssuer.getId(related);
        } else if (issuer.hasId(related)) {
          id = issuer.getId(related);
        } else {
          id = this.blankNodeInfo.get(related).hash;
        }
        const md = this.createMessageDigest();
        md.update(position);
        if (position !== "g") {
          md.update(this.getRelatedPredicate(quad));
        }
        md.update(id);
        return md.digest();
      }
      // 4.8) Hash N-Degree Quads
      hashNDegreeQuads(id, issuer) {
        const deepIterations = this.deepIterations.get(id) || 0;
        if (deepIterations > this.maxDeepIterations) {
          throw new Error(
            `Maximum deep iterations (${this.maxDeepIterations}) exceeded.`
          );
        }
        this.deepIterations.set(id, deepIterations + 1);
        const md = this.createMessageDigest();
        const hashToRelated = this.createHashToRelated(id, issuer);
        const hashes = [...hashToRelated.keys()].sort();
        for (const hash of hashes) {
          md.update(hash);
          let chosenPath = "";
          let chosenIssuer;
          const permuter = new Permuter(hashToRelated.get(hash));
          while (permuter.hasNext()) {
            const permutation = permuter.next();
            let issuerCopy = issuer.clone();
            let path = "";
            const recursionList = [];
            let nextPermutation = false;
            for (const related of permutation) {
              if (this.canonicalIssuer.hasId(related)) {
                path += this.canonicalIssuer.getId(related);
              } else {
                if (!issuerCopy.hasId(related)) {
                  recursionList.push(related);
                }
                path += issuerCopy.getId(related);
              }
              if (chosenPath.length !== 0 && path > chosenPath) {
                nextPermutation = true;
                break;
              }
            }
            if (nextPermutation) {
              continue;
            }
            for (const related of recursionList) {
              const result = this.hashNDegreeQuads(related, issuerCopy);
              path += issuerCopy.getId(related);
              path += `<${result.hash}>`;
              issuerCopy = result.issuer;
              if (chosenPath.length !== 0 && path > chosenPath) {
                nextPermutation = true;
                break;
              }
            }
            if (nextPermutation) {
              continue;
            }
            if (chosenPath.length === 0 || path < chosenPath) {
              chosenPath = path;
              chosenIssuer = issuerCopy;
            }
          }
          md.update(chosenPath);
          issuer = chosenIssuer;
        }
        return { hash: md.digest(), issuer };
      }
      // helper for modifying component during Hash First Degree Quads
      modifyFirstDegreeComponent(id, component) {
        if (component.termType !== "BlankNode") {
          return component;
        }
        return {
          termType: "BlankNode",
          value: component.value === id ? "_:a" : "_:z"
        };
      }
      // helper for getting a related predicate
      getRelatedPredicate(quad) {
        return `<${quad.predicate.value}>`;
      }
      // helper for creating hash to related blank nodes map
      createHashToRelated(id, issuer) {
        const hashToRelated = /* @__PURE__ */ new Map();
        const quads = this.blankNodeInfo.get(id).quads;
        for (const quad of quads) {
          this._addRelatedBlankNodeHash({
            quad,
            component: quad.subject,
            position: "s",
            id,
            issuer,
            hashToRelated
          });
          this._addRelatedBlankNodeHash({
            quad,
            component: quad.object,
            position: "o",
            id,
            issuer,
            hashToRelated
          });
          this._addRelatedBlankNodeHash({
            quad,
            component: quad.graph,
            position: "g",
            id,
            issuer,
            hashToRelated
          });
        }
        return hashToRelated;
      }
      _hashAndTrackBlankNode({ id, hashToBlankNodes }) {
        const hash = this.hashFirstDegreeQuads(id);
        const idList = hashToBlankNodes.get(hash);
        if (!idList) {
          hashToBlankNodes.set(hash, [id]);
        } else {
          idList.push(id);
        }
      }
      _addBlankNodeQuadInfo({ quad, component }) {
        if (component.termType !== "BlankNode") {
          return;
        }
        const id = component.value;
        const info = this.blankNodeInfo.get(id);
        if (info) {
          info.quads.add(quad);
        } else {
          this.blankNodeInfo.set(id, { quads: /* @__PURE__ */ new Set([quad]), hash: null });
        }
      }
      _addRelatedBlankNodeHash({ quad, component, position, id, issuer, hashToRelated }) {
        if (!(component.termType === "BlankNode" && component.value !== id)) {
          return;
        }
        const related = component.value;
        const hash = this.hashRelatedBlankNode(related, quad, issuer, position);
        const entries = hashToRelated.get(hash);
        if (entries) {
          entries.push(related);
        } else {
          hashToRelated.set(hash, [related]);
        }
      }
      // canonical ids for 7.1
      _componentWithCanonicalId({ component }) {
        if (component.termType === "BlankNode" && !component.value.startsWith(this.canonicalIssuer.prefix)) {
          return {
            termType: "BlankNode",
            value: this.canonicalIssuer.getId(component.value)
          };
        }
        return component;
      }
    };
    function _stringHashCompare(a, b) {
      return a.hash < b.hash ? -1 : a.hash > b.hash ? 1 : 0;
    }
  }
});

// node_modules/rdf-canonize/lib/URGNA2012Sync.js
var require_URGNA2012Sync = __commonJS({
  "node_modules/rdf-canonize/lib/URGNA2012Sync.js"(exports, module) {
    "use strict";
    var MessageDigest = require_MessageDigest_browser();
    var URDNA2015Sync = require_URDNA2015Sync();
    module.exports = class URDNA2012Sync extends URDNA2015Sync {
      constructor() {
        super();
        this.name = "URGNA2012";
        this.createMessageDigest = () => new MessageDigest("sha1");
      }
      // helper for modifying component during Hash First Degree Quads
      modifyFirstDegreeComponent(id, component, key) {
        if (component.termType !== "BlankNode") {
          return component;
        }
        if (key === "graph") {
          return {
            termType: "BlankNode",
            value: "_:g"
          };
        }
        return {
          termType: "BlankNode",
          value: component.value === id ? "_:a" : "_:z"
        };
      }
      // helper for getting a related predicate
      getRelatedPredicate(quad) {
        return quad.predicate.value;
      }
      // helper for creating hash to related blank nodes map
      createHashToRelated(id, issuer) {
        const hashToRelated = /* @__PURE__ */ new Map();
        const quads = this.blankNodeInfo.get(id).quads;
        for (const quad of quads) {
          let position;
          let related;
          if (quad.subject.termType === "BlankNode" && quad.subject.value !== id) {
            related = quad.subject.value;
            position = "p";
          } else if (quad.object.termType === "BlankNode" && quad.object.value !== id) {
            related = quad.object.value;
            position = "r";
          } else {
            continue;
          }
          const hash = this.hashRelatedBlankNode(related, quad, issuer, position);
          const entries = hashToRelated.get(hash);
          if (entries) {
            entries.push(related);
          } else {
            hashToRelated.set(hash, [related]);
          }
        }
        return hashToRelated;
      }
    };
  }
});

// (disabled):rdf-canonize-native
var require_rdf_canonize_native = __commonJS({
  "(disabled):rdf-canonize-native"() {
  }
});

// node_modules/rdf-canonize/lib/index.js
var require_lib = __commonJS({
  "node_modules/rdf-canonize/lib/index.js"(exports) {
    "use strict";
    var URDNA2015 = require_URDNA2015();
    var URGNA2012 = require_URGNA2012();
    var URDNA2015Sync = require_URDNA2015Sync();
    var URGNA2012Sync = require_URGNA2012Sync();
    var rdfCanonizeNative;
    try {
      rdfCanonizeNative = require_rdf_canonize_native();
    } catch (e) {
    }
    function _inputToDataset(input) {
      if (!Array.isArray(input)) {
        return exports.NQuads.legacyDatasetToQuads(input);
      }
      return input;
    }
    exports.NQuads = require_NQuads();
    exports.IdentifierIssuer = require_IdentifierIssuer();
    exports._rdfCanonizeNative = function(api) {
      if (api) {
        rdfCanonizeNative = api;
      }
      return rdfCanonizeNative;
    };
    exports.canonize = async function(input, options) {
      const dataset = _inputToDataset(input, options);
      if (options.useNative) {
        if (!rdfCanonizeNative) {
          throw new Error("rdf-canonize-native not available");
        }
        if (options.createMessageDigest) {
          throw new Error(
            '"createMessageDigest" cannot be used with "useNative".'
          );
        }
        return new Promise((resolve, reject) => rdfCanonizeNative.canonize(dataset, options, (err, canonical) => err ? reject(err) : resolve(canonical)));
      }
      if (options.algorithm === "URDNA2015") {
        return new URDNA2015(options).main(dataset);
      }
      if (options.algorithm === "URGNA2012") {
        if (options.createMessageDigest) {
          throw new Error(
            '"createMessageDigest" cannot be used with "URGNA2012".'
          );
        }
        return new URGNA2012(options).main(dataset);
      }
      if (!("algorithm" in options)) {
        throw new Error("No RDF Dataset Canonicalization algorithm specified.");
      }
      throw new Error(
        "Invalid RDF Dataset Canonicalization algorithm: " + options.algorithm
      );
    };
    exports._canonizeSync = function(input, options) {
      const dataset = _inputToDataset(input, options);
      if (options.useNative) {
        if (!rdfCanonizeNative) {
          throw new Error("rdf-canonize-native not available");
        }
        if (options.createMessageDigest) {
          throw new Error(
            '"createMessageDigest" cannot be used with "useNative".'
          );
        }
        return rdfCanonizeNative.canonizeSync(dataset, options);
      }
      if (options.algorithm === "URDNA2015") {
        return new URDNA2015Sync(options).main(dataset);
      }
      if (options.algorithm === "URGNA2012") {
        if (options.createMessageDigest) {
          throw new Error(
            '"createMessageDigest" cannot be used with "URGNA2012".'
          );
        }
        return new URGNA2012Sync(options).main(dataset);
      }
      if (!("algorithm" in options)) {
        throw new Error("No RDF Dataset Canonicalization algorithm specified.");
      }
      throw new Error(
        "Invalid RDF Dataset Canonicalization algorithm: " + options.algorithm
      );
    };
  }
});

// node_modules/rdf-canonize/index.js
var require_rdf_canonize = __commonJS({
  "node_modules/rdf-canonize/index.js"(exports, module) {
    module.exports = require_lib();
  }
});

// node_modules/jsonld/lib/types.js
var require_types = __commonJS({
  "node_modules/jsonld/lib/types.js"(exports, module) {
    "use strict";
    var api = {};
    module.exports = api;
    api.isArray = Array.isArray;
    api.isBoolean = (v) => typeof v === "boolean" || Object.prototype.toString.call(v) === "[object Boolean]";
    api.isDouble = (v) => api.isNumber(v) && (String(v).indexOf(".") !== -1 || Math.abs(v) >= 1e21);
    api.isEmptyObject = (v) => api.isObject(v) && Object.keys(v).length === 0;
    api.isNumber = (v) => typeof v === "number" || Object.prototype.toString.call(v) === "[object Number]";
    api.isNumeric = (v) => !isNaN(parseFloat(v)) && isFinite(v);
    api.isObject = (v) => Object.prototype.toString.call(v) === "[object Object]";
    api.isString = (v) => typeof v === "string" || Object.prototype.toString.call(v) === "[object String]";
    api.isUndefined = (v) => typeof v === "undefined";
  }
});

// node_modules/jsonld/lib/graphTypes.js
var require_graphTypes = __commonJS({
  "node_modules/jsonld/lib/graphTypes.js"(exports, module) {
    "use strict";
    var types = require_types();
    var api = {};
    module.exports = api;
    api.isSubject = (v) => {
      if (types.isObject(v) && !("@value" in v || "@set" in v || "@list" in v)) {
        const keyCount = Object.keys(v).length;
        return keyCount > 1 || !("@id" in v);
      }
      return false;
    };
    api.isSubjectReference = (v) => (
      // Note: A value is a subject reference if all of these hold true:
      // 1. It is an Object.
      // 2. It has a single key: @id.
      types.isObject(v) && Object.keys(v).length === 1 && "@id" in v
    );
    api.isValue = (v) => (
      // Note: A value is a @value if all of these hold true:
      // 1. It is an Object.
      // 2. It has the @value property.
      types.isObject(v) && "@value" in v
    );
    api.isList = (v) => (
      // Note: A value is a @list if all of these hold true:
      // 1. It is an Object.
      // 2. It has the @list property.
      types.isObject(v) && "@list" in v
    );
    api.isGraph = (v) => {
      return types.isObject(v) && "@graph" in v && Object.keys(v).filter((key) => key !== "@id" && key !== "@index").length === 1;
    };
    api.isSimpleGraph = (v) => {
      return api.isGraph(v) && !("@id" in v);
    };
    api.isBlankNode = (v) => {
      if (types.isObject(v)) {
        if ("@id" in v) {
          const id = v["@id"];
          return !types.isString(id) || id.indexOf("_:") === 0;
        }
        return Object.keys(v).length === 0 || !("@value" in v || "@set" in v || "@list" in v);
      }
      return false;
    };
  }
});

// node_modules/jsonld/lib/JsonLdError.js
var require_JsonLdError = __commonJS({
  "node_modules/jsonld/lib/JsonLdError.js"(exports, module) {
    "use strict";
    module.exports = class JsonLdError extends Error {
      /**
       * Creates a JSON-LD Error.
       *
       * @param msg the error message.
       * @param type the error type.
       * @param details the error details.
       */
      constructor(message = "An unspecified JSON-LD error occurred.", name74 = "jsonld.Error", details = {}) {
        super(message);
        this.name = name74;
        this.message = message;
        this.details = details;
      }
    };
  }
});

// node_modules/jsonld/lib/util.js
var require_util = __commonJS({
  "node_modules/jsonld/lib/util.js"(exports, module) {
    "use strict";
    var graphTypes = require_graphTypes();
    var types = require_types();
    var IdentifierIssuer = require_rdf_canonize().IdentifierIssuer;
    var JsonLdError = require_JsonLdError();
    var REGEX_BCP47 = /^[a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*$/;
    var REGEX_LINK_HEADERS = /(?:<[^>]*?>|"[^"]*?"|[^,])+/g;
    var REGEX_LINK_HEADER = /\s*<([^>]*?)>\s*(?:;\s*(.*))?/;
    var REGEX_LINK_HEADER_PARAMS = /(.*?)=(?:(?:"([^"]*?)")|([^"]*?))\s*(?:(?:;\s*)|$)/g;
    var REGEX_KEYWORD = /^@[a-zA-Z]+$/;
    var DEFAULTS2 = {
      headers: {
        accept: "application/ld+json, application/json"
      }
    };
    var api = {};
    module.exports = api;
    api.IdentifierIssuer = IdentifierIssuer;
    api.REGEX_BCP47 = REGEX_BCP47;
    api.REGEX_KEYWORD = REGEX_KEYWORD;
    api.clone = function(value) {
      if (value && typeof value === "object") {
        let rval;
        if (types.isArray(value)) {
          rval = [];
          for (let i = 0; i < value.length; ++i) {
            rval[i] = api.clone(value[i]);
          }
        } else if (value instanceof Map) {
          rval = /* @__PURE__ */ new Map();
          for (const [k, v] of value) {
            rval.set(k, api.clone(v));
          }
        } else if (value instanceof Set) {
          rval = /* @__PURE__ */ new Set();
          for (const v of value) {
            rval.add(api.clone(v));
          }
        } else if (types.isObject(value)) {
          rval = {};
          for (const key in value) {
            rval[key] = api.clone(value[key]);
          }
        } else {
          rval = value.toString();
        }
        return rval;
      }
      return value;
    };
    api.asArray = function(value) {
      return Array.isArray(value) ? value : [value];
    };
    api.buildHeaders = (headers = {}) => {
      const hasAccept = Object.keys(headers).some(
        (h) => h.toLowerCase() === "accept"
      );
      if (hasAccept) {
        throw new RangeError(
          'Accept header may not be specified; only "' + DEFAULTS2.headers.accept + '" is supported.'
        );
      }
      return Object.assign({ Accept: DEFAULTS2.headers.accept }, headers);
    };
    api.parseLinkHeader = (header) => {
      const rval = {};
      const entries = header.match(REGEX_LINK_HEADERS);
      for (let i = 0; i < entries.length; ++i) {
        let match = entries[i].match(REGEX_LINK_HEADER);
        if (!match) {
          continue;
        }
        const result = { target: match[1] };
        const params = match[2];
        while (match = REGEX_LINK_HEADER_PARAMS.exec(params)) {
          result[match[1]] = match[2] === void 0 ? match[3] : match[2];
        }
        const rel = result.rel || "";
        if (Array.isArray(rval[rel])) {
          rval[rel].push(result);
        } else if (rval.hasOwnProperty(rel)) {
          rval[rel] = [rval[rel], result];
        } else {
          rval[rel] = result;
        }
      }
      return rval;
    };
    api.validateTypeValue = (v, isFrame) => {
      if (types.isString(v)) {
        return;
      }
      if (types.isArray(v) && v.every((vv) => types.isString(vv))) {
        return;
      }
      if (isFrame && types.isObject(v)) {
        switch (Object.keys(v).length) {
          case 0:
            return;
          case 1:
            if ("@default" in v && api.asArray(v["@default"]).every((vv) => types.isString(vv))) {
              return;
            }
        }
      }
      throw new JsonLdError(
        'Invalid JSON-LD syntax; "@type" value must a string, an array of strings, an empty object, or a default object.',
        "jsonld.SyntaxError",
        { code: "invalid type value", value: v }
      );
    };
    api.hasProperty = (subject, property) => {
      if (subject.hasOwnProperty(property)) {
        const value = subject[property];
        return !types.isArray(value) || value.length > 0;
      }
      return false;
    };
    api.hasValue = (subject, property, value) => {
      if (api.hasProperty(subject, property)) {
        let val = subject[property];
        const isList = graphTypes.isList(val);
        if (types.isArray(val) || isList) {
          if (isList) {
            val = val["@list"];
          }
          for (let i = 0; i < val.length; ++i) {
            if (api.compareValues(value, val[i])) {
              return true;
            }
          }
        } else if (!types.isArray(value)) {
          return api.compareValues(value, val);
        }
      }
      return false;
    };
    api.addValue = (subject, property, value, options) => {
      options = options || {};
      if (!("propertyIsArray" in options)) {
        options.propertyIsArray = false;
      }
      if (!("valueIsArray" in options)) {
        options.valueIsArray = false;
      }
      if (!("allowDuplicate" in options)) {
        options.allowDuplicate = true;
      }
      if (!("prependValue" in options)) {
        options.prependValue = false;
      }
      if (options.valueIsArray) {
        subject[property] = value;
      } else if (types.isArray(value)) {
        if (value.length === 0 && options.propertyIsArray && !subject.hasOwnProperty(property)) {
          subject[property] = [];
        }
        if (options.prependValue) {
          value = value.concat(subject[property]);
          subject[property] = [];
        }
        for (let i = 0; i < value.length; ++i) {
          api.addValue(subject, property, value[i], options);
        }
      } else if (subject.hasOwnProperty(property)) {
        const hasValue = !options.allowDuplicate && api.hasValue(subject, property, value);
        if (!types.isArray(subject[property]) && (!hasValue || options.propertyIsArray)) {
          subject[property] = [subject[property]];
        }
        if (!hasValue) {
          if (options.prependValue) {
            subject[property].unshift(value);
          } else {
            subject[property].push(value);
          }
        }
      } else {
        subject[property] = options.propertyIsArray ? [value] : value;
      }
    };
    api.getValues = (subject, property) => [].concat(subject[property] || []);
    api.removeProperty = (subject, property) => {
      delete subject[property];
    };
    api.removeValue = (subject, property, value, options) => {
      options = options || {};
      if (!("propertyIsArray" in options)) {
        options.propertyIsArray = false;
      }
      const values = api.getValues(subject, property).filter(
        (e) => !api.compareValues(e, value)
      );
      if (values.length === 0) {
        api.removeProperty(subject, property);
      } else if (values.length === 1 && !options.propertyIsArray) {
        subject[property] = values[0];
      } else {
        subject[property] = values;
      }
    };
    api.relabelBlankNodes = (input, options) => {
      options = options || {};
      const issuer = options.issuer || new IdentifierIssuer("_:b");
      return _labelBlankNodes(issuer, input);
    };
    api.compareValues = (v1, v2) => {
      if (v1 === v2) {
        return true;
      }
      if (graphTypes.isValue(v1) && graphTypes.isValue(v2) && v1["@value"] === v2["@value"] && v1["@type"] === v2["@type"] && v1["@language"] === v2["@language"] && v1["@index"] === v2["@index"]) {
        return true;
      }
      if (types.isObject(v1) && "@id" in v1 && types.isObject(v2) && "@id" in v2) {
        return v1["@id"] === v2["@id"];
      }
      return false;
    };
    api.compareShortestLeast = (a, b) => {
      if (a.length < b.length) {
        return -1;
      }
      if (b.length < a.length) {
        return 1;
      }
      if (a === b) {
        return 0;
      }
      return a < b ? -1 : 1;
    };
    function _labelBlankNodes(issuer, element) {
      if (types.isArray(element)) {
        for (let i = 0; i < element.length; ++i) {
          element[i] = _labelBlankNodes(issuer, element[i]);
        }
      } else if (graphTypes.isList(element)) {
        element["@list"] = _labelBlankNodes(issuer, element["@list"]);
      } else if (types.isObject(element)) {
        if (graphTypes.isBlankNode(element)) {
          element["@id"] = issuer.getId(element["@id"]);
        }
        const keys = Object.keys(element).sort();
        for (let ki = 0; ki < keys.length; ++ki) {
          const key = keys[ki];
          if (key !== "@id") {
            element[key] = _labelBlankNodes(issuer, element[key]);
          }
        }
      }
      return element;
    }
  }
});

// node_modules/jsonld/lib/constants.js
var require_constants = __commonJS({
  "node_modules/jsonld/lib/constants.js"(exports, module) {
    "use strict";
    var RDF = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
    var XSD = "http://www.w3.org/2001/XMLSchema#";
    module.exports = {
      // TODO: Deprecated and will be removed later. Use LINK_HEADER_CONTEXT.
      LINK_HEADER_REL: "http://www.w3.org/ns/json-ld#context",
      LINK_HEADER_CONTEXT: "http://www.w3.org/ns/json-ld#context",
      RDF,
      RDF_LIST: RDF + "List",
      RDF_FIRST: RDF + "first",
      RDF_REST: RDF + "rest",
      RDF_NIL: RDF + "nil",
      RDF_TYPE: RDF + "type",
      RDF_PLAIN_LITERAL: RDF + "PlainLiteral",
      RDF_XML_LITERAL: RDF + "XMLLiteral",
      RDF_JSON_LITERAL: RDF + "JSON",
      RDF_OBJECT: RDF + "object",
      RDF_LANGSTRING: RDF + "langString",
      XSD,
      XSD_BOOLEAN: XSD + "boolean",
      XSD_DOUBLE: XSD + "double",
      XSD_INTEGER: XSD + "integer",
      XSD_STRING: XSD + "string"
    };
  }
});

// node_modules/jsonld/lib/RequestQueue.js
var require_RequestQueue = __commonJS({
  "node_modules/jsonld/lib/RequestQueue.js"(exports, module) {
    "use strict";
    module.exports = class RequestQueue {
      /**
       * Creates a simple queue for requesting documents.
       */
      constructor() {
        this._requests = {};
      }
      wrapLoader(loader) {
        const self2 = this;
        self2._loader = loader;
        return function() {
          return self2.add.apply(self2, arguments);
        };
      }
      async add(url) {
        let promise = this._requests[url];
        if (promise) {
          return Promise.resolve(promise);
        }
        promise = this._requests[url] = this._loader(url);
        try {
          return await promise;
        } finally {
          delete this._requests[url];
        }
      }
    };
  }
});

// node_modules/jsonld/lib/url.js
var require_url = __commonJS({
  "node_modules/jsonld/lib/url.js"(exports, module) {
    "use strict";
    var types = require_types();
    var api = {};
    module.exports = api;
    api.parsers = {
      simple: {
        // RFC 3986 basic parts
        keys: [
          "href",
          "scheme",
          "authority",
          "path",
          "query",
          "fragment"
        ],
        /* eslint-disable-next-line max-len */
        regex: /^(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/
      },
      full: {
        keys: [
          "href",
          "protocol",
          "scheme",
          "authority",
          "auth",
          "user",
          "password",
          "hostname",
          "port",
          "path",
          "directory",
          "file",
          "query",
          "fragment"
        ],
        /* eslint-disable-next-line max-len */
        regex: /^(([a-zA-Z][a-zA-Z0-9+-.]*):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?(?:(((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/
      }
    };
    api.parse = (str, parser) => {
      const parsed = {};
      const o = api.parsers[parser || "full"];
      const m = o.regex.exec(str);
      let i = o.keys.length;
      while (i--) {
        parsed[o.keys[i]] = m[i] === void 0 ? null : m[i];
      }
      if (parsed.scheme === "https" && parsed.port === "443" || parsed.scheme === "http" && parsed.port === "80") {
        parsed.href = parsed.href.replace(":" + parsed.port, "");
        parsed.authority = parsed.authority.replace(":" + parsed.port, "");
        parsed.port = null;
      }
      parsed.normalizedPath = api.removeDotSegments(parsed.path);
      return parsed;
    };
    api.prependBase = (base, iri) => {
      if (base === null) {
        return iri;
      }
      if (api.isAbsolute(iri)) {
        return iri;
      }
      if (!base || types.isString(base)) {
        base = api.parse(base || "");
      }
      const rel = api.parse(iri);
      const transform = {
        protocol: base.protocol || ""
      };
      if (rel.authority !== null) {
        transform.authority = rel.authority;
        transform.path = rel.path;
        transform.query = rel.query;
      } else {
        transform.authority = base.authority;
        if (rel.path === "") {
          transform.path = base.path;
          if (rel.query !== null) {
            transform.query = rel.query;
          } else {
            transform.query = base.query;
          }
        } else {
          if (rel.path.indexOf("/") === 0) {
            transform.path = rel.path;
          } else {
            let path = base.path;
            path = path.substr(0, path.lastIndexOf("/") + 1);
            if ((path.length > 0 || base.authority) && path.substr(-1) !== "/") {
              path += "/";
            }
            path += rel.path;
            transform.path = path;
          }
          transform.query = rel.query;
        }
      }
      if (rel.path !== "") {
        transform.path = api.removeDotSegments(transform.path);
      }
      let rval = transform.protocol;
      if (transform.authority !== null) {
        rval += "//" + transform.authority;
      }
      rval += transform.path;
      if (transform.query !== null) {
        rval += "?" + transform.query;
      }
      if (rel.fragment !== null) {
        rval += "#" + rel.fragment;
      }
      if (rval === "") {
        rval = "./";
      }
      return rval;
    };
    api.removeBase = (base, iri) => {
      if (base === null) {
        return iri;
      }
      if (!base || types.isString(base)) {
        base = api.parse(base || "");
      }
      let root = "";
      if (base.href !== "") {
        root += (base.protocol || "") + "//" + (base.authority || "");
      } else if (iri.indexOf("//")) {
        root += "//";
      }
      if (iri.indexOf(root) !== 0) {
        return iri;
      }
      const rel = api.parse(iri.substr(root.length));
      const baseSegments = base.normalizedPath.split("/");
      const iriSegments = rel.normalizedPath.split("/");
      const last = rel.fragment || rel.query ? 0 : 1;
      while (baseSegments.length > 0 && iriSegments.length > last) {
        if (baseSegments[0] !== iriSegments[0]) {
          break;
        }
        baseSegments.shift();
        iriSegments.shift();
      }
      let rval = "";
      if (baseSegments.length > 0) {
        baseSegments.pop();
        for (let i = 0; i < baseSegments.length; ++i) {
          rval += "../";
        }
      }
      rval += iriSegments.join("/");
      if (rel.query !== null) {
        rval += "?" + rel.query;
      }
      if (rel.fragment !== null) {
        rval += "#" + rel.fragment;
      }
      if (rval === "") {
        rval = "./";
      }
      return rval;
    };
    api.removeDotSegments = (path) => {
      if (path.length === 0) {
        return "";
      }
      const input = path.split("/");
      const output = [];
      while (input.length > 0) {
        const next = input.shift();
        const done = input.length === 0;
        if (next === ".") {
          if (done) {
            output.push("");
          }
          continue;
        }
        if (next === "..") {
          output.pop();
          if (done) {
            output.push("");
          }
          continue;
        }
        output.push(next);
      }
      if (path[0] === "/" && output.length > 0 && output[0] !== "") {
        output.unshift("");
      }
      if (output.length === 1 && output[0] === "") {
        return "/";
      }
      return output.join("/");
    };
    var isAbsoluteRegex = /^([A-Za-z][A-Za-z0-9+-.]*|_):[^\s]*$/;
    api.isAbsolute = (v) => types.isString(v) && isAbsoluteRegex.test(v);
    api.isRelative = (v) => types.isString(v);
  }
});

// node_modules/jsonld/lib/documentLoaders/xhr.js
var require_xhr = __commonJS({
  "node_modules/jsonld/lib/documentLoaders/xhr.js"(exports, module) {
    "use strict";
    var { parseLinkHeader, buildHeaders } = require_util();
    var { LINK_HEADER_CONTEXT } = require_constants();
    var JsonLdError = require_JsonLdError();
    var RequestQueue = require_RequestQueue();
    var { prependBase } = require_url();
    var REGEX_LINK_HEADER = /(^|(\r\n))link:/i;
    module.exports = ({
      secure,
      headers = {},
      xhr
    } = { headers: {} }) => {
      headers = buildHeaders(headers);
      const queue = new RequestQueue();
      return queue.wrapLoader(loader);
      async function loader(url) {
        if (url.indexOf("http:") !== 0 && url.indexOf("https:") !== 0) {
          throw new JsonLdError(
            'URL could not be dereferenced; only "http" and "https" URLs are supported.',
            "jsonld.InvalidUrl",
            { code: "loading document failed", url }
          );
        }
        if (secure && url.indexOf("https") !== 0) {
          throw new JsonLdError(
            `URL could not be dereferenced; secure mode is enabled and the URL's scheme is not "https".`,
            "jsonld.InvalidUrl",
            { code: "loading document failed", url }
          );
        }
        let req;
        try {
          req = await _get(xhr, url, headers);
        } catch (e) {
          throw new JsonLdError(
            "URL could not be dereferenced, an error occurred.",
            "jsonld.LoadDocumentError",
            { code: "loading document failed", url, cause: e }
          );
        }
        if (req.status >= 400) {
          throw new JsonLdError(
            "URL could not be dereferenced: " + req.statusText,
            "jsonld.LoadDocumentError",
            {
              code: "loading document failed",
              url,
              httpStatusCode: req.status
            }
          );
        }
        let doc = { contextUrl: null, documentUrl: url, document: req.response };
        let alternate = null;
        const contentType = req.getResponseHeader("Content-Type");
        let linkHeader;
        if (REGEX_LINK_HEADER.test(req.getAllResponseHeaders())) {
          linkHeader = req.getResponseHeader("Link");
        }
        if (linkHeader && contentType !== "application/ld+json") {
          const linkHeaders = parseLinkHeader(linkHeader);
          const linkedContext = linkHeaders[LINK_HEADER_CONTEXT];
          if (Array.isArray(linkedContext)) {
            throw new JsonLdError(
              "URL could not be dereferenced, it has more than one associated HTTP Link Header.",
              "jsonld.InvalidUrl",
              { code: "multiple context link headers", url }
            );
          }
          if (linkedContext) {
            doc.contextUrl = linkedContext.target;
          }
          alternate = linkHeaders.alternate;
          if (alternate && alternate.type == "application/ld+json" && !(contentType || "").match(/^application\/(\w*\+)?json$/)) {
            doc = await loader(prependBase(url, alternate.target));
          }
        }
        return doc;
      }
    };
    function _get(xhr, url, headers) {
      xhr = xhr || XMLHttpRequest;
      const req = new xhr();
      return new Promise((resolve, reject) => {
        req.onload = () => resolve(req);
        req.onerror = (err) => reject(err);
        req.open("GET", url, true);
        for (const k in headers) {
          req.setRequestHeader(k, headers[k]);
        }
        req.send();
      });
    }
  }
});

// node_modules/jsonld/lib/platform-browser.js
var require_platform_browser = __commonJS({
  "node_modules/jsonld/lib/platform-browser.js"(exports, module) {
    "use strict";
    var xhrLoader = require_xhr();
    var api = {};
    module.exports = api;
    api.setupDocumentLoaders = function(jsonld2) {
      if (typeof XMLHttpRequest !== "undefined") {
        jsonld2.documentLoaders.xhr = xhrLoader;
        jsonld2.useDocumentLoader("xhr");
      }
    };
    api.setupGlobals = function(jsonld2) {
      if (typeof globalThis.JsonLdProcessor === "undefined") {
        Object.defineProperty(globalThis, "JsonLdProcessor", {
          writable: true,
          enumerable: false,
          configurable: true,
          value: jsonld2.JsonLdProcessor
        });
      }
    };
  }
});

// node_modules/yallist/iterator.js
var require_iterator = __commonJS({
  "node_modules/yallist/iterator.js"(exports, module) {
    "use strict";
    module.exports = function(Yallist) {
      Yallist.prototype[Symbol.iterator] = function* () {
        for (let walker = this.head; walker; walker = walker.next) {
          yield walker.value;
        }
      };
    };
  }
});

// node_modules/yallist/yallist.js
var require_yallist = __commonJS({
  "node_modules/yallist/yallist.js"(exports, module) {
    "use strict";
    module.exports = Yallist;
    Yallist.Node = Node;
    Yallist.create = Yallist;
    function Yallist(list) {
      var self2 = this;
      if (!(self2 instanceof Yallist)) {
        self2 = new Yallist();
      }
      self2.tail = null;
      self2.head = null;
      self2.length = 0;
      if (list && typeof list.forEach === "function") {
        list.forEach(function(item) {
          self2.push(item);
        });
      } else if (arguments.length > 0) {
        for (var i = 0, l = arguments.length; i < l; i++) {
          self2.push(arguments[i]);
        }
      }
      return self2;
    }
    Yallist.prototype.removeNode = function(node) {
      if (node.list !== this) {
        throw new Error("removing node which does not belong to this list");
      }
      var next = node.next;
      var prev = node.prev;
      if (next) {
        next.prev = prev;
      }
      if (prev) {
        prev.next = next;
      }
      if (node === this.head) {
        this.head = next;
      }
      if (node === this.tail) {
        this.tail = prev;
      }
      node.list.length--;
      node.next = null;
      node.prev = null;
      node.list = null;
      return next;
    };
    Yallist.prototype.unshiftNode = function(node) {
      if (node === this.head) {
        return;
      }
      if (node.list) {
        node.list.removeNode(node);
      }
      var head = this.head;
      node.list = this;
      node.next = head;
      if (head) {
        head.prev = node;
      }
      this.head = node;
      if (!this.tail) {
        this.tail = node;
      }
      this.length++;
    };
    Yallist.prototype.pushNode = function(node) {
      if (node === this.tail) {
        return;
      }
      if (node.list) {
        node.list.removeNode(node);
      }
      var tail = this.tail;
      node.list = this;
      node.prev = tail;
      if (tail) {
        tail.next = node;
      }
      this.tail = node;
      if (!this.head) {
        this.head = node;
      }
      this.length++;
    };
    Yallist.prototype.push = function() {
      for (var i = 0, l = arguments.length; i < l; i++) {
        push(this, arguments[i]);
      }
      return this.length;
    };
    Yallist.prototype.unshift = function() {
      for (var i = 0, l = arguments.length; i < l; i++) {
        unshift(this, arguments[i]);
      }
      return this.length;
    };
    Yallist.prototype.pop = function() {
      if (!this.tail) {
        return void 0;
      }
      var res = this.tail.value;
      this.tail = this.tail.prev;
      if (this.tail) {
        this.tail.next = null;
      } else {
        this.head = null;
      }
      this.length--;
      return res;
    };
    Yallist.prototype.shift = function() {
      if (!this.head) {
        return void 0;
      }
      var res = this.head.value;
      this.head = this.head.next;
      if (this.head) {
        this.head.prev = null;
      } else {
        this.tail = null;
      }
      this.length--;
      return res;
    };
    Yallist.prototype.forEach = function(fn, thisp) {
      thisp = thisp || this;
      for (var walker = this.head, i = 0; walker !== null; i++) {
        fn.call(thisp, walker.value, i, this);
        walker = walker.next;
      }
    };
    Yallist.prototype.forEachReverse = function(fn, thisp) {
      thisp = thisp || this;
      for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
        fn.call(thisp, walker.value, i, this);
        walker = walker.prev;
      }
    };
    Yallist.prototype.get = function(n) {
      for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
        walker = walker.next;
      }
      if (i === n && walker !== null) {
        return walker.value;
      }
    };
    Yallist.prototype.getReverse = function(n) {
      for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
        walker = walker.prev;
      }
      if (i === n && walker !== null) {
        return walker.value;
      }
    };
    Yallist.prototype.map = function(fn, thisp) {
      thisp = thisp || this;
      var res = new Yallist();
      for (var walker = this.head; walker !== null; ) {
        res.push(fn.call(thisp, walker.value, this));
        walker = walker.next;
      }
      return res;
    };
    Yallist.prototype.mapReverse = function(fn, thisp) {
      thisp = thisp || this;
      var res = new Yallist();
      for (var walker = this.tail; walker !== null; ) {
        res.push(fn.call(thisp, walker.value, this));
        walker = walker.prev;
      }
      return res;
    };
    Yallist.prototype.reduce = function(fn, initial) {
      var acc;
      var walker = this.head;
      if (arguments.length > 1) {
        acc = initial;
      } else if (this.head) {
        walker = this.head.next;
        acc = this.head.value;
      } else {
        throw new TypeError("Reduce of empty list with no initial value");
      }
      for (var i = 0; walker !== null; i++) {
        acc = fn(acc, walker.value, i);
        walker = walker.next;
      }
      return acc;
    };
    Yallist.prototype.reduceReverse = function(fn, initial) {
      var acc;
      var walker = this.tail;
      if (arguments.length > 1) {
        acc = initial;
      } else if (this.tail) {
        walker = this.tail.prev;
        acc = this.tail.value;
      } else {
        throw new TypeError("Reduce of empty list with no initial value");
      }
      for (var i = this.length - 1; walker !== null; i--) {
        acc = fn(acc, walker.value, i);
        walker = walker.prev;
      }
      return acc;
    };
    Yallist.prototype.toArray = function() {
      var arr = new Array(this.length);
      for (var i = 0, walker = this.head; walker !== null; i++) {
        arr[i] = walker.value;
        walker = walker.next;
      }
      return arr;
    };
    Yallist.prototype.toArrayReverse = function() {
      var arr = new Array(this.length);
      for (var i = 0, walker = this.tail; walker !== null; i++) {
        arr[i] = walker.value;
        walker = walker.prev;
      }
      return arr;
    };
    Yallist.prototype.slice = function(from, to) {
      to = to || this.length;
      if (to < 0) {
        to += this.length;
      }
      from = from || 0;
      if (from < 0) {
        from += this.length;
      }
      var ret = new Yallist();
      if (to < from || to < 0) {
        return ret;
      }
      if (from < 0) {
        from = 0;
      }
      if (to > this.length) {
        to = this.length;
      }
      for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
        walker = walker.next;
      }
      for (; walker !== null && i < to; i++, walker = walker.next) {
        ret.push(walker.value);
      }
      return ret;
    };
    Yallist.prototype.sliceReverse = function(from, to) {
      to = to || this.length;
      if (to < 0) {
        to += this.length;
      }
      from = from || 0;
      if (from < 0) {
        from += this.length;
      }
      var ret = new Yallist();
      if (to < from || to < 0) {
        return ret;
      }
      if (from < 0) {
        from = 0;
      }
      if (to > this.length) {
        to = this.length;
      }
      for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
        walker = walker.prev;
      }
      for (; walker !== null && i > from; i--, walker = walker.prev) {
        ret.push(walker.value);
      }
      return ret;
    };
    Yallist.prototype.splice = function(start, deleteCount, ...nodes) {
      if (start > this.length) {
        start = this.length - 1;
      }
      if (start < 0) {
        start = this.length + start;
      }
      for (var i = 0, walker = this.head; walker !== null && i < start; i++) {
        walker = walker.next;
      }
      var ret = [];
      for (var i = 0; walker && i < deleteCount; i++) {
        ret.push(walker.value);
        walker = this.removeNode(walker);
      }
      if (walker === null) {
        walker = this.tail;
      }
      if (walker !== this.head && walker !== this.tail) {
        walker = walker.prev;
      }
      for (var i = 0; i < nodes.length; i++) {
        walker = insert(this, walker, nodes[i]);
      }
      return ret;
    };
    Yallist.prototype.reverse = function() {
      var head = this.head;
      var tail = this.tail;
      for (var walker = head; walker !== null; walker = walker.prev) {
        var p = walker.prev;
        walker.prev = walker.next;
        walker.next = p;
      }
      this.head = tail;
      this.tail = head;
      return this;
    };
    function insert(self2, node, value) {
      var inserted = node === self2.head ? new Node(value, null, node, self2) : new Node(value, node, node.next, self2);
      if (inserted.next === null) {
        self2.tail = inserted;
      }
      if (inserted.prev === null) {
        self2.head = inserted;
      }
      self2.length++;
      return inserted;
    }
    function push(self2, item) {
      self2.tail = new Node(item, self2.tail, null, self2);
      if (!self2.head) {
        self2.head = self2.tail;
      }
      self2.length++;
    }
    function unshift(self2, item) {
      self2.head = new Node(item, null, self2.head, self2);
      if (!self2.tail) {
        self2.tail = self2.head;
      }
      self2.length++;
    }
    function Node(value, prev, next, list) {
      if (!(this instanceof Node)) {
        return new Node(value, prev, next, list);
      }
      this.list = list;
      this.value = value;
      if (prev) {
        prev.next = this;
        this.prev = prev;
      } else {
        this.prev = null;
      }
      if (next) {
        next.prev = this;
        this.next = next;
      } else {
        this.next = null;
      }
    }
    try {
      require_iterator()(Yallist);
    } catch (er) {
    }
  }
});

// node_modules/lru-cache/index.js
var require_lru_cache = __commonJS({
  "node_modules/lru-cache/index.js"(exports, module) {
    "use strict";
    var Yallist = require_yallist();
    var MAX = Symbol("max");
    var LENGTH = Symbol("length");
    var LENGTH_CALCULATOR = Symbol("lengthCalculator");
    var ALLOW_STALE = Symbol("allowStale");
    var MAX_AGE = Symbol("maxAge");
    var DISPOSE = Symbol("dispose");
    var NO_DISPOSE_ON_SET = Symbol("noDisposeOnSet");
    var LRU_LIST = Symbol("lruList");
    var CACHE = Symbol("cache");
    var UPDATE_AGE_ON_GET = Symbol("updateAgeOnGet");
    var naiveLength = () => 1;
    var LRUCache = class {
      constructor(options) {
        if (typeof options === "number")
          options = { max: options };
        if (!options)
          options = {};
        if (options.max && (typeof options.max !== "number" || options.max < 0))
          throw new TypeError("max must be a non-negative number");
        const max2 = this[MAX] = options.max || Infinity;
        const lc = options.length || naiveLength;
        this[LENGTH_CALCULATOR] = typeof lc !== "function" ? naiveLength : lc;
        this[ALLOW_STALE] = options.stale || false;
        if (options.maxAge && typeof options.maxAge !== "number")
          throw new TypeError("maxAge must be a number");
        this[MAX_AGE] = options.maxAge || 0;
        this[DISPOSE] = options.dispose;
        this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false;
        this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false;
        this.reset();
      }
      // resize the cache when the max changes.
      set max(mL) {
        if (typeof mL !== "number" || mL < 0)
          throw new TypeError("max must be a non-negative number");
        this[MAX] = mL || Infinity;
        trim(this);
      }
      get max() {
        return this[MAX];
      }
      set allowStale(allowStale) {
        this[ALLOW_STALE] = !!allowStale;
      }
      get allowStale() {
        return this[ALLOW_STALE];
      }
      set maxAge(mA) {
        if (typeof mA !== "number")
          throw new TypeError("maxAge must be a non-negative number");
        this[MAX_AGE] = mA;
        trim(this);
      }
      get maxAge() {
        return this[MAX_AGE];
      }
      // resize the cache when the lengthCalculator changes.
      set lengthCalculator(lC) {
        if (typeof lC !== "function")
          lC = naiveLength;
        if (lC !== this[LENGTH_CALCULATOR]) {
          this[LENGTH_CALCULATOR] = lC;
          this[LENGTH] = 0;
          this[LRU_LIST].forEach((hit) => {
            hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key);
            this[LENGTH] += hit.length;
          });
        }
        trim(this);
      }
      get lengthCalculator() {
        return this[LENGTH_CALCULATOR];
      }
      get length() {
        return this[LENGTH];
      }
      get itemCount() {
        return this[LRU_LIST].length;
      }
      rforEach(fn, thisp) {
        thisp = thisp || this;
        for (let walker = this[LRU_LIST].tail; walker !== null; ) {
          const prev = walker.prev;
          forEachStep(this, fn, walker, thisp);
          walker = prev;
        }
      }
      forEach(fn, thisp) {
        thisp = thisp || this;
        for (let walker = this[LRU_LIST].head; walker !== null; ) {
          const next = walker.next;
          forEachStep(this, fn, walker, thisp);
          walker = next;
        }
      }
      keys() {
        return this[LRU_LIST].toArray().map((k) => k.key);
      }
      values() {
        return this[LRU_LIST].toArray().map((k) => k.value);
      }
      reset() {
        if (this[DISPOSE] && this[LRU_LIST] && this[LRU_LIST].length) {
          this[LRU_LIST].forEach((hit) => this[DISPOSE](hit.key, hit.value));
        }
        this[CACHE] = /* @__PURE__ */ new Map();
        this[LRU_LIST] = new Yallist();
        this[LENGTH] = 0;
      }
      dump() {
        return this[LRU_LIST].map((hit) => isStale(this, hit) ? false : {
          k: hit.key,
          v: hit.value,
          e: hit.now + (hit.maxAge || 0)
        }).toArray().filter((h) => h);
      }
      dumpLru() {
        return this[LRU_LIST];
      }
      set(key, value, maxAge) {
        maxAge = maxAge || this[MAX_AGE];
        if (maxAge && typeof maxAge !== "number")
          throw new TypeError("maxAge must be a number");
        const now = maxAge ? Date.now() : 0;
        const len = this[LENGTH_CALCULATOR](value, key);
        if (this[CACHE].has(key)) {
          if (len > this[MAX]) {
            del(this, this[CACHE].get(key));
            return false;
          }
          const node = this[CACHE].get(key);
          const item = node.value;
          if (this[DISPOSE]) {
            if (!this[NO_DISPOSE_ON_SET])
              this[DISPOSE](key, item.value);
          }
          item.now = now;
          item.maxAge = maxAge;
          item.value = value;
          this[LENGTH] += len - item.length;
          item.length = len;
          this.get(key);
          trim(this);
          return true;
        }
        const hit = new Entry(key, value, len, now, maxAge);
        if (hit.length > this[MAX]) {
          if (this[DISPOSE])
            this[DISPOSE](key, value);
          return false;
        }
        this[LENGTH] += hit.length;
        this[LRU_LIST].unshift(hit);
        this[CACHE].set(key, this[LRU_LIST].head);
        trim(this);
        return true;
      }
      has(key) {
        if (!this[CACHE].has(key))
          return false;
        const hit = this[CACHE].get(key).value;
        return !isStale(this, hit);
      }
      get(key) {
        return get(this, key, true);
      }
      peek(key) {
        return get(this, key, false);
      }
      pop() {
        const node = this[LRU_LIST].tail;
        if (!node)
          return null;
        del(this, node);
        return node.value;
      }
      del(key) {
        del(this, this[CACHE].get(key));
      }
      load(arr) {
        this.reset();
        const now = Date.now();
        for (let l = arr.length - 1; l >= 0; l--) {
          const hit = arr[l];
          const expiresAt = hit.e || 0;
          if (expiresAt === 0)
            this.set(hit.k, hit.v);
          else {
            const maxAge = expiresAt - now;
            if (maxAge > 0) {
              this.set(hit.k, hit.v, maxAge);
            }
          }
        }
      }
      prune() {
        this[CACHE].forEach((value, key) => get(this, key, false));
      }
    };
    var get = (self2, key, doUse) => {
      const node = self2[CACHE].get(key);
      if (node) {
        const hit = node.value;
        if (isStale(self2, hit)) {
          del(self2, node);
          if (!self2[ALLOW_STALE])
            return void 0;
        } else {
          if (doUse) {
            if (self2[UPDATE_AGE_ON_GET])
              node.value.now = Date.now();
            self2[LRU_LIST].unshiftNode(node);
          }
        }
        return hit.value;
      }
    };
    var isStale = (self2, hit) => {
      if (!hit || !hit.maxAge && !self2[MAX_AGE])
        return false;
      const diff = Date.now() - hit.now;
      return hit.maxAge ? diff > hit.maxAge : self2[MAX_AGE] && diff > self2[MAX_AGE];
    };
    var trim = (self2) => {
      if (self2[LENGTH] > self2[MAX]) {
        for (let walker = self2[LRU_LIST].tail; self2[LENGTH] > self2[MAX] && walker !== null; ) {
          const prev = walker.prev;
          del(self2, walker);
          walker = prev;
        }
      }
    };
    var del = (self2, node) => {
      if (node) {
        const hit = node.value;
        if (self2[DISPOSE])
          self2[DISPOSE](hit.key, hit.value);
        self2[LENGTH] -= hit.length;
        self2[CACHE].delete(hit.key);
        self2[LRU_LIST].removeNode(node);
      }
    };
    var Entry = class {
      constructor(key, value, length, now, maxAge) {
        this.key = key;
        this.value = value;
        this.length = length;
        this.now = now;
        this.maxAge = maxAge || 0;
      }
    };
    var forEachStep = (self2, fn, node, thisp) => {
      let hit = node.value;
      if (isStale(self2, hit)) {
        del(self2, node);
        if (!self2[ALLOW_STALE])
          hit = void 0;
      }
      if (hit)
        fn.call(thisp, hit.value, hit.key, self2);
    };
    module.exports = LRUCache;
  }
});

// node_modules/jsonld/lib/ResolvedContext.js
var require_ResolvedContext = __commonJS({
  "node_modules/jsonld/lib/ResolvedContext.js"(exports, module) {
    "use strict";
    var LRU = require_lru_cache();
    var MAX_ACTIVE_CONTEXTS = 10;
    module.exports = class ResolvedContext {
      /**
       * Creates a ResolvedContext.
       *
       * @param document the context document.
       */
      constructor({ document }) {
        this.document = document;
        this.cache = new LRU({ max: MAX_ACTIVE_CONTEXTS });
      }
      getProcessed(activeCtx) {
        return this.cache.get(activeCtx);
      }
      setProcessed(activeCtx, processedCtx) {
        this.cache.set(activeCtx, processedCtx);
      }
    };
  }
});

// node_modules/jsonld/lib/ContextResolver.js
var require_ContextResolver = __commonJS({
  "node_modules/jsonld/lib/ContextResolver.js"(exports, module) {
    "use strict";
    var {
      isArray: _isArray,
      isObject: _isObject,
      isString: _isString
    } = require_types();
    var {
      asArray: _asArray
    } = require_util();
    var { prependBase } = require_url();
    var JsonLdError = require_JsonLdError();
    var ResolvedContext = require_ResolvedContext();
    var MAX_CONTEXT_URLS = 10;
    module.exports = class ContextResolver {
      /**
       * Creates a ContextResolver.
       *
       * @param sharedCache a shared LRU cache with `get` and `set` APIs.
       */
      constructor({ sharedCache }) {
        this.perOpCache = /* @__PURE__ */ new Map();
        this.sharedCache = sharedCache;
      }
      async resolve({
        activeCtx,
        context,
        documentLoader,
        base,
        cycles = /* @__PURE__ */ new Set()
      }) {
        if (context && _isObject(context) && context["@context"]) {
          context = context["@context"];
        }
        context = _asArray(context);
        const allResolved = [];
        for (const ctx of context) {
          if (_isString(ctx)) {
            let resolved2 = this._get(ctx);
            if (!resolved2) {
              resolved2 = await this._resolveRemoteContext(
                { activeCtx, url: ctx, documentLoader, base, cycles }
              );
            }
            if (_isArray(resolved2)) {
              allResolved.push(...resolved2);
            } else {
              allResolved.push(resolved2);
            }
            continue;
          }
          if (ctx === null) {
            allResolved.push(new ResolvedContext({ document: null }));
            continue;
          }
          if (!_isObject(ctx)) {
            _throwInvalidLocalContext(context);
          }
          const key = JSON.stringify(ctx);
          let resolved = this._get(key);
          if (!resolved) {
            resolved = new ResolvedContext({ document: ctx });
            this._cacheResolvedContext({ key, resolved, tag: "static" });
          }
          allResolved.push(resolved);
        }
        return allResolved;
      }
      _get(key) {
        let resolved = this.perOpCache.get(key);
        if (!resolved) {
          const tagMap = this.sharedCache.get(key);
          if (tagMap) {
            resolved = tagMap.get("static");
            if (resolved) {
              this.perOpCache.set(key, resolved);
            }
          }
        }
        return resolved;
      }
      _cacheResolvedContext({ key, resolved, tag: tag2 }) {
        this.perOpCache.set(key, resolved);
        if (tag2 !== void 0) {
          let tagMap = this.sharedCache.get(key);
          if (!tagMap) {
            tagMap = /* @__PURE__ */ new Map();
            this.sharedCache.set(key, tagMap);
          }
          tagMap.set(tag2, resolved);
        }
        return resolved;
      }
      async _resolveRemoteContext({ activeCtx, url, documentLoader, base, cycles }) {
        url = prependBase(base, url);
        const { context, remoteDoc } = await this._fetchContext(
          { activeCtx, url, documentLoader, cycles }
        );
        base = remoteDoc.documentUrl || url;
        _resolveContextUrls({ context, base });
        const resolved = await this.resolve(
          { activeCtx, context, documentLoader, base, cycles }
        );
        this._cacheResolvedContext({ key: url, resolved, tag: remoteDoc.tag });
        return resolved;
      }
      async _fetchContext({ activeCtx, url, documentLoader, cycles }) {
        if (cycles.size > MAX_CONTEXT_URLS) {
          throw new JsonLdError(
            "Maximum number of @context URLs exceeded.",
            "jsonld.ContextUrlError",
            {
              code: activeCtx.processingMode === "json-ld-1.0" ? "loading remote context failed" : "context overflow",
              max: MAX_CONTEXT_URLS
            }
          );
        }
        if (cycles.has(url)) {
          throw new JsonLdError(
            "Cyclical @context URLs detected.",
            "jsonld.ContextUrlError",
            {
              code: activeCtx.processingMode === "json-ld-1.0" ? "recursive context inclusion" : "context overflow",
              url
            }
          );
        }
        cycles.add(url);
        let context;
        let remoteDoc;
        try {
          remoteDoc = await documentLoader(url);
          context = remoteDoc.document || null;
          if (_isString(context)) {
            context = JSON.parse(context);
          }
        } catch (e) {
          throw new JsonLdError(
            "Dereferencing a URL did not result in a valid JSON-LD object. Possible causes are an inaccessible URL perhaps due to a same-origin policy (ensure the server uses CORS if you are using client-side JavaScript), too many redirects, a non-JSON response, or more than one HTTP Link Header was provided for a remote context.",
            "jsonld.InvalidUrl",
            { code: "loading remote context failed", url, cause: e }
          );
        }
        if (!_isObject(context)) {
          throw new JsonLdError(
            "Dereferencing a URL did not result in a JSON object. The response was valid JSON, but it was not a JSON object.",
            "jsonld.InvalidUrl",
            { code: "invalid remote context", url }
          );
        }
        if (!("@context" in context)) {
          context = { "@context": {} };
        } else {
          context = { "@context": context["@context"] };
        }
        if (remoteDoc.contextUrl) {
          if (!_isArray(context["@context"])) {
            context["@context"] = [context["@context"]];
          }
          context["@context"].push(remoteDoc.contextUrl);
        }
        return { context, remoteDoc };
      }
    };
    function _throwInvalidLocalContext(ctx) {
      throw new JsonLdError(
        "Invalid JSON-LD syntax; @context must be an object.",
        "jsonld.SyntaxError",
        {
          code: "invalid local context",
          context: ctx
        }
      );
    }
    function _resolveContextUrls({ context, base }) {
      if (!context) {
        return;
      }
      const ctx = context["@context"];
      if (_isString(ctx)) {
        context["@context"] = prependBase(base, ctx);
        return;
      }
      if (_isArray(ctx)) {
        for (let i = 0; i < ctx.length; ++i) {
          const element = ctx[i];
          if (_isString(element)) {
            ctx[i] = prependBase(base, element);
            continue;
          }
          if (_isObject(element)) {
            _resolveContextUrls({ context: { "@context": element }, base });
          }
        }
        return;
      }
      if (!_isObject(ctx)) {
        return;
      }
      for (const term in ctx) {
        _resolveContextUrls({ context: ctx[term], base });
      }
    }
  }
});

// node_modules/jsonld/lib/NQuads.js
var require_NQuads2 = __commonJS({
  "node_modules/jsonld/lib/NQuads.js"(exports, module) {
    "use strict";
    module.exports = require_rdf_canonize().NQuads;
  }
});

// node_modules/jsonld/lib/events.js
var require_events = __commonJS({
  "node_modules/jsonld/lib/events.js"(exports, module) {
    "use strict";
    var JsonLdError = require_JsonLdError();
    var {
      isArray: _isArray
    } = require_types();
    var {
      asArray: _asArray
    } = require_util();
    var api = {};
    module.exports = api;
    api.defaultEventHandler = null;
    api.setupEventHandler = ({ options = {} }) => {
      const eventHandler = [].concat(
        options.safe ? api.safeEventHandler : [],
        options.eventHandler ? _asArray(options.eventHandler) : [],
        api.defaultEventHandler ? api.defaultEventHandler : []
      );
      return eventHandler.length === 0 ? null : eventHandler;
    };
    api.handleEvent = ({
      event,
      options
    }) => {
      _handle({ event, handlers: options.eventHandler });
    };
    function _handle({ event, handlers }) {
      let doNext = true;
      for (let i = 0; doNext && i < handlers.length; ++i) {
        doNext = false;
        const handler = handlers[i];
        if (_isArray(handler)) {
          doNext = _handle({ event, handlers: handler });
        } else if (typeof handler === "function") {
          handler({ event, next: () => {
            doNext = true;
          } });
        } else if (typeof handler === "object") {
          if (event.code in handler) {
            handler[event.code]({ event, next: () => {
              doNext = true;
            } });
          } else {
            doNext = true;
          }
        } else {
          throw new JsonLdError(
            "Invalid event handler.",
            "jsonld.InvalidEventHandler",
            { event }
          );
        }
      }
      return doNext;
    }
    var _notSafeEventCodes = /* @__PURE__ */ new Set([
      "empty object",
      "free-floating scalar",
      "invalid @language value",
      "invalid property",
      // NOTE: spec edge case
      "null @id value",
      "null @value value",
      "object with only @id",
      "object with only @language",
      "object with only @list",
      "object with only @value",
      "relative @id reference",
      "relative @type reference",
      "relative @vocab reference",
      "reserved @id value",
      "reserved @reverse value",
      "reserved term",
      // toRDF
      "blank node predicate",
      "relative graph reference",
      "relative object reference",
      "relative predicate reference",
      "relative subject reference",
      // toRDF / fromRDF
      "rdfDirection not set"
    ]);
    api.safeEventHandler = function safeEventHandler({ event, next }) {
      if (event.level === "warning" && _notSafeEventCodes.has(event.code)) {
        throw new JsonLdError(
          "Safe mode validation error.",
          "jsonld.ValidationError",
          { event }
        );
      }
      next();
    };
    api.logEventHandler = function logEventHandler({ event, next }) {
      console.log(`EVENT: ${event.message}`, { event });
      next();
    };
    api.logWarningEventHandler = function logWarningEventHandler({ event, next }) {
      if (event.level === "warning") {
        console.warn(`WARNING: ${event.message}`, { event });
      }
      next();
    };
    api.unhandledEventHandler = function unhandledEventHandler({ event }) {
      throw new JsonLdError(
        "No handler for event.",
        "jsonld.UnhandledEvent",
        { event }
      );
    };
    api.setDefaultEventHandler = function({ eventHandler } = {}) {
      api.defaultEventHandler = eventHandler ? _asArray(eventHandler) : null;
    };
  }
});

// node_modules/jsonld/lib/context.js
var require_context = __commonJS({
  "node_modules/jsonld/lib/context.js"(exports, module) {
    "use strict";
    var util = require_util();
    var JsonLdError = require_JsonLdError();
    var {
      isArray: _isArray,
      isObject: _isObject,
      isString: _isString,
      isUndefined: _isUndefined
    } = require_types();
    var {
      isAbsolute: _isAbsoluteIri,
      isRelative: _isRelativeIri,
      prependBase
    } = require_url();
    var {
      handleEvent: _handleEvent
    } = require_events();
    var {
      REGEX_BCP47,
      REGEX_KEYWORD,
      asArray: _asArray,
      compareShortestLeast: _compareShortestLeast
    } = require_util();
    var INITIAL_CONTEXT_CACHE = /* @__PURE__ */ new Map();
    var INITIAL_CONTEXT_CACHE_MAX_SIZE = 1e4;
    var api = {};
    module.exports = api;
    api.process = async ({
      activeCtx,
      localCtx,
      options,
      propagate = true,
      overrideProtected = false,
      cycles = /* @__PURE__ */ new Set()
    }) => {
      if (_isObject(localCtx) && "@context" in localCtx && _isArray(localCtx["@context"])) {
        localCtx = localCtx["@context"];
      }
      const ctxs = _asArray(localCtx);
      if (ctxs.length === 0) {
        return activeCtx;
      }
      const events = [];
      const eventCaptureHandler = [
        ({ event, next }) => {
          events.push(event);
          next();
        }
      ];
      if (options.eventHandler) {
        eventCaptureHandler.push(options.eventHandler);
      }
      const originalOptions = options;
      options = { ...options, eventHandler: eventCaptureHandler };
      const resolved = await options.contextResolver.resolve({
        activeCtx,
        context: localCtx,
        documentLoader: options.documentLoader,
        base: options.base
      });
      if (_isObject(resolved[0].document) && typeof resolved[0].document["@propagate"] === "boolean") {
        propagate = resolved[0].document["@propagate"];
      }
      let rval = activeCtx;
      if (!propagate && !rval.previousContext) {
        rval = rval.clone();
        rval.previousContext = activeCtx;
      }
      for (const resolvedContext of resolved) {
        let { document: ctx } = resolvedContext;
        activeCtx = rval;
        if (ctx === null) {
          if (!overrideProtected && Object.keys(activeCtx.protected).length !== 0) {
            throw new JsonLdError(
              "Tried to nullify a context with protected terms outside of a term definition.",
              "jsonld.SyntaxError",
              { code: "invalid context nullification" }
            );
          }
          rval = activeCtx = api.getInitialContext(options).clone();
          continue;
        }
        const processed = resolvedContext.getProcessed(activeCtx);
        if (processed) {
          if (originalOptions.eventHandler) {
            for (const event of processed.events) {
              _handleEvent({ event, options: originalOptions });
            }
          }
          rval = activeCtx = processed.context;
          continue;
        }
        if (_isObject(ctx) && "@context" in ctx) {
          ctx = ctx["@context"];
        }
        if (!_isObject(ctx)) {
          throw new JsonLdError(
            "Invalid JSON-LD syntax; @context must be an object.",
            "jsonld.SyntaxError",
            { code: "invalid local context", context: ctx }
          );
        }
        rval = rval.clone();
        const defined = /* @__PURE__ */ new Map();
        if ("@version" in ctx) {
          if (ctx["@version"] !== 1.1) {
            throw new JsonLdError(
              "Unsupported JSON-LD version: " + ctx["@version"],
              "jsonld.UnsupportedVersion",
              { code: "invalid @version value", context: ctx }
            );
          }
          if (activeCtx.processingMode && activeCtx.processingMode === "json-ld-1.0") {
            throw new JsonLdError(
              "@version: " + ctx["@version"] + " not compatible with " + activeCtx.processingMode,
              "jsonld.ProcessingModeConflict",
              { code: "processing mode conflict", context: ctx }
            );
          }
          rval.processingMode = "json-ld-1.1";
          rval["@version"] = ctx["@version"];
          defined.set("@version", true);
        }
        rval.processingMode = rval.processingMode || activeCtx.processingMode;
        if ("@base" in ctx) {
          let base = ctx["@base"];
          if (base === null || _isAbsoluteIri(base)) {
          } else if (_isRelativeIri(base)) {
            base = prependBase(rval["@base"], base);
          } else {
            throw new JsonLdError(
              'Invalid JSON-LD syntax; the value of "@base" in a @context must be an absolute IRI, a relative IRI, or null.',
              "jsonld.SyntaxError",
              { code: "invalid base IRI", context: ctx }
            );
          }
          rval["@base"] = base;
          defined.set("@base", true);
        }
        if ("@vocab" in ctx) {
          const value = ctx["@vocab"];
          if (value === null) {
            delete rval["@vocab"];
          } else if (!_isString(value)) {
            throw new JsonLdError(
              'Invalid JSON-LD syntax; the value of "@vocab" in a @context must be a string or null.',
              "jsonld.SyntaxError",
              { code: "invalid vocab mapping", context: ctx }
            );
          } else if (!_isAbsoluteIri(value) && api.processingMode(rval, 1)) {
            throw new JsonLdError(
              'Invalid JSON-LD syntax; the value of "@vocab" in a @context must be an absolute IRI.',
              "jsonld.SyntaxError",
              { code: "invalid vocab mapping", context: ctx }
            );
          } else {
            const vocab = _expandIri(
              rval,
              value,
              { vocab: true, base: true },
              void 0,
              void 0,
              options
            );
            if (!_isAbsoluteIri(vocab)) {
              if (options.eventHandler) {
                _handleEvent({
                  event: {
                    type: ["JsonLdEvent"],
                    code: "relative @vocab reference",
                    level: "warning",
                    message: "Relative @vocab reference found.",
                    details: {
                      vocab
                    }
                  },
                  options
                });
              }
            }
            rval["@vocab"] = vocab;
          }
          defined.set("@vocab", true);
        }
        if ("@language" in ctx) {
          const value = ctx["@language"];
          if (value === null) {
            delete rval["@language"];
          } else if (!_isString(value)) {
            throw new JsonLdError(
              'Invalid JSON-LD syntax; the value of "@language" in a @context must be a string or null.',
              "jsonld.SyntaxError",
              { code: "invalid default language", context: ctx }
            );
          } else {
            if (!value.match(REGEX_BCP47)) {
              if (options.eventHandler) {
                _handleEvent({
                  event: {
                    type: ["JsonLdEvent"],
                    code: "invalid @language value",
                    level: "warning",
                    message: "@language value must be valid BCP47.",
                    details: {
                      language: value
                    }
                  },
                  options
                });
              }
            }
            rval["@language"] = value.toLowerCase();
          }
          defined.set("@language", true);
        }
        if ("@direction" in ctx) {
          const value = ctx["@direction"];
          if (activeCtx.processingMode === "json-ld-1.0") {
            throw new JsonLdError(
              "Invalid JSON-LD syntax; @direction not compatible with " + activeCtx.processingMode,
              "jsonld.SyntaxError",
              { code: "invalid context member", context: ctx }
            );
          }
          if (value === null) {
            delete rval["@direction"];
          } else if (value !== "ltr" && value !== "rtl") {
            throw new JsonLdError(
              'Invalid JSON-LD syntax; the value of "@direction" in a @context must be null, "ltr", or "rtl".',
              "jsonld.SyntaxError",
              { code: "invalid base direction", context: ctx }
            );
          } else {
            rval["@direction"] = value;
          }
          defined.set("@direction", true);
        }
        if ("@propagate" in ctx) {
          const value = ctx["@propagate"];
          if (activeCtx.processingMode === "json-ld-1.0") {
            throw new JsonLdError(
              "Invalid JSON-LD syntax; @propagate not compatible with " + activeCtx.processingMode,
              "jsonld.SyntaxError",
              { code: "invalid context entry", context: ctx }
            );
          }
          if (typeof value !== "boolean") {
            throw new JsonLdError(
              "Invalid JSON-LD syntax; @propagate value must be a boolean.",
              "jsonld.SyntaxError",
              { code: "invalid @propagate value", context: localCtx }
            );
          }
          defined.set("@propagate", true);
        }
        if ("@import" in ctx) {
          const value = ctx["@import"];
          if (activeCtx.processingMode === "json-ld-1.0") {
            throw new JsonLdError(
              "Invalid JSON-LD syntax; @import not compatible with " + activeCtx.processingMode,
              "jsonld.SyntaxError",
              { code: "invalid context entry", context: ctx }
            );
          }
          if (!_isString(value)) {
            throw new JsonLdError(
              "Invalid JSON-LD syntax; @import must be a string.",
              "jsonld.SyntaxError",
              { code: "invalid @import value", context: localCtx }
            );
          }
          const resolvedImport = await options.contextResolver.resolve({
            activeCtx,
            context: value,
            documentLoader: options.documentLoader,
            base: options.base
          });
          if (resolvedImport.length !== 1) {
            throw new JsonLdError(
              "Invalid JSON-LD syntax; @import must reference a single context.",
              "jsonld.SyntaxError",
              { code: "invalid remote context", context: localCtx }
            );
          }
          const processedImport = resolvedImport[0].getProcessed(activeCtx);
          if (processedImport) {
            ctx = processedImport;
          } else {
            const importCtx = resolvedImport[0].document;
            if ("@import" in importCtx) {
              throw new JsonLdError(
                "Invalid JSON-LD syntax: imported context must not include @import.",
                "jsonld.SyntaxError",
                { code: "invalid context entry", context: localCtx }
              );
            }
            for (const key in importCtx) {
              if (!ctx.hasOwnProperty(key)) {
                ctx[key] = importCtx[key];
              }
            }
            resolvedImport[0].setProcessed(activeCtx, ctx);
          }
          defined.set("@import", true);
        }
        defined.set("@protected", ctx["@protected"] || false);
        for (const key in ctx) {
          api.createTermDefinition({
            activeCtx: rval,
            localCtx: ctx,
            term: key,
            defined,
            options,
            overrideProtected
          });
          if (_isObject(ctx[key]) && "@context" in ctx[key]) {
            const keyCtx = ctx[key]["@context"];
            let process2 = true;
            if (_isString(keyCtx)) {
              const url = prependBase(options.base, keyCtx);
              if (cycles.has(url)) {
                process2 = false;
              } else {
                cycles.add(url);
              }
            }
            if (process2) {
              try {
                await api.process({
                  activeCtx: rval.clone(),
                  localCtx: ctx[key]["@context"],
                  overrideProtected: true,
                  options,
                  cycles
                });
              } catch (e) {
                throw new JsonLdError(
                  "Invalid JSON-LD syntax; invalid scoped context.",
                  "jsonld.SyntaxError",
                  {
                    code: "invalid scoped context",
                    context: ctx[key]["@context"],
                    term: key
                  }
                );
              }
            }
          }
        }
        resolvedContext.setProcessed(activeCtx, {
          context: rval,
          events
        });
      }
      return rval;
    };
    api.createTermDefinition = ({
      activeCtx,
      localCtx,
      term,
      defined,
      options,
      overrideProtected = false
    }) => {
      if (defined.has(term)) {
        if (defined.get(term)) {
          return;
        }
        throw new JsonLdError(
          "Cyclical context definition detected.",
          "jsonld.CyclicalContext",
          { code: "cyclic IRI mapping", context: localCtx, term }
        );
      }
      defined.set(term, false);
      let value;
      if (localCtx.hasOwnProperty(term)) {
        value = localCtx[term];
      }
      if (term === "@type" && _isObject(value) && (value["@container"] || "@set") === "@set" && api.processingMode(activeCtx, 1.1)) {
        const validKeys2 = ["@container", "@id", "@protected"];
        const keys = Object.keys(value);
        if (keys.length === 0 || keys.some((k) => !validKeys2.includes(k))) {
          throw new JsonLdError(
            "Invalid JSON-LD syntax; keywords cannot be overridden.",
            "jsonld.SyntaxError",
            { code: "keyword redefinition", context: localCtx, term }
          );
        }
      } else if (api.isKeyword(term)) {
        throw new JsonLdError(
          "Invalid JSON-LD syntax; keywords cannot be overridden.",
          "jsonld.SyntaxError",
          { code: "keyword redefinition", context: localCtx, term }
        );
      } else if (term.match(REGEX_KEYWORD)) {
        if (options.eventHandler) {
          _handleEvent({
            event: {
              type: ["JsonLdEvent"],
              code: "reserved term",
              level: "warning",
              message: 'Terms beginning with "@" are reserved for future use and dropped.',
              details: {
                term
              }
            },
            options
          });
        }
        return;
      } else if (term === "") {
        throw new JsonLdError(
          "Invalid JSON-LD syntax; a term cannot be an empty string.",
          "jsonld.SyntaxError",
          { code: "invalid term definition", context: localCtx }
        );
      }
      const previousMapping = activeCtx.mappings.get(term);
      if (activeCtx.mappings.has(term)) {
        activeCtx.mappings.delete(term);
      }
      let simpleTerm = false;
      if (_isString(value) || value === null) {
        simpleTerm = true;
        value = { "@id": value };
      }
      if (!_isObject(value)) {
        throw new JsonLdError(
          "Invalid JSON-LD syntax; @context term values must be strings or objects.",
          "jsonld.SyntaxError",
          { code: "invalid term definition", context: localCtx }
        );
      }
      const mapping = {};
      activeCtx.mappings.set(term, mapping);
      mapping.reverse = false;
      const validKeys = ["@container", "@id", "@language", "@reverse", "@type"];
      if (api.processingMode(activeCtx, 1.1)) {
        validKeys.push(
          "@context",
          "@direction",
          "@index",
          "@nest",
          "@prefix",
          "@protected"
        );
      }
      for (const kw in value) {
        if (!validKeys.includes(kw)) {
          throw new JsonLdError(
            "Invalid JSON-LD syntax; a term definition must not contain " + kw,
            "jsonld.SyntaxError",
            { code: "invalid term definition", context: localCtx }
          );
        }
      }
      const colon = term.indexOf(":");
      mapping._termHasColon = colon > 0;
      if ("@reverse" in value) {
        if ("@id" in value) {
          throw new JsonLdError(
            "Invalid JSON-LD syntax; a @reverse term definition must not contain @id.",
            "jsonld.SyntaxError",
            { code: "invalid reverse property", context: localCtx }
          );
        }
        if ("@nest" in value) {
          throw new JsonLdError(
            "Invalid JSON-LD syntax; a @reverse term definition must not contain @nest.",
            "jsonld.SyntaxError",
            { code: "invalid reverse property", context: localCtx }
          );
        }
        const reverse = value["@reverse"];
        if (!_isString(reverse)) {
          throw new JsonLdError(
            "Invalid JSON-LD syntax; a @context @reverse value must be a string.",
            "jsonld.SyntaxError",
            { code: "invalid IRI mapping", context: localCtx }
          );
        }
        if (reverse.match(REGEX_KEYWORD)) {
          if (options.eventHandler) {
            _handleEvent({
              event: {
                type: ["JsonLdEvent"],
                code: "reserved @reverse value",
                level: "warning",
                message: '@reverse values beginning with "@" are reserved for future use and dropped.',
                details: {
                  reverse
                }
              },
              options
            });
          }
          if (previousMapping) {
            activeCtx.mappings.set(term, previousMapping);
          } else {
            activeCtx.mappings.delete(term);
          }
          return;
        }
        const id2 = _expandIri(
          activeCtx,
          reverse,
          { vocab: true, base: false },
          localCtx,
          defined,
          options
        );
        if (!_isAbsoluteIri(id2)) {
          throw new JsonLdError(
            "Invalid JSON-LD syntax; a @context @reverse value must be an absolute IRI or a blank node identifier.",
            "jsonld.SyntaxError",
            { code: "invalid IRI mapping", context: localCtx }
          );
        }
        mapping["@id"] = id2;
        mapping.reverse = true;
      } else if ("@id" in value) {
        let id2 = value["@id"];
        if (id2 && !_isString(id2)) {
          throw new JsonLdError(
            "Invalid JSON-LD syntax; a @context @id value must be an array of strings or a string.",
            "jsonld.SyntaxError",
            { code: "invalid IRI mapping", context: localCtx }
          );
        }
        if (id2 === null) {
          mapping["@id"] = null;
        } else if (!api.isKeyword(id2) && id2.match(REGEX_KEYWORD)) {
          if (options.eventHandler) {
            _handleEvent({
              event: {
                type: ["JsonLdEvent"],
                code: "reserved @id value",
                level: "warning",
                message: '@id values beginning with "@" are reserved for future use and dropped.',
                details: {
                  id: id2
                }
              },
              options
            });
          }
          if (previousMapping) {
            activeCtx.mappings.set(term, previousMapping);
          } else {
            activeCtx.mappings.delete(term);
          }
          return;
        } else if (id2 !== term) {
          id2 = _expandIri(
            activeCtx,
            id2,
            { vocab: true, base: false },
            localCtx,
            defined,
            options
          );
          if (!_isAbsoluteIri(id2) && !api.isKeyword(id2)) {
            throw new JsonLdError(
              "Invalid JSON-LD syntax; a @context @id value must be an absolute IRI, a blank node identifier, or a keyword.",
              "jsonld.SyntaxError",
              { code: "invalid IRI mapping", context: localCtx }
            );
          }
          if (term.match(/(?::[^:])|\//)) {
            const termDefined = new Map(defined).set(term, true);
            const termIri = _expandIri(
              activeCtx,
              term,
              { vocab: true, base: false },
              localCtx,
              termDefined,
              options
            );
            if (termIri !== id2) {
              throw new JsonLdError(
                "Invalid JSON-LD syntax; term in form of IRI must expand to definition.",
                "jsonld.SyntaxError",
                { code: "invalid IRI mapping", context: localCtx }
              );
            }
          }
          mapping["@id"] = id2;
          mapping._prefix = simpleTerm && !mapping._termHasColon && id2.match(/[:\/\?#\[\]@]$/) !== null;
        }
      }
      if (!("@id" in mapping)) {
        if (mapping._termHasColon) {
          const prefix = term.substr(0, colon);
          if (localCtx.hasOwnProperty(prefix)) {
            api.createTermDefinition({
              activeCtx,
              localCtx,
              term: prefix,
              defined,
              options
            });
          }
          if (activeCtx.mappings.has(prefix)) {
            const suffix = term.substr(colon + 1);
            mapping["@id"] = activeCtx.mappings.get(prefix)["@id"] + suffix;
          } else {
            mapping["@id"] = term;
          }
        } else if (term === "@type") {
          mapping["@id"] = term;
        } else {
          if (!("@vocab" in activeCtx)) {
            throw new JsonLdError(
              "Invalid JSON-LD syntax; @context terms must define an @id.",
              "jsonld.SyntaxError",
              { code: "invalid IRI mapping", context: localCtx, term }
            );
          }
          mapping["@id"] = activeCtx["@vocab"] + term;
        }
      }
      if (value["@protected"] === true || defined.get("@protected") === true && value["@protected"] !== false) {
        activeCtx.protected[term] = true;
        mapping.protected = true;
      }
      defined.set(term, true);
      if ("@type" in value) {
        let type = value["@type"];
        if (!_isString(type)) {
          throw new JsonLdError(
            "Invalid JSON-LD syntax; an @context @type value must be a string.",
            "jsonld.SyntaxError",
            { code: "invalid type mapping", context: localCtx }
          );
        }
        if (type === "@json" || type === "@none") {
          if (api.processingMode(activeCtx, 1)) {
            throw new JsonLdError(
              `Invalid JSON-LD syntax; an @context @type value must not be "${type}" in JSON-LD 1.0 mode.`,
              "jsonld.SyntaxError",
              { code: "invalid type mapping", context: localCtx }
            );
          }
        } else if (type !== "@id" && type !== "@vocab") {
          type = _expandIri(
            activeCtx,
            type,
            { vocab: true, base: false },
            localCtx,
            defined,
            options
          );
          if (!_isAbsoluteIri(type)) {
            throw new JsonLdError(
              "Invalid JSON-LD syntax; an @context @type value must be an absolute IRI.",
              "jsonld.SyntaxError",
              { code: "invalid type mapping", context: localCtx }
            );
          }
          if (type.indexOf("_:") === 0) {
            throw new JsonLdError(
              "Invalid JSON-LD syntax; an @context @type value must be an IRI, not a blank node identifier.",
              "jsonld.SyntaxError",
              { code: "invalid type mapping", context: localCtx }
            );
          }
        }
        mapping["@type"] = type;
      }
      if ("@container" in value) {
        const container = _isString(value["@container"]) ? [value["@container"]] : value["@container"] || [];
        const validContainers = ["@list", "@set", "@index", "@language"];
        let isValid = true;
        const hasSet = container.includes("@set");
        if (api.processingMode(activeCtx, 1.1)) {
          validContainers.push("@graph", "@id", "@type");
          if (container.includes("@list")) {
            if (container.length !== 1) {
              throw new JsonLdError(
                "Invalid JSON-LD syntax; @context @container with @list must have no other values",
                "jsonld.SyntaxError",
                { code: "invalid container mapping", context: localCtx }
              );
            }
          } else if (container.includes("@graph")) {
            if (container.some((key) => key !== "@graph" && key !== "@id" && key !== "@index" && key !== "@set")) {
              throw new JsonLdError(
                "Invalid JSON-LD syntax; @context @container with @graph must have no other values other than @id, @index, and @set",
                "jsonld.SyntaxError",
                { code: "invalid container mapping", context: localCtx }
              );
            }
          } else {
            isValid &= container.length <= (hasSet ? 2 : 1);
          }
          if (container.includes("@type")) {
            mapping["@type"] = mapping["@type"] || "@id";
            if (!["@id", "@vocab"].includes(mapping["@type"])) {
              throw new JsonLdError(
                "Invalid JSON-LD syntax; container: @type requires @type to be @id or @vocab.",
                "jsonld.SyntaxError",
                { code: "invalid type mapping", context: localCtx }
              );
            }
          }
        } else {
          isValid &= !_isArray(value["@container"]);
          isValid &= container.length <= 1;
        }
        isValid &= container.every((c) => validContainers.includes(c));
        isValid &= !(hasSet && container.includes("@list"));
        if (!isValid) {
          throw new JsonLdError(
            "Invalid JSON-LD syntax; @context @container value must be one of the following: " + validContainers.join(", "),
            "jsonld.SyntaxError",
            { code: "invalid container mapping", context: localCtx }
          );
        }
        if (mapping.reverse && !container.every((c) => ["@index", "@set"].includes(c))) {
          throw new JsonLdError(
            "Invalid JSON-LD syntax; @context @container value for a @reverse type definition must be @index or @set.",
            "jsonld.SyntaxError",
            { code: "invalid reverse property", context: localCtx }
          );
        }
        mapping["@container"] = container;
      }
      if ("@index" in value) {
        if (!("@container" in value) || !mapping["@container"].includes("@index")) {
          throw new JsonLdError(
            `Invalid JSON-LD syntax; @index without @index in @container: "${value["@index"]}" on term "${term}".`,
            "jsonld.SyntaxError",
            { code: "invalid term definition", context: localCtx }
          );
        }
        if (!_isString(value["@index"]) || value["@index"].indexOf("@") === 0) {
          throw new JsonLdError(
            `Invalid JSON-LD syntax; @index must expand to an IRI: "${value["@index"]}" on term "${term}".`,
            "jsonld.SyntaxError",
            { code: "invalid term definition", context: localCtx }
          );
        }
        mapping["@index"] = value["@index"];
      }
      if ("@context" in value) {
        mapping["@context"] = value["@context"];
      }
      if ("@language" in value && !("@type" in value)) {
        let language = value["@language"];
        if (language !== null && !_isString(language)) {
          throw new JsonLdError(
            "Invalid JSON-LD syntax; @context @language value must be a string or null.",
            "jsonld.SyntaxError",
            { code: "invalid language mapping", context: localCtx }
          );
        }
        if (language !== null) {
          language = language.toLowerCase();
        }
        mapping["@language"] = language;
      }
      if ("@prefix" in value) {
        if (term.match(/:|\//)) {
          throw new JsonLdError(
            "Invalid JSON-LD syntax; @context @prefix used on a compact IRI term",
            "jsonld.SyntaxError",
            { code: "invalid term definition", context: localCtx }
          );
        }
        if (api.isKeyword(mapping["@id"])) {
          throw new JsonLdError(
            "Invalid JSON-LD syntax; keywords may not be used as prefixes",
            "jsonld.SyntaxError",
            { code: "invalid term definition", context: localCtx }
          );
        }
        if (typeof value["@prefix"] === "boolean") {
          mapping._prefix = value["@prefix"] === true;
        } else {
          throw new JsonLdError(
            "Invalid JSON-LD syntax; @context value for @prefix must be boolean",
            "jsonld.SyntaxError",
            { code: "invalid @prefix value", context: localCtx }
          );
        }
      }
      if ("@direction" in value) {
        const direction = value["@direction"];
        if (direction !== null && direction !== "ltr" && direction !== "rtl") {
          throw new JsonLdError(
            'Invalid JSON-LD syntax; @direction value must be null, "ltr", or "rtl".',
            "jsonld.SyntaxError",
            { code: "invalid base direction", context: localCtx }
          );
        }
        mapping["@direction"] = direction;
      }
      if ("@nest" in value) {
        const nest = value["@nest"];
        if (!_isString(nest) || nest !== "@nest" && nest.indexOf("@") === 0) {
          throw new JsonLdError(
            "Invalid JSON-LD syntax; @context @nest value must be a string which is not a keyword other than @nest.",
            "jsonld.SyntaxError",
            { code: "invalid @nest value", context: localCtx }
          );
        }
        mapping["@nest"] = nest;
      }
      const id = mapping["@id"];
      if (id === "@context" || id === "@preserve") {
        throw new JsonLdError(
          "Invalid JSON-LD syntax; @context and @preserve cannot be aliased.",
          "jsonld.SyntaxError",
          { code: "invalid keyword alias", context: localCtx }
        );
      }
      if (previousMapping && previousMapping.protected && !overrideProtected) {
        activeCtx.protected[term] = true;
        mapping.protected = true;
        if (!_deepCompare(previousMapping, mapping)) {
          throw new JsonLdError(
            "Invalid JSON-LD syntax; tried to redefine a protected term.",
            "jsonld.SyntaxError",
            { code: "protected term redefinition", context: localCtx, term }
          );
        }
      }
    };
    api.expandIri = (activeCtx, value, relativeTo, options) => {
      return _expandIri(
        activeCtx,
        value,
        relativeTo,
        void 0,
        void 0,
        options
      );
    };
    function _expandIri(activeCtx, value, relativeTo, localCtx, defined, options) {
      if (value === null || !_isString(value) || api.isKeyword(value)) {
        return value;
      }
      if (value.match(REGEX_KEYWORD)) {
        return null;
      }
      if (localCtx && localCtx.hasOwnProperty(value) && defined.get(value) !== true) {
        api.createTermDefinition({
          activeCtx,
          localCtx,
          term: value,
          defined,
          options
        });
      }
      relativeTo = relativeTo || {};
      if (relativeTo.vocab) {
        const mapping = activeCtx.mappings.get(value);
        if (mapping === null) {
          return null;
        }
        if (_isObject(mapping) && "@id" in mapping) {
          return mapping["@id"];
        }
      }
      const colon = value.indexOf(":");
      if (colon > 0) {
        const prefix = value.substr(0, colon);
        const suffix = value.substr(colon + 1);
        if (prefix === "_" || suffix.indexOf("//") === 0) {
          return value;
        }
        if (localCtx && localCtx.hasOwnProperty(prefix)) {
          api.createTermDefinition({
            activeCtx,
            localCtx,
            term: prefix,
            defined,
            options
          });
        }
        const mapping = activeCtx.mappings.get(prefix);
        if (mapping && mapping._prefix) {
          return mapping["@id"] + suffix;
        }
        if (_isAbsoluteIri(value)) {
          return value;
        }
      }
      if (relativeTo.vocab && "@vocab" in activeCtx) {
        const prependedResult = activeCtx["@vocab"] + value;
        value = prependedResult;
      } else if (relativeTo.base) {
        let prependedResult;
        let base;
        if ("@base" in activeCtx) {
          if (activeCtx["@base"]) {
            base = prependBase(options.base, activeCtx["@base"]);
            prependedResult = prependBase(base, value);
          } else {
            base = activeCtx["@base"];
            prependedResult = value;
          }
        } else {
          base = options.base;
          prependedResult = prependBase(options.base, value);
        }
        value = prependedResult;
      }
      return value;
    }
    api.getInitialContext = (options) => {
      const key = JSON.stringify({ processingMode: options.processingMode });
      const cached = INITIAL_CONTEXT_CACHE.get(key);
      if (cached) {
        return cached;
      }
      const initialContext = {
        processingMode: options.processingMode,
        mappings: /* @__PURE__ */ new Map(),
        inverse: null,
        getInverse: _createInverseContext,
        clone: _cloneActiveContext,
        revertToPreviousContext: _revertToPreviousContext,
        protected: {}
      };
      if (INITIAL_CONTEXT_CACHE.size === INITIAL_CONTEXT_CACHE_MAX_SIZE) {
        INITIAL_CONTEXT_CACHE.clear();
      }
      INITIAL_CONTEXT_CACHE.set(key, initialContext);
      return initialContext;
      function _createInverseContext() {
        const activeCtx = this;
        if (activeCtx.inverse) {
          return activeCtx.inverse;
        }
        const inverse = activeCtx.inverse = {};
        const fastCurieMap = activeCtx.fastCurieMap = {};
        const irisToTerms = {};
        const defaultLanguage = (activeCtx["@language"] || "@none").toLowerCase();
        const defaultDirection = activeCtx["@direction"];
        const mappings = activeCtx.mappings;
        const terms = [...mappings.keys()].sort(_compareShortestLeast);
        for (const term of terms) {
          const mapping = mappings.get(term);
          if (mapping === null) {
            continue;
          }
          let container = mapping["@container"] || "@none";
          container = [].concat(container).sort().join("");
          if (mapping["@id"] === null) {
            continue;
          }
          const ids = _asArray(mapping["@id"]);
          for (const iri of ids) {
            let entry = inverse[iri];
            const isKeyword = api.isKeyword(iri);
            if (!entry) {
              inverse[iri] = entry = {};
              if (!isKeyword && !mapping._termHasColon) {
                irisToTerms[iri] = [term];
                const fastCurieEntry = { iri, terms: irisToTerms[iri] };
                if (iri[0] in fastCurieMap) {
                  fastCurieMap[iri[0]].push(fastCurieEntry);
                } else {
                  fastCurieMap[iri[0]] = [fastCurieEntry];
                }
              }
            } else if (!isKeyword && !mapping._termHasColon) {
              irisToTerms[iri].push(term);
            }
            if (!entry[container]) {
              entry[container] = {
                "@language": {},
                "@type": {},
                "@any": {}
              };
            }
            entry = entry[container];
            _addPreferredTerm(term, entry["@any"], "@none");
            if (mapping.reverse) {
              _addPreferredTerm(term, entry["@type"], "@reverse");
            } else if (mapping["@type"] === "@none") {
              _addPreferredTerm(term, entry["@any"], "@none");
              _addPreferredTerm(term, entry["@language"], "@none");
              _addPreferredTerm(term, entry["@type"], "@none");
            } else if ("@type" in mapping) {
              _addPreferredTerm(term, entry["@type"], mapping["@type"]);
            } else if ("@language" in mapping && "@direction" in mapping) {
              const language = mapping["@language"];
              const direction = mapping["@direction"];
              if (language && direction) {
                _addPreferredTerm(
                  term,
                  entry["@language"],
                  `${language}_${direction}`.toLowerCase()
                );
              } else if (language) {
                _addPreferredTerm(term, entry["@language"], language.toLowerCase());
              } else if (direction) {
                _addPreferredTerm(term, entry["@language"], `_${direction}`);
              } else {
                _addPreferredTerm(term, entry["@language"], "@null");
              }
            } else if ("@language" in mapping) {
              _addPreferredTerm(
                term,
                entry["@language"],
                (mapping["@language"] || "@null").toLowerCase()
              );
            } else if ("@direction" in mapping) {
              if (mapping["@direction"]) {
                _addPreferredTerm(
                  term,
                  entry["@language"],
                  `_${mapping["@direction"]}`
                );
              } else {
                _addPreferredTerm(term, entry["@language"], "@none");
              }
            } else if (defaultDirection) {
              _addPreferredTerm(term, entry["@language"], `_${defaultDirection}`);
              _addPreferredTerm(term, entry["@language"], "@none");
              _addPreferredTerm(term, entry["@type"], "@none");
            } else {
              _addPreferredTerm(term, entry["@language"], defaultLanguage);
              _addPreferredTerm(term, entry["@language"], "@none");
              _addPreferredTerm(term, entry["@type"], "@none");
            }
          }
        }
        for (const key2 in fastCurieMap) {
          _buildIriMap(fastCurieMap, key2, 1);
        }
        return inverse;
      }
      function _buildIriMap(iriMap, key2, idx) {
        const entries = iriMap[key2];
        const next = iriMap[key2] = {};
        let iri;
        let letter;
        for (const entry of entries) {
          iri = entry.iri;
          if (idx >= iri.length) {
            letter = "";
          } else {
            letter = iri[idx];
          }
          if (letter in next) {
            next[letter].push(entry);
          } else {
            next[letter] = [entry];
          }
        }
        for (const key3 in next) {
          if (key3 === "") {
            continue;
          }
          _buildIriMap(next, key3, idx + 1);
        }
      }
      function _addPreferredTerm(term, entry, typeOrLanguageValue) {
        if (!entry.hasOwnProperty(typeOrLanguageValue)) {
          entry[typeOrLanguageValue] = term;
        }
      }
      function _cloneActiveContext() {
        const child = {};
        child.mappings = util.clone(this.mappings);
        child.clone = this.clone;
        child.inverse = null;
        child.getInverse = this.getInverse;
        child.protected = util.clone(this.protected);
        if (this.previousContext) {
          child.previousContext = this.previousContext.clone();
        }
        child.revertToPreviousContext = this.revertToPreviousContext;
        if ("@base" in this) {
          child["@base"] = this["@base"];
        }
        if ("@language" in this) {
          child["@language"] = this["@language"];
        }
        if ("@vocab" in this) {
          child["@vocab"] = this["@vocab"];
        }
        return child;
      }
      function _revertToPreviousContext() {
        if (!this.previousContext) {
          return this;
        }
        return this.previousContext.clone();
      }
    };
    api.getContextValue = (ctx, key, type) => {
      if (key === null) {
        if (type === "@context") {
          return void 0;
        }
        return null;
      }
      if (ctx.mappings.has(key)) {
        const entry = ctx.mappings.get(key);
        if (_isUndefined(type)) {
          return entry;
        }
        if (entry.hasOwnProperty(type)) {
          return entry[type];
        }
      }
      if (type === "@language" && type in ctx) {
        return ctx[type];
      }
      if (type === "@direction" && type in ctx) {
        return ctx[type];
      }
      if (type === "@context") {
        return void 0;
      }
      return null;
    };
    api.processingMode = (activeCtx, version) => {
      if (version.toString() >= "1.1") {
        return !activeCtx.processingMode || activeCtx.processingMode >= "json-ld-" + version.toString();
      } else {
        return activeCtx.processingMode === "json-ld-1.0";
      }
    };
    api.isKeyword = (v) => {
      if (!_isString(v) || v[0] !== "@") {
        return false;
      }
      switch (v) {
        case "@base":
        case "@container":
        case "@context":
        case "@default":
        case "@direction":
        case "@embed":
        case "@explicit":
        case "@graph":
        case "@id":
        case "@included":
        case "@index":
        case "@json":
        case "@language":
        case "@list":
        case "@nest":
        case "@none":
        case "@omitDefault":
        case "@prefix":
        case "@preserve":
        case "@protected":
        case "@requireAll":
        case "@reverse":
        case "@set":
        case "@type":
        case "@value":
        case "@version":
        case "@vocab":
          return true;
      }
      return false;
    };
    function _deepCompare(x1, x2) {
      if (!(x1 && typeof x1 === "object") || !(x2 && typeof x2 === "object")) {
        return x1 === x2;
      }
      const x1Array = Array.isArray(x1);
      if (x1Array !== Array.isArray(x2)) {
        return false;
      }
      if (x1Array) {
        if (x1.length !== x2.length) {
          return false;
        }
        for (let i = 0; i < x1.length; ++i) {
          if (!_deepCompare(x1[i], x2[i])) {
            return false;
          }
        }
        return true;
      }
      const k1s = Object.keys(x1);
      const k2s = Object.keys(x2);
      if (k1s.length !== k2s.length) {
        return false;
      }
      for (const k1 in x1) {
        let v1 = x1[k1];
        let v2 = x2[k1];
        if (k1 === "@container") {
          if (Array.isArray(v1) && Array.isArray(v2)) {
            v1 = v1.slice().sort();
            v2 = v2.slice().sort();
          }
        }
        if (!_deepCompare(v1, v2)) {
          return false;
        }
      }
      return true;
    }
  }
});

// node_modules/jsonld/lib/expand.js
var require_expand = __commonJS({
  "node_modules/jsonld/lib/expand.js"(exports, module) {
    "use strict";
    var JsonLdError = require_JsonLdError();
    var {
      isArray: _isArray,
      isObject: _isObject,
      isEmptyObject: _isEmptyObject,
      isString: _isString,
      isUndefined: _isUndefined
    } = require_types();
    var {
      isList: _isList,
      isValue: _isValue,
      isGraph: _isGraph,
      isSubject: _isSubject
    } = require_graphTypes();
    var {
      expandIri: _expandIri,
      getContextValue: _getContextValue,
      isKeyword: _isKeyword,
      process: _processContext,
      processingMode: _processingMode
    } = require_context();
    var {
      isAbsolute: _isAbsoluteIri
    } = require_url();
    var {
      REGEX_BCP47,
      REGEX_KEYWORD,
      addValue: _addValue,
      asArray: _asArray,
      getValues: _getValues,
      validateTypeValue: _validateTypeValue
    } = require_util();
    var {
      handleEvent: _handleEvent
    } = require_events();
    var api = {};
    module.exports = api;
    api.expand = async ({
      activeCtx,
      activeProperty = null,
      element,
      options = {},
      insideList = false,
      insideIndex = false,
      typeScopedContext = null
    }) => {
      if (element === null || element === void 0) {
        return null;
      }
      if (activeProperty === "@default") {
        options = Object.assign({}, options, { isFrame: false });
      }
      if (!_isArray(element) && !_isObject(element)) {
        if (!insideList && (activeProperty === null || _expandIri(
          activeCtx,
          activeProperty,
          { vocab: true },
          options
        ) === "@graph")) {
          if (options.eventHandler) {
            _handleEvent({
              event: {
                type: ["JsonLdEvent"],
                code: "free-floating scalar",
                level: "warning",
                message: "Dropping free-floating scalar not in a list.",
                details: {
                  value: element
                  //activeProperty
                  //insideList
                }
              },
              options
            });
          }
          return null;
        }
        return _expandValue({ activeCtx, activeProperty, value: element, options });
      }
      if (_isArray(element)) {
        let rval2 = [];
        const container = _getContextValue(
          activeCtx,
          activeProperty,
          "@container"
        ) || [];
        insideList = insideList || container.includes("@list");
        for (let i = 0; i < element.length; ++i) {
          let e = await api.expand({
            activeCtx,
            activeProperty,
            element: element[i],
            options,
            insideIndex,
            typeScopedContext
          });
          if (insideList && _isArray(e)) {
            e = { "@list": e };
          }
          if (e === null) {
            continue;
          }
          if (_isArray(e)) {
            rval2 = rval2.concat(e);
          } else {
            rval2.push(e);
          }
        }
        return rval2;
      }
      const expandedActiveProperty = _expandIri(
        activeCtx,
        activeProperty,
        { vocab: true },
        options
      );
      const propertyScopedCtx = _getContextValue(activeCtx, activeProperty, "@context");
      typeScopedContext = typeScopedContext || (activeCtx.previousContext ? activeCtx : null);
      let keys = Object.keys(element).sort();
      let mustRevert = !insideIndex;
      if (mustRevert && typeScopedContext && keys.length <= 2 && !keys.includes("@context")) {
        for (const key of keys) {
          const expandedProperty = _expandIri(
            typeScopedContext,
            key,
            { vocab: true },
            options
          );
          if (expandedProperty === "@value") {
            mustRevert = false;
            activeCtx = typeScopedContext;
            break;
          }
          if (expandedProperty === "@id" && keys.length === 1) {
            mustRevert = false;
            break;
          }
        }
      }
      if (mustRevert) {
        activeCtx = activeCtx.revertToPreviousContext();
      }
      if (!_isUndefined(propertyScopedCtx)) {
        activeCtx = await _processContext({
          activeCtx,
          localCtx: propertyScopedCtx,
          propagate: true,
          overrideProtected: true,
          options
        });
      }
      if ("@context" in element) {
        activeCtx = await _processContext(
          { activeCtx, localCtx: element["@context"], options }
        );
      }
      typeScopedContext = activeCtx;
      let typeKey = null;
      for (const key of keys) {
        const expandedProperty = _expandIri(activeCtx, key, { vocab: true }, options);
        if (expandedProperty === "@type") {
          typeKey = typeKey || key;
          const value = element[key];
          const types = Array.isArray(value) ? value.length > 1 ? value.slice().sort() : value : [value];
          for (const type of types) {
            const ctx = _getContextValue(typeScopedContext, type, "@context");
            if (!_isUndefined(ctx)) {
              activeCtx = await _processContext({
                activeCtx,
                localCtx: ctx,
                options,
                propagate: false
              });
            }
          }
        }
      }
      let rval = {};
      await _expandObject({
        activeCtx,
        activeProperty,
        expandedActiveProperty,
        element,
        expandedParent: rval,
        options,
        insideList,
        typeKey,
        typeScopedContext
      });
      keys = Object.keys(rval);
      let count = keys.length;
      if ("@value" in rval) {
        if ("@type" in rval && ("@language" in rval || "@direction" in rval)) {
          throw new JsonLdError(
            'Invalid JSON-LD syntax; an element containing "@value" may not contain both "@type" and either "@language" or "@direction".',
            "jsonld.SyntaxError",
            { code: "invalid value object", element: rval }
          );
        }
        let validCount = count - 1;
        if ("@type" in rval) {
          validCount -= 1;
        }
        if ("@index" in rval) {
          validCount -= 1;
        }
        if ("@language" in rval) {
          validCount -= 1;
        }
        if ("@direction" in rval) {
          validCount -= 1;
        }
        if (validCount !== 0) {
          throw new JsonLdError(
            'Invalid JSON-LD syntax; an element containing "@value" may only have an "@index" property and either "@type" or either or both "@language" or "@direction".',
            "jsonld.SyntaxError",
            { code: "invalid value object", element: rval }
          );
        }
        const values = rval["@value"] === null ? [] : _asArray(rval["@value"]);
        const types = _getValues(rval, "@type");
        if (_processingMode(activeCtx, 1.1) && types.includes("@json") && types.length === 1) {
        } else if (values.length === 0) {
          if (options.eventHandler) {
            _handleEvent({
              event: {
                type: ["JsonLdEvent"],
                code: "null @value value",
                level: "warning",
                message: "Dropping null @value value.",
                details: {
                  value: rval
                }
              },
              options
            });
          }
          rval = null;
        } else if (!values.every((v) => _isString(v) || _isEmptyObject(v)) && "@language" in rval) {
          throw new JsonLdError(
            "Invalid JSON-LD syntax; only strings may be language-tagged.",
            "jsonld.SyntaxError",
            { code: "invalid language-tagged value", element: rval }
          );
        } else if (!types.every((t) => _isAbsoluteIri(t) && !(_isString(t) && t.indexOf("_:") === 0) || _isEmptyObject(t))) {
          throw new JsonLdError(
            'Invalid JSON-LD syntax; an element containing "@value" and "@type" must have an absolute IRI for the value of "@type".',
            "jsonld.SyntaxError",
            { code: "invalid typed value", element: rval }
          );
        }
      } else if ("@type" in rval && !_isArray(rval["@type"])) {
        rval["@type"] = [rval["@type"]];
      } else if ("@set" in rval || "@list" in rval) {
        if (count > 1 && !(count === 2 && "@index" in rval)) {
          throw new JsonLdError(
            'Invalid JSON-LD syntax; if an element has the property "@set" or "@list", then it can have at most one other property that is "@index".',
            "jsonld.SyntaxError",
            { code: "invalid set or list object", element: rval }
          );
        }
        if ("@set" in rval) {
          rval = rval["@set"];
          keys = Object.keys(rval);
          count = keys.length;
        }
      } else if (count === 1 && "@language" in rval) {
        if (options.eventHandler) {
          _handleEvent({
            event: {
              type: ["JsonLdEvent"],
              code: "object with only @language",
              level: "warning",
              message: "Dropping object with only @language.",
              details: {
                value: rval
              }
            },
            options
          });
        }
        rval = null;
      }
      if (_isObject(rval) && !options.keepFreeFloatingNodes && !insideList && (activeProperty === null || expandedActiveProperty === "@graph" || (_getContextValue(activeCtx, activeProperty, "@container") || []).includes("@graph"))) {
        rval = _dropUnsafeObject({ value: rval, count, options });
      }
      return rval;
    };
    function _dropUnsafeObject({
      value,
      count,
      options
    }) {
      if (count === 0 || "@value" in value || "@list" in value || count === 1 && "@id" in value) {
        if (options.eventHandler) {
          let code;
          let message;
          if (count === 0) {
            code = "empty object";
            message = "Dropping empty object.";
          } else if ("@value" in value) {
            code = "object with only @value";
            message = "Dropping object with only @value.";
          } else if ("@list" in value) {
            code = "object with only @list";
            message = "Dropping object with only @list.";
          } else if (count === 1 && "@id" in value) {
            code = "object with only @id";
            message = "Dropping object with only @id.";
          }
          _handleEvent({
            event: {
              type: ["JsonLdEvent"],
              code,
              level: "warning",
              message,
              details: {
                value
              }
            },
            options
          });
        }
        return null;
      }
      return value;
    }
    async function _expandObject({
      activeCtx,
      activeProperty,
      expandedActiveProperty,
      element,
      expandedParent,
      options = {},
      insideList,
      typeKey,
      typeScopedContext
    }) {
      const keys = Object.keys(element).sort();
      const nests = [];
      let unexpandedValue;
      const isJsonType = element[typeKey] && _expandIri(
        activeCtx,
        _isArray(element[typeKey]) ? element[typeKey][0] : element[typeKey],
        { vocab: true },
        {
          ...options,
          typeExpansion: true
        }
      ) === "@json";
      for (const key of keys) {
        let value = element[key];
        let expandedValue;
        if (key === "@context") {
          continue;
        }
        const expandedProperty = _expandIri(activeCtx, key, { vocab: true }, options);
        if (expandedProperty === null || !(_isAbsoluteIri(expandedProperty) || _isKeyword(expandedProperty))) {
          if (options.eventHandler) {
            _handleEvent({
              event: {
                type: ["JsonLdEvent"],
                code: "invalid property",
                level: "warning",
                message: "Dropping property that did not expand into an absolute IRI or keyword.",
                details: {
                  property: key,
                  expandedProperty
                }
              },
              options
            });
          }
          continue;
        }
        if (_isKeyword(expandedProperty)) {
          if (expandedActiveProperty === "@reverse") {
            throw new JsonLdError(
              "Invalid JSON-LD syntax; a keyword cannot be used as a @reverse property.",
              "jsonld.SyntaxError",
              { code: "invalid reverse property map", value }
            );
          }
          if (expandedProperty in expandedParent && expandedProperty !== "@included" && expandedProperty !== "@type") {
            throw new JsonLdError(
              "Invalid JSON-LD syntax; colliding keywords detected.",
              "jsonld.SyntaxError",
              { code: "colliding keywords", keyword: expandedProperty }
            );
          }
        }
        if (expandedProperty === "@id") {
          if (!_isString(value)) {
            if (!options.isFrame) {
              throw new JsonLdError(
                'Invalid JSON-LD syntax; "@id" value must a string.',
                "jsonld.SyntaxError",
                { code: "invalid @id value", value }
              );
            }
            if (_isObject(value)) {
              if (!_isEmptyObject(value)) {
                throw new JsonLdError(
                  'Invalid JSON-LD syntax; "@id" value an empty object or array of strings, if framing',
                  "jsonld.SyntaxError",
                  { code: "invalid @id value", value }
                );
              }
            } else if (_isArray(value)) {
              if (!value.every((v) => _isString(v))) {
                throw new JsonLdError(
                  'Invalid JSON-LD syntax; "@id" value an empty object or array of strings, if framing',
                  "jsonld.SyntaxError",
                  { code: "invalid @id value", value }
                );
              }
            } else {
              throw new JsonLdError(
                'Invalid JSON-LD syntax; "@id" value an empty object or array of strings, if framing',
                "jsonld.SyntaxError",
                { code: "invalid @id value", value }
              );
            }
          }
          _addValue(
            expandedParent,
            "@id",
            _asArray(value).map((v) => {
              if (_isString(v)) {
                const ve = _expandIri(activeCtx, v, { base: true }, options);
                if (options.eventHandler) {
                  if (ve === null) {
                    if (v === null) {
                      _handleEvent({
                        event: {
                          type: ["JsonLdEvent"],
                          code: "null @id value",
                          level: "warning",
                          message: "Null @id found.",
                          details: {
                            id: v
                          }
                        },
                        options
                      });
                    } else {
                      _handleEvent({
                        event: {
                          type: ["JsonLdEvent"],
                          code: "reserved @id value",
                          level: "warning",
                          message: "Reserved @id found.",
                          details: {
                            id: v
                          }
                        },
                        options
                      });
                    }
                  } else if (!_isAbsoluteIri(ve)) {
                    _handleEvent({
                      event: {
                        type: ["JsonLdEvent"],
                        code: "relative @id reference",
                        level: "warning",
                        message: "Relative @id reference found.",
                        details: {
                          id: v,
                          expandedId: ve
                        }
                      },
                      options
                    });
                  }
                }
                return ve;
              }
              return v;
            }),
            { propertyIsArray: options.isFrame }
          );
          continue;
        }
        if (expandedProperty === "@type") {
          if (_isObject(value)) {
            value = Object.fromEntries(Object.entries(value).map(([k, v]) => [
              _expandIri(typeScopedContext, k, { vocab: true }),
              _asArray(v).map(
                (vv) => _expandIri(
                  typeScopedContext,
                  vv,
                  { base: true, vocab: true },
                  { ...options, typeExpansion: true }
                )
              )
            ]));
          }
          _validateTypeValue(value, options.isFrame);
          _addValue(
            expandedParent,
            "@type",
            _asArray(value).map((v) => {
              if (_isString(v)) {
                const ve = _expandIri(
                  typeScopedContext,
                  v,
                  { base: true, vocab: true },
                  { ...options, typeExpansion: true }
                );
                if (ve !== "@json" && !_isAbsoluteIri(ve)) {
                  if (options.eventHandler) {
                    _handleEvent({
                      event: {
                        type: ["JsonLdEvent"],
                        code: "relative @type reference",
                        level: "warning",
                        message: "Relative @type reference found.",
                        details: {
                          type: v
                        }
                      },
                      options
                    });
                  }
                }
                return ve;
              }
              return v;
            }),
            { propertyIsArray: !!options.isFrame }
          );
          continue;
        }
        if (expandedProperty === "@included" && _processingMode(activeCtx, 1.1)) {
          const includedResult = _asArray(await api.expand({
            activeCtx,
            activeProperty,
            element: value,
            options
          }));
          if (!includedResult.every((v) => _isSubject(v))) {
            throw new JsonLdError(
              "Invalid JSON-LD syntax; values of @included must expand to node objects.",
              "jsonld.SyntaxError",
              { code: "invalid @included value", value }
            );
          }
          _addValue(
            expandedParent,
            "@included",
            includedResult,
            { propertyIsArray: true }
          );
          continue;
        }
        if (expandedProperty === "@graph" && !(_isObject(value) || _isArray(value))) {
          throw new JsonLdError(
            'Invalid JSON-LD syntax; "@graph" value must not be an object or an array.',
            "jsonld.SyntaxError",
            { code: "invalid @graph value", value }
          );
        }
        if (expandedProperty === "@value") {
          unexpandedValue = value;
          if (isJsonType && _processingMode(activeCtx, 1.1)) {
            expandedParent["@value"] = value;
          } else {
            _addValue(
              expandedParent,
              "@value",
              value,
              { propertyIsArray: options.isFrame }
            );
          }
          continue;
        }
        if (expandedProperty === "@language") {
          if (value === null) {
            continue;
          }
          if (!_isString(value) && !options.isFrame) {
            throw new JsonLdError(
              'Invalid JSON-LD syntax; "@language" value must be a string.',
              "jsonld.SyntaxError",
              { code: "invalid language-tagged string", value }
            );
          }
          value = _asArray(value).map((v) => _isString(v) ? v.toLowerCase() : v);
          for (const language of value) {
            if (_isString(language) && !language.match(REGEX_BCP47)) {
              if (options.eventHandler) {
                _handleEvent({
                  event: {
                    type: ["JsonLdEvent"],
                    code: "invalid @language value",
                    level: "warning",
                    message: "@language value must be valid BCP47.",
                    details: {
                      language
                    }
                  },
                  options
                });
              }
            }
          }
          _addValue(
            expandedParent,
            "@language",
            value,
            { propertyIsArray: options.isFrame }
          );
          continue;
        }
        if (expandedProperty === "@direction") {
          if (!_isString(value) && !options.isFrame) {
            throw new JsonLdError(
              'Invalid JSON-LD syntax; "@direction" value must be a string.',
              "jsonld.SyntaxError",
              { code: "invalid base direction", value }
            );
          }
          value = _asArray(value);
          for (const dir of value) {
            if (_isString(dir) && dir !== "ltr" && dir !== "rtl") {
              throw new JsonLdError(
                'Invalid JSON-LD syntax; "@direction" must be "ltr" or "rtl".',
                "jsonld.SyntaxError",
                { code: "invalid base direction", value }
              );
            }
          }
          _addValue(
            expandedParent,
            "@direction",
            value,
            { propertyIsArray: options.isFrame }
          );
          continue;
        }
        if (expandedProperty === "@index") {
          if (!_isString(value)) {
            throw new JsonLdError(
              'Invalid JSON-LD syntax; "@index" value must be a string.',
              "jsonld.SyntaxError",
              { code: "invalid @index value", value }
            );
          }
          _addValue(expandedParent, "@index", value);
          continue;
        }
        if (expandedProperty === "@reverse") {
          if (!_isObject(value)) {
            throw new JsonLdError(
              'Invalid JSON-LD syntax; "@reverse" value must be an object.',
              "jsonld.SyntaxError",
              { code: "invalid @reverse value", value }
            );
          }
          expandedValue = await api.expand({
            activeCtx,
            activeProperty: "@reverse",
            element: value,
            options
          });
          if ("@reverse" in expandedValue) {
            for (const property in expandedValue["@reverse"]) {
              _addValue(
                expandedParent,
                property,
                expandedValue["@reverse"][property],
                { propertyIsArray: true }
              );
            }
          }
          let reverseMap = expandedParent["@reverse"] || null;
          for (const property in expandedValue) {
            if (property === "@reverse") {
              continue;
            }
            if (reverseMap === null) {
              reverseMap = expandedParent["@reverse"] = {};
            }
            _addValue(reverseMap, property, [], { propertyIsArray: true });
            const items = expandedValue[property];
            for (let ii = 0; ii < items.length; ++ii) {
              const item = items[ii];
              if (_isValue(item) || _isList(item)) {
                throw new JsonLdError(
                  'Invalid JSON-LD syntax; "@reverse" value must not be a @value or an @list.',
                  "jsonld.SyntaxError",
                  { code: "invalid reverse property value", value: expandedValue }
                );
              }
              _addValue(reverseMap, property, item, { propertyIsArray: true });
            }
          }
          continue;
        }
        if (expandedProperty === "@nest") {
          nests.push(key);
          continue;
        }
        let termCtx = activeCtx;
        const ctx = _getContextValue(activeCtx, key, "@context");
        if (!_isUndefined(ctx)) {
          termCtx = await _processContext({
            activeCtx,
            localCtx: ctx,
            propagate: true,
            overrideProtected: true,
            options
          });
        }
        const container = _getContextValue(termCtx, key, "@container") || [];
        if (container.includes("@language") && _isObject(value)) {
          const direction = _getContextValue(termCtx, key, "@direction");
          expandedValue = _expandLanguageMap(termCtx, value, direction, options);
        } else if (container.includes("@index") && _isObject(value)) {
          const asGraph = container.includes("@graph");
          const indexKey = _getContextValue(termCtx, key, "@index") || "@index";
          const propertyIndex = indexKey !== "@index" && _expandIri(activeCtx, indexKey, { vocab: true }, options);
          expandedValue = await _expandIndexMap({
            activeCtx: termCtx,
            options,
            activeProperty: key,
            value,
            asGraph,
            indexKey,
            propertyIndex
          });
        } else if (container.includes("@id") && _isObject(value)) {
          const asGraph = container.includes("@graph");
          expandedValue = await _expandIndexMap({
            activeCtx: termCtx,
            options,
            activeProperty: key,
            value,
            asGraph,
            indexKey: "@id"
          });
        } else if (container.includes("@type") && _isObject(value)) {
          expandedValue = await _expandIndexMap({
            // since container is `@type`, revert type scoped context when expanding
            activeCtx: termCtx.revertToPreviousContext(),
            options,
            activeProperty: key,
            value,
            asGraph: false,
            indexKey: "@type"
          });
        } else {
          const isList = expandedProperty === "@list";
          if (isList || expandedProperty === "@set") {
            let nextActiveProperty = activeProperty;
            if (isList && expandedActiveProperty === "@graph") {
              nextActiveProperty = null;
            }
            expandedValue = await api.expand({
              activeCtx: termCtx,
              activeProperty: nextActiveProperty,
              element: value,
              options,
              insideList: isList
            });
          } else if (_getContextValue(activeCtx, key, "@type") === "@json") {
            expandedValue = {
              "@type": "@json",
              "@value": value
            };
          } else {
            expandedValue = await api.expand({
              activeCtx: termCtx,
              activeProperty: key,
              element: value,
              options,
              insideList: false
            });
          }
        }
        if (expandedValue === null && expandedProperty !== "@value") {
          continue;
        }
        if (expandedProperty !== "@list" && !_isList(expandedValue) && container.includes("@list")) {
          expandedValue = { "@list": _asArray(expandedValue) };
        }
        if (container.includes("@graph") && !container.some((key2) => key2 === "@id" || key2 === "@index")) {
          expandedValue = _asArray(expandedValue);
          if (!options.isFrame) {
            expandedValue = expandedValue.filter((v) => {
              const count = Object.keys(v).length;
              return _dropUnsafeObject({ value: v, count, options }) !== null;
            });
          }
          if (expandedValue.length === 0) {
            continue;
          }
          expandedValue = expandedValue.map((v) => ({ "@graph": _asArray(v) }));
        }
        if (termCtx.mappings.has(key) && termCtx.mappings.get(key).reverse) {
          const reverseMap = expandedParent["@reverse"] = expandedParent["@reverse"] || {};
          expandedValue = _asArray(expandedValue);
          for (let ii = 0; ii < expandedValue.length; ++ii) {
            const item = expandedValue[ii];
            if (_isValue(item) || _isList(item)) {
              throw new JsonLdError(
                'Invalid JSON-LD syntax; "@reverse" value must not be a @value or an @list.',
                "jsonld.SyntaxError",
                { code: "invalid reverse property value", value: expandedValue }
              );
            }
            _addValue(reverseMap, expandedProperty, item, { propertyIsArray: true });
          }
          continue;
        }
        _addValue(expandedParent, expandedProperty, expandedValue, {
          propertyIsArray: true
        });
      }
      if ("@value" in expandedParent) {
        if (expandedParent["@type"] === "@json" && _processingMode(activeCtx, 1.1)) {
        } else if ((_isObject(unexpandedValue) || _isArray(unexpandedValue)) && !options.isFrame) {
          throw new JsonLdError(
            'Invalid JSON-LD syntax; "@value" value must not be an object or an array.',
            "jsonld.SyntaxError",
            { code: "invalid value object value", value: unexpandedValue }
          );
        }
      }
      for (const key of nests) {
        const nestedValues = _isArray(element[key]) ? element[key] : [element[key]];
        for (const nv of nestedValues) {
          if (!_isObject(nv) || Object.keys(nv).some((k) => _expandIri(activeCtx, k, { vocab: true }, options) === "@value")) {
            throw new JsonLdError(
              "Invalid JSON-LD syntax; nested value must be a node object.",
              "jsonld.SyntaxError",
              { code: "invalid @nest value", value: nv }
            );
          }
          await _expandObject({
            activeCtx,
            activeProperty,
            expandedActiveProperty,
            element: nv,
            expandedParent,
            options,
            insideList,
            typeScopedContext,
            typeKey
          });
        }
      }
    }
    function _expandValue({ activeCtx, activeProperty, value, options }) {
      if (value === null || value === void 0) {
        return null;
      }
      const expandedProperty = _expandIri(
        activeCtx,
        activeProperty,
        { vocab: true },
        options
      );
      if (expandedProperty === "@id") {
        return _expandIri(activeCtx, value, { base: true }, options);
      } else if (expandedProperty === "@type") {
        return _expandIri(
          activeCtx,
          value,
          { vocab: true, base: true },
          { ...options, typeExpansion: true }
        );
      }
      const type = _getContextValue(activeCtx, activeProperty, "@type");
      if ((type === "@id" || expandedProperty === "@graph") && _isString(value)) {
        const expandedValue = _expandIri(activeCtx, value, { base: true }, options);
        if (expandedValue === null && value.match(REGEX_KEYWORD)) {
          if (options.eventHandler) {
            _handleEvent({
              event: {
                type: ["JsonLdEvent"],
                code: "reserved @id value",
                level: "warning",
                message: "Reserved @id found.",
                details: {
                  id: activeProperty
                }
              },
              options
            });
          }
        }
        return { "@id": expandedValue };
      }
      if (type === "@vocab" && _isString(value)) {
        return {
          "@id": _expandIri(activeCtx, value, { vocab: true, base: true }, options)
        };
      }
      if (_isKeyword(expandedProperty)) {
        return value;
      }
      const rval = {};
      if (type && !["@id", "@vocab", "@none"].includes(type)) {
        rval["@type"] = type;
      } else if (_isString(value)) {
        const language = _getContextValue(activeCtx, activeProperty, "@language");
        if (language !== null) {
          rval["@language"] = language;
        }
        const direction = _getContextValue(activeCtx, activeProperty, "@direction");
        if (direction !== null) {
          rval["@direction"] = direction;
        }
      }
      if (!["boolean", "number", "string"].includes(typeof value)) {
        value = value.toString();
      }
      rval["@value"] = value;
      return rval;
    }
    function _expandLanguageMap(activeCtx, languageMap, direction, options) {
      const rval = [];
      const keys = Object.keys(languageMap).sort();
      for (const key of keys) {
        const expandedKey = _expandIri(activeCtx, key, { vocab: true }, options);
        let val = languageMap[key];
        if (!_isArray(val)) {
          val = [val];
        }
        for (const item of val) {
          if (item === null) {
            continue;
          }
          if (!_isString(item)) {
            throw new JsonLdError(
              "Invalid JSON-LD syntax; language map values must be strings.",
              "jsonld.SyntaxError",
              { code: "invalid language map value", languageMap }
            );
          }
          const val2 = { "@value": item };
          if (expandedKey !== "@none") {
            if (!key.match(REGEX_BCP47)) {
              if (options.eventHandler) {
                _handleEvent({
                  event: {
                    type: ["JsonLdEvent"],
                    code: "invalid @language value",
                    level: "warning",
                    message: "@language value must be valid BCP47.",
                    details: {
                      language: key
                    }
                  },
                  options
                });
              }
            }
            val2["@language"] = key.toLowerCase();
          }
          if (direction) {
            val2["@direction"] = direction;
          }
          rval.push(val2);
        }
      }
      return rval;
    }
    async function _expandIndexMap({
      activeCtx,
      options,
      activeProperty,
      value,
      asGraph,
      indexKey,
      propertyIndex
    }) {
      const rval = [];
      const keys = Object.keys(value).sort();
      const isTypeIndex = indexKey === "@type";
      for (let key of keys) {
        if (isTypeIndex) {
          const ctx = _getContextValue(activeCtx, key, "@context");
          if (!_isUndefined(ctx)) {
            activeCtx = await _processContext({
              activeCtx,
              localCtx: ctx,
              propagate: false,
              options
            });
          }
        }
        let val = value[key];
        if (!_isArray(val)) {
          val = [val];
        }
        val = await api.expand({
          activeCtx,
          activeProperty,
          element: val,
          options,
          insideList: false,
          insideIndex: true
        });
        let expandedKey;
        if (propertyIndex) {
          if (key === "@none") {
            expandedKey = "@none";
          } else {
            expandedKey = _expandValue(
              { activeCtx, activeProperty: indexKey, value: key, options }
            );
          }
        } else {
          expandedKey = _expandIri(activeCtx, key, { vocab: true }, options);
        }
        if (indexKey === "@id") {
          key = _expandIri(activeCtx, key, { base: true }, options);
        } else if (isTypeIndex) {
          key = expandedKey;
        }
        for (let item of val) {
          if (asGraph && !_isGraph(item)) {
            item = { "@graph": [item] };
          }
          if (indexKey === "@type") {
            if (expandedKey === "@none") {
            } else if (item["@type"]) {
              item["@type"] = [key].concat(item["@type"]);
            } else {
              item["@type"] = [key];
            }
          } else if (_isValue(item) && !["@language", "@type", "@index"].includes(indexKey)) {
            throw new JsonLdError(
              `Invalid JSON-LD syntax; Attempt to add illegal key to value object: "${indexKey}".`,
              "jsonld.SyntaxError",
              { code: "invalid value object", value: item }
            );
          } else if (propertyIndex) {
            if (expandedKey !== "@none") {
              _addValue(item, propertyIndex, expandedKey, {
                propertyIsArray: true,
                prependValue: true
              });
            }
          } else if (expandedKey !== "@none" && !(indexKey in item)) {
            item[indexKey] = key;
          }
          rval.push(item);
        }
      }
      return rval;
    }
  }
});

// node_modules/jsonld/lib/nodeMap.js
var require_nodeMap = __commonJS({
  "node_modules/jsonld/lib/nodeMap.js"(exports, module) {
    "use strict";
    var { isKeyword } = require_context();
    var graphTypes = require_graphTypes();
    var types = require_types();
    var util = require_util();
    var JsonLdError = require_JsonLdError();
    var api = {};
    module.exports = api;
    api.createMergedNodeMap = (input, options) => {
      options = options || {};
      const issuer = options.issuer || new util.IdentifierIssuer("_:b");
      const graphs = { "@default": {} };
      api.createNodeMap(input, graphs, "@default", issuer);
      return api.mergeNodeMaps(graphs);
    };
    api.createNodeMap = (input, graphs, graph, issuer, name74, list) => {
      if (types.isArray(input)) {
        for (const node of input) {
          api.createNodeMap(node, graphs, graph, issuer, void 0, list);
        }
        return;
      }
      if (!types.isObject(input)) {
        if (list) {
          list.push(input);
        }
        return;
      }
      if (graphTypes.isValue(input)) {
        if ("@type" in input) {
          let type = input["@type"];
          if (type.indexOf("_:") === 0) {
            input["@type"] = type = issuer.getId(type);
          }
        }
        if (list) {
          list.push(input);
        }
        return;
      } else if (list && graphTypes.isList(input)) {
        const _list = [];
        api.createNodeMap(input["@list"], graphs, graph, issuer, name74, _list);
        list.push({ "@list": _list });
        return;
      }
      if ("@type" in input) {
        const types2 = input["@type"];
        for (const type of types2) {
          if (type.indexOf("_:") === 0) {
            issuer.getId(type);
          }
        }
      }
      if (types.isUndefined(name74)) {
        name74 = graphTypes.isBlankNode(input) ? issuer.getId(input["@id"]) : input["@id"];
      }
      if (list) {
        list.push({ "@id": name74 });
      }
      const subjects = graphs[graph];
      const subject = subjects[name74] = subjects[name74] || {};
      subject["@id"] = name74;
      const properties = Object.keys(input).sort();
      for (let property of properties) {
        if (property === "@id") {
          continue;
        }
        if (property === "@reverse") {
          const referencedNode = { "@id": name74 };
          const reverseMap = input["@reverse"];
          for (const reverseProperty in reverseMap) {
            const items = reverseMap[reverseProperty];
            for (const item of items) {
              let itemName = item["@id"];
              if (graphTypes.isBlankNode(item)) {
                itemName = issuer.getId(itemName);
              }
              api.createNodeMap(item, graphs, graph, issuer, itemName);
              util.addValue(
                subjects[itemName],
                reverseProperty,
                referencedNode,
                { propertyIsArray: true, allowDuplicate: false }
              );
            }
          }
          continue;
        }
        if (property === "@graph") {
          if (!(name74 in graphs)) {
            graphs[name74] = {};
          }
          api.createNodeMap(input[property], graphs, name74, issuer);
          continue;
        }
        if (property === "@included") {
          api.createNodeMap(input[property], graphs, graph, issuer);
          continue;
        }
        if (property !== "@type" && isKeyword(property)) {
          if (property === "@index" && property in subject && (input[property] !== subject[property] || input[property]["@id"] !== subject[property]["@id"])) {
            throw new JsonLdError(
              "Invalid JSON-LD syntax; conflicting @index property detected.",
              "jsonld.SyntaxError",
              { code: "conflicting indexes", subject }
            );
          }
          subject[property] = input[property];
          continue;
        }
        const objects = input[property];
        if (property.indexOf("_:") === 0) {
          property = issuer.getId(property);
        }
        if (objects.length === 0) {
          util.addValue(subject, property, [], { propertyIsArray: true });
          continue;
        }
        for (let o of objects) {
          if (property === "@type") {
            o = o.indexOf("_:") === 0 ? issuer.getId(o) : o;
          }
          if (graphTypes.isSubject(o) || graphTypes.isSubjectReference(o)) {
            if ("@id" in o && !o["@id"]) {
              continue;
            }
            const id = graphTypes.isBlankNode(o) ? issuer.getId(o["@id"]) : o["@id"];
            util.addValue(
              subject,
              property,
              { "@id": id },
              { propertyIsArray: true, allowDuplicate: false }
            );
            api.createNodeMap(o, graphs, graph, issuer, id);
          } else if (graphTypes.isValue(o)) {
            util.addValue(
              subject,
              property,
              o,
              { propertyIsArray: true, allowDuplicate: false }
            );
          } else if (graphTypes.isList(o)) {
            const _list = [];
            api.createNodeMap(o["@list"], graphs, graph, issuer, name74, _list);
            o = { "@list": _list };
            util.addValue(
              subject,
              property,
              o,
              { propertyIsArray: true, allowDuplicate: false }
            );
          } else {
            api.createNodeMap(o, graphs, graph, issuer, name74);
            util.addValue(
              subject,
              property,
              o,
              { propertyIsArray: true, allowDuplicate: false }
            );
          }
        }
      }
    };
    api.mergeNodeMapGraphs = (graphs) => {
      const merged = {};
      for (const name74 of Object.keys(graphs).sort()) {
        for (const id of Object.keys(graphs[name74]).sort()) {
          const node = graphs[name74][id];
          if (!(id in merged)) {
            merged[id] = { "@id": id };
          }
          const mergedNode = merged[id];
          for (const property of Object.keys(node).sort()) {
            if (isKeyword(property) && property !== "@type") {
              mergedNode[property] = util.clone(node[property]);
            } else {
              for (const value of node[property]) {
                util.addValue(
                  mergedNode,
                  property,
                  util.clone(value),
                  { propertyIsArray: true, allowDuplicate: false }
                );
              }
            }
          }
        }
      }
      return merged;
    };
    api.mergeNodeMaps = (graphs) => {
      const defaultGraph = graphs["@default"];
      const graphNames = Object.keys(graphs).sort();
      for (const graphName of graphNames) {
        if (graphName === "@default") {
          continue;
        }
        const nodeMap = graphs[graphName];
        let subject = defaultGraph[graphName];
        if (!subject) {
          defaultGraph[graphName] = subject = {
            "@id": graphName,
            "@graph": []
          };
        } else if (!("@graph" in subject)) {
          subject["@graph"] = [];
        }
        const graph = subject["@graph"];
        for (const id of Object.keys(nodeMap).sort()) {
          const node = nodeMap[id];
          if (!graphTypes.isSubjectReference(node)) {
            graph.push(node);
          }
        }
      }
      return defaultGraph;
    };
  }
});

// node_modules/jsonld/lib/flatten.js
var require_flatten = __commonJS({
  "node_modules/jsonld/lib/flatten.js"(exports, module) {
    "use strict";
    var {
      isSubjectReference: _isSubjectReference
    } = require_graphTypes();
    var {
      createMergedNodeMap: _createMergedNodeMap
    } = require_nodeMap();
    var api = {};
    module.exports = api;
    api.flatten = (input) => {
      const defaultGraph = _createMergedNodeMap(input);
      const flattened = [];
      const keys = Object.keys(defaultGraph).sort();
      for (let ki = 0; ki < keys.length; ++ki) {
        const node = defaultGraph[keys[ki]];
        if (!_isSubjectReference(node)) {
          flattened.push(node);
        }
      }
      return flattened;
    };
  }
});

// node_modules/jsonld/lib/fromRdf.js
var require_fromRdf = __commonJS({
  "node_modules/jsonld/lib/fromRdf.js"(exports, module) {
    "use strict";
    var JsonLdError = require_JsonLdError();
    var graphTypes = require_graphTypes();
    var types = require_types();
    var {
      REGEX_BCP47,
      addValue: _addValue
    } = require_util();
    var {
      handleEvent: _handleEvent
    } = require_events();
    var {
      // RDF,
      RDF_LIST,
      RDF_FIRST,
      RDF_REST,
      RDF_NIL,
      RDF_TYPE,
      // RDF_PLAIN_LITERAL,
      // RDF_XML_LITERAL,
      RDF_JSON_LITERAL,
      // RDF_OBJECT,
      // RDF_LANGSTRING,
      // XSD,
      XSD_BOOLEAN,
      XSD_DOUBLE,
      XSD_INTEGER,
      XSD_STRING
    } = require_constants();
    var api = {};
    module.exports = api;
    api.fromRDF = async (dataset, options) => {
      const {
        useRdfType = false,
        useNativeTypes = false,
        rdfDirection = null
      } = options;
      const defaultGraph = {};
      const graphMap = { "@default": defaultGraph };
      const referencedOnce = {};
      if (rdfDirection) {
        if (rdfDirection === "compound-literal") {
          throw new JsonLdError(
            "Unsupported rdfDirection value.",
            "jsonld.InvalidRdfDirection",
            { value: rdfDirection }
          );
        } else if (rdfDirection !== "i18n-datatype") {
          throw new JsonLdError(
            "Unknown rdfDirection value.",
            "jsonld.InvalidRdfDirection",
            { value: rdfDirection }
          );
        }
      }
      for (const quad of dataset) {
        const name74 = quad.graph.termType === "DefaultGraph" ? "@default" : quad.graph.value;
        if (!(name74 in graphMap)) {
          graphMap[name74] = {};
        }
        if (name74 !== "@default" && !(name74 in defaultGraph)) {
          defaultGraph[name74] = { "@id": name74 };
        }
        const nodeMap = graphMap[name74];
        const s = quad.subject.value;
        const p = quad.predicate.value;
        const o = quad.object;
        if (!(s in nodeMap)) {
          nodeMap[s] = { "@id": s };
        }
        const node = nodeMap[s];
        const objectIsNode = o.termType.endsWith("Node");
        if (objectIsNode && !(o.value in nodeMap)) {
          nodeMap[o.value] = { "@id": o.value };
        }
        if (p === RDF_TYPE && !useRdfType && objectIsNode) {
          _addValue(node, "@type", o.value, { propertyIsArray: true });
          continue;
        }
        const value = _RDFToObject(o, useNativeTypes, rdfDirection, options);
        _addValue(node, p, value, { propertyIsArray: true });
        if (objectIsNode) {
          if (o.value === RDF_NIL) {
            const object = nodeMap[o.value];
            if (!("usages" in object)) {
              object.usages = [];
            }
            object.usages.push({
              node,
              property: p,
              value
            });
          } else if (o.value in referencedOnce) {
            referencedOnce[o.value] = false;
          } else {
            referencedOnce[o.value] = {
              node,
              property: p,
              value
            };
          }
        }
      }
      for (const name74 in graphMap) {
        const graphObject = graphMap[name74];
        if (!(RDF_NIL in graphObject)) {
          continue;
        }
        const nil = graphObject[RDF_NIL];
        if (!nil.usages) {
          continue;
        }
        for (let usage of nil.usages) {
          let node = usage.node;
          let property = usage.property;
          let head = usage.value;
          const list = [];
          const listNodes = [];
          let nodeKeyCount = Object.keys(node).length;
          while (property === RDF_REST && types.isObject(referencedOnce[node["@id"]]) && types.isArray(node[RDF_FIRST]) && node[RDF_FIRST].length === 1 && types.isArray(node[RDF_REST]) && node[RDF_REST].length === 1 && (nodeKeyCount === 3 || nodeKeyCount === 4 && types.isArray(node["@type"]) && node["@type"].length === 1 && node["@type"][0] === RDF_LIST)) {
            list.push(node[RDF_FIRST][0]);
            listNodes.push(node["@id"]);
            usage = referencedOnce[node["@id"]];
            node = usage.node;
            property = usage.property;
            head = usage.value;
            nodeKeyCount = Object.keys(node).length;
            if (!graphTypes.isBlankNode(node)) {
              break;
            }
          }
          delete head["@id"];
          head["@list"] = list.reverse();
          for (const listNode of listNodes) {
            delete graphObject[listNode];
          }
        }
        delete nil.usages;
      }
      const result = [];
      const subjects = Object.keys(defaultGraph).sort();
      for (const subject of subjects) {
        const node = defaultGraph[subject];
        if (subject in graphMap) {
          const graph = node["@graph"] = [];
          const graphObject = graphMap[subject];
          const graphSubjects = Object.keys(graphObject).sort();
          for (const graphSubject of graphSubjects) {
            const node2 = graphObject[graphSubject];
            if (!graphTypes.isSubjectReference(node2)) {
              graph.push(node2);
            }
          }
        }
        if (!graphTypes.isSubjectReference(node)) {
          result.push(node);
        }
      }
      return result;
    };
    function _RDFToObject(o, useNativeTypes, rdfDirection, options) {
      if (o.termType.endsWith("Node")) {
        return { "@id": o.value };
      }
      const rval = { "@value": o.value };
      if (o.language) {
        if (!o.language.match(REGEX_BCP47)) {
          if (options.eventHandler) {
            _handleEvent({
              event: {
                type: ["JsonLdEvent"],
                code: "invalid @language value",
                level: "warning",
                message: "@language value must be valid BCP47.",
                details: {
                  language: o.language
                }
              },
              options
            });
          }
        }
        rval["@language"] = o.language;
      } else {
        let type = o.datatype.value;
        if (!type) {
          type = XSD_STRING;
        }
        if (type === RDF_JSON_LITERAL) {
          type = "@json";
          try {
            rval["@value"] = JSON.parse(rval["@value"]);
          } catch (e) {
            throw new JsonLdError(
              "JSON literal could not be parsed.",
              "jsonld.InvalidJsonLiteral",
              { code: "invalid JSON literal", value: rval["@value"], cause: e }
            );
          }
        }
        if (useNativeTypes) {
          if (type === XSD_BOOLEAN) {
            if (rval["@value"] === "true") {
              rval["@value"] = true;
            } else if (rval["@value"] === "false") {
              rval["@value"] = false;
            }
          } else if (types.isNumeric(rval["@value"])) {
            if (type === XSD_INTEGER) {
              const i = parseInt(rval["@value"], 10);
              if (i.toFixed(0) === rval["@value"]) {
                rval["@value"] = i;
              }
            } else if (type === XSD_DOUBLE) {
              rval["@value"] = parseFloat(rval["@value"]);
            }
          }
          if (![XSD_BOOLEAN, XSD_INTEGER, XSD_DOUBLE, XSD_STRING].includes(type)) {
            rval["@type"] = type;
          }
        } else if (rdfDirection === "i18n-datatype" && type.startsWith("https://www.w3.org/ns/i18n#")) {
          const [, language, direction] = type.split(/[#_]/);
          if (language.length > 0) {
            rval["@language"] = language;
            if (!language.match(REGEX_BCP47)) {
              if (options.eventHandler) {
                _handleEvent({
                  event: {
                    type: ["JsonLdEvent"],
                    code: "invalid @language value",
                    level: "warning",
                    message: "@language value must be valid BCP47.",
                    details: {
                      language
                    }
                  },
                  options
                });
              }
            }
          }
          rval["@direction"] = direction;
        } else if (type !== XSD_STRING) {
          rval["@type"] = type;
        }
      }
      return rval;
    }
  }
});

// node_modules/canonicalize/lib/canonicalize.js
var require_canonicalize = __commonJS({
  "node_modules/canonicalize/lib/canonicalize.js"(exports, module) {
    "use strict";
    module.exports = function serialize(object) {
      if (object === null || typeof object !== "object" || object.toJSON != null) {
        return JSON.stringify(object);
      }
      if (Array.isArray(object)) {
        return "[" + object.reduce((t, cv, ci) => {
          const comma = ci === 0 ? "" : ",";
          const value = cv === void 0 || typeof cv === "symbol" ? null : cv;
          return t + comma + serialize(value);
        }, "") + "]";
      }
      return "{" + Object.keys(object).sort().reduce((t, cv, ci) => {
        if (object[cv] === void 0 || typeof object[cv] === "symbol") {
          return t;
        }
        const comma = t.length === 0 ? "" : ",";
        return t + comma + serialize(cv) + ":" + serialize(object[cv]);
      }, "") + "}";
    };
  }
});

// node_modules/jsonld/lib/toRdf.js
var require_toRdf = __commonJS({
  "node_modules/jsonld/lib/toRdf.js"(exports, module) {
    "use strict";
    var { createNodeMap } = require_nodeMap();
    var { isKeyword } = require_context();
    var graphTypes = require_graphTypes();
    var jsonCanonicalize = require_canonicalize();
    var JsonLdError = require_JsonLdError();
    var types = require_types();
    var util = require_util();
    var {
      handleEvent: _handleEvent
    } = require_events();
    var {
      // RDF,
      // RDF_LIST,
      RDF_FIRST,
      RDF_REST,
      RDF_NIL,
      RDF_TYPE,
      // RDF_PLAIN_LITERAL,
      // RDF_XML_LITERAL,
      RDF_JSON_LITERAL,
      // RDF_OBJECT,
      RDF_LANGSTRING,
      // XSD,
      XSD_BOOLEAN,
      XSD_DOUBLE,
      XSD_INTEGER,
      XSD_STRING
    } = require_constants();
    var {
      isAbsolute: _isAbsoluteIri
    } = require_url();
    var api = {};
    module.exports = api;
    api.toRDF = (input, options) => {
      const issuer = new util.IdentifierIssuer("_:b");
      const nodeMap = { "@default": {} };
      createNodeMap(input, nodeMap, "@default", issuer);
      const dataset = [];
      const graphNames = Object.keys(nodeMap).sort();
      for (const graphName of graphNames) {
        let graphTerm;
        if (graphName === "@default") {
          graphTerm = { termType: "DefaultGraph", value: "" };
        } else if (_isAbsoluteIri(graphName)) {
          if (graphName.startsWith("_:")) {
            graphTerm = { termType: "BlankNode" };
          } else {
            graphTerm = { termType: "NamedNode" };
          }
          graphTerm.value = graphName;
        } else {
          if (options.eventHandler) {
            _handleEvent({
              event: {
                type: ["JsonLdEvent"],
                code: "relative graph reference",
                level: "warning",
                message: "Relative graph reference found.",
                details: {
                  graph: graphName
                }
              },
              options
            });
          }
          continue;
        }
        _graphToRDF(dataset, nodeMap[graphName], graphTerm, issuer, options);
      }
      return dataset;
    };
    function _graphToRDF(dataset, graph, graphTerm, issuer, options) {
      const ids = Object.keys(graph).sort();
      for (const id of ids) {
        const node = graph[id];
        const properties = Object.keys(node).sort();
        for (let property of properties) {
          const items = node[property];
          if (property === "@type") {
            property = RDF_TYPE;
          } else if (isKeyword(property)) {
            continue;
          }
          for (const item of items) {
            const subject = {
              termType: id.startsWith("_:") ? "BlankNode" : "NamedNode",
              value: id
            };
            if (!_isAbsoluteIri(id)) {
              if (options.eventHandler) {
                _handleEvent({
                  event: {
                    type: ["JsonLdEvent"],
                    code: "relative subject reference",
                    level: "warning",
                    message: "Relative subject reference found.",
                    details: {
                      subject: id
                    }
                  },
                  options
                });
              }
              continue;
            }
            const predicate = {
              termType: property.startsWith("_:") ? "BlankNode" : "NamedNode",
              value: property
            };
            if (!_isAbsoluteIri(property)) {
              if (options.eventHandler) {
                _handleEvent({
                  event: {
                    type: ["JsonLdEvent"],
                    code: "relative predicate reference",
                    level: "warning",
                    message: "Relative predicate reference found.",
                    details: {
                      predicate: property
                    }
                  },
                  options
                });
              }
              continue;
            }
            if (predicate.termType === "BlankNode" && !options.produceGeneralizedRdf) {
              if (options.eventHandler) {
                _handleEvent({
                  event: {
                    type: ["JsonLdEvent"],
                    code: "blank node predicate",
                    level: "warning",
                    message: "Dropping blank node predicate.",
                    details: {
                      // FIXME: add better issuer API to get reverse mapping
                      property: issuer.getOldIds().find((key) => issuer.getId(key) === property)
                    }
                  },
                  options
                });
              }
              continue;
            }
            const object = _objectToRDF(
              item,
              issuer,
              dataset,
              graphTerm,
              options.rdfDirection,
              options
            );
            if (object) {
              dataset.push({
                subject,
                predicate,
                object,
                graph: graphTerm
              });
            }
          }
        }
      }
    }
    function _listToRDF(list, issuer, dataset, graphTerm, rdfDirection, options) {
      const first = { termType: "NamedNode", value: RDF_FIRST };
      const rest = { termType: "NamedNode", value: RDF_REST };
      const nil = { termType: "NamedNode", value: RDF_NIL };
      const last = list.pop();
      const result = last ? { termType: "BlankNode", value: issuer.getId() } : nil;
      let subject = result;
      for (const item of list) {
        const object = _objectToRDF(
          item,
          issuer,
          dataset,
          graphTerm,
          rdfDirection,
          options
        );
        const next = { termType: "BlankNode", value: issuer.getId() };
        dataset.push({
          subject,
          predicate: first,
          object,
          graph: graphTerm
        });
        dataset.push({
          subject,
          predicate: rest,
          object: next,
          graph: graphTerm
        });
        subject = next;
      }
      if (last) {
        const object = _objectToRDF(
          last,
          issuer,
          dataset,
          graphTerm,
          rdfDirection,
          options
        );
        dataset.push({
          subject,
          predicate: first,
          object,
          graph: graphTerm
        });
        dataset.push({
          subject,
          predicate: rest,
          object: nil,
          graph: graphTerm
        });
      }
      return result;
    }
    function _objectToRDF(item, issuer, dataset, graphTerm, rdfDirection, options) {
      const object = {};
      if (graphTypes.isValue(item)) {
        object.termType = "Literal";
        object.value = void 0;
        object.datatype = {
          termType: "NamedNode"
        };
        let value = item["@value"];
        const datatype = item["@type"] || null;
        if (datatype === "@json") {
          object.value = jsonCanonicalize(value);
          object.datatype.value = RDF_JSON_LITERAL;
        } else if (types.isBoolean(value)) {
          object.value = value.toString();
          object.datatype.value = datatype || XSD_BOOLEAN;
        } else if (types.isDouble(value) || datatype === XSD_DOUBLE) {
          if (!types.isDouble(value)) {
            value = parseFloat(value);
          }
          object.value = value.toExponential(15).replace(/(\d)0*e\+?/, "$1E");
          object.datatype.value = datatype || XSD_DOUBLE;
        } else if (types.isNumber(value)) {
          object.value = value.toFixed(0);
          object.datatype.value = datatype || XSD_INTEGER;
        } else if ("@direction" in item && rdfDirection === "i18n-datatype") {
          const language = (item["@language"] || "").toLowerCase();
          const direction = item["@direction"];
          const datatype2 = `https://www.w3.org/ns/i18n#${language}_${direction}`;
          object.datatype.value = datatype2;
          object.value = value;
        } else if ("@direction" in item && rdfDirection === "compound-literal") {
          throw new JsonLdError(
            "Unsupported rdfDirection value.",
            "jsonld.InvalidRdfDirection",
            { value: rdfDirection }
          );
        } else if ("@direction" in item && rdfDirection) {
          throw new JsonLdError(
            "Unknown rdfDirection value.",
            "jsonld.InvalidRdfDirection",
            { value: rdfDirection }
          );
        } else if ("@language" in item) {
          if ("@direction" in item && !rdfDirection) {
            if (options.eventHandler) {
              _handleEvent({
                event: {
                  type: ["JsonLdEvent"],
                  code: "rdfDirection not set",
                  level: "warning",
                  message: "rdfDirection not set for @direction.",
                  details: {
                    object: object.value
                  }
                },
                options
              });
            }
          }
          object.value = value;
          object.datatype.value = datatype || RDF_LANGSTRING;
          object.language = item["@language"];
        } else {
          if ("@direction" in item && !rdfDirection) {
            if (options.eventHandler) {
              _handleEvent({
                event: {
                  type: ["JsonLdEvent"],
                  code: "rdfDirection not set",
                  level: "warning",
                  message: "rdfDirection not set for @direction.",
                  details: {
                    object: object.value
                  }
                },
                options
              });
            }
          }
          object.value = value;
          object.datatype.value = datatype || XSD_STRING;
        }
      } else if (graphTypes.isList(item)) {
        const _list = _listToRDF(
          item["@list"],
          issuer,
          dataset,
          graphTerm,
          rdfDirection,
          options
        );
        object.termType = _list.termType;
        object.value = _list.value;
      } else {
        const id = types.isObject(item) ? item["@id"] : item;
        object.termType = id.startsWith("_:") ? "BlankNode" : "NamedNode";
        object.value = id;
      }
      if (object.termType === "NamedNode" && !_isAbsoluteIri(object.value)) {
        if (options.eventHandler) {
          _handleEvent({
            event: {
              type: ["JsonLdEvent"],
              code: "relative object reference",
              level: "warning",
              message: "Relative object reference found.",
              details: {
                object: object.value
              }
            },
            options
          });
        }
        return null;
      }
      return object;
    }
  }
});

// node_modules/jsonld/lib/frame.js
var require_frame = __commonJS({
  "node_modules/jsonld/lib/frame.js"(exports, module) {
    "use strict";
    var { isKeyword } = require_context();
    var graphTypes = require_graphTypes();
    var types = require_types();
    var util = require_util();
    var url = require_url();
    var JsonLdError = require_JsonLdError();
    var {
      createNodeMap: _createNodeMap,
      mergeNodeMapGraphs: _mergeNodeMapGraphs
    } = require_nodeMap();
    var api = {};
    module.exports = api;
    api.frameMergedOrDefault = (input, frame, options) => {
      const state = {
        options,
        embedded: false,
        graph: "@default",
        graphMap: { "@default": {} },
        subjectStack: [],
        link: {},
        bnodeMap: {}
      };
      const issuer = new util.IdentifierIssuer("_:b");
      _createNodeMap(input, state.graphMap, "@default", issuer);
      if (options.merged) {
        state.graphMap["@merged"] = _mergeNodeMapGraphs(state.graphMap);
        state.graph = "@merged";
      }
      state.subjects = state.graphMap[state.graph];
      const framed = [];
      api.frame(state, Object.keys(state.subjects).sort(), frame, framed);
      if (options.pruneBlankNodeIdentifiers) {
        options.bnodesToClear = Object.keys(state.bnodeMap).filter((id) => state.bnodeMap[id].length === 1);
      }
      options.link = {};
      return _cleanupPreserve(framed, options);
    };
    api.frame = (state, subjects, frame, parent, property = null) => {
      _validateFrame(frame);
      frame = frame[0];
      const options = state.options;
      const flags = {
        embed: _getFrameFlag(frame, options, "embed"),
        explicit: _getFrameFlag(frame, options, "explicit"),
        requireAll: _getFrameFlag(frame, options, "requireAll")
      };
      if (!state.link.hasOwnProperty(state.graph)) {
        state.link[state.graph] = {};
      }
      const link = state.link[state.graph];
      const matches = _filterSubjects(state, subjects, frame, flags);
      const ids = Object.keys(matches).sort();
      for (const id of ids) {
        const subject = matches[id];
        if (property === null) {
          state.uniqueEmbeds = { [state.graph]: {} };
        } else {
          state.uniqueEmbeds[state.graph] = state.uniqueEmbeds[state.graph] || {};
        }
        if (flags.embed === "@link" && id in link) {
          _addFrameOutput(parent, property, link[id]);
          continue;
        }
        const output = { "@id": id };
        if (id.indexOf("_:") === 0) {
          util.addValue(state.bnodeMap, id, output, { propertyIsArray: true });
        }
        link[id] = output;
        if ((flags.embed === "@first" || flags.embed === "@last") && state.is11) {
          throw new JsonLdError(
            "Invalid JSON-LD syntax; invalid value of @embed.",
            "jsonld.SyntaxError",
            { code: "invalid @embed value", frame }
          );
        }
        if (!state.embedded && state.uniqueEmbeds[state.graph].hasOwnProperty(id)) {
          continue;
        }
        if (state.embedded && (flags.embed === "@never" || _createsCircularReference(subject, state.graph, state.subjectStack))) {
          _addFrameOutput(parent, property, output);
          continue;
        }
        if (state.embedded && (flags.embed == "@first" || flags.embed == "@once") && state.uniqueEmbeds[state.graph].hasOwnProperty(id)) {
          _addFrameOutput(parent, property, output);
          continue;
        }
        if (flags.embed === "@last") {
          if (id in state.uniqueEmbeds[state.graph]) {
            _removeEmbed(state, id);
          }
        }
        state.uniqueEmbeds[state.graph][id] = { parent, property };
        state.subjectStack.push({ subject, graph: state.graph });
        if (id in state.graphMap) {
          let recurse = false;
          let subframe = null;
          if (!("@graph" in frame)) {
            recurse = state.graph !== "@merged";
            subframe = {};
          } else {
            subframe = frame["@graph"][0];
            recurse = !(id === "@merged" || id === "@default");
            if (!types.isObject(subframe)) {
              subframe = {};
            }
          }
          if (recurse) {
            api.frame(
              { ...state, graph: id, embedded: false },
              Object.keys(state.graphMap[id]).sort(),
              [subframe],
              output,
              "@graph"
            );
          }
        }
        if ("@included" in frame) {
          api.frame(
            { ...state, embedded: false },
            subjects,
            frame["@included"],
            output,
            "@included"
          );
        }
        for (const prop of Object.keys(subject).sort()) {
          if (isKeyword(prop)) {
            output[prop] = util.clone(subject[prop]);
            if (prop === "@type") {
              for (const type of subject["@type"]) {
                if (type.indexOf("_:") === 0) {
                  util.addValue(
                    state.bnodeMap,
                    type,
                    output,
                    { propertyIsArray: true }
                  );
                }
              }
            }
            continue;
          }
          if (flags.explicit && !(prop in frame)) {
            continue;
          }
          for (const o of subject[prop]) {
            const subframe = prop in frame ? frame[prop] : _createImplicitFrame(flags);
            if (graphTypes.isList(o)) {
              const subframe2 = frame[prop] && frame[prop][0] && frame[prop][0]["@list"] ? frame[prop][0]["@list"] : _createImplicitFrame(flags);
              const list = { "@list": [] };
              _addFrameOutput(output, prop, list);
              const src = o["@list"];
              for (const oo of src) {
                if (graphTypes.isSubjectReference(oo)) {
                  api.frame(
                    { ...state, embedded: true },
                    [oo["@id"]],
                    subframe2,
                    list,
                    "@list"
                  );
                } else {
                  _addFrameOutput(list, "@list", util.clone(oo));
                }
              }
            } else if (graphTypes.isSubjectReference(o)) {
              api.frame(
                { ...state, embedded: true },
                [o["@id"]],
                subframe,
                output,
                prop
              );
            } else if (_valueMatch(subframe[0], o)) {
              _addFrameOutput(output, prop, util.clone(o));
            }
          }
        }
        for (const prop of Object.keys(frame).sort()) {
          if (prop === "@type") {
            if (!types.isObject(frame[prop][0]) || !("@default" in frame[prop][0])) {
              continue;
            }
          } else if (isKeyword(prop)) {
            continue;
          }
          const next = frame[prop][0] || {};
          const omitDefaultOn = _getFrameFlag(next, options, "omitDefault");
          if (!omitDefaultOn && !(prop in output)) {
            let preserve = "@null";
            if ("@default" in next) {
              preserve = util.clone(next["@default"]);
            }
            if (!types.isArray(preserve)) {
              preserve = [preserve];
            }
            output[prop] = [{ "@preserve": preserve }];
          }
        }
        for (const reverseProp of Object.keys(frame["@reverse"] || {}).sort()) {
          const subframe = frame["@reverse"][reverseProp];
          for (const subject2 of Object.keys(state.subjects)) {
            const nodeValues = util.getValues(state.subjects[subject2], reverseProp);
            if (nodeValues.some((v) => v["@id"] === id)) {
              output["@reverse"] = output["@reverse"] || {};
              util.addValue(
                output["@reverse"],
                reverseProp,
                [],
                { propertyIsArray: true }
              );
              api.frame(
                { ...state, embedded: true },
                [subject2],
                subframe,
                output["@reverse"][reverseProp],
                property
              );
            }
          }
        }
        _addFrameOutput(parent, property, output);
        state.subjectStack.pop();
      }
    };
    api.cleanupNull = (input, options) => {
      if (types.isArray(input)) {
        const noNulls = input.map((v) => api.cleanupNull(v, options));
        return noNulls.filter((v) => v);
      }
      if (input === "@null") {
        return null;
      }
      if (types.isObject(input)) {
        if ("@id" in input) {
          const id = input["@id"];
          if (options.link.hasOwnProperty(id)) {
            const idx = options.link[id].indexOf(input);
            if (idx !== -1) {
              return options.link[id][idx];
            }
            options.link[id].push(input);
          } else {
            options.link[id] = [input];
          }
        }
        for (const key in input) {
          input[key] = api.cleanupNull(input[key], options);
        }
      }
      return input;
    };
    function _createImplicitFrame(flags) {
      const frame = {};
      for (const key in flags) {
        if (flags[key] !== void 0) {
          frame["@" + key] = [flags[key]];
        }
      }
      return [frame];
    }
    function _createsCircularReference(subjectToEmbed, graph, subjectStack) {
      for (let i = subjectStack.length - 1; i >= 0; --i) {
        const subject = subjectStack[i];
        if (subject.graph === graph && subject.subject["@id"] === subjectToEmbed["@id"]) {
          return true;
        }
      }
      return false;
    }
    function _getFrameFlag(frame, options, name74) {
      const flag = "@" + name74;
      let rval = flag in frame ? frame[flag][0] : options[name74];
      if (name74 === "embed") {
        if (rval === true) {
          rval = "@once";
        } else if (rval === false) {
          rval = "@never";
        } else if (rval !== "@always" && rval !== "@never" && rval !== "@link" && rval !== "@first" && rval !== "@last" && rval !== "@once") {
          throw new JsonLdError(
            "Invalid JSON-LD syntax; invalid value of @embed.",
            "jsonld.SyntaxError",
            { code: "invalid @embed value", frame }
          );
        }
      }
      return rval;
    }
    function _validateFrame(frame) {
      if (!types.isArray(frame) || frame.length !== 1 || !types.isObject(frame[0])) {
        throw new JsonLdError(
          "Invalid JSON-LD syntax; a JSON-LD frame must be a single object.",
          "jsonld.SyntaxError",
          { frame }
        );
      }
      if ("@id" in frame[0]) {
        for (const id of util.asArray(frame[0]["@id"])) {
          if (!(types.isObject(id) || url.isAbsolute(id)) || types.isString(id) && id.indexOf("_:") === 0) {
            throw new JsonLdError(
              "Invalid JSON-LD syntax; invalid @id in frame.",
              "jsonld.SyntaxError",
              { code: "invalid frame", frame }
            );
          }
        }
      }
      if ("@type" in frame[0]) {
        for (const type of util.asArray(frame[0]["@type"])) {
          if (!(types.isObject(type) || url.isAbsolute(type) || type === "@json") || types.isString(type) && type.indexOf("_:") === 0) {
            throw new JsonLdError(
              "Invalid JSON-LD syntax; invalid @type in frame.",
              "jsonld.SyntaxError",
              { code: "invalid frame", frame }
            );
          }
        }
      }
    }
    function _filterSubjects(state, subjects, frame, flags) {
      const rval = {};
      for (const id of subjects) {
        const subject = state.graphMap[state.graph][id];
        if (_filterSubject(state, subject, frame, flags)) {
          rval[id] = subject;
        }
      }
      return rval;
    }
    function _filterSubject(state, subject, frame, flags) {
      let wildcard = true;
      let matchesSome = false;
      for (const key in frame) {
        let matchThis = false;
        const nodeValues = util.getValues(subject, key);
        const isEmpty = util.getValues(frame, key).length === 0;
        if (key === "@id") {
          if (types.isEmptyObject(frame["@id"][0] || {})) {
            matchThis = true;
          } else if (frame["@id"].length >= 0) {
            matchThis = frame["@id"].includes(nodeValues[0]);
          }
          if (!flags.requireAll) {
            return matchThis;
          }
        } else if (key === "@type") {
          wildcard = false;
          if (isEmpty) {
            if (nodeValues.length > 0) {
              return false;
            }
            matchThis = true;
          } else if (frame["@type"].length === 1 && types.isEmptyObject(frame["@type"][0])) {
            matchThis = nodeValues.length > 0;
          } else {
            for (const type of frame["@type"]) {
              if (types.isObject(type) && "@default" in type) {
                matchThis = true;
              } else {
                matchThis = matchThis || nodeValues.some((tt) => tt === type);
              }
            }
          }
          if (!flags.requireAll) {
            return matchThis;
          }
        } else if (isKeyword(key)) {
          continue;
        } else {
          const thisFrame = util.getValues(frame, key)[0];
          let hasDefault = false;
          if (thisFrame) {
            _validateFrame([thisFrame]);
            hasDefault = "@default" in thisFrame;
          }
          wildcard = false;
          if (nodeValues.length === 0 && hasDefault) {
            continue;
          }
          if (nodeValues.length > 0 && isEmpty) {
            return false;
          }
          if (thisFrame === void 0) {
            if (nodeValues.length > 0) {
              return false;
            }
            matchThis = true;
          } else {
            if (graphTypes.isList(thisFrame)) {
              const listValue = thisFrame["@list"][0];
              if (graphTypes.isList(nodeValues[0])) {
                const nodeListValues = nodeValues[0]["@list"];
                if (graphTypes.isValue(listValue)) {
                  matchThis = nodeListValues.some((lv) => _valueMatch(listValue, lv));
                } else if (graphTypes.isSubject(listValue) || graphTypes.isSubjectReference(listValue)) {
                  matchThis = nodeListValues.some((lv) => _nodeMatch(
                    state,
                    listValue,
                    lv,
                    flags
                  ));
                }
              }
            } else if (graphTypes.isValue(thisFrame)) {
              matchThis = nodeValues.some((nv) => _valueMatch(thisFrame, nv));
            } else if (graphTypes.isSubjectReference(thisFrame)) {
              matchThis = nodeValues.some((nv) => _nodeMatch(state, thisFrame, nv, flags));
            } else if (types.isObject(thisFrame)) {
              matchThis = nodeValues.length > 0;
            } else {
              matchThis = false;
            }
          }
        }
        if (!matchThis && flags.requireAll) {
          return false;
        }
        matchesSome = matchesSome || matchThis;
      }
      return wildcard || matchesSome;
    }
    function _removeEmbed(state, id) {
      const embeds = state.uniqueEmbeds[state.graph];
      const embed = embeds[id];
      const parent = embed.parent;
      const property = embed.property;
      const subject = { "@id": id };
      if (types.isArray(parent)) {
        for (let i = 0; i < parent.length; ++i) {
          if (util.compareValues(parent[i], subject)) {
            parent[i] = subject;
            break;
          }
        }
      } else {
        const useArray = types.isArray(parent[property]);
        util.removeValue(parent, property, subject, { propertyIsArray: useArray });
        util.addValue(parent, property, subject, { propertyIsArray: useArray });
      }
      const removeDependents = (id2) => {
        const ids = Object.keys(embeds);
        for (const next of ids) {
          if (next in embeds && types.isObject(embeds[next].parent) && embeds[next].parent["@id"] === id2) {
            delete embeds[next];
            removeDependents(next);
          }
        }
      };
      removeDependents(id);
    }
    function _cleanupPreserve(input, options) {
      if (types.isArray(input)) {
        return input.map((value) => _cleanupPreserve(value, options));
      }
      if (types.isObject(input)) {
        if ("@preserve" in input) {
          return input["@preserve"][0];
        }
        if (graphTypes.isValue(input)) {
          return input;
        }
        if (graphTypes.isList(input)) {
          input["@list"] = _cleanupPreserve(input["@list"], options);
          return input;
        }
        if ("@id" in input) {
          const id = input["@id"];
          if (options.link.hasOwnProperty(id)) {
            const idx = options.link[id].indexOf(input);
            if (idx !== -1) {
              return options.link[id][idx];
            }
            options.link[id].push(input);
          } else {
            options.link[id] = [input];
          }
        }
        for (const prop in input) {
          if (prop === "@id" && options.bnodesToClear.includes(input[prop])) {
            delete input["@id"];
            continue;
          }
          input[prop] = _cleanupPreserve(input[prop], options);
        }
      }
      return input;
    }
    function _addFrameOutput(parent, property, output) {
      if (types.isObject(parent)) {
        util.addValue(parent, property, output, { propertyIsArray: true });
      } else {
        parent.push(output);
      }
    }
    function _nodeMatch(state, pattern, value, flags) {
      if (!("@id" in value)) {
        return false;
      }
      const nodeObject = state.subjects[value["@id"]];
      return nodeObject && _filterSubject(state, nodeObject, pattern, flags);
    }
    function _valueMatch(pattern, value) {
      const v1 = value["@value"];
      const t1 = value["@type"];
      const l1 = value["@language"];
      const v2 = pattern["@value"] ? types.isArray(pattern["@value"]) ? pattern["@value"] : [pattern["@value"]] : [];
      const t2 = pattern["@type"] ? types.isArray(pattern["@type"]) ? pattern["@type"] : [pattern["@type"]] : [];
      const l2 = pattern["@language"] ? types.isArray(pattern["@language"]) ? pattern["@language"] : [pattern["@language"]] : [];
      if (v2.length === 0 && t2.length === 0 && l2.length === 0) {
        return true;
      }
      if (!(v2.includes(v1) || types.isEmptyObject(v2[0]))) {
        return false;
      }
      if (!(!t1 && t2.length === 0 || t2.includes(t1) || t1 && types.isEmptyObject(t2[0]))) {
        return false;
      }
      if (!(!l1 && l2.length === 0 || l2.includes(l1) || l1 && types.isEmptyObject(l2[0]))) {
        return false;
      }
      return true;
    }
  }
});

// node_modules/jsonld/lib/compact.js
var require_compact = __commonJS({
  "node_modules/jsonld/lib/compact.js"(exports, module) {
    "use strict";
    var JsonLdError = require_JsonLdError();
    var {
      isArray: _isArray,
      isObject: _isObject,
      isString: _isString,
      isUndefined: _isUndefined
    } = require_types();
    var {
      isList: _isList,
      isValue: _isValue,
      isGraph: _isGraph,
      isSimpleGraph: _isSimpleGraph,
      isSubjectReference: _isSubjectReference
    } = require_graphTypes();
    var {
      expandIri: _expandIri,
      getContextValue: _getContextValue,
      isKeyword: _isKeyword,
      process: _processContext,
      processingMode: _processingMode
    } = require_context();
    var {
      removeBase: _removeBase,
      prependBase: _prependBase
    } = require_url();
    var {
      REGEX_KEYWORD,
      addValue: _addValue,
      asArray: _asArray,
      compareShortestLeast: _compareShortestLeast
    } = require_util();
    var api = {};
    module.exports = api;
    api.compact = async ({
      activeCtx,
      activeProperty = null,
      element,
      options = {}
    }) => {
      if (_isArray(element)) {
        let rval = [];
        for (let i = 0; i < element.length; ++i) {
          const compacted = await api.compact({
            activeCtx,
            activeProperty,
            element: element[i],
            options
          });
          if (compacted === null) {
            continue;
          }
          rval.push(compacted);
        }
        if (options.compactArrays && rval.length === 1) {
          const container = _getContextValue(
            activeCtx,
            activeProperty,
            "@container"
          ) || [];
          if (container.length === 0) {
            rval = rval[0];
          }
        }
        return rval;
      }
      const ctx = _getContextValue(activeCtx, activeProperty, "@context");
      if (!_isUndefined(ctx)) {
        activeCtx = await _processContext({
          activeCtx,
          localCtx: ctx,
          propagate: true,
          overrideProtected: true,
          options
        });
      }
      if (_isObject(element)) {
        if (options.link && "@id" in element && options.link.hasOwnProperty(element["@id"])) {
          const linked = options.link[element["@id"]];
          for (let i = 0; i < linked.length; ++i) {
            if (linked[i].expanded === element) {
              return linked[i].compacted;
            }
          }
        }
        if (_isValue(element) || _isSubjectReference(element)) {
          const rval2 = api.compactValue({ activeCtx, activeProperty, value: element, options });
          if (options.link && _isSubjectReference(element)) {
            if (!options.link.hasOwnProperty(element["@id"])) {
              options.link[element["@id"]] = [];
            }
            options.link[element["@id"]].push({ expanded: element, compacted: rval2 });
          }
          return rval2;
        }
        if (_isList(element)) {
          const container = _getContextValue(
            activeCtx,
            activeProperty,
            "@container"
          ) || [];
          if (container.includes("@list")) {
            return api.compact({
              activeCtx,
              activeProperty,
              element: element["@list"],
              options
            });
          }
        }
        const insideReverse = activeProperty === "@reverse";
        const rval = {};
        const inputCtx = activeCtx;
        if (!_isValue(element) && !_isSubjectReference(element)) {
          activeCtx = activeCtx.revertToPreviousContext();
        }
        const propertyScopedCtx = _getContextValue(inputCtx, activeProperty, "@context");
        if (!_isUndefined(propertyScopedCtx)) {
          activeCtx = await _processContext({
            activeCtx,
            localCtx: propertyScopedCtx,
            propagate: true,
            overrideProtected: true,
            options
          });
        }
        if (options.link && "@id" in element) {
          if (!options.link.hasOwnProperty(element["@id"])) {
            options.link[element["@id"]] = [];
          }
          options.link[element["@id"]].push({ expanded: element, compacted: rval });
        }
        let types = element["@type"] || [];
        if (types.length > 1) {
          types = Array.from(types).sort();
        }
        const typeContext = activeCtx;
        for (const type of types) {
          const compactedType = api.compactIri(
            { activeCtx: typeContext, iri: type, relativeTo: { vocab: true } }
          );
          const ctx2 = _getContextValue(inputCtx, compactedType, "@context");
          if (!_isUndefined(ctx2)) {
            activeCtx = await _processContext({
              activeCtx,
              localCtx: ctx2,
              options,
              propagate: false
            });
          }
        }
        const keys = Object.keys(element).sort();
        for (const expandedProperty of keys) {
          const expandedValue = element[expandedProperty];
          if (expandedProperty === "@id") {
            let compactedValue = _asArray(expandedValue).map(
              (expandedIri) => api.compactIri({
                activeCtx,
                iri: expandedIri,
                relativeTo: { vocab: false },
                base: options.base
              })
            );
            if (compactedValue.length === 1) {
              compactedValue = compactedValue[0];
            }
            const alias = api.compactIri(
              { activeCtx, iri: "@id", relativeTo: { vocab: true } }
            );
            rval[alias] = compactedValue;
            continue;
          }
          if (expandedProperty === "@type") {
            let compactedValue = _asArray(expandedValue).map(
              (expandedIri) => api.compactIri({
                activeCtx: inputCtx,
                iri: expandedIri,
                relativeTo: { vocab: true }
              })
            );
            if (compactedValue.length === 1) {
              compactedValue = compactedValue[0];
            }
            const alias = api.compactIri(
              { activeCtx, iri: "@type", relativeTo: { vocab: true } }
            );
            const container = _getContextValue(
              activeCtx,
              alias,
              "@container"
            ) || [];
            const typeAsSet = container.includes("@set") && _processingMode(activeCtx, 1.1);
            const isArray2 = typeAsSet || _isArray(compactedValue) && expandedValue.length === 0;
            _addValue(rval, alias, compactedValue, { propertyIsArray: isArray2 });
            continue;
          }
          if (expandedProperty === "@reverse") {
            const compactedValue = await api.compact({
              activeCtx,
              activeProperty: "@reverse",
              element: expandedValue,
              options
            });
            for (const compactedProperty in compactedValue) {
              if (activeCtx.mappings.has(compactedProperty) && activeCtx.mappings.get(compactedProperty).reverse) {
                const value = compactedValue[compactedProperty];
                const container = _getContextValue(
                  activeCtx,
                  compactedProperty,
                  "@container"
                ) || [];
                const useArray = container.includes("@set") || !options.compactArrays;
                _addValue(
                  rval,
                  compactedProperty,
                  value,
                  { propertyIsArray: useArray }
                );
                delete compactedValue[compactedProperty];
              }
            }
            if (Object.keys(compactedValue).length > 0) {
              const alias = api.compactIri({
                activeCtx,
                iri: expandedProperty,
                relativeTo: { vocab: true }
              });
              _addValue(rval, alias, compactedValue);
            }
            continue;
          }
          if (expandedProperty === "@preserve") {
            const compactedValue = await api.compact({
              activeCtx,
              activeProperty,
              element: expandedValue,
              options
            });
            if (!(_isArray(compactedValue) && compactedValue.length === 0)) {
              _addValue(rval, expandedProperty, compactedValue);
            }
            continue;
          }
          if (expandedProperty === "@index") {
            const container = _getContextValue(
              activeCtx,
              activeProperty,
              "@container"
            ) || [];
            if (container.includes("@index")) {
              continue;
            }
            const alias = api.compactIri({
              activeCtx,
              iri: expandedProperty,
              relativeTo: { vocab: true }
            });
            _addValue(rval, alias, expandedValue);
            continue;
          }
          if (expandedProperty !== "@graph" && expandedProperty !== "@list" && expandedProperty !== "@included" && _isKeyword(expandedProperty)) {
            const alias = api.compactIri({
              activeCtx,
              iri: expandedProperty,
              relativeTo: { vocab: true }
            });
            _addValue(rval, alias, expandedValue);
            continue;
          }
          if (!_isArray(expandedValue)) {
            throw new JsonLdError(
              "JSON-LD expansion error; expanded value must be an array.",
              "jsonld.SyntaxError"
            );
          }
          if (expandedValue.length === 0) {
            const itemActiveProperty = api.compactIri({
              activeCtx,
              iri: expandedProperty,
              value: expandedValue,
              relativeTo: { vocab: true },
              reverse: insideReverse
            });
            const nestProperty = activeCtx.mappings.has(itemActiveProperty) ? activeCtx.mappings.get(itemActiveProperty)["@nest"] : null;
            let nestResult = rval;
            if (nestProperty) {
              _checkNestProperty(activeCtx, nestProperty, options);
              if (!_isObject(rval[nestProperty])) {
                rval[nestProperty] = {};
              }
              nestResult = rval[nestProperty];
            }
            _addValue(
              nestResult,
              itemActiveProperty,
              expandedValue,
              {
                propertyIsArray: true
              }
            );
          }
          for (const expandedItem of expandedValue) {
            const itemActiveProperty = api.compactIri({
              activeCtx,
              iri: expandedProperty,
              value: expandedItem,
              relativeTo: { vocab: true },
              reverse: insideReverse
            });
            const nestProperty = activeCtx.mappings.has(itemActiveProperty) ? activeCtx.mappings.get(itemActiveProperty)["@nest"] : null;
            let nestResult = rval;
            if (nestProperty) {
              _checkNestProperty(activeCtx, nestProperty, options);
              if (!_isObject(rval[nestProperty])) {
                rval[nestProperty] = {};
              }
              nestResult = rval[nestProperty];
            }
            const container = _getContextValue(
              activeCtx,
              itemActiveProperty,
              "@container"
            ) || [];
            const isGraph = _isGraph(expandedItem);
            const isList = _isList(expandedItem);
            let inner;
            if (isList) {
              inner = expandedItem["@list"];
            } else if (isGraph) {
              inner = expandedItem["@graph"];
            }
            let compactedItem = await api.compact({
              activeCtx,
              activeProperty: itemActiveProperty,
              element: isList || isGraph ? inner : expandedItem,
              options
            });
            if (isList) {
              if (!_isArray(compactedItem)) {
                compactedItem = [compactedItem];
              }
              if (!container.includes("@list")) {
                compactedItem = {
                  [api.compactIri({
                    activeCtx,
                    iri: "@list",
                    relativeTo: { vocab: true }
                  })]: compactedItem
                };
                if ("@index" in expandedItem) {
                  compactedItem[api.compactIri({
                    activeCtx,
                    iri: "@index",
                    relativeTo: { vocab: true }
                  })] = expandedItem["@index"];
                }
              } else {
                _addValue(nestResult, itemActiveProperty, compactedItem, {
                  valueIsArray: true,
                  allowDuplicate: true
                });
                continue;
              }
            }
            if (isGraph) {
              if (container.includes("@graph") && (container.includes("@id") || container.includes("@index") && _isSimpleGraph(expandedItem))) {
                let mapObject2;
                if (nestResult.hasOwnProperty(itemActiveProperty)) {
                  mapObject2 = nestResult[itemActiveProperty];
                } else {
                  nestResult[itemActiveProperty] = mapObject2 = {};
                }
                const key = (container.includes("@id") ? expandedItem["@id"] : expandedItem["@index"]) || api.compactIri({
                  activeCtx,
                  iri: "@none",
                  relativeTo: { vocab: true }
                });
                _addValue(
                  mapObject2,
                  key,
                  compactedItem,
                  {
                    propertyIsArray: !options.compactArrays || container.includes("@set")
                  }
                );
              } else if (container.includes("@graph") && _isSimpleGraph(expandedItem)) {
                if (_isArray(compactedItem) && compactedItem.length > 1) {
                  compactedItem = { "@included": compactedItem };
                }
                _addValue(
                  nestResult,
                  itemActiveProperty,
                  compactedItem,
                  {
                    propertyIsArray: !options.compactArrays || container.includes("@set")
                  }
                );
              } else {
                if (_isArray(compactedItem) && compactedItem.length === 1 && options.compactArrays) {
                  compactedItem = compactedItem[0];
                }
                compactedItem = {
                  [api.compactIri({
                    activeCtx,
                    iri: "@graph",
                    relativeTo: { vocab: true }
                  })]: compactedItem
                };
                if ("@id" in expandedItem) {
                  compactedItem[api.compactIri({
                    activeCtx,
                    iri: "@id",
                    relativeTo: { vocab: true }
                  })] = expandedItem["@id"];
                }
                if ("@index" in expandedItem) {
                  compactedItem[api.compactIri({
                    activeCtx,
                    iri: "@index",
                    relativeTo: { vocab: true }
                  })] = expandedItem["@index"];
                }
                _addValue(
                  nestResult,
                  itemActiveProperty,
                  compactedItem,
                  {
                    propertyIsArray: !options.compactArrays || container.includes("@set")
                  }
                );
              }
            } else if (container.includes("@language") || container.includes("@index") || container.includes("@id") || container.includes("@type")) {
              let mapObject2;
              if (nestResult.hasOwnProperty(itemActiveProperty)) {
                mapObject2 = nestResult[itemActiveProperty];
              } else {
                nestResult[itemActiveProperty] = mapObject2 = {};
              }
              let key;
              if (container.includes("@language")) {
                if (_isValue(compactedItem)) {
                  compactedItem = compactedItem["@value"];
                }
                key = expandedItem["@language"];
              } else if (container.includes("@index")) {
                const indexKey = _getContextValue(
                  activeCtx,
                  itemActiveProperty,
                  "@index"
                ) || "@index";
                const containerKey = api.compactIri(
                  { activeCtx, iri: indexKey, relativeTo: { vocab: true } }
                );
                if (indexKey === "@index") {
                  key = expandedItem["@index"];
                  delete compactedItem[containerKey];
                } else {
                  let others;
                  [key, ...others] = _asArray(compactedItem[indexKey] || []);
                  if (!_isString(key)) {
                    key = null;
                  } else {
                    switch (others.length) {
                      case 0:
                        delete compactedItem[indexKey];
                        break;
                      case 1:
                        compactedItem[indexKey] = others[0];
                        break;
                      default:
                        compactedItem[indexKey] = others;
                        break;
                    }
                  }
                }
              } else if (container.includes("@id")) {
                const idKey = api.compactIri({
                  activeCtx,
                  iri: "@id",
                  relativeTo: { vocab: true }
                });
                key = compactedItem[idKey];
                delete compactedItem[idKey];
              } else if (container.includes("@type")) {
                const typeKey = api.compactIri({
                  activeCtx,
                  iri: "@type",
                  relativeTo: { vocab: true }
                });
                let types2;
                [key, ...types2] = _asArray(compactedItem[typeKey] || []);
                switch (types2.length) {
                  case 0:
                    delete compactedItem[typeKey];
                    break;
                  case 1:
                    compactedItem[typeKey] = types2[0];
                    break;
                  default:
                    compactedItem[typeKey] = types2;
                    break;
                }
                if (Object.keys(compactedItem).length === 1 && "@id" in expandedItem) {
                  compactedItem = await api.compact({
                    activeCtx,
                    activeProperty: itemActiveProperty,
                    element: { "@id": expandedItem["@id"] },
                    options
                  });
                }
              }
              if (!key) {
                key = api.compactIri({
                  activeCtx,
                  iri: "@none",
                  relativeTo: { vocab: true }
                });
              }
              _addValue(
                mapObject2,
                key,
                compactedItem,
                {
                  propertyIsArray: container.includes("@set")
                }
              );
            } else {
              const isArray2 = !options.compactArrays || container.includes("@set") || container.includes("@list") || _isArray(compactedItem) && compactedItem.length === 0 || expandedProperty === "@list" || expandedProperty === "@graph";
              _addValue(
                nestResult,
                itemActiveProperty,
                compactedItem,
                { propertyIsArray: isArray2 }
              );
            }
          }
        }
        return rval;
      }
      return element;
    };
    api.compactIri = ({
      activeCtx,
      iri,
      value = null,
      relativeTo = { vocab: false },
      reverse = false,
      base = null
    }) => {
      if (iri === null) {
        return iri;
      }
      if (activeCtx.isPropertyTermScoped && activeCtx.previousContext) {
        activeCtx = activeCtx.previousContext;
      }
      const inverseCtx = activeCtx.getInverse();
      if (_isKeyword(iri) && iri in inverseCtx && "@none" in inverseCtx[iri] && "@type" in inverseCtx[iri]["@none"] && "@none" in inverseCtx[iri]["@none"]["@type"]) {
        return inverseCtx[iri]["@none"]["@type"]["@none"];
      }
      if (relativeTo.vocab && iri in inverseCtx) {
        const defaultLanguage = activeCtx["@language"] || "@none";
        const containers = [];
        if (_isObject(value) && "@index" in value && !("@graph" in value)) {
          containers.push("@index", "@index@set");
        }
        if (_isObject(value) && "@preserve" in value) {
          value = value["@preserve"][0];
        }
        if (_isGraph(value)) {
          if ("@index" in value) {
            containers.push(
              "@graph@index",
              "@graph@index@set",
              "@index",
              "@index@set"
            );
          }
          if ("@id" in value) {
            containers.push(
              "@graph@id",
              "@graph@id@set"
            );
          }
          containers.push("@graph", "@graph@set", "@set");
          if (!("@index" in value)) {
            containers.push(
              "@graph@index",
              "@graph@index@set",
              "@index",
              "@index@set"
            );
          }
          if (!("@id" in value)) {
            containers.push("@graph@id", "@graph@id@set");
          }
        } else if (_isObject(value) && !_isValue(value)) {
          containers.push("@id", "@id@set", "@type", "@set@type");
        }
        let typeOrLanguage = "@language";
        let typeOrLanguageValue = "@null";
        if (reverse) {
          typeOrLanguage = "@type";
          typeOrLanguageValue = "@reverse";
          containers.push("@set");
        } else if (_isList(value)) {
          if (!("@index" in value)) {
            containers.push("@list");
          }
          const list = value["@list"];
          if (list.length === 0) {
            typeOrLanguage = "@any";
            typeOrLanguageValue = "@none";
          } else {
            let commonLanguage = list.length === 0 ? defaultLanguage : null;
            let commonType = null;
            for (let i = 0; i < list.length; ++i) {
              const item = list[i];
              let itemLanguage = "@none";
              let itemType = "@none";
              if (_isValue(item)) {
                if ("@direction" in item) {
                  const lang = (item["@language"] || "").toLowerCase();
                  const dir = item["@direction"];
                  itemLanguage = `${lang}_${dir}`;
                } else if ("@language" in item) {
                  itemLanguage = item["@language"].toLowerCase();
                } else if ("@type" in item) {
                  itemType = item["@type"];
                } else {
                  itemLanguage = "@null";
                }
              } else {
                itemType = "@id";
              }
              if (commonLanguage === null) {
                commonLanguage = itemLanguage;
              } else if (itemLanguage !== commonLanguage && _isValue(item)) {
                commonLanguage = "@none";
              }
              if (commonType === null) {
                commonType = itemType;
              } else if (itemType !== commonType) {
                commonType = "@none";
              }
              if (commonLanguage === "@none" && commonType === "@none") {
                break;
              }
            }
            commonLanguage = commonLanguage || "@none";
            commonType = commonType || "@none";
            if (commonType !== "@none") {
              typeOrLanguage = "@type";
              typeOrLanguageValue = commonType;
            } else {
              typeOrLanguageValue = commonLanguage;
            }
          }
        } else {
          if (_isValue(value)) {
            if ("@language" in value && !("@index" in value)) {
              containers.push("@language", "@language@set");
              typeOrLanguageValue = value["@language"];
              const dir = value["@direction"];
              if (dir) {
                typeOrLanguageValue = `${typeOrLanguageValue}_${dir}`;
              }
            } else if ("@direction" in value && !("@index" in value)) {
              typeOrLanguageValue = `_${value["@direction"]}`;
            } else if ("@type" in value) {
              typeOrLanguage = "@type";
              typeOrLanguageValue = value["@type"];
            }
          } else {
            typeOrLanguage = "@type";
            typeOrLanguageValue = "@id";
          }
          containers.push("@set");
        }
        containers.push("@none");
        if (_isObject(value) && !("@index" in value)) {
          containers.push("@index", "@index@set");
        }
        if (_isValue(value) && Object.keys(value).length === 1) {
          containers.push("@language", "@language@set");
        }
        const term = _selectTerm(
          activeCtx,
          iri,
          value,
          containers,
          typeOrLanguage,
          typeOrLanguageValue
        );
        if (term !== null) {
          return term;
        }
      }
      if (relativeTo.vocab) {
        if ("@vocab" in activeCtx) {
          const vocab = activeCtx["@vocab"];
          if (iri.indexOf(vocab) === 0 && iri !== vocab) {
            const suffix = iri.substr(vocab.length);
            if (!activeCtx.mappings.has(suffix)) {
              return suffix;
            }
          }
        }
      }
      let choice = null;
      const partialMatches = [];
      let iriMap = activeCtx.fastCurieMap;
      const maxPartialLength = iri.length - 1;
      for (let i = 0; i < maxPartialLength && iri[i] in iriMap; ++i) {
        iriMap = iriMap[iri[i]];
        if ("" in iriMap) {
          partialMatches.push(iriMap[""][0]);
        }
      }
      for (let i = partialMatches.length - 1; i >= 0; --i) {
        const entry = partialMatches[i];
        const terms = entry.terms;
        for (const term of terms) {
          const curie = term + ":" + iri.substr(entry.iri.length);
          const isUsableCurie = activeCtx.mappings.get(term)._prefix && (!activeCtx.mappings.has(curie) || value === null && activeCtx.mappings.get(curie)["@id"] === iri);
          if (isUsableCurie && (choice === null || _compareShortestLeast(curie, choice) < 0)) {
            choice = curie;
          }
        }
      }
      if (choice !== null) {
        return choice;
      }
      for (const [term, td] of activeCtx.mappings) {
        if (td && td._prefix && iri.startsWith(term + ":")) {
          throw new JsonLdError(
            `Absolute IRI "${iri}" confused with prefix "${term}".`,
            "jsonld.SyntaxError",
            { code: "IRI confused with prefix", context: activeCtx }
          );
        }
      }
      if (!relativeTo.vocab) {
        if ("@base" in activeCtx) {
          if (!activeCtx["@base"]) {
            return iri;
          } else {
            const _iri = _removeBase(_prependBase(base, activeCtx["@base"]), iri);
            return REGEX_KEYWORD.test(_iri) ? `./${_iri}` : _iri;
          }
        } else {
          return _removeBase(base, iri);
        }
      }
      return iri;
    };
    api.compactValue = ({ activeCtx, activeProperty, value, options }) => {
      if (_isValue(value)) {
        const type2 = _getContextValue(activeCtx, activeProperty, "@type");
        const language = _getContextValue(activeCtx, activeProperty, "@language");
        const direction = _getContextValue(activeCtx, activeProperty, "@direction");
        const container = _getContextValue(activeCtx, activeProperty, "@container") || [];
        const preserveIndex = "@index" in value && !container.includes("@index");
        if (!preserveIndex && type2 !== "@none") {
          if (value["@type"] === type2) {
            return value["@value"];
          }
          if ("@language" in value && value["@language"] === language && "@direction" in value && value["@direction"] === direction) {
            return value["@value"];
          }
          if ("@language" in value && value["@language"] === language) {
            return value["@value"];
          }
          if ("@direction" in value && value["@direction"] === direction) {
            return value["@value"];
          }
        }
        const keyCount = Object.keys(value).length;
        const isValueOnlyKey = keyCount === 1 || keyCount === 2 && "@index" in value && !preserveIndex;
        const hasDefaultLanguage = "@language" in activeCtx;
        const isValueString = _isString(value["@value"]);
        const hasNullMapping = activeCtx.mappings.has(activeProperty) && activeCtx.mappings.get(activeProperty)["@language"] === null;
        if (isValueOnlyKey && type2 !== "@none" && (!hasDefaultLanguage || !isValueString || hasNullMapping)) {
          return value["@value"];
        }
        const rval = {};
        if (preserveIndex) {
          rval[api.compactIri({
            activeCtx,
            iri: "@index",
            relativeTo: { vocab: true }
          })] = value["@index"];
        }
        if ("@type" in value) {
          rval[api.compactIri({
            activeCtx,
            iri: "@type",
            relativeTo: { vocab: true }
          })] = api.compactIri(
            { activeCtx, iri: value["@type"], relativeTo: { vocab: true } }
          );
        } else if ("@language" in value) {
          rval[api.compactIri({
            activeCtx,
            iri: "@language",
            relativeTo: { vocab: true }
          })] = value["@language"];
        }
        if ("@direction" in value) {
          rval[api.compactIri({
            activeCtx,
            iri: "@direction",
            relativeTo: { vocab: true }
          })] = value["@direction"];
        }
        rval[api.compactIri({
          activeCtx,
          iri: "@value",
          relativeTo: { vocab: true }
        })] = value["@value"];
        return rval;
      }
      const expandedProperty = _expandIri(
        activeCtx,
        activeProperty,
        { vocab: true },
        options
      );
      const type = _getContextValue(activeCtx, activeProperty, "@type");
      const compacted = api.compactIri({
        activeCtx,
        iri: value["@id"],
        relativeTo: { vocab: type === "@vocab" },
        base: options.base
      });
      if (type === "@id" || type === "@vocab" || expandedProperty === "@graph") {
        return compacted;
      }
      return {
        [api.compactIri({
          activeCtx,
          iri: "@id",
          relativeTo: { vocab: true }
        })]: compacted
      };
    };
    function _selectTerm(activeCtx, iri, value, containers, typeOrLanguage, typeOrLanguageValue) {
      if (typeOrLanguageValue === null) {
        typeOrLanguageValue = "@null";
      }
      const prefs = [];
      if ((typeOrLanguageValue === "@id" || typeOrLanguageValue === "@reverse") && _isObject(value) && "@id" in value) {
        if (typeOrLanguageValue === "@reverse") {
          prefs.push("@reverse");
        }
        const term = api.compactIri(
          { activeCtx, iri: value["@id"], relativeTo: { vocab: true } }
        );
        if (activeCtx.mappings.has(term) && activeCtx.mappings.get(term) && activeCtx.mappings.get(term)["@id"] === value["@id"]) {
          prefs.push.apply(prefs, ["@vocab", "@id"]);
        } else {
          prefs.push.apply(prefs, ["@id", "@vocab"]);
        }
      } else {
        prefs.push(typeOrLanguageValue);
        const langDir = prefs.find((el) => el.includes("_"));
        if (langDir) {
          prefs.push(langDir.replace(/^[^_]+_/, "_"));
        }
      }
      prefs.push("@none");
      const containerMap = activeCtx.inverse[iri];
      for (const container of containers) {
        if (!(container in containerMap)) {
          continue;
        }
        const typeOrLanguageValueMap = containerMap[container][typeOrLanguage];
        for (const pref of prefs) {
          if (!(pref in typeOrLanguageValueMap)) {
            continue;
          }
          return typeOrLanguageValueMap[pref];
        }
      }
      return null;
    }
    function _checkNestProperty(activeCtx, nestProperty, options) {
      if (_expandIri(activeCtx, nestProperty, { vocab: true }, options) !== "@nest") {
        throw new JsonLdError(
          "JSON-LD compact error; nested property must have an @nest value resolving to @nest.",
          "jsonld.SyntaxError",
          { code: "invalid @nest value" }
        );
      }
    }
  }
});

// node_modules/jsonld/lib/JsonLdProcessor.js
var require_JsonLdProcessor = __commonJS({
  "node_modules/jsonld/lib/JsonLdProcessor.js"(exports, module) {
    "use strict";
    module.exports = (jsonld2) => {
      class JsonLdProcessor {
        toString() {
          return "[object JsonLdProcessor]";
        }
      }
      Object.defineProperty(JsonLdProcessor, "prototype", {
        writable: false,
        enumerable: false
      });
      Object.defineProperty(JsonLdProcessor.prototype, "constructor", {
        writable: true,
        enumerable: false,
        configurable: true,
        value: JsonLdProcessor
      });
      JsonLdProcessor.compact = function(input, ctx) {
        if (arguments.length < 2) {
          return Promise.reject(
            new TypeError("Could not compact, too few arguments.")
          );
        }
        return jsonld2.compact(input, ctx);
      };
      JsonLdProcessor.expand = function(input) {
        if (arguments.length < 1) {
          return Promise.reject(
            new TypeError("Could not expand, too few arguments.")
          );
        }
        return jsonld2.expand(input);
      };
      JsonLdProcessor.flatten = function(input) {
        if (arguments.length < 1) {
          return Promise.reject(
            new TypeError("Could not flatten, too few arguments.")
          );
        }
        return jsonld2.flatten(input);
      };
      return JsonLdProcessor;
    };
  }
});

// node_modules/jsonld/lib/jsonld.js
var require_jsonld = __commonJS({
  "node_modules/jsonld/lib/jsonld.js"(exports, module) {
    var canonize = require_rdf_canonize();
    var platform = require_platform_browser();
    var util = require_util();
    var ContextResolver = require_ContextResolver();
    var IdentifierIssuer = util.IdentifierIssuer;
    var JsonLdError = require_JsonLdError();
    var LRU = require_lru_cache();
    var NQuads = require_NQuads2();
    var { expand: _expand } = require_expand();
    var { flatten: _flatten } = require_flatten();
    var { fromRDF: _fromRDF } = require_fromRdf();
    var { toRDF: _toRDF } = require_toRdf();
    var {
      frameMergedOrDefault: _frameMergedOrDefault,
      cleanupNull: _cleanupNull
    } = require_frame();
    var {
      isArray: _isArray,
      isObject: _isObject,
      isString: _isString
    } = require_types();
    var {
      isSubjectReference: _isSubjectReference
    } = require_graphTypes();
    var {
      expandIri: _expandIri,
      getInitialContext: _getInitialContext,
      process: _processContext,
      processingMode: _processingMode
    } = require_context();
    var {
      compact: _compact,
      compactIri: _compactIri
    } = require_compact();
    var {
      createNodeMap: _createNodeMap,
      createMergedNodeMap: _createMergedNodeMap,
      mergeNodeMaps: _mergeNodeMaps
    } = require_nodeMap();
    var {
      logEventHandler: _logEventHandler,
      logWarningEventHandler: _logWarningEventHandler,
      safeEventHandler: _safeEventHandler,
      setDefaultEventHandler: _setDefaultEventHandler,
      setupEventHandler: _setupEventHandler,
      strictEventHandler: _strictEventHandler,
      unhandledEventHandler: _unhandledEventHandler
    } = require_events();
    var wrapper = function(jsonld2) {
      const _rdfParsers = {};
      const RESOLVED_CONTEXT_CACHE_MAX_SIZE = 100;
      const _resolvedContextCache = new LRU({ max: RESOLVED_CONTEXT_CACHE_MAX_SIZE });
      jsonld2.compact = async function(input, ctx, options) {
        if (arguments.length < 2) {
          throw new TypeError("Could not compact, too few arguments.");
        }
        if (ctx === null) {
          throw new JsonLdError(
            "The compaction context must not be null.",
            "jsonld.CompactError",
            { code: "invalid local context" }
          );
        }
        if (input === null) {
          return null;
        }
        options = _setDefaults(options, {
          base: _isString(input) ? input : "",
          compactArrays: true,
          compactToRelative: true,
          graph: false,
          skipExpansion: false,
          link: false,
          issuer: new IdentifierIssuer("_:b"),
          contextResolver: new ContextResolver(
            { sharedCache: _resolvedContextCache }
          )
        });
        if (options.link) {
          options.skipExpansion = true;
        }
        if (!options.compactToRelative) {
          delete options.base;
        }
        let expanded;
        if (options.skipExpansion) {
          expanded = input;
        } else {
          expanded = await jsonld2.expand(input, options);
        }
        const activeCtx = await jsonld2.processContext(
          _getInitialContext(options),
          ctx,
          options
        );
        let compacted = await _compact({
          activeCtx,
          element: expanded,
          options
        });
        if (options.compactArrays && !options.graph && _isArray(compacted)) {
          if (compacted.length === 1) {
            compacted = compacted[0];
          } else if (compacted.length === 0) {
            compacted = {};
          }
        } else if (options.graph && _isObject(compacted)) {
          compacted = [compacted];
        }
        if (_isObject(ctx) && "@context" in ctx) {
          ctx = ctx["@context"];
        }
        ctx = util.clone(ctx);
        if (!_isArray(ctx)) {
          ctx = [ctx];
        }
        const tmp = ctx;
        ctx = [];
        for (let i = 0; i < tmp.length; ++i) {
          if (!_isObject(tmp[i]) || Object.keys(tmp[i]).length > 0) {
            ctx.push(tmp[i]);
          }
        }
        const hasContext = ctx.length > 0;
        if (ctx.length === 1) {
          ctx = ctx[0];
        }
        if (_isArray(compacted)) {
          const graphAlias = _compactIri({
            activeCtx,
            iri: "@graph",
            relativeTo: { vocab: true }
          });
          const graph = compacted;
          compacted = {};
          if (hasContext) {
            compacted["@context"] = ctx;
          }
          compacted[graphAlias] = graph;
        } else if (_isObject(compacted) && hasContext) {
          const graph = compacted;
          compacted = { "@context": ctx };
          for (const key in graph) {
            compacted[key] = graph[key];
          }
        }
        return compacted;
      };
      jsonld2.expand = async function(input, options) {
        if (arguments.length < 1) {
          throw new TypeError("Could not expand, too few arguments.");
        }
        options = _setDefaults(options, {
          keepFreeFloatingNodes: false,
          contextResolver: new ContextResolver(
            { sharedCache: _resolvedContextCache }
          )
        });
        const toResolve = {};
        const contextsToProcess = [];
        if ("expandContext" in options) {
          const expandContext = util.clone(options.expandContext);
          if (_isObject(expandContext) && "@context" in expandContext) {
            toResolve.expandContext = expandContext;
          } else {
            toResolve.expandContext = { "@context": expandContext };
          }
          contextsToProcess.push(toResolve.expandContext);
        }
        let defaultBase;
        if (!_isString(input)) {
          toResolve.input = util.clone(input);
        } else {
          const remoteDoc = await jsonld2.get(input, options);
          defaultBase = remoteDoc.documentUrl;
          toResolve.input = remoteDoc.document;
          if (remoteDoc.contextUrl) {
            toResolve.remoteContext = { "@context": remoteDoc.contextUrl };
            contextsToProcess.push(toResolve.remoteContext);
          }
        }
        if (!("base" in options)) {
          options.base = defaultBase || "";
        }
        let activeCtx = _getInitialContext(options);
        for (const localCtx of contextsToProcess) {
          activeCtx = await _processContext({ activeCtx, localCtx, options });
        }
        let expanded = await _expand({
          activeCtx,
          element: toResolve.input,
          options
        });
        if (_isObject(expanded) && "@graph" in expanded && Object.keys(expanded).length === 1) {
          expanded = expanded["@graph"];
        } else if (expanded === null) {
          expanded = [];
        }
        if (!_isArray(expanded)) {
          expanded = [expanded];
        }
        return expanded;
      };
      jsonld2.flatten = async function(input, ctx, options) {
        if (arguments.length < 1) {
          return new TypeError("Could not flatten, too few arguments.");
        }
        if (typeof ctx === "function") {
          ctx = null;
        } else {
          ctx = ctx || null;
        }
        options = _setDefaults(options, {
          base: _isString(input) ? input : "",
          contextResolver: new ContextResolver(
            { sharedCache: _resolvedContextCache }
          )
        });
        const expanded = await jsonld2.expand(input, options);
        const flattened = _flatten(expanded);
        if (ctx === null) {
          return flattened;
        }
        options.graph = true;
        options.skipExpansion = true;
        const compacted = await jsonld2.compact(flattened, ctx, options);
        return compacted;
      };
      jsonld2.frame = async function(input, frame, options) {
        if (arguments.length < 2) {
          throw new TypeError("Could not frame, too few arguments.");
        }
        options = _setDefaults(options, {
          base: _isString(input) ? input : "",
          embed: "@once",
          explicit: false,
          requireAll: false,
          omitDefault: false,
          bnodesToClear: [],
          contextResolver: new ContextResolver(
            { sharedCache: _resolvedContextCache }
          )
        });
        if (_isString(frame)) {
          const remoteDoc = await jsonld2.get(frame, options);
          frame = remoteDoc.document;
          if (remoteDoc.contextUrl) {
            let ctx = frame["@context"];
            if (!ctx) {
              ctx = remoteDoc.contextUrl;
            } else if (_isArray(ctx)) {
              ctx.push(remoteDoc.contextUrl);
            } else {
              ctx = [ctx, remoteDoc.contextUrl];
            }
            frame["@context"] = ctx;
          }
        }
        const frameContext = frame ? frame["@context"] || {} : {};
        const activeCtx = await jsonld2.processContext(
          _getInitialContext(options),
          frameContext,
          options
        );
        if (!options.hasOwnProperty("omitGraph")) {
          options.omitGraph = _processingMode(activeCtx, 1.1);
        }
        if (!options.hasOwnProperty("pruneBlankNodeIdentifiers")) {
          options.pruneBlankNodeIdentifiers = _processingMode(activeCtx, 1.1);
        }
        const expanded = await jsonld2.expand(input, options);
        const opts = { ...options };
        opts.isFrame = true;
        opts.keepFreeFloatingNodes = true;
        const expandedFrame = await jsonld2.expand(frame, opts);
        const frameKeys = Object.keys(frame).map((key) => _expandIri(activeCtx, key, { vocab: true }));
        opts.merged = !frameKeys.includes("@graph");
        opts.is11 = _processingMode(activeCtx, 1.1);
        const framed = _frameMergedOrDefault(expanded, expandedFrame, opts);
        opts.graph = !options.omitGraph;
        opts.skipExpansion = true;
        opts.link = {};
        opts.framing = true;
        let compacted = await jsonld2.compact(framed, frameContext, opts);
        opts.link = {};
        compacted = _cleanupNull(compacted, opts);
        return compacted;
      };
      jsonld2.link = async function(input, ctx, options) {
        const frame = {};
        if (ctx) {
          frame["@context"] = ctx;
        }
        frame["@embed"] = "@link";
        return jsonld2.frame(input, frame, options);
      };
      jsonld2.normalize = jsonld2.canonize = async function(input, options) {
        if (arguments.length < 1) {
          throw new TypeError("Could not canonize, too few arguments.");
        }
        options = _setDefaults(options, {
          base: _isString(input) ? input : null,
          algorithm: "URDNA2015",
          skipExpansion: false,
          safe: true,
          contextResolver: new ContextResolver(
            { sharedCache: _resolvedContextCache }
          )
        });
        if ("inputFormat" in options) {
          if (options.inputFormat !== "application/n-quads" && options.inputFormat !== "application/nquads") {
            throw new JsonLdError(
              "Unknown canonicalization input format.",
              "jsonld.CanonizeError"
            );
          }
          const parsedInput = NQuads.parse(input);
          return canonize.canonize(parsedInput, options);
        }
        const opts = { ...options };
        delete opts.format;
        opts.produceGeneralizedRdf = false;
        const dataset = await jsonld2.toRDF(input, opts);
        return canonize.canonize(dataset, options);
      };
      jsonld2.fromRDF = async function(dataset, options) {
        if (arguments.length < 1) {
          throw new TypeError("Could not convert from RDF, too few arguments.");
        }
        options = _setDefaults(options, {
          format: _isString(dataset) ? "application/n-quads" : void 0
        });
        const { format: format4 } = options;
        let { rdfParser } = options;
        if (format4) {
          rdfParser = rdfParser || _rdfParsers[format4];
          if (!rdfParser) {
            throw new JsonLdError(
              "Unknown input format.",
              "jsonld.UnknownFormat",
              { format: format4 }
            );
          }
        } else {
          rdfParser = () => dataset;
        }
        const parsedDataset = await rdfParser(dataset);
        return _fromRDF(parsedDataset, options);
      };
      jsonld2.toRDF = async function(input, options) {
        if (arguments.length < 1) {
          throw new TypeError("Could not convert to RDF, too few arguments.");
        }
        options = _setDefaults(options, {
          base: _isString(input) ? input : "",
          skipExpansion: false,
          contextResolver: new ContextResolver(
            { sharedCache: _resolvedContextCache }
          )
        });
        let expanded;
        if (options.skipExpansion) {
          expanded = input;
        } else {
          expanded = await jsonld2.expand(input, options);
        }
        const dataset = _toRDF(expanded, options);
        if (options.format) {
          if (options.format === "application/n-quads" || options.format === "application/nquads") {
            return NQuads.serialize(dataset);
          }
          throw new JsonLdError(
            "Unknown output format.",
            "jsonld.UnknownFormat",
            { format: options.format }
          );
        }
        return dataset;
      };
      jsonld2.createNodeMap = async function(input, options) {
        if (arguments.length < 1) {
          throw new TypeError("Could not create node map, too few arguments.");
        }
        options = _setDefaults(options, {
          base: _isString(input) ? input : "",
          contextResolver: new ContextResolver(
            { sharedCache: _resolvedContextCache }
          )
        });
        const expanded = await jsonld2.expand(input, options);
        return _createMergedNodeMap(expanded, options);
      };
      jsonld2.merge = async function(docs, ctx, options) {
        if (arguments.length < 1) {
          throw new TypeError("Could not merge, too few arguments.");
        }
        if (!_isArray(docs)) {
          throw new TypeError('Could not merge, "docs" must be an array.');
        }
        if (typeof ctx === "function") {
          ctx = null;
        } else {
          ctx = ctx || null;
        }
        options = _setDefaults(options, {
          contextResolver: new ContextResolver(
            { sharedCache: _resolvedContextCache }
          )
        });
        const expanded = await Promise.all(docs.map((doc) => {
          const opts = { ...options };
          return jsonld2.expand(doc, opts);
        }));
        let mergeNodes = true;
        if ("mergeNodes" in options) {
          mergeNodes = options.mergeNodes;
        }
        const issuer = options.issuer || new IdentifierIssuer("_:b");
        const graphs = { "@default": {} };
        for (let i = 0; i < expanded.length; ++i) {
          const doc = util.relabelBlankNodes(expanded[i], {
            issuer: new IdentifierIssuer("_:b" + i + "-")
          });
          const _graphs = mergeNodes || i === 0 ? graphs : { "@default": {} };
          _createNodeMap(doc, _graphs, "@default", issuer);
          if (_graphs !== graphs) {
            for (const graphName in _graphs) {
              const _nodeMap = _graphs[graphName];
              if (!(graphName in graphs)) {
                graphs[graphName] = _nodeMap;
                continue;
              }
              const nodeMap = graphs[graphName];
              for (const key in _nodeMap) {
                if (!(key in nodeMap)) {
                  nodeMap[key] = _nodeMap[key];
                }
              }
            }
          }
        }
        const defaultGraph = _mergeNodeMaps(graphs);
        const flattened = [];
        const keys = Object.keys(defaultGraph).sort();
        for (let ki = 0; ki < keys.length; ++ki) {
          const node = defaultGraph[keys[ki]];
          if (!_isSubjectReference(node)) {
            flattened.push(node);
          }
        }
        if (ctx === null) {
          return flattened;
        }
        options.graph = true;
        options.skipExpansion = true;
        const compacted = await jsonld2.compact(flattened, ctx, options);
        return compacted;
      };
      Object.defineProperty(jsonld2, "documentLoader", {
        get: () => jsonld2._documentLoader,
        set: (v) => jsonld2._documentLoader = v
      });
      jsonld2.documentLoader = async (url) => {
        throw new JsonLdError(
          "Could not retrieve a JSON-LD document from the URL. URL dereferencing not implemented.",
          "jsonld.LoadDocumentError",
          { code: "loading document failed", url }
        );
      };
      jsonld2.get = async function(url, options) {
        let load;
        if (typeof options.documentLoader === "function") {
          load = options.documentLoader;
        } else {
          load = jsonld2.documentLoader;
        }
        const remoteDoc = await load(url);
        try {
          if (!remoteDoc.document) {
            throw new JsonLdError(
              "No remote document found at the given URL.",
              "jsonld.NullRemoteDocument"
            );
          }
          if (_isString(remoteDoc.document)) {
            remoteDoc.document = JSON.parse(remoteDoc.document);
          }
        } catch (e) {
          throw new JsonLdError(
            "Could not retrieve a JSON-LD document from the URL.",
            "jsonld.LoadDocumentError",
            {
              code: "loading document failed",
              cause: e,
              remoteDoc
            }
          );
        }
        return remoteDoc;
      };
      jsonld2.processContext = async function(activeCtx, localCtx, options) {
        options = _setDefaults(options, {
          base: "",
          contextResolver: new ContextResolver(
            { sharedCache: _resolvedContextCache }
          )
        });
        if (localCtx === null) {
          return _getInitialContext(options);
        }
        localCtx = util.clone(localCtx);
        if (!(_isObject(localCtx) && "@context" in localCtx)) {
          localCtx = { "@context": localCtx };
        }
        return _processContext({ activeCtx, localCtx, options });
      };
      jsonld2.getContextValue = require_context().getContextValue;
      jsonld2.documentLoaders = {};
      jsonld2.useDocumentLoader = function(type) {
        if (!(type in jsonld2.documentLoaders)) {
          throw new JsonLdError(
            'Unknown document loader type: "' + type + '"',
            "jsonld.UnknownDocumentLoader",
            { type }
          );
        }
        jsonld2.documentLoader = jsonld2.documentLoaders[type].apply(
          jsonld2,
          Array.prototype.slice.call(arguments, 1)
        );
      };
      jsonld2.registerRDFParser = function(contentType, parser) {
        _rdfParsers[contentType] = parser;
      };
      jsonld2.unregisterRDFParser = function(contentType) {
        delete _rdfParsers[contentType];
      };
      jsonld2.registerRDFParser("application/n-quads", NQuads.parse);
      jsonld2.registerRDFParser("application/nquads", NQuads.parse);
      jsonld2.url = require_url();
      jsonld2.logEventHandler = _logEventHandler;
      jsonld2.logWarningEventHandler = _logWarningEventHandler;
      jsonld2.safeEventHandler = _safeEventHandler;
      jsonld2.setDefaultEventHandler = _setDefaultEventHandler;
      jsonld2.strictEventHandler = _strictEventHandler;
      jsonld2.unhandledEventHandler = _unhandledEventHandler;
      jsonld2.util = util;
      Object.assign(jsonld2, util);
      jsonld2.promises = jsonld2;
      jsonld2.RequestQueue = require_RequestQueue();
      jsonld2.JsonLdProcessor = require_JsonLdProcessor()(jsonld2);
      platform.setupGlobals(jsonld2);
      platform.setupDocumentLoaders(jsonld2);
      function _setDefaults(options, {
        documentLoader = jsonld2.documentLoader,
        ...defaults
      }) {
        if (options && "compactionMap" in options) {
          throw new JsonLdError(
            '"compactionMap" not supported.',
            "jsonld.OptionsError"
          );
        }
        if (options && "expansionMap" in options) {
          throw new JsonLdError(
            '"expansionMap" not supported.',
            "jsonld.OptionsError"
          );
        }
        return Object.assign(
          {},
          { documentLoader },
          defaults,
          options,
          { eventHandler: _setupEventHandler({ options }) }
        );
      }
      return jsonld2;
    };
    var factory2 = function() {
      return wrapper(function() {
        return factory2();
      });
    };
    wrapper(factory2);
    module.exports = factory2;
  }
});

// node_modules/papaparse/papaparse.min.js
var require_papaparse_min = __commonJS({
  "node_modules/papaparse/papaparse.min.js"(exports, module) {
    !function(e, t) {
      "function" == typeof define && define.amd ? define([], t) : "object" == typeof module && "undefined" != typeof exports ? module.exports = t() : e.Papa = t();
    }(exports, function s() {
      "use strict";
      var f = "undefined" != typeof self ? self : "undefined" != typeof window ? window : void 0 !== f ? f : {};
      var n = !f.document && !!f.postMessage, o = f.IS_PAPA_WORKER || false, a = {}, u = 0, b = { parse: function(e, t) {
        var r2 = (t = t || {}).dynamicTyping || false;
        J(r2) && (t.dynamicTypingFunction = r2, r2 = {});
        if (t.dynamicTyping = r2, t.transform = !!J(t.transform) && t.transform, t.worker && b.WORKERS_SUPPORTED) {
          var i = function() {
            if (!b.WORKERS_SUPPORTED)
              return false;
            var e2 = (r3 = f.URL || f.webkitURL || null, i2 = s.toString(), b.BLOB_URL || (b.BLOB_URL = r3.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ", "(", i2, ")();"], { type: "text/javascript" })))), t2 = new f.Worker(e2);
            var r3, i2;
            return t2.onmessage = _, t2.id = u++, a[t2.id] = t2;
          }();
          return i.userStep = t.step, i.userChunk = t.chunk, i.userComplete = t.complete, i.userError = t.error, t.step = J(t.step), t.chunk = J(t.chunk), t.complete = J(t.complete), t.error = J(t.error), delete t.worker, void i.postMessage({ input: e, config: t, workerId: i.id });
        }
        var n3 = null;
        b.NODE_STREAM_INPUT, "string" == typeof e ? (e = function(e2) {
          if (65279 === e2.charCodeAt(0))
            return e2.slice(1);
          return e2;
        }(e), n3 = t.download ? new l(t) : new p(t)) : true === e.readable && J(e.read) && J(e.on) ? n3 = new g(t) : (f.File && e instanceof File || e instanceof Object) && (n3 = new c(t));
        return n3.stream(e);
      }, unparse: function(e, t) {
        var n3 = false, _2 = true, m2 = ",", y2 = "\r\n", s2 = '"', a2 = s2 + s2, r2 = false, i = null, o2 = false;
        !function() {
          if ("object" != typeof t)
            return;
          "string" != typeof t.delimiter || b.BAD_DELIMITERS.filter(function(e2) {
            return -1 !== t.delimiter.indexOf(e2);
          }).length || (m2 = t.delimiter);
          ("boolean" == typeof t.quotes || "function" == typeof t.quotes || Array.isArray(t.quotes)) && (n3 = t.quotes);
          "boolean" != typeof t.skipEmptyLines && "string" != typeof t.skipEmptyLines || (r2 = t.skipEmptyLines);
          "string" == typeof t.newline && (y2 = t.newline);
          "string" == typeof t.quoteChar && (s2 = t.quoteChar);
          "boolean" == typeof t.header && (_2 = t.header);
          if (Array.isArray(t.columns)) {
            if (0 === t.columns.length)
              throw new Error("Option columns is empty");
            i = t.columns;
          }
          void 0 !== t.escapeChar && (a2 = t.escapeChar + s2);
          ("boolean" == typeof t.escapeFormulae || t.escapeFormulae instanceof RegExp) && (o2 = t.escapeFormulae instanceof RegExp ? t.escapeFormulae : /^[=+\-@\t\r].*$/);
        }();
        var u2 = new RegExp(Q(s2), "g");
        "string" == typeof e && (e = JSON.parse(e));
        if (Array.isArray(e)) {
          if (!e.length || Array.isArray(e[0]))
            return h2(null, e, r2);
          if ("object" == typeof e[0])
            return h2(i || Object.keys(e[0]), e, r2);
        } else if ("object" == typeof e)
          return "string" == typeof e.data && (e.data = JSON.parse(e.data)), Array.isArray(e.data) && (e.fields || (e.fields = e.meta && e.meta.fields || i), e.fields || (e.fields = Array.isArray(e.data[0]) ? e.fields : "object" == typeof e.data[0] ? Object.keys(e.data[0]) : []), Array.isArray(e.data[0]) || "object" == typeof e.data[0] || (e.data = [e.data])), h2(e.fields || [], e.data || [], r2);
        throw new Error("Unable to serialize unrecognized input");
        function h2(e2, t2, r3) {
          var i2 = "";
          "string" == typeof e2 && (e2 = JSON.parse(e2)), "string" == typeof t2 && (t2 = JSON.parse(t2));
          var n4 = Array.isArray(e2) && 0 < e2.length, s3 = !Array.isArray(t2[0]);
          if (n4 && _2) {
            for (var a3 = 0; a3 < e2.length; a3++)
              0 < a3 && (i2 += m2), i2 += v2(e2[a3], a3);
            0 < t2.length && (i2 += y2);
          }
          for (var o3 = 0; o3 < t2.length; o3++) {
            var u3 = n4 ? e2.length : t2[o3].length, h3 = false, f2 = n4 ? 0 === Object.keys(t2[o3]).length : 0 === t2[o3].length;
            if (r3 && !n4 && (h3 = "greedy" === r3 ? "" === t2[o3].join("").trim() : 1 === t2[o3].length && 0 === t2[o3][0].length), "greedy" === r3 && n4) {
              for (var d2 = [], l2 = 0; l2 < u3; l2++) {
                var c2 = s3 ? e2[l2] : l2;
                d2.push(t2[o3][c2]);
              }
              h3 = "" === d2.join("").trim();
            }
            if (!h3) {
              for (var p2 = 0; p2 < u3; p2++) {
                0 < p2 && !f2 && (i2 += m2);
                var g2 = n4 && s3 ? e2[p2] : p2;
                i2 += v2(t2[o3][g2], p2);
              }
              o3 < t2.length - 1 && (!r3 || 0 < u3 && !f2) && (i2 += y2);
            }
          }
          return i2;
        }
        function v2(e2, t2) {
          if (null == e2)
            return "";
          if (e2.constructor === Date)
            return JSON.stringify(e2).slice(1, 25);
          var r3 = false;
          o2 && "string" == typeof e2 && o2.test(e2) && (e2 = "'" + e2, r3 = true);
          var i2 = e2.toString().replace(u2, a2);
          return (r3 = r3 || true === n3 || "function" == typeof n3 && n3(e2, t2) || Array.isArray(n3) && n3[t2] || function(e3, t3) {
            for (var r4 = 0; r4 < t3.length; r4++)
              if (-1 < e3.indexOf(t3[r4]))
                return true;
            return false;
          }(i2, b.BAD_DELIMITERS) || -1 < i2.indexOf(m2) || " " === i2.charAt(0) || " " === i2.charAt(i2.length - 1)) ? s2 + i2 + s2 : i2;
        }
      } };
      if (b.RECORD_SEP = String.fromCharCode(30), b.UNIT_SEP = String.fromCharCode(31), b.BYTE_ORDER_MARK = "\uFEFF", b.BAD_DELIMITERS = ["\r", "\n", '"', b.BYTE_ORDER_MARK], b.WORKERS_SUPPORTED = !n && !!f.Worker, b.NODE_STREAM_INPUT = 1, b.LocalChunkSize = 10485760, b.RemoteChunkSize = 5242880, b.DefaultDelimiter = ",", b.Parser = E, b.ParserHandle = r, b.NetworkStreamer = l, b.FileStreamer = c, b.StringStreamer = p, b.ReadableStreamStreamer = g, f.jQuery) {
        var d = f.jQuery;
        d.fn.parse = function(o2) {
          var r2 = o2.config || {}, u2 = [];
          return this.each(function(e2) {
            if (!("INPUT" === d(this).prop("tagName").toUpperCase() && "file" === d(this).attr("type").toLowerCase() && f.FileReader) || !this.files || 0 === this.files.length)
              return true;
            for (var t = 0; t < this.files.length; t++)
              u2.push({ file: this.files[t], inputElem: this, instanceConfig: d.extend({}, r2) });
          }), e(), this;
          function e() {
            if (0 !== u2.length) {
              var e2, t, r3, i, n3 = u2[0];
              if (J(o2.before)) {
                var s2 = o2.before(n3.file, n3.inputElem);
                if ("object" == typeof s2) {
                  if ("abort" === s2.action)
                    return e2 = "AbortError", t = n3.file, r3 = n3.inputElem, i = s2.reason, void (J(o2.error) && o2.error({ name: e2 }, t, r3, i));
                  if ("skip" === s2.action)
                    return void h2();
                  "object" == typeof s2.config && (n3.instanceConfig = d.extend(n3.instanceConfig, s2.config));
                } else if ("skip" === s2)
                  return void h2();
              }
              var a2 = n3.instanceConfig.complete;
              n3.instanceConfig.complete = function(e3) {
                J(a2) && a2(e3, n3.file, n3.inputElem), h2();
              }, b.parse(n3.file, n3.instanceConfig);
            } else
              J(o2.complete) && o2.complete();
          }
          function h2() {
            u2.splice(0, 1), e();
          }
        };
      }
      function h(e) {
        this._handle = null, this._finished = false, this._completed = false, this._halted = false, this._input = null, this._baseIndex = 0, this._partialLine = "", this._rowCount = 0, this._start = 0, this._nextChunk = null, this.isFirstChunk = true, this._completeResults = { data: [], errors: [], meta: {} }, function(e2) {
          var t = w(e2);
          t.chunkSize = parseInt(t.chunkSize), e2.step || e2.chunk || (t.chunkSize = null);
          this._handle = new r(t), (this._handle.streamer = this)._config = t;
        }.call(this, e), this.parseChunk = function(e2, t) {
          if (this.isFirstChunk && J(this._config.beforeFirstChunk)) {
            var r2 = this._config.beforeFirstChunk(e2);
            void 0 !== r2 && (e2 = r2);
          }
          this.isFirstChunk = false, this._halted = false;
          var i = this._partialLine + e2;
          this._partialLine = "";
          var n3 = this._handle.parse(i, this._baseIndex, !this._finished);
          if (!this._handle.paused() && !this._handle.aborted()) {
            var s2 = n3.meta.cursor;
            this._finished || (this._partialLine = i.substring(s2 - this._baseIndex), this._baseIndex = s2), n3 && n3.data && (this._rowCount += n3.data.length);
            var a2 = this._finished || this._config.preview && this._rowCount >= this._config.preview;
            if (o)
              f.postMessage({ results: n3, workerId: b.WORKER_ID, finished: a2 });
            else if (J(this._config.chunk) && !t) {
              if (this._config.chunk(n3, this._handle), this._handle.paused() || this._handle.aborted())
                return void (this._halted = true);
              n3 = void 0, this._completeResults = void 0;
            }
            return this._config.step || this._config.chunk || (this._completeResults.data = this._completeResults.data.concat(n3.data), this._completeResults.errors = this._completeResults.errors.concat(n3.errors), this._completeResults.meta = n3.meta), this._completed || !a2 || !J(this._config.complete) || n3 && n3.meta.aborted || (this._config.complete(this._completeResults, this._input), this._completed = true), a2 || n3 && n3.meta.paused || this._nextChunk(), n3;
          }
          this._halted = true;
        }, this._sendError = function(e2) {
          J(this._config.error) ? this._config.error(e2) : o && this._config.error && f.postMessage({ workerId: b.WORKER_ID, error: e2, finished: false });
        };
      }
      function l(e) {
        var i;
        (e = e || {}).chunkSize || (e.chunkSize = b.RemoteChunkSize), h.call(this, e), this._nextChunk = n ? function() {
          this._readChunk(), this._chunkLoaded();
        } : function() {
          this._readChunk();
        }, this.stream = function(e2) {
          this._input = e2, this._nextChunk();
        }, this._readChunk = function() {
          if (this._finished)
            this._chunkLoaded();
          else {
            if (i = new XMLHttpRequest(), this._config.withCredentials && (i.withCredentials = this._config.withCredentials), n || (i.onload = v(this._chunkLoaded, this), i.onerror = v(this._chunkError, this)), i.open(this._config.downloadRequestBody ? "POST" : "GET", this._input, !n), this._config.downloadRequestHeaders) {
              var e2 = this._config.downloadRequestHeaders;
              for (var t in e2)
                i.setRequestHeader(t, e2[t]);
            }
            if (this._config.chunkSize) {
              var r2 = this._start + this._config.chunkSize - 1;
              i.setRequestHeader("Range", "bytes=" + this._start + "-" + r2);
            }
            try {
              i.send(this._config.downloadRequestBody);
            } catch (e3) {
              this._chunkError(e3.message);
            }
            n && 0 === i.status && this._chunkError();
          }
        }, this._chunkLoaded = function() {
          4 === i.readyState && (i.status < 200 || 400 <= i.status ? this._chunkError() : (this._start += this._config.chunkSize ? this._config.chunkSize : i.responseText.length, this._finished = !this._config.chunkSize || this._start >= function(e2) {
            var t = e2.getResponseHeader("Content-Range");
            if (null === t)
              return -1;
            return parseInt(t.substring(t.lastIndexOf("/") + 1));
          }(i), this.parseChunk(i.responseText)));
        }, this._chunkError = function(e2) {
          var t = i.statusText || e2;
          this._sendError(new Error(t));
        };
      }
      function c(e) {
        var i, n3;
        (e = e || {}).chunkSize || (e.chunkSize = b.LocalChunkSize), h.call(this, e);
        var s2 = "undefined" != typeof FileReader;
        this.stream = function(e2) {
          this._input = e2, n3 = e2.slice || e2.webkitSlice || e2.mozSlice, s2 ? ((i = new FileReader()).onload = v(this._chunkLoaded, this), i.onerror = v(this._chunkError, this)) : i = new FileReaderSync(), this._nextChunk();
        }, this._nextChunk = function() {
          this._finished || this._config.preview && !(this._rowCount < this._config.preview) || this._readChunk();
        }, this._readChunk = function() {
          var e2 = this._input;
          if (this._config.chunkSize) {
            var t = Math.min(this._start + this._config.chunkSize, this._input.size);
            e2 = n3.call(e2, this._start, t);
          }
          var r2 = i.readAsText(e2, this._config.encoding);
          s2 || this._chunkLoaded({ target: { result: r2 } });
        }, this._chunkLoaded = function(e2) {
          this._start += this._config.chunkSize, this._finished = !this._config.chunkSize || this._start >= this._input.size, this.parseChunk(e2.target.result);
        }, this._chunkError = function() {
          this._sendError(i.error);
        };
      }
      function p(e) {
        var r2;
        h.call(this, e = e || {}), this.stream = function(e2) {
          return r2 = e2, this._nextChunk();
        }, this._nextChunk = function() {
          if (!this._finished) {
            var e2, t = this._config.chunkSize;
            return t ? (e2 = r2.substring(0, t), r2 = r2.substring(t)) : (e2 = r2, r2 = ""), this._finished = !r2, this.parseChunk(e2);
          }
        };
      }
      function g(e) {
        h.call(this, e = e || {});
        var t = [], r2 = true, i = false;
        this.pause = function() {
          h.prototype.pause.apply(this, arguments), this._input.pause();
        }, this.resume = function() {
          h.prototype.resume.apply(this, arguments), this._input.resume();
        }, this.stream = function(e2) {
          this._input = e2, this._input.on("data", this._streamData), this._input.on("end", this._streamEnd), this._input.on("error", this._streamError);
        }, this._checkIsFinished = function() {
          i && 1 === t.length && (this._finished = true);
        }, this._nextChunk = function() {
          this._checkIsFinished(), t.length ? this.parseChunk(t.shift()) : r2 = true;
        }, this._streamData = v(function(e2) {
          try {
            t.push("string" == typeof e2 ? e2 : e2.toString(this._config.encoding)), r2 && (r2 = false, this._checkIsFinished(), this.parseChunk(t.shift()));
          } catch (e3) {
            this._streamError(e3);
          }
        }, this), this._streamError = v(function(e2) {
          this._streamCleanUp(), this._sendError(e2);
        }, this), this._streamEnd = v(function() {
          this._streamCleanUp(), i = true, this._streamData("");
        }, this), this._streamCleanUp = v(function() {
          this._input.removeListener("data", this._streamData), this._input.removeListener("end", this._streamEnd), this._input.removeListener("error", this._streamError);
        }, this);
      }
      function r(m2) {
        var a2, o2, u2, i = Math.pow(2, 53), n3 = -i, s2 = /^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/, h2 = /^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/, t = this, r2 = 0, f2 = 0, d2 = false, e = false, l2 = [], c2 = { data: [], errors: [], meta: {} };
        if (J(m2.step)) {
          var p2 = m2.step;
          m2.step = function(e2) {
            if (c2 = e2, _2())
              g2();
            else {
              if (g2(), 0 === c2.data.length)
                return;
              r2 += e2.data.length, m2.preview && r2 > m2.preview ? o2.abort() : (c2.data = c2.data[0], p2(c2, t));
            }
          };
        }
        function y2(e2) {
          return "greedy" === m2.skipEmptyLines ? "" === e2.join("").trim() : 1 === e2.length && 0 === e2[0].length;
        }
        function g2() {
          return c2 && u2 && (k("Delimiter", "UndetectableDelimiter", "Unable to auto-detect delimiting character; defaulted to '" + b.DefaultDelimiter + "'"), u2 = false), m2.skipEmptyLines && (c2.data = c2.data.filter(function(e2) {
            return !y2(e2);
          })), _2() && function() {
            if (!c2)
              return;
            function e2(e3, t3) {
              J(m2.transformHeader) && (e3 = m2.transformHeader(e3, t3)), l2.push(e3);
            }
            if (Array.isArray(c2.data[0])) {
              for (var t2 = 0; _2() && t2 < c2.data.length; t2++)
                c2.data[t2].forEach(e2);
              c2.data.splice(0, 1);
            } else
              c2.data.forEach(e2);
          }(), function() {
            if (!c2 || !m2.header && !m2.dynamicTyping && !m2.transform)
              return c2;
            function e2(e3, t3) {
              var r3, i2 = m2.header ? {} : [];
              for (r3 = 0; r3 < e3.length; r3++) {
                var n4 = r3, s3 = e3[r3];
                m2.header && (n4 = r3 >= l2.length ? "__parsed_extra" : l2[r3]), m2.transform && (s3 = m2.transform(s3, n4)), s3 = v2(n4, s3), "__parsed_extra" === n4 ? (i2[n4] = i2[n4] || [], i2[n4].push(s3)) : i2[n4] = s3;
              }
              return m2.header && (r3 > l2.length ? k("FieldMismatch", "TooManyFields", "Too many fields: expected " + l2.length + " fields but parsed " + r3, f2 + t3) : r3 < l2.length && k("FieldMismatch", "TooFewFields", "Too few fields: expected " + l2.length + " fields but parsed " + r3, f2 + t3)), i2;
            }
            var t2 = 1;
            !c2.data.length || Array.isArray(c2.data[0]) ? (c2.data = c2.data.map(e2), t2 = c2.data.length) : c2.data = e2(c2.data, 0);
            m2.header && c2.meta && (c2.meta.fields = l2);
            return f2 += t2, c2;
          }();
        }
        function _2() {
          return m2.header && 0 === l2.length;
        }
        function v2(e2, t2) {
          return r3 = e2, m2.dynamicTypingFunction && void 0 === m2.dynamicTyping[r3] && (m2.dynamicTyping[r3] = m2.dynamicTypingFunction(r3)), true === (m2.dynamicTyping[r3] || m2.dynamicTyping) ? "true" === t2 || "TRUE" === t2 || "false" !== t2 && "FALSE" !== t2 && (function(e3) {
            if (s2.test(e3)) {
              var t3 = parseFloat(e3);
              if (n3 < t3 && t3 < i)
                return true;
            }
            return false;
          }(t2) ? parseFloat(t2) : h2.test(t2) ? new Date(t2) : "" === t2 ? null : t2) : t2;
          var r3;
        }
        function k(e2, t2, r3, i2) {
          var n4 = { type: e2, code: t2, message: r3 };
          void 0 !== i2 && (n4.row = i2), c2.errors.push(n4);
        }
        this.parse = function(e2, t2, r3) {
          var i2 = m2.quoteChar || '"';
          if (m2.newline || (m2.newline = function(e3, t3) {
            e3 = e3.substring(0, 1048576);
            var r4 = new RegExp(Q(t3) + "([^]*?)" + Q(t3), "gm"), i3 = (e3 = e3.replace(r4, "")).split("\r"), n5 = e3.split("\n"), s4 = 1 < n5.length && n5[0].length < i3[0].length;
            if (1 === i3.length || s4)
              return "\n";
            for (var a3 = 0, o3 = 0; o3 < i3.length; o3++)
              "\n" === i3[o3][0] && a3++;
            return a3 >= i3.length / 2 ? "\r\n" : "\r";
          }(e2, i2)), u2 = false, m2.delimiter)
            J(m2.delimiter) && (m2.delimiter = m2.delimiter(e2), c2.meta.delimiter = m2.delimiter);
          else {
            var n4 = function(e3, t3, r4, i3, n5) {
              var s4, a3, o3, u3;
              n5 = n5 || [",", "	", "|", ";", b.RECORD_SEP, b.UNIT_SEP];
              for (var h3 = 0; h3 < n5.length; h3++) {
                var f3 = n5[h3], d3 = 0, l3 = 0, c3 = 0;
                o3 = void 0;
                for (var p3 = new E({ comments: i3, delimiter: f3, newline: t3, preview: 10 }).parse(e3), g3 = 0; g3 < p3.data.length; g3++)
                  if (r4 && y2(p3.data[g3]))
                    c3++;
                  else {
                    var _3 = p3.data[g3].length;
                    l3 += _3, void 0 !== o3 ? 0 < _3 && (d3 += Math.abs(_3 - o3), o3 = _3) : o3 = _3;
                  }
                0 < p3.data.length && (l3 /= p3.data.length - c3), (void 0 === a3 || d3 <= a3) && (void 0 === u3 || u3 < l3) && 1.99 < l3 && (a3 = d3, s4 = f3, u3 = l3);
              }
              return { successful: !!(m2.delimiter = s4), bestDelimiter: s4 };
            }(e2, m2.newline, m2.skipEmptyLines, m2.comments, m2.delimitersToGuess);
            n4.successful ? m2.delimiter = n4.bestDelimiter : (u2 = true, m2.delimiter = b.DefaultDelimiter), c2.meta.delimiter = m2.delimiter;
          }
          var s3 = w(m2);
          return m2.preview && m2.header && s3.preview++, a2 = e2, o2 = new E(s3), c2 = o2.parse(a2, t2, r3), g2(), d2 ? { meta: { paused: true } } : c2 || { meta: { paused: false } };
        }, this.paused = function() {
          return d2;
        }, this.pause = function() {
          d2 = true, o2.abort(), a2 = J(m2.chunk) ? "" : a2.substring(o2.getCharIndex());
        }, this.resume = function() {
          t.streamer._halted ? (d2 = false, t.streamer.parseChunk(a2, true)) : setTimeout(t.resume, 3);
        }, this.aborted = function() {
          return e;
        }, this.abort = function() {
          e = true, o2.abort(), c2.meta.aborted = true, J(m2.complete) && m2.complete(c2), a2 = "";
        };
      }
      function Q(e) {
        return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
      function E(j) {
        var z, M = (j = j || {}).delimiter, P2 = j.newline, U = j.comments, q = j.step, N = j.preview, B = j.fastMode, K = z = void 0 === j.quoteChar || null === j.quoteChar ? '"' : j.quoteChar;
        if (void 0 !== j.escapeChar && (K = j.escapeChar), ("string" != typeof M || -1 < b.BAD_DELIMITERS.indexOf(M)) && (M = ","), U === M)
          throw new Error("Comment character same as delimiter");
        true === U ? U = "#" : ("string" != typeof U || -1 < b.BAD_DELIMITERS.indexOf(U)) && (U = false), "\n" !== P2 && "\r" !== P2 && "\r\n" !== P2 && (P2 = "\n");
        var W = 0, H = false;
        this.parse = function(i, t, r2) {
          if ("string" != typeof i)
            throw new Error("Input must be a string");
          var n3 = i.length, e = M.length, s2 = P2.length, a2 = U.length, o2 = J(q), u2 = [], h2 = [], f2 = [], d2 = W = 0;
          if (!i)
            return L();
          if (j.header && !t) {
            var l2 = i.split(P2)[0].split(M), c2 = [], p2 = {}, g2 = false;
            for (var _2 in l2) {
              var m2 = l2[_2];
              J(j.transformHeader) && (m2 = j.transformHeader(m2, _2));
              var y2 = m2, v2 = p2[m2] || 0;
              for (0 < v2 && (g2 = true, y2 = m2 + "_" + v2), p2[m2] = v2 + 1; c2.includes(y2); )
                y2 = y2 + "_" + v2;
              c2.push(y2);
            }
            if (g2) {
              var k = i.split(P2);
              k[0] = c2.join(M), i = k.join(P2);
            }
          }
          if (B || false !== B && -1 === i.indexOf(z)) {
            for (var b2 = i.split(P2), E2 = 0; E2 < b2.length; E2++) {
              if (f2 = b2[E2], W += f2.length, E2 !== b2.length - 1)
                W += P2.length;
              else if (r2)
                return L();
              if (!U || f2.substring(0, a2) !== U) {
                if (o2) {
                  if (u2 = [], I(f2.split(M)), F(), H)
                    return L();
                } else
                  I(f2.split(M));
                if (N && N <= E2)
                  return u2 = u2.slice(0, N), L(true);
              }
            }
            return L();
          }
          for (var w2 = i.indexOf(M, W), R = i.indexOf(P2, W), C = new RegExp(Q(K) + Q(z), "g"), S = i.indexOf(z, W); ; )
            if (i[W] !== z)
              if (U && 0 === f2.length && i.substring(W, W + a2) === U) {
                if (-1 === R)
                  return L();
                W = R + s2, R = i.indexOf(P2, W), w2 = i.indexOf(M, W);
              } else if (-1 !== w2 && (w2 < R || -1 === R))
                f2.push(i.substring(W, w2)), W = w2 + e, w2 = i.indexOf(M, W);
              else {
                if (-1 === R)
                  break;
                if (f2.push(i.substring(W, R)), D(R + s2), o2 && (F(), H))
                  return L();
                if (N && u2.length >= N)
                  return L(true);
              }
            else
              for (S = W, W++; ; ) {
                if (-1 === (S = i.indexOf(z, S + 1)))
                  return r2 || h2.push({ type: "Quotes", code: "MissingQuotes", message: "Quoted field unterminated", row: u2.length, index: W }), T();
                if (S === n3 - 1)
                  return T(i.substring(W, S).replace(C, z));
                if (z !== K || i[S + 1] !== K) {
                  if (z === K || 0 === S || i[S - 1] !== K) {
                    -1 !== w2 && w2 < S + 1 && (w2 = i.indexOf(M, S + 1)), -1 !== R && R < S + 1 && (R = i.indexOf(P2, S + 1));
                    var O = A(-1 === R ? w2 : Math.min(w2, R));
                    if (i.substr(S + 1 + O, e) === M) {
                      f2.push(i.substring(W, S).replace(C, z)), i[W = S + 1 + O + e] !== z && (S = i.indexOf(z, W)), w2 = i.indexOf(M, W), R = i.indexOf(P2, W);
                      break;
                    }
                    var x = A(R);
                    if (i.substring(S + 1 + x, S + 1 + x + s2) === P2) {
                      if (f2.push(i.substring(W, S).replace(C, z)), D(S + 1 + x + s2), w2 = i.indexOf(M, W), S = i.indexOf(z, W), o2 && (F(), H))
                        return L();
                      if (N && u2.length >= N)
                        return L(true);
                      break;
                    }
                    h2.push({ type: "Quotes", code: "InvalidQuotes", message: "Trailing quote on quoted field is malformed", row: u2.length, index: W }), S++;
                  }
                } else
                  S++;
              }
          return T();
          function I(e2) {
            u2.push(e2), d2 = W;
          }
          function A(e2) {
            var t2 = 0;
            if (-1 !== e2) {
              var r3 = i.substring(S + 1, e2);
              r3 && "" === r3.trim() && (t2 = r3.length);
            }
            return t2;
          }
          function T(e2) {
            return r2 || (void 0 === e2 && (e2 = i.substring(W)), f2.push(e2), W = n3, I(f2), o2 && F()), L();
          }
          function D(e2) {
            W = e2, I(f2), f2 = [], R = i.indexOf(P2, W);
          }
          function L(e2) {
            return { data: u2, errors: h2, meta: { delimiter: M, linebreak: P2, aborted: H, truncated: !!e2, cursor: d2 + (t || 0) } };
          }
          function F() {
            q(L()), u2 = [], h2 = [];
          }
        }, this.abort = function() {
          H = true;
        }, this.getCharIndex = function() {
          return W;
        };
      }
      function _(e) {
        var t = e.data, r2 = a[t.workerId], i = false;
        if (t.error)
          r2.userError(t.error, t.file);
        else if (t.results && t.results.data) {
          var n3 = { abort: function() {
            i = true, m(t.workerId, { data: [], errors: [], meta: { aborted: true } });
          }, pause: y, resume: y };
          if (J(r2.userStep)) {
            for (var s2 = 0; s2 < t.results.data.length && (r2.userStep({ data: t.results.data[s2], errors: t.results.errors, meta: t.results.meta }, n3), !i); s2++)
              ;
            delete t.results;
          } else
            J(r2.userChunk) && (r2.userChunk(t.results, n3, t.file), delete t.results);
        }
        t.finished && !i && m(t.workerId, t.results);
      }
      function m(e, t) {
        var r2 = a[e];
        J(r2.userComplete) && r2.userComplete(t), r2.terminate(), delete a[e];
      }
      function y() {
        throw new Error("Not implemented.");
      }
      function w(e) {
        if ("object" != typeof e || null === e)
          return e;
        var t = Array.isArray(e) ? [] : {};
        for (var r2 in e)
          t[r2] = w(e[r2]);
        return t;
      }
      function v(e, t) {
        return function() {
          e.apply(t, arguments);
        };
      }
      function J(e) {
        return "function" == typeof e;
      }
      return o && (f.onmessage = function(e) {
        var t = e.data;
        void 0 === b.WORKER_ID && t && (b.WORKER_ID = t.workerId);
        if ("string" == typeof t.input)
          f.postMessage({ workerId: b.WORKER_ID, results: b.parse(t.input, t.config), finished: true });
        else if (f.File && t.input instanceof File || t.input instanceof Object) {
          var r2 = b.parse(t.input, t.config);
          r2 && f.postMessage({ workerId: b.WORKER_ID, results: r2, finished: true });
        }
      }), (l.prototype = Object.create(h.prototype)).constructor = l, (c.prototype = Object.create(h.prototype)).constructor = c, (p.prototype = Object.create(p.prototype)).constructor = p, (g.prototype = Object.create(h.prototype)).constructor = g, b;
    });
  }
});

// node_modules/typed-function/lib/umd/typed-function.js
var require_typed_function = __commonJS({
  "node_modules/typed-function/lib/umd/typed-function.js"(exports, module) {
    (function(global2, factory2) {
      typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory2() : typeof define === "function" && define.amd ? define(factory2) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, global2["'typed'"] = factory2());
    })(exports, function() {
      "use strict";
      function ok() {
        return true;
      }
      function notOk() {
        return false;
      }
      function undef() {
        return void 0;
      }
      const NOT_TYPED_FUNCTION = "Argument is not a typed-function.";
      function create() {
        function isPlainObject2(x) {
          return typeof x === "object" && x !== null && x.constructor === Object;
        }
        const _types = [{
          name: "number",
          test: function(x) {
            return typeof x === "number";
          }
        }, {
          name: "string",
          test: function(x) {
            return typeof x === "string";
          }
        }, {
          name: "boolean",
          test: function(x) {
            return typeof x === "boolean";
          }
        }, {
          name: "Function",
          test: function(x) {
            return typeof x === "function";
          }
        }, {
          name: "Array",
          test: Array.isArray
        }, {
          name: "Date",
          test: function(x) {
            return x instanceof Date;
          }
        }, {
          name: "RegExp",
          test: function(x) {
            return x instanceof RegExp;
          }
        }, {
          name: "Object",
          test: isPlainObject2
        }, {
          name: "null",
          test: function(x) {
            return x === null;
          }
        }, {
          name: "undefined",
          test: function(x) {
            return x === void 0;
          }
        }];
        const anyType = {
          name: "any",
          test: ok,
          isAny: true
        };
        let typeMap;
        let typeList;
        let nConversions = 0;
        let typed2 = {
          createCount: 0
        };
        function findType(typeName) {
          const type = typeMap.get(typeName);
          if (type) {
            return type;
          }
          let message = 'Unknown type "' + typeName + '"';
          const name74 = typeName.toLowerCase();
          let otherName;
          for (otherName of typeList) {
            if (otherName.toLowerCase() === name74) {
              message += '. Did you mean "' + otherName + '" ?';
              break;
            }
          }
          throw new TypeError(message);
        }
        function addTypes(types) {
          let beforeSpec = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "any";
          const beforeIndex = beforeSpec ? findType(beforeSpec).index : typeList.length;
          const newTypes = [];
          for (let i = 0; i < types.length; ++i) {
            if (!types[i] || typeof types[i].name !== "string" || typeof types[i].test !== "function") {
              throw new TypeError("Object with properties {name: string, test: function} expected");
            }
            const typeName = types[i].name;
            if (typeMap.has(typeName)) {
              throw new TypeError('Duplicate type name "' + typeName + '"');
            }
            newTypes.push(typeName);
            typeMap.set(typeName, {
              name: typeName,
              test: types[i].test,
              isAny: types[i].isAny,
              index: beforeIndex + i,
              conversionsTo: []
              // Newly added type can't have any conversions to it
            });
          }
          const affectedTypes = typeList.slice(beforeIndex);
          typeList = typeList.slice(0, beforeIndex).concat(newTypes).concat(affectedTypes);
          for (let i = beforeIndex + newTypes.length; i < typeList.length; ++i) {
            typeMap.get(typeList[i]).index = i;
          }
        }
        function clear() {
          typeMap = /* @__PURE__ */ new Map();
          typeList = [];
          nConversions = 0;
          addTypes([anyType], false);
        }
        clear();
        addTypes(_types);
        function clearConversions() {
          let typeName;
          for (typeName of typeList) {
            typeMap.get(typeName).conversionsTo = [];
          }
          nConversions = 0;
        }
        function findTypeNames(value) {
          const matches = typeList.filter((name74) => {
            const type = typeMap.get(name74);
            return !type.isAny && type.test(value);
          });
          if (matches.length) {
            return matches;
          }
          return ["any"];
        }
        function isTypedFunction(entity) {
          return entity && typeof entity === "function" && "_typedFunctionData" in entity;
        }
        function findSignature(fn, signature, options) {
          if (!isTypedFunction(fn)) {
            throw new TypeError(NOT_TYPED_FUNCTION);
          }
          const exact = options && options.exact;
          const stringSignature = Array.isArray(signature) ? signature.join(",") : signature;
          const params = parseSignature(stringSignature);
          const canonicalSignature = stringifyParams(params);
          if (!exact || canonicalSignature in fn.signatures) {
            const match = fn._typedFunctionData.signatureMap.get(canonicalSignature);
            if (match) {
              return match;
            }
          }
          const nParams = params.length;
          let remainingSignatures;
          if (exact) {
            remainingSignatures = [];
            let name74;
            for (name74 in fn.signatures) {
              remainingSignatures.push(fn._typedFunctionData.signatureMap.get(name74));
            }
          } else {
            remainingSignatures = fn._typedFunctionData.signatures;
          }
          for (let i = 0; i < nParams; ++i) {
            const want = params[i];
            const filteredSignatures = [];
            let possibility;
            for (possibility of remainingSignatures) {
              const have = getParamAtIndex(possibility.params, i);
              if (!have || want.restParam && !have.restParam) {
                continue;
              }
              if (!have.hasAny) {
                const haveTypes = paramTypeSet(have);
                if (want.types.some((wtype) => !haveTypes.has(wtype.name))) {
                  continue;
                }
              }
              filteredSignatures.push(possibility);
            }
            remainingSignatures = filteredSignatures;
            if (remainingSignatures.length === 0)
              break;
          }
          let candidate;
          for (candidate of remainingSignatures) {
            if (candidate.params.length <= nParams) {
              return candidate;
            }
          }
          throw new TypeError("Signature not found (signature: " + (fn.name || "unnamed") + "(" + stringifyParams(params, ", ") + "))");
        }
        function find(fn, signature, options) {
          return findSignature(fn, signature, options).implementation;
        }
        function convert(value, typeName) {
          const type = findType(typeName);
          if (type.test(value)) {
            return value;
          }
          const conversions = type.conversionsTo;
          if (conversions.length === 0) {
            throw new Error("There are no conversions to " + typeName + " defined.");
          }
          for (let i = 0; i < conversions.length; i++) {
            const fromType = findType(conversions[i].from);
            if (fromType.test(value)) {
              return conversions[i].convert(value);
            }
          }
          throw new Error("Cannot convert " + value + " to " + typeName);
        }
        function stringifyParams(params) {
          let separator = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : ",";
          return params.map((p) => p.name).join(separator);
        }
        function parseParam(param) {
          const restParam = param.indexOf("...") === 0;
          const types = !restParam ? param : param.length > 3 ? param.slice(3) : "any";
          const typeDefs = types.split("|").map((s) => findType(s.trim()));
          let hasAny = false;
          let paramName = restParam ? "..." : "";
          const exactTypes = typeDefs.map(function(type) {
            hasAny = type.isAny || hasAny;
            paramName += type.name + "|";
            return {
              name: type.name,
              typeIndex: type.index,
              test: type.test,
              isAny: type.isAny,
              conversion: null,
              conversionIndex: -1
            };
          });
          return {
            types: exactTypes,
            name: paramName.slice(0, -1),
            // remove trailing '|' from above
            hasAny,
            hasConversion: false,
            restParam
          };
        }
        function expandParam(param) {
          const typeNames = param.types.map((t) => t.name);
          const matchingConversions = availableConversions(typeNames);
          let hasAny = param.hasAny;
          let newName = param.name;
          const convertibleTypes = matchingConversions.map(function(conversion) {
            const type = findType(conversion.from);
            hasAny = type.isAny || hasAny;
            newName += "|" + conversion.from;
            return {
              name: conversion.from,
              typeIndex: type.index,
              test: type.test,
              isAny: type.isAny,
              conversion,
              conversionIndex: conversion.index
            };
          });
          return {
            types: param.types.concat(convertibleTypes),
            name: newName,
            hasAny,
            hasConversion: convertibleTypes.length > 0,
            restParam: param.restParam
          };
        }
        function paramTypeSet(param) {
          if (!param.typeSet) {
            param.typeSet = /* @__PURE__ */ new Set();
            param.types.forEach((type) => param.typeSet.add(type.name));
          }
          return param.typeSet;
        }
        function parseSignature(rawSignature) {
          const params = [];
          if (typeof rawSignature !== "string") {
            throw new TypeError("Signatures must be strings");
          }
          const signature = rawSignature.trim();
          if (signature === "") {
            return params;
          }
          const rawParams = signature.split(",");
          for (let i = 0; i < rawParams.length; ++i) {
            const parsedParam = parseParam(rawParams[i].trim());
            if (parsedParam.restParam && i !== rawParams.length - 1) {
              throw new SyntaxError('Unexpected rest parameter "' + rawParams[i] + '": only allowed for the last parameter');
            }
            if (parsedParam.types.length === 0) {
              return null;
            }
            params.push(parsedParam);
          }
          return params;
        }
        function hasRestParam(params) {
          const param = last(params);
          return param ? param.restParam : false;
        }
        function compileTest(param) {
          if (!param || param.types.length === 0) {
            return ok;
          } else if (param.types.length === 1) {
            return findType(param.types[0].name).test;
          } else if (param.types.length === 2) {
            const test0 = findType(param.types[0].name).test;
            const test1 = findType(param.types[1].name).test;
            return function or(x) {
              return test0(x) || test1(x);
            };
          } else {
            const tests = param.types.map(function(type) {
              return findType(type.name).test;
            });
            return function or(x) {
              for (let i = 0; i < tests.length; i++) {
                if (tests[i](x)) {
                  return true;
                }
              }
              return false;
            };
          }
        }
        function compileTests(params) {
          let tests, test0, test1;
          if (hasRestParam(params)) {
            tests = initial(params).map(compileTest);
            const varIndex = tests.length;
            const lastTest = compileTest(last(params));
            const testRestParam = function(args) {
              for (let i = varIndex; i < args.length; i++) {
                if (!lastTest(args[i])) {
                  return false;
                }
              }
              return true;
            };
            return function testArgs(args) {
              for (let i = 0; i < tests.length; i++) {
                if (!tests[i](args[i])) {
                  return false;
                }
              }
              return testRestParam(args) && args.length >= varIndex + 1;
            };
          } else {
            if (params.length === 0) {
              return function testArgs(args) {
                return args.length === 0;
              };
            } else if (params.length === 1) {
              test0 = compileTest(params[0]);
              return function testArgs(args) {
                return test0(args[0]) && args.length === 1;
              };
            } else if (params.length === 2) {
              test0 = compileTest(params[0]);
              test1 = compileTest(params[1]);
              return function testArgs(args) {
                return test0(args[0]) && test1(args[1]) && args.length === 2;
              };
            } else {
              tests = params.map(compileTest);
              return function testArgs(args) {
                for (let i = 0; i < tests.length; i++) {
                  if (!tests[i](args[i])) {
                    return false;
                  }
                }
                return args.length === tests.length;
              };
            }
          }
        }
        function getParamAtIndex(params, index) {
          return index < params.length ? params[index] : hasRestParam(params) ? last(params) : null;
        }
        function getTypeSetAtIndex(params, index) {
          const param = getParamAtIndex(params, index);
          if (!param) {
            return /* @__PURE__ */ new Set();
          }
          return paramTypeSet(param);
        }
        function isExactType(type) {
          return type.conversion === null || type.conversion === void 0;
        }
        function mergeExpectedParams(signatures, index) {
          const typeSet = /* @__PURE__ */ new Set();
          signatures.forEach((signature) => {
            const paramSet = getTypeSetAtIndex(signature.params, index);
            let name74;
            for (name74 of paramSet) {
              typeSet.add(name74);
            }
          });
          return typeSet.has("any") ? ["any"] : Array.from(typeSet);
        }
        function createError(name74, args, signatures) {
          let err, expected;
          const _name = name74 || "unnamed";
          let matchingSignatures = signatures;
          let index;
          for (index = 0; index < args.length; index++) {
            const nextMatchingDefs = [];
            matchingSignatures.forEach((signature) => {
              const param = getParamAtIndex(signature.params, index);
              const test = compileTest(param);
              if ((index < signature.params.length || hasRestParam(signature.params)) && test(args[index])) {
                nextMatchingDefs.push(signature);
              }
            });
            if (nextMatchingDefs.length === 0) {
              expected = mergeExpectedParams(matchingSignatures, index);
              if (expected.length > 0) {
                const actualTypes = findTypeNames(args[index]);
                err = new TypeError("Unexpected type of argument in function " + _name + " (expected: " + expected.join(" or ") + ", actual: " + actualTypes.join(" | ") + ", index: " + index + ")");
                err.data = {
                  category: "wrongType",
                  fn: _name,
                  index,
                  actual: actualTypes,
                  expected
                };
                return err;
              }
            } else {
              matchingSignatures = nextMatchingDefs;
            }
          }
          const lengths = matchingSignatures.map(function(signature) {
            return hasRestParam(signature.params) ? Infinity : signature.params.length;
          });
          if (args.length < Math.min.apply(null, lengths)) {
            expected = mergeExpectedParams(matchingSignatures, index);
            err = new TypeError("Too few arguments in function " + _name + " (expected: " + expected.join(" or ") + ", index: " + args.length + ")");
            err.data = {
              category: "tooFewArgs",
              fn: _name,
              index: args.length,
              expected
            };
            return err;
          }
          const maxLength = Math.max.apply(null, lengths);
          if (args.length > maxLength) {
            err = new TypeError("Too many arguments in function " + _name + " (expected: " + maxLength + ", actual: " + args.length + ")");
            err.data = {
              category: "tooManyArgs",
              fn: _name,
              index: args.length,
              expectedLength: maxLength
            };
            return err;
          }
          const argTypes = [];
          for (let i = 0; i < args.length; ++i) {
            argTypes.push(findTypeNames(args[i]).join("|"));
          }
          err = new TypeError('Arguments of type "' + argTypes.join(", ") + '" do not match any of the defined signatures of function ' + _name + ".");
          err.data = {
            category: "mismatch",
            actual: argTypes
          };
          return err;
        }
        function getLowestTypeIndex(param) {
          let min2 = typeList.length + 1;
          for (let i = 0; i < param.types.length; i++) {
            if (isExactType(param.types[i])) {
              min2 = Math.min(min2, param.types[i].typeIndex);
            }
          }
          return min2;
        }
        function getLowestConversionIndex(param) {
          let min2 = nConversions + 1;
          for (let i = 0; i < param.types.length; i++) {
            if (!isExactType(param.types[i])) {
              min2 = Math.min(min2, param.types[i].conversionIndex);
            }
          }
          return min2;
        }
        function compareParams(param1, param2) {
          if (param1.hasAny) {
            if (!param2.hasAny) {
              return 1;
            }
          } else if (param2.hasAny) {
            return -1;
          }
          if (param1.restParam) {
            if (!param2.restParam) {
              return 1;
            }
          } else if (param2.restParam) {
            return -1;
          }
          if (param1.hasConversion) {
            if (!param2.hasConversion) {
              return 1;
            }
          } else if (param2.hasConversion) {
            return -1;
          }
          const typeDiff = getLowestTypeIndex(param1) - getLowestTypeIndex(param2);
          if (typeDiff < 0) {
            return -1;
          }
          if (typeDiff > 0) {
            return 1;
          }
          const convDiff = getLowestConversionIndex(param1) - getLowestConversionIndex(param2);
          if (convDiff < 0) {
            return -1;
          }
          if (convDiff > 0) {
            return 1;
          }
          return 0;
        }
        function compareSignatures(signature1, signature2) {
          const pars1 = signature1.params;
          const pars2 = signature2.params;
          const last1 = last(pars1);
          const last2 = last(pars2);
          const hasRest1 = hasRestParam(pars1);
          const hasRest2 = hasRestParam(pars2);
          if (hasRest1 && last1.hasAny) {
            if (!hasRest2 || !last2.hasAny) {
              return 1;
            }
          } else if (hasRest2 && last2.hasAny) {
            return -1;
          }
          let any1 = 0;
          let conv1 = 0;
          let par;
          for (par of pars1) {
            if (par.hasAny)
              ++any1;
            if (par.hasConversion)
              ++conv1;
          }
          let any2 = 0;
          let conv2 = 0;
          for (par of pars2) {
            if (par.hasAny)
              ++any2;
            if (par.hasConversion)
              ++conv2;
          }
          if (any1 !== any2) {
            return any1 - any2;
          }
          if (hasRest1 && last1.hasConversion) {
            if (!hasRest2 || !last2.hasConversion) {
              return 1;
            }
          } else if (hasRest2 && last2.hasConversion) {
            return -1;
          }
          if (conv1 !== conv2) {
            return conv1 - conv2;
          }
          if (hasRest1) {
            if (!hasRest2) {
              return 1;
            }
          } else if (hasRest2) {
            return -1;
          }
          const lengthCriterion = (pars1.length - pars2.length) * (hasRest1 ? -1 : 1);
          if (lengthCriterion !== 0) {
            return lengthCriterion;
          }
          const comparisons = [];
          let tc = 0;
          for (let i = 0; i < pars1.length; ++i) {
            const thisComparison = compareParams(pars1[i], pars2[i]);
            comparisons.push(thisComparison);
            tc += thisComparison;
          }
          if (tc !== 0) {
            return tc;
          }
          let c;
          for (c of comparisons) {
            if (c !== 0) {
              return c;
            }
          }
          return 0;
        }
        function availableConversions(typeNames) {
          if (typeNames.length === 0) {
            return [];
          }
          const types = typeNames.map(findType);
          if (typeNames.length > 1) {
            types.sort((t1, t2) => t1.index - t2.index);
          }
          let matches = types[0].conversionsTo;
          if (typeNames.length === 1) {
            return matches;
          }
          matches = matches.concat([]);
          const knownTypes = new Set(typeNames);
          for (let i = 1; i < types.length; ++i) {
            let newMatch;
            for (newMatch of types[i].conversionsTo) {
              if (!knownTypes.has(newMatch.from)) {
                matches.push(newMatch);
                knownTypes.add(newMatch.from);
              }
            }
          }
          return matches;
        }
        function compileArgsPreprocessing(params, fn) {
          let fnConvert = fn;
          if (params.some((p) => p.hasConversion)) {
            const restParam = hasRestParam(params);
            const compiledConversions = params.map(compileArgConversion);
            fnConvert = function convertArgs() {
              const args = [];
              const last2 = restParam ? arguments.length - 1 : arguments.length;
              for (let i = 0; i < last2; i++) {
                args[i] = compiledConversions[i](arguments[i]);
              }
              if (restParam) {
                args[last2] = arguments[last2].map(compiledConversions[last2]);
              }
              return fn.apply(this, args);
            };
          }
          let fnPreprocess = fnConvert;
          if (hasRestParam(params)) {
            const offset = params.length - 1;
            fnPreprocess = function preprocessRestParams() {
              return fnConvert.apply(this, slice(arguments, 0, offset).concat([slice(arguments, offset)]));
            };
          }
          return fnPreprocess;
        }
        function compileArgConversion(param) {
          let test0, test1, conversion0, conversion1;
          const tests = [];
          const conversions = [];
          param.types.forEach(function(type) {
            if (type.conversion) {
              tests.push(findType(type.conversion.from).test);
              conversions.push(type.conversion.convert);
            }
          });
          switch (conversions.length) {
            case 0:
              return function convertArg(arg) {
                return arg;
              };
            case 1:
              test0 = tests[0];
              conversion0 = conversions[0];
              return function convertArg(arg) {
                if (test0(arg)) {
                  return conversion0(arg);
                }
                return arg;
              };
            case 2:
              test0 = tests[0];
              test1 = tests[1];
              conversion0 = conversions[0];
              conversion1 = conversions[1];
              return function convertArg(arg) {
                if (test0(arg)) {
                  return conversion0(arg);
                }
                if (test1(arg)) {
                  return conversion1(arg);
                }
                return arg;
              };
            default:
              return function convertArg(arg) {
                for (let i = 0; i < conversions.length; i++) {
                  if (tests[i](arg)) {
                    return conversions[i](arg);
                  }
                }
                return arg;
              };
          }
        }
        function splitParams(params) {
          function _splitParams(params2, index, paramsSoFar) {
            if (index < params2.length) {
              const param = params2[index];
              let resultingParams = [];
              if (param.restParam) {
                const exactTypes = param.types.filter(isExactType);
                if (exactTypes.length < param.types.length) {
                  resultingParams.push({
                    types: exactTypes,
                    name: "..." + exactTypes.map((t) => t.name).join("|"),
                    hasAny: exactTypes.some((t) => t.isAny),
                    hasConversion: false,
                    restParam: true
                  });
                }
                resultingParams.push(param);
              } else {
                resultingParams = param.types.map(function(type) {
                  return {
                    types: [type],
                    name: type.name,
                    hasAny: type.isAny,
                    hasConversion: type.conversion,
                    restParam: false
                  };
                });
              }
              return flatMap(resultingParams, function(nextParam) {
                return _splitParams(params2, index + 1, paramsSoFar.concat([nextParam]));
              });
            } else {
              return [paramsSoFar];
            }
          }
          return _splitParams(params, 0, []);
        }
        function conflicting(params1, params2) {
          const ii = Math.max(params1.length, params2.length);
          for (let i = 0; i < ii; i++) {
            const typeSet1 = getTypeSetAtIndex(params1, i);
            const typeSet2 = getTypeSetAtIndex(params2, i);
            let overlap = false;
            let name74;
            for (name74 of typeSet2) {
              if (typeSet1.has(name74)) {
                overlap = true;
                break;
              }
            }
            if (!overlap) {
              return false;
            }
          }
          const len1 = params1.length;
          const len2 = params2.length;
          const restParam1 = hasRestParam(params1);
          const restParam2 = hasRestParam(params2);
          return restParam1 ? restParam2 ? len1 === len2 : len2 >= len1 : restParam2 ? len1 >= len2 : len1 === len2;
        }
        function clearResolutions(functionList) {
          return functionList.map((fn) => {
            if (isReferToSelf(fn)) {
              return referToSelf(fn.referToSelf.callback);
            }
            if (isReferTo(fn)) {
              return makeReferTo(fn.referTo.references, fn.referTo.callback);
            }
            return fn;
          });
        }
        function collectResolutions(references, functionList, signatureMap) {
          const resolvedReferences = [];
          let reference;
          for (reference of references) {
            let resolution = signatureMap[reference];
            if (typeof resolution !== "number") {
              throw new TypeError('No definition for referenced signature "' + reference + '"');
            }
            resolution = functionList[resolution];
            if (typeof resolution !== "function") {
              return false;
            }
            resolvedReferences.push(resolution);
          }
          return resolvedReferences;
        }
        function resolveReferences(functionList, signatureMap, self2) {
          const resolvedFunctions = clearResolutions(functionList);
          const isResolved = new Array(resolvedFunctions.length).fill(false);
          let leftUnresolved = true;
          while (leftUnresolved) {
            leftUnresolved = false;
            let nothingResolved = true;
            for (let i = 0; i < resolvedFunctions.length; ++i) {
              if (isResolved[i])
                continue;
              const fn = resolvedFunctions[i];
              if (isReferToSelf(fn)) {
                resolvedFunctions[i] = fn.referToSelf.callback(self2);
                resolvedFunctions[i].referToSelf = fn.referToSelf;
                isResolved[i] = true;
                nothingResolved = false;
              } else if (isReferTo(fn)) {
                const resolvedReferences = collectResolutions(fn.referTo.references, resolvedFunctions, signatureMap);
                if (resolvedReferences) {
                  resolvedFunctions[i] = fn.referTo.callback.apply(this, resolvedReferences);
                  resolvedFunctions[i].referTo = fn.referTo;
                  isResolved[i] = true;
                  nothingResolved = false;
                } else {
                  leftUnresolved = true;
                }
              }
            }
            if (nothingResolved && leftUnresolved) {
              throw new SyntaxError("Circular reference detected in resolving typed.referTo");
            }
          }
          return resolvedFunctions;
        }
        function validateDeprecatedThis(signaturesMap) {
          const deprecatedThisRegex = /\bthis(\(|\.signatures\b)/;
          Object.keys(signaturesMap).forEach((signature) => {
            const fn = signaturesMap[signature];
            if (deprecatedThisRegex.test(fn.toString())) {
              throw new SyntaxError("Using `this` to self-reference a function is deprecated since typed-function@3. Use typed.referTo and typed.referToSelf instead.");
            }
          });
        }
        function createTypedFunction(name74, rawSignaturesMap) {
          typed2.createCount++;
          if (Object.keys(rawSignaturesMap).length === 0) {
            throw new SyntaxError("No signatures provided");
          }
          if (typed2.warnAgainstDeprecatedThis) {
            validateDeprecatedThis(rawSignaturesMap);
          }
          const parsedParams = [];
          const originalFunctions = [];
          const signaturesMap = {};
          const preliminarySignatures = [];
          let signature;
          for (signature in rawSignaturesMap) {
            if (!Object.prototype.hasOwnProperty.call(rawSignaturesMap, signature)) {
              continue;
            }
            const params = parseSignature(signature);
            if (!params)
              continue;
            parsedParams.forEach(function(pp) {
              if (conflicting(pp, params)) {
                throw new TypeError('Conflicting signatures "' + stringifyParams(pp) + '" and "' + stringifyParams(params) + '".');
              }
            });
            parsedParams.push(params);
            const functionIndex = originalFunctions.length;
            originalFunctions.push(rawSignaturesMap[signature]);
            const conversionParams = params.map(expandParam);
            let sp;
            for (sp of splitParams(conversionParams)) {
              const spName = stringifyParams(sp);
              preliminarySignatures.push({
                params: sp,
                name: spName,
                fn: functionIndex
              });
              if (sp.every((p) => !p.hasConversion)) {
                signaturesMap[spName] = functionIndex;
              }
            }
          }
          preliminarySignatures.sort(compareSignatures);
          const resolvedFunctions = resolveReferences(originalFunctions, signaturesMap, theTypedFn);
          let s;
          for (s in signaturesMap) {
            if (Object.prototype.hasOwnProperty.call(signaturesMap, s)) {
              signaturesMap[s] = resolvedFunctions[signaturesMap[s]];
            }
          }
          const signatures = [];
          const internalSignatureMap = /* @__PURE__ */ new Map();
          for (s of preliminarySignatures) {
            if (!internalSignatureMap.has(s.name)) {
              s.fn = resolvedFunctions[s.fn];
              signatures.push(s);
              internalSignatureMap.set(s.name, s);
            }
          }
          const ok0 = signatures[0] && signatures[0].params.length <= 2 && !hasRestParam(signatures[0].params);
          const ok1 = signatures[1] && signatures[1].params.length <= 2 && !hasRestParam(signatures[1].params);
          const ok2 = signatures[2] && signatures[2].params.length <= 2 && !hasRestParam(signatures[2].params);
          const ok3 = signatures[3] && signatures[3].params.length <= 2 && !hasRestParam(signatures[3].params);
          const ok4 = signatures[4] && signatures[4].params.length <= 2 && !hasRestParam(signatures[4].params);
          const ok5 = signatures[5] && signatures[5].params.length <= 2 && !hasRestParam(signatures[5].params);
          const allOk = ok0 && ok1 && ok2 && ok3 && ok4 && ok5;
          for (let i = 0; i < signatures.length; ++i) {
            signatures[i].test = compileTests(signatures[i].params);
          }
          const test00 = ok0 ? compileTest(signatures[0].params[0]) : notOk;
          const test10 = ok1 ? compileTest(signatures[1].params[0]) : notOk;
          const test20 = ok2 ? compileTest(signatures[2].params[0]) : notOk;
          const test30 = ok3 ? compileTest(signatures[3].params[0]) : notOk;
          const test40 = ok4 ? compileTest(signatures[4].params[0]) : notOk;
          const test50 = ok5 ? compileTest(signatures[5].params[0]) : notOk;
          const test01 = ok0 ? compileTest(signatures[0].params[1]) : notOk;
          const test11 = ok1 ? compileTest(signatures[1].params[1]) : notOk;
          const test21 = ok2 ? compileTest(signatures[2].params[1]) : notOk;
          const test31 = ok3 ? compileTest(signatures[3].params[1]) : notOk;
          const test41 = ok4 ? compileTest(signatures[4].params[1]) : notOk;
          const test51 = ok5 ? compileTest(signatures[5].params[1]) : notOk;
          for (let i = 0; i < signatures.length; ++i) {
            signatures[i].implementation = compileArgsPreprocessing(signatures[i].params, signatures[i].fn);
          }
          const fn0 = ok0 ? signatures[0].implementation : undef;
          const fn1 = ok1 ? signatures[1].implementation : undef;
          const fn2 = ok2 ? signatures[2].implementation : undef;
          const fn3 = ok3 ? signatures[3].implementation : undef;
          const fn4 = ok4 ? signatures[4].implementation : undef;
          const fn5 = ok5 ? signatures[5].implementation : undef;
          const len0 = ok0 ? signatures[0].params.length : -1;
          const len1 = ok1 ? signatures[1].params.length : -1;
          const len2 = ok2 ? signatures[2].params.length : -1;
          const len3 = ok3 ? signatures[3].params.length : -1;
          const len4 = ok4 ? signatures[4].params.length : -1;
          const len5 = ok5 ? signatures[5].params.length : -1;
          const iStart = allOk ? 6 : 0;
          const iEnd = signatures.length;
          const tests = signatures.map((s2) => s2.test);
          const fns = signatures.map((s2) => s2.implementation);
          const generic = function generic2() {
            for (let i = iStart; i < iEnd; i++) {
              if (tests[i](arguments)) {
                return fns[i].apply(this, arguments);
              }
            }
            return typed2.onMismatch(name74, arguments, signatures);
          };
          function theTypedFn(arg0, arg1) {
            if (arguments.length === len0 && test00(arg0) && test01(arg1)) {
              return fn0.apply(this, arguments);
            }
            if (arguments.length === len1 && test10(arg0) && test11(arg1)) {
              return fn1.apply(this, arguments);
            }
            if (arguments.length === len2 && test20(arg0) && test21(arg1)) {
              return fn2.apply(this, arguments);
            }
            if (arguments.length === len3 && test30(arg0) && test31(arg1)) {
              return fn3.apply(this, arguments);
            }
            if (arguments.length === len4 && test40(arg0) && test41(arg1)) {
              return fn4.apply(this, arguments);
            }
            if (arguments.length === len5 && test50(arg0) && test51(arg1)) {
              return fn5.apply(this, arguments);
            }
            return generic.apply(this, arguments);
          }
          try {
            Object.defineProperty(theTypedFn, "name", {
              value: name74
            });
          } catch (err) {
          }
          theTypedFn.signatures = signaturesMap;
          theTypedFn._typedFunctionData = {
            signatures,
            signatureMap: internalSignatureMap
          };
          return theTypedFn;
        }
        function _onMismatch(name74, args, signatures) {
          throw createError(name74, args, signatures);
        }
        function initial(arr) {
          return slice(arr, 0, arr.length - 1);
        }
        function last(arr) {
          return arr[arr.length - 1];
        }
        function slice(arr, start, end) {
          return Array.prototype.slice.call(arr, start, end);
        }
        function findInArray(arr, test) {
          for (let i = 0; i < arr.length; i++) {
            if (test(arr[i])) {
              return arr[i];
            }
          }
          return void 0;
        }
        function flatMap(arr, callback) {
          return Array.prototype.concat.apply([], arr.map(callback));
        }
        function referTo() {
          const references = initial(arguments).map((s) => stringifyParams(parseSignature(s)));
          const callback = last(arguments);
          if (typeof callback !== "function") {
            throw new TypeError("Callback function expected as last argument");
          }
          return makeReferTo(references, callback);
        }
        function makeReferTo(references, callback) {
          return {
            referTo: {
              references,
              callback
            }
          };
        }
        function referToSelf(callback) {
          if (typeof callback !== "function") {
            throw new TypeError("Callback function expected as first argument");
          }
          return {
            referToSelf: {
              callback
            }
          };
        }
        function isReferTo(objectOrFn) {
          return objectOrFn && typeof objectOrFn.referTo === "object" && Array.isArray(objectOrFn.referTo.references) && typeof objectOrFn.referTo.callback === "function";
        }
        function isReferToSelf(objectOrFn) {
          return objectOrFn && typeof objectOrFn.referToSelf === "object" && typeof objectOrFn.referToSelf.callback === "function";
        }
        function checkName(nameSoFar, newName) {
          if (!nameSoFar) {
            return newName;
          }
          if (newName && newName !== nameSoFar) {
            const err = new Error("Function names do not match (expected: " + nameSoFar + ", actual: " + newName + ")");
            err.data = {
              actual: newName,
              expected: nameSoFar
            };
            throw err;
          }
          return nameSoFar;
        }
        function getObjectName(obj) {
          let name74;
          for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key) && (isTypedFunction(obj[key]) || typeof obj[key].signature === "string")) {
              name74 = checkName(name74, obj[key].name);
            }
          }
          return name74;
        }
        function mergeSignatures(dest, source) {
          let key;
          for (key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              if (key in dest) {
                if (source[key] !== dest[key]) {
                  const err = new Error('Signature "' + key + '" is defined twice');
                  err.data = {
                    signature: key,
                    sourceFunction: source[key],
                    destFunction: dest[key]
                  };
                  throw err;
                }
              }
              dest[key] = source[key];
            }
          }
        }
        const saveTyped = typed2;
        typed2 = function(maybeName) {
          const named = typeof maybeName === "string";
          const start = named ? 1 : 0;
          let name74 = named ? maybeName : "";
          const allSignatures = {};
          for (let i = start; i < arguments.length; ++i) {
            const item = arguments[i];
            let theseSignatures = {};
            let thisName;
            if (typeof item === "function") {
              thisName = item.name;
              if (typeof item.signature === "string") {
                theseSignatures[item.signature] = item;
              } else if (isTypedFunction(item)) {
                theseSignatures = item.signatures;
              }
            } else if (isPlainObject2(item)) {
              theseSignatures = item;
              if (!named) {
                thisName = getObjectName(item);
              }
            }
            if (Object.keys(theseSignatures).length === 0) {
              const err = new TypeError("Argument to 'typed' at index " + i + " is not a (typed) function, nor an object with signatures as keys and functions as values.");
              err.data = {
                index: i,
                argument: item
              };
              throw err;
            }
            if (!named) {
              name74 = checkName(name74, thisName);
            }
            mergeSignatures(allSignatures, theseSignatures);
          }
          return createTypedFunction(name74 || "", allSignatures);
        };
        typed2.create = create;
        typed2.createCount = saveTyped.createCount;
        typed2.onMismatch = _onMismatch;
        typed2.throwMismatchError = _onMismatch;
        typed2.createError = createError;
        typed2.clear = clear;
        typed2.clearConversions = clearConversions;
        typed2.addTypes = addTypes;
        typed2._findType = findType;
        typed2.referTo = referTo;
        typed2.referToSelf = referToSelf;
        typed2.convert = convert;
        typed2.findSignature = findSignature;
        typed2.find = find;
        typed2.isTypedFunction = isTypedFunction;
        typed2.warnAgainstDeprecatedThis = true;
        typed2.addType = function(type, beforeObjectTest) {
          let before = "any";
          if (beforeObjectTest !== false && typeMap.has("Object")) {
            before = "Object";
          }
          typed2.addTypes([type], before);
        };
        function _validateConversion(conversion) {
          if (!conversion || typeof conversion.from !== "string" || typeof conversion.to !== "string" || typeof conversion.convert !== "function") {
            throw new TypeError("Object with properties {from: string, to: string, convert: function} expected");
          }
          if (conversion.to === conversion.from) {
            throw new SyntaxError('Illegal to define conversion from "' + conversion.from + '" to itself.');
          }
        }
        typed2.addConversion = function(conversion) {
          _validateConversion(conversion);
          const to = findType(conversion.to);
          if (to.conversionsTo.every(function(other) {
            return other.from !== conversion.from;
          })) {
            to.conversionsTo.push({
              from: conversion.from,
              convert: conversion.convert,
              index: nConversions++
            });
          } else {
            throw new Error('There is already a conversion from "' + conversion.from + '" to "' + to.name + '"');
          }
        };
        typed2.addConversions = function(conversions) {
          conversions.forEach(typed2.addConversion);
        };
        typed2.removeConversion = function(conversion) {
          _validateConversion(conversion);
          const to = findType(conversion.to);
          const existingConversion = findInArray(to.conversionsTo, (c) => c.from === conversion.from);
          if (!existingConversion) {
            throw new Error("Attempt to remove nonexistent conversion from " + conversion.from + " to " + conversion.to);
          }
          if (existingConversion.convert !== conversion.convert) {
            throw new Error("Conversion to remove does not match existing conversion");
          }
          const index = to.conversionsTo.indexOf(existingConversion);
          to.conversionsTo.splice(index, 1);
        };
        typed2.resolve = function(tf, argList) {
          if (!isTypedFunction(tf)) {
            throw new TypeError(NOT_TYPED_FUNCTION);
          }
          const sigs = tf._typedFunctionData.signatures;
          for (let i = 0; i < sigs.length; ++i) {
            if (sigs[i].test(argList)) {
              return sigs[i];
            }
          }
          return null;
        };
        return typed2;
      }
      var typedFunction2 = create();
      return typedFunction2;
    });
  }
});

// node_modules/complex.js/complex.js
var require_complex = __commonJS({
  "node_modules/complex.js/complex.js"(exports, module) {
    (function(root) {
      "use strict";
      var cosh2 = Math.cosh || function(x) {
        return Math.abs(x) < 1e-9 ? 1 - x : (Math.exp(x) + Math.exp(-x)) * 0.5;
      };
      var sinh2 = Math.sinh || function(x) {
        return Math.abs(x) < 1e-9 ? x : (Math.exp(x) - Math.exp(-x)) * 0.5;
      };
      var cosm1 = function(x) {
        var b = Math.PI / 4;
        if (-b > x || x > b) {
          return Math.cos(x) - 1;
        }
        var xx = x * x;
        return xx * (xx * (xx * (xx * (xx * (xx * (xx * (xx / 20922789888e3 - 1 / 87178291200) + 1 / 479001600) - 1 / 3628800) + 1 / 40320) - 1 / 720) + 1 / 24) - 1 / 2);
      };
      var hypot2 = function(x, y) {
        var a = Math.abs(x);
        var b = Math.abs(y);
        if (a < 3e3 && b < 3e3) {
          return Math.sqrt(a * a + b * b);
        }
        if (a < b) {
          a = b;
          b = x / y;
        } else {
          b = y / x;
        }
        return a * Math.sqrt(1 + b * b);
      };
      var parser_exit = function() {
        throw SyntaxError("Invalid Param");
      };
      function logHypot(a, b) {
        var _a = Math.abs(a);
        var _b = Math.abs(b);
        if (a === 0) {
          return Math.log(_b);
        }
        if (b === 0) {
          return Math.log(_a);
        }
        if (_a < 3e3 && _b < 3e3) {
          return Math.log(a * a + b * b) * 0.5;
        }
        a = a / 2;
        b = b / 2;
        return 0.5 * Math.log(a * a + b * b) + Math.LN2;
      }
      var parse = function(a, b) {
        var z = { "re": 0, "im": 0 };
        if (a === void 0 || a === null) {
          z["re"] = z["im"] = 0;
        } else if (b !== void 0) {
          z["re"] = a;
          z["im"] = b;
        } else
          switch (typeof a) {
            case "object":
              if ("im" in a && "re" in a) {
                z["re"] = a["re"];
                z["im"] = a["im"];
              } else if ("abs" in a && "arg" in a) {
                if (!Number.isFinite(a["abs"]) && Number.isFinite(a["arg"])) {
                  return Complex3["INFINITY"];
                }
                z["re"] = a["abs"] * Math.cos(a["arg"]);
                z["im"] = a["abs"] * Math.sin(a["arg"]);
              } else if ("r" in a && "phi" in a) {
                if (!Number.isFinite(a["r"]) && Number.isFinite(a["phi"])) {
                  return Complex3["INFINITY"];
                }
                z["re"] = a["r"] * Math.cos(a["phi"]);
                z["im"] = a["r"] * Math.sin(a["phi"]);
              } else if (a.length === 2) {
                z["re"] = a[0];
                z["im"] = a[1];
              } else {
                parser_exit();
              }
              break;
            case "string":
              z["im"] = /* void */
              z["re"] = 0;
              var tokens = a.match(/\d+\.?\d*e[+-]?\d+|\d+\.?\d*|\.\d+|./g);
              var plus = 1;
              var minus = 0;
              if (tokens === null) {
                parser_exit();
              }
              for (var i = 0; i < tokens.length; i++) {
                var c = tokens[i];
                if (c === " " || c === "	" || c === "\n") {
                } else if (c === "+") {
                  plus++;
                } else if (c === "-") {
                  minus++;
                } else if (c === "i" || c === "I") {
                  if (plus + minus === 0) {
                    parser_exit();
                  }
                  if (tokens[i + 1] !== " " && !isNaN(tokens[i + 1])) {
                    z["im"] += parseFloat((minus % 2 ? "-" : "") + tokens[i + 1]);
                    i++;
                  } else {
                    z["im"] += parseFloat((minus % 2 ? "-" : "") + "1");
                  }
                  plus = minus = 0;
                } else {
                  if (plus + minus === 0 || isNaN(c)) {
                    parser_exit();
                  }
                  if (tokens[i + 1] === "i" || tokens[i + 1] === "I") {
                    z["im"] += parseFloat((minus % 2 ? "-" : "") + c);
                    i++;
                  } else {
                    z["re"] += parseFloat((minus % 2 ? "-" : "") + c);
                  }
                  plus = minus = 0;
                }
              }
              if (plus + minus > 0) {
                parser_exit();
              }
              break;
            case "number":
              z["im"] = 0;
              z["re"] = a;
              break;
            default:
              parser_exit();
          }
        if (isNaN(z["re"]) || isNaN(z["im"])) {
        }
        return z;
      };
      function Complex3(a, b) {
        if (!(this instanceof Complex3)) {
          return new Complex3(a, b);
        }
        var z = parse(a, b);
        this["re"] = z["re"];
        this["im"] = z["im"];
      }
      Complex3.prototype = {
        "re": 0,
        "im": 0,
        /**
         * Calculates the sign of a complex number, which is a normalized complex
         *
         * @returns {Complex}
         */
        "sign": function() {
          var abs3 = this["abs"]();
          return new Complex3(
            this["re"] / abs3,
            this["im"] / abs3
          );
        },
        /**
         * Adds two complex numbers
         *
         * @returns {Complex}
         */
        "add": function(a, b) {
          var z = new Complex3(a, b);
          if (this["isInfinite"]() && z["isInfinite"]()) {
            return Complex3["NAN"];
          }
          if (this["isInfinite"]() || z["isInfinite"]()) {
            return Complex3["INFINITY"];
          }
          return new Complex3(
            this["re"] + z["re"],
            this["im"] + z["im"]
          );
        },
        /**
         * Subtracts two complex numbers
         *
         * @returns {Complex}
         */
        "sub": function(a, b) {
          var z = new Complex3(a, b);
          if (this["isInfinite"]() && z["isInfinite"]()) {
            return Complex3["NAN"];
          }
          if (this["isInfinite"]() || z["isInfinite"]()) {
            return Complex3["INFINITY"];
          }
          return new Complex3(
            this["re"] - z["re"],
            this["im"] - z["im"]
          );
        },
        /**
         * Multiplies two complex numbers
         *
         * @returns {Complex}
         */
        "mul": function(a, b) {
          var z = new Complex3(a, b);
          if (this["isInfinite"]() && z["isZero"]() || this["isZero"]() && z["isInfinite"]()) {
            return Complex3["NAN"];
          }
          if (this["isInfinite"]() || z["isInfinite"]()) {
            return Complex3["INFINITY"];
          }
          if (z["im"] === 0 && this["im"] === 0) {
            return new Complex3(this["re"] * z["re"], 0);
          }
          return new Complex3(
            this["re"] * z["re"] - this["im"] * z["im"],
            this["re"] * z["im"] + this["im"] * z["re"]
          );
        },
        /**
         * Divides two complex numbers
         *
         * @returns {Complex}
         */
        "div": function(a, b) {
          var z = new Complex3(a, b);
          if (this["isZero"]() && z["isZero"]() || this["isInfinite"]() && z["isInfinite"]()) {
            return Complex3["NAN"];
          }
          if (this["isInfinite"]() || z["isZero"]()) {
            return Complex3["INFINITY"];
          }
          if (this["isZero"]() || z["isInfinite"]()) {
            return Complex3["ZERO"];
          }
          a = this["re"];
          b = this["im"];
          var c = z["re"];
          var d = z["im"];
          var t, x;
          if (0 === d) {
            return new Complex3(a / c, b / c);
          }
          if (Math.abs(c) < Math.abs(d)) {
            x = c / d;
            t = c * x + d;
            return new Complex3(
              (a * x + b) / t,
              (b * x - a) / t
            );
          } else {
            x = d / c;
            t = d * x + c;
            return new Complex3(
              (a + b * x) / t,
              (b - a * x) / t
            );
          }
        },
        /**
         * Calculate the power of two complex numbers
         *
         * @returns {Complex}
         */
        "pow": function(a, b) {
          var z = new Complex3(a, b);
          a = this["re"];
          b = this["im"];
          if (z["isZero"]()) {
            return Complex3["ONE"];
          }
          if (z["im"] === 0) {
            if (b === 0 && a > 0) {
              return new Complex3(Math.pow(a, z["re"]), 0);
            } else if (a === 0) {
              switch ((z["re"] % 4 + 4) % 4) {
                case 0:
                  return new Complex3(Math.pow(b, z["re"]), 0);
                case 1:
                  return new Complex3(0, Math.pow(b, z["re"]));
                case 2:
                  return new Complex3(-Math.pow(b, z["re"]), 0);
                case 3:
                  return new Complex3(0, -Math.pow(b, z["re"]));
              }
            }
          }
          if (a === 0 && b === 0 && z["re"] > 0 && z["im"] >= 0) {
            return Complex3["ZERO"];
          }
          var arg = Math.atan2(b, a);
          var loh = logHypot(a, b);
          a = Math.exp(z["re"] * loh - z["im"] * arg);
          b = z["im"] * loh + z["re"] * arg;
          return new Complex3(
            a * Math.cos(b),
            a * Math.sin(b)
          );
        },
        /**
         * Calculate the complex square root
         *
         * @returns {Complex}
         */
        "sqrt": function() {
          var a = this["re"];
          var b = this["im"];
          var r = this["abs"]();
          var re2, im2;
          if (a >= 0) {
            if (b === 0) {
              return new Complex3(Math.sqrt(a), 0);
            }
            re2 = 0.5 * Math.sqrt(2 * (r + a));
          } else {
            re2 = Math.abs(b) / Math.sqrt(2 * (r - a));
          }
          if (a <= 0) {
            im2 = 0.5 * Math.sqrt(2 * (r - a));
          } else {
            im2 = Math.abs(b) / Math.sqrt(2 * (r + a));
          }
          return new Complex3(re2, b < 0 ? -im2 : im2);
        },
        /**
         * Calculate the complex exponent
         *
         * @returns {Complex}
         */
        "exp": function() {
          var tmp = Math.exp(this["re"]);
          if (this["im"] === 0) {
          }
          return new Complex3(
            tmp * Math.cos(this["im"]),
            tmp * Math.sin(this["im"])
          );
        },
        /**
         * Calculate the complex exponent and subtracts one.
         *
         * This may be more accurate than `Complex(x).exp().sub(1)` if
         * `x` is small.
         *
         * @returns {Complex}
         */
        "expm1": function() {
          var a = this["re"];
          var b = this["im"];
          return new Complex3(
            Math.expm1(a) * Math.cos(b) + cosm1(b),
            Math.exp(a) * Math.sin(b)
          );
        },
        /**
         * Calculate the natural log
         *
         * @returns {Complex}
         */
        "log": function() {
          var a = this["re"];
          var b = this["im"];
          if (b === 0 && a > 0) {
          }
          return new Complex3(
            logHypot(a, b),
            Math.atan2(b, a)
          );
        },
        /**
         * Calculate the magnitude of the complex number
         *
         * @returns {number}
         */
        "abs": function() {
          return hypot2(this["re"], this["im"]);
        },
        /**
         * Calculate the angle of the complex number
         *
         * @returns {number}
         */
        "arg": function() {
          return Math.atan2(this["im"], this["re"]);
        },
        /**
         * Calculate the sine of the complex number
         *
         * @returns {Complex}
         */
        "sin": function() {
          var a = this["re"];
          var b = this["im"];
          return new Complex3(
            Math.sin(a) * cosh2(b),
            Math.cos(a) * sinh2(b)
          );
        },
        /**
         * Calculate the cosine
         *
         * @returns {Complex}
         */
        "cos": function() {
          var a = this["re"];
          var b = this["im"];
          return new Complex3(
            Math.cos(a) * cosh2(b),
            -Math.sin(a) * sinh2(b)
          );
        },
        /**
         * Calculate the tangent
         *
         * @returns {Complex}
         */
        "tan": function() {
          var a = 2 * this["re"];
          var b = 2 * this["im"];
          var d = Math.cos(a) + cosh2(b);
          return new Complex3(
            Math.sin(a) / d,
            sinh2(b) / d
          );
        },
        /**
         * Calculate the cotangent
         *
         * @returns {Complex}
         */
        "cot": function() {
          var a = 2 * this["re"];
          var b = 2 * this["im"];
          var d = Math.cos(a) - cosh2(b);
          return new Complex3(
            -Math.sin(a) / d,
            sinh2(b) / d
          );
        },
        /**
         * Calculate the secant
         *
         * @returns {Complex}
         */
        "sec": function() {
          var a = this["re"];
          var b = this["im"];
          var d = 0.5 * cosh2(2 * b) + 0.5 * Math.cos(2 * a);
          return new Complex3(
            Math.cos(a) * cosh2(b) / d,
            Math.sin(a) * sinh2(b) / d
          );
        },
        /**
         * Calculate the cosecans
         *
         * @returns {Complex}
         */
        "csc": function() {
          var a = this["re"];
          var b = this["im"];
          var d = 0.5 * cosh2(2 * b) - 0.5 * Math.cos(2 * a);
          return new Complex3(
            Math.sin(a) * cosh2(b) / d,
            -Math.cos(a) * sinh2(b) / d
          );
        },
        /**
         * Calculate the complex arcus sinus
         *
         * @returns {Complex}
         */
        "asin": function() {
          var a = this["re"];
          var b = this["im"];
          var t1 = new Complex3(
            b * b - a * a + 1,
            -2 * a * b
          )["sqrt"]();
          var t2 = new Complex3(
            t1["re"] - b,
            t1["im"] + a
          )["log"]();
          return new Complex3(t2["im"], -t2["re"]);
        },
        /**
         * Calculate the complex arcus cosinus
         *
         * @returns {Complex}
         */
        "acos": function() {
          var a = this["re"];
          var b = this["im"];
          var t1 = new Complex3(
            b * b - a * a + 1,
            -2 * a * b
          )["sqrt"]();
          var t2 = new Complex3(
            t1["re"] - b,
            t1["im"] + a
          )["log"]();
          return new Complex3(Math.PI / 2 - t2["im"], t2["re"]);
        },
        /**
         * Calculate the complex arcus tangent
         *
         * @returns {Complex}
         */
        "atan": function() {
          var a = this["re"];
          var b = this["im"];
          if (a === 0) {
            if (b === 1) {
              return new Complex3(0, Infinity);
            }
            if (b === -1) {
              return new Complex3(0, -Infinity);
            }
          }
          var d = a * a + (1 - b) * (1 - b);
          var t1 = new Complex3(
            (1 - b * b - a * a) / d,
            -2 * a / d
          ).log();
          return new Complex3(-0.5 * t1["im"], 0.5 * t1["re"]);
        },
        /**
         * Calculate the complex arcus cotangent
         *
         * @returns {Complex}
         */
        "acot": function() {
          var a = this["re"];
          var b = this["im"];
          if (b === 0) {
            return new Complex3(Math.atan2(1, a), 0);
          }
          var d = a * a + b * b;
          return d !== 0 ? new Complex3(
            a / d,
            -b / d
          ).atan() : new Complex3(
            a !== 0 ? a / 0 : 0,
            b !== 0 ? -b / 0 : 0
          ).atan();
        },
        /**
         * Calculate the complex arcus secant
         *
         * @returns {Complex}
         */
        "asec": function() {
          var a = this["re"];
          var b = this["im"];
          if (a === 0 && b === 0) {
            return new Complex3(0, Infinity);
          }
          var d = a * a + b * b;
          return d !== 0 ? new Complex3(
            a / d,
            -b / d
          ).acos() : new Complex3(
            a !== 0 ? a / 0 : 0,
            b !== 0 ? -b / 0 : 0
          ).acos();
        },
        /**
         * Calculate the complex arcus cosecans
         *
         * @returns {Complex}
         */
        "acsc": function() {
          var a = this["re"];
          var b = this["im"];
          if (a === 0 && b === 0) {
            return new Complex3(Math.PI / 2, Infinity);
          }
          var d = a * a + b * b;
          return d !== 0 ? new Complex3(
            a / d,
            -b / d
          ).asin() : new Complex3(
            a !== 0 ? a / 0 : 0,
            b !== 0 ? -b / 0 : 0
          ).asin();
        },
        /**
         * Calculate the complex sinh
         *
         * @returns {Complex}
         */
        "sinh": function() {
          var a = this["re"];
          var b = this["im"];
          return new Complex3(
            sinh2(a) * Math.cos(b),
            cosh2(a) * Math.sin(b)
          );
        },
        /**
         * Calculate the complex cosh
         *
         * @returns {Complex}
         */
        "cosh": function() {
          var a = this["re"];
          var b = this["im"];
          return new Complex3(
            cosh2(a) * Math.cos(b),
            sinh2(a) * Math.sin(b)
          );
        },
        /**
         * Calculate the complex tanh
         *
         * @returns {Complex}
         */
        "tanh": function() {
          var a = 2 * this["re"];
          var b = 2 * this["im"];
          var d = cosh2(a) + Math.cos(b);
          return new Complex3(
            sinh2(a) / d,
            Math.sin(b) / d
          );
        },
        /**
         * Calculate the complex coth
         *
         * @returns {Complex}
         */
        "coth": function() {
          var a = 2 * this["re"];
          var b = 2 * this["im"];
          var d = cosh2(a) - Math.cos(b);
          return new Complex3(
            sinh2(a) / d,
            -Math.sin(b) / d
          );
        },
        /**
         * Calculate the complex coth
         *
         * @returns {Complex}
         */
        "csch": function() {
          var a = this["re"];
          var b = this["im"];
          var d = Math.cos(2 * b) - cosh2(2 * a);
          return new Complex3(
            -2 * sinh2(a) * Math.cos(b) / d,
            2 * cosh2(a) * Math.sin(b) / d
          );
        },
        /**
         * Calculate the complex sech
         *
         * @returns {Complex}
         */
        "sech": function() {
          var a = this["re"];
          var b = this["im"];
          var d = Math.cos(2 * b) + cosh2(2 * a);
          return new Complex3(
            2 * cosh2(a) * Math.cos(b) / d,
            -2 * sinh2(a) * Math.sin(b) / d
          );
        },
        /**
         * Calculate the complex asinh
         *
         * @returns {Complex}
         */
        "asinh": function() {
          var tmp = this["im"];
          this["im"] = -this["re"];
          this["re"] = tmp;
          var res = this["asin"]();
          this["re"] = -this["im"];
          this["im"] = tmp;
          tmp = res["re"];
          res["re"] = -res["im"];
          res["im"] = tmp;
          return res;
        },
        /**
         * Calculate the complex acosh
         *
         * @returns {Complex}
         */
        "acosh": function() {
          var res = this["acos"]();
          if (res["im"] <= 0) {
            var tmp = res["re"];
            res["re"] = -res["im"];
            res["im"] = tmp;
          } else {
            var tmp = res["im"];
            res["im"] = -res["re"];
            res["re"] = tmp;
          }
          return res;
        },
        /**
         * Calculate the complex atanh
         *
         * @returns {Complex}
         */
        "atanh": function() {
          var a = this["re"];
          var b = this["im"];
          var noIM = a > 1 && b === 0;
          var oneMinus = 1 - a;
          var onePlus = 1 + a;
          var d = oneMinus * oneMinus + b * b;
          var x = d !== 0 ? new Complex3(
            (onePlus * oneMinus - b * b) / d,
            (b * oneMinus + onePlus * b) / d
          ) : new Complex3(
            a !== -1 ? a / 0 : 0,
            b !== 0 ? b / 0 : 0
          );
          var temp = x["re"];
          x["re"] = logHypot(x["re"], x["im"]) / 2;
          x["im"] = Math.atan2(x["im"], temp) / 2;
          if (noIM) {
            x["im"] = -x["im"];
          }
          return x;
        },
        /**
         * Calculate the complex acoth
         *
         * @returns {Complex}
         */
        "acoth": function() {
          var a = this["re"];
          var b = this["im"];
          if (a === 0 && b === 0) {
            return new Complex3(0, Math.PI / 2);
          }
          var d = a * a + b * b;
          return d !== 0 ? new Complex3(
            a / d,
            -b / d
          ).atanh() : new Complex3(
            a !== 0 ? a / 0 : 0,
            b !== 0 ? -b / 0 : 0
          ).atanh();
        },
        /**
         * Calculate the complex acsch
         *
         * @returns {Complex}
         */
        "acsch": function() {
          var a = this["re"];
          var b = this["im"];
          if (b === 0) {
            return new Complex3(
              a !== 0 ? Math.log(a + Math.sqrt(a * a + 1)) : Infinity,
              0
            );
          }
          var d = a * a + b * b;
          return d !== 0 ? new Complex3(
            a / d,
            -b / d
          ).asinh() : new Complex3(
            a !== 0 ? a / 0 : 0,
            b !== 0 ? -b / 0 : 0
          ).asinh();
        },
        /**
         * Calculate the complex asech
         *
         * @returns {Complex}
         */
        "asech": function() {
          var a = this["re"];
          var b = this["im"];
          if (this["isZero"]()) {
            return Complex3["INFINITY"];
          }
          var d = a * a + b * b;
          return d !== 0 ? new Complex3(
            a / d,
            -b / d
          ).acosh() : new Complex3(
            a !== 0 ? a / 0 : 0,
            b !== 0 ? -b / 0 : 0
          ).acosh();
        },
        /**
         * Calculate the complex inverse 1/z
         *
         * @returns {Complex}
         */
        "inverse": function() {
          if (this["isZero"]()) {
            return Complex3["INFINITY"];
          }
          if (this["isInfinite"]()) {
            return Complex3["ZERO"];
          }
          var a = this["re"];
          var b = this["im"];
          var d = a * a + b * b;
          return new Complex3(a / d, -b / d);
        },
        /**
         * Returns the complex conjugate
         *
         * @returns {Complex}
         */
        "conjugate": function() {
          return new Complex3(this["re"], -this["im"]);
        },
        /**
         * Gets the negated complex number
         *
         * @returns {Complex}
         */
        "neg": function() {
          return new Complex3(-this["re"], -this["im"]);
        },
        /**
         * Ceils the actual complex number
         *
         * @returns {Complex}
         */
        "ceil": function(places) {
          places = Math.pow(10, places || 0);
          return new Complex3(
            Math.ceil(this["re"] * places) / places,
            Math.ceil(this["im"] * places) / places
          );
        },
        /**
         * Floors the actual complex number
         *
         * @returns {Complex}
         */
        "floor": function(places) {
          places = Math.pow(10, places || 0);
          return new Complex3(
            Math.floor(this["re"] * places) / places,
            Math.floor(this["im"] * places) / places
          );
        },
        /**
         * Ceils the actual complex number
         *
         * @returns {Complex}
         */
        "round": function(places) {
          places = Math.pow(10, places || 0);
          return new Complex3(
            Math.round(this["re"] * places) / places,
            Math.round(this["im"] * places) / places
          );
        },
        /**
         * Compares two complex numbers
         *
         * **Note:** new Complex(Infinity).equals(Infinity) === false
         *
         * @returns {boolean}
         */
        "equals": function(a, b) {
          var z = new Complex3(a, b);
          return Math.abs(z["re"] - this["re"]) <= Complex3["EPSILON"] && Math.abs(z["im"] - this["im"]) <= Complex3["EPSILON"];
        },
        /**
         * Clones the actual object
         *
         * @returns {Complex}
         */
        "clone": function() {
          return new Complex3(this["re"], this["im"]);
        },
        /**
         * Gets a string of the actual complex number
         *
         * @returns {string}
         */
        "toString": function() {
          var a = this["re"];
          var b = this["im"];
          var ret = "";
          if (this["isNaN"]()) {
            return "NaN";
          }
          if (this["isInfinite"]()) {
            return "Infinity";
          }
          if (Math.abs(a) < Complex3["EPSILON"]) {
            a = 0;
          }
          if (Math.abs(b) < Complex3["EPSILON"]) {
            b = 0;
          }
          if (b === 0) {
            return ret + a;
          }
          if (a !== 0) {
            ret += a;
            ret += " ";
            if (b < 0) {
              b = -b;
              ret += "-";
            } else {
              ret += "+";
            }
            ret += " ";
          } else if (b < 0) {
            b = -b;
            ret += "-";
          }
          if (1 !== b) {
            ret += b;
          }
          return ret + "i";
        },
        /**
         * Returns the actual number as a vector
         *
         * @returns {Array}
         */
        "toVector": function() {
          return [this["re"], this["im"]];
        },
        /**
         * Returns the actual real value of the current object
         *
         * @returns {number|null}
         */
        "valueOf": function() {
          if (this["im"] === 0) {
            return this["re"];
          }
          return null;
        },
        /**
         * Determines whether a complex number is not on the Riemann sphere.
         *
         * @returns {boolean}
         */
        "isNaN": function() {
          return isNaN(this["re"]) || isNaN(this["im"]);
        },
        /**
         * Determines whether or not a complex number is at the zero pole of the
         * Riemann sphere.
         *
         * @returns {boolean}
         */
        "isZero": function() {
          return this["im"] === 0 && this["re"] === 0;
        },
        /**
         * Determines whether a complex number is not at the infinity pole of the
         * Riemann sphere.
         *
         * @returns {boolean}
         */
        "isFinite": function() {
          return isFinite(this["re"]) && isFinite(this["im"]);
        },
        /**
         * Determines whether or not a complex number is at the infinity pole of the
         * Riemann sphere.
         *
         * @returns {boolean}
         */
        "isInfinite": function() {
          return !(this["isNaN"]() || this["isFinite"]());
        }
      };
      Complex3["ZERO"] = new Complex3(0, 0);
      Complex3["ONE"] = new Complex3(1, 0);
      Complex3["I"] = new Complex3(0, 1);
      Complex3["PI"] = new Complex3(Math.PI, 0);
      Complex3["E"] = new Complex3(Math.E, 0);
      Complex3["INFINITY"] = new Complex3(Infinity, Infinity);
      Complex3["NAN"] = new Complex3(NaN, NaN);
      Complex3["EPSILON"] = 1e-15;
      if (typeof define === "function" && define["amd"]) {
        define([], function() {
          return Complex3;
        });
      } else if (typeof exports === "object") {
        Object.defineProperty(Complex3, "__esModule", { "value": true });
        Complex3["default"] = Complex3;
        Complex3["Complex"] = Complex3;
        module["exports"] = Complex3;
      } else {
        root["Complex"] = Complex3;
      }
    })(exports);
  }
});

// node_modules/fraction.js/fraction.js
var require_fraction = __commonJS({
  "node_modules/fraction.js/fraction.js"(exports, module) {
    (function(root) {
      "use strict";
      var MAX_CYCLE_LEN = 2e3;
      var P2 = {
        "s": 1,
        "n": 0,
        "d": 1
      };
      function assign(n, s) {
        if (isNaN(n = parseInt(n, 10))) {
          throw InvalidParameter();
        }
        return n * s;
      }
      function newFraction(n, d) {
        if (d === 0) {
          throw DivisionByZero();
        }
        var f = Object.create(Fraction3.prototype);
        f["s"] = n < 0 ? -1 : 1;
        n = n < 0 ? -n : n;
        var a = gcd(n, d);
        f["n"] = n / a;
        f["d"] = d / a;
        return f;
      }
      function factorize(num) {
        var factors = {};
        var n = num;
        var i = 2;
        var s = 4;
        while (s <= n) {
          while (n % i === 0) {
            n /= i;
            factors[i] = (factors[i] || 0) + 1;
          }
          s += 1 + 2 * i++;
        }
        if (n !== num) {
          if (n > 1)
            factors[n] = (factors[n] || 0) + 1;
        } else {
          factors[num] = (factors[num] || 0) + 1;
        }
        return factors;
      }
      var parse = function(p1, p2) {
        var n = 0, d = 1, s = 1;
        var v = 0, w = 0, x = 0, y = 1, z = 1;
        var A = 0, B = 1;
        var C = 1, D = 1;
        var N = 1e7;
        var M;
        if (p1 === void 0 || p1 === null) {
        } else if (p2 !== void 0) {
          n = p1;
          d = p2;
          s = n * d;
          if (n % 1 !== 0 || d % 1 !== 0) {
            throw NonIntegerParameter();
          }
        } else
          switch (typeof p1) {
            case "object": {
              if ("d" in p1 && "n" in p1) {
                n = p1["n"];
                d = p1["d"];
                if ("s" in p1)
                  n *= p1["s"];
              } else if (0 in p1) {
                n = p1[0];
                if (1 in p1)
                  d = p1[1];
              } else {
                throw InvalidParameter();
              }
              s = n * d;
              break;
            }
            case "number": {
              if (p1 < 0) {
                s = p1;
                p1 = -p1;
              }
              if (p1 % 1 === 0) {
                n = p1;
              } else if (p1 > 0) {
                if (p1 >= 1) {
                  z = Math.pow(10, Math.floor(1 + Math.log(p1) / Math.LN10));
                  p1 /= z;
                }
                while (B <= N && D <= N) {
                  M = (A + C) / (B + D);
                  if (p1 === M) {
                    if (B + D <= N) {
                      n = A + C;
                      d = B + D;
                    } else if (D > B) {
                      n = C;
                      d = D;
                    } else {
                      n = A;
                      d = B;
                    }
                    break;
                  } else {
                    if (p1 > M) {
                      A += C;
                      B += D;
                    } else {
                      C += A;
                      D += B;
                    }
                    if (B > N) {
                      n = C;
                      d = D;
                    } else {
                      n = A;
                      d = B;
                    }
                  }
                }
                n *= z;
              } else if (isNaN(p1) || isNaN(p2)) {
                d = n = NaN;
              }
              break;
            }
            case "string": {
              B = p1.match(/\d+|./g);
              if (B === null)
                throw InvalidParameter();
              if (B[A] === "-") {
                s = -1;
                A++;
              } else if (B[A] === "+") {
                A++;
              }
              if (B.length === A + 1) {
                w = assign(B[A++], s);
              } else if (B[A + 1] === "." || B[A] === ".") {
                if (B[A] !== ".") {
                  v = assign(B[A++], s);
                }
                A++;
                if (A + 1 === B.length || B[A + 1] === "(" && B[A + 3] === ")" || B[A + 1] === "'" && B[A + 3] === "'") {
                  w = assign(B[A], s);
                  y = Math.pow(10, B[A].length);
                  A++;
                }
                if (B[A] === "(" && B[A + 2] === ")" || B[A] === "'" && B[A + 2] === "'") {
                  x = assign(B[A + 1], s);
                  z = Math.pow(10, B[A + 1].length) - 1;
                  A += 3;
                }
              } else if (B[A + 1] === "/" || B[A + 1] === ":") {
                w = assign(B[A], s);
                y = assign(B[A + 2], 1);
                A += 3;
              } else if (B[A + 3] === "/" && B[A + 1] === " ") {
                v = assign(B[A], s);
                w = assign(B[A + 2], s);
                y = assign(B[A + 4], 1);
                A += 5;
              }
              if (B.length <= A) {
                d = y * z;
                s = /* void */
                n = x + d * v + z * w;
                break;
              }
            }
            default:
              throw InvalidParameter();
          }
        if (d === 0) {
          throw DivisionByZero();
        }
        P2["s"] = s < 0 ? -1 : 1;
        P2["n"] = Math.abs(n);
        P2["d"] = Math.abs(d);
      };
      function modpow(b, e, m) {
        var r = 1;
        for (; e > 0; b = b * b % m, e >>= 1) {
          if (e & 1) {
            r = r * b % m;
          }
        }
        return r;
      }
      function cycleLen(n, d) {
        for (; d % 2 === 0; d /= 2) {
        }
        for (; d % 5 === 0; d /= 5) {
        }
        if (d === 1)
          return 0;
        var rem = 10 % d;
        var t = 1;
        for (; rem !== 1; t++) {
          rem = rem * 10 % d;
          if (t > MAX_CYCLE_LEN)
            return 0;
        }
        return t;
      }
      function cycleStart(n, d, len) {
        var rem1 = 1;
        var rem2 = modpow(10, len, d);
        for (var t = 0; t < 300; t++) {
          if (rem1 === rem2)
            return t;
          rem1 = rem1 * 10 % d;
          rem2 = rem2 * 10 % d;
        }
        return 0;
      }
      function gcd(a, b) {
        if (!a)
          return b;
        if (!b)
          return a;
        while (1) {
          a %= b;
          if (!a)
            return b;
          b %= a;
          if (!b)
            return a;
        }
      }
      ;
      function Fraction3(a, b) {
        parse(a, b);
        if (this instanceof Fraction3) {
          a = gcd(P2["d"], P2["n"]);
          this["s"] = P2["s"];
          this["n"] = P2["n"] / a;
          this["d"] = P2["d"] / a;
        } else {
          return newFraction(P2["s"] * P2["n"], P2["d"]);
        }
      }
      var DivisionByZero = function() {
        return new Error("Division by Zero");
      };
      var InvalidParameter = function() {
        return new Error("Invalid argument");
      };
      var NonIntegerParameter = function() {
        return new Error("Parameters must be integer");
      };
      Fraction3.prototype = {
        "s": 1,
        "n": 0,
        "d": 1,
        /**
         * Calculates the absolute value
         *
         * Ex: new Fraction(-4).abs() => 4
         **/
        "abs": function() {
          return newFraction(this["n"], this["d"]);
        },
        /**
         * Inverts the sign of the current fraction
         *
         * Ex: new Fraction(-4).neg() => 4
         **/
        "neg": function() {
          return newFraction(-this["s"] * this["n"], this["d"]);
        },
        /**
         * Adds two rational numbers
         *
         * Ex: new Fraction({n: 2, d: 3}).add("14.9") => 467 / 30
         **/
        "add": function(a, b) {
          parse(a, b);
          return newFraction(
            this["s"] * this["n"] * P2["d"] + P2["s"] * this["d"] * P2["n"],
            this["d"] * P2["d"]
          );
        },
        /**
         * Subtracts two rational numbers
         *
         * Ex: new Fraction({n: 2, d: 3}).add("14.9") => -427 / 30
         **/
        "sub": function(a, b) {
          parse(a, b);
          return newFraction(
            this["s"] * this["n"] * P2["d"] - P2["s"] * this["d"] * P2["n"],
            this["d"] * P2["d"]
          );
        },
        /**
         * Multiplies two rational numbers
         *
         * Ex: new Fraction("-17.(345)").mul(3) => 5776 / 111
         **/
        "mul": function(a, b) {
          parse(a, b);
          return newFraction(
            this["s"] * P2["s"] * this["n"] * P2["n"],
            this["d"] * P2["d"]
          );
        },
        /**
         * Divides two rational numbers
         *
         * Ex: new Fraction("-17.(345)").inverse().div(3)
         **/
        "div": function(a, b) {
          parse(a, b);
          return newFraction(
            this["s"] * P2["s"] * this["n"] * P2["d"],
            this["d"] * P2["n"]
          );
        },
        /**
         * Clones the actual object
         *
         * Ex: new Fraction("-17.(345)").clone()
         **/
        "clone": function() {
          return newFraction(this["s"] * this["n"], this["d"]);
        },
        /**
         * Calculates the modulo of two rational numbers - a more precise fmod
         *
         * Ex: new Fraction('4.(3)').mod([7, 8]) => (13/3) % (7/8) = (5/6)
         **/
        "mod": function(a, b) {
          if (isNaN(this["n"]) || isNaN(this["d"])) {
            return new Fraction3(NaN);
          }
          if (a === void 0) {
            return newFraction(this["s"] * this["n"] % this["d"], 1);
          }
          parse(a, b);
          if (0 === P2["n"] && 0 === this["d"]) {
            throw DivisionByZero();
          }
          return newFraction(
            this["s"] * (P2["d"] * this["n"]) % (P2["n"] * this["d"]),
            P2["d"] * this["d"]
          );
        },
        /**
         * Calculates the fractional gcd of two rational numbers
         *
         * Ex: new Fraction(5,8).gcd(3,7) => 1/56
         */
        "gcd": function(a, b) {
          parse(a, b);
          return newFraction(gcd(P2["n"], this["n"]) * gcd(P2["d"], this["d"]), P2["d"] * this["d"]);
        },
        /**
         * Calculates the fractional lcm of two rational numbers
         *
         * Ex: new Fraction(5,8).lcm(3,7) => 15
         */
        "lcm": function(a, b) {
          parse(a, b);
          if (P2["n"] === 0 && this["n"] === 0) {
            return newFraction(0, 1);
          }
          return newFraction(P2["n"] * this["n"], gcd(P2["n"], this["n"]) * gcd(P2["d"], this["d"]));
        },
        /**
         * Calculates the ceil of a rational number
         *
         * Ex: new Fraction('4.(3)').ceil() => (5 / 1)
         **/
        "ceil": function(places) {
          places = Math.pow(10, places || 0);
          if (isNaN(this["n"]) || isNaN(this["d"])) {
            return new Fraction3(NaN);
          }
          return newFraction(Math.ceil(places * this["s"] * this["n"] / this["d"]), places);
        },
        /**
         * Calculates the floor of a rational number
         *
         * Ex: new Fraction('4.(3)').floor() => (4 / 1)
         **/
        "floor": function(places) {
          places = Math.pow(10, places || 0);
          if (isNaN(this["n"]) || isNaN(this["d"])) {
            return new Fraction3(NaN);
          }
          return newFraction(Math.floor(places * this["s"] * this["n"] / this["d"]), places);
        },
        /**
         * Rounds a rational numbers
         *
         * Ex: new Fraction('4.(3)').round() => (4 / 1)
         **/
        "round": function(places) {
          places = Math.pow(10, places || 0);
          if (isNaN(this["n"]) || isNaN(this["d"])) {
            return new Fraction3(NaN);
          }
          return newFraction(Math.round(places * this["s"] * this["n"] / this["d"]), places);
        },
        /**
         * Gets the inverse of the fraction, means numerator and denominator are exchanged
         *
         * Ex: new Fraction([-3, 4]).inverse() => -4 / 3
         **/
        "inverse": function() {
          return newFraction(this["s"] * this["d"], this["n"]);
        },
        /**
         * Calculates the fraction to some rational exponent, if possible
         *
         * Ex: new Fraction(-1,2).pow(-3) => -8
         */
        "pow": function(a, b) {
          parse(a, b);
          if (P2["d"] === 1) {
            if (P2["s"] < 0) {
              return newFraction(Math.pow(this["s"] * this["d"], P2["n"]), Math.pow(this["n"], P2["n"]));
            } else {
              return newFraction(Math.pow(this["s"] * this["n"], P2["n"]), Math.pow(this["d"], P2["n"]));
            }
          }
          if (this["s"] < 0)
            return null;
          var N = factorize(this["n"]);
          var D = factorize(this["d"]);
          var n = 1;
          var d = 1;
          for (var k in N) {
            if (k === "1")
              continue;
            if (k === "0") {
              n = 0;
              break;
            }
            N[k] *= P2["n"];
            if (N[k] % P2["d"] === 0) {
              N[k] /= P2["d"];
            } else
              return null;
            n *= Math.pow(k, N[k]);
          }
          for (var k in D) {
            if (k === "1")
              continue;
            D[k] *= P2["n"];
            if (D[k] % P2["d"] === 0) {
              D[k] /= P2["d"];
            } else
              return null;
            d *= Math.pow(k, D[k]);
          }
          if (P2["s"] < 0) {
            return newFraction(d, n);
          }
          return newFraction(n, d);
        },
        /**
         * Check if two rational numbers are the same
         *
         * Ex: new Fraction(19.6).equals([98, 5]);
         **/
        "equals": function(a, b) {
          parse(a, b);
          return this["s"] * this["n"] * P2["d"] === P2["s"] * P2["n"] * this["d"];
        },
        /**
         * Check if two rational numbers are the same
         *
         * Ex: new Fraction(19.6).equals([98, 5]);
         **/
        "compare": function(a, b) {
          parse(a, b);
          var t = this["s"] * this["n"] * P2["d"] - P2["s"] * P2["n"] * this["d"];
          return (0 < t) - (t < 0);
        },
        "simplify": function(eps) {
          if (isNaN(this["n"]) || isNaN(this["d"])) {
            return this;
          }
          eps = eps || 1e-3;
          var thisABS = this["abs"]();
          var cont = thisABS["toContinued"]();
          for (var i = 1; i < cont.length; i++) {
            var s = newFraction(cont[i - 1], 1);
            for (var k = i - 2; k >= 0; k--) {
              s = s["inverse"]()["add"](cont[k]);
            }
            if (Math.abs(s["sub"](thisABS).valueOf()) < eps) {
              return s["mul"](this["s"]);
            }
          }
          return this;
        },
        /**
         * Check if two rational numbers are divisible
         *
         * Ex: new Fraction(19.6).divisible(1.5);
         */
        "divisible": function(a, b) {
          parse(a, b);
          return !(!(P2["n"] * this["d"]) || this["n"] * P2["d"] % (P2["n"] * this["d"]));
        },
        /**
         * Returns a decimal representation of the fraction
         *
         * Ex: new Fraction("100.'91823'").valueOf() => 100.91823918239183
         **/
        "valueOf": function() {
          return this["s"] * this["n"] / this["d"];
        },
        /**
         * Returns a string-fraction representation of a Fraction object
         *
         * Ex: new Fraction("1.'3'").toFraction(true) => "4 1/3"
         **/
        "toFraction": function(excludeWhole) {
          var whole, str = "";
          var n = this["n"];
          var d = this["d"];
          if (this["s"] < 0) {
            str += "-";
          }
          if (d === 1) {
            str += n;
          } else {
            if (excludeWhole && (whole = Math.floor(n / d)) > 0) {
              str += whole;
              str += " ";
              n %= d;
            }
            str += n;
            str += "/";
            str += d;
          }
          return str;
        },
        /**
         * Returns a latex representation of a Fraction object
         *
         * Ex: new Fraction("1.'3'").toLatex() => "\frac{4}{3}"
         **/
        "toLatex": function(excludeWhole) {
          var whole, str = "";
          var n = this["n"];
          var d = this["d"];
          if (this["s"] < 0) {
            str += "-";
          }
          if (d === 1) {
            str += n;
          } else {
            if (excludeWhole && (whole = Math.floor(n / d)) > 0) {
              str += whole;
              n %= d;
            }
            str += "\\frac{";
            str += n;
            str += "}{";
            str += d;
            str += "}";
          }
          return str;
        },
        /**
         * Returns an array of continued fraction elements
         *
         * Ex: new Fraction("7/8").toContinued() => [0,1,7]
         */
        "toContinued": function() {
          var t;
          var a = this["n"];
          var b = this["d"];
          var res = [];
          if (isNaN(a) || isNaN(b)) {
            return res;
          }
          do {
            res.push(Math.floor(a / b));
            t = a % b;
            a = b;
            b = t;
          } while (a !== 1);
          return res;
        },
        /**
         * Creates a string representation of a fraction with all digits
         *
         * Ex: new Fraction("100.'91823'").toString() => "100.(91823)"
         **/
        "toString": function(dec) {
          var N = this["n"];
          var D = this["d"];
          if (isNaN(N) || isNaN(D)) {
            return "NaN";
          }
          dec = dec || 15;
          var cycLen = cycleLen(N, D);
          var cycOff = cycleStart(N, D, cycLen);
          var str = this["s"] < 0 ? "-" : "";
          str += N / D | 0;
          N %= D;
          N *= 10;
          if (N)
            str += ".";
          if (cycLen) {
            for (var i = cycOff; i--; ) {
              str += N / D | 0;
              N %= D;
              N *= 10;
            }
            str += "(";
            for (var i = cycLen; i--; ) {
              str += N / D | 0;
              N %= D;
              N *= 10;
            }
            str += ")";
          } else {
            for (var i = dec; N && i--; ) {
              str += N / D | 0;
              N %= D;
              N *= 10;
            }
          }
          return str;
        }
      };
      if (typeof exports === "object") {
        Object.defineProperty(Fraction3, "__esModule", { "value": true });
        Fraction3["default"] = Fraction3;
        Fraction3["Fraction"] = Fraction3;
        module["exports"] = Fraction3;
      } else {
        root["Fraction"] = Fraction3;
      }
    })(exports);
  }
});

// node_modules/@jcubic/wayne/index.min.js
var root_url = location.pathname.replace(/\/[^\/]+$/, "");
var root_url_re = new RegExp("^" + escape_re(root_url));
function normalize_url(url) {
  return url.replace(root_url_re, "");
}
function escape_re(str) {
  if (typeof str == "string") {
    var special = /([\^\$\[\]\(\)\{\}\+\*\.\|\?])/g;
    return str.replace(special, "\\$1");
  }
}
var HTTPResponse = class {
  constructor(resolve, reject) {
    this._resolve = resolve;
    this._reject = reject;
  }
  html(data, init) {
    this.send(data, { type: "text/html", ...init });
  }
  text(data, init) {
    this.send(data, init);
  }
  json(data, init) {
    this.send(JSON.stringify(data), { type: "application/json", ...init });
  }
  blob(blob, init = {}) {
    this._resolve(new Response(blob, init));
  }
  send(data, { type = "text/plain", ...init } = {}) {
    if (![void 0, null].includes(data)) {
      data = new Blob([data], { type });
    }
    this.blob(data, init);
  }
  async fetch(arg) {
    if (typeof arg === "string") {
      const _res = await fetch(arg);
      const type = _res.headers.get("Content-Type") ?? "application/octet-stream";
      this.send(await _res.arrayBuffer(), { type });
    } else if (arg instanceof Request) {
      return fetch(arg).then(this._resolve).catch(this._reject);
    }
  }
  download(content, { filename = "download", type = "text/plain", ...init } = {}) {
    const headers = { "Content-Disposition": `attachment; filename="${filename}"` };
    this.send(content, { type, headers, ...init });
  }
  redirect(code, url) {
    if (url === void 0) {
      url = code;
      code = 302;
    }
    if (!url.match(/https?:\/\//)) {
      url = root_url + url;
    }
    this._resolve(Response.redirect(url, code));
  }
  sse({ onClose } = {}) {
    let send, close, stream, defunct;
    stream = new ReadableStream({ cancel() {
      defunct = true;
      trigger(onClose);
    }, start: (controller) => {
      send = function(event) {
        if (!defunct) {
          const chunk = createChunk(event);
          const payload = new TextEncoder().encode(chunk);
          controller.enqueue(payload);
        }
      };
      close = function close2() {
        controller.close();
        stream = null;
        trigger(onClose);
      };
    } });
    this._resolve(new Response(stream, { headers: { "Content-Type": "text/event-stream; charset=utf-8", "Transfer-Encoding": "chunked", Connection: "keep-alive" } }));
    return { send, close };
  }
};
function RouteParser() {
  const name_re = "[a-zA-Z_][a-zA-Z_0-9]*";
  const self2 = this;
  const open_tag = "{";
  const close_tag = "}";
  const glob = "*";
  const number2 = "\\d";
  const optional = "?";
  const open_group = "(";
  const close_group = ")";
  const plus = "+";
  const dot2 = ".";
  self2.route_parser = function(open, close) {
    const routes = {};
    const tag_re = new RegExp("(" + escape_re(open) + name_re + escape_re(close) + ")", "g");
    const tokenizer_re = new RegExp(["(", escape_re(open), name_re, escape_re(close), "|", escape_re(glob), "|", escape_re(number2), "|", escape_re(dot2), "|", escape_re(optional), "|", escape_re(open_group), "|", escape_re(close_group), "|", escape_re(plus), ")"].join(""), "g");
    const clear_re = new RegExp(escape_re(open) + "(" + name_re + ")" + escape_re(close), "g");
    return function(str) {
      const result = [];
      let index = 0;
      let parentheses = 0;
      str = str.split(tokenizer_re).map(function(chunk, i, chunks) {
        if (chunk === open_group) {
          parentheses++;
        } else if (chunk === close_group) {
          parentheses--;
        }
        if ([open_group, plus, close_group, optional, dot2, number2].includes(chunk)) {
          return chunk;
        } else if (chunk === glob) {
          result.push(index++);
          return "(.*?)";
        } else if (chunk.match(tag_re)) {
          result.push(chunk.replace(clear_re, "$1"));
          return "([^\\/]+)";
        } else {
          return chunk;
        }
      }).join("");
      if (parentheses !== 0) {
        throw new Error(`Wayne: Unbalanced parentheses in an expression: ${str}`);
      }
      return { re: str, names: result };
    };
  };
  const parse = self2.route_parser(open_tag, close_tag);
  self2.parse = parse;
  self2.pick = function(routes, url) {
    let input;
    let keys;
    if (routes instanceof Array) {
      input = {};
      keys = routes;
      routes.map(function(route) {
        input[route] = route;
      });
    } else {
      keys = Object.keys(routes);
      input = routes;
    }
    const results = [];
    for (let i = keys.length; i--; ) {
      const pattern = keys[i];
      const parts = parse(pattern);
      const m = url.match(new RegExp("^" + parts.re + "$"));
      if (m) {
        const matched = m.slice(1);
        const data = {};
        if (matched.length) {
          parts.names.forEach((name74, i2) => {
            data[name74] = matched[i2];
          });
        }
        results.push({ pattern, data });
      }
    }
    return results;
  };
}
function html(content) {
  return ["<!DOCTYPE html>", "<html>", "<head>", '<meta charset="UTF-8">', "<title>Wayne Service Worker</title>", "</head>", "<body>", ...content, "</body>", "</html>"].join("\n");
}
function error500(error2) {
  var output = html(["<h1>Wayne: 500 Server Error</h1>", "<p>Service worker give 500 error</p>", `<p>${error2.message || error2}</p>`, `<pre>${error2.stack || ""}</pre>`]);
  return [output, { status: 500, statusText: "500 Server Error" }];
}
function createChunk({ data, event, retry, id }) {
  return Object.entries({ event, id, data, retry }).filter(([, value]) => value).map(([key, value]) => `${key}: ${value}`).join("\n") + "\n\n";
}
function trigger(maybeFn, ...args) {
  if (typeof maybeFn === "function") {
    maybeFn(...args);
  }
}
function chain_handlers(handlers, callback) {
  if (handlers.length) {
    return new Promise((resolve, reject) => {
      let i = 0;
      (async function recur() {
        const handler = handlers[i];
        if (!handler) {
          return resolve();
        }
        try {
          await callback(handler, function next() {
            i++;
            recur();
          });
        } catch (error2) {
          reject(error2);
        }
      })();
    });
  }
}
var Wayne = class {
  constructor() {
    this._er_handlers = [];
    this._middlewares = [];
    this._routes = {};
    this._timeout = 5 * 60 * 1e3;
    this._parser = new RouteParser();
    self.addEventListener("fetch", (event) => {
      const promise = new Promise(async (resolve, reject) => {
        const req = event.request;
        try {
          const res = new HTTPResponse(resolve, reject);
          await chain_handlers(this._middlewares, function(fn, next) {
            return fn(req, res, next);
          });
          const method = req.method;
          const url = new URL(req.url);
          const path = normalize_url(url.pathname);
          const routes = this._routes[method];
          if (routes) {
            const match = this._parser.pick(routes, path);
            if (match.length) {
              const [first_match] = match;
              const fns = [...this._middlewares, ...routes[first_match.pattern]];
              req.params = first_match.data;
              setTimeout(function() {
                reject("Timeout Error");
              }, this._timeout);
              await chain_handlers(fns, (fn, next) => {
                return fn(req, res, next);
              });
              return;
            }
          }
          if (event.request.cache === "only-if-cached" && event.request.mode !== "same-origin") {
            return;
          }
          fetch(event.request).then(resolve).catch(reject);
        } catch (error2) {
          this._handle_error(resolve, req, error2);
        }
      });
      event.respondWith(promise.catch(() => {
      }));
    });
    ["GET", "POST", "DELETE", "PATCH", "PUT"].forEach((method) => {
      this[method.toLowerCase()] = this.method(method);
    });
  }
  _handle_error(resolve, req, error2) {
    const res = new HTTPResponse(resolve);
    if (this._er_handlers.length) {
      chain_handlers(this._er_handlers, function(handler, next) {
        handler(error2, req, res, next);
      }, function(error3) {
        res.html(...error500(error3));
      });
    } else {
      res.html(...error500(error2));
    }
  }
  use(...fns) {
    fns.forEach((fn) => {
      if (typeof fn === "function") {
        if (fn.length === 4) {
          this._er_handlers.push(fn);
        } else if (fn.length === 3) {
          this._middlewares.push(fn);
        }
      }
    });
  }
  method(method) {
    return function(url, fn) {
      if (!this._routes[method]) {
        this._routes[method] = {};
      }
      const routes = this._routes[method];
      if (!routes[url]) {
        routes[url] = [];
      }
      routes[url].push(fn);
      return this;
    };
  }
};

// src/library/utils/collisions.js
var DEFAULT_ENDPOINT = "https://pfn8zf2gtu.us-east-2.awsapprunner.com/get-collisions";
async function getCollisions(ruiLocation, endpoint = DEFAULT_ENDPOINT) {
  const resp = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ruiLocation)
  });
  if (resp.ok) {
    return await resp.json();
  } else {
    return [];
  }
}

// src/library/utils/sparql.js
var import_jsonld = __toESM(require_jsonld(), 1);
var import_papaparse = __toESM(require_papaparse_min(), 1);
import_jsonld.default.documentLoader = async (documentUrl) => {
  const document = await fetch(documentUrl).then((r) => r.json());
  return {
    contextUrl: null,
    document,
    documentUrl
  };
};
function fetchSparql(query, endpoint, mimetype) {
  const body = new URLSearchParams({ query });
  return fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: mimetype,
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": body.toString().length.toString()
    },
    body
  });
}
async function select(query, endpoint) {
  const resp = await fetchSparql(query, endpoint, "text/csv");
  const text = await resp.text();
  const { data } = import_papaparse.default.parse(text, { header: true, skipEmptyLines: true });
  return data;
}
async function construct(query, endpoint, frame = void 0) {
  const resp = await fetchSparql(query, endpoint, "application/ld+json");
  const json = await resp.json();
  if (frame) {
    return await import_jsonld.default.frame(json, frame);
  } else {
    return json;
  }
}

// src/library/queries/as-weighted-cell-summaries.rq
var as_weighted_cell_summaries_default = "PREFIX ccf: <http://purl.org/ccf/>\nPREFIX ctpop: <https://cns-iu.github.io/hra-cell-type-populations-supporting-information/data/enriched_rui_locations.jsonld#>\nPREFIX UBERON: <http://purl.obolibrary.org/obo/UBERON_>\nPREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n\nSELECT ?modality ?cell_id ?cell_label \n  (?predicted_cell_count as ?count)\n  (?predicted_cell_count / ?total_cell_count as ?percentage)\nWHERE {\n  GRAPH ctpop:graph {\n    SELECT ?modality ?cell_id\n        (SAMPLE(?cell_label) as ?cell_label)\n        (SUM(?weighted_cell_count) as ?predicted_cell_count)\n    WHERE {\n      #{{AS_WEIGHT_VALUES}}\n      ?as ccf:has_cell_summary [\n        ccf:modality ?modality ;\n        ccf:has_cell_summary_row [\n          ccf:cell_id ?cell_id ;\n          ccf:cell_label ?cell_label ;\n          ccf:cell_count ?cell_count ;\n        ] ;\n      ] .\n\n      BIND(xsd:decimal(?cell_count) * xsd:decimal(?weight) as ?weighted_cell_count)\n    }\n    GROUP BY ?modality ?cell_id\n  }\n  \n  GRAPH ctpop:graph {\n    SELECT ?modality (SUM(?weighted_cell_count) as ?total_cell_count)\n    WHERE {\n      #{{AS_WEIGHT_VALUES}}\n      ?as ccf:has_cell_summary [\n        ccf:modality ?modality ;\n        ccf:has_cell_summary_row [\n          ccf:cell_count ?cell_count ;\n        ] ;\n      ] .\n      BIND(xsd:decimal(?cell_count) * xsd:decimal(?weight) as ?weighted_cell_count)\n    }\n    GROUP BY ?modality\n  }\n}\nORDER BY DESC(?predicted_cell_count)\n";

// src/library/get-cell-summary-from-rui-location.js
function getAnatomicalStructureWeights(collisions) {
  return collisions.reduce((asWeights, c) => {
    const iri = c.representation_of;
    const percent = c.percentage_of_tissue_block;
    asWeights[iri] = (asWeights[iri] ?? 0) + percent;
    return asWeights;
  }, {});
}
function getCellSummaryQuery(asWeights) {
  const values = Object.entries(asWeights).reduce((vals, [iri, weight]) => vals + ` (<${iri}> ${weight})`, "");
  const asWeightVals = `VALUES (?as ?weight) { ${values} }`;
  return as_weighted_cell_summaries_default.replaceAll("#{{AS_WEIGHT_VALUES}}", asWeightVals);
}
async function getCellSummary(ruiLocation, endpoint = "https://lod.humanatlas.io/sparql") {
  const collisions = await getCollisions(ruiLocation);
  if (collisions.length === 0) {
    return [];
  } else {
    const asWeights = getAnatomicalStructureWeights(collisions);
    const query = getCellSummaryQuery(asWeights);
    const summary = await select(query, endpoint);
    return summary;
  }
}

// src/library/get-similar-cell-sources.js
var import_papaparse2 = __toESM(require_papaparse_min(), 1);

// node_modules/@babel/runtime/helpers/esm/extends.js
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

// node_modules/mathjs/lib/esm/core/config.js
var DEFAULT_CONFIG = {
  // minimum relative difference between two compared values,
  // used by all comparison functions
  epsilon: 1e-12,
  // type of default matrix output. Choose 'matrix' (default) or 'array'
  matrix: "Matrix",
  // type of default number output. Choose 'number' (default) 'BigNumber', or 'Fraction
  number: "number",
  // number of significant digits in BigNumbers
  precision: 64,
  // predictable output type of functions. When true, output type depends only
  // on the input types. When false (default), output type can vary depending
  // on input values. For example `math.sqrt(-4)` returns `complex('2i')` when
  // predictable is false, and returns `NaN` when true.
  predictable: false,
  // random seed for seeded pseudo random number generation
  // null = randomly seed
  randomSeed: null
};

// node_modules/mathjs/lib/esm/utils/is.js
function isNumber(x) {
  return typeof x === "number";
}
function isBigNumber(x) {
  if (!x || typeof x !== "object" || typeof x.constructor !== "function") {
    return false;
  }
  if (x.isBigNumber === true && typeof x.constructor.prototype === "object" && x.constructor.prototype.isBigNumber === true) {
    return true;
  }
  if (typeof x.constructor.isDecimal === "function" && x.constructor.isDecimal(x) === true) {
    return true;
  }
  return false;
}
function isComplex(x) {
  return x && typeof x === "object" && Object.getPrototypeOf(x).isComplex === true || false;
}
function isFraction(x) {
  return x && typeof x === "object" && Object.getPrototypeOf(x).isFraction === true || false;
}
function isUnit(x) {
  return x && x.constructor.prototype.isUnit === true || false;
}
function isString(x) {
  return typeof x === "string";
}
var isArray = Array.isArray;
function isMatrix(x) {
  return x && x.constructor.prototype.isMatrix === true || false;
}
function isCollection(x) {
  return Array.isArray(x) || isMatrix(x);
}
function isDenseMatrix(x) {
  return x && x.isDenseMatrix && x.constructor.prototype.isMatrix === true || false;
}
function isSparseMatrix(x) {
  return x && x.isSparseMatrix && x.constructor.prototype.isMatrix === true || false;
}
function isRange(x) {
  return x && x.constructor.prototype.isRange === true || false;
}
function isIndex(x) {
  return x && x.constructor.prototype.isIndex === true || false;
}
function isBoolean(x) {
  return typeof x === "boolean";
}
function isResultSet(x) {
  return x && x.constructor.prototype.isResultSet === true || false;
}
function isHelp(x) {
  return x && x.constructor.prototype.isHelp === true || false;
}
function isFunction(x) {
  return typeof x === "function";
}
function isDate(x) {
  return x instanceof Date;
}
function isRegExp(x) {
  return x instanceof RegExp;
}
function isObject(x) {
  return !!(x && typeof x === "object" && x.constructor === Object && !isComplex(x) && !isFraction(x));
}
function isNull(x) {
  return x === null;
}
function isUndefined(x) {
  return x === void 0;
}
function isAccessorNode(x) {
  return x && x.isAccessorNode === true && x.constructor.prototype.isNode === true || false;
}
function isArrayNode(x) {
  return x && x.isArrayNode === true && x.constructor.prototype.isNode === true || false;
}
function isAssignmentNode(x) {
  return x && x.isAssignmentNode === true && x.constructor.prototype.isNode === true || false;
}
function isBlockNode(x) {
  return x && x.isBlockNode === true && x.constructor.prototype.isNode === true || false;
}
function isConditionalNode(x) {
  return x && x.isConditionalNode === true && x.constructor.prototype.isNode === true || false;
}
function isConstantNode(x) {
  return x && x.isConstantNode === true && x.constructor.prototype.isNode === true || false;
}
function isFunctionAssignmentNode(x) {
  return x && x.isFunctionAssignmentNode === true && x.constructor.prototype.isNode === true || false;
}
function isFunctionNode(x) {
  return x && x.isFunctionNode === true && x.constructor.prototype.isNode === true || false;
}
function isIndexNode(x) {
  return x && x.isIndexNode === true && x.constructor.prototype.isNode === true || false;
}
function isNode(x) {
  return x && x.isNode === true && x.constructor.prototype.isNode === true || false;
}
function isObjectNode(x) {
  return x && x.isObjectNode === true && x.constructor.prototype.isNode === true || false;
}
function isOperatorNode(x) {
  return x && x.isOperatorNode === true && x.constructor.prototype.isNode === true || false;
}
function isParenthesisNode(x) {
  return x && x.isParenthesisNode === true && x.constructor.prototype.isNode === true || false;
}
function isRangeNode(x) {
  return x && x.isRangeNode === true && x.constructor.prototype.isNode === true || false;
}
function isRelationalNode(x) {
  return x && x.isRelationalNode === true && x.constructor.prototype.isNode === true || false;
}
function isSymbolNode(x) {
  return x && x.isSymbolNode === true && x.constructor.prototype.isNode === true || false;
}
function isChain(x) {
  return x && x.constructor.prototype.isChain === true || false;
}
function typeOf(x) {
  var t = typeof x;
  if (t === "object") {
    if (x === null)
      return "null";
    if (isBigNumber(x))
      return "BigNumber";
    if (x.constructor && x.constructor.name)
      return x.constructor.name;
    return "Object";
  }
  return t;
}

// node_modules/mathjs/lib/esm/utils/object.js
function clone(x) {
  var type = typeof x;
  if (type === "number" || type === "string" || type === "boolean" || x === null || x === void 0) {
    return x;
  }
  if (typeof x.clone === "function") {
    return x.clone();
  }
  if (Array.isArray(x)) {
    return x.map(function(value) {
      return clone(value);
    });
  }
  if (x instanceof Date)
    return new Date(x.valueOf());
  if (isBigNumber(x))
    return x;
  if (isObject(x)) {
    return mapObject(x, clone);
  }
  throw new TypeError("Cannot clone: unknown type of value (value: ".concat(x, ")"));
}
function mapObject(object, callback) {
  var clone4 = {};
  for (var key in object) {
    if (hasOwnProperty(object, key)) {
      clone4[key] = callback(object[key]);
    }
  }
  return clone4;
}
function extend(a, b) {
  for (var prop in b) {
    if (hasOwnProperty(b, prop)) {
      a[prop] = b[prop];
    }
  }
  return a;
}
function deepStrictEqual(a, b) {
  var prop, i, len;
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) {
      return false;
    }
    if (a.length !== b.length) {
      return false;
    }
    for (i = 0, len = a.length; i < len; i++) {
      if (!deepStrictEqual(a[i], b[i])) {
        return false;
      }
    }
    return true;
  } else if (typeof a === "function") {
    return a === b;
  } else if (a instanceof Object) {
    if (Array.isArray(b) || !(b instanceof Object)) {
      return false;
    }
    for (prop in a) {
      if (!(prop in b) || !deepStrictEqual(a[prop], b[prop])) {
        return false;
      }
    }
    for (prop in b) {
      if (!(prop in a)) {
        return false;
      }
    }
    return true;
  } else {
    return a === b;
  }
}
function hasOwnProperty(object, property) {
  return object && Object.hasOwnProperty.call(object, property);
}
function pickShallow(object, properties) {
  var copy = {};
  for (var i = 0; i < properties.length; i++) {
    var key = properties[i];
    var value = object[key];
    if (value !== void 0) {
      copy[key] = value;
    }
  }
  return copy;
}

// node_modules/mathjs/lib/esm/core/function/config.js
var MATRIX_OPTIONS = ["Matrix", "Array"];
var NUMBER_OPTIONS = ["number", "BigNumber", "Fraction"];

// node_modules/mathjs/lib/esm/entry/configReadonly.js
var config = function config2(options) {
  if (options) {
    throw new Error("The global config is readonly. \nPlease create a mathjs instance if you want to change the default configuration. \nExample:\n\n  import { create, all } from 'mathjs';\n  const mathjs = create(all);\n  mathjs.config({ number: 'BigNumber' });\n");
  }
  return Object.freeze(DEFAULT_CONFIG);
};
_extends(config, DEFAULT_CONFIG, {
  MATRIX_OPTIONS,
  NUMBER_OPTIONS
});

// node_modules/mathjs/lib/esm/core/function/typed.js
var import_typed_function = __toESM(require_typed_function(), 1);

// node_modules/mathjs/lib/esm/utils/number.js
function isInteger(value) {
  if (typeof value === "boolean") {
    return true;
  }
  return isFinite(value) ? value === Math.round(value) : false;
}
var sign = Math.sign || function(x) {
  if (x > 0) {
    return 1;
  } else if (x < 0) {
    return -1;
  } else {
    return 0;
  }
};
var log2 = Math.log2 || function log22(x) {
  return Math.log(x) / Math.LN2;
};
var log10 = Math.log10 || function log102(x) {
  return Math.log(x) / Math.LN10;
};
var log1p = Math.log1p || function(x) {
  return Math.log(x + 1);
};
var cbrt = Math.cbrt || function cbrt2(x) {
  if (x === 0) {
    return x;
  }
  var negate = x < 0;
  var result;
  if (negate) {
    x = -x;
  }
  if (isFinite(x)) {
    result = Math.exp(Math.log(x) / 3);
    result = (x / (result * result) + 2 * result) / 3;
  } else {
    result = x;
  }
  return negate ? -result : result;
};
var expm1 = Math.expm1 || function expm12(x) {
  return x >= 2e-4 || x <= -2e-4 ? Math.exp(x) - 1 : x + x * x / 2 + x * x * x / 6;
};
function formatNumberToBase(n, base, size2) {
  var prefixes = {
    2: "0b",
    8: "0o",
    16: "0x"
  };
  var prefix = prefixes[base];
  var suffix = "";
  if (size2) {
    if (size2 < 1) {
      throw new Error("size must be in greater than 0");
    }
    if (!isInteger(size2)) {
      throw new Error("size must be an integer");
    }
    if (n > 2 ** (size2 - 1) - 1 || n < -(2 ** (size2 - 1))) {
      throw new Error("Value must be in range [-2^".concat(size2 - 1, ", 2^").concat(size2 - 1, "-1]"));
    }
    if (!isInteger(n)) {
      throw new Error("Value must be an integer");
    }
    if (n < 0) {
      n = n + 2 ** size2;
    }
    suffix = "i".concat(size2);
  }
  var sign4 = "";
  if (n < 0) {
    n = -n;
    sign4 = "-";
  }
  return "".concat(sign4).concat(prefix).concat(n.toString(base)).concat(suffix);
}
function format(value, options) {
  if (typeof options === "function") {
    return options(value);
  }
  if (value === Infinity) {
    return "Infinity";
  } else if (value === -Infinity) {
    return "-Infinity";
  } else if (isNaN(value)) {
    return "NaN";
  }
  var notation = "auto";
  var precision;
  var wordSize;
  if (options) {
    if (options.notation) {
      notation = options.notation;
    }
    if (isNumber(options)) {
      precision = options;
    } else if (isNumber(options.precision)) {
      precision = options.precision;
    }
    if (options.wordSize) {
      wordSize = options.wordSize;
      if (typeof wordSize !== "number") {
        throw new Error('Option "wordSize" must be a number');
      }
    }
  }
  switch (notation) {
    case "fixed":
      return toFixed(value, precision);
    case "exponential":
      return toExponential(value, precision);
    case "engineering":
      return toEngineering(value, precision);
    case "bin":
      return formatNumberToBase(value, 2, wordSize);
    case "oct":
      return formatNumberToBase(value, 8, wordSize);
    case "hex":
      return formatNumberToBase(value, 16, wordSize);
    case "auto":
      return toPrecision(value, precision, options && options).replace(/((\.\d*?)(0+))($|e)/, function() {
        var digits2 = arguments[2];
        var e = arguments[4];
        return digits2 !== "." ? digits2 + e : e;
      });
    default:
      throw new Error('Unknown notation "' + notation + '". Choose "auto", "exponential", "fixed", "bin", "oct", or "hex.');
  }
}
function splitNumber(value) {
  var match = String(value).toLowerCase().match(/^(-?)(\d+\.?\d*)(e([+-]?\d+))?$/);
  if (!match) {
    throw new SyntaxError("Invalid number " + value);
  }
  var sign4 = match[1];
  var digits2 = match[2];
  var exponent = parseFloat(match[4] || "0");
  var dot2 = digits2.indexOf(".");
  exponent += dot2 !== -1 ? dot2 - 1 : digits2.length - 1;
  var coefficients = digits2.replace(".", "").replace(/^0*/, function(zeros3) {
    exponent -= zeros3.length;
    return "";
  }).replace(/0*$/, "").split("").map(function(d) {
    return parseInt(d);
  });
  if (coefficients.length === 0) {
    coefficients.push(0);
    exponent++;
  }
  return {
    sign: sign4,
    coefficients,
    exponent
  };
}
function toEngineering(value, precision) {
  if (isNaN(value) || !isFinite(value)) {
    return String(value);
  }
  var split = splitNumber(value);
  var rounded = roundDigits(split, precision);
  var e = rounded.exponent;
  var c = rounded.coefficients;
  var newExp = e % 3 === 0 ? e : e < 0 ? e - 3 - e % 3 : e - e % 3;
  if (isNumber(precision)) {
    while (precision > c.length || e - newExp + 1 > c.length) {
      c.push(0);
    }
  } else {
    var missingZeros = Math.abs(e - newExp) - (c.length - 1);
    for (var i = 0; i < missingZeros; i++) {
      c.push(0);
    }
  }
  var expDiff = Math.abs(e - newExp);
  var decimalIdx = 1;
  while (expDiff > 0) {
    decimalIdx++;
    expDiff--;
  }
  var decimals = c.slice(decimalIdx).join("");
  var decimalVal = isNumber(precision) && decimals.length || decimals.match(/[1-9]/) ? "." + decimals : "";
  var str = c.slice(0, decimalIdx).join("") + decimalVal + "e" + (e >= 0 ? "+" : "") + newExp.toString();
  return rounded.sign + str;
}
function toFixed(value, precision) {
  if (isNaN(value) || !isFinite(value)) {
    return String(value);
  }
  var splitValue = splitNumber(value);
  var rounded = typeof precision === "number" ? roundDigits(splitValue, splitValue.exponent + 1 + precision) : splitValue;
  var c = rounded.coefficients;
  var p = rounded.exponent + 1;
  var pp = p + (precision || 0);
  if (c.length < pp) {
    c = c.concat(zeros(pp - c.length));
  }
  if (p < 0) {
    c = zeros(-p + 1).concat(c);
    p = 1;
  }
  if (p < c.length) {
    c.splice(p, 0, p === 0 ? "0." : ".");
  }
  return rounded.sign + c.join("");
}
function toExponential(value, precision) {
  if (isNaN(value) || !isFinite(value)) {
    return String(value);
  }
  var split = splitNumber(value);
  var rounded = precision ? roundDigits(split, precision) : split;
  var c = rounded.coefficients;
  var e = rounded.exponent;
  if (c.length < precision) {
    c = c.concat(zeros(precision - c.length));
  }
  var first = c.shift();
  return rounded.sign + first + (c.length > 0 ? "." + c.join("") : "") + "e" + (e >= 0 ? "+" : "") + e;
}
function toPrecision(value, precision, options) {
  if (isNaN(value) || !isFinite(value)) {
    return String(value);
  }
  var lowerExp = options && options.lowerExp !== void 0 ? options.lowerExp : -3;
  var upperExp = options && options.upperExp !== void 0 ? options.upperExp : 5;
  var split = splitNumber(value);
  var rounded = precision ? roundDigits(split, precision) : split;
  if (rounded.exponent < lowerExp || rounded.exponent >= upperExp) {
    return toExponential(value, precision);
  } else {
    var c = rounded.coefficients;
    var e = rounded.exponent;
    if (c.length < precision) {
      c = c.concat(zeros(precision - c.length));
    }
    c = c.concat(zeros(e - c.length + 1 + (c.length < precision ? precision - c.length : 0)));
    c = zeros(-e).concat(c);
    var dot2 = e > 0 ? e : 0;
    if (dot2 < c.length - 1) {
      c.splice(dot2 + 1, 0, ".");
    }
    return rounded.sign + c.join("");
  }
}
function roundDigits(split, precision) {
  var rounded = {
    sign: split.sign,
    coefficients: split.coefficients,
    exponent: split.exponent
  };
  var c = rounded.coefficients;
  while (precision <= 0) {
    c.unshift(0);
    rounded.exponent++;
    precision++;
  }
  if (c.length > precision) {
    var removed = c.splice(precision, c.length - precision);
    if (removed[0] >= 5) {
      var i = precision - 1;
      c[i]++;
      while (c[i] === 10) {
        c.pop();
        if (i === 0) {
          c.unshift(0);
          rounded.exponent++;
          i++;
        }
        i--;
        c[i]++;
      }
    }
  }
  return rounded;
}
function zeros(length) {
  var arr = [];
  for (var i = 0; i < length; i++) {
    arr.push(0);
  }
  return arr;
}
function digits(value) {
  return value.toExponential().replace(/e.*$/, "").replace(/^0\.?0*|\./, "").length;
}
var DBL_EPSILON = Number.EPSILON || 2220446049250313e-31;
function nearlyEqual(x, y, epsilon) {
  if (epsilon === null || epsilon === void 0) {
    return x === y;
  }
  if (x === y) {
    return true;
  }
  if (isNaN(x) || isNaN(y)) {
    return false;
  }
  if (isFinite(x) && isFinite(y)) {
    var diff = Math.abs(x - y);
    if (diff < DBL_EPSILON) {
      return true;
    } else {
      return diff <= Math.max(Math.abs(x), Math.abs(y)) * epsilon;
    }
  }
  return false;
}

// node_modules/mathjs/lib/esm/utils/bignumber/formatter.js
function formatBigNumberToBase(n, base, size2) {
  var BigNumberCtor = n.constructor;
  var big2 = new BigNumberCtor(2);
  var suffix = "";
  if (size2) {
    if (size2 < 1) {
      throw new Error("size must be in greater than 0");
    }
    if (!isInteger(size2)) {
      throw new Error("size must be an integer");
    }
    if (n.greaterThan(big2.pow(size2 - 1).sub(1)) || n.lessThan(big2.pow(size2 - 1).mul(-1))) {
      throw new Error("Value must be in range [-2^".concat(size2 - 1, ", 2^").concat(size2 - 1, "-1]"));
    }
    if (!n.isInteger()) {
      throw new Error("Value must be an integer");
    }
    if (n.lessThan(0)) {
      n = n.add(big2.pow(size2));
    }
    suffix = "i".concat(size2);
  }
  switch (base) {
    case 2:
      return "".concat(n.toBinary()).concat(suffix);
    case 8:
      return "".concat(n.toOctal()).concat(suffix);
    case 16:
      return "".concat(n.toHexadecimal()).concat(suffix);
    default:
      throw new Error("Base ".concat(base, " not supported "));
  }
}
function format2(value, options) {
  if (typeof options === "function") {
    return options(value);
  }
  if (!value.isFinite()) {
    return value.isNaN() ? "NaN" : value.gt(0) ? "Infinity" : "-Infinity";
  }
  var notation = "auto";
  var precision;
  var wordSize;
  if (options !== void 0) {
    if (options.notation) {
      notation = options.notation;
    }
    if (typeof options === "number") {
      precision = options;
    } else if (options.precision !== void 0) {
      precision = options.precision;
    }
    if (options.wordSize) {
      wordSize = options.wordSize;
      if (typeof wordSize !== "number") {
        throw new Error('Option "wordSize" must be a number');
      }
    }
  }
  switch (notation) {
    case "fixed":
      return toFixed2(value, precision);
    case "exponential":
      return toExponential2(value, precision);
    case "engineering":
      return toEngineering2(value, precision);
    case "bin":
      return formatBigNumberToBase(value, 2, wordSize);
    case "oct":
      return formatBigNumberToBase(value, 8, wordSize);
    case "hex":
      return formatBigNumberToBase(value, 16, wordSize);
    case "auto": {
      var lowerExp = options && options.lowerExp !== void 0 ? options.lowerExp : -3;
      var upperExp = options && options.upperExp !== void 0 ? options.upperExp : 5;
      if (value.isZero())
        return "0";
      var str;
      var rounded = value.toSignificantDigits(precision);
      var exp2 = rounded.e;
      if (exp2 >= lowerExp && exp2 < upperExp) {
        str = rounded.toFixed();
      } else {
        str = toExponential2(value, precision);
      }
      return str.replace(/((\.\d*?)(0+))($|e)/, function() {
        var digits2 = arguments[2];
        var e = arguments[4];
        return digits2 !== "." ? digits2 + e : e;
      });
    }
    default:
      throw new Error('Unknown notation "' + notation + '". Choose "auto", "exponential", "fixed", "bin", "oct", or "hex.');
  }
}
function toEngineering2(value, precision) {
  var e = value.e;
  var newExp = e % 3 === 0 ? e : e < 0 ? e - 3 - e % 3 : e - e % 3;
  var valueWithoutExp = value.mul(Math.pow(10, -newExp));
  var valueStr = valueWithoutExp.toPrecision(precision);
  if (valueStr.indexOf("e") !== -1) {
    var BigNumber2 = value.constructor;
    valueStr = new BigNumber2(valueStr).toFixed();
  }
  return valueStr + "e" + (e >= 0 ? "+" : "") + newExp.toString();
}
function toExponential2(value, precision) {
  if (precision !== void 0) {
    return value.toExponential(precision - 1);
  } else {
    return value.toExponential();
  }
}
function toFixed2(value, precision) {
  return value.toFixed(precision);
}

// node_modules/mathjs/lib/esm/utils/string.js
function format3(value, options) {
  var result = _format(value, options);
  if (options && typeof options === "object" && "truncate" in options && result.length > options.truncate) {
    return result.substring(0, options.truncate - 3) + "...";
  }
  return result;
}
function _format(value, options) {
  if (typeof value === "number") {
    return format(value, options);
  }
  if (isBigNumber(value)) {
    return format2(value, options);
  }
  if (looksLikeFraction(value)) {
    if (!options || options.fraction !== "decimal") {
      return value.s * value.n + "/" + value.d;
    } else {
      return value.toString();
    }
  }
  if (Array.isArray(value)) {
    return formatArray(value, options);
  }
  if (isString(value)) {
    return stringify(value);
  }
  if (typeof value === "function") {
    return value.syntax ? String(value.syntax) : "function";
  }
  if (value && typeof value === "object") {
    if (typeof value.format === "function") {
      return value.format(options);
    } else if (value && value.toString(options) !== {}.toString()) {
      return value.toString(options);
    } else {
      var entries = Object.keys(value).map((key) => {
        return stringify(key) + ": " + format3(value[key], options);
      });
      return "{" + entries.join(", ") + "}";
    }
  }
  return String(value);
}
function stringify(value) {
  var text = String(value);
  var escaped = "";
  var i = 0;
  while (i < text.length) {
    var c = text.charAt(i);
    escaped += c in controlCharacters ? controlCharacters[c] : c;
    i++;
  }
  return '"' + escaped + '"';
}
var controlCharacters = {
  '"': '\\"',
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t"
};
function formatArray(array, options) {
  if (Array.isArray(array)) {
    var str = "[";
    var len = array.length;
    for (var i = 0; i < len; i++) {
      if (i !== 0) {
        str += ", ";
      }
      str += formatArray(array[i], options);
    }
    str += "]";
    return str;
  } else {
    return format3(array, options);
  }
}
function looksLikeFraction(value) {
  return value && typeof value === "object" && typeof value.s === "number" && typeof value.n === "number" && typeof value.d === "number" || false;
}

// node_modules/mathjs/lib/esm/error/DimensionError.js
function DimensionError(actual, expected, relation) {
  if (!(this instanceof DimensionError)) {
    throw new SyntaxError("Constructor must be called with the new operator");
  }
  this.actual = actual;
  this.expected = expected;
  this.relation = relation;
  this.message = "Dimension mismatch (" + (Array.isArray(actual) ? "[" + actual.join(", ") + "]" : actual) + " " + (this.relation || "!=") + " " + (Array.isArray(expected) ? "[" + expected.join(", ") + "]" : expected) + ")";
  this.stack = new Error().stack;
}
DimensionError.prototype = new RangeError();
DimensionError.prototype.constructor = RangeError;
DimensionError.prototype.name = "DimensionError";
DimensionError.prototype.isDimensionError = true;

// node_modules/mathjs/lib/esm/error/IndexError.js
function IndexError(index, min2, max2) {
  if (!(this instanceof IndexError)) {
    throw new SyntaxError("Constructor must be called with the new operator");
  }
  this.index = index;
  if (arguments.length < 3) {
    this.min = 0;
    this.max = min2;
  } else {
    this.min = min2;
    this.max = max2;
  }
  if (this.min !== void 0 && this.index < this.min) {
    this.message = "Index out of range (" + this.index + " < " + this.min + ")";
  } else if (this.max !== void 0 && this.index >= this.max) {
    this.message = "Index out of range (" + this.index + " > " + (this.max - 1) + ")";
  } else {
    this.message = "Index out of range (" + this.index + ")";
  }
  this.stack = new Error().stack;
}
IndexError.prototype = new RangeError();
IndexError.prototype.constructor = RangeError;
IndexError.prototype.name = "IndexError";
IndexError.prototype.isIndexError = true;

// node_modules/mathjs/lib/esm/utils/array.js
function arraySize(x) {
  var s = [];
  while (Array.isArray(x)) {
    s.push(x.length);
    x = x[0];
  }
  return s;
}
function _validate(array, size2, dim) {
  var i;
  var len = array.length;
  if (len !== size2[dim]) {
    throw new DimensionError(len, size2[dim]);
  }
  if (dim < size2.length - 1) {
    var dimNext = dim + 1;
    for (i = 0; i < len; i++) {
      var child = array[i];
      if (!Array.isArray(child)) {
        throw new DimensionError(size2.length - 1, size2.length, "<");
      }
      _validate(array[i], size2, dimNext);
    }
  } else {
    for (i = 0; i < len; i++) {
      if (Array.isArray(array[i])) {
        throw new DimensionError(size2.length + 1, size2.length, ">");
      }
    }
  }
}
function validate(array, size2) {
  var isScalar = size2.length === 0;
  if (isScalar) {
    if (Array.isArray(array)) {
      throw new DimensionError(array.length, 0);
    }
  } else {
    _validate(array, size2, 0);
  }
}
function validateIndex(index, length) {
  if (index !== void 0) {
    if (!isNumber(index) || !isInteger(index)) {
      throw new TypeError("Index must be an integer (value: " + index + ")");
    }
    if (index < 0 || typeof length === "number" && index >= length) {
      throw new IndexError(index, length);
    }
  }
}
function resize(array, size2, defaultValue) {
  if (!Array.isArray(size2)) {
    throw new TypeError("Array expected");
  }
  if (size2.length === 0) {
    throw new Error("Resizing to scalar is not supported");
  }
  size2.forEach(function(value) {
    if (!isNumber(value) || !isInteger(value) || value < 0) {
      throw new TypeError("Invalid size, must contain positive integers (size: " + format3(size2) + ")");
    }
  });
  if (isNumber(array) || isBigNumber(array)) {
    array = [array];
  }
  var _defaultValue = defaultValue !== void 0 ? defaultValue : 0;
  _resize(array, size2, 0, _defaultValue);
  return array;
}
function _resize(array, size2, dim, defaultValue) {
  var i;
  var elem;
  var oldLen = array.length;
  var newLen = size2[dim];
  var minLen = Math.min(oldLen, newLen);
  array.length = newLen;
  if (dim < size2.length - 1) {
    var dimNext = dim + 1;
    for (i = 0; i < minLen; i++) {
      elem = array[i];
      if (!Array.isArray(elem)) {
        elem = [elem];
        array[i] = elem;
      }
      _resize(elem, size2, dimNext, defaultValue);
    }
    for (i = minLen; i < newLen; i++) {
      elem = [];
      array[i] = elem;
      _resize(elem, size2, dimNext, defaultValue);
    }
  } else {
    for (i = 0; i < minLen; i++) {
      while (Array.isArray(array[i])) {
        array[i] = array[i][0];
      }
    }
    for (i = minLen; i < newLen; i++) {
      array[i] = defaultValue;
    }
  }
}
function reshape(array, sizes) {
  var flatArray = flatten(array);
  var currentLength = flatArray.length;
  if (!Array.isArray(array) || !Array.isArray(sizes)) {
    throw new TypeError("Array expected");
  }
  if (sizes.length === 0) {
    throw new DimensionError(0, currentLength, "!=");
  }
  sizes = processSizesWildcard(sizes, currentLength);
  var newLength = product(sizes);
  if (currentLength !== newLength) {
    throw new DimensionError(newLength, currentLength, "!=");
  }
  try {
    return _reshape(flatArray, sizes);
  } catch (e) {
    if (e instanceof DimensionError) {
      throw new DimensionError(newLength, currentLength, "!=");
    }
    throw e;
  }
}
function processSizesWildcard(sizes, currentLength) {
  var newLength = product(sizes);
  var processedSizes = sizes.slice();
  var WILDCARD = -1;
  var wildCardIndex = sizes.indexOf(WILDCARD);
  var isMoreThanOneWildcard = sizes.indexOf(WILDCARD, wildCardIndex + 1) >= 0;
  if (isMoreThanOneWildcard) {
    throw new Error("More than one wildcard in sizes");
  }
  var hasWildcard = wildCardIndex >= 0;
  var canReplaceWildcard = currentLength % newLength === 0;
  if (hasWildcard) {
    if (canReplaceWildcard) {
      processedSizes[wildCardIndex] = -currentLength / newLength;
    } else {
      throw new Error("Could not replace wildcard, since " + currentLength + " is no multiple of " + -newLength);
    }
  }
  return processedSizes;
}
function product(array) {
  return array.reduce((prev, curr) => prev * curr, 1);
}
function _reshape(array, sizes) {
  var tmpArray = array;
  var tmpArray2;
  for (var sizeIndex = sizes.length - 1; sizeIndex > 0; sizeIndex--) {
    var size2 = sizes[sizeIndex];
    tmpArray2 = [];
    var length = tmpArray.length / size2;
    for (var i = 0; i < length; i++) {
      tmpArray2.push(tmpArray.slice(i * size2, (i + 1) * size2));
    }
    tmpArray = tmpArray2;
  }
  return tmpArray;
}
function unsqueeze(array, dims, outer, size2) {
  var s = size2 || arraySize(array);
  if (outer) {
    for (var i = 0; i < outer; i++) {
      array = [array];
      s.unshift(1);
    }
  }
  array = _unsqueeze(array, dims, 0);
  while (s.length < dims) {
    s.push(1);
  }
  return array;
}
function _unsqueeze(array, dims, dim) {
  var i, ii;
  if (Array.isArray(array)) {
    var next = dim + 1;
    for (i = 0, ii = array.length; i < ii; i++) {
      array[i] = _unsqueeze(array[i], dims, next);
    }
  } else {
    for (var d = dim; d < dims; d++) {
      array = [array];
    }
  }
  return array;
}
function flatten(array) {
  if (!Array.isArray(array)) {
    return array;
  }
  var flat = [];
  array.forEach(function callback(value) {
    if (Array.isArray(value)) {
      value.forEach(callback);
    } else {
      flat.push(value);
    }
  });
  return flat;
}
function getArrayDataType(array, typeOf2) {
  var type;
  var length = 0;
  for (var i = 0; i < array.length; i++) {
    var item = array[i];
    var _isArray = Array.isArray(item);
    if (i === 0 && _isArray) {
      length = item.length;
    }
    if (_isArray && item.length !== length) {
      return void 0;
    }
    var itemType = _isArray ? getArrayDataType(item, typeOf2) : typeOf2(item);
    if (type === void 0) {
      type = itemType;
    } else if (type !== itemType) {
      return "mixed";
    } else {
    }
  }
  return type;
}
function concatRecursive(a, b, concatDim, dim) {
  if (dim < concatDim) {
    if (a.length !== b.length) {
      throw new DimensionError(a.length, b.length);
    }
    var c = [];
    for (var i = 0; i < a.length; i++) {
      c[i] = concatRecursive(a[i], b[i], concatDim, dim + 1);
    }
    return c;
  } else {
    return a.concat(b);
  }
}
function concat() {
  var arrays = Array.prototype.slice.call(arguments, 0, -1);
  var concatDim = Array.prototype.slice.call(arguments, -1);
  if (arrays.length === 1) {
    return arrays[0];
  }
  if (arrays.length > 1) {
    return arrays.slice(1).reduce(function(A, B) {
      return concatRecursive(A, B, concatDim, 0);
    }, arrays[0]);
  } else {
    throw new Error("Wrong number of arguments in function concat");
  }
}
function broadcastSizes() {
  for (var _len = arguments.length, sizes = new Array(_len), _key = 0; _key < _len; _key++) {
    sizes[_key] = arguments[_key];
  }
  var dimensions = sizes.map((s) => s.length);
  var N = Math.max(...dimensions);
  var sizeMax = new Array(N).fill(null);
  for (var i = 0; i < sizes.length; i++) {
    var size2 = sizes[i];
    var dim = dimensions[i];
    for (var j = 0; j < dim; j++) {
      var n = N - dim + j;
      if (size2[j] > sizeMax[n]) {
        sizeMax[n] = size2[j];
      }
    }
  }
  for (var _i = 0; _i < sizes.length; _i++) {
    checkBroadcastingRules(sizes[_i], sizeMax);
  }
  return sizeMax;
}
function checkBroadcastingRules(size2, toSize) {
  var N = toSize.length;
  var dim = size2.length;
  for (var j = 0; j < dim; j++) {
    var n = N - dim + j;
    if (size2[j] < toSize[n] && size2[j] > 1 || size2[j] > toSize[n]) {
      throw new Error("shape missmatch: missmatch is found in arg with shape (".concat(size2, ") not possible to broadcast dimension ").concat(dim, " with size ").concat(size2[j], " to size ").concat(toSize[n]));
    }
  }
}
function broadcastTo(array, toSize) {
  var Asize = arraySize(array);
  if (deepStrictEqual(Asize, toSize)) {
    return array;
  }
  checkBroadcastingRules(Asize, toSize);
  var broadcastedSize = broadcastSizes(Asize, toSize);
  var N = broadcastedSize.length;
  var paddedSize = [...Array(N - Asize.length).fill(1), ...Asize];
  var A = clone2(array);
  if (Asize.length < N) {
    A = reshape(A, paddedSize);
    Asize = arraySize(A);
  }
  for (var dim = 0; dim < N; dim++) {
    if (Asize[dim] < broadcastedSize[dim]) {
      A = stretch(A, broadcastedSize[dim], dim);
      Asize = arraySize(A);
    }
  }
  return A;
}
function stretch(arrayToStretch, sizeToStretch, dimToStretch) {
  return concat(...Array(sizeToStretch).fill(arrayToStretch), dimToStretch);
}
function clone2(array) {
  return _extends([], array);
}

// node_modules/mathjs/lib/esm/utils/factory.js
function factory(name74, dependencies74, create, meta) {
  function assertAndCreate(scope) {
    var deps = pickShallow(scope, dependencies74.map(stripOptionalNotation));
    assertDependencies(name74, dependencies74, scope);
    return create(deps);
  }
  assertAndCreate.isFactory = true;
  assertAndCreate.fn = name74;
  assertAndCreate.dependencies = dependencies74.slice().sort();
  if (meta) {
    assertAndCreate.meta = meta;
  }
  return assertAndCreate;
}
function assertDependencies(name74, dependencies74, scope) {
  var allDefined = dependencies74.filter((dependency) => !isOptionalDependency(dependency)).every((dependency) => scope[dependency] !== void 0);
  if (!allDefined) {
    var missingDependencies = dependencies74.filter((dependency) => scope[dependency] === void 0);
    throw new Error('Cannot create function "'.concat(name74, '", ') + "some dependencies are missing: ".concat(missingDependencies.map((d) => '"'.concat(d, '"')).join(", "), "."));
  }
}
function isOptionalDependency(dependency) {
  return dependency && dependency[0] === "?";
}
function stripOptionalNotation(dependency) {
  return dependency && dependency[0] === "?" ? dependency.slice(1) : dependency;
}

// node_modules/mathjs/lib/esm/utils/customs.js
function getSafeProperty(object, prop) {
  if (isPlainObject(object) && isSafeProperty(object, prop)) {
    return object[prop];
  }
  if (typeof object[prop] === "function" && isSafeMethod(object, prop)) {
    throw new Error('Cannot access method "' + prop + '" as a property');
  }
  throw new Error('No access to property "' + prop + '"');
}
function setSafeProperty(object, prop, value) {
  if (isPlainObject(object) && isSafeProperty(object, prop)) {
    object[prop] = value;
    return value;
  }
  throw new Error('No access to property "' + prop + '"');
}
function hasSafeProperty(object, prop) {
  return prop in object;
}
function isSafeProperty(object, prop) {
  if (!object || typeof object !== "object") {
    return false;
  }
  if (hasOwnProperty(safeNativeProperties, prop)) {
    return true;
  }
  if (prop in Object.prototype) {
    return false;
  }
  if (prop in Function.prototype) {
    return false;
  }
  return true;
}
function isSafeMethod(object, method) {
  if (object === null || object === void 0 || typeof object[method] !== "function") {
    return false;
  }
  if (hasOwnProperty(object, method) && Object.getPrototypeOf && method in Object.getPrototypeOf(object)) {
    return false;
  }
  if (hasOwnProperty(safeNativeMethods, method)) {
    return true;
  }
  if (method in Object.prototype) {
    return false;
  }
  if (method in Function.prototype) {
    return false;
  }
  return true;
}
function isPlainObject(object) {
  return typeof object === "object" && object && object.constructor === Object;
}
var safeNativeProperties = {
  length: true,
  name: true
};
var safeNativeMethods = {
  toString: true,
  valueOf: true,
  toLocaleString: true
};

// node_modules/mathjs/lib/esm/utils/map.js
var ObjectWrappingMap = class {
  constructor(object) {
    this.wrappedObject = object;
  }
  keys() {
    return Object.keys(this.wrappedObject);
  }
  get(key) {
    return getSafeProperty(this.wrappedObject, key);
  }
  set(key, value) {
    setSafeProperty(this.wrappedObject, key, value);
    return this;
  }
  has(key) {
    return hasSafeProperty(this.wrappedObject, key);
  }
};
function isMap(object) {
  if (!object) {
    return false;
  }
  return object instanceof Map || object instanceof ObjectWrappingMap || typeof object.set === "function" && typeof object.get === "function" && typeof object.keys === "function" && typeof object.has === "function";
}

// node_modules/mathjs/lib/esm/core/function/typed.js
var _createTyped2 = function _createTyped() {
  _createTyped2 = import_typed_function.default.create;
  return import_typed_function.default;
};
var dependencies = ["?BigNumber", "?Complex", "?DenseMatrix", "?Fraction"];
var createTyped = /* @__PURE__ */ factory("typed", dependencies, function createTyped2(_ref) {
  var {
    BigNumber: BigNumber2,
    Complex: Complex3,
    DenseMatrix: DenseMatrix2,
    Fraction: Fraction3
  } = _ref;
  var typed2 = _createTyped2();
  typed2.clear();
  typed2.addTypes([
    {
      name: "number",
      test: isNumber
    },
    {
      name: "Complex",
      test: isComplex
    },
    {
      name: "BigNumber",
      test: isBigNumber
    },
    {
      name: "Fraction",
      test: isFraction
    },
    {
      name: "Unit",
      test: isUnit
    },
    // The following type matches a valid variable name, i.e., an alphanumeric
    // string starting with an alphabetic character. It is used (at least)
    // in the definition of the derivative() function, as the argument telling
    // what to differentiate over must (currently) be a variable.
    {
      name: "identifier",
      test: (s) => isString && /^(?:[A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD23\uDE80-\uDEA9\uDEB0\uDEB1\uDF00-\uDF1C\uDF27\uDF30-\uDF45\uDF70-\uDF81\uDFB0-\uDFC4\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE3F\uDE40\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDEB8\uDF00-\uDF1A\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCDF\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDEE0-\uDEF2\uDF02\uDF04-\uDF10\uDF12-\uDF33\uDFB0]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883\uD885-\uD887][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2F\uDC41-\uDC46]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE70-\uDEBE\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE7F\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD32\uDD50-\uDD52\uDD55\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD837[\uDF00-\uDF1E\uDF25-\uDF2A]|\uD838[\uDC30-\uDC6D\uDD00-\uDD2C\uDD37-\uDD3D\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB]|\uD839[\uDCD0-\uDCEB\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43\uDD4B]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF39\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A\uDF50-\uDFFF]|\uD888[\uDC00-\uDFAF])(?:[0-9A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD23\uDE80-\uDEA9\uDEB0\uDEB1\uDF00-\uDF1C\uDF27\uDF30-\uDF45\uDF70-\uDF81\uDFB0-\uDFC4\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE3F\uDE40\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDEB8\uDF00-\uDF1A\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCDF\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDEE0-\uDEF2\uDF02\uDF04-\uDF10\uDF12-\uDF33\uDFB0]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883\uD885-\uD887][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2F\uDC41-\uDC46]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE70-\uDEBE\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE7F\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD32\uDD50-\uDD52\uDD55\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD837[\uDF00-\uDF1E\uDF25-\uDF2A]|\uD838[\uDC30-\uDC6D\uDD00-\uDD2C\uDD37-\uDD3D\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB]|\uD839[\uDCD0-\uDCEB\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43\uDD4B]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF39\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A\uDF50-\uDFFF]|\uD888[\uDC00-\uDFAF])*$/.test(s)
    },
    {
      name: "string",
      test: isString
    },
    {
      name: "Chain",
      test: isChain
    },
    {
      name: "Array",
      test: isArray
    },
    {
      name: "Matrix",
      test: isMatrix
    },
    {
      name: "DenseMatrix",
      test: isDenseMatrix
    },
    {
      name: "SparseMatrix",
      test: isSparseMatrix
    },
    {
      name: "Range",
      test: isRange
    },
    {
      name: "Index",
      test: isIndex
    },
    {
      name: "boolean",
      test: isBoolean
    },
    {
      name: "ResultSet",
      test: isResultSet
    },
    {
      name: "Help",
      test: isHelp
    },
    {
      name: "function",
      test: isFunction
    },
    {
      name: "Date",
      test: isDate
    },
    {
      name: "RegExp",
      test: isRegExp
    },
    {
      name: "null",
      test: isNull
    },
    {
      name: "undefined",
      test: isUndefined
    },
    {
      name: "AccessorNode",
      test: isAccessorNode
    },
    {
      name: "ArrayNode",
      test: isArrayNode
    },
    {
      name: "AssignmentNode",
      test: isAssignmentNode
    },
    {
      name: "BlockNode",
      test: isBlockNode
    },
    {
      name: "ConditionalNode",
      test: isConditionalNode
    },
    {
      name: "ConstantNode",
      test: isConstantNode
    },
    {
      name: "FunctionNode",
      test: isFunctionNode
    },
    {
      name: "FunctionAssignmentNode",
      test: isFunctionAssignmentNode
    },
    {
      name: "IndexNode",
      test: isIndexNode
    },
    {
      name: "Node",
      test: isNode
    },
    {
      name: "ObjectNode",
      test: isObjectNode
    },
    {
      name: "OperatorNode",
      test: isOperatorNode
    },
    {
      name: "ParenthesisNode",
      test: isParenthesisNode
    },
    {
      name: "RangeNode",
      test: isRangeNode
    },
    {
      name: "RelationalNode",
      test: isRelationalNode
    },
    {
      name: "SymbolNode",
      test: isSymbolNode
    },
    {
      name: "Map",
      test: isMap
    },
    {
      name: "Object",
      test: isObject
    }
    // order 'Object' last, it matches on other classes too
  ]);
  typed2.addConversions([{
    from: "number",
    to: "BigNumber",
    convert: function convert(x) {
      if (!BigNumber2) {
        throwNoBignumber(x);
      }
      if (digits(x) > 15) {
        throw new TypeError("Cannot implicitly convert a number with >15 significant digits to BigNumber (value: " + x + "). Use function bignumber(x) to convert to BigNumber.");
      }
      return new BigNumber2(x);
    }
  }, {
    from: "number",
    to: "Complex",
    convert: function convert(x) {
      if (!Complex3) {
        throwNoComplex(x);
      }
      return new Complex3(x, 0);
    }
  }, {
    from: "BigNumber",
    to: "Complex",
    convert: function convert(x) {
      if (!Complex3) {
        throwNoComplex(x);
      }
      return new Complex3(x.toNumber(), 0);
    }
  }, {
    from: "Fraction",
    to: "BigNumber",
    convert: function convert(x) {
      throw new TypeError("Cannot implicitly convert a Fraction to BigNumber or vice versa. Use function bignumber(x) to convert to BigNumber or fraction(x) to convert to Fraction.");
    }
  }, {
    from: "Fraction",
    to: "Complex",
    convert: function convert(x) {
      if (!Complex3) {
        throwNoComplex(x);
      }
      return new Complex3(x.valueOf(), 0);
    }
  }, {
    from: "number",
    to: "Fraction",
    convert: function convert(x) {
      if (!Fraction3) {
        throwNoFraction(x);
      }
      var f = new Fraction3(x);
      if (f.valueOf() !== x) {
        throw new TypeError("Cannot implicitly convert a number to a Fraction when there will be a loss of precision (value: " + x + "). Use function fraction(x) to convert to Fraction.");
      }
      return f;
    }
  }, {
    // FIXME: add conversion from Fraction to number, for example for `sqrt(fraction(1,3))`
    //  from: 'Fraction',
    //  to: 'number',
    //  convert: function (x) {
    //    return x.valueOf()
    //  }
    // }, {
    from: "string",
    to: "number",
    convert: function convert(x) {
      var n = Number(x);
      if (isNaN(n)) {
        throw new Error('Cannot convert "' + x + '" to a number');
      }
      return n;
    }
  }, {
    from: "string",
    to: "BigNumber",
    convert: function convert(x) {
      if (!BigNumber2) {
        throwNoBignumber(x);
      }
      try {
        return new BigNumber2(x);
      } catch (err) {
        throw new Error('Cannot convert "' + x + '" to BigNumber');
      }
    }
  }, {
    from: "string",
    to: "Fraction",
    convert: function convert(x) {
      if (!Fraction3) {
        throwNoFraction(x);
      }
      try {
        return new Fraction3(x);
      } catch (err) {
        throw new Error('Cannot convert "' + x + '" to Fraction');
      }
    }
  }, {
    from: "string",
    to: "Complex",
    convert: function convert(x) {
      if (!Complex3) {
        throwNoComplex(x);
      }
      try {
        return new Complex3(x);
      } catch (err) {
        throw new Error('Cannot convert "' + x + '" to Complex');
      }
    }
  }, {
    from: "boolean",
    to: "number",
    convert: function convert(x) {
      return +x;
    }
  }, {
    from: "boolean",
    to: "BigNumber",
    convert: function convert(x) {
      if (!BigNumber2) {
        throwNoBignumber(x);
      }
      return new BigNumber2(+x);
    }
  }, {
    from: "boolean",
    to: "Fraction",
    convert: function convert(x) {
      if (!Fraction3) {
        throwNoFraction(x);
      }
      return new Fraction3(+x);
    }
  }, {
    from: "boolean",
    to: "string",
    convert: function convert(x) {
      return String(x);
    }
  }, {
    from: "Array",
    to: "Matrix",
    convert: function convert(array) {
      if (!DenseMatrix2) {
        throwNoMatrix();
      }
      return new DenseMatrix2(array);
    }
  }, {
    from: "Matrix",
    to: "Array",
    convert: function convert(matrix2) {
      return matrix2.valueOf();
    }
  }]);
  typed2.onMismatch = (name74, args, signatures) => {
    var usualError = typed2.createError(name74, args, signatures);
    if (["wrongType", "mismatch"].includes(usualError.data.category) && args.length === 1 && isCollection(args[0]) && // check if the function can be unary:
    signatures.some((sig) => !sig.params.includes(","))) {
      var err = new TypeError("Function '".concat(name74, "' doesn't apply to matrices. To call it ") + "elementwise on a matrix 'M', try 'map(M, ".concat(name74, ")'."));
      err.data = usualError.data;
      throw err;
    }
    throw usualError;
  };
  typed2.onMismatch = (name74, args, signatures) => {
    var usualError = typed2.createError(name74, args, signatures);
    if (["wrongType", "mismatch"].includes(usualError.data.category) && args.length === 1 && isCollection(args[0]) && // check if the function can be unary:
    signatures.some((sig) => !sig.params.includes(","))) {
      var err = new TypeError("Function '".concat(name74, "' doesn't apply to matrices. To call it ") + "elementwise on a matrix 'M', try 'map(M, ".concat(name74, ")'."));
      err.data = usualError.data;
      throw err;
    }
    throw usualError;
  };
  return typed2;
});
function throwNoBignumber(x) {
  throw new Error("Cannot convert value ".concat(x, " into a BigNumber: no class 'BigNumber' provided"));
}
function throwNoComplex(x) {
  throw new Error("Cannot convert value ".concat(x, " into a Complex number: no class 'Complex' provided"));
}
function throwNoMatrix() {
  throw new Error("Cannot convert array into a Matrix: no class 'DenseMatrix' provided");
}
function throwNoFraction(x) {
  throw new Error("Cannot convert value ".concat(x, " into a Fraction, no class 'Fraction' provided."));
}

// node_modules/decimal.js/decimal.mjs
var EXP_LIMIT = 9e15;
var MAX_DIGITS = 1e9;
var NUMERALS = "0123456789abcdef";
var LN10 = "2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058";
var PI = "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789";
var DEFAULTS = {
  // These values must be integers within the stated ranges (inclusive).
  // Most of these values can be changed at run-time using the `Decimal.config` method.
  // The maximum number of significant digits of the result of a calculation or base conversion.
  // E.g. `Decimal.config({ precision: 20 });`
  precision: 20,
  // 1 to MAX_DIGITS
  // The rounding mode used when rounding to `precision`.
  //
  // ROUND_UP         0 Away from zero.
  // ROUND_DOWN       1 Towards zero.
  // ROUND_CEIL       2 Towards +Infinity.
  // ROUND_FLOOR      3 Towards -Infinity.
  // ROUND_HALF_UP    4 Towards nearest neighbour. If equidistant, up.
  // ROUND_HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
  // ROUND_HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
  // ROUND_HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
  // ROUND_HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
  //
  // E.g.
  // `Decimal.rounding = 4;`
  // `Decimal.rounding = Decimal.ROUND_HALF_UP;`
  rounding: 4,
  // 0 to 8
  // The modulo mode used when calculating the modulus: a mod n.
  // The quotient (q = a / n) is calculated according to the corresponding rounding mode.
  // The remainder (r) is calculated as: r = a - n * q.
  //
  // UP         0 The remainder is positive if the dividend is negative, else is negative.
  // DOWN       1 The remainder has the same sign as the dividend (JavaScript %).
  // FLOOR      3 The remainder has the same sign as the divisor (Python %).
  // HALF_EVEN  6 The IEEE 754 remainder function.
  // EUCLID     9 Euclidian division. q = sign(n) * floor(a / abs(n)). Always positive.
  //
  // Truncated division (1), floored division (3), the IEEE 754 remainder (6), and Euclidian
  // division (9) are commonly used for the modulus operation. The other rounding modes can also
  // be used, but they may not give useful results.
  modulo: 1,
  // 0 to 9
  // The exponent value at and beneath which `toString` returns exponential notation.
  // JavaScript numbers: -7
  toExpNeg: -7,
  // 0 to -EXP_LIMIT
  // The exponent value at and above which `toString` returns exponential notation.
  // JavaScript numbers: 21
  toExpPos: 21,
  // 0 to EXP_LIMIT
  // The minimum exponent value, beneath which underflow to zero occurs.
  // JavaScript numbers: -324  (5e-324)
  minE: -EXP_LIMIT,
  // -1 to -EXP_LIMIT
  // The maximum exponent value, above which overflow to Infinity occurs.
  // JavaScript numbers: 308  (1.7976931348623157e+308)
  maxE: EXP_LIMIT,
  // 1 to EXP_LIMIT
  // Whether to use cryptographically-secure random number generation, if available.
  crypto: false
  // true/false
};
var inexact;
var quadrant;
var external = true;
var decimalError = "[DecimalError] ";
var invalidArgument = decimalError + "Invalid argument: ";
var precisionLimitExceeded = decimalError + "Precision limit exceeded";
var cryptoUnavailable = decimalError + "crypto unavailable";
var tag = "[object Decimal]";
var mathfloor = Math.floor;
var mathpow = Math.pow;
var isBinary = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i;
var isHex = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i;
var isOctal = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i;
var isDecimal = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;
var BASE = 1e7;
var LOG_BASE = 7;
var MAX_SAFE_INTEGER = 9007199254740991;
var LN10_PRECISION = LN10.length - 1;
var PI_PRECISION = PI.length - 1;
var P = { toStringTag: tag };
P.absoluteValue = P.abs = function() {
  var x = new this.constructor(this);
  if (x.s < 0)
    x.s = 1;
  return finalise(x);
};
P.ceil = function() {
  return finalise(new this.constructor(this), this.e + 1, 2);
};
P.clampedTo = P.clamp = function(min2, max2) {
  var k, x = this, Ctor = x.constructor;
  min2 = new Ctor(min2);
  max2 = new Ctor(max2);
  if (!min2.s || !max2.s)
    return new Ctor(NaN);
  if (min2.gt(max2))
    throw Error(invalidArgument + max2);
  k = x.cmp(min2);
  return k < 0 ? min2 : x.cmp(max2) > 0 ? max2 : new Ctor(x);
};
P.comparedTo = P.cmp = function(y) {
  var i, j, xdL, ydL, x = this, xd = x.d, yd = (y = new x.constructor(y)).d, xs = x.s, ys = y.s;
  if (!xd || !yd) {
    return !xs || !ys ? NaN : xs !== ys ? xs : xd === yd ? 0 : !xd ^ xs < 0 ? 1 : -1;
  }
  if (!xd[0] || !yd[0])
    return xd[0] ? xs : yd[0] ? -ys : 0;
  if (xs !== ys)
    return xs;
  if (x.e !== y.e)
    return x.e > y.e ^ xs < 0 ? 1 : -1;
  xdL = xd.length;
  ydL = yd.length;
  for (i = 0, j = xdL < ydL ? xdL : ydL; i < j; ++i) {
    if (xd[i] !== yd[i])
      return xd[i] > yd[i] ^ xs < 0 ? 1 : -1;
  }
  return xdL === ydL ? 0 : xdL > ydL ^ xs < 0 ? 1 : -1;
};
P.cosine = P.cos = function() {
  var pr, rm, x = this, Ctor = x.constructor;
  if (!x.d)
    return new Ctor(NaN);
  if (!x.d[0])
    return new Ctor(1);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(x.e, x.sd()) + LOG_BASE;
  Ctor.rounding = 1;
  x = cosine(Ctor, toLessThanHalfPi(Ctor, x));
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return finalise(quadrant == 2 || quadrant == 3 ? x.neg() : x, pr, rm, true);
};
P.cubeRoot = P.cbrt = function() {
  var e, m, n, r, rep, s, sd, t, t3, t3plusx, x = this, Ctor = x.constructor;
  if (!x.isFinite() || x.isZero())
    return new Ctor(x);
  external = false;
  s = x.s * mathpow(x.s * x, 1 / 3);
  if (!s || Math.abs(s) == 1 / 0) {
    n = digitsToString(x.d);
    e = x.e;
    if (s = (e - n.length + 1) % 3)
      n += s == 1 || s == -2 ? "0" : "00";
    s = mathpow(n, 1 / 3);
    e = mathfloor((e + 1) / 3) - (e % 3 == (e < 0 ? -1 : 2));
    if (s == 1 / 0) {
      n = "5e" + e;
    } else {
      n = s.toExponential();
      n = n.slice(0, n.indexOf("e") + 1) + e;
    }
    r = new Ctor(n);
    r.s = x.s;
  } else {
    r = new Ctor(s.toString());
  }
  sd = (e = Ctor.precision) + 3;
  for (; ; ) {
    t = r;
    t3 = t.times(t).times(t);
    t3plusx = t3.plus(x);
    r = divide(t3plusx.plus(x).times(t), t3plusx.plus(t3), sd + 2, 1);
    if (digitsToString(t.d).slice(0, sd) === (n = digitsToString(r.d)).slice(0, sd)) {
      n = n.slice(sd - 3, sd + 1);
      if (n == "9999" || !rep && n == "4999") {
        if (!rep) {
          finalise(t, e + 1, 0);
          if (t.times(t).times(t).eq(x)) {
            r = t;
            break;
          }
        }
        sd += 4;
        rep = 1;
      } else {
        if (!+n || !+n.slice(1) && n.charAt(0) == "5") {
          finalise(r, e + 1, 1);
          m = !r.times(r).times(r).eq(x);
        }
        break;
      }
    }
  }
  external = true;
  return finalise(r, e, Ctor.rounding, m);
};
P.decimalPlaces = P.dp = function() {
  var w, d = this.d, n = NaN;
  if (d) {
    w = d.length - 1;
    n = (w - mathfloor(this.e / LOG_BASE)) * LOG_BASE;
    w = d[w];
    if (w)
      for (; w % 10 == 0; w /= 10)
        n--;
    if (n < 0)
      n = 0;
  }
  return n;
};
P.dividedBy = P.div = function(y) {
  return divide(this, new this.constructor(y));
};
P.dividedToIntegerBy = P.divToInt = function(y) {
  var x = this, Ctor = x.constructor;
  return finalise(divide(x, new Ctor(y), 0, 1, 1), Ctor.precision, Ctor.rounding);
};
P.equals = P.eq = function(y) {
  return this.cmp(y) === 0;
};
P.floor = function() {
  return finalise(new this.constructor(this), this.e + 1, 3);
};
P.greaterThan = P.gt = function(y) {
  return this.cmp(y) > 0;
};
P.greaterThanOrEqualTo = P.gte = function(y) {
  var k = this.cmp(y);
  return k == 1 || k === 0;
};
P.hyperbolicCosine = P.cosh = function() {
  var k, n, pr, rm, len, x = this, Ctor = x.constructor, one = new Ctor(1);
  if (!x.isFinite())
    return new Ctor(x.s ? 1 / 0 : NaN);
  if (x.isZero())
    return one;
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(x.e, x.sd()) + 4;
  Ctor.rounding = 1;
  len = x.d.length;
  if (len < 32) {
    k = Math.ceil(len / 3);
    n = (1 / tinyPow(4, k)).toString();
  } else {
    k = 16;
    n = "2.3283064365386962890625e-10";
  }
  x = taylorSeries(Ctor, 1, x.times(n), new Ctor(1), true);
  var cosh2_x, i = k, d8 = new Ctor(8);
  for (; i--; ) {
    cosh2_x = x.times(x);
    x = one.minus(cosh2_x.times(d8.minus(cosh2_x.times(d8))));
  }
  return finalise(x, Ctor.precision = pr, Ctor.rounding = rm, true);
};
P.hyperbolicSine = P.sinh = function() {
  var k, pr, rm, len, x = this, Ctor = x.constructor;
  if (!x.isFinite() || x.isZero())
    return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(x.e, x.sd()) + 4;
  Ctor.rounding = 1;
  len = x.d.length;
  if (len < 3) {
    x = taylorSeries(Ctor, 2, x, x, true);
  } else {
    k = 1.4 * Math.sqrt(len);
    k = k > 16 ? 16 : k | 0;
    x = x.times(1 / tinyPow(5, k));
    x = taylorSeries(Ctor, 2, x, x, true);
    var sinh2_x, d5 = new Ctor(5), d16 = new Ctor(16), d20 = new Ctor(20);
    for (; k--; ) {
      sinh2_x = x.times(x);
      x = x.times(d5.plus(sinh2_x.times(d16.times(sinh2_x).plus(d20))));
    }
  }
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return finalise(x, pr, rm, true);
};
P.hyperbolicTangent = P.tanh = function() {
  var pr, rm, x = this, Ctor = x.constructor;
  if (!x.isFinite())
    return new Ctor(x.s);
  if (x.isZero())
    return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + 7;
  Ctor.rounding = 1;
  return divide(x.sinh(), x.cosh(), Ctor.precision = pr, Ctor.rounding = rm);
};
P.inverseCosine = P.acos = function() {
  var halfPi, x = this, Ctor = x.constructor, k = x.abs().cmp(1), pr = Ctor.precision, rm = Ctor.rounding;
  if (k !== -1) {
    return k === 0 ? x.isNeg() ? getPi(Ctor, pr, rm) : new Ctor(0) : new Ctor(NaN);
  }
  if (x.isZero())
    return getPi(Ctor, pr + 4, rm).times(0.5);
  Ctor.precision = pr + 6;
  Ctor.rounding = 1;
  x = x.asin();
  halfPi = getPi(Ctor, pr + 4, rm).times(0.5);
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return halfPi.minus(x);
};
P.inverseHyperbolicCosine = P.acosh = function() {
  var pr, rm, x = this, Ctor = x.constructor;
  if (x.lte(1))
    return new Ctor(x.eq(1) ? 0 : NaN);
  if (!x.isFinite())
    return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(Math.abs(x.e), x.sd()) + 4;
  Ctor.rounding = 1;
  external = false;
  x = x.times(x).minus(1).sqrt().plus(x);
  external = true;
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return x.ln();
};
P.inverseHyperbolicSine = P.asinh = function() {
  var pr, rm, x = this, Ctor = x.constructor;
  if (!x.isFinite() || x.isZero())
    return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + 2 * Math.max(Math.abs(x.e), x.sd()) + 6;
  Ctor.rounding = 1;
  external = false;
  x = x.times(x).plus(1).sqrt().plus(x);
  external = true;
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return x.ln();
};
P.inverseHyperbolicTangent = P.atanh = function() {
  var pr, rm, wpr, xsd, x = this, Ctor = x.constructor;
  if (!x.isFinite())
    return new Ctor(NaN);
  if (x.e >= 0)
    return new Ctor(x.abs().eq(1) ? x.s / 0 : x.isZero() ? x : NaN);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  xsd = x.sd();
  if (Math.max(xsd, pr) < 2 * -x.e - 1)
    return finalise(new Ctor(x), pr, rm, true);
  Ctor.precision = wpr = xsd - x.e;
  x = divide(x.plus(1), new Ctor(1).minus(x), wpr + pr, 1);
  Ctor.precision = pr + 4;
  Ctor.rounding = 1;
  x = x.ln();
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return x.times(0.5);
};
P.inverseSine = P.asin = function() {
  var halfPi, k, pr, rm, x = this, Ctor = x.constructor;
  if (x.isZero())
    return new Ctor(x);
  k = x.abs().cmp(1);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  if (k !== -1) {
    if (k === 0) {
      halfPi = getPi(Ctor, pr + 4, rm).times(0.5);
      halfPi.s = x.s;
      return halfPi;
    }
    return new Ctor(NaN);
  }
  Ctor.precision = pr + 6;
  Ctor.rounding = 1;
  x = x.div(new Ctor(1).minus(x.times(x)).sqrt().plus(1)).atan();
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return x.times(2);
};
P.inverseTangent = P.atan = function() {
  var i, j, k, n, px, t, r, wpr, x2, x = this, Ctor = x.constructor, pr = Ctor.precision, rm = Ctor.rounding;
  if (!x.isFinite()) {
    if (!x.s)
      return new Ctor(NaN);
    if (pr + 4 <= PI_PRECISION) {
      r = getPi(Ctor, pr + 4, rm).times(0.5);
      r.s = x.s;
      return r;
    }
  } else if (x.isZero()) {
    return new Ctor(x);
  } else if (x.abs().eq(1) && pr + 4 <= PI_PRECISION) {
    r = getPi(Ctor, pr + 4, rm).times(0.25);
    r.s = x.s;
    return r;
  }
  Ctor.precision = wpr = pr + 10;
  Ctor.rounding = 1;
  k = Math.min(28, wpr / LOG_BASE + 2 | 0);
  for (i = k; i; --i)
    x = x.div(x.times(x).plus(1).sqrt().plus(1));
  external = false;
  j = Math.ceil(wpr / LOG_BASE);
  n = 1;
  x2 = x.times(x);
  r = new Ctor(x);
  px = x;
  for (; i !== -1; ) {
    px = px.times(x2);
    t = r.minus(px.div(n += 2));
    px = px.times(x2);
    r = t.plus(px.div(n += 2));
    if (r.d[j] !== void 0)
      for (i = j; r.d[i] === t.d[i] && i--; )
        ;
  }
  if (k)
    r = r.times(2 << k - 1);
  external = true;
  return finalise(r, Ctor.precision = pr, Ctor.rounding = rm, true);
};
P.isFinite = function() {
  return !!this.d;
};
P.isInteger = P.isInt = function() {
  return !!this.d && mathfloor(this.e / LOG_BASE) > this.d.length - 2;
};
P.isNaN = function() {
  return !this.s;
};
P.isNegative = P.isNeg = function() {
  return this.s < 0;
};
P.isPositive = P.isPos = function() {
  return this.s > 0;
};
P.isZero = function() {
  return !!this.d && this.d[0] === 0;
};
P.lessThan = P.lt = function(y) {
  return this.cmp(y) < 0;
};
P.lessThanOrEqualTo = P.lte = function(y) {
  return this.cmp(y) < 1;
};
P.logarithm = P.log = function(base) {
  var isBase10, d, denominator, k, inf, num, sd, r, arg = this, Ctor = arg.constructor, pr = Ctor.precision, rm = Ctor.rounding, guard = 5;
  if (base == null) {
    base = new Ctor(10);
    isBase10 = true;
  } else {
    base = new Ctor(base);
    d = base.d;
    if (base.s < 0 || !d || !d[0] || base.eq(1))
      return new Ctor(NaN);
    isBase10 = base.eq(10);
  }
  d = arg.d;
  if (arg.s < 0 || !d || !d[0] || arg.eq(1)) {
    return new Ctor(d && !d[0] ? -1 / 0 : arg.s != 1 ? NaN : d ? 0 : 1 / 0);
  }
  if (isBase10) {
    if (d.length > 1) {
      inf = true;
    } else {
      for (k = d[0]; k % 10 === 0; )
        k /= 10;
      inf = k !== 1;
    }
  }
  external = false;
  sd = pr + guard;
  num = naturalLogarithm(arg, sd);
  denominator = isBase10 ? getLn10(Ctor, sd + 10) : naturalLogarithm(base, sd);
  r = divide(num, denominator, sd, 1);
  if (checkRoundingDigits(r.d, k = pr, rm)) {
    do {
      sd += 10;
      num = naturalLogarithm(arg, sd);
      denominator = isBase10 ? getLn10(Ctor, sd + 10) : naturalLogarithm(base, sd);
      r = divide(num, denominator, sd, 1);
      if (!inf) {
        if (+digitsToString(r.d).slice(k + 1, k + 15) + 1 == 1e14) {
          r = finalise(r, pr + 1, 0);
        }
        break;
      }
    } while (checkRoundingDigits(r.d, k += 10, rm));
  }
  external = true;
  return finalise(r, pr, rm);
};
P.minus = P.sub = function(y) {
  var d, e, i, j, k, len, pr, rm, xd, xe, xLTy, yd, x = this, Ctor = x.constructor;
  y = new Ctor(y);
  if (!x.d || !y.d) {
    if (!x.s || !y.s)
      y = new Ctor(NaN);
    else if (x.d)
      y.s = -y.s;
    else
      y = new Ctor(y.d || x.s !== y.s ? x : NaN);
    return y;
  }
  if (x.s != y.s) {
    y.s = -y.s;
    return x.plus(y);
  }
  xd = x.d;
  yd = y.d;
  pr = Ctor.precision;
  rm = Ctor.rounding;
  if (!xd[0] || !yd[0]) {
    if (yd[0])
      y.s = -y.s;
    else if (xd[0])
      y = new Ctor(x);
    else
      return new Ctor(rm === 3 ? -0 : 0);
    return external ? finalise(y, pr, rm) : y;
  }
  e = mathfloor(y.e / LOG_BASE);
  xe = mathfloor(x.e / LOG_BASE);
  xd = xd.slice();
  k = xe - e;
  if (k) {
    xLTy = k < 0;
    if (xLTy) {
      d = xd;
      k = -k;
      len = yd.length;
    } else {
      d = yd;
      e = xe;
      len = xd.length;
    }
    i = Math.max(Math.ceil(pr / LOG_BASE), len) + 2;
    if (k > i) {
      k = i;
      d.length = 1;
    }
    d.reverse();
    for (i = k; i--; )
      d.push(0);
    d.reverse();
  } else {
    i = xd.length;
    len = yd.length;
    xLTy = i < len;
    if (xLTy)
      len = i;
    for (i = 0; i < len; i++) {
      if (xd[i] != yd[i]) {
        xLTy = xd[i] < yd[i];
        break;
      }
    }
    k = 0;
  }
  if (xLTy) {
    d = xd;
    xd = yd;
    yd = d;
    y.s = -y.s;
  }
  len = xd.length;
  for (i = yd.length - len; i > 0; --i)
    xd[len++] = 0;
  for (i = yd.length; i > k; ) {
    if (xd[--i] < yd[i]) {
      for (j = i; j && xd[--j] === 0; )
        xd[j] = BASE - 1;
      --xd[j];
      xd[i] += BASE;
    }
    xd[i] -= yd[i];
  }
  for (; xd[--len] === 0; )
    xd.pop();
  for (; xd[0] === 0; xd.shift())
    --e;
  if (!xd[0])
    return new Ctor(rm === 3 ? -0 : 0);
  y.d = xd;
  y.e = getBase10Exponent(xd, e);
  return external ? finalise(y, pr, rm) : y;
};
P.modulo = P.mod = function(y) {
  var q, x = this, Ctor = x.constructor;
  y = new Ctor(y);
  if (!x.d || !y.s || y.d && !y.d[0])
    return new Ctor(NaN);
  if (!y.d || x.d && !x.d[0]) {
    return finalise(new Ctor(x), Ctor.precision, Ctor.rounding);
  }
  external = false;
  if (Ctor.modulo == 9) {
    q = divide(x, y.abs(), 0, 3, 1);
    q.s *= y.s;
  } else {
    q = divide(x, y, 0, Ctor.modulo, 1);
  }
  q = q.times(y);
  external = true;
  return x.minus(q);
};
P.naturalExponential = P.exp = function() {
  return naturalExponential(this);
};
P.naturalLogarithm = P.ln = function() {
  return naturalLogarithm(this);
};
P.negated = P.neg = function() {
  var x = new this.constructor(this);
  x.s = -x.s;
  return finalise(x);
};
P.plus = P.add = function(y) {
  var carry, d, e, i, k, len, pr, rm, xd, yd, x = this, Ctor = x.constructor;
  y = new Ctor(y);
  if (!x.d || !y.d) {
    if (!x.s || !y.s)
      y = new Ctor(NaN);
    else if (!x.d)
      y = new Ctor(y.d || x.s === y.s ? x : NaN);
    return y;
  }
  if (x.s != y.s) {
    y.s = -y.s;
    return x.minus(y);
  }
  xd = x.d;
  yd = y.d;
  pr = Ctor.precision;
  rm = Ctor.rounding;
  if (!xd[0] || !yd[0]) {
    if (!yd[0])
      y = new Ctor(x);
    return external ? finalise(y, pr, rm) : y;
  }
  k = mathfloor(x.e / LOG_BASE);
  e = mathfloor(y.e / LOG_BASE);
  xd = xd.slice();
  i = k - e;
  if (i) {
    if (i < 0) {
      d = xd;
      i = -i;
      len = yd.length;
    } else {
      d = yd;
      e = k;
      len = xd.length;
    }
    k = Math.ceil(pr / LOG_BASE);
    len = k > len ? k + 1 : len + 1;
    if (i > len) {
      i = len;
      d.length = 1;
    }
    d.reverse();
    for (; i--; )
      d.push(0);
    d.reverse();
  }
  len = xd.length;
  i = yd.length;
  if (len - i < 0) {
    i = len;
    d = yd;
    yd = xd;
    xd = d;
  }
  for (carry = 0; i; ) {
    carry = (xd[--i] = xd[i] + yd[i] + carry) / BASE | 0;
    xd[i] %= BASE;
  }
  if (carry) {
    xd.unshift(carry);
    ++e;
  }
  for (len = xd.length; xd[--len] == 0; )
    xd.pop();
  y.d = xd;
  y.e = getBase10Exponent(xd, e);
  return external ? finalise(y, pr, rm) : y;
};
P.precision = P.sd = function(z) {
  var k, x = this;
  if (z !== void 0 && z !== !!z && z !== 1 && z !== 0)
    throw Error(invalidArgument + z);
  if (x.d) {
    k = getPrecision(x.d);
    if (z && x.e + 1 > k)
      k = x.e + 1;
  } else {
    k = NaN;
  }
  return k;
};
P.round = function() {
  var x = this, Ctor = x.constructor;
  return finalise(new Ctor(x), x.e + 1, Ctor.rounding);
};
P.sine = P.sin = function() {
  var pr, rm, x = this, Ctor = x.constructor;
  if (!x.isFinite())
    return new Ctor(NaN);
  if (x.isZero())
    return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(x.e, x.sd()) + LOG_BASE;
  Ctor.rounding = 1;
  x = sine(Ctor, toLessThanHalfPi(Ctor, x));
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return finalise(quadrant > 2 ? x.neg() : x, pr, rm, true);
};
P.squareRoot = P.sqrt = function() {
  var m, n, sd, r, rep, t, x = this, d = x.d, e = x.e, s = x.s, Ctor = x.constructor;
  if (s !== 1 || !d || !d[0]) {
    return new Ctor(!s || s < 0 && (!d || d[0]) ? NaN : d ? x : 1 / 0);
  }
  external = false;
  s = Math.sqrt(+x);
  if (s == 0 || s == 1 / 0) {
    n = digitsToString(d);
    if ((n.length + e) % 2 == 0)
      n += "0";
    s = Math.sqrt(n);
    e = mathfloor((e + 1) / 2) - (e < 0 || e % 2);
    if (s == 1 / 0) {
      n = "5e" + e;
    } else {
      n = s.toExponential();
      n = n.slice(0, n.indexOf("e") + 1) + e;
    }
    r = new Ctor(n);
  } else {
    r = new Ctor(s.toString());
  }
  sd = (e = Ctor.precision) + 3;
  for (; ; ) {
    t = r;
    r = t.plus(divide(x, t, sd + 2, 1)).times(0.5);
    if (digitsToString(t.d).slice(0, sd) === (n = digitsToString(r.d)).slice(0, sd)) {
      n = n.slice(sd - 3, sd + 1);
      if (n == "9999" || !rep && n == "4999") {
        if (!rep) {
          finalise(t, e + 1, 0);
          if (t.times(t).eq(x)) {
            r = t;
            break;
          }
        }
        sd += 4;
        rep = 1;
      } else {
        if (!+n || !+n.slice(1) && n.charAt(0) == "5") {
          finalise(r, e + 1, 1);
          m = !r.times(r).eq(x);
        }
        break;
      }
    }
  }
  external = true;
  return finalise(r, e, Ctor.rounding, m);
};
P.tangent = P.tan = function() {
  var pr, rm, x = this, Ctor = x.constructor;
  if (!x.isFinite())
    return new Ctor(NaN);
  if (x.isZero())
    return new Ctor(x);
  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + 10;
  Ctor.rounding = 1;
  x = x.sin();
  x.s = 1;
  x = divide(x, new Ctor(1).minus(x.times(x)).sqrt(), pr + 10, 0);
  Ctor.precision = pr;
  Ctor.rounding = rm;
  return finalise(quadrant == 2 || quadrant == 4 ? x.neg() : x, pr, rm, true);
};
P.times = P.mul = function(y) {
  var carry, e, i, k, r, rL, t, xdL, ydL, x = this, Ctor = x.constructor, xd = x.d, yd = (y = new Ctor(y)).d;
  y.s *= x.s;
  if (!xd || !xd[0] || !yd || !yd[0]) {
    return new Ctor(!y.s || xd && !xd[0] && !yd || yd && !yd[0] && !xd ? NaN : !xd || !yd ? y.s / 0 : y.s * 0);
  }
  e = mathfloor(x.e / LOG_BASE) + mathfloor(y.e / LOG_BASE);
  xdL = xd.length;
  ydL = yd.length;
  if (xdL < ydL) {
    r = xd;
    xd = yd;
    yd = r;
    rL = xdL;
    xdL = ydL;
    ydL = rL;
  }
  r = [];
  rL = xdL + ydL;
  for (i = rL; i--; )
    r.push(0);
  for (i = ydL; --i >= 0; ) {
    carry = 0;
    for (k = xdL + i; k > i; ) {
      t = r[k] + yd[i] * xd[k - i - 1] + carry;
      r[k--] = t % BASE | 0;
      carry = t / BASE | 0;
    }
    r[k] = (r[k] + carry) % BASE | 0;
  }
  for (; !r[--rL]; )
    r.pop();
  if (carry)
    ++e;
  else
    r.shift();
  y.d = r;
  y.e = getBase10Exponent(r, e);
  return external ? finalise(y, Ctor.precision, Ctor.rounding) : y;
};
P.toBinary = function(sd, rm) {
  return toStringBinary(this, 2, sd, rm);
};
P.toDecimalPlaces = P.toDP = function(dp, rm) {
  var x = this, Ctor = x.constructor;
  x = new Ctor(x);
  if (dp === void 0)
    return x;
  checkInt32(dp, 0, MAX_DIGITS);
  if (rm === void 0)
    rm = Ctor.rounding;
  else
    checkInt32(rm, 0, 8);
  return finalise(x, dp + x.e + 1, rm);
};
P.toExponential = function(dp, rm) {
  var str, x = this, Ctor = x.constructor;
  if (dp === void 0) {
    str = finiteToString(x, true);
  } else {
    checkInt32(dp, 0, MAX_DIGITS);
    if (rm === void 0)
      rm = Ctor.rounding;
    else
      checkInt32(rm, 0, 8);
    x = finalise(new Ctor(x), dp + 1, rm);
    str = finiteToString(x, true, dp + 1);
  }
  return x.isNeg() && !x.isZero() ? "-" + str : str;
};
P.toFixed = function(dp, rm) {
  var str, y, x = this, Ctor = x.constructor;
  if (dp === void 0) {
    str = finiteToString(x);
  } else {
    checkInt32(dp, 0, MAX_DIGITS);
    if (rm === void 0)
      rm = Ctor.rounding;
    else
      checkInt32(rm, 0, 8);
    y = finalise(new Ctor(x), dp + x.e + 1, rm);
    str = finiteToString(y, false, dp + y.e + 1);
  }
  return x.isNeg() && !x.isZero() ? "-" + str : str;
};
P.toFraction = function(maxD) {
  var d, d0, d1, d2, e, k, n, n0, n13, pr, q, r, x = this, xd = x.d, Ctor = x.constructor;
  if (!xd)
    return new Ctor(x);
  n13 = d0 = new Ctor(1);
  d1 = n0 = new Ctor(0);
  d = new Ctor(d1);
  e = d.e = getPrecision(xd) - x.e - 1;
  k = e % LOG_BASE;
  d.d[0] = mathpow(10, k < 0 ? LOG_BASE + k : k);
  if (maxD == null) {
    maxD = e > 0 ? d : n13;
  } else {
    n = new Ctor(maxD);
    if (!n.isInt() || n.lt(n13))
      throw Error(invalidArgument + n);
    maxD = n.gt(d) ? e > 0 ? d : n13 : n;
  }
  external = false;
  n = new Ctor(digitsToString(xd));
  pr = Ctor.precision;
  Ctor.precision = e = xd.length * LOG_BASE * 2;
  for (; ; ) {
    q = divide(n, d, 0, 1, 1);
    d2 = d0.plus(q.times(d1));
    if (d2.cmp(maxD) == 1)
      break;
    d0 = d1;
    d1 = d2;
    d2 = n13;
    n13 = n0.plus(q.times(d2));
    n0 = d2;
    d2 = d;
    d = n.minus(q.times(d2));
    n = d2;
  }
  d2 = divide(maxD.minus(d0), d1, 0, 1, 1);
  n0 = n0.plus(d2.times(n13));
  d0 = d0.plus(d2.times(d1));
  n0.s = n13.s = x.s;
  r = divide(n13, d1, e, 1).minus(x).abs().cmp(divide(n0, d0, e, 1).minus(x).abs()) < 1 ? [n13, d1] : [n0, d0];
  Ctor.precision = pr;
  external = true;
  return r;
};
P.toHexadecimal = P.toHex = function(sd, rm) {
  return toStringBinary(this, 16, sd, rm);
};
P.toNearest = function(y, rm) {
  var x = this, Ctor = x.constructor;
  x = new Ctor(x);
  if (y == null) {
    if (!x.d)
      return x;
    y = new Ctor(1);
    rm = Ctor.rounding;
  } else {
    y = new Ctor(y);
    if (rm === void 0) {
      rm = Ctor.rounding;
    } else {
      checkInt32(rm, 0, 8);
    }
    if (!x.d)
      return y.s ? x : y;
    if (!y.d) {
      if (y.s)
        y.s = x.s;
      return y;
    }
  }
  if (y.d[0]) {
    external = false;
    x = divide(x, y, 0, rm, 1).times(y);
    external = true;
    finalise(x);
  } else {
    y.s = x.s;
    x = y;
  }
  return x;
};
P.toNumber = function() {
  return +this;
};
P.toOctal = function(sd, rm) {
  return toStringBinary(this, 8, sd, rm);
};
P.toPower = P.pow = function(y) {
  var e, k, pr, r, rm, s, x = this, Ctor = x.constructor, yn = +(y = new Ctor(y));
  if (!x.d || !y.d || !x.d[0] || !y.d[0])
    return new Ctor(mathpow(+x, yn));
  x = new Ctor(x);
  if (x.eq(1))
    return x;
  pr = Ctor.precision;
  rm = Ctor.rounding;
  if (y.eq(1))
    return finalise(x, pr, rm);
  e = mathfloor(y.e / LOG_BASE);
  if (e >= y.d.length - 1 && (k = yn < 0 ? -yn : yn) <= MAX_SAFE_INTEGER) {
    r = intPow(Ctor, x, k, pr);
    return y.s < 0 ? new Ctor(1).div(r) : finalise(r, pr, rm);
  }
  s = x.s;
  if (s < 0) {
    if (e < y.d.length - 1)
      return new Ctor(NaN);
    if ((y.d[e] & 1) == 0)
      s = 1;
    if (x.e == 0 && x.d[0] == 1 && x.d.length == 1) {
      x.s = s;
      return x;
    }
  }
  k = mathpow(+x, yn);
  e = k == 0 || !isFinite(k) ? mathfloor(yn * (Math.log("0." + digitsToString(x.d)) / Math.LN10 + x.e + 1)) : new Ctor(k + "").e;
  if (e > Ctor.maxE + 1 || e < Ctor.minE - 1)
    return new Ctor(e > 0 ? s / 0 : 0);
  external = false;
  Ctor.rounding = x.s = 1;
  k = Math.min(12, (e + "").length);
  r = naturalExponential(y.times(naturalLogarithm(x, pr + k)), pr);
  if (r.d) {
    r = finalise(r, pr + 5, 1);
    if (checkRoundingDigits(r.d, pr, rm)) {
      e = pr + 10;
      r = finalise(naturalExponential(y.times(naturalLogarithm(x, e + k)), e), e + 5, 1);
      if (+digitsToString(r.d).slice(pr + 1, pr + 15) + 1 == 1e14) {
        r = finalise(r, pr + 1, 0);
      }
    }
  }
  r.s = s;
  external = true;
  Ctor.rounding = rm;
  return finalise(r, pr, rm);
};
P.toPrecision = function(sd, rm) {
  var str, x = this, Ctor = x.constructor;
  if (sd === void 0) {
    str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
  } else {
    checkInt32(sd, 1, MAX_DIGITS);
    if (rm === void 0)
      rm = Ctor.rounding;
    else
      checkInt32(rm, 0, 8);
    x = finalise(new Ctor(x), sd, rm);
    str = finiteToString(x, sd <= x.e || x.e <= Ctor.toExpNeg, sd);
  }
  return x.isNeg() && !x.isZero() ? "-" + str : str;
};
P.toSignificantDigits = P.toSD = function(sd, rm) {
  var x = this, Ctor = x.constructor;
  if (sd === void 0) {
    sd = Ctor.precision;
    rm = Ctor.rounding;
  } else {
    checkInt32(sd, 1, MAX_DIGITS);
    if (rm === void 0)
      rm = Ctor.rounding;
    else
      checkInt32(rm, 0, 8);
  }
  return finalise(new Ctor(x), sd, rm);
};
P.toString = function() {
  var x = this, Ctor = x.constructor, str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
  return x.isNeg() && !x.isZero() ? "-" + str : str;
};
P.truncated = P.trunc = function() {
  return finalise(new this.constructor(this), this.e + 1, 1);
};
P.valueOf = P.toJSON = function() {
  var x = this, Ctor = x.constructor, str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
  return x.isNeg() ? "-" + str : str;
};
function digitsToString(d) {
  var i, k, ws, indexOfLastWord = d.length - 1, str = "", w = d[0];
  if (indexOfLastWord > 0) {
    str += w;
    for (i = 1; i < indexOfLastWord; i++) {
      ws = d[i] + "";
      k = LOG_BASE - ws.length;
      if (k)
        str += getZeroString(k);
      str += ws;
    }
    w = d[i];
    ws = w + "";
    k = LOG_BASE - ws.length;
    if (k)
      str += getZeroString(k);
  } else if (w === 0) {
    return "0";
  }
  for (; w % 10 === 0; )
    w /= 10;
  return str + w;
}
function checkInt32(i, min2, max2) {
  if (i !== ~~i || i < min2 || i > max2) {
    throw Error(invalidArgument + i);
  }
}
function checkRoundingDigits(d, i, rm, repeating) {
  var di, k, r, rd;
  for (k = d[0]; k >= 10; k /= 10)
    --i;
  if (--i < 0) {
    i += LOG_BASE;
    di = 0;
  } else {
    di = Math.ceil((i + 1) / LOG_BASE);
    i %= LOG_BASE;
  }
  k = mathpow(10, LOG_BASE - i);
  rd = d[di] % k | 0;
  if (repeating == null) {
    if (i < 3) {
      if (i == 0)
        rd = rd / 100 | 0;
      else if (i == 1)
        rd = rd / 10 | 0;
      r = rm < 4 && rd == 99999 || rm > 3 && rd == 49999 || rd == 5e4 || rd == 0;
    } else {
      r = (rm < 4 && rd + 1 == k || rm > 3 && rd + 1 == k / 2) && (d[di + 1] / k / 100 | 0) == mathpow(10, i - 2) - 1 || (rd == k / 2 || rd == 0) && (d[di + 1] / k / 100 | 0) == 0;
    }
  } else {
    if (i < 4) {
      if (i == 0)
        rd = rd / 1e3 | 0;
      else if (i == 1)
        rd = rd / 100 | 0;
      else if (i == 2)
        rd = rd / 10 | 0;
      r = (repeating || rm < 4) && rd == 9999 || !repeating && rm > 3 && rd == 4999;
    } else {
      r = ((repeating || rm < 4) && rd + 1 == k || !repeating && rm > 3 && rd + 1 == k / 2) && (d[di + 1] / k / 1e3 | 0) == mathpow(10, i - 3) - 1;
    }
  }
  return r;
}
function convertBase(str, baseIn, baseOut) {
  var j, arr = [0], arrL, i = 0, strL = str.length;
  for (; i < strL; ) {
    for (arrL = arr.length; arrL--; )
      arr[arrL] *= baseIn;
    arr[0] += NUMERALS.indexOf(str.charAt(i++));
    for (j = 0; j < arr.length; j++) {
      if (arr[j] > baseOut - 1) {
        if (arr[j + 1] === void 0)
          arr[j + 1] = 0;
        arr[j + 1] += arr[j] / baseOut | 0;
        arr[j] %= baseOut;
      }
    }
  }
  return arr.reverse();
}
function cosine(Ctor, x) {
  var k, len, y;
  if (x.isZero())
    return x;
  len = x.d.length;
  if (len < 32) {
    k = Math.ceil(len / 3);
    y = (1 / tinyPow(4, k)).toString();
  } else {
    k = 16;
    y = "2.3283064365386962890625e-10";
  }
  Ctor.precision += k;
  x = taylorSeries(Ctor, 1, x.times(y), new Ctor(1));
  for (var i = k; i--; ) {
    var cos2x = x.times(x);
    x = cos2x.times(cos2x).minus(cos2x).times(8).plus(1);
  }
  Ctor.precision -= k;
  return x;
}
var divide = function() {
  function multiplyInteger(x, k, base) {
    var temp, carry = 0, i = x.length;
    for (x = x.slice(); i--; ) {
      temp = x[i] * k + carry;
      x[i] = temp % base | 0;
      carry = temp / base | 0;
    }
    if (carry)
      x.unshift(carry);
    return x;
  }
  function compare(a, b, aL, bL) {
    var i, r;
    if (aL != bL) {
      r = aL > bL ? 1 : -1;
    } else {
      for (i = r = 0; i < aL; i++) {
        if (a[i] != b[i]) {
          r = a[i] > b[i] ? 1 : -1;
          break;
        }
      }
    }
    return r;
  }
  function subtract2(a, b, aL, base) {
    var i = 0;
    for (; aL--; ) {
      a[aL] -= i;
      i = a[aL] < b[aL] ? 1 : 0;
      a[aL] = i * base + a[aL] - b[aL];
    }
    for (; !a[0] && a.length > 1; )
      a.shift();
  }
  return function(x, y, pr, rm, dp, base) {
    var cmp, e, i, k, logBase, more, prod, prodL, q, qd, rem, remL, rem0, sd, t, xi, xL, yd0, yL, yz, Ctor = x.constructor, sign4 = x.s == y.s ? 1 : -1, xd = x.d, yd = y.d;
    if (!xd || !xd[0] || !yd || !yd[0]) {
      return new Ctor(
        // Return NaN if either NaN, or both Infinity or 0.
        !x.s || !y.s || (xd ? yd && xd[0] == yd[0] : !yd) ? NaN : (
          // Return ±0 if x is 0 or y is ±Infinity, or return ±Infinity as y is 0.
          xd && xd[0] == 0 || !yd ? sign4 * 0 : sign4 / 0
        )
      );
    }
    if (base) {
      logBase = 1;
      e = x.e - y.e;
    } else {
      base = BASE;
      logBase = LOG_BASE;
      e = mathfloor(x.e / logBase) - mathfloor(y.e / logBase);
    }
    yL = yd.length;
    xL = xd.length;
    q = new Ctor(sign4);
    qd = q.d = [];
    for (i = 0; yd[i] == (xd[i] || 0); i++)
      ;
    if (yd[i] > (xd[i] || 0))
      e--;
    if (pr == null) {
      sd = pr = Ctor.precision;
      rm = Ctor.rounding;
    } else if (dp) {
      sd = pr + (x.e - y.e) + 1;
    } else {
      sd = pr;
    }
    if (sd < 0) {
      qd.push(1);
      more = true;
    } else {
      sd = sd / logBase + 2 | 0;
      i = 0;
      if (yL == 1) {
        k = 0;
        yd = yd[0];
        sd++;
        for (; (i < xL || k) && sd--; i++) {
          t = k * base + (xd[i] || 0);
          qd[i] = t / yd | 0;
          k = t % yd | 0;
        }
        more = k || i < xL;
      } else {
        k = base / (yd[0] + 1) | 0;
        if (k > 1) {
          yd = multiplyInteger(yd, k, base);
          xd = multiplyInteger(xd, k, base);
          yL = yd.length;
          xL = xd.length;
        }
        xi = yL;
        rem = xd.slice(0, yL);
        remL = rem.length;
        for (; remL < yL; )
          rem[remL++] = 0;
        yz = yd.slice();
        yz.unshift(0);
        yd0 = yd[0];
        if (yd[1] >= base / 2)
          ++yd0;
        do {
          k = 0;
          cmp = compare(yd, rem, yL, remL);
          if (cmp < 0) {
            rem0 = rem[0];
            if (yL != remL)
              rem0 = rem0 * base + (rem[1] || 0);
            k = rem0 / yd0 | 0;
            if (k > 1) {
              if (k >= base)
                k = base - 1;
              prod = multiplyInteger(yd, k, base);
              prodL = prod.length;
              remL = rem.length;
              cmp = compare(prod, rem, prodL, remL);
              if (cmp == 1) {
                k--;
                subtract2(prod, yL < prodL ? yz : yd, prodL, base);
              }
            } else {
              if (k == 0)
                cmp = k = 1;
              prod = yd.slice();
            }
            prodL = prod.length;
            if (prodL < remL)
              prod.unshift(0);
            subtract2(rem, prod, remL, base);
            if (cmp == -1) {
              remL = rem.length;
              cmp = compare(yd, rem, yL, remL);
              if (cmp < 1) {
                k++;
                subtract2(rem, yL < remL ? yz : yd, remL, base);
              }
            }
            remL = rem.length;
          } else if (cmp === 0) {
            k++;
            rem = [0];
          }
          qd[i++] = k;
          if (cmp && rem[0]) {
            rem[remL++] = xd[xi] || 0;
          } else {
            rem = [xd[xi]];
            remL = 1;
          }
        } while ((xi++ < xL || rem[0] !== void 0) && sd--);
        more = rem[0] !== void 0;
      }
      if (!qd[0])
        qd.shift();
    }
    if (logBase == 1) {
      q.e = e;
      inexact = more;
    } else {
      for (i = 1, k = qd[0]; k >= 10; k /= 10)
        i++;
      q.e = i + e * logBase - 1;
      finalise(q, dp ? pr + q.e + 1 : pr, rm, more);
    }
    return q;
  };
}();
function finalise(x, sd, rm, isTruncated) {
  var digits2, i, j, k, rd, roundUp, w, xd, xdi, Ctor = x.constructor;
  out:
    if (sd != null) {
      xd = x.d;
      if (!xd)
        return x;
      for (digits2 = 1, k = xd[0]; k >= 10; k /= 10)
        digits2++;
      i = sd - digits2;
      if (i < 0) {
        i += LOG_BASE;
        j = sd;
        w = xd[xdi = 0];
        rd = w / mathpow(10, digits2 - j - 1) % 10 | 0;
      } else {
        xdi = Math.ceil((i + 1) / LOG_BASE);
        k = xd.length;
        if (xdi >= k) {
          if (isTruncated) {
            for (; k++ <= xdi; )
              xd.push(0);
            w = rd = 0;
            digits2 = 1;
            i %= LOG_BASE;
            j = i - LOG_BASE + 1;
          } else {
            break out;
          }
        } else {
          w = k = xd[xdi];
          for (digits2 = 1; k >= 10; k /= 10)
            digits2++;
          i %= LOG_BASE;
          j = i - LOG_BASE + digits2;
          rd = j < 0 ? 0 : w / mathpow(10, digits2 - j - 1) % 10 | 0;
        }
      }
      isTruncated = isTruncated || sd < 0 || xd[xdi + 1] !== void 0 || (j < 0 ? w : w % mathpow(10, digits2 - j - 1));
      roundUp = rm < 4 ? (rd || isTruncated) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : rd > 5 || rd == 5 && (rm == 4 || isTruncated || rm == 6 && // Check whether the digit to the left of the rounding digit is odd.
      (i > 0 ? j > 0 ? w / mathpow(10, digits2 - j) : 0 : xd[xdi - 1]) % 10 & 1 || rm == (x.s < 0 ? 8 : 7));
      if (sd < 1 || !xd[0]) {
        xd.length = 0;
        if (roundUp) {
          sd -= x.e + 1;
          xd[0] = mathpow(10, (LOG_BASE - sd % LOG_BASE) % LOG_BASE);
          x.e = -sd || 0;
        } else {
          xd[0] = x.e = 0;
        }
        return x;
      }
      if (i == 0) {
        xd.length = xdi;
        k = 1;
        xdi--;
      } else {
        xd.length = xdi + 1;
        k = mathpow(10, LOG_BASE - i);
        xd[xdi] = j > 0 ? (w / mathpow(10, digits2 - j) % mathpow(10, j) | 0) * k : 0;
      }
      if (roundUp) {
        for (; ; ) {
          if (xdi == 0) {
            for (i = 1, j = xd[0]; j >= 10; j /= 10)
              i++;
            j = xd[0] += k;
            for (k = 1; j >= 10; j /= 10)
              k++;
            if (i != k) {
              x.e++;
              if (xd[0] == BASE)
                xd[0] = 1;
            }
            break;
          } else {
            xd[xdi] += k;
            if (xd[xdi] != BASE)
              break;
            xd[xdi--] = 0;
            k = 1;
          }
        }
      }
      for (i = xd.length; xd[--i] === 0; )
        xd.pop();
    }
  if (external) {
    if (x.e > Ctor.maxE) {
      x.d = null;
      x.e = NaN;
    } else if (x.e < Ctor.minE) {
      x.e = 0;
      x.d = [0];
    }
  }
  return x;
}
function finiteToString(x, isExp, sd) {
  if (!x.isFinite())
    return nonFiniteToString(x);
  var k, e = x.e, str = digitsToString(x.d), len = str.length;
  if (isExp) {
    if (sd && (k = sd - len) > 0) {
      str = str.charAt(0) + "." + str.slice(1) + getZeroString(k);
    } else if (len > 1) {
      str = str.charAt(0) + "." + str.slice(1);
    }
    str = str + (x.e < 0 ? "e" : "e+") + x.e;
  } else if (e < 0) {
    str = "0." + getZeroString(-e - 1) + str;
    if (sd && (k = sd - len) > 0)
      str += getZeroString(k);
  } else if (e >= len) {
    str += getZeroString(e + 1 - len);
    if (sd && (k = sd - e - 1) > 0)
      str = str + "." + getZeroString(k);
  } else {
    if ((k = e + 1) < len)
      str = str.slice(0, k) + "." + str.slice(k);
    if (sd && (k = sd - len) > 0) {
      if (e + 1 === len)
        str += ".";
      str += getZeroString(k);
    }
  }
  return str;
}
function getBase10Exponent(digits2, e) {
  var w = digits2[0];
  for (e *= LOG_BASE; w >= 10; w /= 10)
    e++;
  return e;
}
function getLn10(Ctor, sd, pr) {
  if (sd > LN10_PRECISION) {
    external = true;
    if (pr)
      Ctor.precision = pr;
    throw Error(precisionLimitExceeded);
  }
  return finalise(new Ctor(LN10), sd, 1, true);
}
function getPi(Ctor, sd, rm) {
  if (sd > PI_PRECISION)
    throw Error(precisionLimitExceeded);
  return finalise(new Ctor(PI), sd, rm, true);
}
function getPrecision(digits2) {
  var w = digits2.length - 1, len = w * LOG_BASE + 1;
  w = digits2[w];
  if (w) {
    for (; w % 10 == 0; w /= 10)
      len--;
    for (w = digits2[0]; w >= 10; w /= 10)
      len++;
  }
  return len;
}
function getZeroString(k) {
  var zs = "";
  for (; k--; )
    zs += "0";
  return zs;
}
function intPow(Ctor, x, n, pr) {
  var isTruncated, r = new Ctor(1), k = Math.ceil(pr / LOG_BASE + 4);
  external = false;
  for (; ; ) {
    if (n % 2) {
      r = r.times(x);
      if (truncate(r.d, k))
        isTruncated = true;
    }
    n = mathfloor(n / 2);
    if (n === 0) {
      n = r.d.length - 1;
      if (isTruncated && r.d[n] === 0)
        ++r.d[n];
      break;
    }
    x = x.times(x);
    truncate(x.d, k);
  }
  external = true;
  return r;
}
function isOdd(n) {
  return n.d[n.d.length - 1] & 1;
}
function maxOrMin(Ctor, args, ltgt) {
  var y, x = new Ctor(args[0]), i = 0;
  for (; ++i < args.length; ) {
    y = new Ctor(args[i]);
    if (!y.s) {
      x = y;
      break;
    } else if (x[ltgt](y)) {
      x = y;
    }
  }
  return x;
}
function naturalExponential(x, sd) {
  var denominator, guard, j, pow3, sum2, t, wpr, rep = 0, i = 0, k = 0, Ctor = x.constructor, rm = Ctor.rounding, pr = Ctor.precision;
  if (!x.d || !x.d[0] || x.e > 17) {
    return new Ctor(x.d ? !x.d[0] ? 1 : x.s < 0 ? 0 : 1 / 0 : x.s ? x.s < 0 ? 0 : x : 0 / 0);
  }
  if (sd == null) {
    external = false;
    wpr = pr;
  } else {
    wpr = sd;
  }
  t = new Ctor(0.03125);
  while (x.e > -2) {
    x = x.times(t);
    k += 5;
  }
  guard = Math.log(mathpow(2, k)) / Math.LN10 * 2 + 5 | 0;
  wpr += guard;
  denominator = pow3 = sum2 = new Ctor(1);
  Ctor.precision = wpr;
  for (; ; ) {
    pow3 = finalise(pow3.times(x), wpr, 1);
    denominator = denominator.times(++i);
    t = sum2.plus(divide(pow3, denominator, wpr, 1));
    if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum2.d).slice(0, wpr)) {
      j = k;
      while (j--)
        sum2 = finalise(sum2.times(sum2), wpr, 1);
      if (sd == null) {
        if (rep < 3 && checkRoundingDigits(sum2.d, wpr - guard, rm, rep)) {
          Ctor.precision = wpr += 10;
          denominator = pow3 = t = new Ctor(1);
          i = 0;
          rep++;
        } else {
          return finalise(sum2, Ctor.precision = pr, rm, external = true);
        }
      } else {
        Ctor.precision = pr;
        return sum2;
      }
    }
    sum2 = t;
  }
}
function naturalLogarithm(y, sd) {
  var c, c0, denominator, e, numerator, rep, sum2, t, wpr, x1, x2, n = 1, guard = 10, x = y, xd = x.d, Ctor = x.constructor, rm = Ctor.rounding, pr = Ctor.precision;
  if (x.s < 0 || !xd || !xd[0] || !x.e && xd[0] == 1 && xd.length == 1) {
    return new Ctor(xd && !xd[0] ? -1 / 0 : x.s != 1 ? NaN : xd ? 0 : x);
  }
  if (sd == null) {
    external = false;
    wpr = pr;
  } else {
    wpr = sd;
  }
  Ctor.precision = wpr += guard;
  c = digitsToString(xd);
  c0 = c.charAt(0);
  if (Math.abs(e = x.e) < 15e14) {
    while (c0 < 7 && c0 != 1 || c0 == 1 && c.charAt(1) > 3) {
      x = x.times(y);
      c = digitsToString(x.d);
      c0 = c.charAt(0);
      n++;
    }
    e = x.e;
    if (c0 > 1) {
      x = new Ctor("0." + c);
      e++;
    } else {
      x = new Ctor(c0 + "." + c.slice(1));
    }
  } else {
    t = getLn10(Ctor, wpr + 2, pr).times(e + "");
    x = naturalLogarithm(new Ctor(c0 + "." + c.slice(1)), wpr - guard).plus(t);
    Ctor.precision = pr;
    return sd == null ? finalise(x, pr, rm, external = true) : x;
  }
  x1 = x;
  sum2 = numerator = x = divide(x.minus(1), x.plus(1), wpr, 1);
  x2 = finalise(x.times(x), wpr, 1);
  denominator = 3;
  for (; ; ) {
    numerator = finalise(numerator.times(x2), wpr, 1);
    t = sum2.plus(divide(numerator, new Ctor(denominator), wpr, 1));
    if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum2.d).slice(0, wpr)) {
      sum2 = sum2.times(2);
      if (e !== 0)
        sum2 = sum2.plus(getLn10(Ctor, wpr + 2, pr).times(e + ""));
      sum2 = divide(sum2, new Ctor(n), wpr, 1);
      if (sd == null) {
        if (checkRoundingDigits(sum2.d, wpr - guard, rm, rep)) {
          Ctor.precision = wpr += guard;
          t = numerator = x = divide(x1.minus(1), x1.plus(1), wpr, 1);
          x2 = finalise(x.times(x), wpr, 1);
          denominator = rep = 1;
        } else {
          return finalise(sum2, Ctor.precision = pr, rm, external = true);
        }
      } else {
        Ctor.precision = pr;
        return sum2;
      }
    }
    sum2 = t;
    denominator += 2;
  }
}
function nonFiniteToString(x) {
  return String(x.s * x.s / 0);
}
function parseDecimal(x, str) {
  var e, i, len;
  if ((e = str.indexOf(".")) > -1)
    str = str.replace(".", "");
  if ((i = str.search(/e/i)) > 0) {
    if (e < 0)
      e = i;
    e += +str.slice(i + 1);
    str = str.substring(0, i);
  } else if (e < 0) {
    e = str.length;
  }
  for (i = 0; str.charCodeAt(i) === 48; i++)
    ;
  for (len = str.length; str.charCodeAt(len - 1) === 48; --len)
    ;
  str = str.slice(i, len);
  if (str) {
    len -= i;
    x.e = e = e - i - 1;
    x.d = [];
    i = (e + 1) % LOG_BASE;
    if (e < 0)
      i += LOG_BASE;
    if (i < len) {
      if (i)
        x.d.push(+str.slice(0, i));
      for (len -= LOG_BASE; i < len; )
        x.d.push(+str.slice(i, i += LOG_BASE));
      str = str.slice(i);
      i = LOG_BASE - str.length;
    } else {
      i -= len;
    }
    for (; i--; )
      str += "0";
    x.d.push(+str);
    if (external) {
      if (x.e > x.constructor.maxE) {
        x.d = null;
        x.e = NaN;
      } else if (x.e < x.constructor.minE) {
        x.e = 0;
        x.d = [0];
      }
    }
  } else {
    x.e = 0;
    x.d = [0];
  }
  return x;
}
function parseOther(x, str) {
  var base, Ctor, divisor, i, isFloat, len, p, xd, xe;
  if (str.indexOf("_") > -1) {
    str = str.replace(/(\d)_(?=\d)/g, "$1");
    if (isDecimal.test(str))
      return parseDecimal(x, str);
  } else if (str === "Infinity" || str === "NaN") {
    if (!+str)
      x.s = NaN;
    x.e = NaN;
    x.d = null;
    return x;
  }
  if (isHex.test(str)) {
    base = 16;
    str = str.toLowerCase();
  } else if (isBinary.test(str)) {
    base = 2;
  } else if (isOctal.test(str)) {
    base = 8;
  } else {
    throw Error(invalidArgument + str);
  }
  i = str.search(/p/i);
  if (i > 0) {
    p = +str.slice(i + 1);
    str = str.substring(2, i);
  } else {
    str = str.slice(2);
  }
  i = str.indexOf(".");
  isFloat = i >= 0;
  Ctor = x.constructor;
  if (isFloat) {
    str = str.replace(".", "");
    len = str.length;
    i = len - i;
    divisor = intPow(Ctor, new Ctor(base), i, i * 2);
  }
  xd = convertBase(str, base, BASE);
  xe = xd.length - 1;
  for (i = xe; xd[i] === 0; --i)
    xd.pop();
  if (i < 0)
    return new Ctor(x.s * 0);
  x.e = getBase10Exponent(xd, xe);
  x.d = xd;
  external = false;
  if (isFloat)
    x = divide(x, divisor, len * 4);
  if (p)
    x = x.times(Math.abs(p) < 54 ? mathpow(2, p) : Decimal.pow(2, p));
  external = true;
  return x;
}
function sine(Ctor, x) {
  var k, len = x.d.length;
  if (len < 3) {
    return x.isZero() ? x : taylorSeries(Ctor, 2, x, x);
  }
  k = 1.4 * Math.sqrt(len);
  k = k > 16 ? 16 : k | 0;
  x = x.times(1 / tinyPow(5, k));
  x = taylorSeries(Ctor, 2, x, x);
  var sin2_x, d5 = new Ctor(5), d16 = new Ctor(16), d20 = new Ctor(20);
  for (; k--; ) {
    sin2_x = x.times(x);
    x = x.times(d5.plus(sin2_x.times(d16.times(sin2_x).minus(d20))));
  }
  return x;
}
function taylorSeries(Ctor, n, x, y, isHyperbolic) {
  var j, t, u, x2, i = 1, pr = Ctor.precision, k = Math.ceil(pr / LOG_BASE);
  external = false;
  x2 = x.times(x);
  u = new Ctor(y);
  for (; ; ) {
    t = divide(u.times(x2), new Ctor(n++ * n++), pr, 1);
    u = isHyperbolic ? y.plus(t) : y.minus(t);
    y = divide(t.times(x2), new Ctor(n++ * n++), pr, 1);
    t = u.plus(y);
    if (t.d[k] !== void 0) {
      for (j = k; t.d[j] === u.d[j] && j--; )
        ;
      if (j == -1)
        break;
    }
    j = u;
    u = y;
    y = t;
    t = j;
    i++;
  }
  external = true;
  t.d.length = k + 1;
  return t;
}
function tinyPow(b, e) {
  var n = b;
  while (--e)
    n *= b;
  return n;
}
function toLessThanHalfPi(Ctor, x) {
  var t, isNeg = x.s < 0, pi = getPi(Ctor, Ctor.precision, 1), halfPi = pi.times(0.5);
  x = x.abs();
  if (x.lte(halfPi)) {
    quadrant = isNeg ? 4 : 1;
    return x;
  }
  t = x.divToInt(pi);
  if (t.isZero()) {
    quadrant = isNeg ? 3 : 2;
  } else {
    x = x.minus(t.times(pi));
    if (x.lte(halfPi)) {
      quadrant = isOdd(t) ? isNeg ? 2 : 3 : isNeg ? 4 : 1;
      return x;
    }
    quadrant = isOdd(t) ? isNeg ? 1 : 4 : isNeg ? 3 : 2;
  }
  return x.minus(pi).abs();
}
function toStringBinary(x, baseOut, sd, rm) {
  var base, e, i, k, len, roundUp, str, xd, y, Ctor = x.constructor, isExp = sd !== void 0;
  if (isExp) {
    checkInt32(sd, 1, MAX_DIGITS);
    if (rm === void 0)
      rm = Ctor.rounding;
    else
      checkInt32(rm, 0, 8);
  } else {
    sd = Ctor.precision;
    rm = Ctor.rounding;
  }
  if (!x.isFinite()) {
    str = nonFiniteToString(x);
  } else {
    str = finiteToString(x);
    i = str.indexOf(".");
    if (isExp) {
      base = 2;
      if (baseOut == 16) {
        sd = sd * 4 - 3;
      } else if (baseOut == 8) {
        sd = sd * 3 - 2;
      }
    } else {
      base = baseOut;
    }
    if (i >= 0) {
      str = str.replace(".", "");
      y = new Ctor(1);
      y.e = str.length - i;
      y.d = convertBase(finiteToString(y), 10, base);
      y.e = y.d.length;
    }
    xd = convertBase(str, 10, base);
    e = len = xd.length;
    for (; xd[--len] == 0; )
      xd.pop();
    if (!xd[0]) {
      str = isExp ? "0p+0" : "0";
    } else {
      if (i < 0) {
        e--;
      } else {
        x = new Ctor(x);
        x.d = xd;
        x.e = e;
        x = divide(x, y, sd, rm, 0, base);
        xd = x.d;
        e = x.e;
        roundUp = inexact;
      }
      i = xd[sd];
      k = base / 2;
      roundUp = roundUp || xd[sd + 1] !== void 0;
      roundUp = rm < 4 ? (i !== void 0 || roundUp) && (rm === 0 || rm === (x.s < 0 ? 3 : 2)) : i > k || i === k && (rm === 4 || roundUp || rm === 6 && xd[sd - 1] & 1 || rm === (x.s < 0 ? 8 : 7));
      xd.length = sd;
      if (roundUp) {
        for (; ++xd[--sd] > base - 1; ) {
          xd[sd] = 0;
          if (!sd) {
            ++e;
            xd.unshift(1);
          }
        }
      }
      for (len = xd.length; !xd[len - 1]; --len)
        ;
      for (i = 0, str = ""; i < len; i++)
        str += NUMERALS.charAt(xd[i]);
      if (isExp) {
        if (len > 1) {
          if (baseOut == 16 || baseOut == 8) {
            i = baseOut == 16 ? 4 : 3;
            for (--len; len % i; len++)
              str += "0";
            xd = convertBase(str, base, baseOut);
            for (len = xd.length; !xd[len - 1]; --len)
              ;
            for (i = 1, str = "1."; i < len; i++)
              str += NUMERALS.charAt(xd[i]);
          } else {
            str = str.charAt(0) + "." + str.slice(1);
          }
        }
        str = str + (e < 0 ? "p" : "p+") + e;
      } else if (e < 0) {
        for (; ++e; )
          str = "0" + str;
        str = "0." + str;
      } else {
        if (++e > len)
          for (e -= len; e--; )
            str += "0";
        else if (e < len)
          str = str.slice(0, e) + "." + str.slice(e);
      }
    }
    str = (baseOut == 16 ? "0x" : baseOut == 2 ? "0b" : baseOut == 8 ? "0o" : "") + str;
  }
  return x.s < 0 ? "-" + str : str;
}
function truncate(arr, len) {
  if (arr.length > len) {
    arr.length = len;
    return true;
  }
}
function abs(x) {
  return new this(x).abs();
}
function acos(x) {
  return new this(x).acos();
}
function acosh(x) {
  return new this(x).acosh();
}
function add(x, y) {
  return new this(x).plus(y);
}
function asin(x) {
  return new this(x).asin();
}
function asinh(x) {
  return new this(x).asinh();
}
function atan(x) {
  return new this(x).atan();
}
function atanh(x) {
  return new this(x).atanh();
}
function atan2(y, x) {
  y = new this(y);
  x = new this(x);
  var r, pr = this.precision, rm = this.rounding, wpr = pr + 4;
  if (!y.s || !x.s) {
    r = new this(NaN);
  } else if (!y.d && !x.d) {
    r = getPi(this, wpr, 1).times(x.s > 0 ? 0.25 : 0.75);
    r.s = y.s;
  } else if (!x.d || y.isZero()) {
    r = x.s < 0 ? getPi(this, pr, rm) : new this(0);
    r.s = y.s;
  } else if (!y.d || x.isZero()) {
    r = getPi(this, wpr, 1).times(0.5);
    r.s = y.s;
  } else if (x.s < 0) {
    this.precision = wpr;
    this.rounding = 1;
    r = this.atan(divide(y, x, wpr, 1));
    x = getPi(this, wpr, 1);
    this.precision = pr;
    this.rounding = rm;
    r = y.s < 0 ? r.minus(x) : r.plus(x);
  } else {
    r = this.atan(divide(y, x, wpr, 1));
  }
  return r;
}
function cbrt3(x) {
  return new this(x).cbrt();
}
function ceil(x) {
  return finalise(x = new this(x), x.e + 1, 2);
}
function clamp(x, min2, max2) {
  return new this(x).clamp(min2, max2);
}
function config3(obj) {
  if (!obj || typeof obj !== "object")
    throw Error(decimalError + "Object expected");
  var i, p, v, useDefaults = obj.defaults === true, ps = [
    "precision",
    1,
    MAX_DIGITS,
    "rounding",
    0,
    8,
    "toExpNeg",
    -EXP_LIMIT,
    0,
    "toExpPos",
    0,
    EXP_LIMIT,
    "maxE",
    0,
    EXP_LIMIT,
    "minE",
    -EXP_LIMIT,
    0,
    "modulo",
    0,
    9
  ];
  for (i = 0; i < ps.length; i += 3) {
    if (p = ps[i], useDefaults)
      this[p] = DEFAULTS[p];
    if ((v = obj[p]) !== void 0) {
      if (mathfloor(v) === v && v >= ps[i + 1] && v <= ps[i + 2])
        this[p] = v;
      else
        throw Error(invalidArgument + p + ": " + v);
    }
  }
  if (p = "crypto", useDefaults)
    this[p] = DEFAULTS[p];
  if ((v = obj[p]) !== void 0) {
    if (v === true || v === false || v === 0 || v === 1) {
      if (v) {
        if (typeof crypto != "undefined" && crypto && (crypto.getRandomValues || crypto.randomBytes)) {
          this[p] = true;
        } else {
          throw Error(cryptoUnavailable);
        }
      } else {
        this[p] = false;
      }
    } else {
      throw Error(invalidArgument + p + ": " + v);
    }
  }
  return this;
}
function cos(x) {
  return new this(x).cos();
}
function cosh(x) {
  return new this(x).cosh();
}
function clone3(obj) {
  var i, p, ps;
  function Decimal2(v) {
    var e, i2, t, x = this;
    if (!(x instanceof Decimal2))
      return new Decimal2(v);
    x.constructor = Decimal2;
    if (isDecimalInstance(v)) {
      x.s = v.s;
      if (external) {
        if (!v.d || v.e > Decimal2.maxE) {
          x.e = NaN;
          x.d = null;
        } else if (v.e < Decimal2.minE) {
          x.e = 0;
          x.d = [0];
        } else {
          x.e = v.e;
          x.d = v.d.slice();
        }
      } else {
        x.e = v.e;
        x.d = v.d ? v.d.slice() : v.d;
      }
      return;
    }
    t = typeof v;
    if (t === "number") {
      if (v === 0) {
        x.s = 1 / v < 0 ? -1 : 1;
        x.e = 0;
        x.d = [0];
        return;
      }
      if (v < 0) {
        v = -v;
        x.s = -1;
      } else {
        x.s = 1;
      }
      if (v === ~~v && v < 1e7) {
        for (e = 0, i2 = v; i2 >= 10; i2 /= 10)
          e++;
        if (external) {
          if (e > Decimal2.maxE) {
            x.e = NaN;
            x.d = null;
          } else if (e < Decimal2.minE) {
            x.e = 0;
            x.d = [0];
          } else {
            x.e = e;
            x.d = [v];
          }
        } else {
          x.e = e;
          x.d = [v];
        }
        return;
      } else if (v * 0 !== 0) {
        if (!v)
          x.s = NaN;
        x.e = NaN;
        x.d = null;
        return;
      }
      return parseDecimal(x, v.toString());
    } else if (t !== "string") {
      throw Error(invalidArgument + v);
    }
    if ((i2 = v.charCodeAt(0)) === 45) {
      v = v.slice(1);
      x.s = -1;
    } else {
      if (i2 === 43)
        v = v.slice(1);
      x.s = 1;
    }
    return isDecimal.test(v) ? parseDecimal(x, v) : parseOther(x, v);
  }
  Decimal2.prototype = P;
  Decimal2.ROUND_UP = 0;
  Decimal2.ROUND_DOWN = 1;
  Decimal2.ROUND_CEIL = 2;
  Decimal2.ROUND_FLOOR = 3;
  Decimal2.ROUND_HALF_UP = 4;
  Decimal2.ROUND_HALF_DOWN = 5;
  Decimal2.ROUND_HALF_EVEN = 6;
  Decimal2.ROUND_HALF_CEIL = 7;
  Decimal2.ROUND_HALF_FLOOR = 8;
  Decimal2.EUCLID = 9;
  Decimal2.config = Decimal2.set = config3;
  Decimal2.clone = clone3;
  Decimal2.isDecimal = isDecimalInstance;
  Decimal2.abs = abs;
  Decimal2.acos = acos;
  Decimal2.acosh = acosh;
  Decimal2.add = add;
  Decimal2.asin = asin;
  Decimal2.asinh = asinh;
  Decimal2.atan = atan;
  Decimal2.atanh = atanh;
  Decimal2.atan2 = atan2;
  Decimal2.cbrt = cbrt3;
  Decimal2.ceil = ceil;
  Decimal2.clamp = clamp;
  Decimal2.cos = cos;
  Decimal2.cosh = cosh;
  Decimal2.div = div;
  Decimal2.exp = exp;
  Decimal2.floor = floor;
  Decimal2.hypot = hypot;
  Decimal2.ln = ln;
  Decimal2.log = log;
  Decimal2.log10 = log103;
  Decimal2.log2 = log23;
  Decimal2.max = max;
  Decimal2.min = min;
  Decimal2.mod = mod;
  Decimal2.mul = mul;
  Decimal2.pow = pow;
  Decimal2.random = random;
  Decimal2.round = round;
  Decimal2.sign = sign2;
  Decimal2.sin = sin;
  Decimal2.sinh = sinh;
  Decimal2.sqrt = sqrt;
  Decimal2.sub = sub;
  Decimal2.sum = sum;
  Decimal2.tan = tan;
  Decimal2.tanh = tanh;
  Decimal2.trunc = trunc;
  if (obj === void 0)
    obj = {};
  if (obj) {
    if (obj.defaults !== true) {
      ps = ["precision", "rounding", "toExpNeg", "toExpPos", "maxE", "minE", "modulo", "crypto"];
      for (i = 0; i < ps.length; )
        if (!obj.hasOwnProperty(p = ps[i++]))
          obj[p] = this[p];
    }
  }
  Decimal2.config(obj);
  return Decimal2;
}
function div(x, y) {
  return new this(x).div(y);
}
function exp(x) {
  return new this(x).exp();
}
function floor(x) {
  return finalise(x = new this(x), x.e + 1, 3);
}
function hypot() {
  var i, n, t = new this(0);
  external = false;
  for (i = 0; i < arguments.length; ) {
    n = new this(arguments[i++]);
    if (!n.d) {
      if (n.s) {
        external = true;
        return new this(1 / 0);
      }
      t = n;
    } else if (t.d) {
      t = t.plus(n.times(n));
    }
  }
  external = true;
  return t.sqrt();
}
function isDecimalInstance(obj) {
  return obj instanceof Decimal || obj && obj.toStringTag === tag || false;
}
function ln(x) {
  return new this(x).ln();
}
function log(x, y) {
  return new this(x).log(y);
}
function log23(x) {
  return new this(x).log(2);
}
function log103(x) {
  return new this(x).log(10);
}
function max() {
  return maxOrMin(this, arguments, "lt");
}
function min() {
  return maxOrMin(this, arguments, "gt");
}
function mod(x, y) {
  return new this(x).mod(y);
}
function mul(x, y) {
  return new this(x).mul(y);
}
function pow(x, y) {
  return new this(x).pow(y);
}
function random(sd) {
  var d, e, k, n, i = 0, r = new this(1), rd = [];
  if (sd === void 0)
    sd = this.precision;
  else
    checkInt32(sd, 1, MAX_DIGITS);
  k = Math.ceil(sd / LOG_BASE);
  if (!this.crypto) {
    for (; i < k; )
      rd[i++] = Math.random() * 1e7 | 0;
  } else if (crypto.getRandomValues) {
    d = crypto.getRandomValues(new Uint32Array(k));
    for (; i < k; ) {
      n = d[i];
      if (n >= 429e7) {
        d[i] = crypto.getRandomValues(new Uint32Array(1))[0];
      } else {
        rd[i++] = n % 1e7;
      }
    }
  } else if (crypto.randomBytes) {
    d = crypto.randomBytes(k *= 4);
    for (; i < k; ) {
      n = d[i] + (d[i + 1] << 8) + (d[i + 2] << 16) + ((d[i + 3] & 127) << 24);
      if (n >= 214e7) {
        crypto.randomBytes(4).copy(d, i);
      } else {
        rd.push(n % 1e7);
        i += 4;
      }
    }
    i = k / 4;
  } else {
    throw Error(cryptoUnavailable);
  }
  k = rd[--i];
  sd %= LOG_BASE;
  if (k && sd) {
    n = mathpow(10, LOG_BASE - sd);
    rd[i] = (k / n | 0) * n;
  }
  for (; rd[i] === 0; i--)
    rd.pop();
  if (i < 0) {
    e = 0;
    rd = [0];
  } else {
    e = -1;
    for (; rd[0] === 0; e -= LOG_BASE)
      rd.shift();
    for (k = 1, n = rd[0]; n >= 10; n /= 10)
      k++;
    if (k < LOG_BASE)
      e -= LOG_BASE - k;
  }
  r.e = e;
  r.d = rd;
  return r;
}
function round(x) {
  return finalise(x = new this(x), x.e + 1, this.rounding);
}
function sign2(x) {
  x = new this(x);
  return x.d ? x.d[0] ? x.s : 0 * x.s : x.s || NaN;
}
function sin(x) {
  return new this(x).sin();
}
function sinh(x) {
  return new this(x).sinh();
}
function sqrt(x) {
  return new this(x).sqrt();
}
function sub(x, y) {
  return new this(x).sub(y);
}
function sum() {
  var i = 0, args = arguments, x = new this(args[i]);
  external = false;
  for (; x.s && ++i < args.length; )
    x = x.plus(args[i]);
  external = true;
  return finalise(x, this.precision, this.rounding);
}
function tan(x) {
  return new this(x).tan();
}
function tanh(x) {
  return new this(x).tanh();
}
function trunc(x) {
  return finalise(x = new this(x), x.e + 1, 1);
}
P[Symbol.for("nodejs.util.inspect.custom")] = P.toString;
P[Symbol.toStringTag] = "Decimal";
var Decimal = P.constructor = clone3(DEFAULTS);
LN10 = new Decimal(LN10);
PI = new Decimal(PI);
var decimal_default = Decimal;

// node_modules/mathjs/lib/esm/type/bignumber/BigNumber.js
var name = "BigNumber";
var dependencies2 = ["?on", "config"];
var createBigNumberClass = /* @__PURE__ */ factory(name, dependencies2, (_ref) => {
  var {
    on,
    config: config4
  } = _ref;
  var BigNumber2 = decimal_default.clone({
    precision: config4.precision,
    modulo: decimal_default.EUCLID
  });
  BigNumber2.prototype = Object.create(BigNumber2.prototype);
  BigNumber2.prototype.type = "BigNumber";
  BigNumber2.prototype.isBigNumber = true;
  BigNumber2.prototype.toJSON = function() {
    return {
      mathjs: "BigNumber",
      value: this.toString()
    };
  };
  BigNumber2.fromJSON = function(json) {
    return new BigNumber2(json.value);
  };
  if (on) {
    on("config", function(curr, prev) {
      if (curr.precision !== prev.precision) {
        BigNumber2.config({
          precision: curr.precision
        });
      }
    });
  }
  return BigNumber2;
}, {
  isClass: true
});

// node_modules/mathjs/lib/esm/type/complex/Complex.js
var import_complex = __toESM(require_complex(), 1);
var name2 = "Complex";
var dependencies3 = [];
var createComplexClass = /* @__PURE__ */ factory(name2, dependencies3, () => {
  Object.defineProperty(import_complex.default, "name", {
    value: "Complex"
  });
  import_complex.default.prototype.constructor = import_complex.default;
  import_complex.default.prototype.type = "Complex";
  import_complex.default.prototype.isComplex = true;
  import_complex.default.prototype.toJSON = function() {
    return {
      mathjs: "Complex",
      re: this.re,
      im: this.im
    };
  };
  import_complex.default.prototype.toPolar = function() {
    return {
      r: this.abs(),
      phi: this.arg()
    };
  };
  import_complex.default.prototype.format = function(options) {
    var str = "";
    var im2 = this.im;
    var re2 = this.re;
    var strRe = format(this.re, options);
    var strIm = format(this.im, options);
    var precision = isNumber(options) ? options : options ? options.precision : null;
    if (precision !== null) {
      var epsilon = Math.pow(10, -precision);
      if (Math.abs(re2 / im2) < epsilon) {
        re2 = 0;
      }
      if (Math.abs(im2 / re2) < epsilon) {
        im2 = 0;
      }
    }
    if (im2 === 0) {
      str = strRe;
    } else if (re2 === 0) {
      if (im2 === 1) {
        str = "i";
      } else if (im2 === -1) {
        str = "-i";
      } else {
        str = strIm + "i";
      }
    } else {
      if (im2 < 0) {
        if (im2 === -1) {
          str = strRe + " - i";
        } else {
          str = strRe + " - " + strIm.substring(1) + "i";
        }
      } else {
        if (im2 === 1) {
          str = strRe + " + i";
        } else {
          str = strRe + " + " + strIm + "i";
        }
      }
    }
    return str;
  };
  import_complex.default.fromPolar = function(args) {
    switch (arguments.length) {
      case 1: {
        var arg = arguments[0];
        if (typeof arg === "object") {
          return (0, import_complex.default)(arg);
        } else {
          throw new TypeError("Input has to be an object with r and phi keys.");
        }
      }
      case 2: {
        var r = arguments[0];
        var phi = arguments[1];
        if (isNumber(r)) {
          if (isUnit(phi) && phi.hasBase("ANGLE")) {
            phi = phi.toNumber("rad");
          }
          if (isNumber(phi)) {
            return new import_complex.default({
              r,
              phi
            });
          }
          throw new TypeError("Phi is not a number nor an angle unit.");
        } else {
          throw new TypeError("Radius r is not a number.");
        }
      }
      default:
        throw new SyntaxError("Wrong number of arguments in function fromPolar");
    }
  };
  import_complex.default.prototype.valueOf = import_complex.default.prototype.toString;
  import_complex.default.fromJSON = function(json) {
    return new import_complex.default(json);
  };
  import_complex.default.compare = function(a, b) {
    if (a.re > b.re) {
      return 1;
    }
    if (a.re < b.re) {
      return -1;
    }
    if (a.im > b.im) {
      return 1;
    }
    if (a.im < b.im) {
      return -1;
    }
    return 0;
  };
  return import_complex.default;
}, {
  isClass: true
});

// node_modules/mathjs/lib/esm/type/fraction/Fraction.js
var import_fraction = __toESM(require_fraction(), 1);
var name3 = "Fraction";
var dependencies4 = [];
var createFractionClass = /* @__PURE__ */ factory(name3, dependencies4, () => {
  Object.defineProperty(import_fraction.default, "name", {
    value: "Fraction"
  });
  import_fraction.default.prototype.constructor = import_fraction.default;
  import_fraction.default.prototype.type = "Fraction";
  import_fraction.default.prototype.isFraction = true;
  import_fraction.default.prototype.toJSON = function() {
    return {
      mathjs: "Fraction",
      n: this.s * this.n,
      d: this.d
    };
  };
  import_fraction.default.fromJSON = function(json) {
    return new import_fraction.default(json);
  };
  return import_fraction.default;
}, {
  isClass: true
});

// node_modules/mathjs/lib/esm/type/matrix/Matrix.js
var name4 = "Matrix";
var dependencies5 = [];
var createMatrixClass = /* @__PURE__ */ factory(name4, dependencies5, () => {
  function Matrix2() {
    if (!(this instanceof Matrix2)) {
      throw new SyntaxError("Constructor must be called with the new operator");
    }
  }
  Matrix2.prototype.type = "Matrix";
  Matrix2.prototype.isMatrix = true;
  Matrix2.prototype.storage = function() {
    throw new Error("Cannot invoke storage on a Matrix interface");
  };
  Matrix2.prototype.datatype = function() {
    throw new Error("Cannot invoke datatype on a Matrix interface");
  };
  Matrix2.prototype.create = function(data, datatype) {
    throw new Error("Cannot invoke create on a Matrix interface");
  };
  Matrix2.prototype.subset = function(index, replacement, defaultValue) {
    throw new Error("Cannot invoke subset on a Matrix interface");
  };
  Matrix2.prototype.get = function(index) {
    throw new Error("Cannot invoke get on a Matrix interface");
  };
  Matrix2.prototype.set = function(index, value, defaultValue) {
    throw new Error("Cannot invoke set on a Matrix interface");
  };
  Matrix2.prototype.resize = function(size2, defaultValue) {
    throw new Error("Cannot invoke resize on a Matrix interface");
  };
  Matrix2.prototype.reshape = function(size2, defaultValue) {
    throw new Error("Cannot invoke reshape on a Matrix interface");
  };
  Matrix2.prototype.clone = function() {
    throw new Error("Cannot invoke clone on a Matrix interface");
  };
  Matrix2.prototype.size = function() {
    throw new Error("Cannot invoke size on a Matrix interface");
  };
  Matrix2.prototype.map = function(callback, skipZeros) {
    throw new Error("Cannot invoke map on a Matrix interface");
  };
  Matrix2.prototype.forEach = function(callback) {
    throw new Error("Cannot invoke forEach on a Matrix interface");
  };
  Matrix2.prototype[Symbol.iterator] = function() {
    throw new Error("Cannot iterate a Matrix interface");
  };
  Matrix2.prototype.toArray = function() {
    throw new Error("Cannot invoke toArray on a Matrix interface");
  };
  Matrix2.prototype.valueOf = function() {
    throw new Error("Cannot invoke valueOf on a Matrix interface");
  };
  Matrix2.prototype.format = function(options) {
    throw new Error("Cannot invoke format on a Matrix interface");
  };
  Matrix2.prototype.toString = function() {
    throw new Error("Cannot invoke toString on a Matrix interface");
  };
  return Matrix2;
}, {
  isClass: true
});

// node_modules/mathjs/lib/esm/utils/function.js
function maxArgumentCount(fn) {
  return Object.keys(fn.signatures || {}).reduce(function(args, signature) {
    var count = (signature.match(/,/g) || []).length + 1;
    return Math.max(args, count);
  }, -1);
}

// node_modules/mathjs/lib/esm/type/matrix/DenseMatrix.js
var name5 = "DenseMatrix";
var dependencies6 = ["Matrix"];
var createDenseMatrixClass = /* @__PURE__ */ factory(name5, dependencies6, (_ref) => {
  var {
    Matrix: Matrix2
  } = _ref;
  function DenseMatrix2(data, datatype) {
    if (!(this instanceof DenseMatrix2)) {
      throw new SyntaxError("Constructor must be called with the new operator");
    }
    if (datatype && !isString(datatype)) {
      throw new Error("Invalid datatype: " + datatype);
    }
    if (isMatrix(data)) {
      if (data.type === "DenseMatrix") {
        this._data = clone(data._data);
        this._size = clone(data._size);
        this._datatype = datatype || data._datatype;
      } else {
        this._data = data.toArray();
        this._size = data.size();
        this._datatype = datatype || data._datatype;
      }
    } else if (data && isArray(data.data) && isArray(data.size)) {
      this._data = data.data;
      this._size = data.size;
      validate(this._data, this._size);
      this._datatype = datatype || data.datatype;
    } else if (isArray(data)) {
      this._data = preprocess(data);
      this._size = arraySize(this._data);
      validate(this._data, this._size);
      this._datatype = datatype;
    } else if (data) {
      throw new TypeError("Unsupported type of data (" + typeOf(data) + ")");
    } else {
      this._data = [];
      this._size = [0];
      this._datatype = datatype;
    }
  }
  DenseMatrix2.prototype = new Matrix2();
  DenseMatrix2.prototype.createDenseMatrix = function(data, datatype) {
    return new DenseMatrix2(data, datatype);
  };
  Object.defineProperty(DenseMatrix2, "name", {
    value: "DenseMatrix"
  });
  DenseMatrix2.prototype.constructor = DenseMatrix2;
  DenseMatrix2.prototype.type = "DenseMatrix";
  DenseMatrix2.prototype.isDenseMatrix = true;
  DenseMatrix2.prototype.getDataType = function() {
    return getArrayDataType(this._data, typeOf);
  };
  DenseMatrix2.prototype.storage = function() {
    return "dense";
  };
  DenseMatrix2.prototype.datatype = function() {
    return this._datatype;
  };
  DenseMatrix2.prototype.create = function(data, datatype) {
    return new DenseMatrix2(data, datatype);
  };
  DenseMatrix2.prototype.subset = function(index, replacement, defaultValue) {
    switch (arguments.length) {
      case 1:
        return _get(this, index);
      case 2:
      case 3:
        return _set(this, index, replacement, defaultValue);
      default:
        throw new SyntaxError("Wrong number of arguments");
    }
  };
  DenseMatrix2.prototype.get = function(index) {
    if (!isArray(index)) {
      throw new TypeError("Array expected");
    }
    if (index.length !== this._size.length) {
      throw new DimensionError(index.length, this._size.length);
    }
    for (var x = 0; x < index.length; x++) {
      validateIndex(index[x], this._size[x]);
    }
    var data = this._data;
    for (var i = 0, ii = index.length; i < ii; i++) {
      var indexI = index[i];
      validateIndex(indexI, data.length);
      data = data[indexI];
    }
    return data;
  };
  DenseMatrix2.prototype.set = function(index, value, defaultValue) {
    if (!isArray(index)) {
      throw new TypeError("Array expected");
    }
    if (index.length < this._size.length) {
      throw new DimensionError(index.length, this._size.length, "<");
    }
    var i, ii, indexI;
    var size2 = index.map(function(i2) {
      return i2 + 1;
    });
    _fit(this, size2, defaultValue);
    var data = this._data;
    for (i = 0, ii = index.length - 1; i < ii; i++) {
      indexI = index[i];
      validateIndex(indexI, data.length);
      data = data[indexI];
    }
    indexI = index[index.length - 1];
    validateIndex(indexI, data.length);
    data[indexI] = value;
    return this;
  };
  function _get(matrix2, index) {
    if (!isIndex(index)) {
      throw new TypeError("Invalid index");
    }
    var isScalar = index.isScalar();
    if (isScalar) {
      return matrix2.get(index.min());
    } else {
      var size2 = index.size();
      if (size2.length !== matrix2._size.length) {
        throw new DimensionError(size2.length, matrix2._size.length);
      }
      var min2 = index.min();
      var max2 = index.max();
      for (var i = 0, ii = matrix2._size.length; i < ii; i++) {
        validateIndex(min2[i], matrix2._size[i]);
        validateIndex(max2[i], matrix2._size[i]);
      }
      return new DenseMatrix2(_getSubmatrix(matrix2._data, index, size2.length, 0), matrix2._datatype);
    }
  }
  function _getSubmatrix(data, index, dims, dim) {
    var last = dim === dims - 1;
    var range2 = index.dimension(dim);
    if (last) {
      return range2.map(function(i) {
        validateIndex(i, data.length);
        return data[i];
      }).valueOf();
    } else {
      return range2.map(function(i) {
        validateIndex(i, data.length);
        var child = data[i];
        return _getSubmatrix(child, index, dims, dim + 1);
      }).valueOf();
    }
  }
  function _set(matrix2, index, submatrix, defaultValue) {
    if (!index || index.isIndex !== true) {
      throw new TypeError("Invalid index");
    }
    var iSize = index.size();
    var isScalar = index.isScalar();
    var sSize;
    if (isMatrix(submatrix)) {
      sSize = submatrix.size();
      submatrix = submatrix.valueOf();
    } else {
      sSize = arraySize(submatrix);
    }
    if (isScalar) {
      if (sSize.length !== 0) {
        throw new TypeError("Scalar expected");
      }
      matrix2.set(index.min(), submatrix, defaultValue);
    } else {
      if (!deepStrictEqual(sSize, iSize)) {
        try {
          if (sSize.length === 0) {
            submatrix = broadcastTo([submatrix], iSize);
          } else {
            submatrix = broadcastTo(submatrix, iSize);
          }
          sSize = arraySize(submatrix);
        } catch (_unused) {
        }
      }
      if (iSize.length < matrix2._size.length) {
        throw new DimensionError(iSize.length, matrix2._size.length, "<");
      }
      if (sSize.length < iSize.length) {
        var i = 0;
        var outer = 0;
        while (iSize[i] === 1 && sSize[i] === 1) {
          i++;
        }
        while (iSize[i] === 1) {
          outer++;
          i++;
        }
        submatrix = unsqueeze(submatrix, iSize.length, outer, sSize);
      }
      if (!deepStrictEqual(iSize, sSize)) {
        throw new DimensionError(iSize, sSize, ">");
      }
      var size2 = index.max().map(function(i2) {
        return i2 + 1;
      });
      _fit(matrix2, size2, defaultValue);
      var dims = iSize.length;
      var dim = 0;
      _setSubmatrix(matrix2._data, index, submatrix, dims, dim);
    }
    return matrix2;
  }
  function _setSubmatrix(data, index, submatrix, dims, dim) {
    var last = dim === dims - 1;
    var range2 = index.dimension(dim);
    if (last) {
      range2.forEach(function(dataIndex, subIndex) {
        validateIndex(dataIndex);
        data[dataIndex] = submatrix[subIndex[0]];
      });
    } else {
      range2.forEach(function(dataIndex, subIndex) {
        validateIndex(dataIndex);
        _setSubmatrix(data[dataIndex], index, submatrix[subIndex[0]], dims, dim + 1);
      });
    }
  }
  DenseMatrix2.prototype.resize = function(size2, defaultValue, copy) {
    if (!isCollection(size2)) {
      throw new TypeError("Array or Matrix expected");
    }
    var sizeArray = size2.valueOf().map((value) => {
      return Array.isArray(value) && value.length === 1 ? value[0] : value;
    });
    var m = copy ? this.clone() : this;
    return _resize2(m, sizeArray, defaultValue);
  };
  function _resize2(matrix2, size2, defaultValue) {
    if (size2.length === 0) {
      var v = matrix2._data;
      while (isArray(v)) {
        v = v[0];
      }
      return v;
    }
    matrix2._size = size2.slice(0);
    matrix2._data = resize(matrix2._data, matrix2._size, defaultValue);
    return matrix2;
  }
  DenseMatrix2.prototype.reshape = function(size2, copy) {
    var m = copy ? this.clone() : this;
    m._data = reshape(m._data, size2);
    var currentLength = m._size.reduce((length, size3) => length * size3);
    m._size = processSizesWildcard(size2, currentLength);
    return m;
  };
  function _fit(matrix2, size2, defaultValue) {
    var newSize = matrix2._size.slice(0);
    var changed = false;
    while (newSize.length < size2.length) {
      newSize.push(0);
      changed = true;
    }
    for (var i = 0, ii = size2.length; i < ii; i++) {
      if (size2[i] > newSize[i]) {
        newSize[i] = size2[i];
        changed = true;
      }
    }
    if (changed) {
      _resize2(matrix2, newSize, defaultValue);
    }
  }
  DenseMatrix2.prototype.clone = function() {
    var m = new DenseMatrix2({
      data: clone(this._data),
      size: clone(this._size),
      datatype: this._datatype
    });
    return m;
  };
  DenseMatrix2.prototype.size = function() {
    return this._size.slice(0);
  };
  DenseMatrix2.prototype.map = function(callback) {
    var me = this;
    var args = maxArgumentCount(callback);
    var recurse = function recurse2(value, index) {
      if (isArray(value)) {
        return value.map(function(child, i) {
          return recurse2(child, index.concat(i));
        });
      } else {
        if (args === 1) {
          return callback(value);
        } else if (args === 2) {
          return callback(value, index);
        } else {
          return callback(value, index, me);
        }
      }
    };
    var data = recurse(this._data, []);
    var datatype = this._datatype !== void 0 ? getArrayDataType(data, typeOf) : void 0;
    return new DenseMatrix2(data, datatype);
  };
  DenseMatrix2.prototype.forEach = function(callback) {
    var me = this;
    var recurse = function recurse2(value, index) {
      if (isArray(value)) {
        value.forEach(function(child, i) {
          recurse2(child, index.concat(i));
        });
      } else {
        callback(value, index, me);
      }
    };
    recurse(this._data, []);
  };
  DenseMatrix2.prototype[Symbol.iterator] = function* () {
    var recurse = function* recurse2(value, index) {
      if (isArray(value)) {
        for (var i = 0; i < value.length; i++) {
          yield* recurse2(value[i], index.concat(i));
        }
      } else {
        yield {
          value,
          index
        };
      }
    };
    yield* recurse(this._data, []);
  };
  DenseMatrix2.prototype.rows = function() {
    var result = [];
    var s = this.size();
    if (s.length !== 2) {
      throw new TypeError("Rows can only be returned for a 2D matrix.");
    }
    var data = this._data;
    for (var row of data) {
      result.push(new DenseMatrix2([row], this._datatype));
    }
    return result;
  };
  DenseMatrix2.prototype.columns = function() {
    var _this = this;
    var result = [];
    var s = this.size();
    if (s.length !== 2) {
      throw new TypeError("Rows can only be returned for a 2D matrix.");
    }
    var data = this._data;
    var _loop = function _loop2(i2) {
      var col = data.map((row) => [row[i2]]);
      result.push(new DenseMatrix2(col, _this._datatype));
    };
    for (var i = 0; i < s[1]; i++) {
      _loop(i);
    }
    return result;
  };
  DenseMatrix2.prototype.toArray = function() {
    return clone(this._data);
  };
  DenseMatrix2.prototype.valueOf = function() {
    return this._data;
  };
  DenseMatrix2.prototype.format = function(options) {
    return format3(this._data, options);
  };
  DenseMatrix2.prototype.toString = function() {
    return format3(this._data);
  };
  DenseMatrix2.prototype.toJSON = function() {
    return {
      mathjs: "DenseMatrix",
      data: this._data,
      size: this._size,
      datatype: this._datatype
    };
  };
  DenseMatrix2.prototype.diagonal = function(k) {
    if (k) {
      if (isBigNumber(k)) {
        k = k.toNumber();
      }
      if (!isNumber(k) || !isInteger(k)) {
        throw new TypeError("The parameter k must be an integer number");
      }
    } else {
      k = 0;
    }
    var kSuper = k > 0 ? k : 0;
    var kSub = k < 0 ? -k : 0;
    var rows = this._size[0];
    var columns = this._size[1];
    var n = Math.min(rows - kSub, columns - kSuper);
    var data = [];
    for (var i = 0; i < n; i++) {
      data[i] = this._data[i + kSub][i + kSuper];
    }
    return new DenseMatrix2({
      data,
      size: [n],
      datatype: this._datatype
    });
  };
  DenseMatrix2.diagonal = function(size2, value, k, defaultValue) {
    if (!isArray(size2)) {
      throw new TypeError("Array expected, size parameter");
    }
    if (size2.length !== 2) {
      throw new Error("Only two dimensions matrix are supported");
    }
    size2 = size2.map(function(s) {
      if (isBigNumber(s)) {
        s = s.toNumber();
      }
      if (!isNumber(s) || !isInteger(s) || s < 1) {
        throw new Error("Size values must be positive integers");
      }
      return s;
    });
    if (k) {
      if (isBigNumber(k)) {
        k = k.toNumber();
      }
      if (!isNumber(k) || !isInteger(k)) {
        throw new TypeError("The parameter k must be an integer number");
      }
    } else {
      k = 0;
    }
    var kSuper = k > 0 ? k : 0;
    var kSub = k < 0 ? -k : 0;
    var rows = size2[0];
    var columns = size2[1];
    var n = Math.min(rows - kSub, columns - kSuper);
    var _value;
    if (isArray(value)) {
      if (value.length !== n) {
        throw new Error("Invalid value array length");
      }
      _value = function _value2(i) {
        return value[i];
      };
    } else if (isMatrix(value)) {
      var ms = value.size();
      if (ms.length !== 1 || ms[0] !== n) {
        throw new Error("Invalid matrix length");
      }
      _value = function _value2(i) {
        return value.get([i]);
      };
    } else {
      _value = function _value2() {
        return value;
      };
    }
    if (!defaultValue) {
      defaultValue = isBigNumber(_value(0)) ? _value(0).mul(0) : 0;
    }
    var data = [];
    if (size2.length > 0) {
      data = resize(data, size2, defaultValue);
      for (var d = 0; d < n; d++) {
        data[d + kSub][d + kSuper] = _value(d);
      }
    }
    return new DenseMatrix2({
      data,
      size: [rows, columns]
    });
  };
  DenseMatrix2.fromJSON = function(json) {
    return new DenseMatrix2(json);
  };
  DenseMatrix2.prototype.swapRows = function(i, j) {
    if (!isNumber(i) || !isInteger(i) || !isNumber(j) || !isInteger(j)) {
      throw new Error("Row index must be positive integers");
    }
    if (this._size.length !== 2) {
      throw new Error("Only two dimensional matrix is supported");
    }
    validateIndex(i, this._size[0]);
    validateIndex(j, this._size[0]);
    DenseMatrix2._swapRows(i, j, this._data);
    return this;
  };
  DenseMatrix2._swapRows = function(i, j, data) {
    var vi = data[i];
    data[i] = data[j];
    data[j] = vi;
  };
  function preprocess(data) {
    if (isMatrix(data)) {
      return preprocess(data.valueOf());
    }
    if (isArray(data)) {
      return data.map(preprocess);
    }
    return data;
  }
  return DenseMatrix2;
}, {
  isClass: true
});

// node_modules/mathjs/lib/esm/utils/collection.js
function deepMap(array, callback, skipZeros) {
  if (array && typeof array.map === "function") {
    return array.map(function(x) {
      return deepMap(x, callback, skipZeros);
    });
  } else {
    return callback(array);
  }
}

// node_modules/mathjs/lib/esm/function/utils/isInteger.js
var name6 = "isInteger";
var dependencies7 = ["typed"];
var createIsInteger = /* @__PURE__ */ factory(name6, dependencies7, (_ref) => {
  var {
    typed: typed2
  } = _ref;
  return typed2(name6, {
    number: isInteger,
    // TODO: what to do with isInteger(add(0.1, 0.2))  ?
    BigNumber: function BigNumber2(x) {
      return x.isInt();
    },
    Fraction: function Fraction3(x) {
      return x.d === 1 && isFinite(x.n);
    },
    "Array | Matrix": typed2.referToSelf((self2) => (x) => deepMap(x, self2))
  });
});

// node_modules/mathjs/lib/esm/plain/number/arithmetic.js
var n1 = "number";
var n2 = "number, number";
function absNumber(a) {
  return Math.abs(a);
}
absNumber.signature = n1;
function addNumber(a, b) {
  return a + b;
}
addNumber.signature = n2;
function subtractNumber(a, b) {
  return a - b;
}
subtractNumber.signature = n2;
function multiplyNumber(a, b) {
  return a * b;
}
multiplyNumber.signature = n2;
function divideNumber(a, b) {
  return a / b;
}
divideNumber.signature = n2;
function unaryMinusNumber(x) {
  return -x;
}
unaryMinusNumber.signature = n1;
function unaryPlusNumber(x) {
  return x;
}
unaryPlusNumber.signature = n1;
function cbrtNumber(x) {
  return cbrt(x);
}
cbrtNumber.signature = n1;
function cubeNumber(x) {
  return x * x * x;
}
cubeNumber.signature = n1;
function expNumber(x) {
  return Math.exp(x);
}
expNumber.signature = n1;
function expm1Number(x) {
  return expm1(x);
}
expm1Number.signature = n1;
function gcdNumber(a, b) {
  if (!isInteger(a) || !isInteger(b)) {
    throw new Error("Parameters in function gcd must be integer numbers");
  }
  var r;
  while (b !== 0) {
    r = a % b;
    a = b;
    b = r;
  }
  return a < 0 ? -a : a;
}
gcdNumber.signature = n2;
function lcmNumber(a, b) {
  if (!isInteger(a) || !isInteger(b)) {
    throw new Error("Parameters in function lcm must be integer numbers");
  }
  if (a === 0 || b === 0) {
    return 0;
  }
  var t;
  var prod = a * b;
  while (b !== 0) {
    t = b;
    b = a % t;
    a = t;
  }
  return Math.abs(prod / a);
}
lcmNumber.signature = n2;
function log10Number(x) {
  return log10(x);
}
log10Number.signature = n1;
function log2Number(x) {
  return log2(x);
}
log2Number.signature = n1;
function log1pNumber(x) {
  return log1p(x);
}
log1pNumber.signature = n1;
function modNumber(x, y) {
  return y === 0 ? x : x - y * Math.floor(x / y);
}
modNumber.signature = n2;
function signNumber(x) {
  return sign(x);
}
signNumber.signature = n1;
function sqrtNumber(x) {
  return Math.sqrt(x);
}
sqrtNumber.signature = n1;
function squareNumber(x) {
  return x * x;
}
squareNumber.signature = n1;
function xgcdNumber(a, b) {
  var t;
  var q;
  var r;
  var x = 0;
  var lastx = 1;
  var y = 1;
  var lasty = 0;
  if (!isInteger(a) || !isInteger(b)) {
    throw new Error("Parameters in function xgcd must be integer numbers");
  }
  while (b) {
    q = Math.floor(a / b);
    r = a - q * b;
    t = x;
    x = lastx - q * x;
    lastx = t;
    t = y;
    y = lasty - q * y;
    lasty = t;
    a = b;
    b = r;
  }
  var res;
  if (a < 0) {
    res = [-a, -lastx, -lasty];
  } else {
    res = [a, a ? lastx : 0, lasty];
  }
  return res;
}
xgcdNumber.signature = n2;
function powNumber(x, y) {
  if (x * x < 1 && y === Infinity || x * x > 1 && y === -Infinity) {
    return 0;
  }
  return Math.pow(x, y);
}
powNumber.signature = n2;
function normNumber(x) {
  return Math.abs(x);
}
normNumber.signature = n1;

// node_modules/mathjs/lib/esm/plain/number/utils.js
var n12 = "number";
function isIntegerNumber(x) {
  return isInteger(x);
}
isIntegerNumber.signature = n12;
function isNegativeNumber(x) {
  return x < 0;
}
isNegativeNumber.signature = n12;
function isPositiveNumber(x) {
  return x > 0;
}
isPositiveNumber.signature = n12;
function isZeroNumber(x) {
  return x === 0;
}
isZeroNumber.signature = n12;
function isNaNNumber(x) {
  return Number.isNaN(x);
}
isNaNNumber.signature = n12;

// node_modules/mathjs/lib/esm/function/utils/isPositive.js
var name7 = "isPositive";
var dependencies8 = ["typed"];
var createIsPositive = /* @__PURE__ */ factory(name7, dependencies8, (_ref) => {
  var {
    typed: typed2
  } = _ref;
  return typed2(name7, {
    number: isPositiveNumber,
    BigNumber: function BigNumber2(x) {
      return !x.isNeg() && !x.isZero() && !x.isNaN();
    },
    Fraction: function Fraction3(x) {
      return x.s > 0 && x.n > 0;
    },
    Unit: typed2.referToSelf((self2) => (x) => typed2.find(self2, x.valueType())(x.value)),
    "Array | Matrix": typed2.referToSelf((self2) => (x) => deepMap(x, self2))
  });
});

// node_modules/mathjs/lib/esm/function/utils/isZero.js
var name8 = "isZero";
var dependencies9 = ["typed"];
var createIsZero = /* @__PURE__ */ factory(name8, dependencies9, (_ref) => {
  var {
    typed: typed2
  } = _ref;
  return typed2(name8, {
    number: isZeroNumber,
    BigNumber: function BigNumber2(x) {
      return x.isZero();
    },
    Complex: function Complex3(x) {
      return x.re === 0 && x.im === 0;
    },
    Fraction: function Fraction3(x) {
      return x.d === 1 && x.n === 0;
    },
    Unit: typed2.referToSelf((self2) => (x) => typed2.find(self2, x.valueType())(x.value)),
    "Array | Matrix": typed2.referToSelf((self2) => (x) => deepMap(x, self2))
  });
});

// node_modules/mathjs/lib/esm/utils/bignumber/nearlyEqual.js
function nearlyEqual2(x, y, epsilon) {
  if (epsilon === null || epsilon === void 0) {
    return x.eq(y);
  }
  if (x.eq(y)) {
    return true;
  }
  if (x.isNaN() || y.isNaN()) {
    return false;
  }
  if (x.isFinite() && y.isFinite()) {
    var diff = x.minus(y).abs();
    if (diff.isZero()) {
      return true;
    } else {
      var max2 = x.constructor.max(x.abs(), y.abs());
      return diff.lte(max2.times(epsilon));
    }
  }
  return false;
}

// node_modules/mathjs/lib/esm/utils/complex.js
function complexEquals(x, y, epsilon) {
  return nearlyEqual(x.re, y.re, epsilon) && nearlyEqual(x.im, y.im, epsilon);
}

// node_modules/mathjs/lib/esm/function/relational/compareUnits.js
var createCompareUnits = /* @__PURE__ */ factory("compareUnits", ["typed"], (_ref) => {
  var {
    typed: typed2
  } = _ref;
  return {
    "Unit, Unit": typed2.referToSelf((self2) => (x, y) => {
      if (!x.equalBase(y)) {
        throw new Error("Cannot compare units with different base");
      }
      return typed2.find(self2, [x.valueType(), y.valueType()])(x.value, y.value);
    })
  };
});

// node_modules/mathjs/lib/esm/function/relational/equalScalar.js
var name9 = "equalScalar";
var dependencies10 = ["typed", "config"];
var createEqualScalar = /* @__PURE__ */ factory(name9, dependencies10, (_ref) => {
  var {
    typed: typed2,
    config: config4
  } = _ref;
  var compareUnits = createCompareUnits({
    typed: typed2
  });
  return typed2(name9, {
    "boolean, boolean": function booleanBoolean(x, y) {
      return x === y;
    },
    "number, number": function numberNumber(x, y) {
      return nearlyEqual(x, y, config4.epsilon);
    },
    "BigNumber, BigNumber": function BigNumberBigNumber(x, y) {
      return x.eq(y) || nearlyEqual2(x, y, config4.epsilon);
    },
    "Fraction, Fraction": function FractionFraction(x, y) {
      return x.equals(y);
    },
    "Complex, Complex": function ComplexComplex(x, y) {
      return complexEquals(x, y, config4.epsilon);
    }
  }, compareUnits);
});
var createEqualScalarNumber = factory(name9, ["typed", "config"], (_ref2) => {
  var {
    typed: typed2,
    config: config4
  } = _ref2;
  return typed2(name9, {
    "number, number": function numberNumber(x, y) {
      return nearlyEqual(x, y, config4.epsilon);
    }
  });
});

// node_modules/mathjs/lib/esm/type/matrix/SparseMatrix.js
var name10 = "SparseMatrix";
var dependencies11 = ["typed", "equalScalar", "Matrix"];
var createSparseMatrixClass = /* @__PURE__ */ factory(name10, dependencies11, (_ref) => {
  var {
    typed: typed2,
    equalScalar: equalScalar2,
    Matrix: Matrix2
  } = _ref;
  function SparseMatrix2(data, datatype) {
    if (!(this instanceof SparseMatrix2)) {
      throw new SyntaxError("Constructor must be called with the new operator");
    }
    if (datatype && !isString(datatype)) {
      throw new Error("Invalid datatype: " + datatype);
    }
    if (isMatrix(data)) {
      _createFromMatrix(this, data, datatype);
    } else if (data && isArray(data.index) && isArray(data.ptr) && isArray(data.size)) {
      this._values = data.values;
      this._index = data.index;
      this._ptr = data.ptr;
      this._size = data.size;
      this._datatype = datatype || data.datatype;
    } else if (isArray(data)) {
      _createFromArray(this, data, datatype);
    } else if (data) {
      throw new TypeError("Unsupported type of data (" + typeOf(data) + ")");
    } else {
      this._values = [];
      this._index = [];
      this._ptr = [0];
      this._size = [0, 0];
      this._datatype = datatype;
    }
  }
  function _createFromMatrix(matrix2, source, datatype) {
    if (source.type === "SparseMatrix") {
      matrix2._values = source._values ? clone(source._values) : void 0;
      matrix2._index = clone(source._index);
      matrix2._ptr = clone(source._ptr);
      matrix2._size = clone(source._size);
      matrix2._datatype = datatype || source._datatype;
    } else {
      _createFromArray(matrix2, source.valueOf(), datatype || source._datatype);
    }
  }
  function _createFromArray(matrix2, data, datatype) {
    matrix2._values = [];
    matrix2._index = [];
    matrix2._ptr = [];
    matrix2._datatype = datatype;
    var rows = data.length;
    var columns = 0;
    var eq = equalScalar2;
    var zero = 0;
    if (isString(datatype)) {
      eq = typed2.find(equalScalar2, [datatype, datatype]) || equalScalar2;
      zero = typed2.convert(0, datatype);
    }
    if (rows > 0) {
      var j = 0;
      do {
        matrix2._ptr.push(matrix2._index.length);
        for (var i = 0; i < rows; i++) {
          var row = data[i];
          if (isArray(row)) {
            if (j === 0 && columns < row.length) {
              columns = row.length;
            }
            if (j < row.length) {
              var v = row[j];
              if (!eq(v, zero)) {
                matrix2._values.push(v);
                matrix2._index.push(i);
              }
            }
          } else {
            if (j === 0 && columns < 1) {
              columns = 1;
            }
            if (!eq(row, zero)) {
              matrix2._values.push(row);
              matrix2._index.push(i);
            }
          }
        }
        j++;
      } while (j < columns);
    }
    matrix2._ptr.push(matrix2._index.length);
    matrix2._size = [rows, columns];
  }
  SparseMatrix2.prototype = new Matrix2();
  SparseMatrix2.prototype.createSparseMatrix = function(data, datatype) {
    return new SparseMatrix2(data, datatype);
  };
  Object.defineProperty(SparseMatrix2, "name", {
    value: "SparseMatrix"
  });
  SparseMatrix2.prototype.constructor = SparseMatrix2;
  SparseMatrix2.prototype.type = "SparseMatrix";
  SparseMatrix2.prototype.isSparseMatrix = true;
  SparseMatrix2.prototype.getDataType = function() {
    return getArrayDataType(this._values, typeOf);
  };
  SparseMatrix2.prototype.storage = function() {
    return "sparse";
  };
  SparseMatrix2.prototype.datatype = function() {
    return this._datatype;
  };
  SparseMatrix2.prototype.create = function(data, datatype) {
    return new SparseMatrix2(data, datatype);
  };
  SparseMatrix2.prototype.density = function() {
    var rows = this._size[0];
    var columns = this._size[1];
    return rows !== 0 && columns !== 0 ? this._index.length / (rows * columns) : 0;
  };
  SparseMatrix2.prototype.subset = function(index, replacement, defaultValue) {
    if (!this._values) {
      throw new Error("Cannot invoke subset on a Pattern only matrix");
    }
    switch (arguments.length) {
      case 1:
        return _getsubset(this, index);
      case 2:
      case 3:
        return _setsubset(this, index, replacement, defaultValue);
      default:
        throw new SyntaxError("Wrong number of arguments");
    }
  };
  function _getsubset(matrix2, idx) {
    if (!isIndex(idx)) {
      throw new TypeError("Invalid index");
    }
    var isScalar = idx.isScalar();
    if (isScalar) {
      return matrix2.get(idx.min());
    }
    var size2 = idx.size();
    if (size2.length !== matrix2._size.length) {
      throw new DimensionError(size2.length, matrix2._size.length);
    }
    var i, ii, k, kk;
    var min2 = idx.min();
    var max2 = idx.max();
    for (i = 0, ii = matrix2._size.length; i < ii; i++) {
      validateIndex(min2[i], matrix2._size[i]);
      validateIndex(max2[i], matrix2._size[i]);
    }
    var mvalues = matrix2._values;
    var mindex = matrix2._index;
    var mptr = matrix2._ptr;
    var rows = idx.dimension(0);
    var columns = idx.dimension(1);
    var w = [];
    var pv = [];
    rows.forEach(function(i2, r) {
      pv[i2] = r[0];
      w[i2] = true;
    });
    var values = mvalues ? [] : void 0;
    var index = [];
    var ptr = [];
    columns.forEach(function(j) {
      ptr.push(index.length);
      for (k = mptr[j], kk = mptr[j + 1]; k < kk; k++) {
        i = mindex[k];
        if (w[i] === true) {
          index.push(pv[i]);
          if (values) {
            values.push(mvalues[k]);
          }
        }
      }
    });
    ptr.push(index.length);
    return new SparseMatrix2({
      values,
      index,
      ptr,
      size: size2,
      datatype: matrix2._datatype
    });
  }
  function _setsubset(matrix2, index, submatrix, defaultValue) {
    if (!index || index.isIndex !== true) {
      throw new TypeError("Invalid index");
    }
    var iSize = index.size();
    var isScalar = index.isScalar();
    var sSize;
    if (isMatrix(submatrix)) {
      sSize = submatrix.size();
      submatrix = submatrix.toArray();
    } else {
      sSize = arraySize(submatrix);
    }
    if (isScalar) {
      if (sSize.length !== 0) {
        throw new TypeError("Scalar expected");
      }
      matrix2.set(index.min(), submatrix, defaultValue);
    } else {
      if (iSize.length !== 1 && iSize.length !== 2) {
        throw new DimensionError(iSize.length, matrix2._size.length, "<");
      }
      if (sSize.length < iSize.length) {
        var i = 0;
        var outer = 0;
        while (iSize[i] === 1 && sSize[i] === 1) {
          i++;
        }
        while (iSize[i] === 1) {
          outer++;
          i++;
        }
        submatrix = unsqueeze(submatrix, iSize.length, outer, sSize);
      }
      if (!deepStrictEqual(iSize, sSize)) {
        throw new DimensionError(iSize, sSize, ">");
      }
      if (iSize.length === 1) {
        var range2 = index.dimension(0);
        range2.forEach(function(dataIndex, subIndex) {
          validateIndex(dataIndex);
          matrix2.set([dataIndex, 0], submatrix[subIndex[0]], defaultValue);
        });
      } else {
        var firstDimensionRange = index.dimension(0);
        var secondDimensionRange = index.dimension(1);
        firstDimensionRange.forEach(function(firstDataIndex, firstSubIndex) {
          validateIndex(firstDataIndex);
          secondDimensionRange.forEach(function(secondDataIndex, secondSubIndex) {
            validateIndex(secondDataIndex);
            matrix2.set([firstDataIndex, secondDataIndex], submatrix[firstSubIndex[0]][secondSubIndex[0]], defaultValue);
          });
        });
      }
    }
    return matrix2;
  }
  SparseMatrix2.prototype.get = function(index) {
    if (!isArray(index)) {
      throw new TypeError("Array expected");
    }
    if (index.length !== this._size.length) {
      throw new DimensionError(index.length, this._size.length);
    }
    if (!this._values) {
      throw new Error("Cannot invoke get on a Pattern only matrix");
    }
    var i = index[0];
    var j = index[1];
    validateIndex(i, this._size[0]);
    validateIndex(j, this._size[1]);
    var k = _getValueIndex(i, this._ptr[j], this._ptr[j + 1], this._index);
    if (k < this._ptr[j + 1] && this._index[k] === i) {
      return this._values[k];
    }
    return 0;
  };
  SparseMatrix2.prototype.set = function(index, v, defaultValue) {
    if (!isArray(index)) {
      throw new TypeError("Array expected");
    }
    if (index.length !== this._size.length) {
      throw new DimensionError(index.length, this._size.length);
    }
    if (!this._values) {
      throw new Error("Cannot invoke set on a Pattern only matrix");
    }
    var i = index[0];
    var j = index[1];
    var rows = this._size[0];
    var columns = this._size[1];
    var eq = equalScalar2;
    var zero = 0;
    if (isString(this._datatype)) {
      eq = typed2.find(equalScalar2, [this._datatype, this._datatype]) || equalScalar2;
      zero = typed2.convert(0, this._datatype);
    }
    if (i > rows - 1 || j > columns - 1) {
      _resize2(this, Math.max(i + 1, rows), Math.max(j + 1, columns), defaultValue);
      rows = this._size[0];
      columns = this._size[1];
    }
    validateIndex(i, rows);
    validateIndex(j, columns);
    var k = _getValueIndex(i, this._ptr[j], this._ptr[j + 1], this._index);
    if (k < this._ptr[j + 1] && this._index[k] === i) {
      if (!eq(v, zero)) {
        this._values[k] = v;
      } else {
        _remove(k, j, this._values, this._index, this._ptr);
      }
    } else {
      if (!eq(v, zero)) {
        _insert(k, i, j, v, this._values, this._index, this._ptr);
      }
    }
    return this;
  };
  function _getValueIndex(i, top, bottom, index) {
    if (bottom - top === 0) {
      return bottom;
    }
    for (var r = top; r < bottom; r++) {
      if (index[r] === i) {
        return r;
      }
    }
    return top;
  }
  function _remove(k, j, values, index, ptr) {
    values.splice(k, 1);
    index.splice(k, 1);
    for (var x = j + 1; x < ptr.length; x++) {
      ptr[x]--;
    }
  }
  function _insert(k, i, j, v, values, index, ptr) {
    values.splice(k, 0, v);
    index.splice(k, 0, i);
    for (var x = j + 1; x < ptr.length; x++) {
      ptr[x]++;
    }
  }
  SparseMatrix2.prototype.resize = function(size2, defaultValue, copy) {
    if (!isCollection(size2)) {
      throw new TypeError("Array or Matrix expected");
    }
    var sizeArray = size2.valueOf().map((value) => {
      return Array.isArray(value) && value.length === 1 ? value[0] : value;
    });
    if (sizeArray.length !== 2) {
      throw new Error("Only two dimensions matrix are supported");
    }
    sizeArray.forEach(function(value) {
      if (!isNumber(value) || !isInteger(value) || value < 0) {
        throw new TypeError("Invalid size, must contain positive integers (size: " + format3(sizeArray) + ")");
      }
    });
    var m = copy ? this.clone() : this;
    return _resize2(m, sizeArray[0], sizeArray[1], defaultValue);
  };
  function _resize2(matrix2, rows, columns, defaultValue) {
    var value = defaultValue || 0;
    var eq = equalScalar2;
    var zero = 0;
    if (isString(matrix2._datatype)) {
      eq = typed2.find(equalScalar2, [matrix2._datatype, matrix2._datatype]) || equalScalar2;
      zero = typed2.convert(0, matrix2._datatype);
      value = typed2.convert(value, matrix2._datatype);
    }
    var ins = !eq(value, zero);
    var r = matrix2._size[0];
    var c = matrix2._size[1];
    var i, j, k;
    if (columns > c) {
      for (j = c; j < columns; j++) {
        matrix2._ptr[j] = matrix2._values.length;
        if (ins) {
          for (i = 0; i < r; i++) {
            matrix2._values.push(value);
            matrix2._index.push(i);
          }
        }
      }
      matrix2._ptr[columns] = matrix2._values.length;
    } else if (columns < c) {
      matrix2._ptr.splice(columns + 1, c - columns);
      matrix2._values.splice(matrix2._ptr[columns], matrix2._values.length);
      matrix2._index.splice(matrix2._ptr[columns], matrix2._index.length);
    }
    c = columns;
    if (rows > r) {
      if (ins) {
        var n = 0;
        for (j = 0; j < c; j++) {
          matrix2._ptr[j] = matrix2._ptr[j] + n;
          k = matrix2._ptr[j + 1] + n;
          var p = 0;
          for (i = r; i < rows; i++, p++) {
            matrix2._values.splice(k + p, 0, value);
            matrix2._index.splice(k + p, 0, i);
            n++;
          }
        }
        matrix2._ptr[c] = matrix2._values.length;
      }
    } else if (rows < r) {
      var d = 0;
      for (j = 0; j < c; j++) {
        matrix2._ptr[j] = matrix2._ptr[j] - d;
        var k0 = matrix2._ptr[j];
        var k1 = matrix2._ptr[j + 1] - d;
        for (k = k0; k < k1; k++) {
          i = matrix2._index[k];
          if (i > rows - 1) {
            matrix2._values.splice(k, 1);
            matrix2._index.splice(k, 1);
            d++;
          }
        }
      }
      matrix2._ptr[j] = matrix2._values.length;
    }
    matrix2._size[0] = rows;
    matrix2._size[1] = columns;
    return matrix2;
  }
  SparseMatrix2.prototype.reshape = function(sizes, copy) {
    if (!isArray(sizes)) {
      throw new TypeError("Array expected");
    }
    if (sizes.length !== 2) {
      throw new Error("Sparse matrices can only be reshaped in two dimensions");
    }
    sizes.forEach(function(value) {
      if (!isNumber(value) || !isInteger(value) || value <= -2 || value === 0) {
        throw new TypeError("Invalid size, must contain positive integers or -1 (size: " + format3(sizes) + ")");
      }
    });
    var currentLength = this._size[0] * this._size[1];
    sizes = processSizesWildcard(sizes, currentLength);
    var newLength = sizes[0] * sizes[1];
    if (currentLength !== newLength) {
      throw new Error("Reshaping sparse matrix will result in the wrong number of elements");
    }
    var m = copy ? this.clone() : this;
    if (this._size[0] === sizes[0] && this._size[1] === sizes[1]) {
      return m;
    }
    var colIndex = [];
    for (var i = 0; i < m._ptr.length; i++) {
      for (var j = 0; j < m._ptr[i + 1] - m._ptr[i]; j++) {
        colIndex.push(i);
      }
    }
    var values = m._values.slice();
    var rowIndex = m._index.slice();
    for (var _i = 0; _i < m._index.length; _i++) {
      var r1 = rowIndex[_i];
      var c1 = colIndex[_i];
      var flat = r1 * m._size[1] + c1;
      colIndex[_i] = flat % sizes[1];
      rowIndex[_i] = Math.floor(flat / sizes[1]);
    }
    m._values.length = 0;
    m._index.length = 0;
    m._ptr.length = sizes[1] + 1;
    m._size = sizes.slice();
    for (var _i2 = 0; _i2 < m._ptr.length; _i2++) {
      m._ptr[_i2] = 0;
    }
    for (var h = 0; h < values.length; h++) {
      var _i3 = rowIndex[h];
      var _j = colIndex[h];
      var v = values[h];
      var k = _getValueIndex(_i3, m._ptr[_j], m._ptr[_j + 1], m._index);
      _insert(k, _i3, _j, v, m._values, m._index, m._ptr);
    }
    return m;
  };
  SparseMatrix2.prototype.clone = function() {
    var m = new SparseMatrix2({
      values: this._values ? clone(this._values) : void 0,
      index: clone(this._index),
      ptr: clone(this._ptr),
      size: clone(this._size),
      datatype: this._datatype
    });
    return m;
  };
  SparseMatrix2.prototype.size = function() {
    return this._size.slice(0);
  };
  SparseMatrix2.prototype.map = function(callback, skipZeros) {
    if (!this._values) {
      throw new Error("Cannot invoke map on a Pattern only matrix");
    }
    var me = this;
    var rows = this._size[0];
    var columns = this._size[1];
    var args = maxArgumentCount(callback);
    var invoke = function invoke2(v, i, j) {
      if (args === 1)
        return callback(v);
      if (args === 2)
        return callback(v, [i, j]);
      return callback(v, [i, j], me);
    };
    return _map(this, 0, rows - 1, 0, columns - 1, invoke, skipZeros);
  };
  function _map(matrix2, minRow, maxRow, minColumn, maxColumn, callback, skipZeros) {
    var values = [];
    var index = [];
    var ptr = [];
    var eq = equalScalar2;
    var zero = 0;
    if (isString(matrix2._datatype)) {
      eq = typed2.find(equalScalar2, [matrix2._datatype, matrix2._datatype]) || equalScalar2;
      zero = typed2.convert(0, matrix2._datatype);
    }
    var invoke = function invoke2(v, x, y) {
      v = callback(v, x, y);
      if (!eq(v, zero)) {
        values.push(v);
        index.push(x);
      }
    };
    for (var j = minColumn; j <= maxColumn; j++) {
      ptr.push(values.length);
      var k0 = matrix2._ptr[j];
      var k1 = matrix2._ptr[j + 1];
      if (skipZeros) {
        for (var k = k0; k < k1; k++) {
          var i = matrix2._index[k];
          if (i >= minRow && i <= maxRow) {
            invoke(matrix2._values[k], i - minRow, j - minColumn);
          }
        }
      } else {
        var _values = {};
        for (var _k = k0; _k < k1; _k++) {
          var _i4 = matrix2._index[_k];
          _values[_i4] = matrix2._values[_k];
        }
        for (var _i5 = minRow; _i5 <= maxRow; _i5++) {
          var value = _i5 in _values ? _values[_i5] : 0;
          invoke(value, _i5 - minRow, j - minColumn);
        }
      }
    }
    ptr.push(values.length);
    return new SparseMatrix2({
      values,
      index,
      ptr,
      size: [maxRow - minRow + 1, maxColumn - minColumn + 1]
    });
  }
  SparseMatrix2.prototype.forEach = function(callback, skipZeros) {
    if (!this._values) {
      throw new Error("Cannot invoke forEach on a Pattern only matrix");
    }
    var me = this;
    var rows = this._size[0];
    var columns = this._size[1];
    for (var j = 0; j < columns; j++) {
      var k0 = this._ptr[j];
      var k1 = this._ptr[j + 1];
      if (skipZeros) {
        for (var k = k0; k < k1; k++) {
          var i = this._index[k];
          callback(this._values[k], [i, j], me);
        }
      } else {
        var values = {};
        for (var _k2 = k0; _k2 < k1; _k2++) {
          var _i6 = this._index[_k2];
          values[_i6] = this._values[_k2];
        }
        for (var _i7 = 0; _i7 < rows; _i7++) {
          var value = _i7 in values ? values[_i7] : 0;
          callback(value, [_i7, j], me);
        }
      }
    }
  };
  SparseMatrix2.prototype[Symbol.iterator] = function* () {
    if (!this._values) {
      throw new Error("Cannot iterate a Pattern only matrix");
    }
    var columns = this._size[1];
    for (var j = 0; j < columns; j++) {
      var k0 = this._ptr[j];
      var k1 = this._ptr[j + 1];
      for (var k = k0; k < k1; k++) {
        var i = this._index[k];
        yield {
          value: this._values[k],
          index: [i, j]
        };
      }
    }
  };
  SparseMatrix2.prototype.toArray = function() {
    return _toArray(this._values, this._index, this._ptr, this._size, true);
  };
  SparseMatrix2.prototype.valueOf = function() {
    return _toArray(this._values, this._index, this._ptr, this._size, false);
  };
  function _toArray(values, index, ptr, size2, copy) {
    var rows = size2[0];
    var columns = size2[1];
    var a = [];
    var i, j;
    for (i = 0; i < rows; i++) {
      a[i] = [];
      for (j = 0; j < columns; j++) {
        a[i][j] = 0;
      }
    }
    for (j = 0; j < columns; j++) {
      var k0 = ptr[j];
      var k1 = ptr[j + 1];
      for (var k = k0; k < k1; k++) {
        i = index[k];
        a[i][j] = values ? copy ? clone(values[k]) : values[k] : 1;
      }
    }
    return a;
  }
  SparseMatrix2.prototype.format = function(options) {
    var rows = this._size[0];
    var columns = this._size[1];
    var density = this.density();
    var str = "Sparse Matrix [" + format3(rows, options) + " x " + format3(columns, options) + "] density: " + format3(density, options) + "\n";
    for (var j = 0; j < columns; j++) {
      var k0 = this._ptr[j];
      var k1 = this._ptr[j + 1];
      for (var k = k0; k < k1; k++) {
        var i = this._index[k];
        str += "\n    (" + format3(i, options) + ", " + format3(j, options) + ") ==> " + (this._values ? format3(this._values[k], options) : "X");
      }
    }
    return str;
  };
  SparseMatrix2.prototype.toString = function() {
    return format3(this.toArray());
  };
  SparseMatrix2.prototype.toJSON = function() {
    return {
      mathjs: "SparseMatrix",
      values: this._values,
      index: this._index,
      ptr: this._ptr,
      size: this._size,
      datatype: this._datatype
    };
  };
  SparseMatrix2.prototype.diagonal = function(k) {
    if (k) {
      if (isBigNumber(k)) {
        k = k.toNumber();
      }
      if (!isNumber(k) || !isInteger(k)) {
        throw new TypeError("The parameter k must be an integer number");
      }
    } else {
      k = 0;
    }
    var kSuper = k > 0 ? k : 0;
    var kSub = k < 0 ? -k : 0;
    var rows = this._size[0];
    var columns = this._size[1];
    var n = Math.min(rows - kSub, columns - kSuper);
    var values = [];
    var index = [];
    var ptr = [];
    ptr[0] = 0;
    for (var j = kSuper; j < columns && values.length < n; j++) {
      var k0 = this._ptr[j];
      var k1 = this._ptr[j + 1];
      for (var x = k0; x < k1; x++) {
        var i = this._index[x];
        if (i === j - kSuper + kSub) {
          values.push(this._values[x]);
          index[values.length - 1] = i - kSub;
          break;
        }
      }
    }
    ptr.push(values.length);
    return new SparseMatrix2({
      values,
      index,
      ptr,
      size: [n, 1]
    });
  };
  SparseMatrix2.fromJSON = function(json) {
    return new SparseMatrix2(json);
  };
  SparseMatrix2.diagonal = function(size2, value, k, defaultValue, datatype) {
    if (!isArray(size2)) {
      throw new TypeError("Array expected, size parameter");
    }
    if (size2.length !== 2) {
      throw new Error("Only two dimensions matrix are supported");
    }
    size2 = size2.map(function(s) {
      if (isBigNumber(s)) {
        s = s.toNumber();
      }
      if (!isNumber(s) || !isInteger(s) || s < 1) {
        throw new Error("Size values must be positive integers");
      }
      return s;
    });
    if (k) {
      if (isBigNumber(k)) {
        k = k.toNumber();
      }
      if (!isNumber(k) || !isInteger(k)) {
        throw new TypeError("The parameter k must be an integer number");
      }
    } else {
      k = 0;
    }
    var eq = equalScalar2;
    var zero = 0;
    if (isString(datatype)) {
      eq = typed2.find(equalScalar2, [datatype, datatype]) || equalScalar2;
      zero = typed2.convert(0, datatype);
    }
    var kSuper = k > 0 ? k : 0;
    var kSub = k < 0 ? -k : 0;
    var rows = size2[0];
    var columns = size2[1];
    var n = Math.min(rows - kSub, columns - kSuper);
    var _value;
    if (isArray(value)) {
      if (value.length !== n) {
        throw new Error("Invalid value array length");
      }
      _value = function _value2(i2) {
        return value[i2];
      };
    } else if (isMatrix(value)) {
      var ms = value.size();
      if (ms.length !== 1 || ms[0] !== n) {
        throw new Error("Invalid matrix length");
      }
      _value = function _value2(i2) {
        return value.get([i2]);
      };
    } else {
      _value = function _value2() {
        return value;
      };
    }
    var values = [];
    var index = [];
    var ptr = [];
    for (var j = 0; j < columns; j++) {
      ptr.push(values.length);
      var i = j - kSuper;
      if (i >= 0 && i < n) {
        var v = _value(i);
        if (!eq(v, zero)) {
          index.push(i + kSub);
          values.push(v);
        }
      }
    }
    ptr.push(values.length);
    return new SparseMatrix2({
      values,
      index,
      ptr,
      size: [rows, columns]
    });
  };
  SparseMatrix2.prototype.swapRows = function(i, j) {
    if (!isNumber(i) || !isInteger(i) || !isNumber(j) || !isInteger(j)) {
      throw new Error("Row index must be positive integers");
    }
    if (this._size.length !== 2) {
      throw new Error("Only two dimensional matrix is supported");
    }
    validateIndex(i, this._size[0]);
    validateIndex(j, this._size[0]);
    SparseMatrix2._swapRows(i, j, this._size[1], this._values, this._index, this._ptr);
    return this;
  };
  SparseMatrix2._forEachRow = function(j, values, index, ptr, callback) {
    var k0 = ptr[j];
    var k1 = ptr[j + 1];
    for (var k = k0; k < k1; k++) {
      callback(index[k], values[k]);
    }
  };
  SparseMatrix2._swapRows = function(x, y, columns, values, index, ptr) {
    for (var j = 0; j < columns; j++) {
      var k0 = ptr[j];
      var k1 = ptr[j + 1];
      var kx = _getValueIndex(x, k0, k1, index);
      var ky = _getValueIndex(y, k0, k1, index);
      if (kx < k1 && ky < k1 && index[kx] === x && index[ky] === y) {
        if (values) {
          var v = values[kx];
          values[kx] = values[ky];
          values[ky] = v;
        }
        continue;
      }
      if (kx < k1 && index[kx] === x && (ky >= k1 || index[ky] !== y)) {
        var vx = values ? values[kx] : void 0;
        index.splice(ky, 0, y);
        if (values) {
          values.splice(ky, 0, vx);
        }
        index.splice(ky <= kx ? kx + 1 : kx, 1);
        if (values) {
          values.splice(ky <= kx ? kx + 1 : kx, 1);
        }
        continue;
      }
      if (ky < k1 && index[ky] === y && (kx >= k1 || index[kx] !== x)) {
        var vy = values ? values[ky] : void 0;
        index.splice(kx, 0, x);
        if (values) {
          values.splice(kx, 0, vy);
        }
        index.splice(kx <= ky ? ky + 1 : ky, 1);
        if (values) {
          values.splice(kx <= ky ? ky + 1 : ky, 1);
        }
      }
    }
  };
  return SparseMatrix2;
}, {
  isClass: true
});

// node_modules/mathjs/lib/esm/type/number.js
var name11 = "number";
var dependencies12 = ["typed"];
function getNonDecimalNumberParts(input) {
  var nonDecimalWithRadixMatch = input.match(/(0[box])([0-9a-fA-F]*)\.([0-9a-fA-F]*)/);
  if (nonDecimalWithRadixMatch) {
    var radix = {
      "0b": 2,
      "0o": 8,
      "0x": 16
    }[nonDecimalWithRadixMatch[1]];
    var integerPart = nonDecimalWithRadixMatch[2];
    var fractionalPart = nonDecimalWithRadixMatch[3];
    return {
      input,
      radix,
      integerPart,
      fractionalPart
    };
  } else {
    return null;
  }
}
function makeNumberFromNonDecimalParts(parts) {
  var n = parseInt(parts.integerPart, parts.radix);
  var f = 0;
  for (var i = 0; i < parts.fractionalPart.length; i++) {
    var digitValue = parseInt(parts.fractionalPart[i], parts.radix);
    f += digitValue / Math.pow(parts.radix, i + 1);
  }
  var result = n + f;
  if (isNaN(result)) {
    throw new SyntaxError('String "' + parts.input + '" is no valid number');
  }
  return result;
}
var createNumber = /* @__PURE__ */ factory(name11, dependencies12, (_ref) => {
  var {
    typed: typed2
  } = _ref;
  var number2 = typed2("number", {
    "": function _() {
      return 0;
    },
    number: function number3(x) {
      return x;
    },
    string: function string(x) {
      if (x === "NaN")
        return NaN;
      var nonDecimalNumberParts = getNonDecimalNumberParts(x);
      if (nonDecimalNumberParts) {
        return makeNumberFromNonDecimalParts(nonDecimalNumberParts);
      }
      var size2 = 0;
      var wordSizeSuffixMatch = x.match(/(0[box][0-9a-fA-F]*)i([0-9]*)/);
      if (wordSizeSuffixMatch) {
        size2 = Number(wordSizeSuffixMatch[2]);
        x = wordSizeSuffixMatch[1];
      }
      var num = Number(x);
      if (isNaN(num)) {
        throw new SyntaxError('String "' + x + '" is no valid number');
      }
      if (wordSizeSuffixMatch) {
        if (num > 2 ** size2 - 1) {
          throw new SyntaxError('String "'.concat(x, '" is out of range'));
        }
        if (num >= 2 ** (size2 - 1)) {
          num = num - 2 ** size2;
        }
      }
      return num;
    },
    BigNumber: function BigNumber2(x) {
      return x.toNumber();
    },
    Fraction: function Fraction3(x) {
      return x.valueOf();
    },
    Unit: typed2.referToSelf((self2) => (x) => {
      var clone4 = x.clone();
      clone4.value = self2(x.value);
      return clone4;
    }),
    null: function _null(x) {
      return 0;
    },
    "Unit, string | Unit": function UnitStringUnit(unit, valuelessUnit) {
      return unit.toNumber(valuelessUnit);
    },
    "Array | Matrix": typed2.referToSelf((self2) => (x) => deepMap(x, self2))
  });
  number2.fromJSON = function(json) {
    return parseFloat(json.value);
  };
  return number2;
});

// node_modules/mathjs/lib/esm/type/bignumber/function/bignumber.js
var name12 = "bignumber";
var dependencies13 = ["typed", "BigNumber"];
var createBignumber = /* @__PURE__ */ factory(name12, dependencies13, (_ref) => {
  var {
    typed: typed2,
    BigNumber: BigNumber2
  } = _ref;
  return typed2("bignumber", {
    "": function _() {
      return new BigNumber2(0);
    },
    number: function number2(x) {
      return new BigNumber2(x + "");
    },
    string: function string(x) {
      var wordSizeSuffixMatch = x.match(/(0[box][0-9a-fA-F]*)i([0-9]*)/);
      if (wordSizeSuffixMatch) {
        var size2 = wordSizeSuffixMatch[2];
        var n = BigNumber2(wordSizeSuffixMatch[1]);
        var twoPowSize = new BigNumber2(2).pow(Number(size2));
        if (n.gt(twoPowSize.sub(1))) {
          throw new SyntaxError('String "'.concat(x, '" is out of range'));
        }
        var twoPowSizeSubOne = new BigNumber2(2).pow(Number(size2) - 1);
        if (n.gte(twoPowSizeSubOne)) {
          return n.sub(twoPowSize);
        } else {
          return n;
        }
      }
      return new BigNumber2(x);
    },
    BigNumber: function BigNumber3(x) {
      return x;
    },
    Unit: typed2.referToSelf((self2) => (x) => {
      var clone4 = x.clone();
      clone4.value = self2(x.value);
      return clone4;
    }),
    Fraction: function Fraction3(x) {
      return new BigNumber2(x.n).div(x.d).times(x.s);
    },
    null: function _null(x) {
      return new BigNumber2(0);
    },
    "Array | Matrix": typed2.referToSelf((self2) => (x) => deepMap(x, self2))
  });
});

// node_modules/mathjs/lib/esm/type/complex/function/complex.js
var name13 = "complex";
var dependencies14 = ["typed", "Complex"];
var createComplex = /* @__PURE__ */ factory(name13, dependencies14, (_ref) => {
  var {
    typed: typed2,
    Complex: Complex3
  } = _ref;
  return typed2("complex", {
    "": function _() {
      return Complex3.ZERO;
    },
    number: function number2(x) {
      return new Complex3(x, 0);
    },
    "number, number": function numberNumber(re2, im2) {
      return new Complex3(re2, im2);
    },
    // TODO: this signature should be redundant
    "BigNumber, BigNumber": function BigNumberBigNumber(re2, im2) {
      return new Complex3(re2.toNumber(), im2.toNumber());
    },
    Fraction: function Fraction3(x) {
      return new Complex3(x.valueOf(), 0);
    },
    Complex: function Complex4(x) {
      return x.clone();
    },
    string: function string(x) {
      return Complex3(x);
    },
    null: function _null(x) {
      return Complex3(0);
    },
    Object: function Object2(x) {
      if ("re" in x && "im" in x) {
        return new Complex3(x.re, x.im);
      }
      if ("r" in x && "phi" in x || "abs" in x && "arg" in x) {
        return new Complex3(x);
      }
      throw new Error("Expected object with properties (re and im) or (r and phi) or (abs and arg)");
    },
    "Array | Matrix": typed2.referToSelf((self2) => (x) => deepMap(x, self2))
  });
});

// node_modules/mathjs/lib/esm/type/fraction/function/fraction.js
var name14 = "fraction";
var dependencies15 = ["typed", "Fraction"];
var createFraction = /* @__PURE__ */ factory(name14, dependencies15, (_ref) => {
  var {
    typed: typed2,
    Fraction: Fraction3
  } = _ref;
  return typed2("fraction", {
    number: function number2(x) {
      if (!isFinite(x) || isNaN(x)) {
        throw new Error(x + " cannot be represented as a fraction");
      }
      return new Fraction3(x);
    },
    string: function string(x) {
      return new Fraction3(x);
    },
    "number, number": function numberNumber(numerator, denominator) {
      return new Fraction3(numerator, denominator);
    },
    null: function _null(x) {
      return new Fraction3(0);
    },
    BigNumber: function BigNumber2(x) {
      return new Fraction3(x.toString());
    },
    Fraction: function Fraction4(x) {
      return x;
    },
    Unit: typed2.referToSelf((self2) => (x) => {
      var clone4 = x.clone();
      clone4.value = self2(x.value);
      return clone4;
    }),
    Object: function Object2(x) {
      return new Fraction3(x);
    },
    "Array | Matrix": typed2.referToSelf((self2) => (x) => deepMap(x, self2))
  });
});

// node_modules/mathjs/lib/esm/type/matrix/function/matrix.js
var name15 = "matrix";
var dependencies16 = ["typed", "Matrix", "DenseMatrix", "SparseMatrix"];
var createMatrix = /* @__PURE__ */ factory(name15, dependencies16, (_ref) => {
  var {
    typed: typed2,
    Matrix: Matrix2,
    DenseMatrix: DenseMatrix2,
    SparseMatrix: SparseMatrix2
  } = _ref;
  return typed2(name15, {
    "": function _() {
      return _create([]);
    },
    string: function string(format4) {
      return _create([], format4);
    },
    "string, string": function stringString(format4, datatype) {
      return _create([], format4, datatype);
    },
    Array: function Array2(data) {
      return _create(data);
    },
    Matrix: function Matrix3(data) {
      return _create(data, data.storage());
    },
    "Array | Matrix, string": _create,
    "Array | Matrix, string, string": _create
  });
  function _create(data, format4, datatype) {
    if (format4 === "dense" || format4 === "default" || format4 === void 0) {
      return new DenseMatrix2(data, datatype);
    }
    if (format4 === "sparse") {
      return new SparseMatrix2(data, datatype);
    }
    throw new TypeError("Unknown matrix type " + JSON.stringify(format4) + ".");
  }
});

// node_modules/mathjs/lib/esm/function/matrix/matrixFromColumns.js
var name16 = "matrixFromColumns";
var dependencies17 = ["typed", "matrix", "flatten", "size"];
var createMatrixFromColumns = /* @__PURE__ */ factory(name16, dependencies17, (_ref) => {
  var {
    typed: typed2,
    matrix: matrix2,
    flatten: flatten3,
    size: size2
  } = _ref;
  return typed2(name16, {
    "...Array": function Array2(arr) {
      return _createArray(arr);
    },
    "...Matrix": function Matrix2(arr) {
      return matrix2(_createArray(arr.map((m) => m.toArray())));
    }
    // TODO implement this properly for SparseMatrix
  });
  function _createArray(arr) {
    if (arr.length === 0)
      throw new TypeError("At least one column is needed to construct a matrix.");
    var N = checkVectorTypeAndReturnLength(arr[0]);
    var result = [];
    for (var i = 0; i < N; i++) {
      result[i] = [];
    }
    for (var col of arr) {
      var colLength = checkVectorTypeAndReturnLength(col);
      if (colLength !== N) {
        throw new TypeError("The vectors had different length: " + (N | 0) + " \u2260 " + (colLength | 0));
      }
      var f = flatten3(col);
      for (var _i = 0; _i < N; _i++) {
        result[_i].push(f[_i]);
      }
    }
    return result;
  }
  function checkVectorTypeAndReturnLength(vec) {
    var s = size2(vec);
    if (s.length === 1) {
      return s[0];
    } else if (s.length === 2) {
      if (s[0] === 1) {
        return s[1];
      } else if (s[1] === 1) {
        return s[0];
      } else {
        throw new TypeError("At least one of the arguments is not a vector.");
      }
    } else {
      throw new TypeError("Only one- or two-dimensional vectors are supported.");
    }
  }
});

// node_modules/mathjs/lib/esm/function/arithmetic/unaryMinus.js
var name17 = "unaryMinus";
var dependencies18 = ["typed"];
var createUnaryMinus = /* @__PURE__ */ factory(name17, dependencies18, (_ref) => {
  var {
    typed: typed2
  } = _ref;
  return typed2(name17, {
    number: unaryMinusNumber,
    "Complex | BigNumber | Fraction": (x) => x.neg(),
    Unit: typed2.referToSelf((self2) => (x) => {
      var res = x.clone();
      res.value = typed2.find(self2, res.valueType())(x.value);
      return res;
    }),
    // deep map collection, skip zeros since unaryMinus(0) = 0
    "Array | Matrix": typed2.referToSelf((self2) => (x) => deepMap(x, self2, true))
    // TODO: add support for string
  });
});

// node_modules/mathjs/lib/esm/function/arithmetic/abs.js
var name18 = "abs";
var dependencies19 = ["typed"];
var createAbs = /* @__PURE__ */ factory(name18, dependencies19, (_ref) => {
  var {
    typed: typed2
  } = _ref;
  return typed2(name18, {
    number: absNumber,
    "Complex | BigNumber | Fraction | Unit": (x) => x.abs(),
    // deep map collection, skip zeros since abs(0) = 0
    "Array | Matrix": typed2.referToSelf((self2) => (x) => deepMap(x, self2, true))
  });
});

// node_modules/mathjs/lib/esm/function/arithmetic/addScalar.js
var name19 = "addScalar";
var dependencies20 = ["typed"];
var createAddScalar = /* @__PURE__ */ factory(name19, dependencies20, (_ref) => {
  var {
    typed: typed2
  } = _ref;
  return typed2(name19, {
    "number, number": addNumber,
    "Complex, Complex": function ComplexComplex(x, y) {
      return x.add(y);
    },
    "BigNumber, BigNumber": function BigNumberBigNumber(x, y) {
      return x.plus(y);
    },
    "Fraction, Fraction": function FractionFraction(x, y) {
      return x.add(y);
    },
    "Unit, Unit": typed2.referToSelf((self2) => (x, y) => {
      if (x.value === null || x.value === void 0) {
        throw new Error("Parameter x contains a unit with undefined value");
      }
      if (y.value === null || y.value === void 0) {
        throw new Error("Parameter y contains a unit with undefined value");
      }
      if (!x.equalBase(y))
        throw new Error("Units do not match");
      var res = x.clone();
      res.value = typed2.find(self2, [res.valueType(), y.valueType()])(res.value, y.value);
      res.fixPrefix = false;
      return res;
    })
  });
});

// node_modules/mathjs/lib/esm/function/arithmetic/subtractScalar.js
var name20 = "subtractScalar";
var dependencies21 = ["typed"];
var createSubtractScalar = /* @__PURE__ */ factory(name20, dependencies21, (_ref) => {
  var {
    typed: typed2
  } = _ref;
  return typed2(name20, {
    "number, number": subtractNumber,
    "Complex, Complex": function ComplexComplex(x, y) {
      return x.sub(y);
    },
    "BigNumber, BigNumber": function BigNumberBigNumber(x, y) {
      return x.minus(y);
    },
    "Fraction, Fraction": function FractionFraction(x, y) {
      return x.sub(y);
    },
    "Unit, Unit": typed2.referToSelf((self2) => (x, y) => {
      if (x.value === null || x.value === void 0) {
        throw new Error("Parameter x contains a unit with undefined value");
      }
      if (y.value === null || y.value === void 0) {
        throw new Error("Parameter y contains a unit with undefined value");
      }
      if (!x.equalBase(y))
        throw new Error("Units do not match");
      var res = x.clone();
      res.value = typed2.find(self2, [res.valueType(), y.valueType()])(res.value, y.value);
      res.fixPrefix = false;
      return res;
    })
  });
});

// node_modules/mathjs/lib/esm/type/matrix/utils/matAlgo11xS0s.js
var name21 = "matAlgo11xS0s";
var dependencies22 = ["typed", "equalScalar"];
var createMatAlgo11xS0s = /* @__PURE__ */ factory(name21, dependencies22, (_ref) => {
  var {
    typed: typed2,
    equalScalar: equalScalar2
  } = _ref;
  return function matAlgo11xS0s(s, b, callback, inverse) {
    var avalues = s._values;
    var aindex = s._index;
    var aptr = s._ptr;
    var asize = s._size;
    var adt = s._datatype;
    if (!avalues) {
      throw new Error("Cannot perform operation on Pattern Sparse Matrix and Scalar value");
    }
    var rows = asize[0];
    var columns = asize[1];
    var dt;
    var eq = equalScalar2;
    var zero = 0;
    var cf = callback;
    if (typeof adt === "string") {
      dt = adt;
      eq = typed2.find(equalScalar2, [dt, dt]);
      zero = typed2.convert(0, dt);
      b = typed2.convert(b, dt);
      cf = typed2.find(callback, [dt, dt]);
    }
    var cvalues = [];
    var cindex = [];
    var cptr = [];
    for (var j = 0; j < columns; j++) {
      cptr[j] = cindex.length;
      for (var k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        var i = aindex[k];
        var v = inverse ? cf(b, avalues[k]) : cf(avalues[k], b);
        if (!eq(v, zero)) {
          cindex.push(i);
          cvalues.push(v);
        }
      }
    }
    cptr[columns] = cindex.length;
    return s.createSparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [rows, columns],
      datatype: dt
    });
  };
});

// node_modules/mathjs/lib/esm/type/matrix/utils/matAlgo12xSfs.js
var name22 = "matAlgo12xSfs";
var dependencies23 = ["typed", "DenseMatrix"];
var createMatAlgo12xSfs = /* @__PURE__ */ factory(name22, dependencies23, (_ref) => {
  var {
    typed: typed2,
    DenseMatrix: DenseMatrix2
  } = _ref;
  return function matAlgo12xSfs(s, b, callback, inverse) {
    var avalues = s._values;
    var aindex = s._index;
    var aptr = s._ptr;
    var asize = s._size;
    var adt = s._datatype;
    if (!avalues) {
      throw new Error("Cannot perform operation on Pattern Sparse Matrix and Scalar value");
    }
    var rows = asize[0];
    var columns = asize[1];
    var dt;
    var cf = callback;
    if (typeof adt === "string") {
      dt = adt;
      b = typed2.convert(b, dt);
      cf = typed2.find(callback, [dt, dt]);
    }
    var cdata = [];
    var x = [];
    var w = [];
    for (var j = 0; j < columns; j++) {
      var mark = j + 1;
      for (var k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        var r = aindex[k];
        x[r] = avalues[k];
        w[r] = mark;
      }
      for (var i = 0; i < rows; i++) {
        if (j === 0) {
          cdata[i] = [];
        }
        if (w[i] === mark) {
          cdata[i][j] = inverse ? cf(b, x[i]) : cf(x[i], b);
        } else {
          cdata[i][j] = inverse ? cf(b, 0) : cf(0, b);
        }
      }
    }
    return new DenseMatrix2({
      data: cdata,
      size: [rows, columns],
      datatype: dt
    });
  };
});

// node_modules/mathjs/lib/esm/type/matrix/utils/matAlgo14xDs.js
var name23 = "matAlgo14xDs";
var dependencies24 = ["typed"];
var createMatAlgo14xDs = /* @__PURE__ */ factory(name23, dependencies24, (_ref) => {
  var {
    typed: typed2
  } = _ref;
  return function matAlgo14xDs(a, b, callback, inverse) {
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype;
    var dt;
    var cf = callback;
    if (typeof adt === "string") {
      dt = adt;
      b = typed2.convert(b, dt);
      cf = typed2.find(callback, [dt, dt]);
    }
    var cdata = asize.length > 0 ? _iterate(cf, 0, asize, asize[0], adata, b, inverse) : [];
    return a.createDenseMatrix({
      data: cdata,
      size: clone(asize),
      datatype: dt
    });
  };
  function _iterate(f, level, s, n, av, bv, inverse) {
    var cv = [];
    if (level === s.length - 1) {
      for (var i = 0; i < n; i++) {
        cv[i] = inverse ? f(bv, av[i]) : f(av[i], bv);
      }
    } else {
      for (var j = 0; j < n; j++) {
        cv[j] = _iterate(f, level + 1, s, s[level + 1], av[j], bv, inverse);
      }
    }
    return cv;
  }
});

// node_modules/mathjs/lib/esm/type/matrix/utils/matAlgo03xDSf.js
var name24 = "matAlgo03xDSf";
var dependencies25 = ["typed"];
var createMatAlgo03xDSf = /* @__PURE__ */ factory(name24, dependencies25, (_ref) => {
  var {
    typed: typed2
  } = _ref;
  return function matAlgo03xDSf(denseMatrix, sparseMatrix, callback, inverse) {
    var adata = denseMatrix._data;
    var asize = denseMatrix._size;
    var adt = denseMatrix._datatype;
    var bvalues = sparseMatrix._values;
    var bindex = sparseMatrix._index;
    var bptr = sparseMatrix._ptr;
    var bsize = sparseMatrix._size;
    var bdt = sparseMatrix._datatype;
    if (asize.length !== bsize.length) {
      throw new DimensionError(asize.length, bsize.length);
    }
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1]) {
      throw new RangeError("Dimension mismatch. Matrix A (" + asize + ") must match Matrix B (" + bsize + ")");
    }
    if (!bvalues) {
      throw new Error("Cannot perform operation on Dense Matrix and Pattern Sparse Matrix");
    }
    var rows = asize[0];
    var columns = asize[1];
    var dt;
    var zero = 0;
    var cf = callback;
    if (typeof adt === "string" && adt === bdt) {
      dt = adt;
      zero = typed2.convert(0, dt);
      cf = typed2.find(callback, [dt, dt]);
    }
    var cdata = [];
    for (var z = 0; z < rows; z++) {
      cdata[z] = [];
    }
    var x = [];
    var w = [];
    for (var j = 0; j < columns; j++) {
      var mark = j + 1;
      for (var k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
        var i = bindex[k];
        x[i] = inverse ? cf(bvalues[k], adata[i][j]) : cf(adata[i][j], bvalues[k]);
        w[i] = mark;
      }
      for (var y = 0; y < rows; y++) {
        if (w[y] === mark) {
          cdata[y][j] = x[y];
        } else {
          cdata[y][j] = inverse ? cf(zero, adata[y][j]) : cf(adata[y][j], zero);
        }
      }
    }
    return denseMatrix.createDenseMatrix({
      data: cdata,
      size: [rows, columns],
      datatype: dt
    });
  };
});

// node_modules/mathjs/lib/esm/type/matrix/utils/matAlgo05xSfSf.js
var name25 = "matAlgo05xSfSf";
var dependencies26 = ["typed", "equalScalar"];
var createMatAlgo05xSfSf = /* @__PURE__ */ factory(name25, dependencies26, (_ref) => {
  var {
    typed: typed2,
    equalScalar: equalScalar2
  } = _ref;
  return function matAlgo05xSfSf(a, b, callback) {
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    var asize = a._size;
    var adt = a._datatype;
    var bvalues = b._values;
    var bindex = b._index;
    var bptr = b._ptr;
    var bsize = b._size;
    var bdt = b._datatype;
    if (asize.length !== bsize.length) {
      throw new DimensionError(asize.length, bsize.length);
    }
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1]) {
      throw new RangeError("Dimension mismatch. Matrix A (" + asize + ") must match Matrix B (" + bsize + ")");
    }
    var rows = asize[0];
    var columns = asize[1];
    var dt;
    var eq = equalScalar2;
    var zero = 0;
    var cf = callback;
    if (typeof adt === "string" && adt === bdt) {
      dt = adt;
      eq = typed2.find(equalScalar2, [dt, dt]);
      zero = typed2.convert(0, dt);
      cf = typed2.find(callback, [dt, dt]);
    }
    var cvalues = avalues && bvalues ? [] : void 0;
    var cindex = [];
    var cptr = [];
    var xa = cvalues ? [] : void 0;
    var xb = cvalues ? [] : void 0;
    var wa = [];
    var wb = [];
    var i, j, k, k1;
    for (j = 0; j < columns; j++) {
      cptr[j] = cindex.length;
      var mark = j + 1;
      for (k = aptr[j], k1 = aptr[j + 1]; k < k1; k++) {
        i = aindex[k];
        cindex.push(i);
        wa[i] = mark;
        if (xa) {
          xa[i] = avalues[k];
        }
      }
      for (k = bptr[j], k1 = bptr[j + 1]; k < k1; k++) {
        i = bindex[k];
        if (wa[i] !== mark) {
          cindex.push(i);
        }
        wb[i] = mark;
        if (xb) {
          xb[i] = bvalues[k];
        }
      }
      if (cvalues) {
        k = cptr[j];
        while (k < cindex.length) {
          i = cindex[k];
          var wai = wa[i];
          var wbi = wb[i];
          if (wai === mark || wbi === mark) {
            var va = wai === mark ? xa[i] : zero;
            var vb = wbi === mark ? xb[i] : zero;
            var vc = cf(va, vb);
            if (!eq(vc, zero)) {
              cvalues.push(vc);
              k++;
            } else {
              cindex.splice(k, 1);
            }
          }
        }
      }
    }
    cptr[columns] = cindex.length;
    return a.createSparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [rows, columns],
      datatype: dt
    });
  };
});

// node_modules/mathjs/lib/esm/type/matrix/utils/matAlgo13xDD.js
var name26 = "matAlgo13xDD";
var dependencies27 = ["typed"];
var createMatAlgo13xDD = /* @__PURE__ */ factory(name26, dependencies27, (_ref) => {
  var {
    typed: typed2
  } = _ref;
  return function matAlgo13xDD(a, b, callback) {
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype;
    var bdata = b._data;
    var bsize = b._size;
    var bdt = b._datatype;
    var csize = [];
    if (asize.length !== bsize.length) {
      throw new DimensionError(asize.length, bsize.length);
    }
    for (var s = 0; s < asize.length; s++) {
      if (asize[s] !== bsize[s]) {
        throw new RangeError("Dimension mismatch. Matrix A (" + asize + ") must match Matrix B (" + bsize + ")");
      }
      csize[s] = asize[s];
    }
    var dt;
    var cf = callback;
    if (typeof adt === "string" && adt === bdt) {
      dt = adt;
      cf = typed2.find(callback, [dt, dt]);
    }
    var cdata = csize.length > 0 ? _iterate(cf, 0, csize, csize[0], adata, bdata) : [];
    return a.createDenseMatrix({
      data: cdata,
      size: csize,
      datatype: dt
    });
  };
  function _iterate(f, level, s, n, av, bv) {
    var cv = [];
    if (level === s.length - 1) {
      for (var i = 0; i < n; i++) {
        cv[i] = f(av[i], bv[i]);
      }
    } else {
      for (var j = 0; j < n; j++) {
        cv[j] = _iterate(f, level + 1, s, s[level + 1], av[j], bv[j]);
      }
    }
    return cv;
  }
});

// node_modules/mathjs/lib/esm/type/matrix/utils/broadcast.js
var name27 = "broadcast";
var dependancies = ["concat"];
var createBroadcast = /* @__PURE__ */ factory(name27, dependancies, (_ref) => {
  var {
    concat: concat3
  } = _ref;
  return function(A, B) {
    var N = Math.max(A._size.length, B._size.length);
    if (A._size.length === B._size.length) {
      if (A._size.every((dim2, i) => dim2 === B._size[i])) {
        return [A, B];
      }
    }
    var sizeA = _padLeft(A._size, N, 0);
    var sizeB = _padLeft(B._size, N, 0);
    var sizeMax = [];
    for (var dim = 0; dim < N; dim++) {
      sizeMax[dim] = Math.max(sizeA[dim], sizeB[dim]);
    }
    checkBroadcastingRules(sizeA, sizeMax);
    checkBroadcastingRules(sizeB, sizeMax);
    var AA = A.clone();
    var BB = B.clone();
    if (AA._size.length < N) {
      AA.reshape(_padLeft(AA._size, N, 1));
    } else if (BB._size.length < N) {
      BB.reshape(_padLeft(BB._size, N, 1));
    }
    for (var _dim = 0; _dim < N; _dim++) {
      if (AA._size[_dim] < sizeMax[_dim]) {
        AA = _stretch(AA, sizeMax[_dim], _dim);
      }
      if (BB._size[_dim] < sizeMax[_dim]) {
        BB = _stretch(BB, sizeMax[_dim], _dim);
      }
    }
    return [AA, BB];
  };
  function _padLeft(shape, N, filler) {
    return [...Array(N - shape.length).fill(filler), ...shape];
  }
  function _stretch(arrayToStretch, sizeToStretch, dimToStretch) {
    return concat3(...Array(sizeToStretch).fill(arrayToStretch), dimToStretch);
  }
});

// node_modules/mathjs/lib/esm/type/matrix/utils/matrixAlgorithmSuite.js
var name28 = "matrixAlgorithmSuite";
var dependencies28 = ["typed", "matrix", "concat"];
var createMatrixAlgorithmSuite = /* @__PURE__ */ factory(name28, dependencies28, (_ref) => {
  var {
    typed: typed2,
    matrix: matrix2,
    concat: concat3
  } = _ref;
  var matAlgo13xDD = createMatAlgo13xDD({
    typed: typed2
  });
  var matAlgo14xDs = createMatAlgo14xDs({
    typed: typed2
  });
  var broadcast = createBroadcast({
    concat: concat3
  });
  return function matrixAlgorithmSuite(options) {
    var elop = options.elop;
    var SD = options.SD || options.DS;
    var matrixSignatures;
    if (elop) {
      matrixSignatures = {
        "DenseMatrix, DenseMatrix": (x, y) => matAlgo13xDD(...broadcast(x, y), elop),
        "Array, Array": (x, y) => matAlgo13xDD(...broadcast(matrix2(x), matrix2(y)), elop).valueOf(),
        "Array, DenseMatrix": (x, y) => matAlgo13xDD(...broadcast(matrix2(x), y), elop),
        "DenseMatrix, Array": (x, y) => matAlgo13xDD(...broadcast(x, matrix2(y)), elop)
      };
      if (options.SS) {
        matrixSignatures["SparseMatrix, SparseMatrix"] = (x, y) => options.SS(...broadcast(x, y), elop, false);
      }
      if (options.DS) {
        matrixSignatures["DenseMatrix, SparseMatrix"] = (x, y) => options.DS(...broadcast(x, y), elop, false);
        matrixSignatures["Array, SparseMatrix"] = (x, y) => options.DS(...broadcast(matrix2(x), y), elop, false);
      }
      if (SD) {
        matrixSignatures["SparseMatrix, DenseMatrix"] = (x, y) => SD(...broadcast(y, x), elop, true);
        matrixSignatures["SparseMatrix, Array"] = (x, y) => SD(...broadcast(matrix2(y), x), elop, true);
      }
    } else {
      matrixSignatures = {
        "DenseMatrix, DenseMatrix": typed2.referToSelf((self2) => (x, y) => {
          return matAlgo13xDD(...broadcast(x, y), self2);
        }),
        "Array, Array": typed2.referToSelf((self2) => (x, y) => {
          return matAlgo13xDD(...broadcast(matrix2(x), matrix2(y)), self2).valueOf();
        }),
        "Array, DenseMatrix": typed2.referToSelf((self2) => (x, y) => {
          return matAlgo13xDD(...broadcast(matrix2(x), y), self2);
        }),
        "DenseMatrix, Array": typed2.referToSelf((self2) => (x, y) => {
          return matAlgo13xDD(...broadcast(x, matrix2(y)), self2);
        })
      };
      if (options.SS) {
        matrixSignatures["SparseMatrix, SparseMatrix"] = typed2.referToSelf((self2) => (x, y) => {
          return options.SS(...broadcast(x, y), self2, false);
        });
      }
      if (options.DS) {
        matrixSignatures["DenseMatrix, SparseMatrix"] = typed2.referToSelf((self2) => (x, y) => {
          return options.DS(...broadcast(x, y), self2, false);
        });
        matrixSignatures["Array, SparseMatrix"] = typed2.referToSelf((self2) => (x, y) => {
          return options.DS(...broadcast(matrix2(x), y), self2, false);
        });
      }
      if (SD) {
        matrixSignatures["SparseMatrix, DenseMatrix"] = typed2.referToSelf((self2) => (x, y) => {
          return SD(...broadcast(y, x), self2, true);
        });
        matrixSignatures["SparseMatrix, Array"] = typed2.referToSelf((self2) => (x, y) => {
          return SD(...broadcast(matrix2(y), x), self2, true);
        });
      }
    }
    var scalar = options.scalar || "any";
    var Ds = options.Ds || options.Ss;
    if (Ds) {
      if (elop) {
        matrixSignatures["DenseMatrix," + scalar] = (x, y) => matAlgo14xDs(x, y, elop, false);
        matrixSignatures[scalar + ", DenseMatrix"] = (x, y) => matAlgo14xDs(y, x, elop, true);
        matrixSignatures["Array," + scalar] = (x, y) => matAlgo14xDs(matrix2(x), y, elop, false).valueOf();
        matrixSignatures[scalar + ", Array"] = (x, y) => matAlgo14xDs(matrix2(y), x, elop, true).valueOf();
      } else {
        matrixSignatures["DenseMatrix," + scalar] = typed2.referToSelf((self2) => (x, y) => {
          return matAlgo14xDs(x, y, self2, false);
        });
        matrixSignatures[scalar + ", DenseMatrix"] = typed2.referToSelf((self2) => (x, y) => {
          return matAlgo14xDs(y, x, self2, true);
        });
        matrixSignatures["Array," + scalar] = typed2.referToSelf((self2) => (x, y) => {
          return matAlgo14xDs(matrix2(x), y, self2, false).valueOf();
        });
        matrixSignatures[scalar + ", Array"] = typed2.referToSelf((self2) => (x, y) => {
          return matAlgo14xDs(matrix2(y), x, self2, true).valueOf();
        });
      }
    }
    var sS = options.sS !== void 0 ? options.sS : options.Ss;
    if (elop) {
      if (options.Ss) {
        matrixSignatures["SparseMatrix," + scalar] = (x, y) => options.Ss(x, y, elop, false);
      }
      if (sS) {
        matrixSignatures[scalar + ", SparseMatrix"] = (x, y) => sS(y, x, elop, true);
      }
    } else {
      if (options.Ss) {
        matrixSignatures["SparseMatrix," + scalar] = typed2.referToSelf((self2) => (x, y) => {
          return options.Ss(x, y, self2, false);
        });
      }
      if (sS) {
        matrixSignatures[scalar + ", SparseMatrix"] = typed2.referToSelf((self2) => (x, y) => {
          return sS(y, x, self2, true);
        });
      }
    }
    if (elop && elop.signatures) {
      extend(matrixSignatures, elop.signatures);
    }
    return matrixSignatures;
  };
});

// node_modules/mathjs/lib/esm/type/matrix/utils/matAlgo01xDSid.js
var name29 = "matAlgo01xDSid";
var dependencies29 = ["typed"];
var createMatAlgo01xDSid = /* @__PURE__ */ factory(name29, dependencies29, (_ref) => {
  var {
    typed: typed2
  } = _ref;
  return function algorithm1(denseMatrix, sparseMatrix, callback, inverse) {
    var adata = denseMatrix._data;
    var asize = denseMatrix._size;
    var adt = denseMatrix._datatype;
    var bvalues = sparseMatrix._values;
    var bindex = sparseMatrix._index;
    var bptr = sparseMatrix._ptr;
    var bsize = sparseMatrix._size;
    var bdt = sparseMatrix._datatype;
    if (asize.length !== bsize.length) {
      throw new DimensionError(asize.length, bsize.length);
    }
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1]) {
      throw new RangeError("Dimension mismatch. Matrix A (" + asize + ") must match Matrix B (" + bsize + ")");
    }
    if (!bvalues) {
      throw new Error("Cannot perform operation on Dense Matrix and Pattern Sparse Matrix");
    }
    var rows = asize[0];
    var columns = asize[1];
    var dt = typeof adt === "string" && adt === bdt ? adt : void 0;
    var cf = dt ? typed2.find(callback, [dt, dt]) : callback;
    var i, j;
    var cdata = [];
    for (i = 0; i < rows; i++) {
      cdata[i] = [];
    }
    var x = [];
    var w = [];
    for (j = 0; j < columns; j++) {
      var mark = j + 1;
      for (var k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
        i = bindex[k];
        x[i] = inverse ? cf(bvalues[k], adata[i][j]) : cf(adata[i][j], bvalues[k]);
        w[i] = mark;
      }
      for (i = 0; i < rows; i++) {
        if (w[i] === mark) {
          cdata[i][j] = x[i];
        } else {
          cdata[i][j] = adata[i][j];
        }
      }
    }
    return denseMatrix.createDenseMatrix({
      data: cdata,
      size: [rows, columns],
      datatype: dt
    });
  };
});

// node_modules/mathjs/lib/esm/type/matrix/utils/matAlgo04xSidSid.js
var name30 = "matAlgo04xSidSid";
var dependencies30 = ["typed", "equalScalar"];
var createMatAlgo04xSidSid = /* @__PURE__ */ factory(name30, dependencies30, (_ref) => {
  var {
    typed: typed2,
    equalScalar: equalScalar2
  } = _ref;
  return function matAlgo04xSidSid(a, b, callback) {
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    var asize = a._size;
    var adt = a._datatype;
    var bvalues = b._values;
    var bindex = b._index;
    var bptr = b._ptr;
    var bsize = b._size;
    var bdt = b._datatype;
    if (asize.length !== bsize.length) {
      throw new DimensionError(asize.length, bsize.length);
    }
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1]) {
      throw new RangeError("Dimension mismatch. Matrix A (" + asize + ") must match Matrix B (" + bsize + ")");
    }
    var rows = asize[0];
    var columns = asize[1];
    var dt;
    var eq = equalScalar2;
    var zero = 0;
    var cf = callback;
    if (typeof adt === "string" && adt === bdt) {
      dt = adt;
      eq = typed2.find(equalScalar2, [dt, dt]);
      zero = typed2.convert(0, dt);
      cf = typed2.find(callback, [dt, dt]);
    }
    var cvalues = avalues && bvalues ? [] : void 0;
    var cindex = [];
    var cptr = [];
    var xa = avalues && bvalues ? [] : void 0;
    var xb = avalues && bvalues ? [] : void 0;
    var wa = [];
    var wb = [];
    var i, j, k, k0, k1;
    for (j = 0; j < columns; j++) {
      cptr[j] = cindex.length;
      var mark = j + 1;
      for (k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        i = aindex[k];
        cindex.push(i);
        wa[i] = mark;
        if (xa) {
          xa[i] = avalues[k];
        }
      }
      for (k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
        i = bindex[k];
        if (wa[i] === mark) {
          if (xa) {
            var v = cf(xa[i], bvalues[k]);
            if (!eq(v, zero)) {
              xa[i] = v;
            } else {
              wa[i] = null;
            }
          }
        } else {
          cindex.push(i);
          wb[i] = mark;
          if (xb) {
            xb[i] = bvalues[k];
          }
        }
      }
      if (xa && xb) {
        k = cptr[j];
        while (k < cindex.length) {
          i = cindex[k];
          if (wa[i] === mark) {
            cvalues[k] = xa[i];
            k++;
          } else if (wb[i] === mark) {
            cvalues[k] = xb[i];
            k++;
          } else {
            cindex.splice(k, 1);
          }
        }
      }
    }
    cptr[columns] = cindex.length;
    return a.createSparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [rows, columns],
      datatype: dt
    });
  };
});

// node_modules/mathjs/lib/esm/type/matrix/utils/matAlgo10xSids.js
var name31 = "matAlgo10xSids";
var dependencies31 = ["typed", "DenseMatrix"];
var createMatAlgo10xSids = /* @__PURE__ */ factory(name31, dependencies31, (_ref) => {
  var {
    typed: typed2,
    DenseMatrix: DenseMatrix2
  } = _ref;
  return function matAlgo10xSids(s, b, callback, inverse) {
    var avalues = s._values;
    var aindex = s._index;
    var aptr = s._ptr;
    var asize = s._size;
    var adt = s._datatype;
    if (!avalues) {
      throw new Error("Cannot perform operation on Pattern Sparse Matrix and Scalar value");
    }
    var rows = asize[0];
    var columns = asize[1];
    var dt;
    var cf = callback;
    if (typeof adt === "string") {
      dt = adt;
      b = typed2.convert(b, dt);
      cf = typed2.find(callback, [dt, dt]);
    }
    var cdata = [];
    var x = [];
    var w = [];
    for (var j = 0; j < columns; j++) {
      var mark = j + 1;
      for (var k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        var r = aindex[k];
        x[r] = avalues[k];
        w[r] = mark;
      }
      for (var i = 0; i < rows; i++) {
        if (j === 0) {
          cdata[i] = [];
        }
        if (w[i] === mark) {
          cdata[i][j] = inverse ? cf(b, x[i]) : cf(x[i], b);
        } else {
          cdata[i][j] = b;
        }
      }
    }
    return new DenseMatrix2({
      data: cdata,
      size: [rows, columns],
      datatype: dt
    });
  };
});

// node_modules/mathjs/lib/esm/function/arithmetic/multiplyScalar.js
var name32 = "multiplyScalar";
var dependencies32 = ["typed"];
var createMultiplyScalar = /* @__PURE__ */ factory(name32, dependencies32, (_ref) => {
  var {
    typed: typed2
  } = _ref;
  return typed2("multiplyScalar", {
    "number, number": multiplyNumber,
    "Complex, Complex": function ComplexComplex(x, y) {
      return x.mul(y);
    },
    "BigNumber, BigNumber": function BigNumberBigNumber(x, y) {
      return x.times(y);
    },
    "Fraction, Fraction": function FractionFraction(x, y) {
      return x.mul(y);
    },
    "number | Fraction | BigNumber | Complex, Unit": (x, y) => y.multiply(x),
    "Unit, number | Fraction | BigNumber | Complex | Unit": (x, y) => x.multiply(y)
  });
});

// node_modules/mathjs/lib/esm/function/arithmetic/multiply.js
var name33 = "multiply";
var dependencies33 = ["typed", "matrix", "addScalar", "multiplyScalar", "equalScalar", "dot"];
var createMultiply = /* @__PURE__ */ factory(name33, dependencies33, (_ref) => {
  var {
    typed: typed2,
    matrix: matrix2,
    addScalar: addScalar2,
    multiplyScalar: multiplyScalar2,
    equalScalar: equalScalar2,
    dot: dot2
  } = _ref;
  var matAlgo11xS0s = createMatAlgo11xS0s({
    typed: typed2,
    equalScalar: equalScalar2
  });
  var matAlgo14xDs = createMatAlgo14xDs({
    typed: typed2
  });
  function _validateMatrixDimensions(size1, size2) {
    switch (size1.length) {
      case 1:
        switch (size2.length) {
          case 1:
            if (size1[0] !== size2[0]) {
              throw new RangeError("Dimension mismatch in multiplication. Vectors must have the same length");
            }
            break;
          case 2:
            if (size1[0] !== size2[0]) {
              throw new RangeError("Dimension mismatch in multiplication. Vector length (" + size1[0] + ") must match Matrix rows (" + size2[0] + ")");
            }
            break;
          default:
            throw new Error("Can only multiply a 1 or 2 dimensional matrix (Matrix B has " + size2.length + " dimensions)");
        }
        break;
      case 2:
        switch (size2.length) {
          case 1:
            if (size1[1] !== size2[0]) {
              throw new RangeError("Dimension mismatch in multiplication. Matrix columns (" + size1[1] + ") must match Vector length (" + size2[0] + ")");
            }
            break;
          case 2:
            if (size1[1] !== size2[0]) {
              throw new RangeError("Dimension mismatch in multiplication. Matrix A columns (" + size1[1] + ") must match Matrix B rows (" + size2[0] + ")");
            }
            break;
          default:
            throw new Error("Can only multiply a 1 or 2 dimensional matrix (Matrix B has " + size2.length + " dimensions)");
        }
        break;
      default:
        throw new Error("Can only multiply a 1 or 2 dimensional matrix (Matrix A has " + size1.length + " dimensions)");
    }
  }
  function _multiplyVectorVector(a, b, n) {
    if (n === 0) {
      throw new Error("Cannot multiply two empty vectors");
    }
    return dot2(a, b);
  }
  function _multiplyVectorMatrix(a, b) {
    if (b.storage() !== "dense") {
      throw new Error("Support for SparseMatrix not implemented");
    }
    return _multiplyVectorDenseMatrix(a, b);
  }
  function _multiplyVectorDenseMatrix(a, b) {
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype;
    var bdata = b._data;
    var bsize = b._size;
    var bdt = b._datatype;
    var alength = asize[0];
    var bcolumns = bsize[1];
    var dt;
    var af = addScalar2;
    var mf = multiplyScalar2;
    if (adt && bdt && adt === bdt && typeof adt === "string") {
      dt = adt;
      af = typed2.find(addScalar2, [dt, dt]);
      mf = typed2.find(multiplyScalar2, [dt, dt]);
    }
    var c = [];
    for (var j = 0; j < bcolumns; j++) {
      var sum2 = mf(adata[0], bdata[0][j]);
      for (var i = 1; i < alength; i++) {
        sum2 = af(sum2, mf(adata[i], bdata[i][j]));
      }
      c[j] = sum2;
    }
    return a.createDenseMatrix({
      data: c,
      size: [bcolumns],
      datatype: dt
    });
  }
  var _multiplyMatrixVector = typed2("_multiplyMatrixVector", {
    "DenseMatrix, any": _multiplyDenseMatrixVector,
    "SparseMatrix, any": _multiplySparseMatrixVector
  });
  var _multiplyMatrixMatrix = typed2("_multiplyMatrixMatrix", {
    "DenseMatrix, DenseMatrix": _multiplyDenseMatrixDenseMatrix,
    "DenseMatrix, SparseMatrix": _multiplyDenseMatrixSparseMatrix,
    "SparseMatrix, DenseMatrix": _multiplySparseMatrixDenseMatrix,
    "SparseMatrix, SparseMatrix": _multiplySparseMatrixSparseMatrix
  });
  function _multiplyDenseMatrixVector(a, b) {
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype;
    var bdata = b._data;
    var bdt = b._datatype;
    var arows = asize[0];
    var acolumns = asize[1];
    var dt;
    var af = addScalar2;
    var mf = multiplyScalar2;
    if (adt && bdt && adt === bdt && typeof adt === "string") {
      dt = adt;
      af = typed2.find(addScalar2, [dt, dt]);
      mf = typed2.find(multiplyScalar2, [dt, dt]);
    }
    var c = [];
    for (var i = 0; i < arows; i++) {
      var row = adata[i];
      var sum2 = mf(row[0], bdata[0]);
      for (var j = 1; j < acolumns; j++) {
        sum2 = af(sum2, mf(row[j], bdata[j]));
      }
      c[i] = sum2;
    }
    return a.createDenseMatrix({
      data: c,
      size: [arows],
      datatype: dt
    });
  }
  function _multiplyDenseMatrixDenseMatrix(a, b) {
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype;
    var bdata = b._data;
    var bsize = b._size;
    var bdt = b._datatype;
    var arows = asize[0];
    var acolumns = asize[1];
    var bcolumns = bsize[1];
    var dt;
    var af = addScalar2;
    var mf = multiplyScalar2;
    if (adt && bdt && adt === bdt && typeof adt === "string") {
      dt = adt;
      af = typed2.find(addScalar2, [dt, dt]);
      mf = typed2.find(multiplyScalar2, [dt, dt]);
    }
    var c = [];
    for (var i = 0; i < arows; i++) {
      var row = adata[i];
      c[i] = [];
      for (var j = 0; j < bcolumns; j++) {
        var sum2 = mf(row[0], bdata[0][j]);
        for (var x = 1; x < acolumns; x++) {
          sum2 = af(sum2, mf(row[x], bdata[x][j]));
        }
        c[i][j] = sum2;
      }
    }
    return a.createDenseMatrix({
      data: c,
      size: [arows, bcolumns],
      datatype: dt
    });
  }
  function _multiplyDenseMatrixSparseMatrix(a, b) {
    var adata = a._data;
    var asize = a._size;
    var adt = a._datatype;
    var bvalues = b._values;
    var bindex = b._index;
    var bptr = b._ptr;
    var bsize = b._size;
    var bdt = b._datatype;
    if (!bvalues) {
      throw new Error("Cannot multiply Dense Matrix times Pattern only Matrix");
    }
    var arows = asize[0];
    var bcolumns = bsize[1];
    var dt;
    var af = addScalar2;
    var mf = multiplyScalar2;
    var eq = equalScalar2;
    var zero = 0;
    if (adt && bdt && adt === bdt && typeof adt === "string") {
      dt = adt;
      af = typed2.find(addScalar2, [dt, dt]);
      mf = typed2.find(multiplyScalar2, [dt, dt]);
      eq = typed2.find(equalScalar2, [dt, dt]);
      zero = typed2.convert(0, dt);
    }
    var cvalues = [];
    var cindex = [];
    var cptr = [];
    var c = b.createSparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, bcolumns],
      datatype: dt
    });
    for (var jb = 0; jb < bcolumns; jb++) {
      cptr[jb] = cindex.length;
      var kb0 = bptr[jb];
      var kb1 = bptr[jb + 1];
      if (kb1 > kb0) {
        var last = 0;
        for (var i = 0; i < arows; i++) {
          var mark = i + 1;
          var cij = void 0;
          for (var kb = kb0; kb < kb1; kb++) {
            var ib = bindex[kb];
            if (last !== mark) {
              cij = mf(adata[i][ib], bvalues[kb]);
              last = mark;
            } else {
              cij = af(cij, mf(adata[i][ib], bvalues[kb]));
            }
          }
          if (last === mark && !eq(cij, zero)) {
            cindex.push(i);
            cvalues.push(cij);
          }
        }
      }
    }
    cptr[bcolumns] = cindex.length;
    return c;
  }
  function _multiplySparseMatrixVector(a, b) {
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    var adt = a._datatype;
    if (!avalues) {
      throw new Error("Cannot multiply Pattern only Matrix times Dense Matrix");
    }
    var bdata = b._data;
    var bdt = b._datatype;
    var arows = a._size[0];
    var brows = b._size[0];
    var cvalues = [];
    var cindex = [];
    var cptr = [];
    var dt;
    var af = addScalar2;
    var mf = multiplyScalar2;
    var eq = equalScalar2;
    var zero = 0;
    if (adt && bdt && adt === bdt && typeof adt === "string") {
      dt = adt;
      af = typed2.find(addScalar2, [dt, dt]);
      mf = typed2.find(multiplyScalar2, [dt, dt]);
      eq = typed2.find(equalScalar2, [dt, dt]);
      zero = typed2.convert(0, dt);
    }
    var x = [];
    var w = [];
    cptr[0] = 0;
    for (var ib = 0; ib < brows; ib++) {
      var vbi = bdata[ib];
      if (!eq(vbi, zero)) {
        for (var ka0 = aptr[ib], ka1 = aptr[ib + 1], ka = ka0; ka < ka1; ka++) {
          var ia = aindex[ka];
          if (!w[ia]) {
            w[ia] = true;
            cindex.push(ia);
            x[ia] = mf(vbi, avalues[ka]);
          } else {
            x[ia] = af(x[ia], mf(vbi, avalues[ka]));
          }
        }
      }
    }
    for (var p1 = cindex.length, p = 0; p < p1; p++) {
      var ic = cindex[p];
      cvalues[p] = x[ic];
    }
    cptr[1] = cindex.length;
    return a.createSparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, 1],
      datatype: dt
    });
  }
  function _multiplySparseMatrixDenseMatrix(a, b) {
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    var adt = a._datatype;
    if (!avalues) {
      throw new Error("Cannot multiply Pattern only Matrix times Dense Matrix");
    }
    var bdata = b._data;
    var bdt = b._datatype;
    var arows = a._size[0];
    var brows = b._size[0];
    var bcolumns = b._size[1];
    var dt;
    var af = addScalar2;
    var mf = multiplyScalar2;
    var eq = equalScalar2;
    var zero = 0;
    if (adt && bdt && adt === bdt && typeof adt === "string") {
      dt = adt;
      af = typed2.find(addScalar2, [dt, dt]);
      mf = typed2.find(multiplyScalar2, [dt, dt]);
      eq = typed2.find(equalScalar2, [dt, dt]);
      zero = typed2.convert(0, dt);
    }
    var cvalues = [];
    var cindex = [];
    var cptr = [];
    var c = a.createSparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, bcolumns],
      datatype: dt
    });
    var x = [];
    var w = [];
    for (var jb = 0; jb < bcolumns; jb++) {
      cptr[jb] = cindex.length;
      var mark = jb + 1;
      for (var ib = 0; ib < brows; ib++) {
        var vbij = bdata[ib][jb];
        if (!eq(vbij, zero)) {
          for (var ka0 = aptr[ib], ka1 = aptr[ib + 1], ka = ka0; ka < ka1; ka++) {
            var ia = aindex[ka];
            if (w[ia] !== mark) {
              w[ia] = mark;
              cindex.push(ia);
              x[ia] = mf(vbij, avalues[ka]);
            } else {
              x[ia] = af(x[ia], mf(vbij, avalues[ka]));
            }
          }
        }
      }
      for (var p0 = cptr[jb], p1 = cindex.length, p = p0; p < p1; p++) {
        var ic = cindex[p];
        cvalues[p] = x[ic];
      }
    }
    cptr[bcolumns] = cindex.length;
    return c;
  }
  function _multiplySparseMatrixSparseMatrix(a, b) {
    var avalues = a._values;
    var aindex = a._index;
    var aptr = a._ptr;
    var adt = a._datatype;
    var bvalues = b._values;
    var bindex = b._index;
    var bptr = b._ptr;
    var bdt = b._datatype;
    var arows = a._size[0];
    var bcolumns = b._size[1];
    var values = avalues && bvalues;
    var dt;
    var af = addScalar2;
    var mf = multiplyScalar2;
    if (adt && bdt && adt === bdt && typeof adt === "string") {
      dt = adt;
      af = typed2.find(addScalar2, [dt, dt]);
      mf = typed2.find(multiplyScalar2, [dt, dt]);
    }
    var cvalues = values ? [] : void 0;
    var cindex = [];
    var cptr = [];
    var c = a.createSparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [arows, bcolumns],
      datatype: dt
    });
    var x = values ? [] : void 0;
    var w = [];
    var ka, ka0, ka1, kb, kb0, kb1, ia, ib;
    for (var jb = 0; jb < bcolumns; jb++) {
      cptr[jb] = cindex.length;
      var mark = jb + 1;
      for (kb0 = bptr[jb], kb1 = bptr[jb + 1], kb = kb0; kb < kb1; kb++) {
        ib = bindex[kb];
        if (values) {
          for (ka0 = aptr[ib], ka1 = aptr[ib + 1], ka = ka0; ka < ka1; ka++) {
            ia = aindex[ka];
            if (w[ia] !== mark) {
              w[ia] = mark;
              cindex.push(ia);
              x[ia] = mf(bvalues[kb], avalues[ka]);
            } else {
              x[ia] = af(x[ia], mf(bvalues[kb], avalues[ka]));
            }
          }
        } else {
          for (ka0 = aptr[ib], ka1 = aptr[ib + 1], ka = ka0; ka < ka1; ka++) {
            ia = aindex[ka];
            if (w[ia] !== mark) {
              w[ia] = mark;
              cindex.push(ia);
            }
          }
        }
      }
      if (values) {
        for (var p0 = cptr[jb], p1 = cindex.length, p = p0; p < p1; p++) {
          var ic = cindex[p];
          cvalues[p] = x[ic];
        }
      }
    }
    cptr[bcolumns] = cindex.length;
    return c;
  }
  return typed2(name33, multiplyScalar2, {
    // we extend the signatures of multiplyScalar with signatures dealing with matrices
    "Array, Array": typed2.referTo("Matrix, Matrix", (selfMM) => (x, y) => {
      _validateMatrixDimensions(arraySize(x), arraySize(y));
      var m = selfMM(matrix2(x), matrix2(y));
      return isMatrix(m) ? m.valueOf() : m;
    }),
    "Matrix, Matrix": function MatrixMatrix(x, y) {
      var xsize = x.size();
      var ysize = y.size();
      _validateMatrixDimensions(xsize, ysize);
      if (xsize.length === 1) {
        if (ysize.length === 1) {
          return _multiplyVectorVector(x, y, xsize[0]);
        }
        return _multiplyVectorMatrix(x, y);
      }
      if (ysize.length === 1) {
        return _multiplyMatrixVector(x, y);
      }
      return _multiplyMatrixMatrix(x, y);
    },
    "Matrix, Array": typed2.referTo("Matrix,Matrix", (selfMM) => (x, y) => selfMM(x, matrix2(y))),
    "Array, Matrix": typed2.referToSelf((self2) => (x, y) => {
      return self2(matrix2(x, y.storage()), y);
    }),
    "SparseMatrix, any": function SparseMatrixAny(x, y) {
      return matAlgo11xS0s(x, y, multiplyScalar2, false);
    },
    "DenseMatrix, any": function DenseMatrixAny(x, y) {
      return matAlgo14xDs(x, y, multiplyScalar2, false);
    },
    "any, SparseMatrix": function anySparseMatrix(x, y) {
      return matAlgo11xS0s(y, x, multiplyScalar2, true);
    },
    "any, DenseMatrix": function anyDenseMatrix(x, y) {
      return matAlgo14xDs(y, x, multiplyScalar2, true);
    },
    "Array, any": function ArrayAny(x, y) {
      return matAlgo14xDs(matrix2(x), y, multiplyScalar2, false).valueOf();
    },
    "any, Array": function anyArray(x, y) {
      return matAlgo14xDs(matrix2(y), x, multiplyScalar2, true).valueOf();
    },
    "any, any": multiplyScalar2,
    "any, any, ...any": typed2.referToSelf((self2) => (x, y, rest) => {
      var result = self2(x, y);
      for (var i = 0; i < rest.length; i++) {
        result = self2(result, rest[i]);
      }
      return result;
    })
  });
});

// node_modules/mathjs/lib/esm/function/arithmetic/sign.js
var name34 = "sign";
var dependencies34 = ["typed", "BigNumber", "Fraction", "complex"];
var createSign = /* @__PURE__ */ factory(name34, dependencies34, (_ref) => {
  var {
    typed: typed2,
    BigNumber: _BigNumber,
    complex: complex2,
    Fraction: _Fraction
  } = _ref;
  return typed2(name34, {
    number: signNumber,
    Complex: function Complex3(x) {
      return x.im === 0 ? complex2(signNumber(x.re)) : x.sign();
    },
    BigNumber: function BigNumber2(x) {
      return new _BigNumber(x.cmp(0));
    },
    Fraction: function Fraction3(x) {
      return new _Fraction(x.s, 1);
    },
    // deep map collection, skip zeros since sign(0) = 0
    "Array | Matrix": typed2.referToSelf((self2) => (x) => deepMap(x, self2, true)),
    Unit: typed2.referToSelf((self2) => (x) => {
      if (!x._isDerived() && x.units[0].unit.offset !== 0) {
        throw new TypeError("sign is ambiguous for units with offset");
      }
      return typed2.find(self2, x.valueType())(x.value);
    })
  });
});

// node_modules/mathjs/lib/esm/function/arithmetic/sqrt.js
var name35 = "sqrt";
var dependencies35 = ["config", "typed", "Complex"];
var createSqrt = /* @__PURE__ */ factory(name35, dependencies35, (_ref) => {
  var {
    config: config4,
    typed: typed2,
    Complex: Complex3
  } = _ref;
  return typed2("sqrt", {
    number: _sqrtNumber,
    Complex: function Complex4(x) {
      return x.sqrt();
    },
    BigNumber: function BigNumber2(x) {
      if (!x.isNegative() || config4.predictable) {
        return x.sqrt();
      } else {
        return _sqrtNumber(x.toNumber());
      }
    },
    Unit: function Unit(x) {
      return x.pow(0.5);
    }
  });
  function _sqrtNumber(x) {
    if (isNaN(x)) {
      return NaN;
    } else if (x >= 0 || config4.predictable) {
      return Math.sqrt(x);
    } else {
      return new Complex3(x, 0).sqrt();
    }
  }
});

// node_modules/mathjs/lib/esm/function/arithmetic/subtract.js
var name36 = "subtract";
var dependencies36 = ["typed", "matrix", "equalScalar", "subtractScalar", "unaryMinus", "DenseMatrix", "concat"];
var createSubtract = /* @__PURE__ */ factory(name36, dependencies36, (_ref) => {
  var {
    typed: typed2,
    matrix: matrix2,
    equalScalar: equalScalar2,
    subtractScalar: subtractScalar2,
    unaryMinus: unaryMinus2,
    DenseMatrix: DenseMatrix2,
    concat: concat3
  } = _ref;
  var matAlgo01xDSid = createMatAlgo01xDSid({
    typed: typed2
  });
  var matAlgo03xDSf = createMatAlgo03xDSf({
    typed: typed2
  });
  var matAlgo05xSfSf = createMatAlgo05xSfSf({
    typed: typed2,
    equalScalar: equalScalar2
  });
  var matAlgo10xSids = createMatAlgo10xSids({
    typed: typed2,
    DenseMatrix: DenseMatrix2
  });
  var matAlgo12xSfs = createMatAlgo12xSfs({
    typed: typed2,
    DenseMatrix: DenseMatrix2
  });
  var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
    typed: typed2,
    matrix: matrix2,
    concat: concat3
  });
  return typed2(name36, {
    "any, any": subtractScalar2
  }, matrixAlgorithmSuite({
    elop: subtractScalar2,
    SS: matAlgo05xSfSf,
    DS: matAlgo01xDSid,
    SD: matAlgo03xDSf,
    Ss: matAlgo12xSfs,
    sS: matAlgo10xSids
  }));
});

// node_modules/mathjs/lib/esm/type/matrix/utils/matAlgo07xSSf.js
var name37 = "matAlgo07xSSf";
var dependencies37 = ["typed", "DenseMatrix"];
var createMatAlgo07xSSf = /* @__PURE__ */ factory(name37, dependencies37, (_ref) => {
  var {
    typed: typed2,
    DenseMatrix: DenseMatrix2
  } = _ref;
  return function matAlgo07xSSf(a, b, callback) {
    var asize = a._size;
    var adt = a._datatype;
    var bsize = b._size;
    var bdt = b._datatype;
    if (asize.length !== bsize.length) {
      throw new DimensionError(asize.length, bsize.length);
    }
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1]) {
      throw new RangeError("Dimension mismatch. Matrix A (" + asize + ") must match Matrix B (" + bsize + ")");
    }
    var rows = asize[0];
    var columns = asize[1];
    var dt;
    var zero = 0;
    var cf = callback;
    if (typeof adt === "string" && adt === bdt) {
      dt = adt;
      zero = typed2.convert(0, dt);
      cf = typed2.find(callback, [dt, dt]);
    }
    var i, j;
    var cdata = [];
    for (i = 0; i < rows; i++) {
      cdata[i] = [];
    }
    var xa = [];
    var xb = [];
    var wa = [];
    var wb = [];
    for (j = 0; j < columns; j++) {
      var mark = j + 1;
      _scatter(a, j, wa, xa, mark);
      _scatter(b, j, wb, xb, mark);
      for (i = 0; i < rows; i++) {
        var va = wa[i] === mark ? xa[i] : zero;
        var vb = wb[i] === mark ? xb[i] : zero;
        cdata[i][j] = cf(va, vb);
      }
    }
    return new DenseMatrix2({
      data: cdata,
      size: [rows, columns],
      datatype: dt
    });
  };
  function _scatter(m, j, w, x, mark) {
    var values = m._values;
    var index = m._index;
    var ptr = m._ptr;
    for (var k = ptr[j], k1 = ptr[j + 1]; k < k1; k++) {
      var i = index[k];
      w[i] = mark;
      x[i] = values[k];
    }
  }
});

// node_modules/mathjs/lib/esm/function/complex/conj.js
var name38 = "conj";
var dependencies38 = ["typed"];
var createConj = /* @__PURE__ */ factory(name38, dependencies38, (_ref) => {
  var {
    typed: typed2
  } = _ref;
  return typed2(name38, {
    "number | BigNumber | Fraction": (x) => x,
    Complex: (x) => x.conjugate(),
    "Array | Matrix": typed2.referToSelf((self2) => (x) => deepMap(x, self2))
  });
});

// node_modules/mathjs/lib/esm/function/complex/im.js
var name39 = "im";
var dependencies39 = ["typed"];
var createIm = /* @__PURE__ */ factory(name39, dependencies39, (_ref) => {
  var {
    typed: typed2
  } = _ref;
  return typed2(name39, {
    number: () => 0,
    "BigNumber | Fraction": (x) => x.mul(0),
    Complex: (x) => x.im,
    "Array | Matrix": typed2.referToSelf((self2) => (x) => deepMap(x, self2))
  });
});

// node_modules/mathjs/lib/esm/function/complex/re.js
var name40 = "re";
var dependencies40 = ["typed"];
var createRe = /* @__PURE__ */ factory(name40, dependencies40, (_ref) => {
  var {
    typed: typed2
  } = _ref;
  return typed2(name40, {
    "number | BigNumber | Fraction": (x) => x,
    Complex: (x) => x.re,
    "Array | Matrix": typed2.referToSelf((self2) => (x) => deepMap(x, self2))
  });
});

// node_modules/mathjs/lib/esm/function/matrix/concat.js
var name41 = "concat";
var dependencies41 = ["typed", "matrix", "isInteger"];
var createConcat = /* @__PURE__ */ factory(name41, dependencies41, (_ref) => {
  var {
    typed: typed2,
    matrix: matrix2,
    isInteger: isInteger3
  } = _ref;
  return typed2(name41, {
    // TODO: change signature to '...Array | Matrix, dim?' when supported
    "...Array | Matrix | number | BigNumber": function ArrayMatrixNumberBigNumber(args) {
      var i;
      var len = args.length;
      var dim = -1;
      var prevDim;
      var asMatrix = false;
      var matrices = [];
      for (i = 0; i < len; i++) {
        var arg = args[i];
        if (isMatrix(arg)) {
          asMatrix = true;
        }
        if (isNumber(arg) || isBigNumber(arg)) {
          if (i !== len - 1) {
            throw new Error("Dimension must be specified as last argument");
          }
          prevDim = dim;
          dim = arg.valueOf();
          if (!isInteger3(dim)) {
            throw new TypeError("Integer number expected for dimension");
          }
          if (dim < 0 || i > 0 && dim > prevDim) {
            throw new IndexError(dim, prevDim + 1);
          }
        } else {
          var m = clone(arg).valueOf();
          var size2 = arraySize(m);
          matrices[i] = m;
          prevDim = dim;
          dim = size2.length - 1;
          if (i > 0 && dim !== prevDim) {
            throw new DimensionError(prevDim + 1, dim + 1);
          }
        }
      }
      if (matrices.length === 0) {
        throw new SyntaxError("At least one matrix expected");
      }
      var res = matrices.shift();
      while (matrices.length) {
        res = concat(res, matrices.shift(), dim);
      }
      return asMatrix ? matrix2(res) : res;
    },
    "...string": function string(args) {
      return args.join("");
    }
  });
});

// node_modules/mathjs/lib/esm/function/matrix/column.js
var name42 = "column";
var dependencies42 = ["typed", "Index", "matrix", "range"];
var createColumn = /* @__PURE__ */ factory(name42, dependencies42, (_ref) => {
  var {
    typed: typed2,
    Index: Index2,
    matrix: matrix2,
    range: range2
  } = _ref;
  return typed2(name42, {
    "Matrix, number": _column,
    "Array, number": function ArrayNumber(value, column2) {
      return _column(matrix2(clone(value)), column2).valueOf();
    }
  });
  function _column(value, column2) {
    if (value.size().length !== 2) {
      throw new Error("Only two dimensional matrix is supported");
    }
    validateIndex(column2, value.size()[1]);
    var rowRange = range2(0, value.size()[0]);
    var index = new Index2(rowRange, column2);
    var result = value.subset(index);
    return isMatrix(result) ? result : matrix2([[result]]);
  }
});

// node_modules/mathjs/lib/esm/function/matrix/diag.js
var name43 = "diag";
var dependencies43 = ["typed", "matrix", "DenseMatrix", "SparseMatrix"];
var createDiag = /* @__PURE__ */ factory(name43, dependencies43, (_ref) => {
  var {
    typed: typed2,
    matrix: matrix2,
    DenseMatrix: DenseMatrix2,
    SparseMatrix: SparseMatrix2
  } = _ref;
  return typed2(name43, {
    // FIXME: simplify this huge amount of signatures as soon as typed-function supports optional arguments
    Array: function Array2(x) {
      return _diag(x, 0, arraySize(x), null);
    },
    "Array, number": function ArrayNumber(x, k) {
      return _diag(x, k, arraySize(x), null);
    },
    "Array, BigNumber": function ArrayBigNumber(x, k) {
      return _diag(x, k.toNumber(), arraySize(x), null);
    },
    "Array, string": function ArrayString(x, format4) {
      return _diag(x, 0, arraySize(x), format4);
    },
    "Array, number, string": function ArrayNumberString(x, k, format4) {
      return _diag(x, k, arraySize(x), format4);
    },
    "Array, BigNumber, string": function ArrayBigNumberString(x, k, format4) {
      return _diag(x, k.toNumber(), arraySize(x), format4);
    },
    Matrix: function Matrix2(x) {
      return _diag(x, 0, x.size(), x.storage());
    },
    "Matrix, number": function MatrixNumber(x, k) {
      return _diag(x, k, x.size(), x.storage());
    },
    "Matrix, BigNumber": function MatrixBigNumber(x, k) {
      return _diag(x, k.toNumber(), x.size(), x.storage());
    },
    "Matrix, string": function MatrixString(x, format4) {
      return _diag(x, 0, x.size(), format4);
    },
    "Matrix, number, string": function MatrixNumberString(x, k, format4) {
      return _diag(x, k, x.size(), format4);
    },
    "Matrix, BigNumber, string": function MatrixBigNumberString(x, k, format4) {
      return _diag(x, k.toNumber(), x.size(), format4);
    }
  });
  function _diag(x, k, size2, format4) {
    if (!isInteger(k)) {
      throw new TypeError("Second parameter in function diag must be an integer");
    }
    var kSuper = k > 0 ? k : 0;
    var kSub = k < 0 ? -k : 0;
    switch (size2.length) {
      case 1:
        return _createDiagonalMatrix(x, k, format4, size2[0], kSub, kSuper);
      case 2:
        return _getDiagonal(x, k, format4, size2, kSub, kSuper);
    }
    throw new RangeError("Matrix for function diag must be 2 dimensional");
  }
  function _createDiagonalMatrix(x, k, format4, l, kSub, kSuper) {
    var ms = [l + kSub, l + kSuper];
    if (format4 && format4 !== "sparse" && format4 !== "dense") {
      throw new TypeError("Unknown matrix type ".concat(format4, '"'));
    }
    var m = format4 === "sparse" ? SparseMatrix2.diagonal(ms, x, k) : DenseMatrix2.diagonal(ms, x, k);
    return format4 !== null ? m : m.valueOf();
  }
  function _getDiagonal(x, k, format4, s, kSub, kSuper) {
    if (isMatrix(x)) {
      var dm = x.diagonal(k);
      if (format4 !== null) {
        if (format4 !== dm.storage()) {
          return matrix2(dm, format4);
        }
        return dm;
      }
      return dm.valueOf();
    }
    var n = Math.min(s[0] - kSub, s[1] - kSuper);
    var vector = [];
    for (var i = 0; i < n; i++) {
      vector[i] = x[i + kSub][i + kSuper];
    }
    return format4 !== null ? matrix2(vector) : vector;
  }
});

// node_modules/mathjs/lib/esm/function/matrix/flatten.js
var name44 = "flatten";
var dependencies44 = ["typed", "matrix"];
var createFlatten = /* @__PURE__ */ factory(name44, dependencies44, (_ref) => {
  var {
    typed: typed2,
    matrix: matrix2
  } = _ref;
  return typed2(name44, {
    Array: function Array2(x) {
      return flatten(x);
    },
    Matrix: function Matrix2(x) {
      var flat = flatten(x.toArray());
      return matrix2(flat);
    }
  });
});

// node_modules/mathjs/lib/esm/function/matrix/getMatrixDataType.js
var name45 = "getMatrixDataType";
var dependencies45 = ["typed"];
var createGetMatrixDataType = /* @__PURE__ */ factory(name45, dependencies45, (_ref) => {
  var {
    typed: typed2
  } = _ref;
  return typed2(name45, {
    Array: function Array2(x) {
      return getArrayDataType(x, typeOf);
    },
    Matrix: function Matrix2(x) {
      return x.getDataType();
    }
  });
});

// node_modules/mathjs/lib/esm/function/matrix/identity.js
var name46 = "identity";
var dependencies46 = ["typed", "config", "matrix", "BigNumber", "DenseMatrix", "SparseMatrix"];
var createIdentity = /* @__PURE__ */ factory(name46, dependencies46, (_ref) => {
  var {
    typed: typed2,
    config: config4,
    matrix: matrix2,
    BigNumber: BigNumber2,
    DenseMatrix: DenseMatrix2,
    SparseMatrix: SparseMatrix2
  } = _ref;
  return typed2(name46, {
    "": function _() {
      return config4.matrix === "Matrix" ? matrix2([]) : [];
    },
    string: function string(format4) {
      return matrix2(format4);
    },
    "number | BigNumber": function numberBigNumber(rows) {
      return _identity(rows, rows, config4.matrix === "Matrix" ? "dense" : void 0);
    },
    "number | BigNumber, string": function numberBigNumberString(rows, format4) {
      return _identity(rows, rows, format4);
    },
    "number | BigNumber, number | BigNumber": function numberBigNumberNumberBigNumber(rows, cols) {
      return _identity(rows, cols, config4.matrix === "Matrix" ? "dense" : void 0);
    },
    "number | BigNumber, number | BigNumber, string": function numberBigNumberNumberBigNumberString(rows, cols, format4) {
      return _identity(rows, cols, format4);
    },
    Array: function Array2(size2) {
      return _identityVector(size2);
    },
    "Array, string": function ArrayString(size2, format4) {
      return _identityVector(size2, format4);
    },
    Matrix: function Matrix2(size2) {
      return _identityVector(size2.valueOf(), size2.storage());
    },
    "Matrix, string": function MatrixString(size2, format4) {
      return _identityVector(size2.valueOf(), format4);
    }
  });
  function _identityVector(size2, format4) {
    switch (size2.length) {
      case 0:
        return format4 ? matrix2(format4) : [];
      case 1:
        return _identity(size2[0], size2[0], format4);
      case 2:
        return _identity(size2[0], size2[1], format4);
      default:
        throw new Error("Vector containing two values expected");
    }
  }
  function _identity(rows, cols, format4) {
    var Big = isBigNumber(rows) || isBigNumber(cols) ? BigNumber2 : null;
    if (isBigNumber(rows))
      rows = rows.toNumber();
    if (isBigNumber(cols))
      cols = cols.toNumber();
    if (!isInteger(rows) || rows < 1) {
      throw new Error("Parameters in function identity must be positive integers");
    }
    if (!isInteger(cols) || cols < 1) {
      throw new Error("Parameters in function identity must be positive integers");
    }
    var one = Big ? new BigNumber2(1) : 1;
    var defaultValue = Big ? new Big(0) : 0;
    var size2 = [rows, cols];
    if (format4) {
      if (format4 === "sparse") {
        return SparseMatrix2.diagonal(size2, one, 0, defaultValue);
      }
      if (format4 === "dense") {
        return DenseMatrix2.diagonal(size2, one, 0, defaultValue);
      }
      throw new TypeError('Unknown matrix type "'.concat(format4, '"'));
    }
    var res = resize([], size2, defaultValue);
    var minimum = rows < cols ? rows : cols;
    for (var d = 0; d < minimum; d++) {
      res[d][d] = one;
    }
    return res;
  }
});

// node_modules/mathjs/lib/esm/utils/noop.js
function noBignumber() {
  throw new Error('No "bignumber" implementation available');
}
function noFraction() {
  throw new Error('No "fraction" implementation available');
}
function noMatrix() {
  throw new Error('No "matrix" implementation available');
}

// node_modules/mathjs/lib/esm/function/matrix/range.js
var name47 = "range";
var dependencies47 = ["typed", "config", "?matrix", "?bignumber", "smaller", "smallerEq", "larger", "largerEq", "add", "isPositive"];
var createRange = /* @__PURE__ */ factory(name47, dependencies47, (_ref) => {
  var {
    typed: typed2,
    config: config4,
    matrix: matrix2,
    bignumber: bignumber2,
    smaller: smaller2,
    smallerEq: smallerEq2,
    larger: larger2,
    largerEq: largerEq2,
    add: add3,
    isPositive: isPositive2
  } = _ref;
  return typed2(name47, {
    // TODO: simplify signatures when typed-function supports default values and optional arguments
    // TODO: a number or boolean should not be converted to string here
    string: _strRange,
    "string, boolean": _strRange,
    "number, number": function numberNumber(start, end) {
      return _out(_range(start, end, 1, false));
    },
    "number, number, number": function numberNumberNumber(start, end, step) {
      return _out(_range(start, end, step, false));
    },
    "number, number, boolean": function numberNumberBoolean(start, end, includeEnd) {
      return _out(_range(start, end, 1, includeEnd));
    },
    "number, number, number, boolean": function numberNumberNumberBoolean(start, end, step, includeEnd) {
      return _out(_range(start, end, step, includeEnd));
    },
    "BigNumber, BigNumber": function BigNumberBigNumber(start, end) {
      var BigNumber2 = start.constructor;
      return _out(_range(start, end, new BigNumber2(1), false));
    },
    "BigNumber, BigNumber, BigNumber": function BigNumberBigNumberBigNumber(start, end, step) {
      return _out(_range(start, end, step, false));
    },
    "BigNumber, BigNumber, boolean": function BigNumberBigNumberBoolean(start, end, includeEnd) {
      var BigNumber2 = start.constructor;
      return _out(_range(start, end, new BigNumber2(1), includeEnd));
    },
    "BigNumber, BigNumber, BigNumber, boolean": function BigNumberBigNumberBigNumberBoolean(start, end, step, includeEnd) {
      return _out(_range(start, end, step, includeEnd));
    },
    "Unit, Unit, Unit": function UnitUnitUnit(start, end, step) {
      return _out(_range(start, end, step, false));
    },
    "Unit, Unit, Unit, boolean": function UnitUnitUnitBoolean(start, end, step, includeEnd) {
      return _out(_range(start, end, step, includeEnd));
    }
  });
  function _out(arr) {
    if (config4.matrix === "Matrix") {
      return matrix2 ? matrix2(arr) : noMatrix();
    }
    return arr;
  }
  function _strRange(str, includeEnd) {
    var r = _parse(str);
    if (!r) {
      throw new SyntaxError('String "' + str + '" is no valid range');
    }
    if (config4.number === "BigNumber") {
      if (bignumber2 === void 0) {
        noBignumber();
      }
      return _out(_range(bignumber2(r.start), bignumber2(r.end), bignumber2(r.step)), includeEnd);
    } else {
      return _out(_range(r.start, r.end, r.step, includeEnd));
    }
  }
  function _range(start, end, step, includeEnd) {
    var array = [];
    var ongoing = isPositive2(step) ? includeEnd ? smallerEq2 : smaller2 : includeEnd ? largerEq2 : larger2;
    var x = start;
    while (ongoing(x, end)) {
      array.push(x);
      x = add3(x, step);
    }
    return array;
  }
  function _parse(str) {
    var args = str.split(":");
    var nums = args.map(function(arg) {
      return Number(arg);
    });
    var invalid = nums.some(function(num) {
      return isNaN(num);
    });
    if (invalid) {
      return null;
    }
    switch (nums.length) {
      case 2:
        return {
          start: nums[0],
          end: nums[1],
          step: 1
        };
      case 3:
        return {
          start: nums[0],
          end: nums[2],
          step: nums[1]
        };
      default:
        return null;
    }
  }
});

// node_modules/mathjs/lib/esm/function/matrix/size.js
var name48 = "size";
var dependencies48 = ["typed", "config", "?matrix"];
var createSize = /* @__PURE__ */ factory(name48, dependencies48, (_ref) => {
  var {
    typed: typed2,
    config: config4,
    matrix: matrix2
  } = _ref;
  return typed2(name48, {
    Matrix: function Matrix2(x) {
      return x.create(x.size());
    },
    Array: arraySize,
    string: function string(x) {
      return config4.matrix === "Array" ? [x.length] : matrix2([x.length]);
    },
    "number | Complex | BigNumber | Unit | boolean | null": function numberComplexBigNumberUnitBooleanNull(x) {
      return config4.matrix === "Array" ? [] : matrix2 ? matrix2([]) : noMatrix();
    }
  });
});

// node_modules/mathjs/lib/esm/function/matrix/transpose.js
var name49 = "transpose";
var dependencies49 = ["typed", "matrix"];
var createTranspose = /* @__PURE__ */ factory(name49, dependencies49, (_ref) => {
  var {
    typed: typed2,
    matrix: matrix2
  } = _ref;
  return typed2(name49, {
    Array: (x) => transposeMatrix(matrix2(x)).valueOf(),
    Matrix: transposeMatrix,
    any: clone
    // scalars
  });
  function transposeMatrix(x) {
    var size2 = x.size();
    var c;
    switch (size2.length) {
      case 1:
        c = x.clone();
        break;
      case 2:
        {
          var rows = size2[0];
          var columns = size2[1];
          if (columns === 0) {
            throw new RangeError("Cannot transpose a 2D matrix with no columns (size: " + format3(size2) + ")");
          }
          switch (x.storage()) {
            case "dense":
              c = _denseTranspose(x, rows, columns);
              break;
            case "sparse":
              c = _sparseTranspose(x, rows, columns);
              break;
          }
        }
        break;
      default:
        throw new RangeError("Matrix must be a vector or two dimensional (size: " + format3(size2) + ")");
    }
    return c;
  }
  function _denseTranspose(m, rows, columns) {
    var data = m._data;
    var transposed = [];
    var transposedRow;
    for (var j = 0; j < columns; j++) {
      transposedRow = transposed[j] = [];
      for (var i = 0; i < rows; i++) {
        transposedRow[i] = clone(data[i][j]);
      }
    }
    return m.createDenseMatrix({
      data: transposed,
      size: [columns, rows],
      datatype: m._datatype
    });
  }
  function _sparseTranspose(m, rows, columns) {
    var values = m._values;
    var index = m._index;
    var ptr = m._ptr;
    var cvalues = values ? [] : void 0;
    var cindex = [];
    var cptr = [];
    var w = [];
    for (var x = 0; x < rows; x++) {
      w[x] = 0;
    }
    var p, l, j;
    for (p = 0, l = index.length; p < l; p++) {
      w[index[p]]++;
    }
    var sum2 = 0;
    for (var i = 0; i < rows; i++) {
      cptr.push(sum2);
      sum2 += w[i];
      w[i] = cptr[i];
    }
    cptr.push(sum2);
    for (j = 0; j < columns; j++) {
      for (var k0 = ptr[j], k1 = ptr[j + 1], k = k0; k < k1; k++) {
        var q = w[index[k]]++;
        cindex[q] = j;
        if (values) {
          cvalues[q] = clone(values[k]);
        }
      }
    }
    return m.createSparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [columns, rows],
      datatype: m._datatype
    });
  }
});

// node_modules/mathjs/lib/esm/function/matrix/ctranspose.js
var name50 = "ctranspose";
var dependencies50 = ["typed", "transpose", "conj"];
var createCtranspose = /* @__PURE__ */ factory(name50, dependencies50, (_ref) => {
  var {
    typed: typed2,
    transpose: transpose2,
    conj: conj2
  } = _ref;
  return typed2(name50, {
    any: function any(x) {
      return conj2(transpose2(x));
    }
  });
});

// node_modules/mathjs/lib/esm/function/matrix/zeros.js
var name51 = "zeros";
var dependencies51 = ["typed", "config", "matrix", "BigNumber"];
var createZeros = /* @__PURE__ */ factory(name51, dependencies51, (_ref) => {
  var {
    typed: typed2,
    config: config4,
    matrix: matrix2,
    BigNumber: BigNumber2
  } = _ref;
  return typed2(name51, {
    "": function _() {
      return config4.matrix === "Array" ? _zeros([]) : _zeros([], "default");
    },
    // math.zeros(m, n, p, ..., format)
    // TODO: more accurate signature '...number | BigNumber, string' as soon as typed-function supports this
    "...number | BigNumber | string": function numberBigNumberString(size2) {
      var last = size2[size2.length - 1];
      if (typeof last === "string") {
        var format4 = size2.pop();
        return _zeros(size2, format4);
      } else if (config4.matrix === "Array") {
        return _zeros(size2);
      } else {
        return _zeros(size2, "default");
      }
    },
    Array: _zeros,
    Matrix: function Matrix2(size2) {
      var format4 = size2.storage();
      return _zeros(size2.valueOf(), format4);
    },
    "Array | Matrix, string": function ArrayMatrixString(size2, format4) {
      return _zeros(size2.valueOf(), format4);
    }
  });
  function _zeros(size2, format4) {
    var hasBigNumbers = _normalize(size2);
    var defaultValue = hasBigNumbers ? new BigNumber2(0) : 0;
    _validate2(size2);
    if (format4) {
      var m = matrix2(format4);
      if (size2.length > 0) {
        return m.resize(size2, defaultValue);
      }
      return m;
    } else {
      var arr = [];
      if (size2.length > 0) {
        return resize(arr, size2, defaultValue);
      }
      return arr;
    }
  }
  function _normalize(size2) {
    var hasBigNumbers = false;
    size2.forEach(function(value, index, arr) {
      if (isBigNumber(value)) {
        hasBigNumbers = true;
        arr[index] = value.toNumber();
      }
    });
    return hasBigNumbers;
  }
  function _validate2(size2) {
    size2.forEach(function(value) {
      if (typeof value !== "number" || !isInteger(value) || value < 0) {
        throw new Error("Parameters in function zeros must be positive integers");
      }
    });
  }
});

// node_modules/mathjs/lib/esm/function/utils/numeric.js
var name52 = "numeric";
var dependencies52 = ["number", "?bignumber", "?fraction"];
var createNumeric = /* @__PURE__ */ factory(name52, dependencies52, (_ref) => {
  var {
    number: _number,
    bignumber: bignumber2,
    fraction: fraction2
  } = _ref;
  var validInputTypes = {
    string: true,
    number: true,
    BigNumber: true,
    Fraction: true
  };
  var validOutputTypes = {
    number: (x) => _number(x),
    BigNumber: bignumber2 ? (x) => bignumber2(x) : noBignumber,
    Fraction: fraction2 ? (x) => fraction2(x) : noFraction
  };
  return function numeric2(value) {
    var outputType = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "number";
    var check = arguments.length > 2 ? arguments[2] : void 0;
    if (check !== void 0) {
      throw new SyntaxError("numeric() takes one or two arguments");
    }
    var inputType = typeOf(value);
    if (!(inputType in validInputTypes)) {
      throw new TypeError("Cannot convert " + value + ' of type "' + inputType + '"; valid input types are ' + Object.keys(validInputTypes).join(", "));
    }
    if (!(outputType in validOutputTypes)) {
      throw new TypeError("Cannot convert " + value + ' to type "' + outputType + '"; valid output types are ' + Object.keys(validOutputTypes).join(", "));
    }
    if (outputType === inputType) {
      return value;
    } else {
      return validOutputTypes[outputType](value);
    }
  };
});

// node_modules/mathjs/lib/esm/function/arithmetic/divideScalar.js
var name53 = "divideScalar";
var dependencies53 = ["typed", "numeric"];
var createDivideScalar = /* @__PURE__ */ factory(name53, dependencies53, (_ref) => {
  var {
    typed: typed2,
    numeric: numeric2
  } = _ref;
  return typed2(name53, {
    "number, number": function numberNumber(x, y) {
      return x / y;
    },
    "Complex, Complex": function ComplexComplex(x, y) {
      return x.div(y);
    },
    "BigNumber, BigNumber": function BigNumberBigNumber(x, y) {
      return x.div(y);
    },
    "Fraction, Fraction": function FractionFraction(x, y) {
      return x.div(y);
    },
    "Unit, number | Complex | Fraction | BigNumber | Unit": (x, y) => x.divide(y),
    "number | Fraction | Complex | BigNumber, Unit": (x, y) => y.divideInto(x)
  });
});

// node_modules/mathjs/lib/esm/function/arithmetic/pow.js
var name54 = "pow";
var dependencies54 = ["typed", "config", "identity", "multiply", "matrix", "inv", "fraction", "number", "Complex"];
var createPow = /* @__PURE__ */ factory(name54, dependencies54, (_ref) => {
  var {
    typed: typed2,
    config: config4,
    identity: identity2,
    multiply: multiply2,
    matrix: matrix2,
    inv: inv2,
    number: number2,
    fraction: fraction2,
    Complex: Complex3
  } = _ref;
  return typed2(name54, {
    "number, number": _pow,
    "Complex, Complex": function ComplexComplex(x, y) {
      return x.pow(y);
    },
    "BigNumber, BigNumber": function BigNumberBigNumber(x, y) {
      if (y.isInteger() || x >= 0 || config4.predictable) {
        return x.pow(y);
      } else {
        return new Complex3(x.toNumber(), 0).pow(y.toNumber(), 0);
      }
    },
    "Fraction, Fraction": function FractionFraction(x, y) {
      var result = x.pow(y);
      if (result != null) {
        return result;
      }
      if (config4.predictable) {
        throw new Error("Result of pow is non-rational and cannot be expressed as a fraction");
      } else {
        return _pow(x.valueOf(), y.valueOf());
      }
    },
    "Array, number": _powArray,
    "Array, BigNumber": function ArrayBigNumber(x, y) {
      return _powArray(x, y.toNumber());
    },
    "Matrix, number": _powMatrix,
    "Matrix, BigNumber": function MatrixBigNumber(x, y) {
      return _powMatrix(x, y.toNumber());
    },
    "Unit, number | BigNumber": function UnitNumberBigNumber(x, y) {
      return x.pow(y);
    }
  });
  function _pow(x, y) {
    if (config4.predictable && !isInteger(y) && x < 0) {
      try {
        var yFrac = fraction2(y);
        var yNum = number2(yFrac);
        if (y === yNum || Math.abs((y - yNum) / y) < 1e-14) {
          if (yFrac.d % 2 === 1) {
            return (yFrac.n % 2 === 0 ? 1 : -1) * Math.pow(-x, y);
          }
        }
      } catch (ex) {
      }
    }
    if (config4.predictable && (x < -1 && y === Infinity || x > -1 && x < 0 && y === -Infinity)) {
      return NaN;
    }
    if (isInteger(y) || x >= 0 || config4.predictable) {
      return powNumber(x, y);
    } else {
      if (x * x < 1 && y === Infinity || x * x > 1 && y === -Infinity) {
        return 0;
      }
      return new Complex3(x, 0).pow(y, 0);
    }
  }
  function _powArray(x, y) {
    if (!isInteger(y)) {
      throw new TypeError("For A^b, b must be an integer (value is " + y + ")");
    }
    var s = arraySize(x);
    if (s.length !== 2) {
      throw new Error("For A^b, A must be 2 dimensional (A has " + s.length + " dimensions)");
    }
    if (s[0] !== s[1]) {
      throw new Error("For A^b, A must be square (size is " + s[0] + "x" + s[1] + ")");
    }
    if (y < 0) {
      try {
        return _powArray(inv2(x), -y);
      } catch (error2) {
        if (error2.message === "Cannot calculate inverse, determinant is zero") {
          throw new TypeError("For A^b, when A is not invertible, b must be a positive integer (value is " + y + ")");
        }
        throw error2;
      }
    }
    var res = identity2(s[0]).valueOf();
    var px = x;
    while (y >= 1) {
      if ((y & 1) === 1) {
        res = multiply2(px, res);
      }
      y >>= 1;
      px = multiply2(px, px);
    }
    return res;
  }
  function _powMatrix(x, y) {
    return matrix2(_powArray(x.valueOf(), y));
  }
});

// node_modules/mathjs/lib/esm/function/algebra/solver/utils/solveValidation.js
function createSolveValidation(_ref) {
  var {
    DenseMatrix: DenseMatrix2
  } = _ref;
  return function solveValidation(m, b, copy) {
    var mSize = m.size();
    if (mSize.length !== 2) {
      throw new RangeError("Matrix must be two dimensional (size: " + format3(mSize) + ")");
    }
    var rows = mSize[0];
    var columns = mSize[1];
    if (rows !== columns) {
      throw new RangeError("Matrix must be square (size: " + format3(mSize) + ")");
    }
    var data = [];
    if (isMatrix(b)) {
      var bSize = b.size();
      var bdata = b._data;
      if (bSize.length === 1) {
        if (bSize[0] !== rows) {
          throw new RangeError("Dimension mismatch. Matrix columns must match vector length.");
        }
        for (var i = 0; i < rows; i++) {
          data[i] = [bdata[i]];
        }
        return new DenseMatrix2({
          data,
          size: [rows, 1],
          datatype: b._datatype
        });
      }
      if (bSize.length === 2) {
        if (bSize[0] !== rows || bSize[1] !== 1) {
          throw new RangeError("Dimension mismatch. Matrix columns must match vector length.");
        }
        if (isDenseMatrix(b)) {
          if (copy) {
            data = [];
            for (var _i = 0; _i < rows; _i++) {
              data[_i] = [bdata[_i][0]];
            }
            return new DenseMatrix2({
              data,
              size: [rows, 1],
              datatype: b._datatype
            });
          }
          return b;
        }
        if (isSparseMatrix(b)) {
          for (var _i2 = 0; _i2 < rows; _i2++) {
            data[_i2] = [0];
          }
          var values = b._values;
          var index = b._index;
          var ptr = b._ptr;
          for (var k1 = ptr[1], k = ptr[0]; k < k1; k++) {
            var _i3 = index[k];
            data[_i3][0] = values[k];
          }
          return new DenseMatrix2({
            data,
            size: [rows, 1],
            datatype: b._datatype
          });
        }
      }
      throw new RangeError("Dimension mismatch. The right side has to be either 1- or 2-dimensional vector.");
    }
    if (isArray(b)) {
      var bsize = arraySize(b);
      if (bsize.length === 1) {
        if (bsize[0] !== rows) {
          throw new RangeError("Dimension mismatch. Matrix columns must match vector length.");
        }
        for (var _i4 = 0; _i4 < rows; _i4++) {
          data[_i4] = [b[_i4]];
        }
        return new DenseMatrix2({
          data,
          size: [rows, 1]
        });
      }
      if (bsize.length === 2) {
        if (bsize[0] !== rows || bsize[1] !== 1) {
          throw new RangeError("Dimension mismatch. Matrix columns must match vector length.");
        }
        for (var _i5 = 0; _i5 < rows; _i5++) {
          data[_i5] = [b[_i5][0]];
        }
        return new DenseMatrix2({
          data,
          size: [rows, 1]
        });
      }
      throw new RangeError("Dimension mismatch. The right side has to be either 1- or 2-dimensional vector.");
    }
  };
}

// node_modules/mathjs/lib/esm/function/algebra/solver/usolve.js
var name55 = "usolve";
var dependencies55 = ["typed", "matrix", "divideScalar", "multiplyScalar", "subtractScalar", "equalScalar", "DenseMatrix"];
var createUsolve = /* @__PURE__ */ factory(name55, dependencies55, (_ref) => {
  var {
    typed: typed2,
    matrix: matrix2,
    divideScalar: divideScalar2,
    multiplyScalar: multiplyScalar2,
    subtractScalar: subtractScalar2,
    equalScalar: equalScalar2,
    DenseMatrix: DenseMatrix2
  } = _ref;
  var solveValidation = createSolveValidation({
    DenseMatrix: DenseMatrix2
  });
  return typed2(name55, {
    "SparseMatrix, Array | Matrix": function SparseMatrixArrayMatrix(m, b) {
      return _sparseBackwardSubstitution(m, b);
    },
    "DenseMatrix, Array | Matrix": function DenseMatrixArrayMatrix(m, b) {
      return _denseBackwardSubstitution(m, b);
    },
    "Array, Array | Matrix": function ArrayArrayMatrix(a, b) {
      var m = matrix2(a);
      var r = _denseBackwardSubstitution(m, b);
      return r.valueOf();
    }
  });
  function _denseBackwardSubstitution(m, b) {
    b = solveValidation(m, b, true);
    var bdata = b._data;
    var rows = m._size[0];
    var columns = m._size[1];
    var x = [];
    var mdata = m._data;
    for (var j = columns - 1; j >= 0; j--) {
      var bj = bdata[j][0] || 0;
      var xj = void 0;
      if (!equalScalar2(bj, 0)) {
        var vjj = mdata[j][j];
        if (equalScalar2(vjj, 0)) {
          throw new Error("Linear system cannot be solved since matrix is singular");
        }
        xj = divideScalar2(bj, vjj);
        for (var i = j - 1; i >= 0; i--) {
          bdata[i] = [subtractScalar2(bdata[i][0] || 0, multiplyScalar2(xj, mdata[i][j]))];
        }
      } else {
        xj = 0;
      }
      x[j] = [xj];
    }
    return new DenseMatrix2({
      data: x,
      size: [rows, 1]
    });
  }
  function _sparseBackwardSubstitution(m, b) {
    b = solveValidation(m, b, true);
    var bdata = b._data;
    var rows = m._size[0];
    var columns = m._size[1];
    var values = m._values;
    var index = m._index;
    var ptr = m._ptr;
    var x = [];
    for (var j = columns - 1; j >= 0; j--) {
      var bj = bdata[j][0] || 0;
      if (!equalScalar2(bj, 0)) {
        var vjj = 0;
        var jValues = [];
        var jIndices = [];
        var firstIndex = ptr[j];
        var lastIndex = ptr[j + 1];
        for (var k = lastIndex - 1; k >= firstIndex; k--) {
          var i = index[k];
          if (i === j) {
            vjj = values[k];
          } else if (i < j) {
            jValues.push(values[k]);
            jIndices.push(i);
          }
        }
        if (equalScalar2(vjj, 0)) {
          throw new Error("Linear system cannot be solved since matrix is singular");
        }
        var xj = divideScalar2(bj, vjj);
        for (var _k = 0, _lastIndex = jIndices.length; _k < _lastIndex; _k++) {
          var _i = jIndices[_k];
          bdata[_i] = [subtractScalar2(bdata[_i][0], multiplyScalar2(xj, jValues[_k]))];
        }
        x[j] = [xj];
      } else {
        x[j] = [0];
      }
    }
    return new DenseMatrix2({
      data: x,
      size: [rows, 1]
    });
  }
});

// node_modules/mathjs/lib/esm/function/algebra/solver/usolveAll.js
var name56 = "usolveAll";
var dependencies56 = ["typed", "matrix", "divideScalar", "multiplyScalar", "subtractScalar", "equalScalar", "DenseMatrix"];
var createUsolveAll = /* @__PURE__ */ factory(name56, dependencies56, (_ref) => {
  var {
    typed: typed2,
    matrix: matrix2,
    divideScalar: divideScalar2,
    multiplyScalar: multiplyScalar2,
    subtractScalar: subtractScalar2,
    equalScalar: equalScalar2,
    DenseMatrix: DenseMatrix2
  } = _ref;
  var solveValidation = createSolveValidation({
    DenseMatrix: DenseMatrix2
  });
  return typed2(name56, {
    "SparseMatrix, Array | Matrix": function SparseMatrixArrayMatrix(m, b) {
      return _sparseBackwardSubstitution(m, b);
    },
    "DenseMatrix, Array | Matrix": function DenseMatrixArrayMatrix(m, b) {
      return _denseBackwardSubstitution(m, b);
    },
    "Array, Array | Matrix": function ArrayArrayMatrix(a, b) {
      var m = matrix2(a);
      var R = _denseBackwardSubstitution(m, b);
      return R.map((r) => r.valueOf());
    }
  });
  function _denseBackwardSubstitution(m, b_) {
    var B = [solveValidation(m, b_, true)._data.map((e) => e[0])];
    var M = m._data;
    var rows = m._size[0];
    var columns = m._size[1];
    for (var i = columns - 1; i >= 0; i--) {
      var L = B.length;
      for (var k = 0; k < L; k++) {
        var b = B[k];
        if (!equalScalar2(M[i][i], 0)) {
          b[i] = divideScalar2(b[i], M[i][i]);
          for (var j = i - 1; j >= 0; j--) {
            b[j] = subtractScalar2(b[j], multiplyScalar2(b[i], M[j][i]));
          }
        } else if (!equalScalar2(b[i], 0)) {
          if (k === 0) {
            return [];
          } else {
            B.splice(k, 1);
            k -= 1;
            L -= 1;
          }
        } else if (k === 0) {
          var bNew = [...b];
          bNew[i] = 1;
          for (var _j = i - 1; _j >= 0; _j--) {
            bNew[_j] = subtractScalar2(bNew[_j], M[_j][i]);
          }
          B.push(bNew);
        }
      }
    }
    return B.map((x) => new DenseMatrix2({
      data: x.map((e) => [e]),
      size: [rows, 1]
    }));
  }
  function _sparseBackwardSubstitution(m, b_) {
    var B = [solveValidation(m, b_, true)._data.map((e) => e[0])];
    var rows = m._size[0];
    var columns = m._size[1];
    var values = m._values;
    var index = m._index;
    var ptr = m._ptr;
    for (var i = columns - 1; i >= 0; i--) {
      var L = B.length;
      for (var k = 0; k < L; k++) {
        var b = B[k];
        var iValues = [];
        var iIndices = [];
        var firstIndex = ptr[i];
        var lastIndex = ptr[i + 1];
        var Mii = 0;
        for (var j = lastIndex - 1; j >= firstIndex; j--) {
          var J = index[j];
          if (J === i) {
            Mii = values[j];
          } else if (J < i) {
            iValues.push(values[j]);
            iIndices.push(J);
          }
        }
        if (!equalScalar2(Mii, 0)) {
          b[i] = divideScalar2(b[i], Mii);
          for (var _j2 = 0, _lastIndex = iIndices.length; _j2 < _lastIndex; _j2++) {
            var _J = iIndices[_j2];
            b[_J] = subtractScalar2(b[_J], multiplyScalar2(b[i], iValues[_j2]));
          }
        } else if (!equalScalar2(b[i], 0)) {
          if (k === 0) {
            return [];
          } else {
            B.splice(k, 1);
            k -= 1;
            L -= 1;
          }
        } else if (k === 0) {
          var bNew = [...b];
          bNew[i] = 1;
          for (var _j3 = 0, _lastIndex2 = iIndices.length; _j3 < _lastIndex2; _j3++) {
            var _J2 = iIndices[_j3];
            bNew[_J2] = subtractScalar2(bNew[_J2], iValues[_j3]);
          }
          B.push(bNew);
        }
      }
    }
    return B.map((x) => new DenseMatrix2({
      data: x.map((e) => [e]),
      size: [rows, 1]
    }));
  }
});

// node_modules/mathjs/lib/esm/function/relational/equal.js
var name57 = "equal";
var dependencies57 = ["typed", "matrix", "equalScalar", "DenseMatrix", "concat"];
var createEqual = /* @__PURE__ */ factory(name57, dependencies57, (_ref) => {
  var {
    typed: typed2,
    matrix: matrix2,
    equalScalar: equalScalar2,
    DenseMatrix: DenseMatrix2,
    concat: concat3
  } = _ref;
  var matAlgo03xDSf = createMatAlgo03xDSf({
    typed: typed2
  });
  var matAlgo07xSSf = createMatAlgo07xSSf({
    typed: typed2,
    DenseMatrix: DenseMatrix2
  });
  var matAlgo12xSfs = createMatAlgo12xSfs({
    typed: typed2,
    DenseMatrix: DenseMatrix2
  });
  var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
    typed: typed2,
    matrix: matrix2,
    concat: concat3
  });
  return typed2(name57, createEqualNumber({
    typed: typed2,
    equalScalar: equalScalar2
  }), matrixAlgorithmSuite({
    elop: equalScalar2,
    SS: matAlgo07xSSf,
    DS: matAlgo03xDSf,
    Ss: matAlgo12xSfs
  }));
});
var createEqualNumber = factory(name57, ["typed", "equalScalar"], (_ref2) => {
  var {
    typed: typed2,
    equalScalar: equalScalar2
  } = _ref2;
  return typed2(name57, {
    "any, any": function anyAny(x, y) {
      if (x === null) {
        return y === null;
      }
      if (y === null) {
        return x === null;
      }
      if (x === void 0) {
        return y === void 0;
      }
      if (y === void 0) {
        return x === void 0;
      }
      return equalScalar2(x, y);
    }
  });
});

// node_modules/mathjs/lib/esm/function/relational/smaller.js
var name58 = "smaller";
var dependencies58 = ["typed", "config", "matrix", "DenseMatrix", "concat"];
var createSmaller = /* @__PURE__ */ factory(name58, dependencies58, (_ref) => {
  var {
    typed: typed2,
    config: config4,
    matrix: matrix2,
    DenseMatrix: DenseMatrix2,
    concat: concat3
  } = _ref;
  var matAlgo03xDSf = createMatAlgo03xDSf({
    typed: typed2
  });
  var matAlgo07xSSf = createMatAlgo07xSSf({
    typed: typed2,
    DenseMatrix: DenseMatrix2
  });
  var matAlgo12xSfs = createMatAlgo12xSfs({
    typed: typed2,
    DenseMatrix: DenseMatrix2
  });
  var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
    typed: typed2,
    matrix: matrix2,
    concat: concat3
  });
  var compareUnits = createCompareUnits({
    typed: typed2
  });
  return typed2(name58, createSmallerNumber({
    typed: typed2,
    config: config4
  }), {
    "boolean, boolean": (x, y) => x < y,
    "BigNumber, BigNumber": function BigNumberBigNumber(x, y) {
      return x.lt(y) && !nearlyEqual2(x, y, config4.epsilon);
    },
    "Fraction, Fraction": (x, y) => x.compare(y) === -1,
    "Complex, Complex": function ComplexComplex(x, y) {
      throw new TypeError("No ordering relation is defined for complex numbers");
    }
  }, compareUnits, matrixAlgorithmSuite({
    SS: matAlgo07xSSf,
    DS: matAlgo03xDSf,
    Ss: matAlgo12xSfs
  }));
});
var createSmallerNumber = /* @__PURE__ */ factory(name58, ["typed", "config"], (_ref2) => {
  var {
    typed: typed2,
    config: config4
  } = _ref2;
  return typed2(name58, {
    "number, number": function numberNumber(x, y) {
      return x < y && !nearlyEqual(x, y, config4.epsilon);
    }
  });
});

// node_modules/mathjs/lib/esm/function/relational/smallerEq.js
var name59 = "smallerEq";
var dependencies59 = ["typed", "config", "matrix", "DenseMatrix", "concat"];
var createSmallerEq = /* @__PURE__ */ factory(name59, dependencies59, (_ref) => {
  var {
    typed: typed2,
    config: config4,
    matrix: matrix2,
    DenseMatrix: DenseMatrix2,
    concat: concat3
  } = _ref;
  var matAlgo03xDSf = createMatAlgo03xDSf({
    typed: typed2
  });
  var matAlgo07xSSf = createMatAlgo07xSSf({
    typed: typed2,
    DenseMatrix: DenseMatrix2
  });
  var matAlgo12xSfs = createMatAlgo12xSfs({
    typed: typed2,
    DenseMatrix: DenseMatrix2
  });
  var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
    typed: typed2,
    matrix: matrix2,
    concat: concat3
  });
  var compareUnits = createCompareUnits({
    typed: typed2
  });
  return typed2(name59, createSmallerEqNumber({
    typed: typed2,
    config: config4
  }), {
    "boolean, boolean": (x, y) => x <= y,
    "BigNumber, BigNumber": function BigNumberBigNumber(x, y) {
      return x.lte(y) || nearlyEqual2(x, y, config4.epsilon);
    },
    "Fraction, Fraction": (x, y) => x.compare(y) !== 1,
    "Complex, Complex": function ComplexComplex() {
      throw new TypeError("No ordering relation is defined for complex numbers");
    }
  }, compareUnits, matrixAlgorithmSuite({
    SS: matAlgo07xSSf,
    DS: matAlgo03xDSf,
    Ss: matAlgo12xSfs
  }));
});
var createSmallerEqNumber = /* @__PURE__ */ factory(name59, ["typed", "config"], (_ref2) => {
  var {
    typed: typed2,
    config: config4
  } = _ref2;
  return typed2(name59, {
    "number, number": function numberNumber(x, y) {
      return x <= y || nearlyEqual(x, y, config4.epsilon);
    }
  });
});

// node_modules/mathjs/lib/esm/function/relational/larger.js
var name60 = "larger";
var dependencies60 = ["typed", "config", "matrix", "DenseMatrix", "concat"];
var createLarger = /* @__PURE__ */ factory(name60, dependencies60, (_ref) => {
  var {
    typed: typed2,
    config: config4,
    matrix: matrix2,
    DenseMatrix: DenseMatrix2,
    concat: concat3
  } = _ref;
  var matAlgo03xDSf = createMatAlgo03xDSf({
    typed: typed2
  });
  var matAlgo07xSSf = createMatAlgo07xSSf({
    typed: typed2,
    DenseMatrix: DenseMatrix2
  });
  var matAlgo12xSfs = createMatAlgo12xSfs({
    typed: typed2,
    DenseMatrix: DenseMatrix2
  });
  var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
    typed: typed2,
    matrix: matrix2,
    concat: concat3
  });
  var compareUnits = createCompareUnits({
    typed: typed2
  });
  return typed2(name60, createLargerNumber({
    typed: typed2,
    config: config4
  }), {
    "boolean, boolean": (x, y) => x > y,
    "BigNumber, BigNumber": function BigNumberBigNumber(x, y) {
      return x.gt(y) && !nearlyEqual2(x, y, config4.epsilon);
    },
    "Fraction, Fraction": (x, y) => x.compare(y) === 1,
    "Complex, Complex": function ComplexComplex() {
      throw new TypeError("No ordering relation is defined for complex numbers");
    }
  }, compareUnits, matrixAlgorithmSuite({
    SS: matAlgo07xSSf,
    DS: matAlgo03xDSf,
    Ss: matAlgo12xSfs
  }));
});
var createLargerNumber = /* @__PURE__ */ factory(name60, ["typed", "config"], (_ref2) => {
  var {
    typed: typed2,
    config: config4
  } = _ref2;
  return typed2(name60, {
    "number, number": function numberNumber(x, y) {
      return x > y && !nearlyEqual(x, y, config4.epsilon);
    }
  });
});

// node_modules/mathjs/lib/esm/function/relational/largerEq.js
var name61 = "largerEq";
var dependencies61 = ["typed", "config", "matrix", "DenseMatrix", "concat"];
var createLargerEq = /* @__PURE__ */ factory(name61, dependencies61, (_ref) => {
  var {
    typed: typed2,
    config: config4,
    matrix: matrix2,
    DenseMatrix: DenseMatrix2,
    concat: concat3
  } = _ref;
  var matAlgo03xDSf = createMatAlgo03xDSf({
    typed: typed2
  });
  var matAlgo07xSSf = createMatAlgo07xSSf({
    typed: typed2,
    DenseMatrix: DenseMatrix2
  });
  var matAlgo12xSfs = createMatAlgo12xSfs({
    typed: typed2,
    DenseMatrix: DenseMatrix2
  });
  var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
    typed: typed2,
    matrix: matrix2,
    concat: concat3
  });
  var compareUnits = createCompareUnits({
    typed: typed2
  });
  return typed2(name61, createLargerEqNumber({
    typed: typed2,
    config: config4
  }), {
    "boolean, boolean": (x, y) => x >= y,
    "BigNumber, BigNumber": function BigNumberBigNumber(x, y) {
      return x.gte(y) || nearlyEqual2(x, y, config4.epsilon);
    },
    "Fraction, Fraction": (x, y) => x.compare(y) !== -1,
    "Complex, Complex": function ComplexComplex() {
      throw new TypeError("No ordering relation is defined for complex numbers");
    }
  }, compareUnits, matrixAlgorithmSuite({
    SS: matAlgo07xSSf,
    DS: matAlgo03xDSf,
    Ss: matAlgo12xSfs
  }));
});
var createLargerEqNumber = /* @__PURE__ */ factory(name61, ["typed", "config"], (_ref2) => {
  var {
    typed: typed2,
    config: config4
  } = _ref2;
  return typed2(name61, {
    "number, number": function numberNumber(x, y) {
      return x >= y || nearlyEqual(x, y, config4.epsilon);
    }
  });
});

// node_modules/mathjs/lib/esm/type/matrix/ImmutableDenseMatrix.js
var name62 = "ImmutableDenseMatrix";
var dependencies62 = ["smaller", "DenseMatrix"];
var createImmutableDenseMatrixClass = /* @__PURE__ */ factory(name62, dependencies62, (_ref) => {
  var {
    smaller: smaller2,
    DenseMatrix: DenseMatrix2
  } = _ref;
  function ImmutableDenseMatrix2(data, datatype) {
    if (!(this instanceof ImmutableDenseMatrix2)) {
      throw new SyntaxError("Constructor must be called with the new operator");
    }
    if (datatype && !isString(datatype)) {
      throw new Error("Invalid datatype: " + datatype);
    }
    if (isMatrix(data) || isArray(data)) {
      var matrix2 = new DenseMatrix2(data, datatype);
      this._data = matrix2._data;
      this._size = matrix2._size;
      this._datatype = matrix2._datatype;
      this._min = null;
      this._max = null;
    } else if (data && isArray(data.data) && isArray(data.size)) {
      this._data = data.data;
      this._size = data.size;
      this._datatype = data.datatype;
      this._min = typeof data.min !== "undefined" ? data.min : null;
      this._max = typeof data.max !== "undefined" ? data.max : null;
    } else if (data) {
      throw new TypeError("Unsupported type of data (" + typeOf(data) + ")");
    } else {
      this._data = [];
      this._size = [0];
      this._datatype = datatype;
      this._min = null;
      this._max = null;
    }
  }
  ImmutableDenseMatrix2.prototype = new DenseMatrix2();
  ImmutableDenseMatrix2.prototype.type = "ImmutableDenseMatrix";
  ImmutableDenseMatrix2.prototype.isImmutableDenseMatrix = true;
  ImmutableDenseMatrix2.prototype.subset = function(index) {
    switch (arguments.length) {
      case 1: {
        var m = DenseMatrix2.prototype.subset.call(this, index);
        if (isMatrix(m)) {
          return new ImmutableDenseMatrix2({
            data: m._data,
            size: m._size,
            datatype: m._datatype
          });
        }
        return m;
      }
      case 2:
      case 3:
        throw new Error("Cannot invoke set subset on an Immutable Matrix instance");
      default:
        throw new SyntaxError("Wrong number of arguments");
    }
  };
  ImmutableDenseMatrix2.prototype.set = function() {
    throw new Error("Cannot invoke set on an Immutable Matrix instance");
  };
  ImmutableDenseMatrix2.prototype.resize = function() {
    throw new Error("Cannot invoke resize on an Immutable Matrix instance");
  };
  ImmutableDenseMatrix2.prototype.reshape = function() {
    throw new Error("Cannot invoke reshape on an Immutable Matrix instance");
  };
  ImmutableDenseMatrix2.prototype.clone = function() {
    return new ImmutableDenseMatrix2({
      data: clone(this._data),
      size: clone(this._size),
      datatype: this._datatype
    });
  };
  ImmutableDenseMatrix2.prototype.toJSON = function() {
    return {
      mathjs: "ImmutableDenseMatrix",
      data: this._data,
      size: this._size,
      datatype: this._datatype
    };
  };
  ImmutableDenseMatrix2.fromJSON = function(json) {
    return new ImmutableDenseMatrix2(json);
  };
  ImmutableDenseMatrix2.prototype.swapRows = function() {
    throw new Error("Cannot invoke swapRows on an Immutable Matrix instance");
  };
  ImmutableDenseMatrix2.prototype.min = function() {
    if (this._min === null) {
      var m = null;
      this.forEach(function(v) {
        if (m === null || smaller2(v, m)) {
          m = v;
        }
      });
      this._min = m !== null ? m : void 0;
    }
    return this._min;
  };
  ImmutableDenseMatrix2.prototype.max = function() {
    if (this._max === null) {
      var m = null;
      this.forEach(function(v) {
        if (m === null || smaller2(m, v)) {
          m = v;
        }
      });
      this._max = m !== null ? m : void 0;
    }
    return this._max;
  };
  return ImmutableDenseMatrix2;
}, {
  isClass: true
});

// node_modules/mathjs/lib/esm/type/matrix/MatrixIndex.js
var name63 = "Index";
var dependencies63 = ["ImmutableDenseMatrix", "getMatrixDataType"];
var createIndexClass = /* @__PURE__ */ factory(name63, dependencies63, (_ref) => {
  var {
    ImmutableDenseMatrix: ImmutableDenseMatrix2,
    getMatrixDataType: getMatrixDataType2
  } = _ref;
  function Index2(ranges) {
    if (!(this instanceof Index2)) {
      throw new SyntaxError("Constructor must be called with the new operator");
    }
    this._dimensions = [];
    this._sourceSize = [];
    this._isScalar = true;
    for (var i = 0, ii = arguments.length; i < ii; i++) {
      var arg = arguments[i];
      var argIsArray = isArray(arg);
      var argIsMatrix = isMatrix(arg);
      var sourceSize = null;
      if (isRange(arg)) {
        this._dimensions.push(arg);
        this._isScalar = false;
      } else if (argIsArray || argIsMatrix) {
        var m = void 0;
        if (getMatrixDataType2(arg) === "boolean") {
          if (argIsArray)
            m = _createImmutableMatrix(_booleansArrayToNumbersForIndex(arg).valueOf());
          if (argIsMatrix)
            m = _createImmutableMatrix(_booleansArrayToNumbersForIndex(arg._data).valueOf());
          sourceSize = arg.valueOf().length;
        } else {
          m = _createImmutableMatrix(arg.valueOf());
        }
        this._dimensions.push(m);
        var size2 = m.size();
        if (size2.length !== 1 || size2[0] !== 1 || sourceSize !== null) {
          this._isScalar = false;
        }
      } else if (typeof arg === "number") {
        this._dimensions.push(_createImmutableMatrix([arg]));
      } else if (typeof arg === "string") {
        this._dimensions.push(arg);
      } else {
        throw new TypeError("Dimension must be an Array, Matrix, number, string, or Range");
      }
      this._sourceSize.push(sourceSize);
    }
  }
  Index2.prototype.type = "Index";
  Index2.prototype.isIndex = true;
  function _createImmutableMatrix(arg) {
    for (var i = 0, l = arg.length; i < l; i++) {
      if (typeof arg[i] !== "number" || !isInteger(arg[i])) {
        throw new TypeError("Index parameters must be positive integer numbers");
      }
    }
    return new ImmutableDenseMatrix2(arg);
  }
  Index2.prototype.clone = function() {
    var index = new Index2();
    index._dimensions = clone(this._dimensions);
    index._isScalar = this._isScalar;
    index._sourceSize = this._sourceSize;
    return index;
  };
  Index2.create = function(ranges) {
    var index = new Index2();
    Index2.apply(index, ranges);
    return index;
  };
  Index2.prototype.size = function() {
    var size2 = [];
    for (var i = 0, ii = this._dimensions.length; i < ii; i++) {
      var d = this._dimensions[i];
      size2[i] = typeof d === "string" ? 1 : d.size()[0];
    }
    return size2;
  };
  Index2.prototype.max = function() {
    var values = [];
    for (var i = 0, ii = this._dimensions.length; i < ii; i++) {
      var range2 = this._dimensions[i];
      values[i] = typeof range2 === "string" ? range2 : range2.max();
    }
    return values;
  };
  Index2.prototype.min = function() {
    var values = [];
    for (var i = 0, ii = this._dimensions.length; i < ii; i++) {
      var range2 = this._dimensions[i];
      values[i] = typeof range2 === "string" ? range2 : range2.min();
    }
    return values;
  };
  Index2.prototype.forEach = function(callback) {
    for (var i = 0, ii = this._dimensions.length; i < ii; i++) {
      callback(this._dimensions[i], i, this);
    }
  };
  Index2.prototype.dimension = function(dim) {
    return this._dimensions[dim] || null;
  };
  Index2.prototype.isObjectProperty = function() {
    return this._dimensions.length === 1 && typeof this._dimensions[0] === "string";
  };
  Index2.prototype.getObjectProperty = function() {
    return this.isObjectProperty() ? this._dimensions[0] : null;
  };
  Index2.prototype.isScalar = function() {
    return this._isScalar;
  };
  Index2.prototype.toArray = function() {
    var array = [];
    for (var i = 0, ii = this._dimensions.length; i < ii; i++) {
      var dimension = this._dimensions[i];
      array.push(typeof dimension === "string" ? dimension : dimension.toArray());
    }
    return array;
  };
  Index2.prototype.valueOf = Index2.prototype.toArray;
  Index2.prototype.toString = function() {
    var strings = [];
    for (var i = 0, ii = this._dimensions.length; i < ii; i++) {
      var dimension = this._dimensions[i];
      if (typeof dimension === "string") {
        strings.push(JSON.stringify(dimension));
      } else {
        strings.push(dimension.toString());
      }
    }
    return "[" + strings.join(", ") + "]";
  };
  Index2.prototype.toJSON = function() {
    return {
      mathjs: "Index",
      dimensions: this._dimensions
    };
  };
  Index2.fromJSON = function(json) {
    return Index2.create(json.dimensions);
  };
  return Index2;
}, {
  isClass: true
});
function _booleansArrayToNumbersForIndex(booleanArrayIndex) {
  var indexOfNumbers = [];
  booleanArrayIndex.forEach((bool, idx) => {
    if (bool) {
      indexOfNumbers.push(idx);
    }
  });
  return indexOfNumbers;
}

// node_modules/mathjs/lib/esm/function/trigonometry/atan.js
var name64 = "atan";
var dependencies64 = ["typed"];
var createAtan = /* @__PURE__ */ factory(name64, dependencies64, (_ref) => {
  var {
    typed: typed2
  } = _ref;
  return typed2("atan", {
    number: function number2(x) {
      return Math.atan(x);
    },
    Complex: function Complex3(x) {
      return x.atan();
    },
    BigNumber: function BigNumber2(x) {
      return x.atan();
    }
  });
});

// node_modules/mathjs/lib/esm/function/trigonometry/trigUnit.js
var createTrigUnit = /* @__PURE__ */ factory("trigUnit", ["typed"], (_ref) => {
  var {
    typed: typed2
  } = _ref;
  return {
    Unit: typed2.referToSelf((self2) => (x) => {
      if (!x.hasBase(x.constructor.BASE_UNITS.ANGLE)) {
        throw new TypeError("Unit in function cot is no angle");
      }
      return typed2.find(self2, x.valueType())(x.value);
    })
  };
});

// node_modules/mathjs/lib/esm/function/trigonometry/cos.js
var name65 = "cos";
var dependencies65 = ["typed"];
var createCos = /* @__PURE__ */ factory(name65, dependencies65, (_ref) => {
  var {
    typed: typed2
  } = _ref;
  var trigUnit = createTrigUnit({
    typed: typed2
  });
  return typed2(name65, {
    number: Math.cos,
    "Complex | BigNumber": (x) => x.cos()
  }, trigUnit);
});

// node_modules/mathjs/lib/esm/function/trigonometry/sin.js
var name66 = "sin";
var dependencies66 = ["typed"];
var createSin = /* @__PURE__ */ factory(name66, dependencies66, (_ref) => {
  var {
    typed: typed2
  } = _ref;
  var trigUnit = createTrigUnit({
    typed: typed2
  });
  return typed2(name66, {
    number: Math.sin,
    "Complex | BigNumber": (x) => x.sin()
  }, trigUnit);
});

// node_modules/mathjs/lib/esm/function/arithmetic/add.js
var name67 = "add";
var dependencies67 = ["typed", "matrix", "addScalar", "equalScalar", "DenseMatrix", "SparseMatrix", "concat"];
var createAdd = /* @__PURE__ */ factory(name67, dependencies67, (_ref) => {
  var {
    typed: typed2,
    matrix: matrix2,
    addScalar: addScalar2,
    equalScalar: equalScalar2,
    DenseMatrix: DenseMatrix2,
    SparseMatrix: SparseMatrix2,
    concat: concat3
  } = _ref;
  var matAlgo01xDSid = createMatAlgo01xDSid({
    typed: typed2
  });
  var matAlgo04xSidSid = createMatAlgo04xSidSid({
    typed: typed2,
    equalScalar: equalScalar2
  });
  var matAlgo10xSids = createMatAlgo10xSids({
    typed: typed2,
    DenseMatrix: DenseMatrix2
  });
  var matrixAlgorithmSuite = createMatrixAlgorithmSuite({
    typed: typed2,
    matrix: matrix2,
    concat: concat3
  });
  return typed2(name67, {
    "any, any": addScalar2,
    "any, any, ...any": typed2.referToSelf((self2) => (x, y, rest) => {
      var result = self2(x, y);
      for (var i = 0; i < rest.length; i++) {
        result = self2(result, rest[i]);
      }
      return result;
    })
  }, matrixAlgorithmSuite({
    elop: addScalar2,
    DS: matAlgo01xDSid,
    SS: matAlgo04xSidSid,
    Ss: matAlgo10xSids
  }));
});

// node_modules/mathjs/lib/esm/function/arithmetic/norm.js
var name68 = "norm";
var dependencies68 = ["typed", "abs", "add", "pow", "conj", "sqrt", "multiply", "equalScalar", "larger", "smaller", "matrix", "ctranspose", "eigs"];
var createNorm = /* @__PURE__ */ factory(name68, dependencies68, (_ref) => {
  var {
    typed: typed2,
    abs: abs3,
    add: add3,
    pow: pow3,
    conj: conj2,
    sqrt: sqrt3,
    multiply: multiply2,
    equalScalar: equalScalar2,
    larger: larger2,
    smaller: smaller2,
    matrix: matrix2,
    ctranspose: ctranspose2,
    eigs: eigs2
  } = _ref;
  return typed2(name68, {
    number: Math.abs,
    Complex: function Complex3(x) {
      return x.abs();
    },
    BigNumber: function BigNumber2(x) {
      return x.abs();
    },
    boolean: function boolean(x) {
      return Math.abs(x);
    },
    Array: function Array2(x) {
      return _norm(matrix2(x), 2);
    },
    Matrix: function Matrix2(x) {
      return _norm(x, 2);
    },
    "Array, number | BigNumber | string": function ArrayNumberBigNumberString(x, p) {
      return _norm(matrix2(x), p);
    },
    "Matrix, number | BigNumber | string": function MatrixNumberBigNumberString(x, p) {
      return _norm(x, p);
    }
  });
  function _vectorNormPlusInfinity(x) {
    var pinf = 0;
    x.forEach(function(value) {
      var v = abs3(value);
      if (larger2(v, pinf)) {
        pinf = v;
      }
    }, true);
    return pinf;
  }
  function _vectorNormMinusInfinity(x) {
    var ninf;
    x.forEach(function(value) {
      var v = abs3(value);
      if (!ninf || smaller2(v, ninf)) {
        ninf = v;
      }
    }, true);
    return ninf || 0;
  }
  function _vectorNorm(x, p) {
    if (p === Number.POSITIVE_INFINITY || p === "inf") {
      return _vectorNormPlusInfinity(x);
    }
    if (p === Number.NEGATIVE_INFINITY || p === "-inf") {
      return _vectorNormMinusInfinity(x);
    }
    if (p === "fro") {
      return _norm(x, 2);
    }
    if (typeof p === "number" && !isNaN(p)) {
      if (!equalScalar2(p, 0)) {
        var n = 0;
        x.forEach(function(value) {
          n = add3(pow3(abs3(value), p), n);
        }, true);
        return pow3(n, 1 / p);
      }
      return Number.POSITIVE_INFINITY;
    }
    throw new Error("Unsupported parameter value");
  }
  function _matrixNormFrobenius(x) {
    var fro = 0;
    x.forEach(function(value, index) {
      fro = add3(fro, multiply2(value, conj2(value)));
    });
    return abs3(sqrt3(fro));
  }
  function _matrixNormOne(x) {
    var c = [];
    var maxc = 0;
    x.forEach(function(value, index) {
      var j = index[1];
      var cj = add3(c[j] || 0, abs3(value));
      if (larger2(cj, maxc)) {
        maxc = cj;
      }
      c[j] = cj;
    }, true);
    return maxc;
  }
  function _matrixNormTwo(x) {
    var sizeX = x.size();
    if (sizeX[0] !== sizeX[1]) {
      throw new RangeError("Invalid matrix dimensions");
    }
    var tx = ctranspose2(x);
    var squaredX = multiply2(tx, x);
    var eigenVals = eigs2(squaredX).values.toArray();
    var rho = eigenVals[eigenVals.length - 1];
    return abs3(sqrt3(rho));
  }
  function _matrixNormInfinity(x) {
    var r = [];
    var maxr = 0;
    x.forEach(function(value, index) {
      var i = index[0];
      var ri = add3(r[i] || 0, abs3(value));
      if (larger2(ri, maxr)) {
        maxr = ri;
      }
      r[i] = ri;
    }, true);
    return maxr;
  }
  function _matrixNorm(x, p) {
    if (p === 1) {
      return _matrixNormOne(x);
    }
    if (p === Number.POSITIVE_INFINITY || p === "inf") {
      return _matrixNormInfinity(x);
    }
    if (p === "fro") {
      return _matrixNormFrobenius(x);
    }
    if (p === 2) {
      return _matrixNormTwo(x);
    }
    throw new Error("Unsupported parameter value " + p);
  }
  function _norm(x, p) {
    var sizeX = x.size();
    if (sizeX.length === 1) {
      return _vectorNorm(x, p);
    }
    if (sizeX.length === 2) {
      if (sizeX[0] && sizeX[1]) {
        return _matrixNorm(x, p);
      } else {
        throw new RangeError("Invalid matrix dimensions");
      }
    }
  }
});

// node_modules/mathjs/lib/esm/function/matrix/dot.js
var name69 = "dot";
var dependencies69 = ["typed", "addScalar", "multiplyScalar", "conj", "size"];
var createDot = /* @__PURE__ */ factory(name69, dependencies69, (_ref) => {
  var {
    typed: typed2,
    addScalar: addScalar2,
    multiplyScalar: multiplyScalar2,
    conj: conj2,
    size: size2
  } = _ref;
  return typed2(name69, {
    "Array | DenseMatrix, Array | DenseMatrix": _denseDot,
    "SparseMatrix, SparseMatrix": _sparseDot
  });
  function _validateDim(x, y) {
    var xSize = _size(x);
    var ySize = _size(y);
    var xLen, yLen;
    if (xSize.length === 1) {
      xLen = xSize[0];
    } else if (xSize.length === 2 && xSize[1] === 1) {
      xLen = xSize[0];
    } else {
      throw new RangeError("Expected a column vector, instead got a matrix of size (" + xSize.join(", ") + ")");
    }
    if (ySize.length === 1) {
      yLen = ySize[0];
    } else if (ySize.length === 2 && ySize[1] === 1) {
      yLen = ySize[0];
    } else {
      throw new RangeError("Expected a column vector, instead got a matrix of size (" + ySize.join(", ") + ")");
    }
    if (xLen !== yLen)
      throw new RangeError("Vectors must have equal length (" + xLen + " != " + yLen + ")");
    if (xLen === 0)
      throw new RangeError("Cannot calculate the dot product of empty vectors");
    return xLen;
  }
  function _denseDot(a, b) {
    var N = _validateDim(a, b);
    var adata = isMatrix(a) ? a._data : a;
    var adt = isMatrix(a) ? a._datatype : void 0;
    var bdata = isMatrix(b) ? b._data : b;
    var bdt = isMatrix(b) ? b._datatype : void 0;
    var aIsColumn = _size(a).length === 2;
    var bIsColumn = _size(b).length === 2;
    var add3 = addScalar2;
    var mul2 = multiplyScalar2;
    if (adt && bdt && adt === bdt && typeof adt === "string") {
      var dt = adt;
      add3 = typed2.find(addScalar2, [dt, dt]);
      mul2 = typed2.find(multiplyScalar2, [dt, dt]);
    }
    if (!aIsColumn && !bIsColumn) {
      var c = mul2(conj2(adata[0]), bdata[0]);
      for (var i = 1; i < N; i++) {
        c = add3(c, mul2(conj2(adata[i]), bdata[i]));
      }
      return c;
    }
    if (!aIsColumn && bIsColumn) {
      var _c = mul2(conj2(adata[0]), bdata[0][0]);
      for (var _i = 1; _i < N; _i++) {
        _c = add3(_c, mul2(conj2(adata[_i]), bdata[_i][0]));
      }
      return _c;
    }
    if (aIsColumn && !bIsColumn) {
      var _c2 = mul2(conj2(adata[0][0]), bdata[0]);
      for (var _i2 = 1; _i2 < N; _i2++) {
        _c2 = add3(_c2, mul2(conj2(adata[_i2][0]), bdata[_i2]));
      }
      return _c2;
    }
    if (aIsColumn && bIsColumn) {
      var _c3 = mul2(conj2(adata[0][0]), bdata[0][0]);
      for (var _i3 = 1; _i3 < N; _i3++) {
        _c3 = add3(_c3, mul2(conj2(adata[_i3][0]), bdata[_i3][0]));
      }
      return _c3;
    }
  }
  function _sparseDot(x, y) {
    _validateDim(x, y);
    var xindex = x._index;
    var xvalues = x._values;
    var yindex = y._index;
    var yvalues = y._values;
    var c = 0;
    var add3 = addScalar2;
    var mul2 = multiplyScalar2;
    var i = 0;
    var j = 0;
    while (i < xindex.length && j < yindex.length) {
      var I = xindex[i];
      var J = yindex[j];
      if (I < J) {
        i++;
        continue;
      }
      if (I > J) {
        j++;
        continue;
      }
      if (I === J) {
        c = add3(c, mul2(xvalues[i], yvalues[j]));
        i++;
        j++;
      }
    }
    return c;
  }
  function _size(x) {
    return isMatrix(x) ? x.size() : size2(x);
  }
});

// node_modules/mathjs/lib/esm/function/algebra/decomposition/qr.js
var name70 = "qr";
var dependencies70 = ["typed", "matrix", "zeros", "identity", "isZero", "equal", "sign", "sqrt", "conj", "unaryMinus", "addScalar", "divideScalar", "multiplyScalar", "subtractScalar", "complex"];
var createQr = /* @__PURE__ */ factory(name70, dependencies70, (_ref) => {
  var {
    typed: typed2,
    matrix: matrix2,
    zeros: zeros3,
    identity: identity2,
    isZero: isZero2,
    equal: equal2,
    sign: sign4,
    sqrt: sqrt3,
    conj: conj2,
    unaryMinus: unaryMinus2,
    addScalar: addScalar2,
    divideScalar: divideScalar2,
    multiplyScalar: multiplyScalar2,
    subtractScalar: subtractScalar2,
    complex: complex2
  } = _ref;
  return _extends(typed2(name70, {
    DenseMatrix: function DenseMatrix2(m) {
      return _denseQR(m);
    },
    SparseMatrix: function SparseMatrix2(m) {
      return _sparseQR(m);
    },
    Array: function Array2(a) {
      var m = matrix2(a);
      var r = _denseQR(m);
      return {
        Q: r.Q.valueOf(),
        R: r.R.valueOf()
      };
    }
  }), {
    _denseQRimpl
  });
  function _denseQRimpl(m) {
    var rows = m._size[0];
    var cols = m._size[1];
    var Q = identity2([rows], "dense");
    var Qdata = Q._data;
    var R = m.clone();
    var Rdata = R._data;
    var i, j, k;
    var w = zeros3([rows], "");
    for (k = 0; k < Math.min(cols, rows); ++k) {
      var pivot = Rdata[k][k];
      var sgn = unaryMinus2(equal2(pivot, 0) ? 1 : sign4(pivot));
      var conjSgn = conj2(sgn);
      var alphaSquared = 0;
      for (i = k; i < rows; i++) {
        alphaSquared = addScalar2(alphaSquared, multiplyScalar2(Rdata[i][k], conj2(Rdata[i][k])));
      }
      var alpha = multiplyScalar2(sgn, sqrt3(alphaSquared));
      if (!isZero2(alpha)) {
        var u1 = subtractScalar2(pivot, alpha);
        w[k] = 1;
        for (i = k + 1; i < rows; i++) {
          w[i] = divideScalar2(Rdata[i][k], u1);
        }
        var tau = unaryMinus2(conj2(divideScalar2(u1, alpha)));
        var s = void 0;
        for (j = k; j < cols; j++) {
          s = 0;
          for (i = k; i < rows; i++) {
            s = addScalar2(s, multiplyScalar2(conj2(w[i]), Rdata[i][j]));
          }
          s = multiplyScalar2(s, tau);
          for (i = k; i < rows; i++) {
            Rdata[i][j] = multiplyScalar2(subtractScalar2(Rdata[i][j], multiplyScalar2(w[i], s)), conjSgn);
          }
        }
        for (i = 0; i < rows; i++) {
          s = 0;
          for (j = k; j < rows; j++) {
            s = addScalar2(s, multiplyScalar2(Qdata[i][j], w[j]));
          }
          s = multiplyScalar2(s, tau);
          for (j = k; j < rows; ++j) {
            Qdata[i][j] = divideScalar2(subtractScalar2(Qdata[i][j], multiplyScalar2(s, conj2(w[j]))), conjSgn);
          }
        }
      }
    }
    return {
      Q,
      R,
      toString: function toString() {
        return "Q: " + this.Q.toString() + "\nR: " + this.R.toString();
      }
    };
  }
  function _denseQR(m) {
    var ret = _denseQRimpl(m);
    var Rdata = ret.R._data;
    if (m._data.length > 0) {
      var zero = Rdata[0][0].type === "Complex" ? complex2(0) : 0;
      for (var i = 0; i < Rdata.length; ++i) {
        for (var j = 0; j < i && j < (Rdata[0] || []).length; ++j) {
          Rdata[i][j] = zero;
        }
      }
    }
    return ret;
  }
  function _sparseQR(m) {
    throw new Error("qr not implemented for sparse matrices yet");
  }
});

// node_modules/mathjs/lib/esm/function/matrix/det.js
var name71 = "det";
var dependencies71 = ["typed", "matrix", "subtractScalar", "multiply", "divideScalar", "isZero", "unaryMinus"];
var createDet = /* @__PURE__ */ factory(name71, dependencies71, (_ref) => {
  var {
    typed: typed2,
    matrix: matrix2,
    subtractScalar: subtractScalar2,
    multiply: multiply2,
    divideScalar: divideScalar2,
    isZero: isZero2,
    unaryMinus: unaryMinus2
  } = _ref;
  return typed2(name71, {
    any: function any(x) {
      return clone(x);
    },
    "Array | Matrix": function det2(x) {
      var size2;
      if (isMatrix(x)) {
        size2 = x.size();
      } else if (Array.isArray(x)) {
        x = matrix2(x);
        size2 = x.size();
      } else {
        size2 = [];
      }
      switch (size2.length) {
        case 0:
          return clone(x);
        case 1:
          if (size2[0] === 1) {
            return clone(x.valueOf()[0]);
          }
          if (size2[0] === 0) {
            return 1;
          } else {
            throw new RangeError("Matrix must be square (size: " + format3(size2) + ")");
          }
        case 2: {
          var rows = size2[0];
          var cols = size2[1];
          if (rows === cols) {
            return _det(x.clone().valueOf(), rows, cols);
          }
          if (cols === 0) {
            return 1;
          } else {
            throw new RangeError("Matrix must be square (size: " + format3(size2) + ")");
          }
        }
        default:
          throw new RangeError("Matrix must be two dimensional (size: " + format3(size2) + ")");
      }
    }
  });
  function _det(matrix3, rows, cols) {
    if (rows === 1) {
      return clone(matrix3[0][0]);
    } else if (rows === 2) {
      return subtractScalar2(multiply2(matrix3[0][0], matrix3[1][1]), multiply2(matrix3[1][0], matrix3[0][1]));
    } else {
      var negated = false;
      var rowIndices = new Array(rows).fill(0).map((_, i2) => i2);
      for (var k = 0; k < rows; k++) {
        var k_ = rowIndices[k];
        if (isZero2(matrix3[k_][k])) {
          var _k = void 0;
          for (_k = k + 1; _k < rows; _k++) {
            if (!isZero2(matrix3[rowIndices[_k]][k])) {
              k_ = rowIndices[_k];
              rowIndices[_k] = rowIndices[k];
              rowIndices[k] = k_;
              negated = !negated;
              break;
            }
          }
          if (_k === rows)
            return matrix3[k_][k];
        }
        var piv = matrix3[k_][k];
        var piv_ = k === 0 ? 1 : matrix3[rowIndices[k - 1]][k - 1];
        for (var i = k + 1; i < rows; i++) {
          var i_ = rowIndices[i];
          for (var j = k + 1; j < rows; j++) {
            matrix3[i_][j] = divideScalar2(subtractScalar2(multiply2(matrix3[i_][j], piv), multiply2(matrix3[i_][k], matrix3[k_][j])), piv_);
          }
        }
      }
      var det2 = matrix3[rowIndices[rows - 1]][rows - 1];
      return negated ? unaryMinus2(det2) : det2;
    }
  }
});

// node_modules/mathjs/lib/esm/function/matrix/inv.js
var name72 = "inv";
var dependencies72 = ["typed", "matrix", "divideScalar", "addScalar", "multiply", "unaryMinus", "det", "identity", "abs"];
var createInv = /* @__PURE__ */ factory(name72, dependencies72, (_ref) => {
  var {
    typed: typed2,
    matrix: matrix2,
    divideScalar: divideScalar2,
    addScalar: addScalar2,
    multiply: multiply2,
    unaryMinus: unaryMinus2,
    det: det2,
    identity: identity2,
    abs: abs3
  } = _ref;
  return typed2(name72, {
    "Array | Matrix": function ArrayMatrix(x) {
      var size2 = isMatrix(x) ? x.size() : arraySize(x);
      switch (size2.length) {
        case 1:
          if (size2[0] === 1) {
            if (isMatrix(x)) {
              return matrix2([divideScalar2(1, x.valueOf()[0])]);
            } else {
              return [divideScalar2(1, x[0])];
            }
          } else {
            throw new RangeError("Matrix must be square (size: " + format3(size2) + ")");
          }
        case 2: {
          var rows = size2[0];
          var cols = size2[1];
          if (rows === cols) {
            if (isMatrix(x)) {
              return matrix2(_inv(x.valueOf(), rows, cols), x.storage());
            } else {
              return _inv(x, rows, cols);
            }
          } else {
            throw new RangeError("Matrix must be square (size: " + format3(size2) + ")");
          }
        }
        default:
          throw new RangeError("Matrix must be two dimensional (size: " + format3(size2) + ")");
      }
    },
    any: function any(x) {
      return divideScalar2(1, x);
    }
  });
  function _inv(mat, rows, cols) {
    var r, s, f, value, temp;
    if (rows === 1) {
      value = mat[0][0];
      if (value === 0) {
        throw Error("Cannot calculate inverse, determinant is zero");
      }
      return [[divideScalar2(1, value)]];
    } else if (rows === 2) {
      var d = det2(mat);
      if (d === 0) {
        throw Error("Cannot calculate inverse, determinant is zero");
      }
      return [[divideScalar2(mat[1][1], d), divideScalar2(unaryMinus2(mat[0][1]), d)], [divideScalar2(unaryMinus2(mat[1][0]), d), divideScalar2(mat[0][0], d)]];
    } else {
      var A = mat.concat();
      for (r = 0; r < rows; r++) {
        A[r] = A[r].concat();
      }
      var B = identity2(rows).valueOf();
      for (var c = 0; c < cols; c++) {
        var ABig = abs3(A[c][c]);
        var rBig = c;
        r = c + 1;
        while (r < rows) {
          if (abs3(A[r][c]) > ABig) {
            ABig = abs3(A[r][c]);
            rBig = r;
          }
          r++;
        }
        if (ABig === 0) {
          throw Error("Cannot calculate inverse, determinant is zero");
        }
        r = rBig;
        if (r !== c) {
          temp = A[c];
          A[c] = A[r];
          A[r] = temp;
          temp = B[c];
          B[c] = B[r];
          B[r] = temp;
        }
        var Ac = A[c];
        var Bc = B[c];
        for (r = 0; r < rows; r++) {
          var Ar = A[r];
          var Br = B[r];
          if (r !== c) {
            if (Ar[c] !== 0) {
              f = divideScalar2(unaryMinus2(Ar[c]), Ac[c]);
              for (s = c; s < cols; s++) {
                Ar[s] = addScalar2(Ar[s], multiply2(f, Ac[s]));
              }
              for (s = 0; s < cols; s++) {
                Br[s] = addScalar2(Br[s], multiply2(f, Bc[s]));
              }
            }
          } else {
            f = Ac[c];
            for (s = c; s < cols; s++) {
              Ar[s] = divideScalar2(Ar[s], f);
            }
            for (s = 0; s < cols; s++) {
              Br[s] = divideScalar2(Br[s], f);
            }
          }
        }
      }
      return B;
    }
  }
});

// node_modules/mathjs/lib/esm/function/matrix/eigs/complexEigs.js
function createComplexEigs(_ref) {
  var {
    addScalar: addScalar2,
    subtract: subtract2,
    flatten: flatten3,
    multiply: multiply2,
    multiplyScalar: multiplyScalar2,
    divideScalar: divideScalar2,
    sqrt: sqrt3,
    abs: abs3,
    bignumber: bignumber2,
    diag: diag2,
    inv: inv2,
    qr: qr2,
    usolve: usolve2,
    usolveAll: usolveAll2,
    equal: equal2,
    complex: complex2,
    larger: larger2,
    smaller: smaller2,
    matrixFromColumns: matrixFromColumns2,
    dot: dot2
  } = _ref;
  function complexEigs(arr, N, prec, type, findVectors) {
    if (findVectors === void 0) {
      findVectors = true;
    }
    var R = balance(arr, N, prec, type, findVectors);
    reduceToHessenberg(arr, N, prec, type, findVectors, R);
    var {
      values,
      C
    } = iterateUntilTriangular(arr, N, prec, type, findVectors);
    var vectors;
    if (findVectors) {
      vectors = findEigenvectors(arr, N, C, R, values, prec, type);
      vectors = matrixFromColumns2(...vectors);
    }
    return {
      values,
      vectors
    };
  }
  function balance(arr, N, prec, type, findVectors) {
    var big = type === "BigNumber";
    var cplx = type === "Complex";
    var realzero = big ? bignumber2(0) : 0;
    var one = big ? bignumber2(1) : cplx ? complex2(1) : 1;
    var realone = big ? bignumber2(1) : 1;
    var radix = big ? bignumber2(10) : 2;
    var radixSq = multiplyScalar2(radix, radix);
    var Rdiag;
    if (findVectors) {
      Rdiag = Array(N).fill(one);
    }
    var last = false;
    while (!last) {
      last = true;
      for (var i = 0; i < N; i++) {
        var colNorm = realzero;
        var rowNorm = realzero;
        for (var j = 0; j < N; j++) {
          if (i === j)
            continue;
          var c = abs3(arr[i][j]);
          colNorm = addScalar2(colNorm, c);
          rowNorm = addScalar2(rowNorm, c);
        }
        if (!equal2(colNorm, 0) && !equal2(rowNorm, 0)) {
          var f = realone;
          var _c = colNorm;
          var rowDivRadix = divideScalar2(rowNorm, radix);
          var rowMulRadix = multiplyScalar2(rowNorm, radix);
          while (smaller2(_c, rowDivRadix)) {
            _c = multiplyScalar2(_c, radixSq);
            f = multiplyScalar2(f, radix);
          }
          while (larger2(_c, rowMulRadix)) {
            _c = divideScalar2(_c, radixSq);
            f = divideScalar2(f, radix);
          }
          var condition = smaller2(divideScalar2(addScalar2(_c, rowNorm), f), multiplyScalar2(addScalar2(colNorm, rowNorm), 0.95));
          if (condition) {
            last = false;
            var g = divideScalar2(1, f);
            for (var _j = 0; _j < N; _j++) {
              if (i === _j) {
                continue;
              }
              arr[i][_j] = multiplyScalar2(arr[i][_j], f);
              arr[_j][i] = multiplyScalar2(arr[_j][i], g);
            }
            if (findVectors) {
              Rdiag[i] = multiplyScalar2(Rdiag[i], f);
            }
          }
        }
      }
    }
    return diag2(Rdiag);
  }
  function reduceToHessenberg(arr, N, prec, type, findVectors, R) {
    var big = type === "BigNumber";
    var cplx = type === "Complex";
    var zero = big ? bignumber2(0) : cplx ? complex2(0) : 0;
    if (big) {
      prec = bignumber2(prec);
    }
    for (var i = 0; i < N - 2; i++) {
      var maxIndex = 0;
      var max2 = zero;
      for (var j = i + 1; j < N; j++) {
        var el = arr[j][i];
        if (smaller2(abs3(max2), abs3(el))) {
          max2 = el;
          maxIndex = j;
        }
      }
      if (smaller2(abs3(max2), prec)) {
        continue;
      }
      if (maxIndex !== i + 1) {
        var tmp1 = arr[maxIndex];
        arr[maxIndex] = arr[i + 1];
        arr[i + 1] = tmp1;
        for (var _j2 = 0; _j2 < N; _j2++) {
          var tmp2 = arr[_j2][maxIndex];
          arr[_j2][maxIndex] = arr[_j2][i + 1];
          arr[_j2][i + 1] = tmp2;
        }
        if (findVectors) {
          var tmp3 = R[maxIndex];
          R[maxIndex] = R[i + 1];
          R[i + 1] = tmp3;
        }
      }
      for (var _j3 = i + 2; _j3 < N; _j3++) {
        var n = divideScalar2(arr[_j3][i], max2);
        if (n === 0) {
          continue;
        }
        for (var k = 0; k < N; k++) {
          arr[_j3][k] = subtract2(arr[_j3][k], multiplyScalar2(n, arr[i + 1][k]));
        }
        for (var _k = 0; _k < N; _k++) {
          arr[_k][i + 1] = addScalar2(arr[_k][i + 1], multiplyScalar2(n, arr[_k][_j3]));
        }
        if (findVectors) {
          for (var _k2 = 0; _k2 < N; _k2++) {
            R[_j3][_k2] = subtract2(R[_j3][_k2], multiplyScalar2(n, R[i + 1][_k2]));
          }
        }
      }
    }
    return R;
  }
  function iterateUntilTriangular(A, N, prec, type, findVectors) {
    var big = type === "BigNumber";
    var cplx = type === "Complex";
    var one = big ? bignumber2(1) : cplx ? complex2(1) : 1;
    if (big) {
      prec = bignumber2(prec);
    }
    var arr = clone(A);
    var lambdas = [];
    var n = N;
    var Sdiag = [];
    var Qtotal = findVectors ? diag2(Array(N).fill(one)) : void 0;
    var Qpartial = findVectors ? diag2(Array(n).fill(one)) : void 0;
    var lastConvergenceBefore = 0;
    while (lastConvergenceBefore <= 100) {
      lastConvergenceBefore += 1;
      var k = 0;
      for (var i = 0; i < n; i++) {
        arr[i][i] = subtract2(arr[i][i], k);
      }
      var {
        Q,
        R
      } = qr2(arr);
      arr = multiply2(R, Q);
      for (var _i = 0; _i < n; _i++) {
        arr[_i][_i] = addScalar2(arr[_i][_i], k);
      }
      if (findVectors) {
        Qpartial = multiply2(Qpartial, Q);
      }
      if (n === 1 || smaller2(abs3(arr[n - 1][n - 2]), prec)) {
        lastConvergenceBefore = 0;
        lambdas.push(arr[n - 1][n - 1]);
        if (findVectors) {
          Sdiag.unshift([[1]]);
          inflateMatrix(Qpartial, N);
          Qtotal = multiply2(Qtotal, Qpartial);
          if (n > 1) {
            Qpartial = diag2(Array(n - 1).fill(one));
          }
        }
        n -= 1;
        arr.pop();
        for (var _i2 = 0; _i2 < n; _i2++) {
          arr[_i2].pop();
        }
      } else if (n === 2 || smaller2(abs3(arr[n - 2][n - 3]), prec)) {
        lastConvergenceBefore = 0;
        var ll = eigenvalues2x2(arr[n - 2][n - 2], arr[n - 2][n - 1], arr[n - 1][n - 2], arr[n - 1][n - 1]);
        lambdas.push(...ll);
        if (findVectors) {
          Sdiag.unshift(jordanBase2x2(arr[n - 2][n - 2], arr[n - 2][n - 1], arr[n - 1][n - 2], arr[n - 1][n - 1], ll[0], ll[1], prec, type));
          inflateMatrix(Qpartial, N);
          Qtotal = multiply2(Qtotal, Qpartial);
          if (n > 2) {
            Qpartial = diag2(Array(n - 2).fill(one));
          }
        }
        n -= 2;
        arr.pop();
        arr.pop();
        for (var _i3 = 0; _i3 < n; _i3++) {
          arr[_i3].pop();
          arr[_i3].pop();
        }
      }
      if (n === 0) {
        break;
      }
    }
    lambdas.sort((a, b) => +subtract2(abs3(a), abs3(b)));
    if (lastConvergenceBefore > 100) {
      var err = Error("The eigenvalues failed to converge. Only found these eigenvalues: " + lambdas.join(", "));
      err.values = lambdas;
      err.vectors = [];
      throw err;
    }
    var C = findVectors ? multiply2(Qtotal, blockDiag(Sdiag, N)) : void 0;
    return {
      values: lambdas,
      C
    };
  }
  function findEigenvectors(A, N, C, R, values, prec, type) {
    var Cinv = inv2(C);
    var U = multiply2(Cinv, A, C);
    var big = type === "BigNumber";
    var cplx = type === "Complex";
    var zero = big ? bignumber2(0) : cplx ? complex2(0) : 0;
    var one = big ? bignumber2(1) : cplx ? complex2(1) : 1;
    var uniqueValues = [];
    var multiplicities = [];
    for (var \u03BB of values) {
      var i = indexOf(uniqueValues, \u03BB, equal2);
      if (i === -1) {
        uniqueValues.push(\u03BB);
        multiplicities.push(1);
      } else {
        multiplicities[i] += 1;
      }
    }
    var vectors = [];
    var len = uniqueValues.length;
    var b = Array(N).fill(zero);
    var E = diag2(Array(N).fill(one));
    var failedLambdas = [];
    var _loop = function _loop2() {
      var \u03BB2 = uniqueValues[_i4];
      var S = subtract2(U, multiply2(\u03BB2, E));
      var solutions = usolveAll2(S, b);
      solutions.shift();
      while (solutions.length < multiplicities[_i4]) {
        var approxVec = inverseIterate(S, N, solutions, prec, type);
        if (approxVec == null) {
          failedLambdas.push(\u03BB2);
          break;
        }
        solutions.push(approxVec);
      }
      var correction = multiply2(inv2(R), C);
      solutions = solutions.map((v) => multiply2(correction, v));
      vectors.push(...solutions.map((v) => flatten3(v)));
    };
    for (var _i4 = 0; _i4 < len; _i4++) {
      _loop();
    }
    if (failedLambdas.length !== 0) {
      var err = new Error("Failed to find eigenvectors for the following eigenvalues: " + failedLambdas.join(", "));
      err.values = values;
      err.vectors = vectors;
      throw err;
    }
    return vectors;
  }
  function eigenvalues2x2(a, b, c, d) {
    var trA = addScalar2(a, d);
    var detA = subtract2(multiplyScalar2(a, d), multiplyScalar2(b, c));
    var x = multiplyScalar2(trA, 0.5);
    var y = multiplyScalar2(sqrt3(subtract2(multiplyScalar2(trA, trA), multiplyScalar2(4, detA))), 0.5);
    return [addScalar2(x, y), subtract2(x, y)];
  }
  function jordanBase2x2(a, b, c, d, l1, l2, prec, type) {
    var big = type === "BigNumber";
    var cplx = type === "Complex";
    var zero = big ? bignumber2(0) : cplx ? complex2(0) : 0;
    var one = big ? bignumber2(1) : cplx ? complex2(1) : 1;
    if (smaller2(abs3(c), prec)) {
      return [[one, zero], [zero, one]];
    }
    if (larger2(abs3(subtract2(l1, l2)), prec)) {
      return [[subtract2(l1, d), subtract2(l2, d)], [c, c]];
    }
    var na = subtract2(a, l1);
    var nb = subtract2(b, l1);
    var nc = subtract2(c, l1);
    var nd = subtract2(d, l1);
    if (smaller2(abs3(nb), prec)) {
      return [[na, one], [nc, zero]];
    } else {
      return [[nb, zero], [nd, one]];
    }
  }
  function inflateMatrix(arr, N) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].push(...Array(N - arr[i].length).fill(0));
    }
    for (var _i5 = arr.length; _i5 < N; _i5++) {
      arr.push(Array(N).fill(0));
      arr[_i5][_i5] = 1;
    }
    return arr;
  }
  function blockDiag(arr, N) {
    var M = [];
    for (var i = 0; i < N; i++) {
      M[i] = Array(N).fill(0);
    }
    var I = 0;
    for (var sub2 of arr) {
      var n = sub2.length;
      for (var _i6 = 0; _i6 < n; _i6++) {
        for (var j = 0; j < n; j++) {
          M[I + _i6][I + j] = sub2[_i6][j];
        }
      }
      I += n;
    }
    return M;
  }
  function indexOf(arr, el, fn) {
    for (var i = 0; i < arr.length; i++) {
      if (fn(arr[i], el)) {
        return i;
      }
    }
    return -1;
  }
  function inverseIterate(A, N, orthog, prec, type) {
    var largeNum = type === "BigNumber" ? bignumber2(1e3) : 1e3;
    var b;
    var i = 0;
    while (true) {
      b = randomOrthogonalVector(N, orthog, type);
      b = usolve2(A, b);
      if (larger2(norm2(b), largeNum)) {
        break;
      }
      if (++i >= 5) {
        return null;
      }
    }
    i = 0;
    while (true) {
      var c = usolve2(A, b);
      if (smaller2(norm2(orthogonalComplement(b, [c])), prec)) {
        break;
      }
      if (++i >= 10) {
        return null;
      }
      b = normalize(c);
    }
    return b;
  }
  function randomOrthogonalVector(N, orthog, type) {
    var big = type === "BigNumber";
    var cplx = type === "Complex";
    var v = Array(N).fill(0).map((_) => 2 * Math.random() - 1);
    if (big) {
      v = v.map((n) => bignumber2(n));
    }
    if (cplx) {
      v = v.map((n) => complex2(n));
    }
    v = orthogonalComplement(v, orthog);
    return normalize(v, type);
  }
  function orthogonalComplement(v, orthog) {
    for (var w of orthog) {
      v = subtract2(v, multiply2(divideScalar2(dot2(w, v), dot2(w, w)), w));
    }
    return v;
  }
  function norm2(v) {
    return abs3(sqrt3(dot2(v, v)));
  }
  function normalize(v, type) {
    var big = type === "BigNumber";
    var cplx = type === "Complex";
    var one = big ? bignumber2(1) : cplx ? complex2(1) : 1;
    return multiply2(divideScalar2(one, norm2(v)), v);
  }
  return complexEigs;
}

// node_modules/mathjs/lib/esm/function/matrix/eigs/realSymetric.js
function createRealSymmetric(_ref) {
  var {
    config: config4,
    addScalar: addScalar2,
    subtract: subtract2,
    abs: abs3,
    atan: atan4,
    cos: cos3,
    sin: sin3,
    multiplyScalar: multiplyScalar2,
    inv: inv2,
    bignumber: bignumber2,
    multiply: multiply2,
    add: add3
  } = _ref;
  function main(arr, N) {
    var prec = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : config4.epsilon;
    var type = arguments.length > 3 ? arguments[3] : void 0;
    if (type === "number") {
      return diag2(arr, prec);
    }
    if (type === "BigNumber") {
      return diagBig(arr, prec);
    }
    throw TypeError("Unsupported data type: " + type);
  }
  function diag2(x, precision) {
    var N = x.length;
    var e0 = Math.abs(precision / N);
    var psi;
    var Sij = new Array(N);
    for (var i = 0; i < N; i++) {
      Sij[i] = createArray(N, 0);
      Sij[i][i] = 1;
    }
    var Vab = getAij(x);
    while (Math.abs(Vab[1]) >= Math.abs(e0)) {
      var _i = Vab[0][0];
      var j = Vab[0][1];
      psi = getTheta(x[_i][_i], x[j][j], x[_i][j]);
      x = x1(x, psi, _i, j);
      Sij = Sij1(Sij, psi, _i, j);
      Vab = getAij(x);
    }
    var Ei = createArray(N, 0);
    for (var _i2 = 0; _i2 < N; _i2++) {
      Ei[_i2] = x[_i2][_i2];
    }
    return sorting(clone(Ei), clone(Sij));
  }
  function diagBig(x, precision) {
    var N = x.length;
    var e0 = abs3(precision / N);
    var psi;
    var Sij = new Array(N);
    for (var i = 0; i < N; i++) {
      Sij[i] = createArray(N, 0);
      Sij[i][i] = 1;
    }
    var Vab = getAijBig(x);
    while (abs3(Vab[1]) >= abs3(e0)) {
      var _i3 = Vab[0][0];
      var j = Vab[0][1];
      psi = getThetaBig(x[_i3][_i3], x[j][j], x[_i3][j]);
      x = x1Big(x, psi, _i3, j);
      Sij = Sij1Big(Sij, psi, _i3, j);
      Vab = getAijBig(x);
    }
    var Ei = createArray(N, 0);
    for (var _i4 = 0; _i4 < N; _i4++) {
      Ei[_i4] = x[_i4][_i4];
    }
    return sorting(clone(Ei), clone(Sij));
  }
  function getTheta(aii, ajj, aij) {
    var denom = ajj - aii;
    if (Math.abs(denom) <= config4.epsilon) {
      return Math.PI / 4;
    } else {
      return 0.5 * Math.atan(2 * aij / (ajj - aii));
    }
  }
  function getThetaBig(aii, ajj, aij) {
    var denom = subtract2(ajj, aii);
    if (abs3(denom) <= config4.epsilon) {
      return bignumber2(-1).acos().div(4);
    } else {
      return multiplyScalar2(0.5, atan4(multiply2(2, aij, inv2(denom))));
    }
  }
  function Sij1(Sij, theta, i, j) {
    var N = Sij.length;
    var c = Math.cos(theta);
    var s = Math.sin(theta);
    var Ski = createArray(N, 0);
    var Skj = createArray(N, 0);
    for (var k = 0; k < N; k++) {
      Ski[k] = c * Sij[k][i] - s * Sij[k][j];
      Skj[k] = s * Sij[k][i] + c * Sij[k][j];
    }
    for (var _k = 0; _k < N; _k++) {
      Sij[_k][i] = Ski[_k];
      Sij[_k][j] = Skj[_k];
    }
    return Sij;
  }
  function Sij1Big(Sij, theta, i, j) {
    var N = Sij.length;
    var c = cos3(theta);
    var s = sin3(theta);
    var Ski = createArray(N, bignumber2(0));
    var Skj = createArray(N, bignumber2(0));
    for (var k = 0; k < N; k++) {
      Ski[k] = subtract2(multiplyScalar2(c, Sij[k][i]), multiplyScalar2(s, Sij[k][j]));
      Skj[k] = addScalar2(multiplyScalar2(s, Sij[k][i]), multiplyScalar2(c, Sij[k][j]));
    }
    for (var _k2 = 0; _k2 < N; _k2++) {
      Sij[_k2][i] = Ski[_k2];
      Sij[_k2][j] = Skj[_k2];
    }
    return Sij;
  }
  function x1Big(Hij, theta, i, j) {
    var N = Hij.length;
    var c = bignumber2(cos3(theta));
    var s = bignumber2(sin3(theta));
    var c2 = multiplyScalar2(c, c);
    var s2 = multiplyScalar2(s, s);
    var Aki = createArray(N, bignumber2(0));
    var Akj = createArray(N, bignumber2(0));
    var csHij = multiply2(bignumber2(2), c, s, Hij[i][j]);
    var Aii = addScalar2(subtract2(multiplyScalar2(c2, Hij[i][i]), csHij), multiplyScalar2(s2, Hij[j][j]));
    var Ajj = add3(multiplyScalar2(s2, Hij[i][i]), csHij, multiplyScalar2(c2, Hij[j][j]));
    for (var k = 0; k < N; k++) {
      Aki[k] = subtract2(multiplyScalar2(c, Hij[i][k]), multiplyScalar2(s, Hij[j][k]));
      Akj[k] = addScalar2(multiplyScalar2(s, Hij[i][k]), multiplyScalar2(c, Hij[j][k]));
    }
    Hij[i][i] = Aii;
    Hij[j][j] = Ajj;
    Hij[i][j] = bignumber2(0);
    Hij[j][i] = bignumber2(0);
    for (var _k3 = 0; _k3 < N; _k3++) {
      if (_k3 !== i && _k3 !== j) {
        Hij[i][_k3] = Aki[_k3];
        Hij[_k3][i] = Aki[_k3];
        Hij[j][_k3] = Akj[_k3];
        Hij[_k3][j] = Akj[_k3];
      }
    }
    return Hij;
  }
  function x1(Hij, theta, i, j) {
    var N = Hij.length;
    var c = Math.cos(theta);
    var s = Math.sin(theta);
    var c2 = c * c;
    var s2 = s * s;
    var Aki = createArray(N, 0);
    var Akj = createArray(N, 0);
    var Aii = c2 * Hij[i][i] - 2 * c * s * Hij[i][j] + s2 * Hij[j][j];
    var Ajj = s2 * Hij[i][i] + 2 * c * s * Hij[i][j] + c2 * Hij[j][j];
    for (var k = 0; k < N; k++) {
      Aki[k] = c * Hij[i][k] - s * Hij[j][k];
      Akj[k] = s * Hij[i][k] + c * Hij[j][k];
    }
    Hij[i][i] = Aii;
    Hij[j][j] = Ajj;
    Hij[i][j] = 0;
    Hij[j][i] = 0;
    for (var _k4 = 0; _k4 < N; _k4++) {
      if (_k4 !== i && _k4 !== j) {
        Hij[i][_k4] = Aki[_k4];
        Hij[_k4][i] = Aki[_k4];
        Hij[j][_k4] = Akj[_k4];
        Hij[_k4][j] = Akj[_k4];
      }
    }
    return Hij;
  }
  function getAij(Mij) {
    var N = Mij.length;
    var maxMij = 0;
    var maxIJ = [0, 1];
    for (var i = 0; i < N; i++) {
      for (var j = i + 1; j < N; j++) {
        if (Math.abs(maxMij) < Math.abs(Mij[i][j])) {
          maxMij = Math.abs(Mij[i][j]);
          maxIJ = [i, j];
        }
      }
    }
    return [maxIJ, maxMij];
  }
  function getAijBig(Mij) {
    var N = Mij.length;
    var maxMij = 0;
    var maxIJ = [0, 1];
    for (var i = 0; i < N; i++) {
      for (var j = i + 1; j < N; j++) {
        if (abs3(maxMij) < abs3(Mij[i][j])) {
          maxMij = abs3(Mij[i][j]);
          maxIJ = [i, j];
        }
      }
    }
    return [maxIJ, maxMij];
  }
  function sorting(E, S) {
    var N = E.length;
    var values = Array(N);
    var vectors = Array(N);
    for (var k = 0; k < N; k++) {
      vectors[k] = Array(N);
    }
    for (var i = 0; i < N; i++) {
      var minID = 0;
      var minE = E[0];
      for (var j = 0; j < E.length; j++) {
        if (abs3(E[j]) < abs3(minE)) {
          minID = j;
          minE = E[minID];
        }
      }
      values[i] = E.splice(minID, 1)[0];
      for (var _k5 = 0; _k5 < N; _k5++) {
        vectors[_k5][i] = S[_k5][minID];
        S[_k5].splice(minID, 1);
      }
    }
    return {
      values,
      vectors
    };
  }
  function createArray(size2, value) {
    var array = new Array(size2);
    for (var i = 0; i < size2; i++) {
      array[i] = value;
    }
    return array;
  }
  return main;
}

// node_modules/mathjs/lib/esm/function/matrix/eigs.js
var name73 = "eigs";
var dependencies73 = ["config", "typed", "matrix", "addScalar", "equal", "subtract", "abs", "atan", "cos", "sin", "multiplyScalar", "divideScalar", "inv", "bignumber", "multiply", "add", "larger", "column", "flatten", "number", "complex", "sqrt", "diag", "qr", "usolve", "usolveAll", "im", "re", "smaller", "matrixFromColumns", "dot"];
var createEigs = /* @__PURE__ */ factory(name73, dependencies73, (_ref) => {
  var {
    config: config4,
    typed: typed2,
    matrix: matrix2,
    addScalar: addScalar2,
    subtract: subtract2,
    equal: equal2,
    abs: abs3,
    atan: atan4,
    cos: cos3,
    sin: sin3,
    multiplyScalar: multiplyScalar2,
    divideScalar: divideScalar2,
    inv: inv2,
    bignumber: bignumber2,
    multiply: multiply2,
    add: add3,
    larger: larger2,
    column: column2,
    flatten: flatten3,
    number: number2,
    complex: complex2,
    sqrt: sqrt3,
    diag: diag2,
    qr: qr2,
    usolve: usolve2,
    usolveAll: usolveAll2,
    im: im2,
    re: re2,
    smaller: smaller2,
    matrixFromColumns: matrixFromColumns2,
    dot: dot2
  } = _ref;
  var doRealSymetric = createRealSymmetric({
    config: config4,
    addScalar: addScalar2,
    subtract: subtract2,
    column: column2,
    flatten: flatten3,
    equal: equal2,
    abs: abs3,
    atan: atan4,
    cos: cos3,
    sin: sin3,
    multiplyScalar: multiplyScalar2,
    inv: inv2,
    bignumber: bignumber2,
    complex: complex2,
    multiply: multiply2,
    add: add3
  });
  var doComplexEigs = createComplexEigs({
    config: config4,
    addScalar: addScalar2,
    subtract: subtract2,
    multiply: multiply2,
    multiplyScalar: multiplyScalar2,
    flatten: flatten3,
    divideScalar: divideScalar2,
    sqrt: sqrt3,
    abs: abs3,
    bignumber: bignumber2,
    diag: diag2,
    qr: qr2,
    inv: inv2,
    usolve: usolve2,
    usolveAll: usolveAll2,
    equal: equal2,
    complex: complex2,
    larger: larger2,
    smaller: smaller2,
    matrixFromColumns: matrixFromColumns2,
    dot: dot2
  });
  return typed2("eigs", {
    Array: function Array2(x) {
      var mat = matrix2(x);
      return computeValuesAndVectors(mat);
    },
    "Array, number|BigNumber": function ArrayNumberBigNumber(x, prec) {
      var mat = matrix2(x);
      return computeValuesAndVectors(mat, prec);
    },
    Matrix: function Matrix2(mat) {
      var {
        values,
        vectors
      } = computeValuesAndVectors(mat);
      return {
        values: matrix2(values),
        vectors: matrix2(vectors)
      };
    },
    "Matrix, number|BigNumber": function MatrixNumberBigNumber(mat, prec) {
      var {
        values,
        vectors
      } = computeValuesAndVectors(mat, prec);
      return {
        values: matrix2(values),
        vectors: matrix2(vectors)
      };
    }
  });
  function computeValuesAndVectors(mat, prec) {
    if (prec === void 0) {
      prec = config4.epsilon;
    }
    var size2 = mat.size();
    if (size2.length !== 2 || size2[0] !== size2[1]) {
      throw new RangeError("Matrix must be square (size: " + format3(size2) + ")");
    }
    var arr = mat.toArray();
    var N = size2[0];
    if (isReal(arr, N, prec)) {
      coerceReal(arr, N);
      if (isSymmetric(arr, N, prec)) {
        var _type = coerceTypes(mat, arr, N);
        return doRealSymetric(arr, N, prec, _type);
      }
    }
    var type = coerceTypes(mat, arr, N);
    return doComplexEigs(arr, N, prec, type);
  }
  function isSymmetric(arr, N, prec) {
    for (var i = 0; i < N; i++) {
      for (var j = i; j < N; j++) {
        if (larger2(bignumber2(abs3(subtract2(arr[i][j], arr[j][i]))), prec)) {
          return false;
        }
      }
    }
    return true;
  }
  function isReal(arr, N, prec) {
    for (var i = 0; i < N; i++) {
      for (var j = 0; j < N; j++) {
        if (larger2(bignumber2(abs3(im2(arr[i][j]))), prec)) {
          return false;
        }
      }
    }
    return true;
  }
  function coerceReal(arr, N) {
    for (var i = 0; i < N; i++) {
      for (var j = 0; j < N; j++) {
        arr[i][j] = re2(arr[i][j]);
      }
    }
  }
  function coerceTypes(mat, arr, N) {
    var type = mat.datatype();
    if (type === "number" || type === "BigNumber" || type === "Complex") {
      return type;
    }
    var hasNumber = false;
    var hasBig = false;
    var hasComplex = false;
    for (var i = 0; i < N; i++) {
      for (var j = 0; j < N; j++) {
        var el = arr[i][j];
        if (isNumber(el) || isFraction(el)) {
          hasNumber = true;
        } else if (isBigNumber(el)) {
          hasBig = true;
        } else if (isComplex(el)) {
          hasComplex = true;
        } else {
          throw TypeError("Unsupported type in Matrix: " + typeOf(el));
        }
      }
    }
    if (hasBig && hasComplex) {
      console.warn("Complex BigNumbers not supported, this operation will lose precission.");
    }
    if (hasComplex) {
      for (var _i = 0; _i < N; _i++) {
        for (var _j = 0; _j < N; _j++) {
          arr[_i][_j] = complex2(arr[_i][_j]);
        }
      }
      return "Complex";
    }
    if (hasBig) {
      for (var _i2 = 0; _i2 < N; _i2++) {
        for (var _j2 = 0; _j2 < N; _j2++) {
          arr[_i2][_j2] = bignumber2(arr[_i2][_j2]);
        }
      }
      return "BigNumber";
    }
    if (hasNumber) {
      for (var _i3 = 0; _i3 < N; _i3++) {
        for (var _j3 = 0; _j3 < N; _j3++) {
          arr[_i3][_j3] = number2(arr[_i3][_j3]);
        }
      }
      return "number";
    } else {
      throw TypeError("Matrix contains unsupported types only.");
    }
  }
});

// node_modules/mathjs/lib/esm/entry/pureFunctionsAny.generated.js
var BigNumber = /* @__PURE__ */ createBigNumberClass({
  config
});
var Complex2 = /* @__PURE__ */ createComplexClass({});
var Fraction2 = /* @__PURE__ */ createFractionClass({});
var Matrix = /* @__PURE__ */ createMatrixClass({});
var DenseMatrix = /* @__PURE__ */ createDenseMatrixClass({
  Matrix
});
var typed = /* @__PURE__ */ createTyped({
  BigNumber,
  Complex: Complex2,
  DenseMatrix,
  Fraction: Fraction2
});
var abs2 = /* @__PURE__ */ createAbs({
  typed
});
var addScalar = /* @__PURE__ */ createAddScalar({
  typed
});
var atan3 = /* @__PURE__ */ createAtan({
  typed
});
var bignumber = /* @__PURE__ */ createBignumber({
  BigNumber,
  typed
});
var complex = /* @__PURE__ */ createComplex({
  Complex: Complex2,
  typed
});
var conj = /* @__PURE__ */ createConj({
  typed
});
var cos2 = /* @__PURE__ */ createCos({
  typed
});
var equalScalar = /* @__PURE__ */ createEqualScalar({
  config,
  typed
});
var getMatrixDataType = /* @__PURE__ */ createGetMatrixDataType({
  typed
});
var im = /* @__PURE__ */ createIm({
  typed
});
var isInteger2 = /* @__PURE__ */ createIsInteger({
  typed
});
var isPositive = /* @__PURE__ */ createIsPositive({
  typed
});
var isZero = /* @__PURE__ */ createIsZero({
  typed
});
var multiplyScalar = /* @__PURE__ */ createMultiplyScalar({
  typed
});
var number = /* @__PURE__ */ createNumber({
  typed
});
var re = /* @__PURE__ */ createRe({
  typed
});
var sign3 = /* @__PURE__ */ createSign({
  BigNumber,
  Fraction: Fraction2,
  complex,
  typed
});
var sin2 = /* @__PURE__ */ createSin({
  typed
});
var SparseMatrix = /* @__PURE__ */ createSparseMatrixClass({
  Matrix,
  equalScalar,
  typed
});
var subtractScalar = /* @__PURE__ */ createSubtractScalar({
  typed
});
var sqrt2 = /* @__PURE__ */ createSqrt({
  Complex: Complex2,
  config,
  typed
});
var unaryMinus = /* @__PURE__ */ createUnaryMinus({
  typed
});
var fraction = /* @__PURE__ */ createFraction({
  Fraction: Fraction2,
  typed
});
var matrix = /* @__PURE__ */ createMatrix({
  DenseMatrix,
  Matrix,
  SparseMatrix,
  typed
});
var numeric = /* @__PURE__ */ createNumeric({
  bignumber,
  fraction,
  number
});
var size = /* @__PURE__ */ createSize({
  matrix,
  config,
  typed
});
var transpose = /* @__PURE__ */ createTranspose({
  matrix,
  typed
});
var zeros2 = /* @__PURE__ */ createZeros({
  BigNumber,
  config,
  matrix,
  typed
});
var concat2 = /* @__PURE__ */ createConcat({
  isInteger: isInteger2,
  matrix,
  typed
});
var ctranspose = /* @__PURE__ */ createCtranspose({
  conj,
  transpose,
  typed
});
var diag = /* @__PURE__ */ createDiag({
  DenseMatrix,
  SparseMatrix,
  matrix,
  typed
});
var divideScalar = /* @__PURE__ */ createDivideScalar({
  numeric,
  typed
});
var equal = /* @__PURE__ */ createEqual({
  DenseMatrix,
  concat: concat2,
  equalScalar,
  matrix,
  typed
});
var flatten2 = /* @__PURE__ */ createFlatten({
  matrix,
  typed
});
var identity = /* @__PURE__ */ createIdentity({
  BigNumber,
  DenseMatrix,
  SparseMatrix,
  config,
  matrix,
  typed
});
var largerEq = /* @__PURE__ */ createLargerEq({
  DenseMatrix,
  concat: concat2,
  config,
  matrix,
  typed
});
var matrixFromColumns = /* @__PURE__ */ createMatrixFromColumns({
  flatten: flatten2,
  matrix,
  size,
  typed
});
var qr = /* @__PURE__ */ createQr({
  addScalar,
  complex,
  conj,
  divideScalar,
  equal,
  identity,
  isZero,
  matrix,
  multiplyScalar,
  sign: sign3,
  sqrt: sqrt2,
  subtractScalar,
  typed,
  unaryMinus,
  zeros: zeros2
});
var smaller = /* @__PURE__ */ createSmaller({
  DenseMatrix,
  concat: concat2,
  config,
  matrix,
  typed
});
var subtract = /* @__PURE__ */ createSubtract({
  DenseMatrix,
  concat: concat2,
  equalScalar,
  matrix,
  subtractScalar,
  typed,
  unaryMinus
});
var usolve = /* @__PURE__ */ createUsolve({
  DenseMatrix,
  divideScalar,
  equalScalar,
  matrix,
  multiplyScalar,
  subtractScalar,
  typed
});
var add2 = /* @__PURE__ */ createAdd({
  DenseMatrix,
  SparseMatrix,
  addScalar,
  concat: concat2,
  equalScalar,
  matrix,
  typed
});
var dot = /* @__PURE__ */ createDot({
  addScalar,
  conj,
  multiplyScalar,
  size,
  typed
});
var ImmutableDenseMatrix = /* @__PURE__ */ createImmutableDenseMatrixClass({
  DenseMatrix,
  smaller
});
var Index = /* @__PURE__ */ createIndexClass({
  ImmutableDenseMatrix,
  getMatrixDataType
});
var larger = /* @__PURE__ */ createLarger({
  DenseMatrix,
  concat: concat2,
  config,
  matrix,
  typed
});
var multiply = /* @__PURE__ */ createMultiply({
  addScalar,
  dot,
  equalScalar,
  matrix,
  multiplyScalar,
  typed
});
var usolveAll = /* @__PURE__ */ createUsolveAll({
  DenseMatrix,
  divideScalar,
  equalScalar,
  matrix,
  multiplyScalar,
  subtractScalar,
  typed
});
var det = /* @__PURE__ */ createDet({
  divideScalar,
  isZero,
  matrix,
  multiply,
  subtractScalar,
  typed,
  unaryMinus
});
var smallerEq = /* @__PURE__ */ createSmallerEq({
  DenseMatrix,
  concat: concat2,
  config,
  matrix,
  typed
});
var range = /* @__PURE__ */ createRange({
  bignumber,
  matrix,
  add: add2,
  config,
  isPositive,
  larger,
  largerEq,
  smaller,
  smallerEq,
  typed
});
var column = /* @__PURE__ */ createColumn({
  Index,
  matrix,
  range,
  typed
});
var inv = /* @__PURE__ */ createInv({
  abs: abs2,
  addScalar,
  det,
  divideScalar,
  identity,
  matrix,
  multiply,
  typed,
  unaryMinus
});
var pow2 = /* @__PURE__ */ createPow({
  Complex: Complex2,
  config,
  fraction,
  identity,
  inv,
  matrix,
  multiply,
  number,
  typed
});
var eigs = /* @__PURE__ */ createEigs({
  abs: abs2,
  add: add2,
  addScalar,
  atan: atan3,
  bignumber,
  column,
  complex,
  config,
  cos: cos2,
  diag,
  divideScalar,
  dot,
  equal,
  flatten: flatten2,
  im,
  inv,
  larger,
  matrix,
  matrixFromColumns,
  multiply,
  multiplyScalar,
  number,
  qr,
  re,
  sin: sin2,
  smaller,
  sqrt: sqrt2,
  subtract,
  typed,
  usolve,
  usolveAll
});
var norm = /* @__PURE__ */ createNorm({
  abs: abs2,
  add: add2,
  conj,
  ctranspose,
  eigs,
  equalScalar,
  larger,
  matrix,
  multiply,
  pow: pow2,
  smaller,
  sqrt: sqrt2,
  typed
});

// src/library/utils/cell-summary-similarity.js
function cosineSim(a, b) {
  return dot(a, b) / (norm(a) * norm(b));
}
function getCellDistributionSimilarity(cellsA, cellsB) {
  const keySet = new Set(Object.keys(cellsA));
  let sharedKey = false;
  for (const key of Object.keys(cellsB)) {
    if (keySet.has(key)) {
      sharedKey = true;
    }
    keySet.add(key);
  }
  if (sharedKey) {
    const keys = [...keySet];
    const valuesA = keys.map((key) => cellsA[key] ?? 0);
    const valuesB = keys.map((key) => cellsB[key] ?? 0);
    return cosineSim(valuesA, valuesB);
  } else {
    return 0;
  }
}

// src/library/queries/construct-rui-locations.rq
var construct_rui_locations_default = '#   This SPARQL query constructs a result set representing detailed information about tissue donors, samples, spatial entities,\n#   datasets, and their relationships. It combines data from the CCF ontology and experimental data sources.\n#  \n#  * Query Structure:\n#       The query uses the CONSTRUCT statement to build a result set containing information about tissue donors, samples, spatial entities,\n#       datasets, and their relationships. It retrieves data from the CCF ontology and external data sources.\n#       The query constructs nodes for various entities, including tissue donors, samples, spatial entities, datasets, and spatial placements.\n#       It also captures details such as sex, age, BMI, consortium names, creator information, dimensions, annotations, and more.\n#\n#  * Note: The filter parameters (e.g., age, sex, BMI) can be added dynamically by the API user.\n#          The string filter commented below serves as a placeholder and will be replaced with the appropriate filter conditions\n#          when used in the API call.\nPREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nPREFIX ccf: <http://purl.org/ccf/>\nPREFIX dcterms:<http://purl.org/dc/terms/>\nPREFIX ctpop: <https://cns-iu.github.io/hra-cell-type-populations-supporting-information/data/enriched_rui_locations.jsonld#>\n\nCONSTRUCT {\n    ?tissueDonor rdf:type ccf:donor;\n            ccf:sex ?sex;\n        ccf:age ?age;\n        ccf:bmi ?bmi;\n            ccf:consortium_name ?consortiums;\n        ccf:tissue_provider_name ?tmc ;\n            rdfs:label ?donorLabel;\n            rdfs:comment ?donorDescription;\n            ccf:url ?link .  	\n    ?sample rdf:type ccf:sample;\n        ccf:sample_type ?sampleType ;\n          ccf:has_registration_location ?rui_location ;\n        ccf:subdivided_into_sections ?sections ;\n            ccf:comes_from ?tissueDonor ;\n            ccf:generates_dataset ?dataset .\n    ?rui_location rdf:type ccf:SpatialEntity ;\n        dcterms:creator ?creator ;\n        ccf:creator_first_name ?creator_first_name;\n            ccf:creator_last_name ?creator_last_name;\n            ccf:x_dimension ?x_dimension;\n            ccf:y_dimension ?y_dimension;\n            ccf:z_dimension ?z_dimension;\n            ccf:dimension_unit ?dimension_units ;\n            ccf:annotations ?ccf_annotations .\n\n    ?SpatialPlacement rdf:type ccf:SpatialPlacement ;\n        dcterms:created ?placement_date;\n        ccf:x_scaling ?x_scaling;\n        ccf:y_scaling ?y_scaling;\n        ccf:z_scaling ?z_scaling;\n        ccf:scaling_unit ?scaling_units;\n        ccf:x_rotation ?x_rotation;\n        ccf:y_rotation ?y_rotation;\n        ccf:z_rotation ?z_rotation;\n        ccf:rotation_order ?rotation_order;\n        ccf:rotation_unit ?rotation_units;\n        ccf:x_translation ?x_translation;\n        ccf:y_translation ?y_translation;\n        ccf:z_translation ?z_translation;\n        ccf:translation_unit ?translation_units;\n        ccf:placement_relative_to ?target ;\n        ccf:placement_for ?rui_location .\n\n    ?sections rdf:type ccf:sample;\n            ccf:sample_type "Tissue Section";\n          ccf:section_number ?sectionNumber ;\n            rdfs:label ?sectionLabel ;\n            rdfs:comment ?sectionDescription ;\n            ccf:url ?link .\n    ?dataset rdf:type ccf:dataset ;\n            ccf:dataset ?technology ;\n            ccf:thumbnail ?thumbnail ;\n            rdfs:comment ?datasetDescription ;\n            rdfs:label ?datasetLabel .\n}\nFROM <https://purl.org/ccf/releases/2.2.1/ccf.owl> # Ontology / CCF.OWL\nFROM ctpop:graph\nWHERE\n{\n    {\n      SELECT ?rui_location ?dataset\n      WHERE {\n        #{{DATASET_VALUES}}\n        [] ccf:has_registration_location ?rui_location ;\n          ccf:generates_dataset ?dataset .\n      }\n    }\n    UNION\n    {\n      SELECT ?rui_location ?dataset\n      WHERE {\n        #{{RUI_LOCATION_VALUES}}\n        [] ccf:has_registration_location ?rui_location ;\n          ccf:generates_dataset ?dataset .\n      }\n    }\n\n    ?sample rdf:type ccf:Sample .\n    ?sample ccf:sample_type ?sampleType ;\n        ccf:has_registration_location ?rui_location ;\n        ccf:comes_from ?tissueDonor;\n        ccf:generates_dataset ?dataset .\n    \n    ?rui_location rdf:type ccf:SpatialEntity ;\n        dcterms:creator ?creator ;\n        ccf:creator_first_name ?creator_first_name;\n        ccf:creator_last_name ?creator_last_name;\n        ccf:x_dimension ?x_dimension;\n        ccf:y_dimension ?y_dimension;\n        ccf:z_dimension ?z_dimension;\n        ccf:dimension_unit ?dimension_units ;\n        ccf:collides_with ?ccf_annotations .\n  ?SpatialPlacement rdf:type ccf:SpatialPlacement ;\n        dcterms:created ?placement_date;\n        ccf:x_scaling ?x_scaling;\n        ccf:y_scaling ?y_scaling;\n        ccf:z_scaling ?z_scaling;\n        ccf:scaling_unit ?scaling_units;\n        ccf:x_rotation ?x_rotation;\n        ccf:y_rotation ?y_rotation;\n        ccf:z_rotation ?z_rotation;\n        ccf:rotation_order ?rotation_order;\n        ccf:rotation_unit ?rotation_units;\n        ccf:x_translation ?x_translation;\n        ccf:y_translation ?y_translation;\n        ccf:z_translation ?z_translation;\n        ccf:translation_unit ?translation_units;\n        ccf:placement_relative_to ?target ;\n        ccf:placement_for ?rui_location .\n            \n    ?tissueDonor rdf:type ccf:Donor;\n        ccf:sex ?sex;\n        ccf:consortium_name ?consortiums;\n        ccf:tissue_provider_name ?tmc ;\n        rdfs:label ?donorLabel;\n        rdfs:comment ?donorDescription;\n        ccf:url ?link .\n    ?dataset ccf:technology ?technology ;\n        ccf:thumbnail ?thumbnail ;\n        rdfs:comment ?datasetDescription ;\n        rdfs:label ?datasetLabel .\n\n    OPTIONAL {\n        ?sections \n            ccf:subdivided_into_sections ?sample;\n            ccf:sample_type "Tissue Section" ;\n            ccf:section_number ?sectionNumber ;\n            rdfs:label ?sectionLabel ;\n            rdfs:comment ?sectionDescription ;\n            ccf:url ?link .\n        ?tissueDonor rdf:type ?donorType ;\n            ccf:age ?age;\n            ccf:bmi ?bmi;\n    }\n\n  #{{FILTER}}\n  FILTER (?sampleType = "Tissue Block")\n}\n';

// src/library/utils/rui-locations-query.js
function getRuiLocationsQuery(datasets, ruiLocations) {
  const datasetValues = datasets.reduce((vals, iri) => vals + ` (<${iri}>)`, "");
  const ruiLocationValues = ruiLocations.reduce((vals, iri) => vals + ` (<${iri}>)`, "");
  const dsVals = `VALUES (?dataset) { ${datasetValues} }`;
  const ruiVals = `VALUES (?rui_location) { ${ruiLocationValues} }`;
  return construct_rui_locations_default.replaceAll("#{{DATASET_VALUES}}", dsVals).replaceAll("#{{RUI_LOCATION_VALUES}}", ruiVals);
}

// src/library/frames/rui-locations-frame.json
var rui_locations_frame_default = {
  "@context": [
    "https://hubmapconsortium.github.io/ccf-ontology/ccf-context.jsonld",
    {
      xsd: "http://www.w3.org/2001/XMLSchema#",
      ccf: "http://purl.org/ccf/",
      ccf1: "http://purl.org/ccf/latest/ccf.owl#",
      rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      rdfs: "http://www.w3.org/2000/01/rdf-schema#",
      dcterms: "http://purl.org/dc/terms/",
      age: {
        "@id": "ccf:age",
        "@type": "xsd:integer"
      },
      bmi: {
        "@id": "ccf:bmi",
        "@type": "xsd:double"
      },
      x_dimension: {
        "@id": "ccf:x_dimension",
        "@type": "xsd:integer"
      },
      y_dimension: {
        "@id": "ccf:y_dimension",
        "@type": "xsd:integer"
      },
      z_dimension: {
        "@id": "ccf:z_dimension",
        "@type": "xsd:integer"
      },
      x_scaling: {
        "@id": "ccf:x_scaling",
        "@type": "xsd:integer"
      },
      y_scaling: {
        "@id": "ccf:y_scaling",
        "@type": "xsd:integer"
      },
      z_scaling: {
        "@id": "ccf:z_scaling",
        "@type": "xsd:integer"
      },
      x_rotation: {
        "@id": "ccf:x_rotation",
        "@type": "xsd:integer"
      },
      y_rotation: {
        "@id": "ccf:y_rotation",
        "@type": "xsd:integer"
      },
      z_rotation: {
        "@id": "ccf:z_rotation",
        "@type": "xsd:integer"
      },
      x_translation: {
        "@id": "ccf:x_translation",
        "@type": "xsd:double"
      },
      y_translation: {
        "@id": "ccf:y_translation",
        "@type": "xsd:double"
      },
      z_translation: {
        "@id": "ccf:z_translation",
        "@type": "xsd:double"
      },
      samples: {
        "@reverse": "ccf:comes_from"
      },
      datasets: "ccf:generates_dataset",
      rui_location: "ccf:has_registration_location",
      sections: "ccf:subdivided_into_sections",
      annotations: {
        "@id": "ccf:annotations",
        "@type": "@id"
      }
    }
  ],
  "@type": "ccf:donor",
  samples: {
    "@type": "ccf:sample",
    rui_location: {
      "@type": "ccf:SpatialEntity",
      placement: {
        "@type": "ccf:SpatialPlacement"
      }
    },
    sections: {
      "@type": "ccf:sample",
      datasets: {
        "@type": "ccf:dataset"
      }
    }
  }
};

// src/library/queries/select-cell-summaries.rq
var select_cell_summaries_default = "PREFIX ccf: <http://purl.org/ccf/>\nPREFIX ctpop: <https://cns-iu.github.io/hra-cell-type-populations-supporting-information/data/enriched_rui_locations.jsonld#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nPREfIX owl: <http://www.w3.org/2002/07/owl#>\nPREFIX UBERON: <http://purl.obolibrary.org/obo/UBERON_>\nPREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n\nSELECT ?cell_source ?cell_source_label ?modality ?cell_id ?percentage\nWHERE {\n  GRAPH ctpop:graph {\n    SELECT DISTINCT ?cell_source\n    WHERE {\n      #{{VALUES}}\n      ?cell_source ccf:has_cell_summary [\n        ccf:has_cell_summary_row [\n          ccf:cell_id ?cell_id ;\n        ] ;\n      ] .\n    }\n  }\n  GRAPH ctpop:graph {\n    ?cell_source ccf:has_cell_summary [\n        ccf:has_cell_summary_row [\n          ccf:cell_id ?cell_id ;\n          ccf:cell_label ?cell_label ;\n          ccf:percentage_of_total ?percentage ;\n        ] ;\n      ] .\n  }\n  OPTIONAL {\n    ?cell_source ccf:has_cell_summary [\n      ccf:modality ?modality ;\n    ] .\n  }\n  OPTIONAL {\n    ?cell_source rdfs:label ?cell_source_label .\n  }\n}\nORDER BY ?modality DESC(?similarity)";

// src/library/get-x-from-cell-summary.js
function getCellSummariesQuery(cellWeights) {
  const values = Object.keys(cellWeights).reduce((vals, iri) => vals + ` (<${iri}>)`, "");
  const valString = `VALUES (?cell_id) { ${values} }`;
  return select_cell_summaries_default.replaceAll("#{{VALUES}}", valString);
}
function getSourceSimilarities(cellWeights, summaries) {
  const sources = summaries.reduce((lookup, row) => {
    const id = `${row.cell_source}$${row.modality}`;
    if (!lookup[id]) {
      lookup[id] = {
        cell_source: row.cell_source,
        cell_source_label: row.cell_source_label,
        modality: row.modality,
        cellWeights: {}
      };
    }
    const source = lookup[id];
    source.cellWeights[row.cell_id] = row.percentage;
    return lookup;
  }, {});
  for (const source of Object.values(sources)) {
    source.similarity = getCellDistributionSimilarity(cellWeights, source.cellWeights);
    delete source.cellWeights;
  }
  return Object.values(sources).sort((a, b) => b.similarity - a.similarity);
}
async function getSimilarCellSources(cellWeights, endpoint = "https://lod.humanatlas.io/sparql") {
  const query = getCellSummariesQuery(cellWeights);
  const summaries = await select(query, endpoint);
  const sources = getSourceSimilarities(cellWeights, summaries);
  const datasets = sources.filter(
    (row) => row.cell_source.startsWith(
      "https://cns-iu.github.io/hra-cell-type-populations-supporting-information/data/datasets.jsonld#"
    )
  ).map((row) => row.cell_source).slice(0, 10);
  const ruiLocations = sources.filter((row) => row.cell_source.startsWith("http://purl.org/ccf/1.5/")).map((row) => row.cell_source).slice(0, 10);
  const ruiLocationQuery = getRuiLocationsQuery(datasets, ruiLocations);
  try {
    const ruiLocationsJsonLd = await construct(ruiLocationQuery, endpoint, rui_locations_frame_default);
    return { sources, rui_locations: ruiLocationsJsonLd };
  } catch (error2) {
    return { sources: [], rui_locations: [], error: error2 };
  }
}

// src/library/get-similar-cell-sources.js
async function getSimilarCellSourcesReport(csvString) {
  const data = import_papaparse2.default.parse(csvString, { header: true, skipEmptyLines: true }).data;
  if (data?.length > 0) {
    const cellWeights = {};
    for (const row of data) {
      const id = row["cell_id"];
      const weight = parseFloat(row["percentage"]);
      if (id && !isNaN(weight) && weight > 0 && weight <= 1) {
        const cellId = id.replace("CL:", "http://purl.obolibrary.org/obo/CL_");
        cellWeights[cellId] = weight;
      }
    }
    if (Object.keys(cellWeights).length > 0) {
      const { sources, rui_locations, error: error2 } = await getSimilarCellSources(cellWeights);
      return { sources, rui_locations, error: error2 };
    } else {
      return { source: [], rui_locations: [] };
    }
  }
}

// src/service-worker/sw.js
self.skipWaiting();
self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});
var app = new Wayne();
app.post("/api/ctpop/rui-location-cell-summary", async function(req, res) {
  const ruiLocation = await req.json();
  const summary = await getCellSummary(ruiLocation);
  res.json(summary);
});
app.post("/api/ctpop/cell-summary-rui-location", async function(req, res) {
  const cellSummarySheet = await req.text();
  const report = await getSimilarCellSourcesReport(cellSummarySheet);
  res.json(report);
});
/*! Bundled license information:

rdf-canonize/lib/MessageDigest-browser.js:
  (*!
   * Copyright (c) 2016-2022 Digital Bazaar, Inc. All rights reserved.
   *)

rdf-canonize/lib/Permuter.js:
  (*!
   * Copyright (c) 2016-2022 Digital Bazaar, Inc. All rights reserved.
   *)

rdf-canonize/lib/NQuads.js:
  (*!
   * Copyright (c) 2016-2022 Digital Bazaar, Inc. All rights reserved.
   *)

rdf-canonize/lib/URDNA2015.js:
  (*!
   * Copyright (c) 2016-2022 Digital Bazaar, Inc. All rights reserved.
   *)

rdf-canonize/lib/URGNA2012.js:
  (*!
   * Copyright (c) 2016-2022 Digital Bazaar, Inc. All rights reserved.
   *)

rdf-canonize/lib/URDNA2015Sync.js:
  (*!
   * Copyright (c) 2016-2022 Digital Bazaar, Inc. All rights reserved.
   *)

rdf-canonize/lib/URGNA2012Sync.js:
  (*!
   * Copyright (c) 2016-2021 Digital Bazaar, Inc. All rights reserved.
   *)

jsonld/lib/context.js:
  (* disallow aliasing @context and @preserve *)

jsonld/lib/frame.js:
  (* remove @preserve from results *)
  (**
   * Removes the @preserve keywords from expanded result of framing.
   *
   * @param input the framed, framed output.
   * @param options the framing options used.
   *
   * @return the resulting output.
   *)
  (* remove @preserve *)

jsonld/lib/jsonld.js:
  (**
   * A JavaScript implementation of the JSON-LD API.
   *
   * @author Dave Longley
   *
   * @license BSD 3-Clause License
   * Copyright (c) 2011-2022 Digital Bazaar, Inc.
   * All rights reserved.
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * Redistributions of source code must retain the above copyright notice,
   * this list of conditions and the following disclaimer.
   *
   * Redistributions in binary form must reproduce the above copyright
   * notice, this list of conditions and the following disclaimer in the
   * documentation and/or other materials provided with the distribution.
   *
   * Neither the name of the Digital Bazaar, Inc. nor the names of its
   * contributors may be used to endorse or promote products derived from
   * this software without specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
   * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
   * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
   * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
   * HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
   * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
   * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
   * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   *)

papaparse/papaparse.min.js:
  (* @license
  Papa Parse
  v5.4.1
  https://github.com/mholt/PapaParse
  License: MIT
  *)

complex.js/complex.js:
  (**
   * @license Complex.js v2.1.1 12/05/2020
   *
   * Copyright (c) 2020, Robert Eisele (robert@xarg.org)
   * Dual licensed under the MIT or GPL Version 2 licenses.
   **)

fraction.js/fraction.js:
  (**
   * @license Fraction.js v4.3.0 20/08/2023
   * https://www.xarg.org/2014/03/rational-numbers-in-javascript/
   *
   * Copyright (c) 2023, Robert Eisele (robert@raw.org)
   * Dual licensed under the MIT or GPL Version 2 licenses.
   **)

decimal.js/decimal.mjs:
  (*!
   *  decimal.js v10.4.3
   *  An arbitrary-precision Decimal type for JavaScript.
   *  https://github.com/MikeMcl/decimal.js
   *  Copyright (c) 2022 Michael Mclaughlin <M8ch88l@gmail.com>
   *  MIT Licence
   *)
*/
