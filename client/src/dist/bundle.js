/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { throw err; };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 39);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	module.exports = Stream;

	function Stream(source) {
		this.source = source;
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	module.exports = Pipe;

	/**
	 * A sink mixin that simply forwards event, end, and error to
	 * another sink.
	 * @param sink
	 * @constructor
	 */
	function Pipe(sink) {
	  this.sink = sink;
	}

	Pipe.prototype.event = function (t, x) {
	  return this.sink.event(t, x);
	};

	Pipe.prototype.end = function (t, x) {
	  return this.sink.end(t, x);
	};

	Pipe.prototype.error = function (t, e) {
	  return this.sink.error(t, e);
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Disposable = __webpack_require__(73);
	var SettableDisposable = __webpack_require__(74);
	var isPromise = __webpack_require__(11).isPromise;
	var base = __webpack_require__(3);

	var map = base.map;
	var identity = base.id;

	exports.tryDispose = tryDispose;
	exports.create = create;
	exports.once = once;
	exports.empty = empty;
	exports.all = all;
	exports.settable = settable;
	exports.promised = promised;

	/**
	 * Call disposable.dispose.  If it returns a promise, catch promise
	 * error and forward it through the provided sink.
	 * @param {number} t time
	 * @param {{dispose: function}} disposable
	 * @param {{error: function}} sink
	 * @return {*} result of disposable.dispose
	 */
	function tryDispose(t, disposable, sink) {
	  var result = disposeSafely(disposable);
	  return isPromise(result) ? result.catch(function (e) {
	    sink.error(t, e);
	  }) : result;
	}

	/**
	 * Create a new Disposable which will dispose its underlying resource
	 * at most once.
	 * @param {function} dispose function
	 * @param {*?} data any data to be passed to disposer function
	 * @return {Disposable}
	 */
	function create(dispose, data) {
	  return once(new Disposable(dispose, data));
	}

	/**
	 * Create a noop disposable. Can be used to satisfy a Disposable
	 * requirement when no actual resource needs to be disposed.
	 * @return {Disposable|exports|module.exports}
	 */
	function empty() {
	  return new Disposable(identity, void 0);
	}

	/**
	 * Create a disposable that will dispose all input disposables in parallel.
	 * @param {Array<Disposable>} disposables
	 * @return {Disposable}
	 */
	function all(disposables) {
	  return create(disposeAll, disposables);
	}

	function disposeAll(disposables) {
	  return Promise.all(map(disposeSafely, disposables));
	}

	function disposeSafely(disposable) {
	  try {
	    return disposable.dispose();
	  } catch (e) {
	    return Promise.reject(e);
	  }
	}

	/**
	 * Create a disposable from a promise for another disposable
	 * @param {Promise<Disposable>} disposablePromise
	 * @return {Disposable}
	 */
	function promised(disposablePromise) {
	  return create(disposePromise, disposablePromise);
	}

	function disposePromise(disposablePromise) {
	  return disposablePromise.then(disposeOne);
	}

	function disposeOne(disposable) {
	  return disposable.dispose();
	}

	/**
	 * Create a disposable proxy that allows its underlying disposable to
	 * be set later.
	 * @return {SettableDisposable}
	 */
	function settable() {
	  return new SettableDisposable();
	}

	/**
	 * Wrap an existing disposable (which may not already have been once()d)
	 * so that it will only dispose its underlying resource at most once.
	 * @param {{ dispose: function() }} disposable
	 * @return {Disposable} wrapped disposable
	 */
	function once(disposable) {
	  return new Disposable(disposeMemoized, memoized(disposable));
	}

	function disposeMemoized(memoized) {
	  if (!memoized.disposed) {
	    memoized.disposed = true;
	    memoized.value = disposeSafely(memoized.disposable);
	    memoized.disposable = void 0;
	  }

	  return memoized.value;
	}

	function memoized(disposable) {
	  return { disposed: false, disposable: disposable, value: void 0 };
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	(function (global, factory) {
	   true ? factory(exports) : typeof define === 'function' && define.amd ? define(['exports'], factory) : factory(global.mostPrelude = global.mostPrelude || {});
	})(this, function (exports) {
	  'use strict';

	  /** @license MIT License (c) copyright 2010-2016 original author or authors */

	  // Non-mutating array operations

	  // cons :: a -> [a] -> [a]
	  // a with x prepended

	  function cons(x, a) {
	    var l = a.length;
	    var b = new Array(l + 1);
	    b[0] = x;
	    for (var i = 0; i < l; ++i) {
	      b[i + 1] = a[i];
	    }
	    return b;
	  }

	  // append :: a -> [a] -> [a]
	  // a with x appended
	  function append(x, a) {
	    var l = a.length;
	    var b = new Array(l + 1);
	    for (var i = 0; i < l; ++i) {
	      b[i] = a[i];
	    }

	    b[l] = x;
	    return b;
	  }

	  // drop :: Int -> [a] -> [a]
	  // drop first n elements
	  function drop(n, a) {
	    // eslint-disable-line complexity
	    if (n < 0) {
	      throw new TypeError('n must be >= 0');
	    }

	    var l = a.length;
	    if (n === 0 || l === 0) {
	      return a;
	    }

	    if (n >= l) {
	      return [];
	    }

	    return unsafeDrop(n, a, l - n);
	  }

	  // unsafeDrop :: Int -> [a] -> Int -> [a]
	  // Internal helper for drop
	  function unsafeDrop(n, a, l) {
	    var b = new Array(l);
	    for (var i = 0; i < l; ++i) {
	      b[i] = a[n + i];
	    }
	    return b;
	  }

	  // tail :: [a] -> [a]
	  // drop head element
	  function tail(a) {
	    return drop(1, a);
	  }

	  // copy :: [a] -> [a]
	  // duplicate a (shallow duplication)
	  function copy(a) {
	    var l = a.length;
	    var b = new Array(l);
	    for (var i = 0; i < l; ++i) {
	      b[i] = a[i];
	    }
	    return b;
	  }

	  // map :: (a -> b) -> [a] -> [b]
	  // transform each element with f
	  function map(f, a) {
	    var l = a.length;
	    var b = new Array(l);
	    for (var i = 0; i < l; ++i) {
	      b[i] = f(a[i]);
	    }
	    return b;
	  }

	  // reduce :: (a -> b -> a) -> a -> [b] -> a
	  // accumulate via left-fold
	  function reduce(f, z, a) {
	    var r = z;
	    for (var i = 0, l = a.length; i < l; ++i) {
	      r = f(r, a[i], i);
	    }
	    return r;
	  }

	  // replace :: a -> Int -> [a]
	  // replace element at index
	  function replace(x, i, a) {
	    // eslint-disable-line complexity
	    if (i < 0) {
	      throw new TypeError('i must be >= 0');
	    }

	    var l = a.length;
	    var b = new Array(l);
	    for (var j = 0; j < l; ++j) {
	      b[j] = i === j ? x : a[j];
	    }
	    return b;
	  }

	  // remove :: Int -> [a] -> [a]
	  // remove element at index
	  function remove(i, a) {
	    // eslint-disable-line complexity
	    if (i < 0) {
	      throw new TypeError('i must be >= 0');
	    }

	    var l = a.length;
	    if (l === 0 || i >= l) {
	      // exit early if index beyond end of array
	      return a;
	    }

	    if (l === 1) {
	      // exit early if index in bounds and length === 1
	      return [];
	    }

	    return unsafeRemove(i, a, l - 1);
	  }

	  // unsafeRemove :: Int -> [a] -> Int -> [a]
	  // Internal helper to remove element at index
	  function unsafeRemove(i, a, l) {
	    var b = new Array(l);
	    var j;
	    for (j = 0; j < i; ++j) {
	      b[j] = a[j];
	    }
	    for (j = i; j < l; ++j) {
	      b[j] = a[j + 1];
	    }

	    return b;
	  }

	  // removeAll :: (a -> boolean) -> [a] -> [a]
	  // remove all elements matching a predicate
	  function removeAll(f, a) {
	    var l = a.length;
	    var b = new Array(l);
	    var j = 0;
	    for (var x, i = 0; i < l; ++i) {
	      x = a[i];
	      if (!f(x)) {
	        b[j] = x;
	        ++j;
	      }
	    }

	    b.length = j;
	    return b;
	  }

	  // findIndex :: a -> [a] -> Int
	  // find index of x in a, from the left
	  function findIndex(x, a) {
	    for (var i = 0, l = a.length; i < l; ++i) {
	      if (x === a[i]) {
	        return i;
	      }
	    }
	    return -1;
	  }

	  // isArrayLike :: * -> boolean
	  // Return true iff x is array-like
	  function isArrayLike(x) {
	    return x != null && typeof x.length === 'number' && typeof x !== 'function';
	  }

	  /** @license MIT License (c) copyright 2010-2016 original author or authors */

	  // id :: a -> a
	  var id = function (x) {
	    return x;
	  };

	  // compose :: (b -> c) -> (a -> b) -> (a -> c)
	  var compose = function (f, g) {
	    return function (x) {
	      return f(g(x));
	    };
	  };

	  // apply :: (a -> b) -> a -> b
	  var apply = function (f, x) {
	    return f(x);
	  };

	  // curry2 :: ((a, b) -> c) -> (a -> b -> c)
	  function curry2(f) {
	    function curried(a, b) {
	      switch (arguments.length) {
	        case 0:
	          return curried;
	        case 1:
	          return function (b) {
	            return f(a, b);
	          };
	        default:
	          return f(a, b);
	      }
	    }
	    return curried;
	  }

	  // curry3 :: ((a, b, c) -> d) -> (a -> b -> c -> d)
	  function curry3(f) {
	    function curried(a, b, c) {
	      // eslint-disable-line complexity
	      switch (arguments.length) {
	        case 0:
	          return curried;
	        case 1:
	          return curry2(function (b, c) {
	            return f(a, b, c);
	          });
	        case 2:
	          return function (c) {
	            return f(a, b, c);
	          };
	        default:
	          return f(a, b, c);
	      }
	    }
	    return curried;
	  }

	  exports.cons = cons;
	  exports.append = append;
	  exports.drop = drop;
	  exports.tail = tail;
	  exports.copy = copy;
	  exports.map = map;
	  exports.reduce = reduce;
	  exports.replace = replace;
	  exports.remove = remove;
	  exports.removeAll = removeAll;
	  exports.findIndex = findIndex;
	  exports.isArrayLike = isArrayLike;
	  exports.id = id;
	  exports.compose = compose;
	  exports.apply = apply;
	  exports.curry2 = curry2;
	  exports.curry3 = curry3;

	  Object.defineProperty(exports, '__esModule', { value: true });
	});
	//# sourceMappingURL=prelude.js.map

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Stream = __webpack_require__(0);
	var base = __webpack_require__(3);
	var core = __webpack_require__(7);
	var from = __webpack_require__(85).from;
	var periodic = __webpack_require__(91).periodic;

	/**
	 * Core stream type
	 * @type {Stream}
	 */
	exports.Stream = Stream;

	// Add of and empty to constructor for fantasy-land compat
	exports.of = Stream.of = core.of;
	exports.just = core.of; // easier ES6 import alias
	exports.empty = Stream.empty = core.empty;
	exports.never = core.never;
	exports.from = from;
	exports.periodic = periodic;

	//-----------------------------------------------------------------------
	// Creating

	var create = __webpack_require__(84);

	/**
	 * Create a stream by imperatively pushing events.
	 * @param {function(add:function(x), end:function(e)):function} run function
	 *  that will receive 2 functions as arguments, the first to add new values to the
	 *  stream and the second to end the stream. It may *return* a function that
	 *  will be called once all consumers have stopped observing the stream.
	 * @returns {Stream} stream containing all events added by run before end
	 */
	exports.create = create.create;

	//-----------------------------------------------------------------------
	// Adapting other sources

	var events = __webpack_require__(87);

	/**
	 * Create a stream of events from the supplied EventTarget or EventEmitter
	 * @param {String} event event name
	 * @param {EventTarget|EventEmitter} source EventTarget or EventEmitter. The source
	 *  must support either addEventListener/removeEventListener (w3c EventTarget:
	 *  http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget),
	 *  or addListener/removeListener (node EventEmitter: http://nodejs.org/api/events.html)
	 * @returns {Stream} stream of events of the specified type from the source
	 */
	exports.fromEvent = events.fromEvent;

	//-----------------------------------------------------------------------
	// Observing

	var observe = __webpack_require__(64);

	exports.observe = observe.observe;
	exports.forEach = observe.observe;
	exports.drain = observe.drain;

	/**
	 * Process all the events in the stream
	 * @returns {Promise} promise that fulfills when the stream ends, or rejects
	 *  if the stream fails with an unhandled error.
	 */
	Stream.prototype.observe = Stream.prototype.forEach = function (f) {
	  return observe.observe(f, this);
	};

	/**
	 * Consume all events in the stream, without providing a function to process each.
	 * This causes a stream to become active and begin emitting events, and is useful
	 * in cases where all processing has been setup upstream via other combinators, and
	 * there is no need to process the terminal events.
	 * @returns {Promise} promise that fulfills when the stream ends, or rejects
	 *  if the stream fails with an unhandled error.
	 */
	Stream.prototype.drain = function () {
	  return observe.drain(this);
	};

	//-------------------------------------------------------

	var loop = __webpack_require__(62).loop;

	exports.loop = loop;

	/**
	 * Generalized feedback loop. Call a stepper function for each event. The stepper
	 * will be called with 2 params: the current seed and the an event value.  It must
	 * return a new { seed, value } pair. The `seed` will be fed back into the next
	 * invocation of stepper, and the `value` will be propagated as the event value.
	 * @param {function(seed:*, value:*):{seed:*, value:*}} stepper loop step function
	 * @param {*} seed initial seed value passed to first stepper call
	 * @returns {Stream} new stream whose values are the `value` field of the objects
	 * returned by the stepper
	 */
	Stream.prototype.loop = function (stepper, seed) {
	  return loop(stepper, seed, this);
	};

	//-------------------------------------------------------

	var accumulate = __webpack_require__(55);

	exports.scan = accumulate.scan;
	exports.reduce = accumulate.reduce;

	/**
	 * Create a stream containing successive reduce results of applying f to
	 * the previous reduce result and the current stream item.
	 * @param {function(result:*, x:*):*} f reducer function
	 * @param {*} initial initial value
	 * @returns {Stream} new stream containing successive reduce results
	 */
	Stream.prototype.scan = function (f, initial) {
	  return accumulate.scan(f, initial, this);
	};

	/**
	 * Reduce the stream to produce a single result.  Note that reducing an infinite
	 * stream will return a Promise that never fulfills, but that may reject if an error
	 * occurs.
	 * @param {function(result:*, x:*):*} f reducer function
	 * @param {*} initial optional initial value
	 * @returns {Promise} promise for the file result of the reduce
	 */
	Stream.prototype.reduce = function (f, initial) {
	  return accumulate.reduce(f, initial, this);
	};

	//-----------------------------------------------------------------------
	// Building and extending

	var unfold = __webpack_require__(92);
	var iterate = __webpack_require__(90);
	var generate = __webpack_require__(89);
	var build = __webpack_require__(23);

	exports.unfold = unfold.unfold;
	exports.iterate = iterate.iterate;
	exports.generate = generate.generate;
	exports.cycle = build.cycle;
	exports.concat = build.concat;
	exports.startWith = build.cons;

	/**
	 * @deprecated
	 * Tie this stream into a circle, thus creating an infinite stream
	 * @returns {Stream} new infinite stream
	 */
	Stream.prototype.cycle = function () {
	  return build.cycle(this);
	};

	/**
	 * @param {Stream} tail
	 * @returns {Stream} new stream containing all items in this followed by
	 *  all items in tail
	 */
	Stream.prototype.concat = function (tail) {
	  return build.concat(this, tail);
	};

	/**
	 * @param {*} x value to prepend
	 * @returns {Stream} a new stream with x prepended
	 */
	Stream.prototype.startWith = function (x) {
	  return build.cons(x, this);
	};

	//-----------------------------------------------------------------------
	// Transforming

	var transform = __webpack_require__(12);
	var applicative = __webpack_require__(56);

	exports.map = transform.map;
	exports.constant = transform.constant;
	exports.tap = transform.tap;
	exports.ap = applicative.ap;

	/**
	 * Transform each value in the stream by applying f to each
	 * @param {function(*):*} f mapping function
	 * @returns {Stream} stream containing items transformed by f
	 */
	Stream.prototype.map = function (f) {
	  return transform.map(f, this);
	};

	/**
	 * Assume this stream contains functions, and apply each function to each item
	 * in the provided stream.  This generates, in effect, a cross product.
	 * @param {Stream} xs stream of items to which
	 * @returns {Stream} stream containing the cross product of items
	 */
	Stream.prototype.ap = function (xs) {
	  return applicative.ap(this, xs);
	};

	/**
	 * Replace each value in the stream with x
	 * @param {*} x
	 * @returns {Stream} stream containing items replaced with x
	 */
	Stream.prototype.constant = function (x) {
	  return transform.constant(x, this);
	};

	/**
	 * Perform a side effect for each item in the stream
	 * @param {function(x:*):*} f side effect to execute for each item. The
	 *  return value will be discarded.
	 * @returns {Stream} new stream containing the same items as this stream
	 */
	Stream.prototype.tap = function (f) {
	  return transform.tap(f, this);
	};

	//-----------------------------------------------------------------------
	// Transducer support

	var transduce = __webpack_require__(71);

	exports.transduce = transduce.transduce;

	/**
	 * Transform this stream by passing its events through a transducer.
	 * @param  {function} transducer transducer function
	 * @return {Stream} stream of events transformed by the transducer
	 */
	Stream.prototype.transduce = function (transducer) {
	  return transduce.transduce(transducer, this);
	};

	//-----------------------------------------------------------------------
	// FlatMapping

	var flatMap = __webpack_require__(26);

	exports.flatMap = exports.chain = flatMap.flatMap;
	exports.join = flatMap.join;

	/**
	 * Map each value in the stream to a new stream, and merge it into the
	 * returned outer stream. Event arrival times are preserved.
	 * @param {function(x:*):Stream} f chaining function, must return a Stream
	 * @returns {Stream} new stream containing all events from each stream returned by f
	 */
	Stream.prototype.flatMap = Stream.prototype.chain = function (f) {
	  return flatMap.flatMap(f, this);
	};

	/**
	 * Monadic join. Flatten a Stream<Stream<X>> to Stream<X> by merging inner
	 * streams to the outer. Event arrival times are preserved.
	 * @returns {Stream<X>} new stream containing all events of all inner streams
	 */
	Stream.prototype.join = function () {
	  return flatMap.join(this);
	};

	var continueWith = __webpack_require__(25).continueWith;

	exports.continueWith = continueWith;
	exports.flatMapEnd = continueWith;

	/**
	 * Map the end event to a new stream, and begin emitting its values.
	 * @param {function(x:*):Stream} f function that receives the end event value,
	 * and *must* return a new Stream to continue with.
	 * @returns {Stream} new stream that emits all events from the original stream,
	 * followed by all events from the stream returned by f.
	 */
	Stream.prototype.continueWith = Stream.prototype.flatMapEnd = function (f) {
	  return continueWith(f, this);
	};

	var concatMap = __webpack_require__(57).concatMap;

	exports.concatMap = concatMap;

	Stream.prototype.concatMap = function (f) {
	  return concatMap(f, this);
	};

	//-----------------------------------------------------------------------
	// Concurrent merging

	var mergeConcurrently = __webpack_require__(8);

	exports.mergeConcurrently = mergeConcurrently.mergeConcurrently;

	/**
	 * Flatten a Stream<Stream<X>> to Stream<X> by merging inner
	 * streams to the outer, limiting the number of inner streams that may
	 * be active concurrently.
	 * @param {number} concurrency at most this many inner streams will be
	 *  allowed to be active concurrently.
	 * @return {Stream<X>} new stream containing all events of all inner
	 *  streams, with limited concurrency.
	 */
	Stream.prototype.mergeConcurrently = function (concurrency) {
	  return mergeConcurrently.mergeConcurrently(concurrency, this);
	};

	//-----------------------------------------------------------------------
	// Merging

	var merge = __webpack_require__(63);

	exports.merge = merge.merge;
	exports.mergeArray = merge.mergeArray;

	/**
	 * Merge this stream and all the provided streams
	 * @returns {Stream} stream containing items from this stream and s in time
	 * order.  If two events are simultaneous they will be merged in
	 * arbitrary order.
	 */
	Stream.prototype.merge = function () /*...streams*/{
	  return merge.mergeArray(base.cons(this, arguments));
	};

	//-----------------------------------------------------------------------
	// Combining

	var combine = __webpack_require__(24);

	exports.combine = combine.combine;
	exports.combineArray = combine.combineArray;

	/**
	 * Combine latest events from all input streams
	 * @param {function(...events):*} f function to combine most recent events
	 * @returns {Stream} stream containing the result of applying f to the most recent
	 *  event of each input stream, whenever a new event arrives on any stream.
	 */
	Stream.prototype.combine = function (f /*, ...streams*/) {
	  return combine.combineArray(f, base.replace(this, 0, arguments));
	};

	//-----------------------------------------------------------------------
	// Sampling

	var sample = __webpack_require__(66);

	exports.sample = sample.sample;
	exports.sampleWith = sample.sampleWith;

	/**
	 * When an event arrives on sampler, emit the latest event value from stream.
	 * @param {Stream} sampler stream of events at whose arrival time
	 *  signal's latest value will be propagated
	 * @returns {Stream} sampled stream of values
	 */
	Stream.prototype.sampleWith = function (sampler) {
	  return sample.sampleWith(sampler, this);
	};

	/**
	 * When an event arrives on this stream, emit the result of calling f with the latest
	 * values of all streams being sampled
	 * @param {function(...values):*} f function to apply to each set of sampled values
	 * @returns {Stream} stream of sampled and transformed values
	 */
	Stream.prototype.sample = function (f /* ...streams */) {
	  return sample.sampleArray(f, this, base.tail(arguments));
	};

	//-----------------------------------------------------------------------
	// Zipping

	var zip = __webpack_require__(72);

	exports.zip = zip.zip;

	/**
	 * Pair-wise combine items with those in s. Given 2 streams:
	 * [1,2,3] zipWith f [4,5,6] -> [f(1,4),f(2,5),f(3,6)]
	 * Note: zip causes fast streams to buffer and wait for slow streams.
	 * @param {function(a:Stream, b:Stream, ...):*} f function to combine items
	 * @returns {Stream} new stream containing pairs
	 */
	Stream.prototype.zip = function (f /*, ...streams*/) {
	  return zip.zipArray(f, base.replace(this, 0, arguments));
	};

	//-----------------------------------------------------------------------
	// Switching

	var switchLatest = __webpack_require__(68).switch;

	exports.switch = switchLatest;
	exports.switchLatest = switchLatest;

	/**
	 * Given a stream of streams, return a new stream that adopts the behavior
	 * of the most recent inner stream.
	 * @returns {Stream} switching stream
	 */
	Stream.prototype.switch = Stream.prototype.switchLatest = function () {
	  return switchLatest(this);
	};

	//-----------------------------------------------------------------------
	// Filtering

	var filter = __webpack_require__(60);

	exports.filter = filter.filter;
	exports.skipRepeats = exports.distinct = filter.skipRepeats;
	exports.skipRepeatsWith = exports.distinctBy = filter.skipRepeatsWith;

	/**
	 * Retain only items matching a predicate
	 * stream:                           -12345678-
	 * filter(x => x % 2 === 0, stream): --2-4-6-8-
	 * @param {function(x:*):boolean} p filtering predicate called for each item
	 * @returns {Stream} stream containing only items for which predicate returns truthy
	 */
	Stream.prototype.filter = function (p) {
	  return filter.filter(p, this);
	};

	/**
	 * Skip repeated events, using === to compare items
	 * stream:           -abbcd-
	 * distinct(stream): -ab-cd-
	 * @returns {Stream} stream with no repeated events
	 */
	Stream.prototype.skipRepeats = function () {
	  return filter.skipRepeats(this);
	};

	/**
	 * Skip repeated events, using supplied equals function to compare items
	 * @param {function(a:*, b:*):boolean} equals function to compare items
	 * @returns {Stream} stream with no repeated events
	 */
	Stream.prototype.skipRepeatsWith = function (equals) {
	  return filter.skipRepeatsWith(equals, this);
	};

	//-----------------------------------------------------------------------
	// Slicing

	var slice = __webpack_require__(67);

	exports.take = slice.take;
	exports.skip = slice.skip;
	exports.slice = slice.slice;
	exports.takeWhile = slice.takeWhile;
	exports.skipWhile = slice.skipWhile;

	/**
	 * stream:          -abcd-
	 * take(2, stream): -ab|
	 * @param {Number} n take up to this many events
	 * @returns {Stream} stream containing at most the first n items from this stream
	 */
	Stream.prototype.take = function (n) {
	  return slice.take(n, this);
	};

	/**
	 * stream:          -abcd->
	 * skip(2, stream): ---cd->
	 * @param {Number} n skip this many events
	 * @returns {Stream} stream not containing the first n events
	 */
	Stream.prototype.skip = function (n) {
	  return slice.skip(n, this);
	};

	/**
	 * Slice a stream by event index. Equivalent to, but more efficient than
	 * stream.take(end).skip(start);
	 * NOTE: Negative start and end are not supported
	 * @param {Number} start skip all events before the start index
	 * @param {Number} end allow all events from the start index to the end index
	 * @returns {Stream} stream containing items where start <= index < end
	 */
	Stream.prototype.slice = function (start, end) {
	  return slice.slice(start, end, this);
	};

	/**
	 * stream:                        -123451234->
	 * takeWhile(x => x < 5, stream): -1234|
	 * @param {function(x:*):boolean} p predicate
	 * @returns {Stream} stream containing items up to, but not including, the
	 * first item for which p returns falsy.
	 */
	Stream.prototype.takeWhile = function (p) {
	  return slice.takeWhile(p, this);
	};

	/**
	 * stream:                        -123451234->
	 * skipWhile(x => x < 5, stream): -----51234->
	 * @param {function(x:*):boolean} p predicate
	 * @returns {Stream} stream containing items following *and including* the
	 * first item for which p returns falsy.
	 */
	Stream.prototype.skipWhile = function (p) {
	  return slice.skipWhile(p, this);
	};

	//-----------------------------------------------------------------------
	// Time slicing

	var timeslice = __webpack_require__(69);

	exports.until = exports.takeUntil = timeslice.takeUntil;
	exports.since = exports.skipUntil = timeslice.skipUntil;
	exports.during = timeslice.during;

	/**
	 * stream:                    -a-b-c-d-e-f-g->
	 * signal:                    -------x
	 * takeUntil(signal, stream): -a-b-c-|
	 * @param {Stream} signal retain only events in stream before the first
	 * event in signal
	 * @returns {Stream} new stream containing only events that occur before
	 * the first event in signal.
	 */
	Stream.prototype.until = Stream.prototype.takeUntil = function (signal) {
	  return timeslice.takeUntil(signal, this);
	};

	/**
	 * stream:                    -a-b-c-d-e-f-g->
	 * signal:                    -------x
	 * takeUntil(signal, stream): -------d-e-f-g->
	 * @param {Stream} signal retain only events in stream at or after the first
	 * event in signal
	 * @returns {Stream} new stream containing only events that occur after
	 * the first event in signal.
	 */
	Stream.prototype.since = Stream.prototype.skipUntil = function (signal) {
	  return timeslice.skipUntil(signal, this);
	};

	/**
	 * stream:                    -a-b-c-d-e-f-g->
	 * timeWindow:                -----s
	 * s:                               -----t
	 * stream.during(timeWindow): -----c-d-e-|
	 * @param {Stream<Stream>} timeWindow a stream whose first event (s) represents
	 *  the window start time.  That event (s) is itself a stream whose first event (t)
	 *  represents the window end time
	 * @returns {Stream} new stream containing only events within the provided timespan
	 */
	Stream.prototype.during = function (timeWindow) {
	  return timeslice.during(timeWindow, this);
	};

	//-----------------------------------------------------------------------
	// Delaying

	var delay = __webpack_require__(58).delay;

	exports.delay = delay;

	/**
	 * @param {Number} delayTime milliseconds to delay each item
	 * @returns {Stream} new stream containing the same items, but delayed by ms
	 */
	Stream.prototype.delay = function (delayTime) {
	  return delay(delayTime, this);
	};

	//-----------------------------------------------------------------------
	// Getting event timestamp

	var timestamp = __webpack_require__(70).timestamp;

	exports.timestamp = timestamp;

	/**
	 * Expose event timestamps into the stream. Turns a Stream<X> into
	 * Stream<{time:t, value:X}>
	 * @returns {Stream<{time:number, value:*}>}
	 */
	Stream.prototype.timestamp = function () {
	  return timestamp(this);
	};

	//-----------------------------------------------------------------------
	// Rate limiting

	var limit = __webpack_require__(61);

	exports.throttle = limit.throttle;
	exports.debounce = limit.debounce;

	/**
	 * Limit the rate of events
	 * stream:              abcd----abcd----
	 * throttle(2, stream): a-c-----a-c-----
	 * @param {Number} period time to suppress events
	 * @returns {Stream} new stream that skips events for throttle period
	 */
	Stream.prototype.throttle = function (period) {
	  return limit.throttle(period, this);
	};

	/**
	 * Wait for a burst of events to subside and emit only the last event in the burst
	 * stream:              abcd----abcd----
	 * debounce(2, stream): -----d-------d--
	 * @param {Number} period events occuring more frequently than this
	 *  on the provided scheduler will be suppressed
	 * @returns {Stream} new debounced stream
	 */
	Stream.prototype.debounce = function (period) {
	  return limit.debounce(period, this);
	};

	//-----------------------------------------------------------------------
	// Awaiting Promises

	var promises = __webpack_require__(65);

	exports.fromPromise = promises.fromPromise;
	exports.await = promises.awaitPromises;

	/**
	 * Await promises, turning a Stream<Promise<X>> into Stream<X>.  Preserves
	 * event order, but timeshifts events based on promise resolution time.
	 * @returns {Stream<X>} stream containing non-promise values
	 */
	Stream.prototype.await = function () {
	  return promises.awaitPromises(this);
	};

	//-----------------------------------------------------------------------
	// Error handling

	var errors = __webpack_require__(59);

	exports.recoverWith = errors.flatMapError;
	exports.flatMapError = errors.flatMapError;
	exports.throwError = errors.throwError;

	/**
	 * If this stream encounters an error, recover and continue with items from stream
	 * returned by f.
	 * stream:                  -a-b-c-X-
	 * f(X):                           d-e-f-g-
	 * flatMapError(f, stream): -a-b-c-d-e-f-g-
	 * @param {function(error:*):Stream} f function which returns a new stream
	 * @returns {Stream} new stream which will recover from an error by calling f
	 */
	Stream.prototype.recoverWith = Stream.prototype.flatMapError = function (f) {
	  return errors.flatMapError(f, this);
	};

	//-----------------------------------------------------------------------
	// Multicasting

	var multicast = __webpack_require__(5).default;

	exports.multicast = multicast;

	/**
	 * Transform the stream into multicast stream.  That means that many subscribers
	 * to the stream will not cause multiple invocations of the internal machinery.
	 * @returns {Stream} new stream which will multicast events to all observers.
	 */
	Stream.prototype.multicast = function () {
	  return multicast(this);
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	(function (global, factory) {
	   true ? factory(exports, __webpack_require__(3)) : typeof define === 'function' && define.amd ? define(['exports', '@most/prelude'], factory) : factory(global.mostMulticast = global.mostMulticast || {}, global.mostPrelude);
	})(this, function (exports, _most_prelude) {
	  'use strict';

	  var MulticastDisposable = function MulticastDisposable(source, sink) {
	    this.source = source;
	    this.sink = sink;
	    this.disposed = false;
	  };

	  MulticastDisposable.prototype.dispose = function dispose() {
	    if (this.disposed) {
	      return;
	    }
	    this.disposed = true;
	    var remaining = this.source.remove(this.sink);
	    return remaining === 0 && this.source._dispose();
	  };

	  function tryEvent(t, x, sink) {
	    try {
	      sink.event(t, x);
	    } catch (e) {
	      sink.error(t, e);
	    }
	  }

	  function tryEnd(t, x, sink) {
	    try {
	      sink.end(t, x);
	    } catch (e) {
	      sink.error(t, e);
	    }
	  }

	  var dispose = function (disposable) {
	    return disposable.dispose();
	  };

	  var emptyDisposable = {
	    dispose: function dispose$1() {}
	  };

	  var MulticastSource = function MulticastSource(source) {
	    this.source = source;
	    this.sinks = [];
	    this._disposable = emptyDisposable;
	  };

	  MulticastSource.prototype.run = function run(sink, scheduler) {
	    var n = this.add(sink);
	    if (n === 1) {
	      this._disposable = this.source.run(this, scheduler);
	    }
	    return new MulticastDisposable(this, sink);
	  };

	  MulticastSource.prototype._dispose = function _dispose() {
	    var disposable = this._disposable;
	    this._disposable = emptyDisposable;
	    return Promise.resolve(disposable).then(dispose);
	  };

	  MulticastSource.prototype.add = function add(sink) {
	    this.sinks = _most_prelude.append(sink, this.sinks);
	    return this.sinks.length;
	  };

	  MulticastSource.prototype.remove = function remove$1(sink) {
	    var i = _most_prelude.findIndex(sink, this.sinks);
	    // istanbul ignore next
	    if (i >= 0) {
	      this.sinks = _most_prelude.remove(i, this.sinks);
	    }

	    return this.sinks.length;
	  };

	  MulticastSource.prototype.event = function event(time, value) {
	    var s = this.sinks;
	    if (s.length === 1) {
	      return s[0].event(time, value);
	    }
	    for (var i = 0; i < s.length; ++i) {
	      tryEvent(time, value, s[i]);
	    }
	  };

	  MulticastSource.prototype.end = function end(time, value) {
	    var s = this.sinks;
	    for (var i = 0; i < s.length; ++i) {
	      tryEnd(time, value, s[i]);
	    }
	  };

	  MulticastSource.prototype.error = function error(time, err) {
	    var s = this.sinks;
	    for (var i = 0; i < s.length; ++i) {
	      s[i].error(time, err);
	    }
	  };

	  function multicast(stream) {
	    var source = stream.source;
	    return source instanceof MulticastSource ? stream : new stream.constructor(new MulticastSource(source));
	  }

	  exports['default'] = multicast;
	  exports.MulticastSource = MulticastSource;

	  Object.defineProperty(exports, '__esModule', { value: true });
	});
	//# sourceMappingURL=multicast.js.map

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var fatal = __webpack_require__(28);

	module.exports = PropagateTask;

	function PropagateTask(run, value, sink) {
		this._run = run;
		this.value = value;
		this.sink = sink;
		this.active = true;
	}

	PropagateTask.event = function (value, sink) {
		return new PropagateTask(emit, value, sink);
	};

	PropagateTask.end = function (value, sink) {
		return new PropagateTask(end, value, sink);
	};

	PropagateTask.error = function (value, sink) {
		return new PropagateTask(error, value, sink);
	};

	PropagateTask.prototype.dispose = function () {
		this.active = false;
	};

	PropagateTask.prototype.run = function (t) {
		if (!this.active) {
			return;
		}
		this._run(t, this.value, this.sink);
	};

	PropagateTask.prototype.error = function (t, e) {
		if (!this.active) {
			return fatal(e);
		}
		this.sink.error(t, e);
	};

	function error(t, e, sink) {
		sink.error(t, e);
	}

	function emit(t, x, sink) {
		sink.event(t, x);
	}

	function end(t, x, sink) {
		sink.end(t, x);
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Stream = __webpack_require__(0);
	var ValueSource = __webpack_require__(34);
	var dispose = __webpack_require__(2);
	var PropagateTask = __webpack_require__(6);

	exports.of = streamOf;
	exports.empty = empty;
	exports.never = never;

	/**
	 * Stream containing only x
	 * @param {*} x
	 * @returns {Stream}
	 */
	function streamOf(x) {
	  return new Stream(new ValueSource(emit, x));
	}

	function emit(t, x, sink) {
	  sink.event(0, x);
	  sink.end(0, void 0);
	}

	/**
	 * Stream containing no events and ends immediately
	 * @returns {Stream}
	 */
	function empty() {
	  return EMPTY;
	}

	function EmptySource() {}

	EmptySource.prototype.run = function (sink, scheduler) {
	  var task = PropagateTask.end(void 0, sink);
	  scheduler.asap(task);

	  return dispose.create(disposeEmpty, task);
	};

	function disposeEmpty(task) {
	  return task.dispose();
	}

	var EMPTY = new Stream(new EmptySource());

	/**
	 * Stream containing no events and never ends
	 * @returns {Stream}
	 */
	function never() {
	  return NEVER;
	}

	function NeverSource() {}

	NeverSource.prototype.run = function () {
	  return dispose.empty();
	};

	var NEVER = new Stream(new NeverSource());

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Stream = __webpack_require__(0);
	var dispose = __webpack_require__(2);
	var LinkedList = __webpack_require__(53);
	var identity = __webpack_require__(3).id;

	exports.mergeConcurrently = mergeConcurrently;
	exports.mergeMapConcurrently = mergeMapConcurrently;

	function mergeConcurrently(concurrency, stream) {
		return mergeMapConcurrently(identity, concurrency, stream);
	}

	function mergeMapConcurrently(f, concurrency, stream) {
		return new Stream(new MergeConcurrently(f, concurrency, stream.source));
	}

	function MergeConcurrently(f, concurrency, source) {
		this.f = f;
		this.concurrency = concurrency;
		this.source = source;
	}

	MergeConcurrently.prototype.run = function (sink, scheduler) {
		return new Outer(this.f, this.concurrency, this.source, sink, scheduler);
	};

	function Outer(f, concurrency, source, sink, scheduler) {
		this.f = f;
		this.concurrency = concurrency;
		this.sink = sink;
		this.scheduler = scheduler;
		this.pending = [];
		this.current = new LinkedList();
		this.disposable = dispose.once(source.run(this, scheduler));
		this.active = true;
	}

	Outer.prototype.event = function (t, x) {
		this._addInner(t, x);
	};

	Outer.prototype._addInner = function (t, stream) {
		if (this.current.length < this.concurrency) {
			this._startInner(t, stream);
		} else {
			this.pending.push(stream);
		}
	};

	Outer.prototype._startInner = function (t, stream) {
		var innerSink = new Inner(t, this, this.sink);
		this.current.add(innerSink);
		innerSink.disposable = mapAndRun(this.f, innerSink, this.scheduler, stream);
	};

	function mapAndRun(f, innerSink, scheduler, stream) {
		return f(stream).source.run(innerSink, scheduler);
	}

	Outer.prototype.end = function (t, x) {
		this.active = false;
		dispose.tryDispose(t, this.disposable, this.sink);
		this._checkEnd(t, x);
	};

	Outer.prototype.error = function (t, e) {
		this.active = false;
		this.sink.error(t, e);
	};

	Outer.prototype.dispose = function () {
		this.active = false;
		this.pending.length = 0;
		return Promise.all([this.disposable.dispose(), this.current.dispose()]);
	};

	Outer.prototype._endInner = function (t, x, inner) {
		this.current.remove(inner);
		dispose.tryDispose(t, inner, this);

		if (this.pending.length === 0) {
			this._checkEnd(t, x);
		} else {
			this._startInner(t, this.pending.shift());
		}
	};

	Outer.prototype._checkEnd = function (t, x) {
		if (!this.active && this.current.isEmpty()) {
			this.sink.end(t, x);
		}
	};

	function Inner(time, outer, sink) {
		this.prev = this.next = null;
		this.time = time;
		this.outer = outer;
		this.sink = sink;
		this.disposable = void 0;
	}

	Inner.prototype.event = function (t, x) {
		this.sink.event(Math.max(t, this.time), x);
	};

	Inner.prototype.end = function (t, x) {
		this.outer._endInner(Math.max(t, this.time), x, this);
	};

	Inner.prototype.error = function (t, e) {
		this.outer.error(Math.max(t, this.time), e);
	};

	Inner.prototype.dispose = function () {
		return this.disposable.dispose();
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	exports.tryEvent = tryEvent;
	exports.tryEnd = tryEnd;

	function tryEvent(t, x, sink) {
		try {
			sink.event(t, x);
		} catch (e) {
			sink.error(t, e);
		}
	}

	function tryEnd(t, x, sink) {
		try {
			sink.end(t, x);
		} catch (e) {
			sink.error(t, e);
		}
	}

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = {
	  array: Array.isArray,
	  primitive: function (s) {
	    return typeof s === 'string' || typeof s === 'number';
	  }
	};

/***/ },
/* 11 */
/***/ function(module, exports) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	exports.isPromise = isPromise;

	function isPromise(p) {
		return p !== null && typeof p === 'object' && typeof p.then === 'function';
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Stream = __webpack_require__(0);
	var Map = __webpack_require__(30);

	exports.map = map;
	exports.constant = constant;
	exports.tap = tap;

	/**
	 * Transform each value in the stream by applying f to each
	 * @param {function(*):*} f mapping function
	 * @param {Stream} stream stream to map
	 * @returns {Stream} stream containing items transformed by f
	 */
	function map(f, stream) {
	  return new Stream(Map.create(f, stream.source));
	}

	/**
	 * Replace each value in the stream with x
	 * @param {*} x
	 * @param {Stream} stream
	 * @returns {Stream} stream containing items replaced with x
	 */
	function constant(x, stream) {
	  return map(function () {
	    return x;
	  }, stream);
	}

	/**
	 * Perform a side effect for each item in the stream
	 * @param {function(x:*):*} f side effect to execute for each item. The
	 *  return value will be discarded.
	 * @param {Stream} stream stream to tap
	 * @returns {Stream} new stream containing the same items as this stream
	 */
	function tap(f, stream) {
	  return map(function (x) {
	    f(x);
	    return x;
	  }, stream);
	}

/***/ },
/* 13 */
/***/ function(module, exports) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	module.exports = invoke;

	function invoke(f, args) {
		/*eslint complexity: [2,7]*/
		switch (args.length) {
			case 0:
				return f();
			case 1:
				return f(args[0]);
			case 2:
				return f(args[0], args[1]);
			case 3:
				return f(args[0], args[1], args[2]);
			case 4:
				return f(args[0], args[1], args[2], args[3]);
			case 5:
				return f(args[0], args[1], args[2], args[3], args[4]);
			default:
				return f.apply(void 0, args);
		}
	}

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Sink = __webpack_require__(1);

	module.exports = IndexSink;

	IndexSink.hasValue = hasValue;

	function hasValue(indexSink) {
		return indexSink.hasValue;
	}

	function IndexSink(i, sink) {
		this.index = i;
		this.sink = sink;
		this.active = true;
		this.hasValue = false;
		this.value = void 0;
	}

	IndexSink.prototype.event = function (t, x) {
		if (!this.active) {
			return;
		}
		this.value = x;
		this.hasValue = true;
		this.sink.event(t, this);
	};

	IndexSink.prototype.end = function (t, x) {
		if (!this.active) {
			return;
		}
		this.active = false;
		this.sink.end(t, { index: this.index, value: x });
	};

	IndexSink.prototype.error = Sink.prototype.error;

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = function (sel, data, children, text, elm) {
	  var key = data === undefined ? undefined : data.key;
	  return { sel: sel, data: data, children: children,
	    text: text, elm: elm, key: key };
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.mockDOMSource = exports.makeDOMDriver = exports.video = exports.ul = exports.u = exports.tr = exports.title = exports.thead = exports.th = exports.tfoot = exports.textarea = exports.td = exports.tbody = exports.table = exports.sup = exports.sub = exports.style = exports.strong = exports.span = exports.source = exports.small = exports.select = exports.section = exports.script = exports.samp = exports.s = exports.ruby = exports.rt = exports.rp = exports.q = exports.pre = exports.param = exports.p = exports.option = exports.optgroup = exports.ol = exports.object = exports.noscript = exports.nav = exports.meta = exports.menu = exports.mark = exports.map = exports.main = exports.link = exports.li = exports.legend = exports.label = exports.keygen = exports.kbd = exports.ins = exports.input = exports.img = exports.iframe = exports.i = exports.html = exports.hr = exports.hgroup = exports.header = exports.head = exports.h6 = exports.h5 = exports.h4 = exports.h3 = exports.h2 = exports.h1 = exports.form = exports.footer = exports.figure = exports.figcaption = exports.fieldset = exports.embed = exports.em = exports.dt = exports.dl = exports.div = exports.dir = exports.dfn = exports.del = exports.dd = exports.colgroup = exports.col = exports.code = exports.cite = exports.caption = exports.canvas = exports.button = exports.br = exports.body = exports.blockquote = exports.bdo = exports.bdi = exports.base = exports.b = exports.audio = exports.aside = exports.article = exports.area = exports.address = exports.abbr = exports.a = exports.h = exports.thunk = exports.modules = undefined;

	var _makeDOMDriver = __webpack_require__(43);

	Object.defineProperty(exports, 'makeDOMDriver', {
	  enumerable: true,
	  get: function get() {
	    return _makeDOMDriver.makeDOMDriver;
	  }
	});

	var _mockDOMSource = __webpack_require__(44);

	Object.defineProperty(exports, 'mockDOMSource', {
	  enumerable: true,
	  get: function get() {
	    return _mockDOMSource.mockDOMSource;
	  }
	});

	var _modules = __webpack_require__(21);

	var modules = _interopRequireWildcard(_modules);

	var _thunk = __webpack_require__(102);

	var _thunk2 = _interopRequireDefault(_thunk);

	var _hyperscript = __webpack_require__(42);

	var _hyperscript2 = _interopRequireDefault(_hyperscript);

	var _hyperscriptHelpers = __webpack_require__(48);

	var _hyperscriptHelpers2 = _interopRequireDefault(_hyperscriptHelpers);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	function _interopRequireWildcard(obj) {
	  if (obj && obj.__esModule) {
	    return obj;
	  } else {
	    var newObj = {};if (obj != null) {
	      for (var key in obj) {
	        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
	      }
	    }newObj.default = obj;return newObj;
	  }
	}

	exports.modules = modules;
	exports.thunk = _thunk2.default;
	exports.h = _hyperscript2.default;

	var _hh = (0, _hyperscriptHelpers2.default)(_hyperscript2.default);

	var a = _hh.a;
	var abbr = _hh.abbr;
	var address = _hh.address;
	var area = _hh.area;
	var article = _hh.article;
	var aside = _hh.aside;
	var audio = _hh.audio;
	var b = _hh.b;
	var base = _hh.base;
	var bdi = _hh.bdi;
	var bdo = _hh.bdo;
	var blockquote = _hh.blockquote;
	var body = _hh.body;
	var br = _hh.br;
	var button = _hh.button;
	var canvas = _hh.canvas;
	var caption = _hh.caption;
	var cite = _hh.cite;
	var code = _hh.code;
	var col = _hh.col;
	var colgroup = _hh.colgroup;
	var dd = _hh.dd;
	var del = _hh.del;
	var dfn = _hh.dfn;
	var dir = _hh.dir;
	var div = _hh.div;
	var dl = _hh.dl;
	var dt = _hh.dt;
	var em = _hh.em;
	var embed = _hh.embed;
	var fieldset = _hh.fieldset;
	var figcaption = _hh.figcaption;
	var figure = _hh.figure;
	var footer = _hh.footer;
	var form = _hh.form;
	var h1 = _hh.h1;
	var h2 = _hh.h2;
	var h3 = _hh.h3;
	var h4 = _hh.h4;
	var h5 = _hh.h5;
	var h6 = _hh.h6;
	var head = _hh.head;
	var header = _hh.header;
	var hgroup = _hh.hgroup;
	var hr = _hh.hr;
	var html = _hh.html;
	var i = _hh.i;
	var iframe = _hh.iframe;
	var img = _hh.img;
	var input = _hh.input;
	var ins = _hh.ins;
	var kbd = _hh.kbd;
	var keygen = _hh.keygen;
	var label = _hh.label;
	var legend = _hh.legend;
	var li = _hh.li;
	var link = _hh.link;
	var main = _hh.main;
	var map = _hh.map;
	var mark = _hh.mark;
	var menu = _hh.menu;
	var meta = _hh.meta;
	var nav = _hh.nav;
	var noscript = _hh.noscript;
	var object = _hh.object;
	var ol = _hh.ol;
	var optgroup = _hh.optgroup;
	var option = _hh.option;
	var p = _hh.p;
	var param = _hh.param;
	var pre = _hh.pre;
	var q = _hh.q;
	var rp = _hh.rp;
	var rt = _hh.rt;
	var ruby = _hh.ruby;
	var s = _hh.s;
	var samp = _hh.samp;
	var script = _hh.script;
	var section = _hh.section;
	var select = _hh.select;
	var small = _hh.small;
	var source = _hh.source;
	var span = _hh.span;
	var strong = _hh.strong;
	var style = _hh.style;
	var sub = _hh.sub;
	var sup = _hh.sup;
	var table = _hh.table;
	var tbody = _hh.tbody;
	var td = _hh.td;
	var textarea = _hh.textarea;
	var tfoot = _hh.tfoot;
	var th = _hh.th;
	var thead = _hh.thead;
	var title = _hh.title;
	var tr = _hh.tr;
	var u = _hh.u;
	var ul = _hh.ul;
	var video = _hh.video;
	exports.a = a;
	exports.abbr = abbr;
	exports.address = address;
	exports.area = area;
	exports.article = article;
	exports.aside = aside;
	exports.audio = audio;
	exports.b = b;
	exports.base = base;
	exports.bdi = bdi;
	exports.bdo = bdo;
	exports.blockquote = blockquote;
	exports.body = body;
	exports.br = br;
	exports.button = button;
	exports.canvas = canvas;
	exports.caption = caption;
	exports.cite = cite;
	exports.code = code;
	exports.col = col;
	exports.colgroup = colgroup;
	exports.dd = dd;
	exports.del = del;
	exports.dfn = dfn;
	exports.dir = dir;
	exports.div = div;
	exports.dl = dl;
	exports.dt = dt;
	exports.em = em;
	exports.embed = embed;
	exports.fieldset = fieldset;
	exports.figcaption = figcaption;
	exports.figure = figure;
	exports.footer = footer;
	exports.form = form;
	exports.h1 = h1;
	exports.h2 = h2;
	exports.h3 = h3;
	exports.h4 = h4;
	exports.h5 = h5;
	exports.h6 = h6;
	exports.head = head;
	exports.header = header;
	exports.hgroup = hgroup;
	exports.hr = hr;
	exports.html = html;
	exports.i = i;
	exports.iframe = iframe;
	exports.img = img;
	exports.input = input;
	exports.ins = ins;
	exports.kbd = kbd;
	exports.keygen = keygen;
	exports.label = label;
	exports.legend = legend;
	exports.li = li;
	exports.link = link;
	exports.main = main;
	exports.map = map;
	exports.mark = mark;
	exports.menu = menu;
	exports.meta = meta;
	exports.nav = nav;
	exports.noscript = noscript;
	exports.object = object;
	exports.ol = ol;
	exports.optgroup = optgroup;
	exports.option = option;
	exports.p = p;
	exports.param = param;
	exports.pre = pre;
	exports.q = q;
	exports.rp = rp;
	exports.rt = rt;
	exports.ruby = ruby;
	exports.s = s;
	exports.samp = samp;
	exports.script = script;
	exports.section = section;
	exports.select = select;
	exports.small = small;
	exports.source = source;
	exports.span = span;
	exports.strong = strong;
	exports.style = style;
	exports.sub = sub;
	exports.sup = sup;
	exports.table = table;
	exports.tbody = tbody;
	exports.td = td;
	exports.textarea = textarea;
	exports.tfoot = tfoot;
	exports.th = th;
	exports.thead = thead;
	exports.title = title;
	exports.tr = tr;
	exports.u = u;
	exports.ul = ul;
	exports.video = video;

/***/ },
/* 17 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	(function () {
	    try {
	        cachedSetTimeout = setTimeout;
	    } catch (e) {
	        cachedSetTimeout = function () {
	            throw new Error('setTimeout is not defined');
	        };
	    }
	    try {
	        cachedClearTimeout = clearTimeout;
	    } catch (e) {
	        cachedClearTimeout = function () {
	            throw new Error('clearTimeout is not defined');
	        };
	    }
	})();
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch (e) {
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch (e) {
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e) {
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e) {
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while (len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () {
	    return '/';
	};
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function () {
	    return 0;
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.makeEventsSelector = undefined;

	var _domEvent = __webpack_require__(40);

	var _makeIsStrictlyInRootScope = __webpack_require__(20);

	var matchesSelector = void 0;
	try {
	  matchesSelector = __webpack_require__(49);
	} catch (e) {
	  matchesSelector = function matchesSelector() {};
	}

	var eventTypesThatDontBubble = ['load', 'unload', 'focus', 'blur', 'mouseenter', 'mouseleave', 'submit', 'change', 'reset', 'timeupdate', 'playing', 'waiting', 'seeking', 'seeked', 'ended', 'loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough', 'durationchange', 'play', 'pause', 'ratechange', 'volumechange', 'suspend', 'emptied', 'stalled'];

	function maybeMutateEventPropagationAttributes(event) {
	  if (!event.hasOwnProperty('propagationHasBeenStopped')) {
	    (function () {
	      event.propagationHasBeenStopped = false;
	      var oldStopPropagation = event.stopPropagation;
	      event.stopPropagation = function stopPropagation() {
	        oldStopPropagation.call(this);
	        this.propagationHasBeenStopped = true;
	      };
	    })();
	  }
	}

	function mutateEventCurrentTarget(event, currentTargetElement) {
	  try {
	    Object.defineProperty(event, 'currentTarget', {
	      value: currentTargetElement,
	      configurable: true
	    });
	  } catch (err) {
	    console.log('please use event.ownerTarget');
	  }
	  event.ownerTarget = currentTargetElement;
	}

	function makeSimulateBubbling(namespace, rootEl) {
	  var isStrictlyInRootScope = (0, _makeIsStrictlyInRootScope.makeIsStrictlyInRootScope)(namespace);
	  var descendantSel = namespace.join(' ');
	  var topSel = namespace.join('');
	  var roof = rootEl.parentElement;

	  return function simulateBubbling(ev) {
	    maybeMutateEventPropagationAttributes(ev);
	    if (ev.propagationHasBeenStopped) {
	      return false;
	    }
	    for (var el = ev.target; el && el !== roof; el = el.parentElement) {
	      if (!isStrictlyInRootScope(el)) {
	        continue;
	      }
	      if (matchesSelector(el, descendantSel) || matchesSelector(el, topSel)) {
	        mutateEventCurrentTarget(ev, el);
	        return true;
	      }
	    }
	    return false;
	  };
	}

	var defaults = {
	  useCapture: false
	};

	function makeEventsSelector(rootElement$, namespace) {
	  return function eventsSelector(type) {
	    var options = arguments.length <= 1 || arguments[1] === undefined ? defaults : arguments[1];

	    if (typeof type !== 'string') {
	      throw new Error('DOM driver\'s events() expects argument to be a ' + 'string representing the event type to listen for.');
	    }
	    var useCapture = false;
	    if (typeof options.useCapture === 'boolean') {
	      useCapture = options.useCapture;
	    }
	    if (eventTypesThatDontBubble.indexOf(type) !== -1) {
	      useCapture = true;
	    }

	    return rootElement$.map(function (rootElement) {
	      return { rootElement: rootElement, namespace: namespace };
	    }).skipRepeatsWith(function (prev, curr) {
	      return prev.namespace.join('') === curr.namespace.join('');
	    }).map(function (_ref) {
	      var rootElement = _ref.rootElement;

	      if (!namespace || namespace.length === 0) {
	        return (0, _domEvent.domEvent)(type, rootElement, useCapture);
	      }
	      var simulateBubbling = makeSimulateBubbling(namespace, rootElement);
	      return (0, _domEvent.domEvent)(type, rootElement, useCapture).filter(simulateBubbling);
	    }).switch().multicast();
	  };
	}

	exports.makeEventsSelector = makeEventsSelector;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.isolateSource = exports.isolateSink = undefined;

	var _utils = __webpack_require__(22);

	var isolateSource = function isolateSource(source_, scope) {
	  return source_.select('.' + _utils.SCOPE_PREFIX + scope);
	};

	var isolateSink = function isolateSink(sink, scope) {
	  return sink.map(function (vTree) {
	    if (vTree.sel.indexOf('' + _utils.SCOPE_PREFIX + scope) === -1) {
	      if (vTree.data.ns) {
	        // svg elements
	        var _vTree$data$attrs = vTree.data.attrs;
	        var attrs = _vTree$data$attrs === undefined ? {} : _vTree$data$attrs;

	        attrs.class = (attrs.class || '') + ' ' + _utils.SCOPE_PREFIX + scope;
	      } else {
	        vTree.sel = vTree.sel + '.' + _utils.SCOPE_PREFIX + scope;
	      }
	    }
	    return vTree;
	  });
	};

	exports.isolateSink = isolateSink;
	exports.isolateSource = isolateSource;

/***/ },
/* 20 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	function makeIsStrictlyInRootScope(namespace) {
	  var classIsForeign = function classIsForeign(c) {
	    var matched = c.match(/cycle-scope-(\S+)/);
	    return matched && namespace.indexOf("." + c) === -1;
	  };
	  var classIsDomestic = function classIsDomestic(c) {
	    var matched = c.match(/cycle-scope-(\S+)/);
	    return matched && namespace.indexOf("." + c) !== -1;
	  };
	  return function isStrictlyInRootScope(leaf) {
	    var some = Array.prototype.some;
	    var split = String.prototype.split;
	    for (var el = leaf; el; el = el.parentElement) {
	      var classList = el.classList || split.call(el.className, " ");
	      if (some.call(classList, classIsDomestic)) {
	        return true;
	      }
	      if (some.call(classList, classIsForeign)) {
	        return false;
	      }
	    }
	    return true;
	  };
	}

	exports.makeIsStrictlyInRootScope = makeIsStrictlyInRootScope;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.EventsModule = exports.HeroModule = exports.AttrsModule = exports.PropsModule = exports.ClassModule = exports.StyleModule = undefined;

	var _class = __webpack_require__(96);

	var _class2 = _interopRequireDefault(_class);

	var _props = __webpack_require__(99);

	var _props2 = _interopRequireDefault(_props);

	var _attributes = __webpack_require__(95);

	var _attributes2 = _interopRequireDefault(_attributes);

	var _eventlisteners = __webpack_require__(97);

	var _eventlisteners2 = _interopRequireDefault(_eventlisteners);

	var _style = __webpack_require__(100);

	var _style2 = _interopRequireDefault(_style);

	var _hero = __webpack_require__(98);

	var _hero2 = _interopRequireDefault(_hero);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	exports.default = [_style2.default, _class2.default, _props2.default, _attributes2.default];
	exports.StyleModule = _style2.default;
	exports.ClassModule = _class2.default;
	exports.PropsModule = _props2.default;
	exports.AttrsModule = _attributes2.default;
	exports.HeroModule = _hero2.default;
	exports.EventsModule = _eventlisteners2.default;

/***/ },
/* 22 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var SCOPE_PREFIX = "cycle-scope-";

	var isElement = function isElement(obj) {
	  return typeof HTMLElement === "object" ? obj instanceof HTMLElement || obj instanceof DocumentFragment : obj && typeof obj === "object" && obj !== null && (obj.nodeType === 1 || obj.nodeType === 11) && typeof obj.nodeName === "string";
	};

	var domSelectorParser = function domSelectorParser(selectors) {
	  var domElement = typeof selectors === "string" ? document.querySelector(selectors) : selectors;

	  if (typeof domElement === "string" && domElement === null) {
	    throw new Error("Cannot render into unknown element `" + selectors + "`");
	  } else if (!isElement(domElement)) {
	    throw new Error("Given container is not a DOM element neither a " + "selector string.");
	  }
	  return domElement;
	};

	exports.domSelectorParser = domSelectorParser;
	exports.SCOPE_PREFIX = SCOPE_PREFIX;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var streamOf = __webpack_require__(7).of;
	var continueWith = __webpack_require__(25).continueWith;

	exports.concat = concat;
	exports.cycle = cycle;
	exports.cons = cons;

	/**
	 * @param {*} x value to prepend
	 * @param {Stream} stream
	 * @returns {Stream} new stream with x prepended
	 */
	function cons(x, stream) {
	  return concat(streamOf(x), stream);
	}

	/**
	 * @param {Stream} left
	 * @param {Stream} right
	 * @returns {Stream} new stream containing all events in left followed by all
	 *  events in right.  This *timeshifts* right to the end of left.
	 */
	function concat(left, right) {
	  return continueWith(function () {
	    return right;
	  }, left);
	}

	/**
	 * @deprecated
	 * Tie stream into a circle, creating an infinite stream
	 * @param {Stream} stream
	 * @returns {Stream} new infinite stream
	 */
	function cycle(stream) {
	  return continueWith(function cycleNext() {
	    return cycle(stream);
	  }, stream);
	}

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Stream = __webpack_require__(0);
	var transform = __webpack_require__(12);
	var core = __webpack_require__(7);
	var Pipe = __webpack_require__(1);
	var IndexSink = __webpack_require__(14);
	var dispose = __webpack_require__(2);
	var base = __webpack_require__(3);
	var invoke = __webpack_require__(13);

	var hasValue = IndexSink.hasValue;

	var map = base.map;
	var tail = base.tail;

	exports.combineArray = combineArray;
	exports.combine = combine;

	/**
	 * Combine latest events from all input streams
	 * @param {function(...events):*} f function to combine most recent events
	 * @returns {Stream} stream containing the result of applying f to the most recent
	 *  event of each input stream, whenever a new event arrives on any stream.
	 */
	function combine(f /*, ...streams */) {
		return combineArray(f, tail(arguments));
	}

	/**
	 * Combine latest events from all input streams
	 * @param {function(...events):*} f function to combine most recent events
	 * @param {[Stream]} streams most recent events
	 * @returns {Stream} stream containing the result of applying f to the most recent
	 *  event of each input stream, whenever a new event arrives on any stream.
	 */
	function combineArray(f, streams) {
		var l = streams.length;
		return l === 0 ? core.empty() : l === 1 ? transform.map(f, streams[0]) : new Stream(combineSources(f, streams));
	}

	function combineSources(f, streams) {
		return new Combine(f, map(getSource, streams));
	}

	function getSource(stream) {
		return stream.source;
	}

	function Combine(f, sources) {
		this.f = f;
		this.sources = sources;
	}

	Combine.prototype.run = function (sink, scheduler) {
		var l = this.sources.length;
		var disposables = new Array(l);
		var sinks = new Array(l);

		var mergeSink = new CombineSink(disposables, sinks, sink, this.f);

		for (var indexSink, i = 0; i < l; ++i) {
			indexSink = sinks[i] = new IndexSink(i, mergeSink);
			disposables[i] = this.sources[i].run(indexSink, scheduler);
		}

		return dispose.all(disposables);
	};

	function CombineSink(disposables, sinks, sink, f) {
		this.sink = sink;
		this.disposables = disposables;
		this.sinks = sinks;
		this.f = f;
		this.values = new Array(sinks.length);
		this.ready = false;
		this.activeCount = sinks.length;
	}

	CombineSink.prototype.error = Pipe.prototype.error;

	CombineSink.prototype.event = function (t, indexedValue) {
		if (!this.ready) {
			this.ready = this.sinks.every(hasValue);
		}

		this.values[indexedValue.index] = indexedValue.value;
		if (this.ready) {
			this.sink.event(t, invoke(this.f, this.values));
		}
	};

	CombineSink.prototype.end = function (t, indexedValue) {
		dispose.tryDispose(t, this.disposables[indexedValue.index], this.sink);
		if (--this.activeCount === 0) {
			this.sink.end(t, indexedValue.value);
		}
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Stream = __webpack_require__(0);
	var Sink = __webpack_require__(1);
	var dispose = __webpack_require__(2);
	var isPromise = __webpack_require__(11).isPromise;

	exports.continueWith = continueWith;

	function continueWith(f, stream) {
		return new Stream(new ContinueWith(f, stream.source));
	}

	function ContinueWith(f, source) {
		this.f = f;
		this.source = source;
	}

	ContinueWith.prototype.run = function (sink, scheduler) {
		return new ContinueWithSink(this.f, this.source, sink, scheduler);
	};

	function ContinueWithSink(f, source, sink, scheduler) {
		this.f = f;
		this.sink = sink;
		this.scheduler = scheduler;
		this.active = true;
		this.disposable = dispose.once(source.run(this, scheduler));
	}

	ContinueWithSink.prototype.error = Sink.prototype.error;

	ContinueWithSink.prototype.event = function (t, x) {
		if (!this.active) {
			return;
		}
		this.sink.event(t, x);
	};

	ContinueWithSink.prototype.end = function (t, x) {
		if (!this.active) {
			return;
		}

		var result = dispose.tryDispose(t, this.disposable, this.sink);
		this.disposable = isPromise(result) ? dispose.promised(this._thenContinue(result, x)) : this._continue(this.f, x);
	};

	ContinueWithSink.prototype._thenContinue = function (p, x) {
		var self = this;
		return p.then(function () {
			return self._continue(self.f, x);
		});
	};

	ContinueWithSink.prototype._continue = function (f, x) {
		return f(x).source.run(this.sink, this.scheduler);
	};

	ContinueWithSink.prototype.dispose = function () {
		this.active = false;
		return this.disposable.dispose();
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var mergeConcurrently = __webpack_require__(8).mergeConcurrently;
	var mergeMapConcurrently = __webpack_require__(8).mergeMapConcurrently;

	exports.flatMap = flatMap;
	exports.join = join;

	/**
	 * Map each value in the stream to a new stream, and merge it into the
	 * returned outer stream. Event arrival times are preserved.
	 * @param {function(x:*):Stream} f chaining function, must return a Stream
	 * @param {Stream} stream
	 * @returns {Stream} new stream containing all events from each stream returned by f
	 */
	function flatMap(f, stream) {
	  return mergeMapConcurrently(f, Infinity, stream);
	}

	/**
	 * Monadic join. Flatten a Stream<Stream<X>> to Stream<X> by merging inner
	 * streams to the outer. Event arrival times are preserved.
	 * @param {Stream<Stream<X>>} stream stream of streams
	 * @returns {Stream<X>} new stream containing all events of all inner streams
	 */
	function join(stream) {
	  return mergeConcurrently(Infinity, stream);
	}

/***/ },
/* 27 */
/***/ function(module, exports) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	module.exports = defer;

	function defer(task) {
		return Promise.resolve(task).then(runTask);
	}

	function runTask(task) {
		try {
			return task.run();
		} catch (e) {
			return task.error(e);
		}
	}

/***/ },
/* 28 */
/***/ function(module, exports) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	module.exports = fatalError;

	function fatalError(e) {
		setTimeout(function () {
			throw e;
		}, 0);
	}

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Pipe = __webpack_require__(1);

	module.exports = Filter;

	function Filter(p, source) {
		this.p = p;
		this.source = source;
	}

	/**
	 * Create a filtered source, fusing adjacent filter.filter if possible
	 * @param {function(x:*):boolean} p filtering predicate
	 * @param {{run:function}} source source to filter
	 * @returns {Filter} filtered source
	 */
	Filter.create = function createFilter(p, source) {
		if (source instanceof Filter) {
			return new Filter(and(source.p, p), source.source);
		}

		return new Filter(p, source);
	};

	Filter.prototype.run = function (sink, scheduler) {
		return this.source.run(new FilterSink(this.p, sink), scheduler);
	};

	function FilterSink(p, sink) {
		this.p = p;
		this.sink = sink;
	}

	FilterSink.prototype.end = Pipe.prototype.end;
	FilterSink.prototype.error = Pipe.prototype.error;

	FilterSink.prototype.event = function (t, x) {
		var p = this.p;
		p(x) && this.sink.event(t, x);
	};

	function and(p, q) {
		return function (x) {
			return p(x) && q(x);
		};
	}

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Pipe = __webpack_require__(1);
	var Filter = __webpack_require__(29);
	var FilterMap = __webpack_require__(75);
	var base = __webpack_require__(3);

	module.exports = Map;

	function Map(f, source) {
		this.f = f;
		this.source = source;
	}

	/**
	 * Create a mapped source, fusing adjacent map.map, filter.map,
	 * and filter.map.map if possible
	 * @param {function(*):*} f mapping function
	 * @param {{run:function}} source source to map
	 * @returns {Map|FilterMap} mapped source, possibly fused
	 */
	Map.create = function createMap(f, source) {
		if (source instanceof Map) {
			return new Map(base.compose(f, source.f), source.source);
		}

		if (source instanceof Filter) {
			return new FilterMap(source.p, f, source.source);
		}

		if (source instanceof FilterMap) {
			return new FilterMap(source.p, base.compose(f, source.f), source.source);
		}

		return new Map(f, source);
	};

	Map.prototype.run = function (sink, scheduler) {
		return this.source.run(new MapSink(this.f, sink), scheduler);
	};

	function MapSink(f, sink) {
		this.f = f;
		this.sink = sink;
	}

	MapSink.prototype.end = Pipe.prototype.end;
	MapSink.prototype.error = Pipe.prototype.error;

	MapSink.prototype.event = function (t, x) {
		var f = this.f;
		this.sink.event(t, f(x));
	};

/***/ },
/* 31 */
/***/ function(module, exports) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	exports.isIterable = isIterable;
	exports.getIterator = getIterator;
	exports.makeIterable = makeIterable;

	/*global Set, Symbol*/
	var iteratorSymbol;
	// Firefox ships a partial implementation using the name @@iterator.
	// https://bugzilla.mozilla.org/show_bug.cgi?id=907077#c14
	if (typeof Set === 'function' && typeof new Set()['@@iterator'] === 'function') {
		iteratorSymbol = '@@iterator';
	} else {
		iteratorSymbol = typeof Symbol === 'function' && Symbol.iterator || '_es6shim_iterator_';
	}

	function isIterable(o) {
		return typeof o[iteratorSymbol] === 'function';
	}

	function getIterator(o) {
		return o[iteratorSymbol]();
	}

	function makeIterable(f, o) {
		o[iteratorSymbol] = f;
		return o;
	}

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Observer = __webpack_require__(80);
	var dispose = __webpack_require__(2);
	var defaultScheduler = __webpack_require__(77);

	exports.withDefaultScheduler = withDefaultScheduler;
	exports.withScheduler = withScheduler;

	function withDefaultScheduler(f, source) {
		return withScheduler(f, source, defaultScheduler);
	}

	function withScheduler(f, source, scheduler) {
		return new Promise(function (resolve, reject) {
			runSource(f, source, scheduler, resolve, reject);
		});
	}

	function runSource(f, source, scheduler, resolve, reject) {
		var disposable = dispose.settable();
		var observer = new Observer(f, resolve, reject, disposable);

		disposable.setDisposable(source.run(observer, scheduler));
	}

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var defer = __webpack_require__(27);

	module.exports = DeferredSink;

	function DeferredSink(sink) {
		this.sink = sink;
		this.events = [];
		this.length = 0;
		this.active = true;
	}

	DeferredSink.prototype.event = function (t, x) {
		if (!this.active) {
			return;
		}

		if (this.length === 0) {
			defer(new PropagateAllTask(this));
		}

		this.events[this.length++] = { time: t, value: x };
	};

	DeferredSink.prototype.error = function (t, e) {
		this.active = false;
		defer(new ErrorTask(t, e, this.sink));
	};

	DeferredSink.prototype.end = function (t, x) {
		this.active = false;
		defer(new EndTask(t, x, this.sink));
	};

	function PropagateAllTask(deferred) {
		this.deferred = deferred;
	}

	PropagateAllTask.prototype.run = function () {
		var p = this.deferred;
		var events = p.events;
		var sink = p.sink;
		var event;

		for (var i = 0, l = p.length; i < l; ++i) {
			event = events[i];
			sink.event(event.time, event.value);
			events[i] = void 0;
		}

		p.length = 0;
	};

	PropagateAllTask.prototype.error = function (e) {
		this.deferred.error(0, e);
	};

	function EndTask(t, x, sink) {
		this.time = t;
		this.value = x;
		this.sink = sink;
	}

	EndTask.prototype.run = function () {
		this.sink.end(this.time, this.value);
	};

	EndTask.prototype.error = function (e) {
		this.sink.error(this.time, e);
	};

	function ErrorTask(t, e, sink) {
		this.time = t;
		this.value = e;
		this.sink = sink;
	}

	ErrorTask.prototype.run = function () {
		this.sink.error(this.time, this.value);
	};

	ErrorTask.prototype.error = function (e) {
		throw e;
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var PropagateTask = __webpack_require__(6);

	module.exports = ValueSource;

	function ValueSource(emit, x) {
		this.emit = emit;
		this.value = x;
	}

	ValueSource.prototype.run = function (sink, scheduler) {
		return new ValueProducer(this.emit, this.value, sink, scheduler);
	};

	function ValueProducer(emit, x, sink, scheduler) {
		this.task = scheduler.asap(new PropagateTask(emit, x, sink));
	}

	ValueProducer.prototype.dispose = function () {
		return this.task.cancel();
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = selectorParser;

	var _browserSplit = __webpack_require__(47);

	var _browserSplit2 = _interopRequireDefault(_browserSplit);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
	var notClassId = /^\.|#/;

	function selectorParser() {
	  var selector = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

	  var tagName = undefined;
	  var id = '';
	  var classes = [];

	  var tagParts = (0, _browserSplit2.default)(selector, classIdSplit);

	  if (notClassId.test(tagParts[1]) || selector === '') {
	    tagName = 'div';
	  }

	  var part = undefined;
	  var type = undefined;
	  var i = undefined;

	  for (i = 0; i < tagParts.length; i++) {
	    part = tagParts[i];

	    if (!part) {
	      continue;
	    }

	    type = part.charAt(0);

	    if (!tagName) {
	      tagName = part;
	    } else if (type === '.') {
	      classes.push(part.substring(1, part.length));
	    } else if (type === '#') {
	      id = part.substring(1, part.length);
	    }
	  }

	  return {
	    tagName: tagName,
	    id: id,
	    className: classes.join(' ')
	  };
	}

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var VNode = __webpack_require__(15);
	var is = __webpack_require__(10);

	function addNS(data, children) {
	  data.ns = 'http://www.w3.org/2000/svg';
	  if (children !== undefined) {
	    for (var i = 0; i < children.length; ++i) {
	      addNS(children[i].data, children[i].children);
	    }
	  }
	}

	module.exports = function h(sel, b, c) {
	  var data = {},
	      children,
	      text,
	      i;
	  if (arguments.length === 3) {
	    data = b;
	    if (is.array(c)) {
	      children = c;
	    } else if (is.primitive(c)) {
	      text = c;
	    }
	  } else if (arguments.length === 2) {
	    if (is.array(b)) {
	      children = b;
	    } else if (is.primitive(b)) {
	      text = b;
	    } else {
	      data = b;
	    }
	  }
	  if (is.array(children)) {
	    for (i = 0; i < children.length; ++i) {
	      if (is.primitive(children[i])) children[i] = VNode(undefined, undefined, undefined, children[i]);
	    }
	  }
	  if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g') {
	    addNS(data, children);
	  }
	  return VNode(sel, data, children, text, undefined);
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__ = __webpack_require__(16);
	/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom___default = __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__ && __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__.__esModule ? function() { return __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__['default'] } : function() { return __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__; }
	/* harmony import */ Object.defineProperty(__WEBPACK_IMPORTED_MODULE_0__motorcycle_dom___default, 'a', { get: __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom___default });


	/*
	import {subject} from 'most-subject'
	var sub = subject
	var observer = sub.observer;
	var stream = sub.stream;
	*/

	var Monad = function Monad(z) {
	  var _this = this;

	  var g = arguments.length <= 1 || arguments[1] === undefined ? 'anonymous' : arguments[1];

	  this.id = g;
	  this.x = z;
	  this.bnd = function (func) {
	    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      args[_key - 1] = arguments[_key];
	    }

	    return func.apply(undefined, [_this.x].concat(args));
	  };
	  this.ret = function (a) {
	    return window[_this.id] = new Monad(a, _this.id);
	  };
	};

	var mMname = new Monad('Fred', 'mMname');

	const monad = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', { style: { color: '#AFEEEE' } }, `  const Monad = function Monad(z, ID = 'anonymous') {
	    this.id = g;
	    this.x = z;
	    this.bnd = (func, ...args) => func(this.x, ...args);
	    this.ret =  a => window[this.id] = new Monad(a,this.id);
	  }; `);

	const monadIt = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', { style: { color: '#AFEEEE' } }, `  const MonadItter = () => {
	    this.p = function () {};
	    this.release = (...args) => this.p(...args);
	    this.bnd = func => this.p = func;
	  }; `);

	const ret = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', { style: { color: '#AFEEEE' } }, `  var ret = function ret(v, id) {
	    if (arguments.length === 1) {
	      return (new Monad(v, 'anonymous'));
	    }
	    window[id] = new Monad(v, id);
	    return window[id];
	  }; `);

	var fib = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  mM$fib.stream.addListener({
	    next: v => {
	      if (v[2] > 1) {mM$fib.ret([v[1], v[0] + v[1], v[2] -1])}
	      else {
	        mM19.ret(v[1]);
	      }
	    },
	    error: err => console.error(err),
	    complete: () => console.log('completed')
	  });

	  const fibPress$ = sources.DOM
	    .select('input#code').events('keydown');

	  const fibPressAction$ = fibPress$.map(e => {
	    if (e.target.value == '') {return};
	    if( e.keyCode == 13 && Number.isInteger(e.target.value*1) ) {
	      mM21.ret(e.target.value);
	      mM$fib.ret([0, 1, e.target.value]);
	    }
	    if( e.keyCode == 13 && !Number.isInteger(e.target.value*1 )) {
	      mM19.ret("You didn't provide an integer");
	    }
	  });  `);

	var driver = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  var websocketsDriver = function () {
	      return create((add) => {
	        socket.onmessage = msg => add(msg)
	      })
	  };
	`);

	var messages = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  const messages$ = (sources.WS).map(e => 
	    mMtem.ret(e.data.split(',')).bnd(v => {
	    console.log('<><><><><><><><><><><><><><><><>  INCING  <><><><><><><> >>> In messages. v is ', v );
	    mMZ10.bnd(() => mM1.ret([v[3], v[4], v[5], v[6]]).bnd(ar => game(ar))) 
	    mMZ11.bnd(() => socket.send('NN#$42,' + pMgroup.x + ',' + pMname.x))
	    mMZ12.bnd(() => mM6.ret(v[2] + ' successfully logged in.'))
	    mMZ13.bnd(() => updateMessages(v))
	    mMZ14.bnd(() => mMgoals2.ret('The winner is ' + v[2] ))
	    mMZ15.bnd(() => mMgoals2.ret('A player named ' + v[2] + ' is currently logged in. Page will refresh in 4 seconds.')
	    .bnd(refresh))
	    mMZ16.bnd(() => {if (pMname.x != v[2]) {mMgoals2.ret(v[2] + v[3])}})
	    mMZ17.bnd(() => {
	      if (v[3] == 'no file') {
	        mMtaskList.ret([])
	      } 
	      else {
	        process(e.data)
	      }
	    })
	    mMZ18.bnd(() => player(v))
	    mMZ19.bnd(() => {
	      var names = v.slice(3);
	      sMplayers.clear();
	      names.forEach(player => sMplayers.add(player.trim()))
	      game2();
	    }) })
	       mMtemp.ret(e.data.split(',')[0])
	      .bnd(next, 'CA#$42', mMZ10)
	      .bnd(next, 'XX#$42', mMZ11)
	      .bnd(next, 'CC#$42', mMZ12)
	      .bnd(next, 'CD#$42', mMZ13)
	      .bnd(next, 'CE#$42', mMZ14)
	      .bnd(next, 'EE#$42', mMZ15)
	      .bnd(next, 'DE#$42', mMZ16)
	      .bnd(next, 'DD#$42', mMZ17)
	      .bnd(next, 'CG#$42', mMZ18)
	      .bnd(next, 'NN#$42', mMZ19)
	  });  `);

	var MonadSet = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  var MonadSet = function MonadSet(set, ID) {
	    this.s = set;
	    this.bnd = (func, ...args) => func(this.s, ...args);  
	    this.add = a => new MonadSet(s.add(a), this.id);
	    this.delete = a => new MonadSet(s.delete(a), this.id);
	    this.clear = () => new MonadSet(s.clear(), this.id);
	  };  `);

	var nums = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `    const numClick$ = sources.DOM
	      .select('.num').events('click');
	       
	    const numClickAction$ = numClick$.map(e => {
	      if (mM3.x.length < 2) {
	        mM3.bnd(push, e.target.innerHTML, mM3)
	        var ar = mMhistorymM1.x[mMindex.x].slice()
	        ar.splice(e.target.id, 1)
	        mM1.ret(ar);
	        game(ar);
	      }
	      if (mM3.x.length === 2 && mM8.x !== 0) {
	        console.log('7777777777777777777777777777  In numClickAction$ heading for updateCalc.  mM1.x is ', mM1.x);
	        updateCalc();
	      }
	    }).startWith([0,0,0,0]);
	      
	    const opClick$ = sources.DOM
	      .select('.op').events('click');
	   
	    const opClickAction$ = opClick$.map(e => {
	      mM8.ret(e.target.textContent);
	      if (mM3.x.length === 2) {
	        updateCalc();
	      }
	    })
	   
	    var game = function game (z) {
	      console.log('>>>>>>>>>>>>>>> game has been called. mMindex.x and z are ', mMindex.x, z);
	      var x = z.slice();
	      var onlinePlayers;
	          mMindex.bnd(add, 1, mMindex).bnd(i => mMhistorymM1.bnd(spliceAdd, i, x, mMhistorymM1)
	            .bnd(() => mMplayerArchive.bnd(spliceAdd, i, playerMonad.s, mMplayerArchive)) 
	            .bnd(() => mMsetArchive.bnd(spliceAdd, i, sMplayers.s, mMsetArchive) ) 
	            .bnd(() => console.log('In game. >>>>>>>>>>>>>>>>>>>>>>>>>> i is ', i))  )          
	        document.getElementById('0').innerHTML = x[0];  
	        document.getElementById('1').innerHTML = x[1];  
	        document.getElementById('2').innerHTML = x[2];  
	        document.getElementById('3').innerHTML = x[3]; 
	        game2();
	        cleanup();
	    };
	  
	    var game2 = function game2 () {
	        var ar = Array.from(sMplayers.s);
	        document.getElementById('sb1').innerHTML = 'Name: ' +  pMname.x;
	        document.getElementById('sb2').innerHTML = 'Group: ' + pMgroup.x
	        document.getElementById('sb3').innerHTML = 'Score: ' + pMscore.x
	        document.getElementById('sb4').innerHTML = 'Goals: ' + pMgoals.x
	        document.getElementById('sb5').innerHTML = 'Currently online: ';
	        document.getElementById('sb6').innerHTML =  ar.join(', ');
	        cleanup();
	    };
	  });  `);

	const arrayFuncs = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  var push = function push(y,v,mon) {
	      if (Array.isArray(y)) {
	        let ar = [];
	        let keys = Object.keys(y);
	        for (let k in keys) {ar[k] = y[k]};
	        ar.push(v);
	        return mon.ret(ar);  
	      }
	      console.log('The value provided to push is not an array');
	      return ret(y);
	    };
	    
	    var spliceRemove = function splice(x, j, mon) {
	      if (Array.isArray(x)) {
	        let ar = [];
	        let keys = Object.keys(x);
	        for (let k in keys) {ar[k] = x[k]};
	        ar.splice(j,1);
	        return mon.ret(ar);  
	      }
	      console.log('The value provided to spliceRemove is not an array');
	      return ret(x);
	    };
	    
	    var spliceAdd = function splice(x, index, value, mon) {
	      if (Array.isArray(x)) {
	        let ar = [];
	        let keys = Object.keys(x);
	        for (let k in keys) {ar[k] = x[k]};
	        ar.splice(index, 0, value);
	        return mon.ret(ar);  
	      }
	      console.log('The value provided to spliceAdd is not an array');
	      return ret(x);
	    };
	    
	    var splice = function splice(x, start, end, mon) {
	      if (Array.isArray(x)) {
	        let ar = [];
	        let keys = Object.keys(x);
	        for (let k in keys) {ar[k] = x[k]};
	        ar.splice(start, end);
	        return mon.ret(ar);  
	      }
	      console.log('The value provided to spliceAdd is not an array');
	      return ret(x);
	    };
	  `);

	var cleanup = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  function cleanup (x) {
	      let target0 = document.getElementById('0');
	      let target1 = document.getElementById('1');
	      let target2 = document.getElementById('2');
	      let target3 = document.getElementById('3');
	      let targetAr = [target0, target1, target2, target3];
	      for (let i in [0,1,2,3]) {
	        if (targetAr[i].innerHTML == 'undefined' )    {
	          targetAr[i].style.display = 'none';
	        }
	        else {
	          targetAr[i].style.display = 'inline';
	        }
	      }
	      return ret(x);
	  }; `);

	var travel = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `    const forwardClick$ = sources.DOM
	      .select('#forward').events('click');
	   
	      const backClick$ = sources.DOM
	        .select('#back').events('click');
	     
	      const forwardAction$ = forwardClick$.map(() => {
	        if (mMindex.x < (mMhistorymM1.x.length - 1)) {
	          mMindex.bnd(add, 1, mMindex)
	          .bnd(v => trav(v))
	        }
	      });
	     
	      const backAction$ = backClick$.map(() => {
	        if (mMindex.x > 0) {
	          mMindex.bnd(add, -1, mMindex)
	          .bnd(v => trav(v))
	          socket.send('DE#$42,' + pMgroup.x + ',' + pMname.x + ', clicked the BACK button. ');
	        }
	      });
	    
	    var trav = function trav (index) {       
	      document.getElementById('0').innerHTML = mMhistorymM1.x[index][0]; 
	      document.getElementById('1').innerHTML = mMhistorymM1.x[index][1]; 
	      document.getElementById('2').innerHTML = mMhistorymM1.x[index][2]; 
	      document.getElementById('3').innerHTML = mMhistorymM1.x[index][3];
	      document.getElementById('sb3').innerHTML = 'Score: ' + mMplayerArchive.x[index][2];
	      document.getElementById('sb4').innerHTML = 'Goals: ' + mMplayerArchive.x[index][3];
	      if (pMgroup.x != 'solo') {
	        document.getElementById('sb6').innerHTML =  Array.from(mMsetArchive.x[index].s);
	      }
	      cleanup();
	    };    `);

	var C42 = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  mMZ10.bnd(() => mM$1
	     .ret([mMar.x[3], mMar.x[4], mMar.x[5], mMar.x[6]])
	     .bnd(() => mM$2.ret([]))
	     .bnd(displayInline,'0')
	     .bnd(displayInline,'1')
	     .bnd(displayInline,'2')
	     .bnd(displayInline,'3'));  `);

	var taskStream = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  
	      `);

	var deleteTask2 = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  mMZ19.bnd(() => mM$task.bnd(spliceRemove, mMar.x[3], mM$task));
	  `);

	var newTask = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  const newTask$ = sources.DOM
	    .select('input.newTask').events('keydown'); 

	  const newTaskAction$ = newTask$.map(e => {
	      let ob = {};
	      var alert = '';
	      var ar = e.target.value.split(',');
	      var ar2 = ar.slice(2);
	      var task = '';
	      if (ar.length < 4) {
	        task = ar[2];
	      }
	      if (ar.length > 3) {
	        task = ar2.reduce((a,b) => a + '$*$*$' + b);
	      }
	      if( e.keyCode == 13 ) {
	        if ( ar.length < 3 ) {
	          alert = 'You should enter "author, responsible party, task" separated by commas';
	          document.getElementById('alert').innerHTML = alert;
	        }

	        else if ( (mMar2.x.filter(v => (v.task == task)).length) > 0 ) {
	          document.getElementById('alert').innerHTML = task + " is already listed.";
	        }

	        else if ( ar.length > 2 ) {
	          mM$taskList.bnd(addString, task + ',yellow, none, false,' +  ar[0] + ',' + ar[1], mM$taskList);
	          e.target.value = '';
	          document.getElementById('alert').innerHTML = '';
	        } 
	      } 
	  };  `);

	var process = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  const process = function(str) {
	    let a = str.split(",");
	    console.log('In process. str and a are: ', str, a);
	    if (a == undefined) {
	      return;
	    };
	    if (a.length < 9) {
	      return
	    };
	    let ob = {};
	    let ar = a.slice(3)
	    let s = ar.reduce((a,b) => a + ',' + b);
	    if (mM$taskList.x.length < 5) {
	      mM$taskList.ret(s);
	    }
	    let ar2 = [];
	    let tempArray = [];
	    if (ar.length < 6) {return};
	    if ((ar.length % 6) !== 0) {
	      document.getElementById('alert').innerHTML = 'Error: array length is: ' + length;
	    } else {
	      let keys = Array(ar.length/6).fill(1);
	      keys.map(_ => {
	        ar2.push(
	          {
	            task: convertBack(ar.shift()),
	            color: ar.shift(),
	            textDecoration: ar.shift(),
	            checked: ar.shift() === 'true',
	            author: ar.shift(),
	            responsible: ar.shift()
	          }
	        )
	      })
	      console.log('In process  ar2 is: ', ar2)
	      let keys2 = Object.keys(ar2);
	      for (let k in keys) {
	        tempArray.push(
	          h('div.todo',  [
	            h('span.task3', {style: {color: ar2[k].color, textDecoration: ar2[k].textDecoration}},
	                'Task: ' + ar2[k].task  ),  
	            h('br'),
	            h('button#edit1', 'Edit'  ),
	            h('input#edit2', {props: {type: 'textarea', value: ar2[k].task}, style: {display: 'none'}}  ), 
	            h('span#author.tao', 'Author: ' + ar2[k].author  + ' / ' + 'Responsibility: ' + ar2[k].responsible),
	            h('br'),
	            h('input#cb', {props: {type: 'checkbox', checked: ar2[k].checked}, style: {color: ar2[k].color,
	                 textDecoration: ar2[k].textDecoration} } ), 
	            h('label.cbox', { props: {for: '#cb'}}, 'Completed' ),
	            h('button.delete', 'Delete'  ),  
	            h('br'),
	            h('hr')])
	        )
	      }
	      mMtaskList.ret(tempArray)
	    }
	  };  `);

	var colorClick = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  const colorClick$ = sources.DOM
	    .select('#cb').events('click')
	    
	  const colorAction$ = colorClick$.map(e => {
	    let index = getIndex(e);
	    let s = mM$taskList.x;
	    let ar = s.split(',');
	    let n = 6 * index + 3;
	    let j = 6 * index + 2;
	    let k = 6 * index + 1;
	    let checked = ar[n];
	    if (checked == 'true')  {
	      ar[n] = 'false'; 
	      ar[k] = 'yellow'; 
	      ar[j] = 'none'; 
	    }
	    else {
	      ar[n] = 'true'; 
	      ar[k] = 'lightGreen'; 
	      ar[j] = 'line-through'; 
	    }
	    mM$taskList.ret( ar.reduce((a,b) => a + ',' + b) )
	  });  
	                     
	  var getIndex = function getIndex (event_object) {
	    var task = event_object.currentTarget.parentNode.innerText;
	    var possibilities = event_object.currentTarget.parentNode.parentNode.childNodes;
	    var keys = Object.keys(possibilities);
	    for (let k in keys) {
	      if (task == possibilities[k].innerText) {
	        return k
	      }
	    }
	    console.log('In getIndex. No match');
	  }  `);

	var edit = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  const edit1$ = sources.DOM
	    .select('#edit1').events('click')
	    
	  const edit1Action$ = edit1$.map(e => {
	    let index = getIndex2(e);
	    mMtaskList.x[index].children[3].elm.style.display = 'block';
	  });

	  const edit2$ = sources.DOM
	    .select('#edit2').events('keypress')
	    
	  const edit2Action$ = edit2$.map(e => {
	    let v = e.target.value;
	    let index = getIndex2(e);
	    if( e.keyCode == 13 ) {
	      process2(v, index);
	    mMtaskList.x[index].children[3].elm.style.display = 'none';
	    }
	  });

	  const process2 = function(str, index) {
	    var a = mMcurrentList.x.split(',');
	    a[6*index] = str;
	    var b = a.reduce((a,b) => a + ',' + b)
	    task2(b);  
	  };

	  var getIndex2 = function getIndex2 (e) {
	    var elem = e.currentTarget.parentNode.children[0].innerHTML
	    var elem2 = e.currentTarget.parentNode.parentNode.childNodes
	    var keys = Object.keys(elem2);
	    for (let k in keys) {
	      if (elem == elem2[k].childNodes[0].innerHTML) {
	        return k
	      }
	      console.log('In getIndex2. No match');
	    }
	  }  `);

	var mM$task = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  const taskAction$ = mM$taskList.stream.map(str => {
	    socket.send('TD#$42' + ',' + mMgroup.x.trim() + 
	        ',' + mMname.x.trim() + ',' + '@' + str);
	  });  `);

	var updateCalc = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  function updateCalc() { 
	    mM3.bnd(ar => mM7       // mM3 contributes mM3.x to the computation.
	    .ret(calc(ar[0], mM8.x, ar[1]))      // mM8.x is the operator string.
	    .bnd(result =>   // The return value of calc(), which is mM7.x, is used three times.
	      {  mM1.bnd(push, result, mM1).bnd(z =>
	         mM$1.ret(z));                         // Updates the display.             
	        if (result == 20) {score(mM13.x, 1)}; 
	        if (result == 18) {score(mM13.x, 3)};
	      }
	    )) 
	    reset()
	  };

	  var score = function score(x,j) {
	    socket.send('CA#$42,' + pMgroup.x + ',' + pMname.x + ',6,6,12,20');
	    if ((x + j) == 20) {
	      mMplayer.ret([]);
	      mM13.ret(0).bnd(mMindex.ret);
	      mMhistorymM1.ret([0,0,0,0]);   
	      mMgoals.bnd(add, 1, mMgoals).bnd(v => {
	        if (v == 3) {
	          socket.send('CG#$42,' + pMgroup.x + ',' + pMname.x + ',' + -x + ',' + 0); 
	          socket.send('CE#$42,' + pMgroup.x + ',' + pMname.x + ',nothing ')
	          mMgoals.ret(0);
	        }
	        else socket.send('CG#$42,' + pMgroup.x + ',' + pMname.x + ',' + -x + ',' + v); 
	      })
	      return;
	    }
	    if ((x + j) % 5 == 0) {
	      socket.send('CG#$42,' + pMgroup.x + ',' + pMname.x + ','+ (j+5)+',' + mMgoals.x); 
	      mM13.ret(x + j + 5);
	      return;
	    } 
	    socket.send('CG#$42,' + pMgroup.x + ',' + pMname.x + ','+ j + ',' + mMgoals.x); 
	    mM13.ret(x + j);
	 };

	  var reset = function reset () {
	      mM3.ret([])
	      .bnd(() => mM4.ret(0)
	      .bnd(mM8.ret)
	      .bnd(cleanup))    // Hides 'undefined' values in the display.
	  }

	  var updateScoreboard = function updateScoreboard(v) {  // v is received from the server.
	    let ar2 = v.split("<br>");
	    let ar = ar.slice();
	    return mMscoreboard.ret(ar);
	  };  `);

	var testZ = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  mMZ1.bnd(v => mMt1.bnd(add,v,mMt1)
	  .bnd(cube,mMt2)
	  .bnd(() => mMt3.ret(mMt1.x + ' cubed is ' + mMt2.x)))  
	  
	  mMZ2.bnd(v => cube(v).bnd(w => mMt3.ret(v + ' cubed is ' + w)))  `);

	var quad = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  const quad$ = sources.DOM
	    .select('#quad').events('keypress')  // Motorcycle way to get user input.
	  
	  const quadAction$ = quad$.map((e) => {
	    if( e.keyCode == 13 ) {
	      mMZ3.release(e.target.value)       // Releases mMZ (below).
	      document.getElementById('quad').value = '';
	    }
	  });

	  var solve = function solve () {
	    mMZ3.bnd(a => 
	    mMtemp.ret(a)           
	    .bnd(display, 'quad4', '')         
	    .bnd(display, 'quad6', '')         
	    .bnd(display,'quad5', a + " * x * x ")
	    .bnd(a => mMZ3    // Blocks here until new user input comes in.
	    .bnd(b =>  mMtemp.ret(b)
	    .bnd(display, 'quad6', b + ' * x ').bnd(b => mMZ3  // Blocks again.
	    .bnd(c => mMtemp.ret([a,b,c]).bnd(fmap, qS4, "mMtemp")
	    .bnd(v => {  
	      let x = v[0]
	      let y = v[1]
	    mMtemp.bnd(display, 'quad4', "Results: " + x + " and  " + y)  
	    .bnd(display, 'quad5', p(a).text + " * " + x + " * " + x + " + " + p(b).text + 
	            " * " + x + " " + p(c).text + " = 0")
	    .bnd(display, 'quad6', p(a).text + " * " + y + " * " + y + " + " + p(b).text + 
	            " * " + y + " " + p(c).text + " = 0")   
	    solve();  
	    } ) ) ) ) ) ) 
	  };

	  var p = function p (x) { 
	    if (x >= 0) {return ' + ' + x}
	    if (x < 0 ) {return ' - ' + Math.abs(x)}
	  }

	  var qS1 = function qS1 (a, b, c) {
	    let n = (b*(-1)) + (Math.sqrt(b*b - 4*a*c));
	    if (n != n) {
	      return "No solution";
	    }
	    return n/(2*a);
	  }

	  var qS2 = function qS2 (a, b, c) {
	    let n = (b*(-1)) - (Math.sqrt(b*b - 4*a*c));
	    if (n != n) {
	      return "No solution";
	    }
	    return n/(2*a);
	  
	  function fmap (x, g, id) {
	    window[id] = new Monad(g(x), id); 
	    return window[id]
	  }
	  
	  var display = function display (x, id, string) {
	    document.getElementById(id).innerHTML = string;
	    return ret(x);
	  }  `);

	var mdem1 = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  var equals = function equals (x, mon1, mon2, mon3) {
	    if (mon1.id === mon2.id && mon1.x === mon2.x) {
	      mon3.ret('true');
	    } else mon3.ret('false');
	    return ret(x);
	  }
	  
	  var add = function(x,b,mon) {
	    if (arguments.length === 3) {
	      return mon.ret(x + b);
	    }
	    return ret(x+b);
	  }

	  var cube = function(v,mon) {
	    if (arguments.length === 2) {
	      return mon.ret(v*v*v);
	    }
	    return ret(v*v*v);
	  }  `);

	var runTest = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  var runTest = function monTest () {
	  mM5.bnd( equals,  
	    m.ret(0).bnd(v => add(v, 3, m).bnd(cube)), 
	    m.ret(0).bnd(add, 3, m).bnd(cube), mMa)

	  mM5.bnd(equals, m, m.bnd(m.ret), mMb)

	  mM5.bnd(equals, m, m.ret(m.x), mMc)
	  }  `);

	var inc = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  var inc = function inc(x, mon) {
	      return mon.ret(x + 1);
	  };

	  var spliceAdd = function spliceAdd(x, index, value, mon) {
	    if (Array.isArray(x)) {
	      let ar = [];
	      let keys = Object.keys(x);
	      for (let k in keys) {ar[k] = x[k]};
	      ar.splice(index, 0, value);
	      return mon.ret(ar);  
	    }
	    console.log('The value provided to spliceAdd is not an array');
	    return ret(x);
	  }  `);

	var todoStream = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  const taskAction$ = mM$taskList.stream.map(str => {
	    socket.send('TD#$42' + ',' + mMgroup.x.trim() + 
	        ',' + mMname.x.trim() + ',' + '@' + str);
	  });  `);

	var add = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  var add = function(x,b,mon) {
	    if (arguments.length === 3) {
	      return mon.ret(x + b);
	    }
	    return ret(x+b);  
	  }; `);

	var ret_add_cube = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  var ret = function ret(v, id) {
	    if (arguments.length === 1) {
	      return (new Monad(v, 'anonymous'));
	    }
	    window[id] = new Monad(v, id);
	    return window[id];
	  }  

	  var add = function(x,b,mon) {
	    if (arguments.length === 3) {
	      return mon.ret(x + b);
	    }
	    return ret(x+b);
	  };

	  var cube = function(v,mon) {
	    if (arguments.length === 2) {
	      return mon.ret(v*v*v);
	    }
	    return ret(v*v*v);
	}  `);

	var seed = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  mM$prime.ret([[2],3])  `);

	var traverse = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  const forwardClick$ = sources.DOM
	    .select('#forward').events('click');
	 
	  const backClick$ = sources.DOM
	    .select('#back').events('click');
	 
	  const forwardAction$ = forwardClick$.map(() => {
	    if (mMindex.x < (mMhistorymM1.x.length - 1)) {
	      mMindex.bnd(add, 1, mMindex)
	      .bnd(v => trav(v))
	    }
	  });
	 
	  const backAction$ = backClick$.map(() => {
	    if (mMindex.x > 0) {
	      mMindex.bnd(add, -1, mMindex)
	      .bnd(v => trav(v))
	      socket.send('DE#$42,' + pMgroup.x + ',' + pMname.x + ', clicked the BACK button. ');
	    }
	  });

	  var game = function game (z) {  // Runs each time a number is clicked
	    var x = z.slice();
	        mMindex.bnd(add, 1, mMindex)
	          .bnd(i => mMhistorymM1.bnd(spliceAdd, i, x, mMhistorymM1)
	            .bnd(() => mMplayerArchive.bnd(spliceAdd, i, playerMonad.s, mMplayerArchive)) 
	            .bnd(() => mMsetArchive.bnd(spliceAdd, i, sMplayers.s, mMsetArchive) ) 
	      document.getElementById('0').innerHTML = x[0];  
	      document.getElementById('1').innerHTML = x[1];  
	      document.getElementById('2').innerHTML = x[2];  
	      document.getElementById('3').innerHTML = x[3]; 
	      game2();
	      cleanup();
	  };

	  var game2 = function game2 () {
	      var ar = Array.from(sMplayers.s);
	      document.getElementById('sb1').innerHTML = 'Name: ' +  pMname.x;  // kept current by playerMonad
	      document.getElementById('sb2').innerHTML = 'Group: ' + pMgroup.x
	      document.getElementById('sb3').innerHTML = 'Score: ' + pMscore.x
	      document.getElementById('sb4').innerHTML = 'Goals: ' + pMgoals.x
	      document.getElementById('sb5').innerHTML = 'Currently online: ';
	      document.getElementById('sb6').innerHTML =  ar.join(', ');
	      cleanup();
	  };
	 
	  var trav = function trav (index) {       
	    document.getElementById('0').innerHTML = mMhistorymM1.x[index][0]; 
	    document.getElementById('1').innerHTML = mMhistorymM1.x[index][1]; 
	    document.getElementById('2').innerHTML = mMhistorymM1.x[index][2]; 
	    document.getElementById('3').innerHTML = mMhistorymM1.x[index][3];
	    document.getElementById('sb3').innerHTML = 'Score: ' + mMplayerArchive.x[index][2];
	    document.getElementById('sb4').innerHTML = 'Goals: ' + mMplayerArchive.x[index][3];
	    if (pMgroup.x != 'solo') {
	      document.getElementById('sb6').innerHTML =  Array.from(mMsetArchive.x[index].s);
	    }
	    cleanup();
	  };  `);

	var MonadState = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  const MonadState = function (g, state, value, p)  {
	  this.id = g;
	  this.s = state;
	  this.a = value;
	  this.process = p;
	  this.bnd = (func, ...args) => func(this.s, ...args);  
	  this.run = st => { 
	    let s = this.process(st); 
	    let a = s[3];
	    window[this.id] = new MonadState(this.id, s, a, this.process);
	    return window[this.id];
	  }
	}  `);

	var primesMonad = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  var primesMonad = new MonadState('primesMonad', [2, '', 3, [2]], [2],  primes_state) 

	  var primes_state = function primes_state(x) {
	    var v = x.slice();
	      while (2 == 2) {
	        if (v[3].every(e => ((v[0]/e) != Math.floor(v[0]/e)))) {
	          v[3].push(v[0]);
	        }
	        if (v[3][v[3].length - 1] > v[2]) { break }; // Not an infinite loop afterall
	        v[0]+=2;
	      }
	    return v;
	  }  `);

	var fibsMonad = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  var fibsMonad = new MonadState('fibsMonad', [0, 1, 3, [0,1]], [0,1], fibs_state  ) 

	  var fibs_state = function fibs_state(ar) {
	    var a = ar.slice();
	    while (a[3].length < a[2]) {
	      a = [a[1], a[0] + a[1], a[2], a[3].concat(a[0])];
	    }
	    return a
	  }  `);

	var tr3 = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  var tr3 = function tr (fibsArray, primesArray) {
	    var bound = Math.ceil(Math.sqrt(fibsArray[fibsArray.length - 1]))
	    var primes = primesArray.slice();
	    if (primesArray.slice(-1)[0] >= bound) {
	      primes = primesArray.filter(v => v <= bound);
	    } 
	    var ar = [];
	    var fibs = fibsArray.slice(3);
	    fibs.map (v => {
	      if (primesArray.every(p => (v % p || v == p))) ar.push(v);
	    })
	    return [fibsArray, primes, ar]
	  }  `);

	var primeFibInterface = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  const fibKeyPress5$ = sources.DOM
	    .select('input#fib92').events('keydown');

	  const primeFib$ = fibKeyPress5$.map(e => {
	    if( e.keyCode == 13 ) {
	      var res = fibsMonad
	      .run([0, 1, e.target.value, []])
	      .bnd(fibsState => fibsMonad
	      .bnd(fpTransformer, primesMonad)
	      .bnd(primesState => tr3(fibsState[3],primesState[3])))
	      document.getElementById('PF_9').innerHTML = res[0];
	      document.getElementById('PF_22').innerHTML = res[1];
	      document.getElementById('primeFibs').innerHTML = res[2];
	    }
	  });  `);

	var fpTransformer = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  var fpTransformer = function fpTransformer (s, m) {
	    var bound = Math.ceil(Math.sqrt(s[3][s[3].length - 1]));
	    if (bound > m.a[m.a.length - 1] ) {
	      m.run([m.s[0], "from the fibKeyPress5$ handler", bound, primesMonad.a])
	    }
	    return m;
	  }  `);

	var innerHTML = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  var innerHTML = function innerHTML (x, v, u, m) { 
	    document.getElementById(u).innerHTML = v;
	    return m.ret(x);
	  }  `);

	var factorsMonad = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  var factorsMonad = new MonadState('factorsMonad', [ 2, [], 4, [] ], [], factor_state); 

	  function factor_state(v) {
	    v[3].map(p => {
	      if (v[2]/p == Math.floor(v[2]/p)) {v[1].push(p)}
	    })
	    return v;
	  }  `);

	var factorsInput = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  var prFactTransformer = function prFactTransformer (s, m) {
	    return m.run([s[0], [], mMfactors.x, s[3]])
	  }

	  const factorsPress$ = sources.DOM
	    .select('input#factors_1').events('keydown');

	  const factorsAction$ = factorsPress$.map(e => {
	    mMfactors.ret(e.target.value);                  // Used in prFactTransformer (above)
	    if (e.target.value == '') {return};
	    if( e.keyCode == 13 && Number.isInteger(e.target.value*1) ) {
	      var result;
	      var factors = primesMonad.run([primesMonad.s[0], [], e.target.value, primesMonad.a])
	      .bnd(prFactTransformer, factorsMonad).s[1];  // prFactTransformer (defined above) returns factorsMonad
	      if (e.target.value == factors.slice().pop()){
	        result = e.target.value + ' is a prime number'
	      }
	      else {
	        result = 'The prime factors of ' + e.target.value + ' are ' + factors;
	      }
	      document.getElementById('factors_3').innerHTML = result;
	    }
	  });
	             `);

	var playerMonad = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  var playerMonad = new MonadState('playerMonad', [0,0], [0,0], player_state);

	  function player_state (v) {
	    var x = v.slice();
	    let ar = [ 
	    pMscore.ret(x[0]),
	    pMgoals.ret(x[1]) ]
	    playerMonad.a = ar;
	    playerMonad.s = ar;  
	    return x; 
	  };  `);

	var MonadSet = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  var MonadSet = function MonadSet(set, ID) {
	    var _this = this;
	  
	    this.s = set;
	  
	    if (arguments.length === 1) this.id = 'anonymous';
	    else this.id = ID;
	  
	    this.bnd = function (func, ...args) {
	       return func(_this.x, ...args);
	    };
	  
	    this.add = function (a) {
	      var ar = Array.from(_this.s);
	      set = new Set(ar);
	      set.add(a);
	      window[_this.id] = new MonadSet(set, _this.id);
	      return window[_this.id];
	    };
	  
	    this.delete = function (a) {
	      var ar = Array.from(_this.s);
	      set = new Set(ar);
	      set.delete(a);
	      window[_this.id] = new MonadSet(set, _this.id);
	      return window[_this.id];
	    };
	  
	    this.clear = function () {
	      set = new Set([]);
	      window[_this.id] = new MonadSet(set, _this.id);
	      return window[_this.id];
	    };
	  };
	  
	  var s = new Set();
	  
	  var sMplayers = new MonadSet( s, 'sMplayers' )  `);

	var promise = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `      var promise = function promise(x, t, mon, args) {
	        return (new Promise((resolve) => {
	          setTimeout(function() {
	            resolve(eval("mon.ret(x).bnd(" + args + ")"))   // eval! Get over it, Douglas.
	          },t*1000  );
	        }));
	      };  `);

	var promiseSnippet = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  m.ret(3).bnd(promise, 2, m, "cube").then(data => m.ret(data.x).bnd(add, 15, m))  `);

	var timeoutSnippet = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  const timeoutClicks$ = sources.DOM.select('#timeout').events('click')

	  const timeoutAction$ = timeoutClicks$.map(() => {
	    document.getElementById('timeout2').innerHTML = ''
	    m.ret(3, 'm')
	      .bnd(timeout2, 1, m, [() => m
	      .bnd(cube, m)
	      .bnd(display, 'timeout2', 'm.x is ' + ' ' + m.x, m)
	      .bnd(timeout2, 2, m, [() => m
	      .bnd(add, 15, m)
	      .bnd(display, 'timeout2',  'm.x is ' + ' ' + m.x, m)
	      /* Continue chaining from here */
	      .bnd(display, 'timeout3', 'The meaning of everything was computed to be' + ' ' + m.x, m)   
	    ])]);  
	  });  `);

	var timeout = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  var timeout2 = function timeout (x, t, m, args) {
	    setTimeout(function () {
	      mMZ9.release();
	    }, t * 1000  );
	    return mMZ9.bnd(() => m.bnd(... args))
	  };  `);

	var examples = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', ` 
	             ret('m1Val','m1')
	             m1.x === 'm1Val'   // true
	             ret('m2Val', 'm2')
	             m2.x === 'm2Val'   // true

	             m1.bnd(m2.ret)
	             m2.x === 'm1Val' // true
	             m2.x === 'm2Val'   // still true

	             m1.ret('newVal')
	             m1.bnd(v => ret(v, 'm2'))
	             m2.x === 'newVal'  // true
	             m2.x === 'm1Val' // true   still the same  `);

	var examples2 = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', ` 
	  var m = new Monad(v, "m");
	  ret(v, "m");
	             `);

	var async = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  const LOCKED = ret(true, 'LOCKED');
	  LOCKED.ret(true);   // Creates LOCKED

	  const messages2$ = (sources.WS).map(e => {
	    if (!LOCKED.x) {
	      var v2 = e.data.split(',');
	      ret(v2.slice(3))
	      .bnd(v => mMtemp.bnd(display,'request2', 'The current online members of ' + pMgroup.x + ' are:')
	      .bnd(() => mMtemp.bnd(display,'request3', v) 
	      .bnd(() => mMtemp.bnd(log, "The members are " + v )
	      .bnd(() => LOCKED.ret(true)))))
	    }
	  });

	  const requestClicks$ = sources.DOM.select('#request').events('click');

	  const requestAction$ = requestClicks$.map(() => {
	    if (pMgroup.x != 'solo') {         // The default non-group
	      LOCKED.ret(false);
	      socket.send('NN#$42,' + pMgroup.x  + ',' + pMname.x + ',' + pMgroup ); 
	    }
	  });

	var display = function display (x, id, string) {
	  document.getElementById(id).innerHTML = string;
	  return ret(x);
	}  `);

	var e1 = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  var ret = function ret(v, id) {
	    if (arguments.length === 1) {
	      return (new Monad(v, 'anonymous'));
	    }
	    window[id] = new Monad(v, id);
	    return window[id];
	  }
	  
	  var cube = function(v,mon) {
	    if (arguments.length === 2) {
	      return mon.ret(v*v*v);
	    }
	    return ret(v*v*v);
	  }
	  
	  var add = function(x,b,mon) {
	    if (arguments.length === 3) {
	      return mon.ret(x + b);
	    }
	    return ret(x+b);
	  }
	  
	  var log = function log(x, message, mon) {
	    console.log('In log. Entry: ', message);
	    if (arguments.length === 3) return mon
	    return ret(x);
	  };  `);

	var e2 = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  var c = m.ret(0).bnd(add,3).bnd(cube)
	  .bnd(log,"m.x and a.x are  " + m.x + " and " + a.x + " respectively ")
	  Output: In log. Entry:  m.x and a.x are  0 and 27 respectively 
	  Note: m.x keeps its initial value of 0.

	  m.bnd(() => add(0, 3).bnd(cube).bnd(m.ret).bnd(v => log("", "m.x is " + v))) 
	  Output: In log. Entry:  m.x is 27
	  Note: It doesn\'t matter what m.x was at the beginning of the computation.
	 
	  ret(3).bnd(v => ret(v*v).bnd(v2 => log("", "a squared is " + v2).bnd(() => 
	  ret(4*4).bnd(v3 => log("", "a squared plus b squared is " + (v2 + v3), m)))))
	  Output: In log. Entry:  a squared is 9
	          In log. Entry:  a squared plus b squared is 25  `);

	var equals = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `    var equals = function equals (mon1, mon2) {
	      if (mon1.id === mon2.id && mon1.x === mon2.x) return true;
	      else return false
	    }  `);

	var fmap = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `    function fmap (x, g, id) {window[id] = new Monad(g(x), id); return window[id]}
	  
	    var qS1 = function qS1 (a, b, c) {
	      let n = (b*(-1)) + (Math.sqrt(b*b - 4*a*c));
	      if (n != n) {
	        return "No solution";
	      }
	      return n/(2*a);
	    }
	  
	    var qS2 = function qS2 (a, b, c) {
	      let n = (b*(-1)) - (Math.sqrt(b*b - 4*a*c));
	      if (n != n) {
	        return "No solution";
	      }
	      return n/(2*a);
	    }
	  
	    var qS4 = function qS4 ([x,y,z]) {
	      let [a,b,c] = [x,y,z]
	      return [qS1(a,b,c), qS2(a,b,c)]    
	    }  
	    
	    m.ret([12,12,-144])
	  
	    m.bnd(fmap, qS4, "temp").bnd(lg)   logs [3, -4] `);

	var opM = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `    function opM (a, op, b, id) {
	      window[id] = new Monad(eval(a.x + op + b.x), id); 
	      return window[id];
	    }  
	    
	    m1.ret(42)

	    m2.ret(7)

	    opM(m1, "%", m2, "ok").bnd(lg)  logs 0

	    opM(m1, "+", m2, "ok").bnd(lg)  logs 49  `);

	var p7 = /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__motorcycle_dom__["h"]('pre', `  
	`);

	/* harmony default export */ exports["default"] = { monad, equals, fmap, opM, e1, e2, fib, driver, messages, next, monadIt, MonadSet, updateCalc, arrayFuncs, travel, nums, cleanup, ret, C42, newTask, process, mM$task, addString, colorClick, edit, testZ, quad, mdem1, runTest, todoStream, inc, ret_add_cube, seed, add, traverse, MonadState, primesMonad, fibsMonad, primeFibInterface, tr3, fpTransformer, innerHTML, factorsMonad, factorsInput, playerMonad, promise, promiseSnippet, timeout, timeoutSnippet, examples, examples2, async }

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.run = undefined;

	var _mostSubject = __webpack_require__(52);

	function makeSinkProxies(drivers) {
	  var sinkProxies = {};
	  var keys = Object.keys(drivers);
	  for (var i = 0; i < keys.length; i++) {
	    sinkProxies[keys[i]] = (0, _mostSubject.holdSubject)(1);
	  }
	  return sinkProxies;
	}

	function callDrivers(drivers, sinkProxies) {
	  var sources = {};
	  var keys = Object.keys(drivers);
	  for (var i = 0; i < keys.length; i++) {
	    var name = keys[i];
	    sources[name] = drivers[name](sinkProxies[name].stream, name);
	  }
	  return sources;
	}

	function makeHandleError(observer, onError) {
	  return function handleError(err) {
	    observer.error(err);
	    onError(err);
	  };
	}

	function replicateMany(_ref) {
	  var sinks = _ref.sinks;
	  var sinkProxies = _ref.sinkProxies;
	  var disposableStream = _ref.disposableStream;
	  var onError = _ref.onError;

	  var sinkKeys = Object.keys(sinks);
	  for (var i = 0; i < sinkKeys.length; i++) {
	    var name = sinkKeys[i];
	    if (sinkProxies.hasOwnProperty(name)) {
	      var observer = sinkProxies[name].observer;

	      sinks[name].until(disposableStream).observe(observer.next).then(observer.complete).catch(makeHandleError(observer, onError));
	    }
	  }
	}

	function assertSinks(sinks) {
	  var keys = Object.keys(sinks);
	  for (var i = 0; i < keys.length; i++) {
	    if (!sinks[keys[i]] || typeof sinks[keys[i]].observe !== 'function') {
	      throw new Error('Sink \'' + keys[i] + '\' must be a most.Stream');
	    }
	  }
	  return sinks;
	}

	var logErrorToConsole = typeof console !== 'undefined' && console.error ? function (error) {
	  console.error(error.stack || error);
	} : Function.prototype;

	var defaults = {
	  onError: logErrorToConsole
	};

	function runInputGuard(_ref2) {
	  var main = _ref2.main;
	  var drivers = _ref2.drivers;
	  var onError = _ref2.onError;

	  if (typeof main !== 'function') {
	    throw new Error('First argument given to run() must be the ' + '\'main\' function.');
	  }
	  if (typeof drivers !== 'object' || drivers === null) {
	    throw new Error('Second argument given to run() must be an ' + 'object with driver functions as properties.');
	  }
	  if (!Object.keys(drivers).length) {
	    throw new Error('Second argument given to run() must be an ' + 'object with at least one driver function declared as a property.');
	  }

	  if (typeof onError !== 'function') {
	    throw new Error('onError must be a function');
	  }
	}

	function run(main, drivers) {
	  var _ref3 = arguments.length <= 2 || arguments[2] === undefined ? defaults : arguments[2];

	  var _ref3$onError = _ref3.onError;
	  var onError = _ref3$onError === undefined ? logErrorToConsole : _ref3$onError;

	  runInputGuard({ main: main, drivers: drivers, onError: onError });

	  var _subject = (0, _mostSubject.subject)();

	  var disposableObserver = _subject.observer;
	  var disposableStream = _subject.stream;

	  var sinkProxies = makeSinkProxies(drivers);
	  var sources = callDrivers(drivers, sinkProxies);
	  var sinks = assertSinks(main(sources));
	  replicateMany({ sinks: sinks, sinkProxies: sinkProxies, disposableStream: disposableStream, onError: onError });

	  function dispose() {
	    disposableObserver.next(1);
	    disposableObserver.complete();
	  }

	  return { sinks: sinks, sources: sources, dispose: dispose };
	}

	exports.default = { run: run };
	exports.run = run;

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/// <reference path="./monad.ts" />
	/// <reference path="monad.ts" />
	/// <reference path="/home/e/MonadState/SRC/src/monad.ts" />
	/// <reference path="./code.ts" />
	"use strict";

	var core_1 = __webpack_require__(38);
	var dom_1 = __webpack_require__(16);
	var most_1 = __webpack_require__(4);
	var code_js_1 = __webpack_require__(37);
	var Greeter = function () {
	    function Greeter(message) {
	        this.greeting = message;
	    }
	    Greeter.prototype.greet = function () {
	        return "Hello, " + this.greeting;
	    };
	    return Greeter;
	}();
	var greeter;
	greeter = new Greeter("world");
	console.log(greeter.greet());
	function createWebSocket(path) {
	    var host = window.location.hostname;
	    if (host == '') host = 'localhost';
	    var uri = 'ws://' + host + ':3055' + path;
	    var Socket = "MozWebSocket" in window ? MozWebSocket : WebSocket;
	    return new Socket(uri);
	}
	var socket = createWebSocket('/');
	console.log('########## socket: ', socket);
	var websocketsDriver = function () {
	    return most_1.create(function (add) {
	        socket.onmessage = function (msg) {
	            return add(msg);
	        };
	    });
	};
	socket.onmessage = function (event) {
	    console.log(event);
	};
	socket.onclose = function (event) {
	    console.log(event);
	};
	function main(sources) {
	    mMindex.ret(0);
	    var messages$ = sources.WS.map(function (e) {
	        mMtem.ret(e.data.split(',')).bnd(function (v) {
	            console.log('<><><><><><><><><><><><><><><><>  INCOMING  <><><><><><><> >>> In messages. e amd v are ', e, v);
	            mMZ10.bnd(function () {
	                return mM1.ret(v.slice(3)).bnd(function (y) {
	                    return game([pMscore.x, pMgoals.x, y, mM3.x].concat(y));
	                });
	            });
	            mMZ11.bnd(function () {
	                return socket.send('CG#$42,' + pMgroup.x + ',' + pMname.x + ',' + pMscore + ',' + pMgoals);
	            });
	            mMZ12.bnd(function () {
	                return mM6.ret(v[2] + ' successfully logged in.');
	            });
	            mMZ13.bnd(function () {
	                return updateMessages(v);
	            });
	            mMZ14.bnd(function () {
	                return mMgoals2.ret('The winner is ' + v[2]);
	            });
	            mMZ15.bnd(function () {
	                return mMgoals2.ret('A player named ' + v[2] + ' is currently logged in. Page will refresh in 4 seconds.').bnd(refresh);
	            });
	            mMZ16.bnd(function () {
	                if (pMname.x != v[2]) {
	                    mMgoals2.ret(v[2] + v[3]);
	                }
	            });
	            mMZ17.bnd(function () {
	                if (v[3] == 'no file') {
	                    mMtaskList.ret([]);
	                } else {
	                    process(e.data);
	                }
	            });
	            mMZ18.bnd(function () {
	                if (pMname == v[2]) playerMonad.run([v[3], v[4]]);
	            });
	            mMZ19.bnd(function () {
	                sMplayers.clear();
	                var namesL = e.data.split("<br>");
	                var namesList = namesL.slice(1);
	                updateScoreboard2(namesList);
	                namesList.forEach(function (player) {
	                    return sMplayers.add(player.trim());
	                });
	                game2();
	                console.log('In mMZ19 <><><><><><> namesL, and namesList are ', namesL, namesList);
	            });
	        });
	        mMtemp.ret(e.data.split(',')[0]).bnd(next, 'CA#$42', mMZ10).bnd(next, 'XX#$42', mMZ11).bnd(next, 'CC#$42', mMZ12).bnd(next, 'CD#$42', mMZ13).bnd(next, 'CE#$42', mMZ14).bnd(next, 'EE#$42', mMZ15).bnd(next, 'DE#$42', mMZ16).bnd(next, 'DD#$42', mMZ17).bnd(next, 'CG#$42', mMZ18).bnd(next, 'NN#$42', mMZ19);
	    });
	    var updateScoreboard2 = function updateScoreboard(v) {
	        var ar = [];
	        for (var _i = 0, v_1 = v; _i < v_1.length; _i++) {
	            var k = v_1[_i];
	            ar.push(['  ' + k]);
	        }
	        ;
	        return mMscoreboard.ret(ar);
	    };
	    var updateMessages = function updateMessages(ar) {
	        console.log('8888888888888888888888888In updateMessages ar is >>>>>>>>>>>>>>', ar);
	        var sender = ar[2];
	        mMhelper.ret(ar).bnd(slice, 3, mMtemp3).bnd(intersperse, mMtemp4).bnd(function (v) {
	            return mMmsg.bnd(unshift, dom_1.h('div', sender + ': ' + v), mMmsg);
	        });
	        console.log('99999999999999999999999In updateMessages mMmsg is ', mMmsg);
	    };
	    var loginPress$ = sources.DOM.select('input#login').events('keypress');
	    var loginPressAction$ = loginPress$.map(function (e) {
	        var v = e.target.value;
	        if (v == '') {
	            return;
	        }
	        if (e.keyCode == 13) {
	            socket.send("CC#$42" + e.target.value);
	            pMname.ret(e.target.value);
	            console.log('33333333333333333333333333333333333333 login e.target.value ', e.target.value);
	            game2();
	            mM3.ret([]);
	            document.getElementById('dice').style.display = 'block';
	            document.getElementById('rightPanel').style.display = 'block';
	            document.getElementById('log1').style.display = 'none';
	            document.getElementById('log2').style.display = 'block';
	            document.getElementById('gameDiv2').style.display = 'block';
	            console.log('In loginPressAction$ ', socket.readyState);
	        }
	    });
	    var groupPress$ = sources.DOM.select('input#group').events('keypress');
	    var groupPressAction$ = groupPress$.map(function (e) {
	        if (e.keyCode == 13) {
	            pMgroup.ret(e.target.value);
	            playerMonad.run([0, 0]);
	            socket.send('CO#$42,' + pMgroup.x + ',' + pMname.x + ',' + e.target.value);
	            game2();
	            console.log('In groupPressAction$ ', socket.readyState);
	            socket.send('CG#$42,' + pMgroup.x + ',' + pMname.x + ',' + 0 + ',' + 0);
	        }
	    });
	    var messagePress$ = sources.DOM.select('input.inputMessage').events('keydown');
	    var messagePressAction$ = messagePress$.map(function (e) {
	        if (e.keyCode == 13) {
	            socket.send("CD#$42," + pMgroup.x + "," + pMname.x + "," + e.target.value);
	            e.target.value = '';
	            console.log('In messagePressAction$ ', socket.readyState);
	        }
	    });
	    var task2 = function task2(str) {
	        console.log('In taskAction$. str is: ', str);
	        socket.send('TD#$42' + ',' + pMgroup.x + ',' + pMname.x + ',' + '@' + str);
	    };
	    var newTask$ = sources.DOM.select('input.newTask').events('keydown');
	    var newTaskAction$ = newTask$.map(function (e) {
	        var ob = {};
	        var alert = '';
	        var task = '';
	        if (e.keyCode == 13) {
	            var ar = e.target.value.split(',');
	            if (ar.length < 3) {
	                alert = 'You should enter "author, responsible party, task" separated by commas';
	                document.getElementById('alert').innerHTML = alert;
	            }
	            var ar2 = ar.slice(2);
	            console.log('*************  newTaskAction$  ************************$$$$$$$$$$$  ar ', ar);
	            if (ar2.length == 1) {
	                task = ar[2];
	            }
	            if (ar2.length > 1) {
	                task = ar2.reduce(function (a, b) {
	                    return a + '$*$*$' + b;
	                });
	            }
	            if (mMar2.x.filter(function (v) {
	                return v.task == task;
	            }).length > 0) {
	                document.getElementById('alert').innerHTML = task + " is already listed.";
	            } else if (ar.length > 2) {
	                mMcurrentList.bnd(addString, task + ',yellow, none, false,' + ar[0] + ',' + ar[1], mMcurrentList);
	                task2(mMcurrentList.x);
	                e.target.value = '';
	                document.getElementById('alert').innerHTML = '';
	            }
	        }
	    });
	    var process = function (str) {
	        var a = str.split(",");
	        if (a == undefined) {
	            return;
	        }
	        ;
	        if (a.length < 9) {
	            return;
	        }
	        ;
	        var ob = {};
	        var ar = a.slice(3);
	        var s = ar.reduce(function (a, b) {
	            return a + ',' + b;
	        });
	        console.log('2323232323232323232323232323232 In process. ar and s are: ', ar, s);
	        var tempArray = [];
	        if (ar.length < 6) {
	            return;
	        }
	        ;
	        if (ar.length % 6 !== 0) {
	            document.getElementById('alert').innerHTML = 'Error: array length is: ' + length;
	        }
	        mMcurrentList.ret(s);
	        process3(ar);
	    };
	    var process3 = function (a) {
	        console.log('77766677766677766677766676767676 In process3. a is ', a);
	        if (a.length > 0 && a.length % 6 == 0) {
	            var ar5 = [];
	            var keys = rang(0, a.length / 6);
	            keys.map(function (_) {
	                ar5.push({
	                    task: convertBack(a.shift()),
	                    color: a.shift(),
	                    textDecoration: a.shift(),
	                    checked: a.shift() === 'true',
	                    author: a.shift(),
	                    responsible: a.shift()
	                });
	            });
	            mMar2.ret(ar5);
	            process4(ar5);
	        } else {
	            document.getElementById('alert2').innerHTML = 'The length of the game array is either 0 or is not divisible by 6';
	        }
	    };
	    var process4 = function (a) {
	        var tempArray = [];
	        var keys = Object.keys(a);
	        for (var k in keys) {
	            tempArray.push(dom_1.h('div.todo', [dom_1.h('span.task3', { style: { color: a[k].color, textDecoration: a[k].textDecoration } }, 'Task: ' + a[k].task), dom_1.h('br'), dom_1.h('button#edit1', 'Edit'), dom_1.h('input#edit2', { props: { type: 'textarea', value: a[k].task }, style: { display: 'none' } }), dom_1.h('span#author.tao', 'Author: ' + a[k].author + ' / ' + 'Responsibility: ' + a[k].responsible), dom_1.h('br'), dom_1.h('input#cb', { props: { type: 'checkbox', checked: a[k].checked }, style: { color: a[k].color,
	                    textDecoration: a[k].textDecoration } }), dom_1.h('label.cbox', { props: { for: '#cb' } }, 'Completed'), dom_1.h('button.delete', 'Delete'), dom_1.h('br'), dom_1.h('hr')]));
	        }
	        mMtaskList.ret(tempArray);
	    };
	    var colorClick$ = sources.DOM.select('#cb').events('click');
	    var colorAction$ = colorClick$.map(function (e) {
	        var ind = getIndex(e);
	        var index = parseInt(ind, 10);
	        var s = mMcurrentList.x;
	        var ar = s.split(',');
	        var n = 6 * index + 3;
	        var j = 6 * index + 2;
	        var k = 6 * index + 1;
	        var checked = ar[n];
	        if (checked == 'true') {
	            ar[n] = 'false';
	            ar[k] = 'yellow';
	            ar[j] = 'none';
	        } else {
	            ar[n] = 'true';
	            ar[k] = 'lightGreen';
	            ar[j] = 'line-through';
	        }
	        task2(ar.reduce(function (a, b) {
	            return a + ',' + b;
	        }));
	    });
	    var edit1$ = sources.DOM.select('#edit1').events('click');
	    var edit1Action$ = edit1$.map(function (e) {
	        var index = getIndex2(e);
	        mMtaskList.x[index].children[3].elm.style.display = 'block';
	    });
	    var edit2$ = sources.DOM.select('#edit2').events('keypress');
	    var edit2Action$ = edit2$.map(function (e) {
	        var v = e.target.value;
	        var index = getIndex2(e);
	        if (e.keyCode == 13) {
	            process2(v, index);
	            mMtaskList.x[index].children[3].elm.style.display = 'none';
	        }
	    });
	    var process2 = function (str, index) {
	        var a = mMcurrentList.x.split(',');
	        a[6 * index] = str;
	        var b = a.reduce(function (a, b) {
	            return a + ',' + b;
	        });
	        task2(b);
	    };
	    var deleteClick$ = sources.DOM.select('.delete').events('click');
	    var deleteAction$ = deleteClick$.map(function (e) {
	        var index = parseInt(getIndex(e), 10);
	        var s = mMcurrentList.x;
	        var ar = s.split(',');
	        var str = '';
	        ar.splice(index * 6, 6);
	        if (ar.length > 0) {
	            task2(ar.reduce(function (a, b) {
	                return a + ',' + b;
	            }));
	        } else {
	            socket.send('TX#$42' + ',' + pMgroup.x + ',' + pMname.x);
	            mMtaskList.ret('');
	        }
	    });
	    var timeoutClicks$ = sources.DOM.select('#timeout').events('click');
	    var timeoutAction$ = timeoutClicks$.map(function () {
	        document.getElementById('timeout2').innerHTML = '';
	        document.getElementById('timeout3').innerHTML = '';
	        m.ret(3, 'm').bnd(timeout2, 1, m, [function () {
	            return m.bnd(cube, m).bnd(display, 'timeout2', 'm.x is ' + ' ' + m.x, m).bnd(timeout2, 2, m, [function () {
	                return m.bnd(add, 15, m).bnd(display, 'timeout2', 'm.x is ' + ' ' + m.x, m).bnd(display, 'timeout3', 'The meaning of everything was computed to be' + ' ' + m.x, m);
	            }]);
	        }]);
	    });
	    var chatClick$ = sources.DOM.select('#chat2').events('click');
	    var chatClickAction$ = chatClick$.map(function () {
	        var el = document.getElementById('chatDiv');
	        el.style.display == 'none' ? el.style.display = 'inline' : el.style.display = 'none';
	    });
	    var captionClick$ = sources.DOM.select('#caption').events('click');
	    var captionClickAction$ = captionClick$.map(function () {
	        var el = document.getElementById('captionDiv');
	        el.style.display == 'none' ? el.style.display = 'inline' : el.style.display = 'none';
	    });
	    // **************************************   GAME   *********************************************** GAME START
	    var gameClick$ = sources.DOM.select('#game').events('click');
	    var gameClickAction$ = gameClick$.map(function () {
	        var el = document.getElementById('gameDiv');
	        el.style.display == 'none' ? el.style.display = 'inline' : el.style.display = 'none';
	        var el2 = document.getElementById('gameDiv2');
	        el2.style.display == 'none' ? el2.style.display = 'inline' : el2.style.display = 'none';
	    });
	    var rollClick$ = sources.DOM.select('.roll').events('click');
	    var rollClickAction$ = rollClick$.map(function (e) {
	        socket.send('CA#$42,' + pMgroup.x + ',' + pMname.x + ',6,6,12,20');
	        mM3.ret([]);
	        playerMonad.run([pMscore.bnd(add, -1, pMscore).x, pMgoals.x]);
	        socket.send('CG#$42,' + pMgroup.x + ',' + pMname.x + ',' + pMscore.x + ',' + mMgoals.x);
	    });
	    var numClick$ = sources.DOM.select('.num').events('click');
	    var numClickAction$ = numClick$.map(function (e) {
	        if (mM3.x.length < 2) {
	            mM3.bnd(push, e.target.innerHTML, mM3).bnd(function (nums) {
	                return mM1.bnd(splice, e.target.id, 1, mM1).bnd(function (nums2) {
	                    return game([pMscore.x, pMgoals.x, nums2, nums].concat(nums2));
	                });
	            });
	        }
	        if (mM3.x.length === 2 && mM8.x !== 0) {
	            updateCalc();
	        }
	    }).startWith([0, 0, 0, 0]);
	    var opClick$ = sources.DOM.select('.op').events('click');
	    var opClickAction$ = opClick$.map(function (e) {
	        mM8.ret(e.target.textContent);
	        if (mM3.x.length === 2) {
	            updateCalc();
	        }
	    });
	    var forwardClick$ = sources.DOM.select('#forward').events('click');
	    var backClick$ = sources.DOM.select('#back').events('click');
	    var forwardAction$ = forwardClick$.map(function () {
	        if (mMindex.x < mMhistory.x.length - 1) {
	            mMindex.bnd(add, 1, mMindex).bnd(function (v) {
	                return trav(v);
	            });
	        }
	    });
	    var backAction$ = backClick$.map(function () {
	        if (mMindex.x > 0) {
	            mMindex.bnd(add, -1, mMindex).bnd(function (v) {
	                return trav(v);
	            });
	            socket.send('DE#$42,' + pMgroup.x + ',' + pMname.x + ', clicked the BACK button. ');
	        }
	    });
	    var game = function game(z) {
	        var x = z.slice();
	        mMindex.bnd(add, 1, mMindex).bnd(function (i) {
	            return mMhistory.bnd(spliceAdd, i, x, mMhistory);
	        });
	        document.getElementById('0').innerHTML = x[4];
	        document.getElementById('1').innerHTML = x[5];
	        document.getElementById('2').innerHTML = x[6];
	        document.getElementById('3').innerHTML = x[7];
	        game2();
	        cleanup('cow');
	    };
	    var game2 = function game2() {
	        document.getElementById('sb1').innerHTML = 'Name: ' + pMname.x;
	        document.getElementById('sb2').innerHTML = 'Group: ' + pMgroup.x;
	        document.getElementById('sb5').innerHTML = 'Currently online: Name | score | goals';
	        document.getElementById('sb6').innerHTML = mMscoreboard.x;
	        cleanup('fred');
	    };
	    var trav = function trav(index) {
	        document.getElementById('0').innerHTML = mMhistory.x[index][4];
	        document.getElementById('1').innerHTML = mMhistory.x[index][5];
	        document.getElementById('2').innerHTML = mMhistory.x[index][6];
	        document.getElementById('3').innerHTML = mMhistory.x[index][7];
	        var a = mMhistory.x[index];
	        mM1.ret(a[2]);
	        mM3.ret(a[3]);
	        socket.send('CG#$42,' + mMgroup.x + ',' + pMname.x + ',' + a[0] + ',' + a[1]);
	        mM8.ret(0);
	        cleanup('steve');
	    };
	    function changeS(ar, name) {
	        var x = ar.filter(function (v) {
	            return v.split("|")[0].trim() != pMname.x;
	        });
	        return x;
	    }
	    function updateCalc() {
	        mM3.bnd(function (x) {
	            return mM7.ret(calc(x[0], mM8.x, x[1])).bnd(function (result) {
	                mM1.bnd(push, result, mM1).bnd(function (nums) {
	                    return game([pMscore.x, pMgoals.x, nums, []].concat(nums));
	                });
	                if (result == 20) {
	                    score(pMscore.x * 1 + 1);
	                }
	                if (result == 18) {
	                    score(pMscore.x * 1 + 3);
	                }
	            });
	        });
	        reset();
	    }
	    ;
	    function cleanup(x) {
	        var target0 = document.getElementById('0');
	        var target1 = document.getElementById('1');
	        var target2 = document.getElementById('2');
	        var target3 = document.getElementById('3');
	        var targetAr = [target0, target1, target2, target3];
	        [0, 1, 2, 3].map(function (i) {
	            if (targetAr[i].innerHTML == 'undefined') {
	                targetAr[i].style.display = 'none';
	            } else {
	                targetAr[i].style.display = 'inline';
	            }
	        });
	        return ret(x);
	    }
	    ;
	    var score = function score(x) {
	        socket.send('CA#$42,' + pMgroup.x + ',' + pMname.x + ',6,6,12,20');
	        if (x !== 20) {
	            console.log('In score *******<><><><><><><><><><><>********4444444444444444 x and pMscore.x is ', x, pMscore.x);
	            pMscore.ret(x).bnd(addTest, pMscore).bnd(function (v) {
	                playerMonad.run([v, pMgoals.x]);
	                socket.send('CG#$42,' + pMgroup.x + ',' + pMname.x + ',' + v + ',' + mMgoals.x);
	            });
	        } else {
	            mMplayer.ret([]);
	            mM13.ret(0);
	            mMgoals.bnd(add, 1, mMgoals).bnd(function (v) {
	                if (v == 3) {
	                    socket.send('CE#$42,' + pMgroup.x + ',' + pMname.x + ',nothing ');
	                    mMgoals.ret(0).bnd(mMindex.ret);
	                    mMhistory.ret([0, 0, 0, 0]);
	                    playerMonad.run([0, 0]);
	                    socket.send('CG#$42,' + pMgroup.x + ',' + pMname.x + ',' + 0 + ',' + 0);
	                } else {
	                    var g = pMgoals.x * 1 + 1;
	                    playerMonad.run([0, g]);
	                    socket.send('CG#$42,' + pMgroup.x + ',' + pMname.x + ',' + 0 + ',' + g);
	                }
	                ;
	            });
	        }
	    };
	    var reset = function reset() {
	        mM3.ret([]).bnd(function () {
	            return mM4.ret(0).bnd(mM8.ret).bnd(cleanup);
	        });
	        mMgoals2.ret('');
	    };
	    var updateScoreboard = function updateScoreboard(v) {
	        mMscoreboard.push(dom_1.h('div', v));
	    };
	    //**************************************   GAME   *********************************************** GAME END
	    var todoClick$ = sources.DOM.select('#todoButton').events('click');
	    var todoClickAction$ = todoClick$.map(function (e) {
	        var el = document.getElementById('todoDiv');
	        el.style.display == 'none' ? el.style.display = 'inline' : el.style.display = 'none';
	    });
	    // ************************************************************************* Original Fibonacci enter
	    var fib2 = function fib2(v) {
	        if (v[2] > 1) {
	            mMfib.ret([v[1], v[0] + v[1], v[2] - 1]);
	        } else {
	            console.log(v[0]);
	            mM19.ret(v[0]);
	        }
	    };
	    var fibPress$ = sources.DOM.select('input#code').events('keydown');
	    var fibPressAction$ = fibPress$.map(function (e) {
	        if (e.target.value == '') {
	            return;
	        }
	        ;
	        if (e.keyCode == 13) {
	            mM21.ret(e.target.value);
	            fib2([0, 1, e.target.value]);
	        }
	    });
	    // ************************************************************************* ENDOM iginal Fibonacci END
	    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> START PRIME FIB  
	    var fibKeyPress5$ = sources.DOM.select('input#fib92').events('keydown');
	    var primeFib$ = fibKeyPress5$.map(function (e) {
	        if (e.keyCode == 13) {
	            var res = fibsMonad.run([0, 1, e.target.value, []]).bnd(function (fibsState) {
	                return fibsMonad.bnd(fpTransformer, primesMonad).bnd(function (primesState) {
	                    return tr3(fibsState[3], primesState[3]);
	                });
	            });
	            document.getElementById('PF_9').innerHTML = res[0];
	            document.getElementById('PF_22').innerHTML = res[1];
	            document.getElementById('primeFibs').innerHTML = res[2];
	        }
	    });
	    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ENDOM basic prime END
	    // <>>><>><><><><>>>><><><   prime factors   ><><><><><><>>><<><><><><><><>< START prime factors  
	    var factorsPress$ = sources.DOM.select('input#factors_1').events('keydown');
	    var factorsAction$ = factorsPress$.map(function (e) {
	        mMfactors.ret(e.target.value);
	        if (e.target.value == '') {
	            return;
	        }
	        ;
	        if (e.keyCode == 13 && parseInt(e.target.value, 10) != null) {
	            var message;
	            var factors = primesMonad.run([primesMonad.s[0], [], e.target.value, primesMonad.a]).bnd(prFactTransformer, factorsMonad).s[1];
	            if (e.target.value == factors.slice().pop()) {
	                message = e.target.value + ' is a prime number';
	            } else {
	                message = 'The prime factors of ' + e.target.value + ' are ' + factors;
	            }
	            document.getElementById('factors_3').innerHTML = message;
	        }
	    });
	    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ENDOM prime factors END
	    // ?<>>><>><><><><>>>><><><  traversal  ><><><><><><>>><><><><><><><><><><><>< START traversal  
	    window.onload = function (event) {
	        console.log('onopen event: ', event);
	        // document.querySelector('input#login').focus();
	        mMitterfib5.release(200);
	        // mM$prime5.ret([[2], 3, 3]);
	    };
	    // <>>><>><><><><>>>><><><  traversal  ><><><><><><>>><><><><><><><><><><><>< ENDOM traversal  
	    // <>>><>><><><><>>>><><><  traversal  ><><><><><><>>><><><><><><><><><><><>< START Itterator  
	    mMZ2.bnd(function (v) {
	        return cube(v, mMtemp5).bnd(function (w) {
	            return mMt3.ret(v + ' cubed is ' + w);
	        });
	    });
	    var testZ = sources.DOM.select('#testZ').events('click');
	    var testZAction$ = testZ.map(function () {
	        return mMZ1.release(1);
	    });
	    var testQ = sources.DOM.select('#testQ').events('click');
	    var testQAction$ = testQ.map(function () {
	        mMt1.ret(0).bnd(function (v) {
	            return mMZ2.release(v);
	        });
	    });
	    var testW = sources.DOM.select('#testW').events('keypress');
	    var testWAction$ = testW.map(function (e) {
	        if (e.keyCode == 13) {
	            mMZ2.release(e.target.value);
	        }
	    });
	    var solve = function solve() {
	        mMZ3.bnd(function (a) {
	            return mMtemp.ret(a).bnd(display, 'quad4', '').bnd(display, 'quad6', '').bnd(display, 'quad5', a + " * x * x ").bnd(function (a) {
	                return mMZ3 // Blocks here until new user input comes in.
	                .bnd(function (b) {
	                    return mMtemp.ret(b).bnd(display, 'quad6', b + ' * x ').bnd(function (b) {
	                        return mMZ3 // Blocks again.
	                        .bnd(function (c) {
	                            return mMtemp.ret([a, b, c]).bnd(fmap, qS4, "mMtemp").bnd(function (v) {
	                                var x = v[0];
	                                var y = v[1];
	                                console.log('Here is x and y: ', x, y);
	                                mMtemp.bnd(display, 'quad4', "Results: " + x + " and  " + y).bnd(display, 'quad5', dom_1.p(a).text + " * " + x + " * " + x + " + " + dom_1.p(b).text + " * " + x + " " + dom_1.p(c).text + " = 0").bnd(display, 'quad6', dom_1.p(a).text + " * " + y + " * " + y + " + " + dom_1.p(b).text + " * " + y + " " + dom_1.p(c).text + " = 0");
	                                solve();
	                            });
	                        });
	                    });
	                });
	            });
	        });
	    };
	    solve();
	    var quad$ = sources.DOM.select('#quad').events('keypress');
	    var quadAction$ = quad$.map(function (e) {
	        if (e.keyCode == 13) {
	            mMZ3.release(e.target.value);
	            document.getElementById('quad').value = null;
	        }
	    });
	    var dummyClick$ = sources.DOM.select('#dummy').events('click');
	    var dummyAction$ = dummyClick$.map(function (e) {
	        mMdummy.bnd(add, 1, mMdummy);
	        console.log('<><><><><><><><><> In dummyAction$ e is: ', e);
	        console.log(document.getElementById('dummy').click);
	        console.log('<><><><><><><><><>');
	        var next = mM23.x[mM23.x.length - 1] * 1 + mM23.x[mM23.x.length - 2] * 1;
	        mM23.bnd(push, next, mM23);
	        document.getElementById('dummy2').innerHTML = mM23.x;
	    });
	    var calcStream$ = most_1.merge(timeoutAction$, factorsAction$, forwardAction$, backAction$, dummyAction$, primeFib$, fibPressAction$, quadAction$, testWAction$, testZAction$, testQAction$, edit1Action$, edit2Action$, colorAction$, deleteAction$, newTaskAction$, chatClickAction$, gameClickAction$, todoClickAction$, captionClickAction$, groupPressAction$, rollClickAction$, messagePressAction$, loginPressAction$, messages$, numClickAction$, opClickAction$);
	    return {
	        DOM: calcStream$.map(function () {
	            return dom_1.h('div.content', [dom_1.h('div#rightPanel', { style: { display: 'none' } }, [dom_1.h('span#tog', [dom_1.h('button#game', { style: { fontSize: '16px' } }, 'TOGGLE GAME'), dom_1.h('span.tao', ' '), dom_1.h('button#todoButton', { style: { fontSize: '16px' } }, 'TOGGLE TODO_LIST'), dom_1.h('br'), dom_1.h('br'), dom_1.h('button#chat2', { style: { fontSize: '16px' } }, 'TOGGLE CHAT'), dom_1.h('span.tao', ' '), dom_1.h('button#caption', { style: { fontSize: '16px' } }, 'TOGGLE CAPTION')]), dom_1.h('br'), dom_1.h('br'), dom_1.h('br'), dom_1.h('br'), dom_1.h('div#gameDiv', [dom_1.h('span#sb1'), dom_1.h('br'), dom_1.h('span#sb2'), dom_1.h('br'), dom_1.h('span#sb5'), dom_1.h('br'), dom_1.h('span#sb6')]), dom_1.h('br'), dom_1.h('br'), dom_1.h('br'), dom_1.h('div#todoDiv', [dom_1.h('div#taskList', mMtaskList.x), dom_1.h('span', 'Author, Responsible Person, Task: '), dom_1.h('input.newTask')]), dom_1.h('br'), dom_1.h('span#alert'), dom_1.h('br'), dom_1.h('span#alert2'), dom_1.h('br'), dom_1.h('br'), dom_1.h('div#chatDiv', [dom_1.h('div#messages', [dom_1.h('span', 'Message: '), dom_1.h('input.inputMessage'), dom_1.h('div', mMmsg.x)])])]), dom_1.h('div#leftPanel', [dom_1.h('br'), dom_1.h('a.tao', { props: { href: '#common' } }, 'Common Patterns'), dom_1.h('a.tao', { props: { href: '#async' } }, 'Asyc'), dom_1.h('a.tao', { props: { href: '#monaditter' } }, 'MonadItter'), dom_1.h('a.tao', { props: { href: '#monadset' } }, 'Set Monad '), dom_1.h('a.tao', { props: { href: '#monadstate' } }, 'State Monad'),
	            // h('a.tao', {props: {href: '#monads'}}, 'Why Call Them Monads'   ),  
	            dom_1.h('div#captionDiv', [dom_1.h('h1', 'Motorcycle.js With JS-monads'), dom_1.h('span.tao1', ' A shared, persistent todo list, '), dom_1.h('br'), dom_1.h('span.tao1', ' A websockets simulated dice game with a traversable history, '), dom_1.h('br'), dom_1.h('span.tao1', ' Group chat rooms and more demonstrations of efficient, '), dom_1.h('br'), dom_1.h('span.tao2', ' maintainable code using Motorcycle.js and JS-monads.  ')]), dom_1.h('br'), dom_1.h('span.tao', 'This is a '), dom_1.h('a', { props: { href: "https://github.com/motorcyclejs", target: "_blank" } }, 'Motorcycle.js'), dom_1.h('span', ' application. Motorcycle.js is '), dom_1.h('a', { props: { href: "https://github.com/cyclejs/core", target: "_blank" } }, 'Cycle.js'), dom_1.h('span', ' using '), dom_1.h('a', { props: { href: "https://github.com/cujojs/most", target: "_blank" } }, 'Most'), dom_1.h('span', ' , '), dom_1.h('span', ' and '), dom_1.h('a', { props: { href: "https://github.com/paldepind/snabbdom", target: "_blank" } }, 'Snabbdom'), dom_1.h('span', ' instead of RxJS and virtual-dom.  The code for this repository is at '), dom_1.h('a', { props: { href: "https://github.com/dschalk/JS-monads-stable", target: "_blank" } }, 'JS-monads-stable'), dom_1.h('div#gameDiv2', { style: { display: 'none' } }, [dom_1.h('br'), dom_1.h('p.red8', mMgoals2.x), dom_1.h('span', ' Here are the basic rules:'), dom_1.h('p', 'RULES: If clicking two numbers and an operator (in any order) results in 20 or 18, the score increases by 1 or 3, respectively. If the score becomes 0 or is evenly divisible by 5, 5 points are added. A score of 25 results in one goal. That can only be achieved by arriving at a score of 20, which jumps the score to 25. Directly computing 25 results in a score of 30, and no goal. Each time RL is clicked, one point is deducted. Three goals wins the game. '), dom_1.h('button#0.num'), dom_1.h('button#1.num'), dom_1.h('button#2.num'), dom_1.h('button#3.num'), dom_1.h('br'), dom_1.h('button#4.op', 'add'), dom_1.h('button#5.op', 'subtract'), dom_1.h('button#5.op', 'mult'), dom_1.h('button#5.op', 'div'), dom_1.h('button#5.op', 'concat'), dom_1.h('br'), dom_1.h('div#dice', { style: { display: 'none' } }, [dom_1.h('button.roll', 'ROLL'), dom_1.h('br'), dom_1.h('button#back', 'BACK'), dom_1.h('button#forward', 'FORWARD')])]), dom_1.h('div#log1', [dom_1.h('p', 'IN ORDER TO SEE THE GAME, TODOLIST, AND CHAT DEMONSTRATIONS, YOU MUST ENTER SOMETHING .'), dom_1.h('span', 'Name: '), dom_1.h('input#login', { props: { placeholder: "focus on; start typing" } })]), dom_1.h('p', mM6.x), dom_1.h('div#log2', { style: { display: 'none' } }, [dom_1.h('span', 'Change group: '), dom_1.h('input#group')]), dom_1.h('p', mMsoloAlert.x), dom_1.h('p', 'People who are in the same group, other than solo, share the same todo list, messages, and simulated dice game. In order to see any of these, you must establish an identity on the server by logging in. The websockets connection terminates if the first message the server receives does not come from the sign in form. You can enter any random numbers or letters you like. The only check is to make sure someone hasn\t already signed in with whatever you have selected. If you log in with a name that is already in use, a message will appear and this page will be re-loaded in the browser after a four-second pause. '), dom_1.h('p', ' Data for the traversable game history accumulates until a player scores. The data array is then re-set to [], the empty array. When a player clicks the BACK button, other group members are notified. It is up to the group to decide whether clicking the BACK button disqualifies a player. '), dom_1.h('hr'), dom_1.h('h1', 'The Monads'), dom_1.h('h3', ' Monad '), code_js_1["default"].monad, dom_1.h('p', ' Monad instances are useful for chaining computations. Typically, the bnd() method provides its value to a computation that returns an instance of Monad. Here are some examples: '), code_js_1["default"].e1, dom_1.h('p', ' These functions can be used with instances of Monad in many ways, for example: '), code_js_1["default"].e2, dom_1.h('p', ' Each of the functions shown above can be used as a stand-alone function or as an argument to the bnd() method. Each monad in a chain of linked computations can do one of two things with the previous monad\s value: (1) It can ignore it, possibly letting it move past for use further down the chain or (2) use it, with the option of passing it on down the chain. Any computation can be inserted into the chain by giving it an additional first argument (which will be the previous monad\'s value), and having it return an instance of Monad. Say you have a function func(a,b,c) {...}. Put something ahead of a (it will have the previous monad\'s value) and return a monad. You can give the returned monad any value you like. For example, func\'(x,a,b,c) {...; return ret(x)} will work. Its bnd() method will pass along the value x, which is the previous monad\s value. '), dom_1.h('h3', ' The Monad Laws '), dom_1.h('p', ' In the following discussion, "x == y" signifies that x == y returns true. Let M be the collection of all instances of Monad, let J be the collection of all Javascript values, including functions, instances of Monad, etc, and let F be the collection of all functions mapping values in J to monads in M where the return values are the calling instance of Monad. For any m (with id == "m"), v, f, and f\' in M, J, F, and F, respectively, the following relationships hold: '), dom_1.h('pre.lb', "    equals( m.ret(v).bnd(f), f(v) ) Left identity   Holds provided that f returns m.\n    Example: equals( m.ret(5).bnd(cube, m).x, cube(5, m) )   \n    Haskell monad law: (return x) >>= f \u2261 f x  \n    \n    m.bnd(m.ret) == m   Right identity   Works even with \"==\" and \"===\"\n    Haskell monad law: m >>= return \u2261 m  \n    \n    equals( m.bnd(f).bnd(f'), m.bnd(v => f(v).bnd(f')) )  Associativity\n    Haskell monad law: (m >>= f) >>= g \u2261 m >>= ( \\x -> (f x >>= g) ) "), dom_1.h('p', ' where equals is defined as: '), code_js_1["default"].equals, dom_1.h('p', ' The function equals() was used because the == and === operators on objects check for location in memory, not equality of attributes and methods. If the left and right sides of predicates create new instances of m, then the left side m and the right side m wind up in different location in memory. That\'s why m.ret(3) == m.ret(3) returns false. If we define equality to mean equality of attributes, then ret is the left and right identity on objects in M and  the objects in M commute when their bind methods operate on functions in F. '), dom_1.h('h3', ' The JS-monads-mutableInstances Branch  '), dom_1.h('p', ' In the JS-monads-mutableInstances branch of this project, examples of the laws hold when the == operator is used. For example: '), dom_1.h('pre', "    m.bnd(add, 3, m).bnd(cube, m) == m.bnd(v => add(v, 3, m).bnd(cube, m)\n    m.ret(5).bnd(cube, m) == cube(5, m)   "), dom_1.h('p', ' Tests in the JS-monads-mutableInstance produce results closer to what we would expect in mathematics. For example: '), dom_1.h('pre', "    m.ret(7) == m.ret(7)  Returns true in JS-monads-mutableIntances.  "), dom_1.h('h3', ' Back to the master branch '), dom_1.h('h3', ' fmap '), dom_1.h('p', ' I showed you (abpve) some functions designed for instances of Monad, but it is easy to lift functions that return ordinary Javascript values into chains of monadic computations. One way of doing this is to use fmap(), as shown below in finding solutions to the quadratic equation.  '), dom_1.h('h3', ' Monad Arithmetic with opM '), code_js_1["default"].opM, dom_1.h('p', ' Since the Monad instance ok had already been created, the second result could have been obtained by running: '), dom_1.h('pre', "    ok.ret(m1.x + m2.x)   "), dom_1.h('p', ' Just adding the suffix ".x" to an instance of Monad exposes its value. Doing that and running ret() on the return value is all that is needed for performing computations with ordinary functions and wrapping the results in instances of Monad. fmap is non-essential syntactic sugar. This is very different from Haskell, where fmap is an essential component of monadic computation. '), dom_1.h('h3', ' Are They Category Theory Monads?  '), dom_1.h('p#monaditter', ' Just as Javascript if very different from Haskell, so too are the JS-monads very different from Haskell monads. For example, the JS-monads carry bnd() and ret() internally whereas Haskell uses >>= and return. I think the essential takeaways from the above demonstration of similarities are not so much that JS-monads are like Haskell monads, but that (1) the Monad ret() method is the left and right identity on instances of Monad, and (2) instances of Monad compose associatively. Does that mean that members of M (defined above) are monoids in the category of endofunctors, just like Haskell monads? Well, it does sort of feel that way, but it hasn\'t been proven.   '),
	            // **************************************************************************** END MONAD       START MonadItter   
	            dom_1.h('h2', 'MonadItter'), code_js_1["default"].monadIt, dom_1.h('p', ' MonadItter instances do not have monadic properties, but they facilitate the work of monads. Here\'s how they work: '), dom_1.h('p', 'For any instance of MonadItter, say "it", "it.bnd(func)" causes it.p == func. Calling the method "it.release(...args)" causes p(...args) to run, possibly with arguments supplied by the caller. Here is the definition: '), dom_1.h('p', ' As shown later on this page, MonadItter instances control the routing of incoming websockets messages and the flow of action in the simulated dice game. In one of the demonstrations below, they behave much like ES2015 iterators. I prefer them over ES2015 iterators. They also provide promises-like functionality'), dom_1.h('h3', ' A Basic Itterator '), dom_1.h('p', 'The following example illustrates the use of release() with an argument. It also shows a lambda expressions being provided as an argument for the method mMZ1.bnd() (thereby becoming the value of mMZ1.p) and then mMZ1.release providing an arguments for the function mMZ1.p. The code is shown beneith the following two buttons. '), dom_1.h('button#testZ', 'mMZ1.release(1)'), dom_1.h('p.code2', mMt3.x), dom_1.h('span', 'Refresh button: '), dom_1.h('button#testQ', 'mMt1.ret(0).bnd(v => mMZ2.release(v)) '), dom_1.h('br'), code_js_1["default"].testZ, dom_1.h('span.tao', ' mMt3.x sits permanently in the Motorcycle virtual DOM description. You can call '), dom_1.h('span.green', 'mMZ2.release(v)'), dom_1.h('span', ' by entering a value for v below: '), dom_1.h('br'), dom_1.h('span', 'Please enter an integer here: '), dom_1.h('input#testW'), dom_1.h('p', ' cube() is defined in the Monad section (above). If you click "mMZ1.release(1)" several times, the code (above) will run several times, each time with v == 1. The result, mMt3.x, is shown below the button. mMZ1.p (bnd()\'s argument) remains constant while mMZ1.release(1) is repeatedly called, incrementing the number being cubed each time. '), dom_1.h('p', ' Here is another example. It demonstrates lambda expressions passing values to a remote location for use in a computation. If you enter three numbers consecutively below, call them a, b, and c, then the quadratic equation will be used to find solutions for a*x**2 + b*x + c = 0. The a, b, and c you select might not have a solution. If a and b are positive numbers, you are likely to see solutions if c is a negative number. For example, 12, 12, and -24 yields the solutions 1 and -2. '), dom_1.h('p#quad4.red2'), dom_1.h('p#quad5.red2'), dom_1.h('p#quad6.red2'), dom_1.h('p', 'Run mMZ3.release(v) three times for three numbers. The numbers are a, b, and c in ax*x + b*x + c = 0: '), dom_1.h('input#quad'), dom_1.h('p', 'Here is the code:'), code_js_1["default"].quad, dom_1.h('p', ' fmap (above) facilitated using qS4 in a monadic sequence. qS4 returns an array, not an instance of Monad, but fmap lifts qS4 into the monadic sequence. '), dom_1.h('span'), dom_1.h('p#monadstate'),
	            // ***************************************************************************************************** START MonadState
	            dom_1.h('h2', 'MonadState and MonadState Transformers'), dom_1.h('p', ' An instance of MonadState holds the current state and value of a computation. For any instance of MonadState, say m, these can be accessed through m.s and m.a, respectively.  '), code_js_1["default"].MonadState, dom_1.h('p', ' MonadState reproduces some of the functionality found in the Haskell Module "Control.Monad.State.Lazy", inspired by the paper "Functional Programming with erloading and Higher-der Polymorphism", Mark P Jones (http://web.cecs.pdx.edu/~mpj/) Advanced School of Functional Programming, 1995. The following demonstrations use the MonadState instances fibsMonad and primesMonad to create and store arrays of Fibonacci numbers and arrays of prime numbers, respectively. fibsMonad and primesMonad provide a simple way to compute lists of prime Fibonacci numbers.  Because the results of computations are stored in the a and s attributes of MonadState instances, it was easy to make sure that no prime number had to be computed more than once in the prime Fibonacci demonstration. '), dom_1.h('p', ' Here is the definition of fibsMonad, along with the definition of the function that becomes fibsMonad.process. '), code_js_1["default"].fibsMonad, dom_1.h('p', ' The other MonadState instance used in this demonstration is primesMonad. Here is its definition along with the function that becomes primesMonad.process:  '), code_js_1["default"].primesMonad, dom_1.h('h3', ' MonadState transformers '), dom_1.h('p', ' Transformers take instances of MonadState and return different instances of MonadState, possibly in a modified state. The method call "fibsMonad.bnd(fpTransformer, primesMonad)" returns primesMonad. Here is the definition of fpTransformer: '), code_js_1["default"].fpTransformer, dom_1.h('p', ' If the largest number in primesMonad.a is less than the square root of the largest number in fibsMonad.a, primesMonad is updated so that the largest number in primesMonad.a is greater than the square root of the largest number in fibsMonad.a. herwise, primesMonad is returned unchanged.  '), dom_1.h('p', ' The final computation in the prime Fibonacci numbers demonstration occurs when "tr3(fibsState[3],primesState[3]" is called. tr3() takes an array of Fibonacci numbers and an array of prime numbers and returns an array containing an array of Fibonacci numbers, an array of prime numbers, and an array of prime Fibonacci numbers. Here is the definition of tr3: '), code_js_1["default"].tr3, dom_1.h('p', ' User input is handled by a chain of computations.  first to update fibsMonad, second to extract fibsMonad.s, third to run fpTransformer to modify and then return primesMonad, and fourth to extract primesMonad.s and run tr3(fibsState[3],primesState[3]). Here is the code: '), code_js_1["default"].primeFibInterface, dom_1.h('p', 'ly 48 Fibonacci numbers need to be generated in order to get the eleventh prime Fibonacci number. But 5546 prime numbers need to be generated to test for divisibility into 2971215073. Finding the next Fibonacci number is just a matter of adding the previous two. Getting the next prime number is a more elaborate and time-consuming procedure. In this context, the time needed to compute 48 Fibonacci numbers is insignificant, so I didn\'t bother to save previously computed Fibonacci numbers in the prime Fibonacci demonstration. When a user enters a number smaller than the current length of fibsMonad.a, fibsMonad is modified such that its length becomes exactly what the user entered.'), dom_1.h('p', ' Entering 50 in my desktop Ubuntu Chrome and Firefox browsers got the first eleven prime Fibonacci numbers in about one second. I tried gradually incrementing upwards from 50, but when I got to 61 I stopped due to impatience with the lag time. The 61st Fibonacci number was computed to be 1,548,008,755,920. 76,940 prime numbers were needed to check the 60th Fibonacci number. 96,043 prime numbers were needed to check the 61st Fibonacci number.  At Fibonacci number 61, no new prime Fibonacci numbers had appeared.'), dom_1.h('p', ' According to multiple sources, these are the first eleven proven prime Fibonacci numbers:'), dom_1.h('span.lb', ' 2, 3, 5, 13, 89, 233, 1597, 28657, 514229, 433494437, and 2971215073 '), dom_1.h('br'), dom_1.h('p', ' The number you enter below is the length of the list of Fibonacci numbers you want to generate.  '), dom_1.h('p'), dom_1.h('input#fib92'), dom_1.h('br'), dom_1.h('span#PF_7.red6', 'Fibonacci Numbers'), dom_1.h('br'), dom_1.h('span#PF_9.red7'), dom_1.h('br'), dom_1.h('span#PF_21.red6', 'Prime Numbers'), dom_1.h('br'), dom_1.h('span#PF_22.red7'), dom_1.h('br'), dom_1.h('span#PF_8.red6', 'Prime Fibonacci Numbers'), dom_1.h('br'), dom_1.h('span#primeFibs.red7'), dom_1.h('p', ' The next demonstration uses two instances of MonadState to find the prime factors of numbers. Each prime factor is listed once.  my desktop computer, it took several seconds to verify that 514229 is a prime number. After that, due to persistent (until the web page closes) memoization, numbers below 514229 or not too far above it evaluated rapidly. Here\'s where you can enter a number to see its prime factors: '), dom_1.h('input#factors_1'), dom_1.h('br'), dom_1.h('span#factors_2.red6'), dom_1.h('br'), dom_1.h('span#factors_3.red7'), dom_1.h('br'), dom_1.h('p', ' The demonstration uses primesMonad and factorsMonad. Here are the definitions of factosMonad and factor_state, the function that is factorsMonad.process: '), code_js_1["default"].factorsMonad, dom_1.h('p#async', ' And this is how user input is handled: '), code_js_1["default"].factorsInput,
	            //************************************************************************** ENDOM MonadState
	            //************************************************************************** BEGIN Promises
	            dom_1.h('h2', ' Asynchronous Composition: Promises, MonadItter, or Neither '), dom_1.h('p', ' Using the ES2015 Promises API inside of monads is easy. For example, consider the function "promise", defined as follows: '), code_js_1["default"].promise, dom_1.h('p', ' Running the following code causes m.x == 42 after two seconds. '), code_js_1["default"].promiseSnippet, dom_1.h('p', ' After a two-second delay, the Promise returns an anonymous monad with a value of 27 (anonymous.x == 27). The then statement passes 27 to m and adds 15 to it, resulting in m.x == 42. This pattern can be used to define less trivial functions that handle database calls, functions that don\'t return immediately, etc. And, of course, ES2015 Promises API error handling can be added. '), dom_1.h('p', ' The same result can be achieved with MonadItter and the following function '), code_js_1["default"].timeout, dom_1.h('p', ' If you click RUN, "m.x is 27" appears after one second. Two seconds later, "m.x is 42" is displayed along with a blurb. The blurb confirms the chain can continue, without the encumbrance and limitations of "then" clauses, after the delayed computations complete. '), code_js_1["default"].timeoutSnippet, dom_1.h('p', ' '), dom_1.h('button#timeout', ' Run '), dom_1.h('span#timeout2'), dom_1.h('span#timeout3'), dom_1.h('p', ' The final blurb confirms that the chained code waits for completion of the asynchronous code. Similar code could be made to wait for database calls, Ajax requests, or long-running processes to return before running subsequent chained code. In fact, messages$, the stream that handles incoming websockets messages, does just that. When a message is sent to the server, messages$ listens for the response. The functions waiting in MonadItter bnd() expressions are released according to the prefix of the incoming message from the server. Essentially, messages$ contains callbacks. MonadItter provides an uncluttered alternative to "if - then" or "case" blocks of code, separating the code to be executed from the listening code.'), dom_1.h('p', ' I could have provided for error handling but therehere doesn\'t seem to be any need for it. If I were getting information from a remote database or Ajax server, I would handle errors with "window.addEventListener("error", function (e) { ...".'), dom_1.h('a', { props: { href: '#top' } }, 'Back To The Top'),
	            //************************************************************************** ENDOM Promises
	            dom_1.h('h2', 'Immutable Data And The State Object " '), dom_1.h('h3', ' Mutations   '), dom_1.h('p', ' Mutations in this application are confined to MonadItter instances and internal function operations. Functions in this application do not have side effects. If a function argument is an array, say "ar", I make a clone by calling "var ar = ar.slice()" or "let ar2 = ar.slice()" before mutating ar or ar2 inside the function. That way, the original ar remains unaffected. MonadItter instances don\'t have monadic properties. When their bnd() method is called, they sit idly until their release() method is called. I don\t see any reason to make a clone each time bnd() or release() is called. As demonstrated below, a MonadItter instance can hold several different expressions simultaneously, executing them one at a time in the order in which they appear in the code, once each time the release() method is called, In the quadratic equation demonstration, the second call to release() takes the result from the first call  '), dom_1.h('h3', ' The simulated dice game '), dom_1.h('p', ' A score increases by 1 or 3 if the result of a computation is 20 or 18, respectively. 5 additional points are added each time the result is a multiple of 5. A computation that results in a score of 25 earns 1 goal. So if a score is 17 and a player multiplies 3 * 6, 3 points are awarded resulting in 20 + 5 = 25 points. Goal! When a goal is earned, the traversable history is deleted and prepared for a fresh start. Here is the code involved in the simulated dice game: '), code_js_1["default"].updateCalc, dom_1.h('p', ' The history of the number display and scoreboard in the game can be traversed in either direction until a player scores a goal. After that, the traversable history is deleted and then builds up until another goal is achieves. Players can score points using historical displays, so to keep competition fair, group members are notified when another member clicks the BACK button. The code is shown below, in the MonadSet section; but first, here is some background. '), dom_1.h('h3', ' playerMonad '), dom_1.h('p', ' playerMonad and its process attribute are defined as follows: '), code_js_1["default"].playerMonad, dom_1.h('p#monadset', ' As you see, playerMonad.run does one simple thing; it updates the four monads in the player_state function. There are various ways of achieving the same result, but MonadState provides a convenient alternative. Next, I will show how the list of currently online group members is maintained through the use of an instance of MonadSet. '), dom_1.h('h2', ' MonadSet '), dom_1.h('p', ' The list of online group members at the bottom of the scoreboard is very responsive to change. When someone joins the group, a message prefixed by NN#$42 prompts the server to send out the current list of group members. When someone closes their browser window, the server is programmed to send out the new list of group members. All updating is done in the websockets messages function. MonadSet\'s add and delete methods provide convenient alternatives to using Monad\'s bnd method with the push and splice functions. Here are the definitions of MonadSet and the MonadSet instance sMplayers '), code_js_1["default"].MonadSet, dom_1.h('p', ' Because sMplayerss is immutable, its most recent state can be safely stored in the mMsetArchive instance of Monad. This is done so the traversable game history shows who was online in each step. Here is the code that keeps the browser window current and, at the same time, maintains a history of the sate of game play. '), code_js_1["default"].traverse, dom_1.h('p', ' You must log in and enter something in the "Change group" box in order to see currently online members. You can open this page in more windows and see how promptly additions and exits show up in the scoreboard. '), dom_1.h('a', { props: { href: '#top' } }, 'Back To The Top'), dom_1.h('h2', 'Updating the DOM'), dom_1.h('p', ' Two general methods work in Motorcycle. Sometimes I keep m.x in the virtual DOM code for some monad m. If a user performs some action that cause m.x to have a new value, the actual DOM changes accordingly. her times I use document.getElementById("someId").innerHTML = newValue.'), dom_1.h('br'), dom_1.h('h3', 'Dice Game DOM updates'), dom_1.h('p', ' mMcurrentRoll.ret() is called only when (1) a new dice roll comes in from the server, (2) when a player clicks a number, and (3) when clicking a number or operator results in a computation being performed. These are the three things that require a DOM update. When a player clicks a number, it disappears from number display. When a computation is performed, the result is added to the number display, unless the result is 18 or 20. A result of 18 or 20 results in a new roll coming in from the server '), dom_1.h('p', ' I like the way Cycle.js and Motorcycle.js are unopinionated. DOM updates can be accomplished by permanently placing a mutating list of strings in the virtual DOM description, or by calling element.innerHTML = newValue. Either way, the actual DOM gets mutated immediately, and mutating the DOM is what interactive applications are all about. Well, unless you load fresh pages every time something changes. I guess some people are still doing that.  '), dom_1.h('hr'), dom_1.h('h2', 'Concise Code Blocks For Information Control'), dom_1.h('p', ' Incoming websockets messages trigger updates to the game display, the chat display, and the todo list display. The members of a group see what other members are doing; and in the case of the todo list, they see the current list when they sign in to the group. When any member of a group adds a task, crosses it out as completed, edits its description, or removes it, the server updates the persistent file and all members of the group immediately see the revised list.  '), dom_1.h('p', 'The code below shows how incoming websockets messages are routed. For example, mMZ10.release() is called when a new dice roll (prefixed by CA#$42) comes in.   '), code_js_1["default"].messages, dom_1.h('p', ' The "mMZ" prefix designates instances of MonadItter. The bnd() method assigns its argument to the "p" attribute. "p" runs if and when the release() method is called. The next() function releases a specified MonadItter instance when the calling monad\'s value matches the specified value. next2() releases the specified monad when the specified condition returns true. The release method in next() has no argument, but next does take arguments, as illustrated below.'), dom_1.h('span.tao', ' The incoming messages block is just a syntactic variation of a switch block, but that isn\'t all that MonadItter instances can do. They can provide fine-grained control over the lazy evaluation of blocks of code. Calling release() after a function completes some task provides Promise-like behavior. Error handling is optional. The MonadItter release(...args) method facilitates sequential evaluation of code blocks, reminiscent of video and blog explanations of ES6 iterators and generators. I prefer doing it with MonadItter over "yield" and "next". For one thing, ES6 generator "yield" blocks must be evaluated in a predetermined order. This link takes you back to the MonadItter section with interactive examples of the use of release() with arguments.  '), dom_1.h('a#tdList2', { props: { href: '#iterLink' } }, 'release() with arguments'), dom_1.h('br'), dom_1.h('br'), dom_1.h('a', { props: { href: '#top' } }, 'Back To The Top'), dom_1.h('br'), dom_1.h('h3', 'The Todo List'), dom_1.h('p', ' Next, I\'ll go over some features of the todo list application. This will show how Motorcycle.js and the monads work together.'), dom_1.h('p', 'Creation  A Task: If you enter something like Susan, Fred, Pay the water bill, the editable task will appear in your browser and in the browsers of any members a group you might have created or joined. If you have loaded this page in another tab and changed to the same group in both, you will see the task in both tabs, barring some malfunction. The task has a delete button, an edit button, and a "Completed" checkbox. It shows that Susan authorized the task and Fred is responsible for making sure it gets done. Instead of entering an authority and responsible person, you can just enter two commas before the task description. Without two commas, a message appears requesting more information. '), code_js_1["default"].newTask, dom_1.h('p', 'mM$taskList caries a string representing the task list. mMtaskList.x.split(",") produces an array whose length is a multiple of six. Commas in the task description are replaced by "$*$*$" so split(",") will put the entire task description in a single element. Commas are re-inserted when the list arrives from the server for rendering. Although a task list is a nested virtual DOM object (Snabbdom vnode), it can be conveniently passed back and forth to the server as a string without resorting to JS.stringify. Its type is Text on the server and String in the front end, becoming a virtual DOM node only once, when it arrives from the server prefixed by "DD#$42" causing "process(e.data) to execute. Here is process(): '), code_js_1["default"].process, dom_1.h('span.tao', 'As you see, the string becomes a list of six-element objects, then those objects are used to create a Snabbdom vnode which is handed to mM$taskList.ret() leading to the update of mMtaskList. mMtaskList.x sits permanently in the main virtual DOM description. '), dom_1.h('a', { props: { href: "https://github.com/dschalk/JS-monads-stable" } }, 'https://github.com/dschalk/JS-monads-stable'), dom_1.h('br'), dom_1.h('p', ' Clicking "Completed": When the "Completed" button is clicked, the following code runs:         '), code_js_1["default"].colorClick, dom_1.h('p', 'mMtaskList is split into an array. Every sixth element is the start of a new task. colorAction$ toggles the second, third, and fourth element in the task pinpointed by "index" * 6. getIndex finds the index of the first and only the element whose task description matches the one that is being marked "Completed". I say "only" because users are prevented from adding duplicate tasks. After the changes are made, the array of strings is reduced to one string and sent to the server by task2(). '), dom_1.h('p', ' This is the code involved in editing a task description: '), code_js_1["default"].edit, dom_1.h('p', 'Clicking "Edit" causes a text box to be displayed. Pressing <ENTER> causes it to disappear. edit2Action$ obtains the edited description of the task and the index of the task item and provides them as arguments to process. Process exchanges $*$*$ for any commas in the edited version and assigns the amended task description to the variable "task". mMtaskList.x is copied and split into an array. "index * 6" is replaced with "task" and the list of strings is reduced back to a single string and sent to the server for distribution. This pattern, - (1) split the string representation of the todo list into an array of strings, (2) do something, (3) reduce the list of strings back to a single string - is repeated when the "Delete" button is clicked. If the last item gets deleted, the server is instructed to delete the persistent file bearing the name of the group whose member deleted the last task. '), dom_1.h('p#common', 'Cycle.js has been criticized for not keeping state in a single location, the way React.js does. Motorcycle.js didn\'t do it for me, or try to force me to do it, but it so happens that the current state of all active monads is in the object ". I have written applications in Node.js and React.js, and I can say without a doubt that Motorcycle.js provides the best reactive interface for my purposes.  '), dom_1.h('hr'), dom_1.h('a', { props: { href: '#top' } }, 'Back To The Top'), dom_1.h('h2', 'Common Patterns'), dom_1.h('p', 'Anyone not yet familiar with functional programming can learn by studying the definition of the Monad bnd() method and considering the common patterns presented below. ten, we want to give a named monad the value of an anonymous monad returned by a monadic computation. Here are some ways to accomplish that: '), dom_1.h('p', 'For any monads m1 and m2 with values a and b respectively (in other words, m1.x == a and m2.x == b return true), m1.bnd(m2.ret) provides m1\'s value to m2.ret() causing m2 to have m1\'s value. So, after m1.bnd(m2.ret), m1.x == a, m2.x == b, m2.x == a all return true. The definition of Monad\s bnd() method shows that the function m2.ret() operates on m1.x. m1.bnd(m2.ret) is equivalent to m2.ret(m1.x). The stand-alone ret() function can be used to alter the current value of m2, rather than altering the value of m2. Here is one way of accomplishing this: m1.bnd(x => ret(x,"m2")). These relationships are demonstrated in the following tests: '), code_js_1["default"].examples, dom_1.h('p'), dom_1.h('p', ' Here are two basic ways to create a monad named "m" with id = "m" and value v: '), code_js_1["default"].examples2, dom_1.h('a', { props: { href: '#top' } }, 'Back To The Top'), dom_1.h('hr'), dom_1.h('hr'), dom_1.h('a', { props: { href: '#top' } }, 'Back To The Top'), dom_1.h('p'), dom_1.h('br'), dom_1.h('br'), dom_1.h('br'), dom_1.h('br'), dom_1.h('br'), dom_1.h('br'), dom_1.h('br'), dom_1.h('br'), dom_1.h('span#dummy2.red3'), dom_1.h('hr'), dom_1.h('button#dummy', mMdummy.x), dom_1.h('p'), dom_1.h('p'), dom_1.h('p', '.'), dom_1.h('p', '.'), dom_1.h('p', '.'), dom_1.h('p', '.'), dom_1.h('p', '.'), dom_1.h('p'), dom_1.h('p'), dom_1.h('p'), dom_1.h('p'), dom_1.h('p')])]);
	        }) };
	}
	var displayf = function displayf(x, a) {
	    document.getElementById(a).style.display = 'none';
	    return ret(x);
	};
	var displayInline = function displayInline(x, a) {
	    if (document.getElementById(a)) document.getElementById(a).style.display = 'inline';
	    return ret(x);
	};
	var newRoll = function (v) {
	    socket.send('CA#$42,' + pMgroup.x + ',' + pMname.x + ',6,6,12,20');
	    return ret(v);
	};
	var refresh = function () {
	    setTimeout(function () {
	        document.location.reload(false);
	    }, 4000);
	};
	var sources = {
	    DOM: dom_1.makeDOMDriver('#main-container'),
	    WS: websocketsDriver
	};
	core_1["default"].run(main, sources);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(17)))

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	(function (global, factory) {
	   true ? factory(exports, __webpack_require__(4)) : typeof define === 'function' && define.amd ? define(['exports', 'most'], factory) : factory(global.mostDomEvent = global.mostDomEvent || {}, global.most);
	})(this, function (exports, most) {
	  'use strict';

	  // domEvent :: (EventTarget t, Event e) => String -> t -> boolean=false -> Stream e

	  var domEvent = function (event, node, capture) {
	    if (capture === void 0) capture = false;

	    return new most.Stream(new DomEvent(event, node, capture));
	  };

	  var blur = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('blur', node, capture);
	  };
	  var focus = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('focus', node, capture);
	  };
	  var focusin = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('focusin', node, capture);
	  };
	  var focusout = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('focusout', node, capture);
	  };
	  var click = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('click', node, capture);
	  };
	  var dblclick = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('dblclick', node, capture);
	  };
	  var mousedown = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('mousedown', node, capture);
	  };
	  var mouseup = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('mouseup', node, capture);
	  };
	  var mousemove = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('mousemove', node, capture);
	  };
	  var mouseover = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('mouseover', node, capture);
	  };
	  var mouseenter = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('mouseenter', node, capture);
	  };
	  var mouseout = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('mouseout', node, capture);
	  };
	  var mouseleave = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('mouseleave', node, capture);
	  };
	  var change = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('change', node, capture);
	  };
	  var select = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('select', node, capture);
	  };
	  var submit = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('submit', node, capture);
	  };
	  var keydown = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('keydown', node, capture);
	  };
	  var keypress = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('keypress', node, capture);
	  };
	  var keyup = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('keyup', node, capture);
	  };
	  var input = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('input', node, capture);
	  };
	  var contextmenu = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('contextmenu', node, capture);
	  };
	  var resize = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('resize', node, capture);
	  };
	  var scroll = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('scroll', node, capture);
	  };
	  var error = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('error', node, capture);
	  };

	  var hashchange = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('hashchange', node, capture);
	  };
	  var popstate = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('popstate', node, capture);
	  };
	  var load = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('load', node, capture);
	  };
	  var unload = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('unload', node, capture);
	  };

	  var pointerdown = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('pointerdown', node, capture);
	  };
	  var pointerup = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('pointerup', node, capture);
	  };
	  var pointermove = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('pointermove', node, capture);
	  };
	  var pointerover = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('pointerover', node, capture);
	  };
	  var pointerenter = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('pointerenter', node, capture);
	  };
	  var pointerout = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('pointerout', node, capture);
	  };
	  var pointerleave = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('pointerleave', node, capture);
	  };

	  var touchstart = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('touchstart', node, capture);
	  };
	  var touchend = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('touchend', node, capture);
	  };
	  var touchmove = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('touchmove', node, capture);
	  };
	  var touchcancel = function (node, capture) {
	    if (capture === void 0) capture = false;

	    return domEvent('touchcancel', node, capture);
	  };

	  var DomEvent = function DomEvent(event, node, capture) {
	    this.event = event;
	    this.node = node;
	    this.capture = capture;
	  };

	  DomEvent.prototype.run = function run(sink, scheduler) {
	    var this$1 = this;

	    var send = function (e) {
	      return tryEvent(scheduler.now(), e, sink);
	    };
	    var dispose = function () {
	      return this$1.node.removeEventListener(this$1.event, send, this$1.capture);
	    };

	    this.node.addEventListener(this.event, send, this.capture);

	    return { dispose: dispose };
	  };

	  function tryEvent(t, x, sink) {
	    try {
	      sink.event(t, x);
	    } catch (e) {
	      sink.error(t, e);
	    }
	  }

	  exports.domEvent = domEvent;
	  exports.blur = blur;
	  exports.focus = focus;
	  exports.focusin = focusin;
	  exports.focusout = focusout;
	  exports.click = click;
	  exports.dblclick = dblclick;
	  exports.mousedown = mousedown;
	  exports.mouseup = mouseup;
	  exports.mousemove = mousemove;
	  exports.mouseover = mouseover;
	  exports.mouseenter = mouseenter;
	  exports.mouseout = mouseout;
	  exports.mouseleave = mouseleave;
	  exports.change = change;
	  exports.select = select;
	  exports.submit = submit;
	  exports.keydown = keydown;
	  exports.keypress = keypress;
	  exports.keyup = keyup;
	  exports.input = input;
	  exports.contextmenu = contextmenu;
	  exports.resize = resize;
	  exports.scroll = scroll;
	  exports.error = error;
	  exports.hashchange = hashchange;
	  exports.popstate = popstate;
	  exports.load = load;
	  exports.unload = unload;
	  exports.pointerdown = pointerdown;
	  exports.pointerup = pointerup;
	  exports.pointermove = pointermove;
	  exports.pointerover = pointerover;
	  exports.pointerenter = pointerenter;
	  exports.pointerout = pointerout;
	  exports.pointerleave = pointerleave;
	  exports.touchstart = touchstart;
	  exports.touchend = touchend;
	  exports.touchmove = touchmove;
	  exports.touchcancel = touchcancel;

	  Object.defineProperty(exports, '__esModule', { value: true });
	});
	//# sourceMappingURL=mostDomEvent.js.map

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(5)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(exports, require('@most/multicast'));
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod.exports, global.multicast);
	    global.mostHold = mod.exports;
	  }
	})(this, function (exports, _multicast) {
	  'use strict';

	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });

	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }

	  var _createClass = function () {
	    function defineProperties(target, props) {
	      for (var i = 0; i < props.length; i++) {
	        var descriptor = props[i];
	        descriptor.enumerable = descriptor.enumerable || false;
	        descriptor.configurable = true;
	        if ("value" in descriptor) descriptor.writable = true;
	        Object.defineProperty(target, descriptor.key, descriptor);
	      }
	    }

	    return function (Constructor, protoProps, staticProps) {
	      if (protoProps) defineProperties(Constructor.prototype, protoProps);
	      if (staticProps) defineProperties(Constructor, staticProps);
	      return Constructor;
	    };
	  }();

	  // hold :: Stream a -> Stream a
	  var index = function index(stream) {
	    return new stream.constructor(new _multicast.MulticastSource(new Hold(stream.source)));
	  };

	  var Hold = function () {
	    function Hold(source) {
	      _classCallCheck(this, Hold);

	      this.source = source;
	      this.time = -Infinity;
	      this.value = void 0;
	    }

	    _createClass(Hold, [{
	      key: 'run',
	      value: function run(sink, scheduler) {
	        /* istanbul ignore else */
	        if (sink._hold !== this) {
	          sink._hold = this;
	          sink._holdAdd = sink.add;
	          sink.add = holdAdd;

	          sink._holdEvent = sink.event;
	          sink.event = holdEvent;
	        }

	        return this.source.run(sink, scheduler);
	      }
	    }]);

	    return Hold;
	  }();

	  function holdAdd(sink) {
	    var len = this._holdAdd(sink);
	    /* istanbul ignore else */
	    if (this._hold.time >= 0) {
	      sink.event(this._hold.time, this._hold.value);
	    }
	    return len;
	  }

	  function holdEvent(t, x) {
	    /* istanbul ignore else */
	    if (t >= this._hold.time) {
	      this._hold.time = t;
	      this._hold.value = x;
	    }
	    return this._holdEvent(t, x);
	  }

	  exports.default = index;
	});

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _vnode = __webpack_require__(15);

	var _vnode2 = _interopRequireDefault(_vnode);

	var _is = __webpack_require__(10);

	var _is2 = _interopRequireDefault(_is);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	var isObservable = function isObservable(x) {
	  return typeof x.observe === 'function';
	};

	var addNSToObservable = function addNSToObservable(vNode) {
	  addNS(vNode.data, vNode.children); // eslint-disable-line
	};

	function addNS(data, children) {
	  data.ns = 'http://www.w3.org/2000/svg';
	  if (typeof children !== 'undefined' && _is2.default.array(children)) {
	    for (var i = 0; i < children.length; ++i) {
	      if (isObservable(children[i])) {
	        children[i] = children[i].tap(addNSToObservable);
	      } else {
	        addNS(children[i].data, children[i].children);
	      }
	    }
	  }
	}

	/* eslint-disable */
	function h(sel, b, c) {
	  var data = {};
	  var children = void 0;
	  var text = void 0;
	  var i = void 0;
	  if (arguments.length === 3) {
	    data = b;
	    if (_is2.default.array(c)) {
	      children = c;
	    } else if (_is2.default.primitive(c)) {
	      text = c;
	    }
	  } else if (arguments.length === 2) {
	    if (_is2.default.array(b)) {
	      children = b;
	    } else if (_is2.default.primitive(b)) {
	      text = b;
	    } else {
	      data = b;
	    }
	  }
	  if (_is2.default.array(children)) {
	    for (i = 0; i < children.length; ++i) {
	      if (_is2.default.primitive(children[i])) {
	        children[i] = (0, _vnode2.default)(undefined, undefined, undefined, children[i]);
	      }
	    }
	  }
	  if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g') {
	    addNS(data, children);
	  }
	  return (0, _vnode2.default)(sel, data || {}, children, text, undefined);
	}
	/* eslint-enable */

	exports.default = h;

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.makeDOMDriver = undefined;

	var _most = __webpack_require__(4);

	var _hold = __webpack_require__(41);

	var _hold2 = _interopRequireDefault(_hold);

	var _snabbdom = __webpack_require__(101);

	var _h = __webpack_require__(36);

	var _h2 = _interopRequireDefault(_h);

	var _classNameFromVNode = __webpack_require__(93);

	var _classNameFromVNode2 = _interopRequireDefault(_classNameFromVNode);

	var _selectorParser2 = __webpack_require__(35);

	var _selectorParser3 = _interopRequireDefault(_selectorParser2);

	var _utils = __webpack_require__(22);

	var _modules = __webpack_require__(21);

	var _modules2 = _interopRequireDefault(_modules);

	var _transposition = __webpack_require__(46);

	var _isolate = __webpack_require__(19);

	var _select = __webpack_require__(45);

	var _events = __webpack_require__(18);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	function makeVNodeWrapper(rootElement) {
	  return function vNodeWrapper(vNode) {
	    var _selectorParser = (0, _selectorParser3.default)(vNode.sel);

	    var selectorTagName = _selectorParser.tagName;
	    var selectorId = _selectorParser.id;

	    var vNodeClassName = (0, _classNameFromVNode2.default)(vNode);
	    var _vNode$data = vNode.data;
	    var vNodeData = _vNode$data === undefined ? {} : _vNode$data;
	    var _vNodeData$props = vNodeData.props;
	    var vNodeDataProps = _vNodeData$props === undefined ? {} : _vNodeData$props;
	    var _vNodeDataProps$id = vNodeDataProps.id;
	    var vNodeId = _vNodeDataProps$id === undefined ? selectorId : _vNodeDataProps$id;

	    var isVNodeAndRootElementIdentical = vNodeId.toUpperCase() === rootElement.id.toUpperCase() && selectorTagName.toUpperCase() === rootElement.tagName.toUpperCase() && vNodeClassName.toUpperCase() === rootElement.className.toUpperCase();

	    if (isVNodeAndRootElementIdentical) {
	      return vNode;
	    }

	    var tagName = rootElement.tagName;
	    var id = rootElement.id;
	    var className = rootElement.className;

	    var elementId = id ? '#' + id : '';
	    var elementClassName = className ? '.' + className.split(' ').join('.') : '';
	    return (0, _h2.default)('' + tagName + elementId + elementClassName, {}, [vNode]);
	  };
	}

	function DOMDriverInputGuard(view$) {
	  if (!view$ || typeof view$.observe !== 'function') {
	    throw new Error('The DOM driver function expects as input an ' + 'Observable of virtual DOM elements');
	  }
	}

	function defaultOnErrorFn(msg) {
	  if (console && console.error) {
	    console.error(msg);
	  } else {
	    console.log(msg);
	  }
	}

	var defaults = {
	  modules: _modules2.default,
	  onError: defaultOnErrorFn
	};

	function makeDOMDriver(container) {
	  var _ref = arguments.length <= 1 || arguments[1] === undefined ? defaults : arguments[1];

	  var _ref$modules = _ref.modules;
	  var modules = _ref$modules === undefined ? _modules2.default : _ref$modules;
	  var _ref$onError = _ref.onError;
	  var onError = _ref$onError === undefined ? defaultOnErrorFn : _ref$onError;

	  var patch = (0, _snabbdom.init)(modules);
	  var rootElement = (0, _utils.domSelectorParser)(container);

	  if (!Array.isArray(modules)) {
	    throw new Error('Optional modules option must be ' + 'an array for snabbdom modules');
	  }

	  if (typeof onError !== 'function') {
	    throw new Error('Optional onError opition must be ' + 'a function to approriately handle your errors');
	  }

	  function DOMDriver(view$) {
	    DOMDriverInputGuard(view$);

	    var rootElement$ = (0, _hold2.default)(view$.map(_transposition.transposeVTree).switch().map(makeVNodeWrapper(rootElement)).scan(patch, rootElement).skip(1).recoverWith(function (err) {
	      onError(err);
	      return (0, _most.throwError)(err);
	    }).map(function (_ref2) {
	      var elm = _ref2.elm;
	      return elm;
	    }));

	    rootElement$.drain();

	    return {
	      observable: rootElement$,
	      namespace: [],
	      select: (0, _select.makeElementSelector)(rootElement$),
	      events: (0, _events.makeEventsSelector)(rootElement$),
	      isolateSink: _isolate.isolateSink,
	      isolateSource: _isolate.isolateSource
	    };
	  }

	  return DOMDriver;
	}

	exports.makeDOMDriver = makeDOMDriver;

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.mockDOMSource = undefined;

	var _most = __webpack_require__(4);

	var _most2 = _interopRequireDefault(_most);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	var emptyStream = _most2.default.empty();

	function getEventsStreamForSelector(mockedEventTypes) {
	  return function getEventsStream(eventType) {
	    for (var key in mockedEventTypes) {
	      if (mockedEventTypes.hasOwnProperty(key) && key === eventType) {
	        return mockedEventTypes[key];
	      }
	    }
	    return emptyStream;
	  };
	}

	function makeMockSelector(mockedSelectors) {
	  return function select(selector) {
	    for (var key in mockedSelectors) {
	      if (mockedSelectors.hasOwnProperty(key) && key === selector) {
	        var observable = emptyStream;
	        if (mockedSelectors[key].hasOwnProperty('observable')) {
	          observable = mockedSelectors[key].observable;
	        }
	        return {
	          observable: observable,
	          select: makeMockSelector(mockedSelectors[key]),
	          events: getEventsStreamForSelector(mockedSelectors[key])
	        };
	      }
	    }
	    return {
	      observable: emptyStream,
	      select: makeMockSelector(mockedSelectors),
	      events: function events() {
	        return emptyStream;
	      }
	    };
	  };
	}

	function mockDOMSource() {
	  var mockedSelectors = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	  return {
	    observable: emptyStream,
	    select: makeMockSelector(mockedSelectors),
	    events: function events() {
	      return emptyStream;
	    }
	  };
	}

	exports.mockDOMSource = mockDOMSource;

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.makeIsStrictlyInRootScope = exports.makeElementSelector = undefined;

	var _makeIsStrictlyInRootScope = __webpack_require__(20);

	var _events = __webpack_require__(18);

	var _isolate = __webpack_require__(19);

	var isValidString = function isValidString(param) {
	  return typeof param === 'string' && param.length > 0;
	};

	var contains = function contains(str, match) {
	  return str.indexOf(match) > -1;
	};

	var isNotTagName = function isNotTagName(param) {
	  return isValidString(param) && contains(param, '.') || contains(param, '#') || contains(param, ':');
	};

	function sortNamespace(a, b) {
	  if (isNotTagName(a) && isNotTagName(b)) {
	    return 0;
	  }
	  return isNotTagName(a) ? 1 : -1;
	}

	function removeDuplicates(arr) {
	  var newArray = [];
	  arr.forEach(function (element) {
	    if (newArray.indexOf(element) === -1) {
	      newArray.push(element);
	    }
	  });
	  return newArray;
	}

	var getScope = function getScope(namespace) {
	  return namespace.filter(function (c) {
	    return c.indexOf('.cycle-scope') > -1;
	  });
	};

	function makeFindElements(namespace) {
	  return function findElements(rootElement) {
	    if (namespace.join('') === '') {
	      return rootElement;
	    }
	    var slice = Array.prototype.slice;

	    var scope = getScope(namespace);
	    // Uses global selector && is isolated
	    if (namespace.indexOf('*') > -1 && scope.length > 0) {
	      // grab top-level boundary of scope
	      var topNode = rootElement.querySelector(scope.join(' '));
	      // grab all children
	      var childNodes = topNode.getElementsByTagName('*');
	      return removeDuplicates([topNode].concat(slice.call(childNodes))).filter((0, _makeIsStrictlyInRootScope.makeIsStrictlyInRootScope)(namespace));
	    }

	    return removeDuplicates(slice.call(rootElement.querySelectorAll(namespace.join(' '))).concat(slice.call(rootElement.querySelectorAll(namespace.join(''))))).filter((0, _makeIsStrictlyInRootScope.makeIsStrictlyInRootScope)(namespace));
	  };
	}

	function makeElementSelector(rootElement$) {
	  return function elementSelector(selector) {
	    if (typeof selector !== 'string') {
	      throw new Error('DOM driver\'s select() expects the argument to be a ' + 'string as a CSS selector');
	    }

	    var namespace = this.namespace;
	    var trimmedSelector = selector.trim();
	    var childNamespace = trimmedSelector === ':root' ? namespace : namespace.concat(trimmedSelector).sort(sortNamespace);

	    return {
	      observable: rootElement$.map(makeFindElements(childNamespace)),
	      namespace: childNamespace,
	      select: makeElementSelector(rootElement$),
	      events: (0, _events.makeEventsSelector)(rootElement$, childNamespace),
	      isolateSource: _isolate.isolateSource,
	      isolateSink: _isolate.isolateSink
	    };
	  };
	}

	exports.makeElementSelector = makeElementSelector;
	exports.makeIsStrictlyInRootScope = _makeIsStrictlyInRootScope.makeIsStrictlyInRootScope;

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.transposeVTree = undefined;

	var _most = __webpack_require__(4);

	var _most2 = _interopRequireDefault(_most);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	function createVTree(vTree, children) {
	  return {
	    sel: vTree.sel,
	    data: vTree.data,
	    text: vTree.text,
	    elm: vTree.elm,
	    key: vTree.key,
	    children: children
	  };
	}

	function transposeVTree(vTree) {
	  if (!vTree) {
	    return null;
	  } else if (vTree && typeof vTree.data === 'object' && vTree.data.static) {
	    return _most2.default.just(vTree);
	  } else if (typeof vTree.observe === 'function') {
	    return vTree.map(transposeVTree).switch();
	  } else if (typeof vTree === 'object') {
	    if (!vTree.children || vTree.children.length === 0) {
	      return _most2.default.just(vTree);
	    }

	    var vTreeChildren = vTree.children.map(transposeVTree).filter(function (x) {
	      return x !== null;
	    });

	    return vTreeChildren.length === 0 ? _most2.default.just(createVTree(vTree, vTreeChildren)) : _most2.default.combineArray(function () {
	      for (var _len = arguments.length, children = Array(_len), _key = 0; _key < _len; _key++) {
	        children[_key] = arguments[_key];
	      }

	      return createVTree(vTree, children);
	    }, vTreeChildren);
	  } else {
	    throw new Error('Unhandled vTree Value');
	  }
	}

	exports.transposeVTree = transposeVTree;

/***/ },
/* 47 */
/***/ function(module, exports) {

	/*!
	 * Cross-Browser Split 1.1.1
	 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
	 * Available under the MIT License
	 * ECMAScript compliant, uniform cross-browser split method
	 */

	/**
	 * Splits a string into an array of strings using a regex or string separator. Matches of the
	 * separator are not included in the result array. However, if `separator` is a regex that contains
	 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
	 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
	 * cross-browser.
	 * @param {String} str String to split.
	 * @param {RegExp|String} separator Regex or string to use for separating the string.
	 * @param {Number} [limit] Maximum number of items to include in the result array.
	 * @returns {Array} Array of substrings.
	 * @example
	 *
	 * // Basic use
	 * split('a b c d', ' ');
	 * // -> ['a', 'b', 'c', 'd']
	 *
	 * // With limit
	 * split('a b c d', ' ', 2);
	 * // -> ['a', 'b']
	 *
	 * // Backreferences in result array
	 * split('..word1 word2..', /([a-z]+)(\d+)/i);
	 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
	 */
	module.exports = function split(undef) {

	  var nativeSplit = String.prototype.split,
	      compliantExecNpcg = /()??/.exec("")[1] === undef,

	  // NPCG: nonparticipating capturing group
	  self;

	  self = function (str, separator, limit) {
	    // If `separator` is not a regex, use `nativeSplit`
	    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
	      return nativeSplit.call(str, separator, limit);
	    }
	    var output = [],
	        flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + ( // Proposed for ES6
	    separator.sticky ? "y" : ""),

	    // Firefox 3+
	    lastLastIndex = 0,

	    // Make `global` and avoid `lastIndex` issues by working with a copy
	    separator = new RegExp(separator.source, flags + "g"),
	        separator2,
	        match,
	        lastIndex,
	        lastLength;
	    str += ""; // Type-convert
	    if (!compliantExecNpcg) {
	      // Doesn't need flags gy, but they don't hurt
	      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
	    }
	    /* Values for `limit`, per the spec:
	     * If undefined: 4294967295 // Math.pow(2, 32) - 1
	     * If 0, Infinity, or NaN: 0
	     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
	     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
	     * If other: Type-convert, then use the above rules
	     */
	    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
	    limit >>> 0; // ToUint32(limit)
	    while (match = separator.exec(str)) {
	      // `separator.lastIndex` is not reliable cross-browser
	      lastIndex = match.index + match[0].length;
	      if (lastIndex > lastLastIndex) {
	        output.push(str.slice(lastLastIndex, match.index));
	        // Fix browsers whose `exec` methods don't consistently return `undefined` for
	        // nonparticipating capturing groups
	        if (!compliantExecNpcg && match.length > 1) {
	          match[0].replace(separator2, function () {
	            for (var i = 1; i < arguments.length - 2; i++) {
	              if (arguments[i] === undef) {
	                match[i] = undef;
	              }
	            }
	          });
	        }
	        if (match.length > 1 && match.index < str.length) {
	          Array.prototype.push.apply(output, match.slice(1));
	        }
	        lastLength = match[0].length;
	        lastLastIndex = lastIndex;
	        if (output.length >= limit) {
	          break;
	        }
	      }
	      if (separator.lastIndex === match.index) {
	        separator.lastIndex++; // Avoid an infinite loop
	      }
	    }
	    if (lastLastIndex === str.length) {
	      if (lastLength || !separator.test("")) {
	        output.push("");
	      }
	    } else {
	      output.push(str.slice(lastLastIndex));
	    }
	    return output.length > limit ? output.slice(0, limit) : output;
	  };

	  return self;
	}();

/***/ },
/* 48 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var isValidString = function isValidString(param) {
	  return typeof param === 'string' && param.length > 0;
	};

	var startsWith = function startsWith(string, start) {
	  return string[0] === start;
	};

	var isSelector = function isSelector(param) {
	  return isValidString(param) && (startsWith(param, '.') || startsWith(param, '#'));
	};

	var node = function node(h) {
	  return function (tagName) {
	    return function (first) {
	      for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        rest[_key - 1] = arguments[_key];
	      }

	      if (isSelector(first)) {
	        return h.apply(undefined, [tagName + first].concat(rest));
	      } else {
	        return h.apply(undefined, [tagName, first].concat(rest));
	      }
	    };
	  };
	};

	var TAG_NAMES = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'dd', 'del', 'dfn', 'dir', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'meta', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'p', 'param', 'pre', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'title', 'tr', 'u', 'ul', 'video', 'progress'];

	exports['default'] = function (h) {
	  var createTag = node(h);
	  var exported = { TAG_NAMES: TAG_NAMES, isSelector: isSelector, createTag: createTag };
	  TAG_NAMES.forEach(function (n) {
	    exported[n] = createTag(n);
	  });
	  return exported;
	};

	module.exports = exports['default'];

/***/ },
/* 49 */
/***/ function(module, exports) {

	'use strict';

	var proto = Element.prototype;
	var vendor = proto.matches || proto.matchesSelector || proto.webkitMatchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector;

	module.exports = match;

	/**
	 * Match `el` to `selector`.
	 *
	 * @param {Element} el
	 * @param {String} selector
	 * @return {Boolean}
	 * @api public
	 */

	function match(el, selector) {
	  if (vendor) return vendor.call(el, selector);
	  var nodes = el.parentNode.querySelectorAll(selector);
	  for (var i = 0; i < nodes.length; i++) {
	    if (nodes[i] == el) return true;
	  }
	  return false;
	}

/***/ },
/* 50 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}();

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	function tryEvent(sink, scheduler, event) {
	  try {
	    sink.event(scheduler.now(), event);
	  } catch (err) {
	    sink.error(scheduler.now(), err);
	  }
	}

	function tryEnd(sink, scheduler, event) {
	  try {
	    sink.end(scheduler.now(), event);
	  } catch (err) {
	    sink.error(scheduler.now(), err);
	  }
	}

	var Observer = function () {
	  function Observer() {
	    var _this = this;

	    _classCallCheck(this, Observer);

	    this.run = function (sink, scheduler) {
	      return _this._run(sink, scheduler);
	    };
	    this.next = function (x) {
	      return _this._next(x);
	    };
	    this.error = function (err) {
	      return _this._error(err);
	    };
	    this.complete = function (x) {
	      return _this._complete(x);
	    };
	  }

	  _createClass(Observer, [{
	    key: "_run",
	    value: function _run(sink, scheduler) {
	      this.sink = sink;
	      this.scheduler = scheduler;
	      this.active = true;
	      return this;
	    }
	  }, {
	    key: "dispose",
	    value: function dispose() {
	      this.active = false;
	    }
	  }, {
	    key: "_next",
	    value: function _next(value) {
	      if (!this.active) {
	        return;
	      }
	      tryEvent(this.sink, this.scheduler, value);
	    }
	  }, {
	    key: "_error",
	    value: function _error(err) {
	      this.active = false;
	      this.sink.error(this.scheduler.now(), err);
	    }
	  }, {
	    key: "_complete",
	    value: function _complete(value) {
	      if (!this.active) {
	        return;
	      }
	      this.active = false;
	      tryEnd(this.sink, this.scheduler, value);
	    }
	  }]);

	  return Observer;
	}();

	exports.Observer = Observer;

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.replay = undefined;

	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}();

	var _most = __webpack_require__(4);

	var _multicast = __webpack_require__(5);

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	function pushEvents(sink, buffer) {
	  var i = 0;
	  for (; i < buffer.length; ++i) {
	    var item = buffer[i];
	    sink.event(item.time, item.value);
	  }
	}

	function replayAdd(sink) {
	  var length = this._replayAdd(sink);
	  if (this._replay.buffer.length > 0) {
	    pushEvents(sink, this._replay.buffer);
	  }
	  return length;
	}

	function addToBuffer(event, replay) {
	  if (replay.buffer.length >= replay.bufferSize) {
	    replay.buffer.shift();
	  }
	  replay.buffer.push(event);
	}

	function replayEvent(time, value) {
	  if (this._replay.bufferSize > 0) {
	    addToBuffer({ time: time, value: value }, this._replay);
	  }
	  this._replayEvent(time, value);
	}

	var Replay = function () {
	  function Replay(bufferSize, source) {
	    _classCallCheck(this, Replay);

	    this.source = source;
	    this.bufferSize = bufferSize;
	    this.buffer = [];
	  }

	  _createClass(Replay, [{
	    key: 'run',
	    value: function run(sink, scheduler) {
	      if (sink._replay !== this) {
	        sink._replay = this;
	        sink._replayAdd = sink.add;
	        sink.add = replayAdd;

	        sink._replayEvent = sink.event;
	        sink.event = replayEvent;
	      }

	      return this.source.run(sink, scheduler);
	    }
	  }]);

	  return Replay;
	}();

	var replay = function replay(bufferSize, stream) {
	  return new _most.Stream(new _multicast.MulticastSource(new Replay(bufferSize, stream.source)));
	};

	exports.replay = replay;

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.holdSubject = exports.subject = undefined;

	var _most = __webpack_require__(4);

	var _multicast = __webpack_require__(5);

	var _Observer = __webpack_require__(50);

	var _Replay = __webpack_require__(51);

	function create(hold, bufferSize, initialValue) {
	  var observer = new _Observer.Observer();
	  var stream = hold ? (0, _Replay.replay)(bufferSize, new _most.Stream(observer)) : new _most.Stream(new _multicast.MulticastSource(observer));

	  stream.drain();

	  if (typeof initialValue !== 'undefined') {
	    observer.next(initialValue);
	  }

	  return { stream: stream, observer: observer };
	}

	function subject() {
	  return create(false, 0);
	}

	function holdSubject() {
	  var bufferSize = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
	  var initialValue = arguments[1];

	  if (bufferSize < 1) {
	    throw new Error('First argument to holdSubject is expected to be an ' + 'integer greater than or equal to 1');
	  }
	  return create(true, bufferSize, initialValue);
	}

	exports.subject = subject;
	exports.holdSubject = holdSubject;

/***/ },
/* 53 */
/***/ function(module, exports) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	module.exports = LinkedList;

	/**
	 * Doubly linked list
	 * @constructor
	 */
	function LinkedList() {
		this.head = null;
		this.length = 0;
	}

	/**
	 * Add a node to the end of the list
	 * @param {{prev:Object|null, next:Object|null, dispose:function}} x node to add
	 */
	LinkedList.prototype.add = function (x) {
		if (this.head !== null) {
			this.head.prev = x;
			x.next = this.head;
		}
		this.head = x;
		++this.length;
	};

	/**
	 * Remove the provided node from the list
	 * @param {{prev:Object|null, next:Object|null, dispose:function}} x node to remove
	 */
	LinkedList.prototype.remove = function (x) {
		--this.length;
		if (x === this.head) {
			this.head = this.head.next;
		}
		if (x.next !== null) {
			x.next.prev = x.prev;
			x.next = null;
		}
		if (x.prev !== null) {
			x.prev.next = x.next;
			x.prev = null;
		}
	};

	/**
	 * @returns {boolean} true iff there are no nodes in the list
	 */
	LinkedList.prototype.isEmpty = function () {
		return this.length === 0;
	};

	/**
	 * Dispose all nodes
	 * @returns {Promise} promise that fulfills when all nodes have been disposed,
	 *  or rejects if an error occurs while disposing
	 */
	LinkedList.prototype.dispose = function () {
		if (this.isEmpty()) {
			return Promise.resolve();
		}

		var promises = [];
		var x = this.head;
		this.head = null;
		this.length = 0;

		while (x !== null) {
			promises.push(x.dispose());
			x = x.next;
		}

		return Promise.all(promises);
	};

/***/ },
/* 54 */
/***/ function(module, exports) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	// Based on https://github.com/petkaantonov/deque

	module.exports = Queue;

	function Queue(capPow2) {
		this._capacity = capPow2 || 32;
		this._length = 0;
		this._head = 0;
	}

	Queue.prototype.push = function (x) {
		var len = this._length;
		this._checkCapacity(len + 1);

		var i = this._head + len & this._capacity - 1;
		this[i] = x;
		this._length = len + 1;
	};

	Queue.prototype.shift = function () {
		var head = this._head;
		var x = this[head];

		this[head] = void 0;
		this._head = head + 1 & this._capacity - 1;
		this._length--;
		return x;
	};

	Queue.prototype.isEmpty = function () {
		return this._length === 0;
	};

	Queue.prototype.length = function () {
		return this._length;
	};

	Queue.prototype._checkCapacity = function (size) {
		if (this._capacity < size) {
			this._ensureCapacity(this._capacity << 1);
		}
	};

	Queue.prototype._ensureCapacity = function (capacity) {
		var oldCapacity = this._capacity;
		this._capacity = capacity;

		var last = this._head + this._length;

		if (last > oldCapacity) {
			copy(this, 0, this, oldCapacity, last & oldCapacity - 1);
		}
	};

	function copy(src, srcIndex, dst, dstIndex, len) {
		for (var j = 0; j < len; ++j) {
			dst[j + dstIndex] = src[j + srcIndex];
			src[j + srcIndex] = void 0;
		}
	}

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Stream = __webpack_require__(0);
	var Pipe = __webpack_require__(1);
	var runSource = __webpack_require__(32);
	var cons = __webpack_require__(23).cons;

	exports.scan = scan;
	exports.reduce = reduce;

	/**
	 * Create a stream containing successive reduce results of applying f to
	 * the previous reduce result and the current stream item.
	 * @param {function(result:*, x:*):*} f reducer function
	 * @param {*} initial initial value
	 * @param {Stream} stream stream to scan
	 * @returns {Stream} new stream containing successive reduce results
	 */
	function scan(f, initial, stream) {
		return cons(initial, new Stream(new Accumulate(ScanSink, f, initial, stream.source)));
	}

	function ScanSink(f, z, sink) {
		this.f = f;
		this.value = z;
		this.sink = sink;
	}

	ScanSink.prototype.event = function (t, x) {
		var f = this.f;
		this.value = f(this.value, x);
		this.sink.event(t, this.value);
	};

	ScanSink.prototype.error = Pipe.prototype.error;
	ScanSink.prototype.end = Pipe.prototype.end;

	/**
	 * Reduce a stream to produce a single result.  Note that reducing an infinite
	 * stream will return a Promise that never fulfills, but that may reject if an error
	 * occurs.
	 * @param {function(result:*, x:*):*} f reducer function
	 * @param {*} initial initial value
	 * @param {Stream} stream to reduce
	 * @returns {Promise} promise for the file result of the reduce
	 */
	function reduce(f, initial, stream) {
		return runSource.withDefaultScheduler(noop, new Accumulate(AccumulateSink, f, initial, stream.source));
	}

	function Accumulate(SinkType, f, z, source) {
		this.SinkType = SinkType;
		this.f = f;
		this.value = z;
		this.source = source;
	}

	Accumulate.prototype.run = function (sink, scheduler) {
		return this.source.run(new this.SinkType(this.f, this.value, sink), scheduler);
	};

	function AccumulateSink(f, z, sink) {
		this.f = f;
		this.value = z;
		this.sink = sink;
	}

	AccumulateSink.prototype.event = function (t, x) {
		var f = this.f;
		this.value = f(this.value, x);
		this.sink.event(t, this.value);
	};

	AccumulateSink.prototype.error = Pipe.prototype.error;

	AccumulateSink.prototype.end = function (t) {
		this.sink.end(t, this.value);
	};

	function noop() {}

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var combine = __webpack_require__(24).combine;
	var apply = __webpack_require__(3).apply;

	exports.ap = ap;

	/**
	 * Assume fs is a stream containing functions, and apply the latest function
	 * in fs to the latest value in xs.
	 * fs:         --f---------g--------h------>
	 * xs:         -a-------b-------c-------d-->
	 * ap(fs, xs): --fa-----fb-gb---gc--hc--hd->
	 * @param {Stream} fs stream of functions to apply to the latest x
	 * @param {Stream} xs stream of values to which to apply all the latest f
	 * @returns {Stream} stream containing all the applications of fs to xs
	 */
	function ap(fs, xs) {
	  return combine(apply, fs, xs);
	}

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var mergeMapConcurrently = __webpack_require__(8).mergeMapConcurrently;

	exports.concatMap = concatMap;

	/**
	 * Map each value in stream to a new stream, and concatenate them all
	 * stream:              -a---b---cX
	 * f(a):                 1-1-1-1X
	 * f(b):                        -2-2-2-2X
	 * f(c):                                -3-3-3-3X
	 * stream.concatMap(f): -1-1-1-1-2-2-2-2-3-3-3-3X
	 * @param {function(x:*):Stream} f function to map each value to a stream
	 * @param {Stream} stream
	 * @returns {Stream} new stream containing all events from each stream returned by f
	 */
	function concatMap(f, stream) {
	  return mergeMapConcurrently(f, 1, stream);
	}

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Stream = __webpack_require__(0);
	var Sink = __webpack_require__(1);
	var dispose = __webpack_require__(2);
	var PropagateTask = __webpack_require__(6);

	exports.delay = delay;

	/**
	 * @param {Number} delayTime milliseconds to delay each item
	 * @param {Stream} stream
	 * @returns {Stream} new stream containing the same items, but delayed by ms
	 */
	function delay(delayTime, stream) {
		return delayTime <= 0 ? stream : new Stream(new Delay(delayTime, stream.source));
	}

	function Delay(dt, source) {
		this.dt = dt;
		this.source = source;
	}

	Delay.prototype.run = function (sink, scheduler) {
		var delaySink = new DelaySink(this.dt, sink, scheduler);
		return dispose.all([delaySink, this.source.run(delaySink, scheduler)]);
	};

	function DelaySink(dt, sink, scheduler) {
		this.dt = dt;
		this.sink = sink;
		this.scheduler = scheduler;
	}

	DelaySink.prototype.dispose = function () {
		var self = this;
		this.scheduler.cancelAll(function (task) {
			return task.sink === self.sink;
		});
	};

	DelaySink.prototype.event = function (t, x) {
		this.scheduler.delay(this.dt, PropagateTask.event(x, this.sink));
	};

	DelaySink.prototype.end = function (t, x) {
		this.scheduler.delay(this.dt, PropagateTask.end(x, this.sink));
	};

	DelaySink.prototype.error = Sink.prototype.error;

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Stream = __webpack_require__(0);
	var ValueSource = __webpack_require__(34);
	var SafeSink = __webpack_require__(81);
	var Pipe = __webpack_require__(1);
	var dispose = __webpack_require__(2);
	var tryEvent = __webpack_require__(9);
	var isPromise = __webpack_require__(11).isPromise;

	exports.flatMapError = recoverWith;
	exports.recoverWith = recoverWith;
	exports.throwError = throwError;

	/**
	 * If stream encounters an error, recover and continue with items from stream
	 * returned by f.
	 * @param {function(error:*):Stream} f function which returns a new stream
	 * @param {Stream} stream
	 * @returns {Stream} new stream which will recover from an error by calling f
	 */
	function recoverWith(f, stream) {
		return new Stream(new RecoverWith(f, stream.source));
	}

	/**
	 * Create a stream containing only an error
	 * @param {*} e error value, preferably an Error or Error subtype
	 * @returns {Stream} new stream containing only an error
	 */
	function throwError(e) {
		return new Stream(new ValueSource(error, e));
	}

	function error(t, e, sink) {
		sink.error(t, e);
	}

	function RecoverWith(f, source) {
		this.f = f;
		this.source = source;
	}

	RecoverWith.prototype.run = function (sink, scheduler) {
		return new RecoverWithSink(this.f, this.source, sink, scheduler);
	};

	function RecoverWithSink(f, source, sink, scheduler) {
		this.f = f;
		this.sink = new SafeSink(sink);
		this.scheduler = scheduler;
		this.disposable = source.run(this, scheduler);
	}

	RecoverWithSink.prototype.event = function (t, x) {
		tryEvent.tryEvent(t, x, this.sink);
	};

	RecoverWithSink.prototype.end = function (t, x) {
		tryEvent.tryEnd(t, x, this.sink);
	};

	RecoverWithSink.prototype.error = function (t, e) {
		var nextSink = this.sink.disable();

		var result = dispose.tryDispose(t, this.disposable, nextSink);
		this.disposable = isPromise(result) ? dispose.promised(this._thenContinue(result, e, nextSink)) : this._continue(this.f, e, nextSink);
	};

	RecoverWithSink.prototype._thenContinue = function (p, x, sink) {
		var self = this;
		return p.then(function () {
			return self._continue(self.f, x, sink);
		});
	};

	RecoverWithSink.prototype._continue = function (f, x, sink) {
		return f(x).source.run(sink, this.scheduler);
	};

	RecoverWithSink.prototype.dispose = function () {
		return this.disposable.dispose();
	};

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Stream = __webpack_require__(0);
	var Sink = __webpack_require__(1);
	var Filter = __webpack_require__(29);

	exports.filter = filter;
	exports.skipRepeats = skipRepeats;
	exports.skipRepeatsWith = skipRepeatsWith;

	/**
	 * Retain only items matching a predicate
	 * @param {function(x:*):boolean} p filtering predicate called for each item
	 * @param {Stream} stream stream to filter
	 * @returns {Stream} stream containing only items for which predicate returns truthy
	 */
	function filter(p, stream) {
		return new Stream(Filter.create(p, stream.source));
	}

	/**
	 * Skip repeated events, using === to detect duplicates
	 * @param {Stream} stream stream from which to omit repeated events
	 * @returns {Stream} stream without repeated events
	 */
	function skipRepeats(stream) {
		return skipRepeatsWith(same, stream);
	}

	/**
	 * Skip repeated events using the provided equals function to detect duplicates
	 * @param {function(a:*, b:*):boolean} equals optional function to compare items
	 * @param {Stream} stream stream from which to omit repeated events
	 * @returns {Stream} stream without repeated events
	 */
	function skipRepeatsWith(equals, stream) {
		return new Stream(new SkipRepeats(equals, stream.source));
	}

	function SkipRepeats(equals, source) {
		this.equals = equals;
		this.source = source;
	}

	SkipRepeats.prototype.run = function (sink, scheduler) {
		return this.source.run(new SkipRepeatsSink(this.equals, sink), scheduler);
	};

	function SkipRepeatsSink(equals, sink) {
		this.equals = equals;
		this.sink = sink;
		this.value = void 0;
		this.init = true;
	}

	SkipRepeatsSink.prototype.end = Sink.prototype.end;
	SkipRepeatsSink.prototype.error = Sink.prototype.error;

	SkipRepeatsSink.prototype.event = function (t, x) {
		if (this.init) {
			this.init = false;
			this.value = x;
			this.sink.event(t, x);
		} else if (!this.equals(this.value, x)) {
			this.value = x;
			this.sink.event(t, x);
		}
	};

	function same(a, b) {
		return a === b;
	}

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Stream = __webpack_require__(0);
	var Sink = __webpack_require__(1);
	var dispose = __webpack_require__(2);
	var PropagateTask = __webpack_require__(6);

	exports.throttle = throttle;
	exports.debounce = debounce;

	/**
	 * Limit the rate of events by suppressing events that occur too often
	 * @param {Number} period time to suppress events
	 * @param {Stream} stream
	 * @returns {Stream}
	 */
	function throttle(period, stream) {
		return new Stream(new Throttle(period, stream.source));
	}

	function Throttle(period, source) {
		this.dt = period;
		this.source = source;
	}

	Throttle.prototype.run = function (sink, scheduler) {
		return this.source.run(new ThrottleSink(this.dt, sink), scheduler);
	};

	function ThrottleSink(dt, sink) {
		this.time = 0;
		this.dt = dt;
		this.sink = sink;
	}

	ThrottleSink.prototype.event = function (t, x) {
		if (t >= this.time) {
			this.time = t + this.dt;
			this.sink.event(t, x);
		}
	};

	ThrottleSink.prototype.end = Sink.prototype.end;

	ThrottleSink.prototype.error = Sink.prototype.error;

	/**
	 * Wait for a burst of events to subside and emit only the last event in the burst
	 * @param {Number} period events occuring more frequently than this
	 *  will be suppressed
	 * @param {Stream} stream stream to debounce
	 * @returns {Stream} new debounced stream
	 */
	function debounce(period, stream) {
		return new Stream(new Debounce(period, stream.source));
	}

	function Debounce(dt, source) {
		this.dt = dt;
		this.source = source;
	}

	Debounce.prototype.run = function (sink, scheduler) {
		return new DebounceSink(this.dt, this.source, sink, scheduler);
	};

	function DebounceSink(dt, source, sink, scheduler) {
		this.dt = dt;
		this.sink = sink;
		this.scheduler = scheduler;
		this.value = void 0;
		this.timer = null;

		var sourceDisposable = source.run(this, scheduler);
		this.disposable = dispose.all([this, sourceDisposable]);
	}

	DebounceSink.prototype.event = function (t, x) {
		this._clearTimer();
		this.value = x;
		this.timer = this.scheduler.delay(this.dt, PropagateTask.event(x, this.sink));
	};

	DebounceSink.prototype.end = function (t, x) {
		if (this._clearTimer()) {
			this.sink.event(t, this.value);
			this.value = void 0;
		}
		this.sink.end(t, x);
	};

	DebounceSink.prototype.error = function (t, x) {
		this._clearTimer();
		this.sink.error(t, x);
	};

	DebounceSink.prototype.dispose = function () {
		this._clearTimer();
	};

	DebounceSink.prototype._clearTimer = function () {
		if (this.timer === null) {
			return false;
		}
		this.timer.cancel();
		this.timer = null;
		return true;
	};

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Stream = __webpack_require__(0);
	var Pipe = __webpack_require__(1);

	exports.loop = loop;

	/**
	 * Generalized feedback loop. Call a stepper function for each event. The stepper
	 * will be called with 2 params: the current seed and the an event value.  It must
	 * return a new { seed, value } pair. The `seed` will be fed back into the next
	 * invocation of stepper, and the `value` will be propagated as the event value.
	 * @param {function(seed:*, value:*):{seed:*, value:*}} stepper loop step function
	 * @param {*} seed initial seed value passed to first stepper call
	 * @param {Stream} stream event stream
	 * @returns {Stream} new stream whose values are the `value` field of the objects
	 * returned by the stepper
	 */
	function loop(stepper, seed, stream) {
		return new Stream(new Loop(stepper, seed, stream.source));
	}

	function Loop(stepper, seed, source) {
		this.step = stepper;
		this.seed = seed;
		this.source = source;
	}

	Loop.prototype.run = function (sink, scheduler) {
		return this.source.run(new LoopSink(this.step, this.seed, sink), scheduler);
	};

	function LoopSink(stepper, seed, sink) {
		this.step = stepper;
		this.seed = seed;
		this.sink = sink;
	}

	LoopSink.prototype.error = Pipe.prototype.error;

	LoopSink.prototype.event = function (t, x) {
		var result = this.step(this.seed, x);
		this.seed = result.seed;
		this.sink.event(t, result.value);
	};

	LoopSink.prototype.end = function (t) {
		this.sink.end(t, this.seed);
	};

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Stream = __webpack_require__(0);
	var Pipe = __webpack_require__(1);
	var IndexSink = __webpack_require__(14);
	var empty = __webpack_require__(7).empty;
	var dispose = __webpack_require__(2);
	var base = __webpack_require__(3);

	var copy = base.copy;
	var reduce = base.reduce;

	exports.merge = merge;
	exports.mergeArray = mergeArray;

	/**
	 * @returns {Stream} stream containing events from all streams in the argument
	 * list in time order.  If two events are simultaneous they will be merged in
	 * arbitrary order.
	 */
	function merge() /*...streams*/{
		return mergeArray(copy(arguments));
	}

	/**
	 * @param {Array} streams array of stream to merge
	 * @returns {Stream} stream containing events from all input observables
	 * in time order.  If two events are simultaneous they will be merged in
	 * arbitrary order.
	 */
	function mergeArray(streams) {
		var l = streams.length;
		return l === 0 ? empty() : l === 1 ? streams[0] : new Stream(mergeSources(streams));
	}

	/**
	 * This implements fusion/flattening for merge.  It will
	 * fuse adjacent merge operations.  For example:
	 * - a.merge(b).merge(c) effectively becomes merge(a, b, c)
	 * - merge(a, merge(b, c)) effectively becomes merge(a, b, c)
	 * It does this by concatenating the sources arrays of
	 * any nested Merge sources, in effect "flattening" nested
	 * merge operations into a single merge.
	 */
	function mergeSources(streams) {
		return new Merge(reduce(appendSources, [], streams));
	}

	function appendSources(sources, stream) {
		var source = stream.source;
		return source instanceof Merge ? sources.concat(source.sources) : sources.concat(source);
	}

	function Merge(sources) {
		this.sources = sources;
	}

	Merge.prototype.run = function (sink, scheduler) {
		var l = this.sources.length;
		var disposables = new Array(l);
		var sinks = new Array(l);

		var mergeSink = new MergeSink(disposables, sinks, sink);

		for (var indexSink, i = 0; i < l; ++i) {
			indexSink = sinks[i] = new IndexSink(i, mergeSink);
			disposables[i] = this.sources[i].run(indexSink, scheduler);
		}

		return dispose.all(disposables);
	};

	function MergeSink(disposables, sinks, sink) {
		this.sink = sink;
		this.disposables = disposables;
		this.activeCount = sinks.length;
	}

	MergeSink.prototype.error = Pipe.prototype.error;

	MergeSink.prototype.event = function (t, indexValue) {
		this.sink.event(t, indexValue.value);
	};

	MergeSink.prototype.end = function (t, indexedValue) {
		dispose.tryDispose(t, this.disposables[indexedValue.index], this.sink);
		if (--this.activeCount === 0) {
			this.sink.end(t, indexedValue.value);
		}
	};

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var runSource = __webpack_require__(32);

	exports.observe = observe;
	exports.drain = drain;

	/**
	 * Observe all the event values in the stream in time order. The
	 * provided function `f` will be called for each event value
	 * @param {function(x:T):*} f function to call with each event value
	 * @param {Stream<T>} stream stream to observe
	 * @return {Promise} promise that fulfills after the stream ends without
	 *  an error, or rejects if the stream ends with an error.
	 */
	function observe(f, stream) {
	  return runSource.withDefaultScheduler(f, stream.source);
	}

	/**
	 * "Run" a stream by
	 * @param stream
	 * @return {*}
	 */
	function drain(stream) {
	  return runSource.withDefaultScheduler(noop, stream.source);
	}

	function noop() {}

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Stream = __webpack_require__(0);
	var fatal = __webpack_require__(28);
	var just = __webpack_require__(7).of;

	exports.fromPromise = fromPromise;
	exports.awaitPromises = awaitPromises;

	/**
	 * Create a stream containing only the promise's fulfillment
	 * value at the time it fulfills.
	 * @param {Promise<T>} p promise
	 * @return {Stream<T>} stream containing promise's fulfillment value.
	 *  If the promise rejects, the stream will error
	 */
	function fromPromise(p) {
		return awaitPromises(just(p));
	}

	/**
	 * Turn a Stream<Promise<T>> into Stream<T> by awaiting each promise.
	 * Event order is preserved.
	 * @param {Stream<Promise<T>>} stream
	 * @return {Stream<T>} stream of fulfillment values.  The stream will
	 * error if any promise rejects.
	 */
	function awaitPromises(stream) {
		return new Stream(new Await(stream.source));
	}

	function Await(source) {
		this.source = source;
	}

	Await.prototype.run = function (sink, scheduler) {
		return this.source.run(new AwaitSink(sink, scheduler), scheduler);
	};

	function AwaitSink(sink, scheduler) {
		this.sink = sink;
		this.scheduler = scheduler;
		this.queue = Promise.resolve();
		var self = this;

		// Pre-create closures, to avoid creating them per event
		this._eventBound = function (x) {
			self.sink.event(self.scheduler.now(), x);
		};

		this._endBound = function (x) {
			self.sink.end(self.scheduler.now(), x);
		};

		this._errorBound = function (e) {
			self.sink.error(self.scheduler.now(), e);
		};
	}

	AwaitSink.prototype.event = function (t, promise) {
		var self = this;
		this.queue = this.queue.then(function () {
			return self._event(promise);
		}).catch(this._errorBound);
	};

	AwaitSink.prototype.end = function (t, x) {
		var self = this;
		this.queue = this.queue.then(function () {
			return self._end(x);
		}).catch(this._errorBound);
	};

	AwaitSink.prototype.error = function (t, e) {
		var self = this;
		// Don't resolve error values, propagate directly
		this.queue = this.queue.then(function () {
			return self._errorBound(e);
		}).catch(fatal);
	};

	AwaitSink.prototype._event = function (promise) {
		return promise.then(this._eventBound);
	};

	AwaitSink.prototype._end = function (x) {
		return Promise.resolve(x).then(this._endBound);
	};

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Stream = __webpack_require__(0);
	var Pipe = __webpack_require__(1);
	var dispose = __webpack_require__(2);
	var base = __webpack_require__(3);
	var invoke = __webpack_require__(13);

	exports.sample = sample;
	exports.sampleWith = sampleWith;
	exports.sampleArray = sampleArray;

	/**
	 * When an event arrives on sampler, emit the result of calling f with the latest
	 * values of all streams being sampled
	 * @param {function(...values):*} f function to apply to each set of sampled values
	 * @param {Stream} sampler streams will be sampled whenever an event arrives
	 *  on sampler
	 * @returns {Stream} stream of sampled and transformed values
	 */
	function sample(f, sampler /*, ...streams */) {
		return sampleArray(f, sampler, base.drop(2, arguments));
	}

	/**
	 * When an event arrives on sampler, emit the latest event value from stream.
	 * @param {Stream} sampler stream of events at whose arrival time
	 *  stream's latest value will be propagated
	 * @param {Stream} stream stream of values
	 * @returns {Stream} sampled stream of values
	 */
	function sampleWith(sampler, stream) {
		return new Stream(new Sampler(base.id, sampler.source, [stream.source]));
	}

	function sampleArray(f, sampler, streams) {
		return new Stream(new Sampler(f, sampler.source, base.map(getSource, streams)));
	}

	function getSource(stream) {
		return stream.source;
	}

	function Sampler(f, sampler, sources) {
		this.f = f;
		this.sampler = sampler;
		this.sources = sources;
	}

	Sampler.prototype.run = function (sink, scheduler) {
		var l = this.sources.length;
		var disposables = new Array(l + 1);
		var sinks = new Array(l);

		var sampleSink = new SampleSink(this.f, sinks, sink);

		for (var hold, i = 0; i < l; ++i) {
			hold = sinks[i] = new Hold(sampleSink);
			disposables[i] = this.sources[i].run(hold, scheduler);
		}

		disposables[i] = this.sampler.run(sampleSink, scheduler);

		return dispose.all(disposables);
	};

	function Hold(sink) {
		this.sink = sink;
		this.hasValue = false;
	}

	Hold.prototype.event = function (t, x) {
		this.value = x;
		this.hasValue = true;
		this.sink._notify(this);
	};

	Hold.prototype.end = function () {};
	Hold.prototype.error = Pipe.prototype.error;

	function SampleSink(f, sinks, sink) {
		this.f = f;
		this.sinks = sinks;
		this.sink = sink;
		this.active = false;
	}

	SampleSink.prototype._notify = function () {
		if (!this.active) {
			this.active = this.sinks.every(hasValue);
		}
	};

	SampleSink.prototype.event = function (t) {
		if (this.active) {
			this.sink.event(t, invoke(this.f, base.map(getValue, this.sinks)));
		}
	};

	SampleSink.prototype.end = Pipe.prototype.end;
	SampleSink.prototype.error = Pipe.prototype.error;

	function hasValue(hold) {
		return hold.hasValue;
	}

	function getValue(hold) {
		return hold.value;
	}

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Stream = __webpack_require__(0);
	var Sink = __webpack_require__(1);
	var core = __webpack_require__(7);
	var dispose = __webpack_require__(2);
	var Map = __webpack_require__(30);

	exports.take = take;
	exports.skip = skip;
	exports.slice = slice;
	exports.takeWhile = takeWhile;
	exports.skipWhile = skipWhile;

	/**
	 * @param {number} n
	 * @param {Stream} stream
	 * @returns {Stream} new stream containing only up to the first n items from stream
	 */
	function take(n, stream) {
		return slice(0, n, stream);
	}

	/**
	 * @param {number} n
	 * @param {Stream} stream
	 * @returns {Stream} new stream with the first n items removed
	 */
	function skip(n, stream) {
		return slice(n, Infinity, stream);
	}

	/**
	 * Slice a stream by index. Negative start/end indexes are not supported
	 * @param {number} start
	 * @param {number} end
	 * @param {Stream} stream
	 * @returns {Stream} stream containing items where start <= index < end
	 */
	function slice(start, end, stream) {
		return end <= start ? core.empty() : new Stream(sliceSource(start, end, stream.source));
	}

	function sliceSource(start, end, source) {
		return source instanceof Map ? commuteMapSlice(start, end, source) : source instanceof Slice ? fuseSlice(start, end, source) : new Slice(start, end, source);
	}

	function commuteMapSlice(start, end, source) {
		return Map.create(source.f, sliceSource(start, end, source.source));
	}

	function fuseSlice(start, end, source) {
		start += source.min;
		end = Math.min(end + source.min, source.max);
		return new Slice(start, end, source.source);
	}

	function Slice(min, max, source) {
		this.source = source;
		this.min = min;
		this.max = max;
	}

	Slice.prototype.run = function (sink, scheduler) {
		return new SliceSink(this.min, this.max - this.min, this.source, sink, scheduler);
	};

	function SliceSink(skip, take, source, sink, scheduler) {
		this.sink = sink;
		this.skip = skip;
		this.take = take;
		this.disposable = dispose.once(source.run(this, scheduler));
	}

	SliceSink.prototype.end = Sink.prototype.end;
	SliceSink.prototype.error = Sink.prototype.error;

	SliceSink.prototype.event = function (t, x) {
		if (this.skip > 0) {
			this.skip -= 1;
			return;
		}

		if (this.take === 0) {
			return;
		}

		this.take -= 1;
		this.sink.event(t, x);
		if (this.take === 0) {
			this.dispose();
			this.sink.end(t, x);
		}
	};

	SliceSink.prototype.dispose = function () {
		return this.disposable.dispose();
	};

	function takeWhile(p, stream) {
		return new Stream(new TakeWhile(p, stream.source));
	}

	function TakeWhile(p, source) {
		this.p = p;
		this.source = source;
	}

	TakeWhile.prototype.run = function (sink, scheduler) {
		return new TakeWhileSink(this.p, this.source, sink, scheduler);
	};

	function TakeWhileSink(p, source, sink, scheduler) {
		this.p = p;
		this.sink = sink;
		this.active = true;
		this.disposable = dispose.once(source.run(this, scheduler));
	}

	TakeWhileSink.prototype.end = Sink.prototype.end;
	TakeWhileSink.prototype.error = Sink.prototype.error;

	TakeWhileSink.prototype.event = function (t, x) {
		if (!this.active) {
			return;
		}

		var p = this.p;
		this.active = p(x);
		if (this.active) {
			this.sink.event(t, x);
		} else {
			this.dispose();
			this.sink.end(t, x);
		}
	};

	TakeWhileSink.prototype.dispose = function () {
		return this.disposable.dispose();
	};

	function skipWhile(p, stream) {
		return new Stream(new SkipWhile(p, stream.source));
	}

	function SkipWhile(p, source) {
		this.p = p;
		this.source = source;
	}

	SkipWhile.prototype.run = function (sink, scheduler) {
		return this.source.run(new SkipWhileSink(this.p, sink), scheduler);
	};

	function SkipWhileSink(p, sink) {
		this.p = p;
		this.sink = sink;
		this.skipping = true;
	}

	SkipWhileSink.prototype.end = Sink.prototype.end;
	SkipWhileSink.prototype.error = Sink.prototype.error;

	SkipWhileSink.prototype.event = function (t, x) {
		if (this.skipping) {
			var p = this.p;
			this.skipping = p(x);
			if (this.skipping) {
				return;
			}
		}

		this.sink.event(t, x);
	};

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Stream = __webpack_require__(0);
	var dispose = __webpack_require__(2);

	exports.switch = switchLatest;

	/**
	 * Given a stream of streams, return a new stream that adopts the behavior
	 * of the most recent inner stream.
	 * @param {Stream} stream of streams on which to switch
	 * @returns {Stream} switching stream
	 */
	function switchLatest(stream) {
		return new Stream(new Switch(stream.source));
	}

	function Switch(source) {
		this.source = source;
	}

	Switch.prototype.run = function (sink, scheduler) {
		var switchSink = new SwitchSink(sink, scheduler);
		return dispose.all(switchSink, this.source.run(switchSink, scheduler));
	};

	function SwitchSink(sink, scheduler) {
		this.sink = sink;
		this.scheduler = scheduler;
		this.current = null;
		this.ended = false;
	}

	SwitchSink.prototype.event = function (t, stream) {
		this._disposeCurrent(t); // TODO: capture the result of this dispose
		this.current = new Segment(t, Infinity, this, this.sink);
		this.current.disposable = stream.source.run(this.current, this.scheduler);
	};

	SwitchSink.prototype.end = function (t, x) {
		this.ended = true;
		this._checkEnd(t, x);
	};

	SwitchSink.prototype.error = function (t, e) {
		this.ended = true;
		this.sink.error(t, e);
	};

	SwitchSink.prototype.dispose = function () {
		return this._disposeCurrent(0);
	};

	SwitchSink.prototype._disposeCurrent = function (t) {
		if (this.current !== null) {
			return this.current._dispose(t);
		}
	};

	SwitchSink.prototype._disposeInner = function (t, inner) {
		inner._dispose(t); // TODO: capture the result of this dispose
		if (inner === this.current) {
			this.current = null;
		}
	};

	SwitchSink.prototype._checkEnd = function (t, x) {
		if (this.ended && this.current === null) {
			this.sink.end(t, x);
		}
	};

	SwitchSink.prototype._endInner = function (t, x, inner) {
		this._disposeInner(t, inner);
		this._checkEnd(t, x);
	};

	SwitchSink.prototype._errorInner = function (t, e, inner) {
		this._disposeInner(t, inner);
		this.sink.error(t, e);
	};

	function Segment(min, max, outer, sink) {
		this.min = min;
		this.max = max;
		this.outer = outer;
		this.sink = sink;
		this.disposable = dispose.empty();
	}

	Segment.prototype.event = function (t, x) {
		if (t < this.max) {
			this.sink.event(Math.max(t, this.min), x);
		}
	};

	Segment.prototype.end = function (t, x) {
		this.outer._endInner(Math.max(t, this.min), x, this);
	};

	Segment.prototype.error = function (t, e) {
		this.outer._errorInner(Math.max(t, this.min), e, this);
	};

	Segment.prototype._dispose = function (t) {
		this.max = t;
		dispose.tryDispose(t, this.disposable, this.sink);
	};

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Stream = __webpack_require__(0);
	var Pipe = __webpack_require__(1);
	var dispose = __webpack_require__(2);
	var join = __webpack_require__(26).join;

	exports.during = during;
	exports.takeUntil = takeUntil;
	exports.skipUntil = skipUntil;

	function takeUntil(signal, stream) {
		return new Stream(new Until(signal.source, stream.source));
	}

	function skipUntil(signal, stream) {
		return new Stream(new Since(signal.source, stream.source));
	}

	function during(timeWindow, stream) {
		return takeUntil(join(timeWindow), skipUntil(timeWindow, stream));
	}

	function Until(maxSignal, source) {
		this.maxSignal = maxSignal;
		this.source = source;
	}

	Until.prototype.run = function (sink, scheduler) {
		var min = new Bound(-Infinity, sink);
		var max = new UpperBound(this.maxSignal, sink, scheduler);
		var disposable = this.source.run(new TimeWindowSink(min, max, sink), scheduler);

		return dispose.all([min, max, disposable]);
	};

	function Since(minSignal, source) {
		this.minSignal = minSignal;
		this.source = source;
	}

	Since.prototype.run = function (sink, scheduler) {
		var min = new LowerBound(this.minSignal, sink, scheduler);
		var max = new Bound(Infinity, sink);
		var disposable = this.source.run(new TimeWindowSink(min, max, sink), scheduler);

		return dispose.all([min, max, disposable]);
	};

	function Bound(value, sink) {
		this.value = value;
		this.sink = sink;
	}

	Bound.prototype.error = Pipe.prototype.error;
	Bound.prototype.event = noop;
	Bound.prototype.end = noop;
	Bound.prototype.dispose = noop;

	function TimeWindowSink(min, max, sink) {
		this.min = min;
		this.max = max;
		this.sink = sink;
	}

	TimeWindowSink.prototype.event = function (t, x) {
		if (t >= this.min.value && t < this.max.value) {
			this.sink.event(t, x);
		}
	};

	TimeWindowSink.prototype.error = Pipe.prototype.error;
	TimeWindowSink.prototype.end = Pipe.prototype.end;

	function LowerBound(signal, sink, scheduler) {
		this.value = Infinity;
		this.sink = sink;
		this.disposable = signal.run(this, scheduler);
	}

	LowerBound.prototype.event = function (t /*, x */) {
		if (t < this.value) {
			this.value = t;
		}
	};

	LowerBound.prototype.end = noop;
	LowerBound.prototype.error = Pipe.prototype.error;

	LowerBound.prototype.dispose = function () {
		return this.disposable.dispose();
	};

	function UpperBound(signal, sink, scheduler) {
		this.value = Infinity;
		this.sink = sink;
		this.disposable = signal.run(this, scheduler);
	}

	UpperBound.prototype.event = function (t, x) {
		if (t < this.value) {
			this.value = t;
			this.sink.end(t, x);
		}
	};

	UpperBound.prototype.end = noop;
	UpperBound.prototype.error = Pipe.prototype.error;

	UpperBound.prototype.dispose = function () {
		return this.disposable.dispose();
	};

	function noop() {}

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Stream = __webpack_require__(0);
	var Sink = __webpack_require__(1);

	exports.timestamp = timestamp;

	function timestamp(stream) {
		return new Stream(new Timestamp(stream.source));
	}

	function Timestamp(source) {
		this.source = source;
	}

	Timestamp.prototype.run = function (sink, scheduler) {
		return this.source.run(new TimestampSink(sink), scheduler);
	};

	function TimestampSink(sink) {
		this.sink = sink;
	}

	TimestampSink.prototype.end = Sink.prototype.end;
	TimestampSink.prototype.error = Sink.prototype.error;

	TimestampSink.prototype.event = function (t, x) {
		this.sink.event(t, { time: t, value: x });
	};

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Stream = __webpack_require__(0);

	exports.transduce = transduce;

	/**
	 * Transform a stream by passing its events through a transducer.
	 * @param  {function} transducer transducer function
	 * @param  {Stream} stream stream whose events will be passed through the
	 *  transducer
	 * @return {Stream} stream of events transformed by the transducer
	 */
	function transduce(transducer, stream) {
		return new Stream(new Transduce(transducer, stream.source));
	}

	function Transduce(transducer, source) {
		this.transducer = transducer;
		this.source = source;
	}

	Transduce.prototype.run = function (sink, scheduler) {
		var xf = this.transducer(new Transformer(sink));
		return this.source.run(new TransduceSink(getTxHandler(xf), sink), scheduler);
	};

	function TransduceSink(adapter, sink) {
		this.xf = adapter;
		this.sink = sink;
	}

	TransduceSink.prototype.event = function (t, x) {
		var next = this.xf.step(t, x);

		return this.xf.isReduced(next) ? this.sink.end(t, this.xf.getResult(next)) : next;
	};

	TransduceSink.prototype.end = function (t, x) {
		return this.xf.result(x);
	};

	TransduceSink.prototype.error = function (t, e) {
		return this.sink.error(t, e);
	};

	function Transformer(sink) {
		this.time = -Infinity;
		this.sink = sink;
	}

	Transformer.prototype['@@transducer/init'] = Transformer.prototype.init = function () {};

	Transformer.prototype['@@transducer/step'] = Transformer.prototype.step = function (t, x) {
		if (!isNaN(t)) {
			this.time = Math.max(t, this.time);
		}
		return this.sink.event(this.time, x);
	};

	Transformer.prototype['@@transducer/result'] = Transformer.prototype.result = function (x) {
		return this.sink.end(this.time, x);
	};

	/**
	 * Given an object supporting the new or legacy transducer protocol,
	 * create an adapter for it.
	 * @param {object} tx transform
	 * @returns {TxAdapter|LegacyTxAdapter}
	 */
	function getTxHandler(tx) {
		return typeof tx['@@transducer/step'] === 'function' ? new TxAdapter(tx) : new LegacyTxAdapter(tx);
	}

	/**
	 * Adapter for new official transducer protocol
	 * @param {object} tx transform
	 * @constructor
	 */
	function TxAdapter(tx) {
		this.tx = tx;
	}

	TxAdapter.prototype.step = function (t, x) {
		return this.tx['@@transducer/step'](t, x);
	};
	TxAdapter.prototype.result = function (x) {
		return this.tx['@@transducer/result'](x);
	};
	TxAdapter.prototype.isReduced = function (x) {
		return x != null && x['@@transducer/reduced'];
	};
	TxAdapter.prototype.getResult = function (x) {
		return x['@@transducer/value'];
	};

	/**
	 * Adapter for older transducer protocol
	 * @param {object} tx transform
	 * @constructor
	 */
	function LegacyTxAdapter(tx) {
		this.tx = tx;
	}

	LegacyTxAdapter.prototype.step = function (t, x) {
		return this.tx.step(t, x);
	};
	LegacyTxAdapter.prototype.result = function (x) {
		return this.tx.result(x);
	};
	LegacyTxAdapter.prototype.isReduced = function (x) {
		return x != null && x.__transducers_reduced__;
	};
	LegacyTxAdapter.prototype.getResult = function (x) {
		return x.value;
	};

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Stream = __webpack_require__(0);
	var transform = __webpack_require__(12);
	var core = __webpack_require__(7);
	var Sink = __webpack_require__(1);
	var IndexSink = __webpack_require__(14);
	var dispose = __webpack_require__(2);
	var base = __webpack_require__(3);
	var invoke = __webpack_require__(13);
	var Queue = __webpack_require__(54);

	var map = base.map;
	var tail = base.tail;

	exports.zip = zip;
	exports.zipArray = zipArray;

	/**
	 * Combine streams pairwise (or tuple-wise) by index by applying f to values
	 * at corresponding indices.  The returned stream ends when any of the input
	 * streams ends.
	 * @param {function} f function to combine values
	 * @returns {Stream} new stream with items at corresponding indices combined
	 *  using f
	 */
	function zip(f /*,...streams */) {
		return zipArray(f, tail(arguments));
	}

	/**
	 * Combine streams pairwise (or tuple-wise) by index by applying f to values
	 * at corresponding indices.  The returned stream ends when any of the input
	 * streams ends.
	 * @param {function} f function to combine values
	 * @param {[Stream]} streams streams to zip using f
	 * @returns {Stream} new stream with items at corresponding indices combined
	 *  using f
	 */
	function zipArray(f, streams) {
		return streams.length === 0 ? core.empty() : streams.length === 1 ? transform.map(f, streams[0]) : new Stream(new Zip(f, map(getSource, streams)));
	}

	function getSource(stream) {
		return stream.source;
	}

	function Zip(f, sources) {
		this.f = f;
		this.sources = sources;
	}

	Zip.prototype.run = function (sink, scheduler) {
		var l = this.sources.length;
		var disposables = new Array(l);
		var sinks = new Array(l);
		var buffers = new Array(l);

		var zipSink = new ZipSink(this.f, buffers, sinks, sink);

		for (var indexSink, i = 0; i < l; ++i) {
			buffers[i] = new Queue();
			indexSink = sinks[i] = new IndexSink(i, zipSink);
			disposables[i] = this.sources[i].run(indexSink, scheduler);
		}

		return dispose.all(disposables);
	};

	function ZipSink(f, buffers, sinks, sink) {
		this.f = f;
		this.sinks = sinks;
		this.sink = sink;
		this.buffers = buffers;
	}

	ZipSink.prototype.event = function (t, indexedValue) {
		var buffers = this.buffers;
		var buffer = buffers[indexedValue.index];

		buffer.push(indexedValue.value);

		if (buffer.length() === 1) {
			if (!ready(this.buffers)) {
				return;
			}

			emitZipped(this.f, t, buffers, this.sink);

			if (ended(this.buffers, this.sinks)) {
				this.sink.end(t, void 0);
			}
		}
	};

	ZipSink.prototype.end = function (t, indexedValue) {
		var buffer = this.buffers[indexedValue.index];
		if (buffer.isEmpty()) {
			this.sink.end(t, indexedValue.value);
		}
	};

	ZipSink.prototype.error = Sink.prototype.error;

	function emitZipped(f, t, buffers, sink) {
		sink.event(t, invoke(f, map(head, buffers)));
	}

	function head(buffer) {
		return buffer.shift();
	}

	function ended(buffers, sinks) {
		for (var i = 0, l = buffers.length; i < l; ++i) {
			if (buffers[i].isEmpty() && !sinks[i].active) {
				return true;
			}
		}
		return false;
	}

	function ready(buffers) {
		for (var i = 0, l = buffers.length; i < l; ++i) {
			if (buffers[i].isEmpty()) {
				return false;
			}
		}
		return true;
	}

/***/ },
/* 73 */
/***/ function(module, exports) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	module.exports = Disposable;

	/**
	 * Create a new Disposable which will dispose its underlying resource.
	 * @param {function} dispose function
	 * @param {*?} data any data to be passed to disposer function
	 * @constructor
	 */
	function Disposable(dispose, data) {
	  this._dispose = dispose;
	  this._data = data;
	}

	Disposable.prototype.dispose = function () {
	  return this._dispose(this._data);
	};

/***/ },
/* 74 */
/***/ function(module, exports) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	module.exports = SettableDisposable;

	function SettableDisposable() {
		this.disposable = void 0;
		this.disposed = false;
		this._resolve = void 0;

		var self = this;
		this.result = new Promise(function (resolve) {
			self._resolve = resolve;
		});
	}

	SettableDisposable.prototype.setDisposable = function (disposable) {
		if (this.disposable !== void 0) {
			throw new Error('setDisposable called more than once');
		}

		this.disposable = disposable;

		if (this.disposed) {
			this._resolve(disposable.dispose());
		}
	};

	SettableDisposable.prototype.dispose = function () {
		if (this.disposed) {
			return this.result;
		}

		this.disposed = true;

		if (this.disposable !== void 0) {
			this.result = this.disposable.dispose();
		}

		return this.result;
	};

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Pipe = __webpack_require__(1);

	module.exports = FilterMap;

	function FilterMap(p, f, source) {
		this.p = p;
		this.f = f;
		this.source = source;
	}

	FilterMap.prototype.run = function (sink, scheduler) {
		return this.source.run(new FilterMapSink(this.p, this.f, sink), scheduler);
	};

	function FilterMapSink(p, f, sink) {
		this.p = p;
		this.f = f;
		this.sink = sink;
	}

	FilterMapSink.prototype.event = function (t, x) {
		var f = this.f;
		var p = this.p;
		p(x) && this.sink.event(t, f(x));
	};

	FilterMapSink.prototype.end = Pipe.prototype.end;
	FilterMapSink.prototype.error = Pipe.prototype.error;

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var base = __webpack_require__(3);

	module.exports = Scheduler;

	function ScheduledTask(delay, period, task, scheduler) {
		this.time = delay;
		this.period = period;
		this.task = task;
		this.scheduler = scheduler;
		this.active = true;
	}

	ScheduledTask.prototype.run = function () {
		return this.task.run(this.time);
	};

	ScheduledTask.prototype.error = function (e) {
		return this.task.error(this.time, e);
	};

	ScheduledTask.prototype.cancel = function () {
		this.scheduler.cancel(this);
		return this.task.dispose();
	};

	function runTask(task) {
		try {
			return task.run();
		} catch (e) {
			return task.error(e);
		}
	}

	function Scheduler(timer) {
		this.timer = timer;

		this._timer = null;
		this._nextArrival = 0;
		this._tasks = [];

		var self = this;
		this._runReadyTasksBound = function () {
			self._runReadyTasks(self.now());
		};
	}

	Scheduler.prototype.now = function () {
		return this.timer.now();
	};

	Scheduler.prototype.asap = function (task) {
		return this.schedule(0, -1, task);
	};

	Scheduler.prototype.delay = function (delay, task) {
		return this.schedule(delay, -1, task);
	};

	Scheduler.prototype.periodic = function (period, task) {
		return this.schedule(0, period, task);
	};

	Scheduler.prototype.schedule = function (delay, period, task) {
		var now = this.now();
		var st = new ScheduledTask(now + Math.max(0, delay), period, task, this);

		insertByTime(st, this._tasks);
		this._scheduleNextRun(now);
		return st;
	};

	Scheduler.prototype.cancel = function (task) {
		task.active = false;
		var i = binarySearch(task.time, this._tasks);

		if (i >= 0 && i < this._tasks.length) {
			var at = base.findIndex(task, this._tasks[i].events);
			if (at >= 0) {
				this._tasks[i].events.splice(at, 1);
				this._reschedule();
			}
		}
	};

	Scheduler.prototype.cancelAll = function (f) {
		for (var i = 0; i < this._tasks.length; ++i) {
			removeAllFrom(f, this._tasks[i]);
		}
		this._reschedule();
	};

	function removeAllFrom(f, timeslot) {
		timeslot.events = base.removeAll(f, timeslot.events);
	}

	Scheduler.prototype._reschedule = function () {
		if (this._tasks.length === 0) {
			this._unschedule();
		} else {
			this._scheduleNextRun(this.now());
		}
	};

	Scheduler.prototype._unschedule = function () {
		this.timer.clearTimer(this._timer);
		this._timer = null;
	};

	Scheduler.prototype._scheduleNextRun = function (now) {
		if (this._tasks.length === 0) {
			return;
		}

		var nextArrival = this._tasks[0].time;

		if (this._timer === null) {
			this._scheduleNextArrival(nextArrival, now);
		} else if (nextArrival < this._nextArrival) {
			this._unschedule();
			this._scheduleNextArrival(nextArrival, now);
		}
	};

	Scheduler.prototype._scheduleNextArrival = function (nextArrival, now) {
		this._nextArrival = nextArrival;
		var delay = Math.max(0, nextArrival - now);
		this._timer = this.timer.setTimer(this._runReadyTasksBound, delay);
	};

	Scheduler.prototype._runReadyTasks = function (now) {
		this._timer = null;

		this._tasks = this._findAndRunTasks(now);

		this._scheduleNextRun(this.now());
	};

	Scheduler.prototype._findAndRunTasks = function (now) {
		var tasks = this._tasks;
		var l = tasks.length;
		var i = 0;

		while (i < l && tasks[i].time <= now) {
			++i;
		}

		this._tasks = tasks.slice(i);

		// Run all ready tasks
		for (var j = 0; j < i; ++j) {
			this._tasks = runTasks(tasks[j], this._tasks);
		}
		return this._tasks;
	};

	function runTasks(timeslot, tasks) {
		var events = timeslot.events;
		for (var i = 0; i < events.length; ++i) {
			var task = events[i];

			if (task.active) {
				runTask(task);

				// Reschedule periodic repeating tasks
				// Check active again, since a task may have canceled itself
				if (task.period >= 0) {
					task.time = task.time + task.period;
					insertByTime(task, tasks);
				}
			}
		}

		return tasks;
	}

	function insertByTime(task, timeslots) {
		var l = timeslots.length;

		if (l === 0) {
			timeslots.push(newTimeslot(task.time, [task]));
			return;
		}

		var i = binarySearch(task.time, timeslots);

		if (i >= l) {
			timeslots.push(newTimeslot(task.time, [task]));
		} else if (task.time === timeslots[i].time) {
			timeslots[i].events.push(task);
		} else {
			timeslots.splice(i, 0, newTimeslot(task.time, [task]));
		}
	}

	function binarySearch(t, sortedArray) {
		var lo = 0;
		var hi = sortedArray.length;
		var mid, y;

		while (lo < hi) {
			mid = Math.floor((lo + hi) / 2);
			y = sortedArray[mid];

			if (t === y.time) {
				return mid;
			} else if (t < y.time) {
				hi = mid;
			} else {
				lo = mid + 1;
			}
		}
		return hi;
	}

	function newTimeslot(t, events) {
		return { time: t, events: events };
	}

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Scheduler = __webpack_require__(76);
	var setTimeoutTimer = __webpack_require__(79);
	var nodeTimer = __webpack_require__(78);

	var isNode = typeof process === 'object' && typeof process.nextTick === 'function';

	module.exports = new Scheduler(isNode ? nodeTimer : setTimeoutTimer);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(17)))

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var defer = __webpack_require__(27);

	/*global setTimeout, clearTimeout*/

	function Task(f) {
		this.f = f;
		this.active = true;
	}

	Task.prototype.run = function () {
		if (!this.active) {
			return;
		}
		var f = this.f;
		return f();
	};

	Task.prototype.error = function (e) {
		throw e;
	};

	Task.prototype.cancel = function () {
		this.active = false;
	};

	function runAsTask(f) {
		var task = new Task(f);
		defer(task);
		return task;
	}

	module.exports = {
		now: Date.now,
		setTimer: function (f, dt) {
			return dt <= 0 ? runAsTask(f) : setTimeout(f, dt);
		},
		clearTimer: function (t) {
			return t instanceof Task ? t.cancel() : clearTimeout(t);
		}
	};

/***/ },
/* 79 */
/***/ function(module, exports) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	/*global setTimeout, clearTimeout*/

	module.exports = {
		now: Date.now,
		setTimer: function (f, dt) {
			return setTimeout(f, dt);
		},
		clearTimer: function (t) {
			return clearTimeout(t);
		}
	};

/***/ },
/* 80 */
/***/ function(module, exports) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	module.exports = Observer;

	/**
	 * Sink that accepts functions to apply to each event, and to end, and error
	 * signals.
	 * @constructor
	 */
	function Observer(event, end, error, disposable) {
		this._event = event;
		this._end = end;
		this._error = error;
		this._disposable = disposable;
		this.active = true;
	}

	Observer.prototype.event = function (t, x) {
		if (!this.active) {
			return;
		}
		this._event(x);
	};

	Observer.prototype.end = function (t, x) {
		if (!this.active) {
			return;
		}
		this.active = false;
		disposeThen(this._end, this._error, this._disposable, x);
	};

	Observer.prototype.error = function (t, e) {
		this.active = false;
		disposeThen(this._error, this._error, this._disposable, e);
	};

	function disposeThen(end, error, disposable, x) {
		Promise.resolve(disposable.dispose()).then(function () {
			end(x);
		}, error);
	}

/***/ },
/* 81 */
/***/ function(module, exports) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	module.exports = SafeSink;

	function SafeSink(sink) {
		this.sink = sink;
		this.active = true;
	}

	SafeSink.prototype.event = function (t, x) {
		if (!this.active) {
			return;
		}
		this.sink.event(t, x);
	};

	SafeSink.prototype.end = function (t, x) {
		if (!this.active) {
			return;
		}
		this.disable();
		this.sink.end(t, x);
	};

	SafeSink.prototype.error = function (t, e) {
		this.disable();
		this.sink.error(t, e);
	};

	SafeSink.prototype.disable = function () {
		this.active = false;
		return this.sink;
	};

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var DeferredSink = __webpack_require__(33);
	var dispose = __webpack_require__(2);
	var tryEvent = __webpack_require__(9);

	module.exports = EventEmitterSource;

	function EventEmitterSource(event, source) {
		this.event = event;
		this.source = source;
	}

	EventEmitterSource.prototype.run = function (sink, scheduler) {
		// NOTE: Because EventEmitter allows events in the same call stack as
		// a listener is added, use a DeferredSink to buffer events
		// until the stack clears, then propagate.  This maintains most.js's
		// invariant that no event will be delivered in the same call stack
		// as an observer begins observing.
		var dsink = new DeferredSink(sink);

		function addEventVariadic(a) {
			var l = arguments.length;
			if (l > 1) {
				var arr = new Array(l);
				for (var i = 0; i < l; ++i) {
					arr[i] = arguments[i];
				}
				tryEvent.tryEvent(scheduler.now(), arr, dsink);
			} else {
				tryEvent.tryEvent(scheduler.now(), a, dsink);
			}
		}

		this.source.addListener(this.event, addEventVariadic);

		return dispose.create(disposeEventEmitter, { target: this, addEvent: addEventVariadic });
	};

	function disposeEventEmitter(info) {
		var target = info.target;
		target.source.removeListener(target.event, info.addEvent);
	}

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var dispose = __webpack_require__(2);
	var tryEvent = __webpack_require__(9);

	module.exports = EventTargetSource;

	function EventTargetSource(event, source, capture) {
		this.event = event;
		this.source = source;
		this.capture = capture;
	}

	EventTargetSource.prototype.run = function (sink, scheduler) {
		function addEvent(e) {
			tryEvent.tryEvent(scheduler.now(), e, sink);
		}

		this.source.addEventListener(this.event, addEvent, this.capture);

		return dispose.create(disposeEventTarget, { target: this, addEvent: addEvent });
	};

	function disposeEventTarget(info) {
		var target = info.target;
		target.source.removeEventListener(target.event, info.addEvent, target.capture);
	}

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Stream = __webpack_require__(0);
	var MulticastSource = __webpack_require__(5).MulticastSource;
	var DeferredSink = __webpack_require__(33);
	var tryEvent = __webpack_require__(9);

	exports.create = create;

	function create(run) {
		return new Stream(new MulticastSource(new SubscriberSource(run)));
	}

	function SubscriberSource(subscribe) {
		this._subscribe = subscribe;
	}

	SubscriberSource.prototype.run = function (sink, scheduler) {
		return new Subscription(new DeferredSink(sink), scheduler, this._subscribe);
	};

	function Subscription(sink, scheduler, subscribe) {
		this.sink = sink;
		this.scheduler = scheduler;
		this.active = true;
		this._unsubscribe = this._init(subscribe);
	}

	Subscription.prototype._init = function (subscribe) {
		var s = this;

		try {
			return subscribe(add, end, error);
		} catch (e) {
			error(e);
		}

		function add(x) {
			s._add(x);
		}
		function end(x) {
			s._end(x);
		}
		function error(e) {
			s._error(e);
		}
	};

	Subscription.prototype._add = function (x) {
		if (!this.active) {
			return;
		}
		tryEvent.tryEvent(this.scheduler.now(), x, this.sink);
	};

	Subscription.prototype._end = function (x) {
		if (!this.active) {
			return;
		}
		this.active = false;
		tryEvent.tryEnd(this.scheduler.now(), x, this.sink);
	};

	Subscription.prototype._error = function (x) {
		this.active = false;
		this.sink.error(this.scheduler.now(), x);
	};

	Subscription.prototype.dispose = function () {
		this.active = false;
		if (typeof this._unsubscribe === 'function') {
			return this._unsubscribe.call(void 0);
		}
	};

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var fromArray = __webpack_require__(86).fromArray;
	var isIterable = __webpack_require__(31).isIterable;
	var fromIterable = __webpack_require__(88).fromIterable;
	var isArrayLike = __webpack_require__(3).isArrayLike;

	exports.from = from;

	function from(a) {
		if (Array.isArray(a) || isArrayLike(a)) {
			return fromArray(a);
		}

		if (isIterable(a)) {
			return fromIterable(a);
		}

		throw new TypeError('not iterable: ' + a);
	}

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Stream = __webpack_require__(0);
	var PropagateTask = __webpack_require__(6);

	exports.fromArray = fromArray;

	function fromArray(a) {
		return new Stream(new ArraySource(a));
	}

	function ArraySource(a) {
		this.array = a;
	}

	ArraySource.prototype.run = function (sink, scheduler) {
		return new ArrayProducer(this.array, sink, scheduler);
	};

	function ArrayProducer(array, sink, scheduler) {
		this.scheduler = scheduler;
		this.task = new PropagateTask(runProducer, array, sink);
		scheduler.asap(this.task);
	}

	ArrayProducer.prototype.dispose = function () {
		return this.task.dispose();
	};

	function runProducer(t, array, sink) {
		produce(this, array, sink);
	}

	function produce(task, array, sink) {
		for (var i = 0, l = array.length; i < l && task.active; ++i) {
			sink.event(0, array[i]);
		}

		task.active && end();

		function end() {
			sink.end(0);
		}
	}

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Stream = __webpack_require__(0);
	var MulticastSource = __webpack_require__(5).MulticastSource;
	var EventTargetSource = __webpack_require__(83);
	var EventEmitterSource = __webpack_require__(82);

	exports.fromEvent = fromEvent;

	/**
	 * Create a stream from an EventTarget, such as a DOM Node, or EventEmitter.
	 * @param {String} event event type name, e.g. 'click'
	 * @param {EventTarget|EventEmitter} source EventTarget or EventEmitter
	 * @param {boolean?} useCapture for DOM events, whether to use
	 *  capturing--passed as 3rd parameter to addEventListener.
	 * @returns {Stream} stream containing all events of the specified type
	 * from the source.
	 */
	function fromEvent(event, source /*, useCapture = false */) {
		var s;

		if (typeof source.addEventListener === 'function' && typeof source.removeEventListener === 'function') {
			var capture = arguments.length > 2 && !!arguments[2];
			s = new MulticastSource(new EventTargetSource(event, source, capture));
		} else if (typeof source.addListener === 'function' && typeof source.removeListener === 'function') {
			s = new EventEmitterSource(event, source);
		} else {
			throw new Error('source must support addEventListener/removeEventListener or addListener/removeListener');
		}

		return new Stream(s);
	}

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Stream = __webpack_require__(0);
	var getIterator = __webpack_require__(31).getIterator;
	var PropagateTask = __webpack_require__(6);

	exports.fromIterable = fromIterable;

	function fromIterable(iterable) {
		return new Stream(new IterableSource(iterable));
	}

	function IterableSource(iterable) {
		this.iterable = iterable;
	}

	IterableSource.prototype.run = function (sink, scheduler) {
		return new IteratorProducer(getIterator(this.iterable), sink, scheduler);
	};

	function IteratorProducer(iterator, sink, scheduler) {
		this.scheduler = scheduler;
		this.iterator = iterator;
		this.task = new PropagateTask(runProducer, this, sink);
		scheduler.asap(this.task);
	}

	IteratorProducer.prototype.dispose = function () {
		return this.task.dispose();
	};

	function runProducer(t, producer, sink) {
		var x = producer.iterator.next();
		if (x.done) {
			sink.end(t, x.value);
		} else {
			sink.event(t, x.value);
		}

		producer.scheduler.asap(producer.task);
	}

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2014 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Stream = __webpack_require__(0);
	var base = __webpack_require__(3);

	exports.generate = generate;

	/**
	 * Compute a stream using an *async* generator, which yields promises
	 * to control event times.
	 * @param f
	 * @returns {Stream}
	 */
	function generate(f /*, ...args */) {
		return new Stream(new GenerateSource(f, base.tail(arguments)));
	}

	function GenerateSource(f, args) {
		this.f = f;
		this.args = args;
	}

	GenerateSource.prototype.run = function (sink, scheduler) {
		return new Generate(this.f.apply(void 0, this.args), sink, scheduler);
	};

	function Generate(iterator, sink, scheduler) {
		this.iterator = iterator;
		this.sink = sink;
		this.scheduler = scheduler;
		this.active = true;

		var self = this;
		function err(e) {
			self.sink.error(self.scheduler.now(), e);
		}

		Promise.resolve(this).then(next).catch(err);
	}

	function next(generate, x) {
		return generate.active ? handle(generate, generate.iterator.next(x)) : x;
	}

	function handle(generate, result) {
		if (result.done) {
			return generate.sink.end(generate.scheduler.now(), result.value);
		}

		return Promise.resolve(result.value).then(function (x) {
			return emit(generate, x);
		}, function (e) {
			return error(generate, e);
		});
	}

	function emit(generate, x) {
		generate.sink.event(generate.scheduler.now(), x);
		return next(generate, x);
	}

	function error(generate, e) {
		return handle(generate, generate.iterator.throw(e));
	}

	Generate.prototype.dispose = function () {
		this.active = false;
	};

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Stream = __webpack_require__(0);

	exports.iterate = iterate;

	/**
	 * Compute a stream by iteratively calling f to produce values
	 * Event times may be controlled by returning a Promise from f
	 * @param {function(x:*):*|Promise<*>} f
	 * @param {*} x initial value
	 * @returns {Stream}
	 */
	function iterate(f, x) {
		return new Stream(new IterateSource(f, x));
	}

	function IterateSource(f, x) {
		this.f = f;
		this.value = x;
	}

	IterateSource.prototype.run = function (sink, scheduler) {
		return new Iterate(this.f, this.value, sink, scheduler);
	};

	function Iterate(f, initial, sink, scheduler) {
		this.f = f;
		this.sink = sink;
		this.scheduler = scheduler;
		this.active = true;

		var x = initial;

		var self = this;
		function err(e) {
			self.sink.error(self.scheduler.now(), e);
		}

		function start(iterate) {
			return stepIterate(iterate, x);
		}

		Promise.resolve(this).then(start).catch(err);
	}

	Iterate.prototype.dispose = function () {
		this.active = false;
	};

	function stepIterate(iterate, x) {
		iterate.sink.event(iterate.scheduler.now(), x);

		if (!iterate.active) {
			return x;
		}

		var f = iterate.f;
		return Promise.resolve(f(x)).then(function (y) {
			return continueIterate(iterate, y);
		});
	}

	function continueIterate(iterate, x) {
		return !iterate.active ? iterate.value : stepIterate(iterate, x);
	}

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Stream = __webpack_require__(0);
	var dispose = __webpack_require__(2);
	var MulticastSource = __webpack_require__(5).MulticastSource;
	var PropagateTask = __webpack_require__(6);

	exports.periodic = periodic;

	/**
	 * Create a stream that emits the current time periodically
	 * @param {Number} period periodicity of events in millis
	 * @param {*) value value to emit each period
	 * @returns {Stream} new stream that emits the current time every period
	 */
	function periodic(period, value) {
		return new Stream(new MulticastSource(new Periodic(period, value)));
	}

	function Periodic(period, value) {
		this.period = period;
		this.value = value;
	}

	Periodic.prototype.run = function (sink, scheduler) {
		var task = scheduler.periodic(this.period, new PropagateTask(emit, this.value, sink));
		return dispose.create(cancelTask, task);
	};

	function cancelTask(task) {
		task.cancel();
	}

	function emit(t, x, sink) {
		sink.event(t, x);
	}

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	/** @license MIT License (c) copyright 2010-2016 original author or authors */
	/** @author Brian Cavalier */
	/** @author John Hann */

	var Stream = __webpack_require__(0);

	exports.unfold = unfold;

	/**
	 * Compute a stream by unfolding tuples of future values from a seed value
	 * Event times may be controlled by returning a Promise from f
	 * @param {function(seed:*):{value:*, seed:*, done:boolean}|Promise<{value:*, seed:*, done:boolean}>} f unfolding function accepts
	 *  a seed and returns a new tuple with a value, new seed, and boolean done flag.
	 *  If tuple.done is true, the stream will end.
	 * @param {*} seed seed value
	 * @returns {Stream} stream containing all value of all tuples produced by the
	 *  unfolding function.
	 */
	function unfold(f, seed) {
		return new Stream(new UnfoldSource(f, seed));
	}

	function UnfoldSource(f, seed) {
		this.f = f;
		this.value = seed;
	}

	UnfoldSource.prototype.run = function (sink, scheduler) {
		return new Unfold(this.f, this.value, sink, scheduler);
	};

	function Unfold(f, x, sink, scheduler) {
		this.f = f;
		this.sink = sink;
		this.scheduler = scheduler;
		this.active = true;

		var self = this;
		function err(e) {
			self.sink.error(self.scheduler.now(), e);
		}

		function start(unfold) {
			return stepUnfold(unfold, x);
		}

		Promise.resolve(this).then(start).catch(err);
	}

	Unfold.prototype.dispose = function () {
		this.active = false;
	};

	function stepUnfold(unfold, x) {
		var f = unfold.f;
		return Promise.resolve(f(x)).then(function (tuple) {
			return continueUnfold(unfold, tuple);
		});
	}

	function continueUnfold(unfold, tuple) {
		if (tuple.done) {
			unfold.sink.end(unfold.scheduler.now(), tuple.value);
			return tuple.value;
		}

		unfold.sink.event(unfold.scheduler.now(), tuple.value);

		if (!unfold.active) {
			return tuple.value;
		}
		return stepUnfold(unfold, tuple.seed);
	}

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = classNameFromVNode;

	var _selectorParser2 = __webpack_require__(35);

	var _selectorParser3 = _interopRequireDefault(_selectorParser2);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	function classNameFromVNode(vNode) {
	  var _selectorParser = (0, _selectorParser3.default)(vNode.sel);

	  var cn = _selectorParser.className;

	  if (!vNode.data) {
	    return cn;
	  }

	  var _vNode$data = vNode.data;
	  var dataClass = _vNode$data.class;
	  var props = _vNode$data.props;

	  if (dataClass) {
	    var c = Object.keys(vNode.data.class).filter(function (cl) {
	      return vNode.data.class[cl];
	    });
	    cn += ' ' + c.join(' ');
	  }

	  if (props && props.className) {
	    cn += ' ' + props.className;
	  }

	  return cn.trim();
	}

/***/ },
/* 94 */
/***/ function(module, exports) {

	function createElement(tagName) {
	  return document.createElement(tagName);
	}

	function createElementNS(namespaceURI, qualifiedName) {
	  return document.createElementNS(namespaceURI, qualifiedName);
	}

	function createTextNode(text) {
	  return document.createTextNode(text);
	}

	function insertBefore(parentNode, newNode, referenceNode) {
	  parentNode.insertBefore(newNode, referenceNode);
	}

	function removeChild(node, child) {
	  node.removeChild(child);
	}

	function appendChild(node, child) {
	  node.appendChild(child);
	}

	function parentNode(node) {
	  return node.parentElement;
	}

	function nextSibling(node) {
	  return node.nextSibling;
	}

	function tagName(node) {
	  return node.tagName;
	}

	function setTextContent(node, text) {
	  node.textContent = text;
	}

	module.exports = {
	  createElement: createElement,
	  createElementNS: createElementNS,
	  createTextNode: createTextNode,
	  appendChild: appendChild,
	  removeChild: removeChild,
	  insertBefore: insertBefore,
	  parentNode: parentNode,
	  nextSibling: nextSibling,
	  tagName: tagName,
	  setTextContent: setTextContent
	};

/***/ },
/* 95 */
/***/ function(module, exports) {

	var booleanAttrs = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "compact", "controls", "declare", "default", "defaultchecked", "defaultmuted", "defaultselected", "defer", "disabled", "draggable", "enabled", "formnovalidate", "hidden", "indeterminate", "inert", "ismap", "itemscope", "loop", "multiple", "muted", "nohref", "noresize", "noshade", "novalidate", "nowrap", "open", "pauseonexit", "readonly", "required", "reversed", "scoped", "seamless", "selected", "sortable", "spellcheck", "translate", "truespeed", "typemustmatch", "visible"];

	var booleanAttrsDict = {};
	for (var i = 0, len = booleanAttrs.length; i < len; i++) {
	  booleanAttrsDict[booleanAttrs[i]] = true;
	}

	function updateAttrs(oldVnode, vnode) {
	  var key,
	      cur,
	      old,
	      elm = vnode.elm,
	      oldAttrs = oldVnode.data.attrs || {},
	      attrs = vnode.data.attrs || {};

	  // update modified attributes, add new attributes
	  for (key in attrs) {
	    cur = attrs[key];
	    old = oldAttrs[key];
	    if (old !== cur) {
	      // TODO: add support to namespaced attributes (setAttributeNS)
	      if (!cur && booleanAttrsDict[key]) elm.removeAttribute(key);else elm.setAttribute(key, cur);
	    }
	  }
	  //remove removed attributes
	  // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
	  // the other option is to remove all attributes with value == undefined
	  for (key in oldAttrs) {
	    if (!(key in attrs)) {
	      elm.removeAttribute(key);
	    }
	  }
	}

	module.exports = { create: updateAttrs, update: updateAttrs };

/***/ },
/* 96 */
/***/ function(module, exports) {

	function updateClass(oldVnode, vnode) {
	  var cur,
	      name,
	      elm = vnode.elm,
	      oldClass = oldVnode.data.class || {},
	      klass = vnode.data.class || {};
	  for (name in oldClass) {
	    if (!klass[name]) {
	      elm.classList.remove(name);
	    }
	  }
	  for (name in klass) {
	    cur = klass[name];
	    if (cur !== oldClass[name]) {
	      elm.classList[cur ? 'add' : 'remove'](name);
	    }
	  }
	}

	module.exports = { create: updateClass, update: updateClass };

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	var is = __webpack_require__(10);

	function arrInvoker(arr) {
	  return function () {
	    // Special case when length is two, for performance
	    arr.length === 2 ? arr[0](arr[1]) : arr[0].apply(undefined, arr.slice(1));
	  };
	}

	function fnInvoker(o) {
	  return function (ev) {
	    o.fn(ev);
	  };
	}

	function updateEventListeners(oldVnode, vnode) {
	  var name,
	      cur,
	      old,
	      elm = vnode.elm,
	      oldOn = oldVnode.data.on || {},
	      on = vnode.data.on;
	  if (!on) return;
	  for (name in on) {
	    cur = on[name];
	    old = oldOn[name];
	    if (old === undefined) {
	      if (is.array(cur)) {
	        elm.addEventListener(name, arrInvoker(cur));
	      } else {
	        cur = { fn: cur };
	        on[name] = cur;
	        elm.addEventListener(name, fnInvoker(cur));
	      }
	    } else if (is.array(old)) {
	      // Deliberately modify old array since it's captured in closure created with `arrInvoker`
	      old.length = cur.length;
	      for (var i = 0; i < old.length; ++i) old[i] = cur[i];
	      on[name] = old;
	    } else {
	      old.fn = cur;
	      on[name] = old;
	    }
	  }
	}

	module.exports = { create: updateEventListeners, update: updateEventListeners };

/***/ },
/* 98 */
/***/ function(module, exports) {

	var raf = typeof window !== 'undefined' && window.requestAnimationFrame || setTimeout;
	var nextFrame = function (fn) {
	  raf(function () {
	    raf(fn);
	  });
	};

	function setNextFrame(obj, prop, val) {
	  nextFrame(function () {
	    obj[prop] = val;
	  });
	}

	function getTextNodeRect(textNode) {
	  var rect;
	  if (document.createRange) {
	    var range = document.createRange();
	    range.selectNodeContents(textNode);
	    if (range.getBoundingClientRect) {
	      rect = range.getBoundingClientRect();
	    }
	  }
	  return rect;
	}

	function calcTransformOrigin(isTextNode, textRect, boundingRect) {
	  if (isTextNode) {
	    if (textRect) {
	      //calculate pixels to center of text from left edge of bounding box
	      var relativeCenterX = textRect.left + textRect.width / 2 - boundingRect.left;
	      var relativeCenterY = textRect.top + textRect.height / 2 - boundingRect.top;
	      return relativeCenterX + 'px ' + relativeCenterY + 'px';
	    }
	  }
	  return '0 0'; //top left
	}

	function getTextDx(oldTextRect, newTextRect) {
	  if (oldTextRect && newTextRect) {
	    return oldTextRect.left + oldTextRect.width / 2 - (newTextRect.left + newTextRect.width / 2);
	  }
	  return 0;
	}
	function getTextDy(oldTextRect, newTextRect) {
	  if (oldTextRect && newTextRect) {
	    return oldTextRect.top + oldTextRect.height / 2 - (newTextRect.top + newTextRect.height / 2);
	  }
	  return 0;
	}

	function isTextElement(elm) {
	  return elm.childNodes.length === 1 && elm.childNodes[0].nodeType === 3;
	}

	var removed, created;

	function pre(oldVnode, vnode) {
	  removed = {};
	  created = [];
	}

	function create(oldVnode, vnode) {
	  var hero = vnode.data.hero;
	  if (hero && hero.id) {
	    created.push(hero.id);
	    created.push(vnode);
	  }
	}

	function destroy(vnode) {
	  var hero = vnode.data.hero;
	  if (hero && hero.id) {
	    var elm = vnode.elm;
	    vnode.isTextNode = isTextElement(elm); //is this a text node?
	    vnode.boundingRect = elm.getBoundingClientRect(); //save the bounding rectangle to a new property on the vnode
	    vnode.textRect = vnode.isTextNode ? getTextNodeRect(elm.childNodes[0]) : null; //save bounding rect of inner text node
	    var computedStyle = window.getComputedStyle(elm, null); //get current styles (includes inherited properties)
	    vnode.savedStyle = JSON.parse(JSON.stringify(computedStyle)); //save a copy of computed style values
	    removed[hero.id] = vnode;
	  }
	}

	function post() {
	  var i, id, newElm, oldVnode, oldElm, hRatio, wRatio, oldRect, newRect, dx, dy, origTransform, origTransition, newStyle, oldStyle, newComputedStyle, isTextNode, newTextRect, oldTextRect;
	  for (i = 0; i < created.length; i += 2) {
	    id = created[i];
	    newElm = created[i + 1].elm;
	    oldVnode = removed[id];
	    if (oldVnode) {
	      isTextNode = oldVnode.isTextNode && isTextElement(newElm); //Are old & new both text?
	      newStyle = newElm.style;
	      newComputedStyle = window.getComputedStyle(newElm, null); //get full computed style for new element
	      oldElm = oldVnode.elm;
	      oldStyle = oldElm.style;
	      //Overall element bounding boxes
	      newRect = newElm.getBoundingClientRect();
	      oldRect = oldVnode.boundingRect; //previously saved bounding rect
	      //Text node bounding boxes & distances
	      if (isTextNode) {
	        newTextRect = getTextNodeRect(newElm.childNodes[0]);
	        oldTextRect = oldVnode.textRect;
	        dx = getTextDx(oldTextRect, newTextRect);
	        dy = getTextDy(oldTextRect, newTextRect);
	      } else {
	        //Calculate distances between old & new positions
	        dx = oldRect.left - newRect.left;
	        dy = oldRect.top - newRect.top;
	      }
	      hRatio = newRect.height / Math.max(oldRect.height, 1);
	      wRatio = isTextNode ? hRatio : newRect.width / Math.max(oldRect.width, 1); //text scales based on hRatio
	      // Animate new element
	      origTransform = newStyle.transform;
	      origTransition = newStyle.transition;
	      if (newComputedStyle.display === 'inline') //inline elements cannot be transformed
	        newStyle.display = 'inline-block'; //this does not appear to have any negative side effects
	      newStyle.transition = origTransition + 'transform 0s';
	      newStyle.transformOrigin = calcTransformOrigin(isTextNode, newTextRect, newRect);
	      newStyle.opacity = '0';
	      newStyle.transform = origTransform + 'translate(' + dx + 'px, ' + dy + 'px) ' + 'scale(' + 1 / wRatio + ', ' + 1 / hRatio + ')';
	      setNextFrame(newStyle, 'transition', origTransition);
	      setNextFrame(newStyle, 'transform', origTransform);
	      setNextFrame(newStyle, 'opacity', '1');
	      // Animate old element
	      for (var key in oldVnode.savedStyle) {
	        //re-apply saved inherited properties
	        if (parseInt(key) != key) {
	          var ms = key.substring(0, 2) === 'ms';
	          var moz = key.substring(0, 3) === 'moz';
	          var webkit = key.substring(0, 6) === 'webkit';
	          if (!ms && !moz && !webkit) //ignore prefixed style properties
	            oldStyle[key] = oldVnode.savedStyle[key];
	        }
	      }
	      oldStyle.position = 'absolute';
	      oldStyle.top = oldRect.top + 'px'; //start at existing position
	      oldStyle.left = oldRect.left + 'px';
	      oldStyle.width = oldRect.width + 'px'; //Needed for elements who were sized relative to their parents
	      oldStyle.height = oldRect.height + 'px'; //Needed for elements who were sized relative to their parents
	      oldStyle.margin = 0; //Margin on hero element leads to incorrect positioning
	      oldStyle.transformOrigin = calcTransformOrigin(isTextNode, oldTextRect, oldRect);
	      oldStyle.transform = '';
	      oldStyle.opacity = '1';
	      document.body.appendChild(oldElm);
	      setNextFrame(oldStyle, 'transform', 'translate(' + -dx + 'px, ' + -dy + 'px) scale(' + wRatio + ', ' + hRatio + ')'); //scale must be on far right for translate to be correct
	      setNextFrame(oldStyle, 'opacity', '0');
	      oldElm.addEventListener('transitionend', function (ev) {
	        if (ev.propertyName === 'transform') document.body.removeChild(ev.target);
	      });
	    }
	  }
	  removed = created = undefined;
	}

	module.exports = { pre: pre, create: create, destroy: destroy, post: post };

/***/ },
/* 99 */
/***/ function(module, exports) {

	function updateProps(oldVnode, vnode) {
	  var key,
	      cur,
	      old,
	      elm = vnode.elm,
	      oldProps = oldVnode.data.props || {},
	      props = vnode.data.props || {};
	  for (key in oldProps) {
	    if (!props[key]) {
	      delete elm[key];
	    }
	  }
	  for (key in props) {
	    cur = props[key];
	    old = oldProps[key];
	    if (old !== cur && (key !== 'value' || elm[key] !== cur)) {
	      elm[key] = cur;
	    }
	  }
	}

	module.exports = { create: updateProps, update: updateProps };

/***/ },
/* 100 */
/***/ function(module, exports) {

	var raf = typeof window !== 'undefined' && window.requestAnimationFrame || setTimeout;
	var nextFrame = function (fn) {
	  raf(function () {
	    raf(fn);
	  });
	};

	function setNextFrame(obj, prop, val) {
	  nextFrame(function () {
	    obj[prop] = val;
	  });
	}

	function updateStyle(oldVnode, vnode) {
	  var cur,
	      name,
	      elm = vnode.elm,
	      oldStyle = oldVnode.data.style || {},
	      style = vnode.data.style || {},
	      oldHasDel = 'delayed' in oldStyle;
	  for (name in oldStyle) {
	    if (!style[name]) {
	      elm.style[name] = '';
	    }
	  }
	  for (name in style) {
	    cur = style[name];
	    if (name === 'delayed') {
	      for (name in style.delayed) {
	        cur = style.delayed[name];
	        if (!oldHasDel || cur !== oldStyle.delayed[name]) {
	          setNextFrame(elm.style, name, cur);
	        }
	      }
	    } else if (name !== 'remove' && cur !== oldStyle[name]) {
	      elm.style[name] = cur;
	    }
	  }
	}

	function applyDestroyStyle(vnode) {
	  var style,
	      name,
	      elm = vnode.elm,
	      s = vnode.data.style;
	  if (!s || !(style = s.destroy)) return;
	  for (name in style) {
	    elm.style[name] = style[name];
	  }
	}

	function applyRemoveStyle(vnode, rm) {
	  var s = vnode.data.style;
	  if (!s || !s.remove) {
	    rm();
	    return;
	  }
	  var name,
	      elm = vnode.elm,
	      idx,
	      i = 0,
	      maxDur = 0,
	      compStyle,
	      style = s.remove,
	      amount = 0,
	      applied = [];
	  for (name in style) {
	    applied.push(name);
	    elm.style[name] = style[name];
	  }
	  compStyle = getComputedStyle(elm);
	  var props = compStyle['transition-property'].split(', ');
	  for (; i < props.length; ++i) {
	    if (applied.indexOf(props[i]) !== -1) amount++;
	  }
	  elm.addEventListener('transitionend', function (ev) {
	    if (ev.target === elm) --amount;
	    if (amount === 0) rm();
	  });
	}

	module.exports = { create: updateStyle, update: updateStyle, destroy: applyDestroyStyle, remove: applyRemoveStyle };

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	// jshint newcap: false
	/* global require, module, document, Node */
	'use strict';

	var VNode = __webpack_require__(15);
	var is = __webpack_require__(10);
	var domApi = __webpack_require__(94);

	function isUndef(s) {
	  return s === undefined;
	}
	function isDef(s) {
	  return s !== undefined;
	}

	var emptyNode = VNode('', {}, [], undefined, undefined);

	function sameVnode(vnode1, vnode2) {
	  return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
	}

	function createKeyToOldIdx(children, beginIdx, endIdx) {
	  var i,
	      map = {},
	      key;
	  for (i = beginIdx; i <= endIdx; ++i) {
	    key = children[i].key;
	    if (isDef(key)) map[key] = i;
	  }
	  return map;
	}

	var hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];

	function init(modules, api) {
	  var i,
	      j,
	      cbs = {};

	  if (isUndef(api)) api = domApi;

	  for (i = 0; i < hooks.length; ++i) {
	    cbs[hooks[i]] = [];
	    for (j = 0; j < modules.length; ++j) {
	      if (modules[j][hooks[i]] !== undefined) cbs[hooks[i]].push(modules[j][hooks[i]]);
	    }
	  }

	  function emptyNodeAt(elm) {
	    return VNode(api.tagName(elm).toLowerCase(), {}, [], undefined, elm);
	  }

	  function createRmCb(childElm, listeners) {
	    return function () {
	      if (--listeners === 0) {
	        var parent = api.parentNode(childElm);
	        api.removeChild(parent, childElm);
	      }
	    };
	  }

	  function createElm(vnode, insertedVnodeQueue) {
	    var i,
	        thunk,
	        data = vnode.data;
	    if (isDef(data)) {
	      if (isDef(i = data.hook) && isDef(i = i.init)) i(vnode);
	      if (isDef(i = data.vnode)) {
	        thunk = vnode;
	        vnode = i;
	      }
	    }
	    var elm,
	        children = vnode.children,
	        sel = vnode.sel;
	    if (isDef(sel)) {
	      // Parse selector
	      var hashIdx = sel.indexOf('#');
	      var dotIdx = sel.indexOf('.', hashIdx);
	      var hash = hashIdx > 0 ? hashIdx : sel.length;
	      var dot = dotIdx > 0 ? dotIdx : sel.length;
	      var tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
	      elm = vnode.elm = isDef(data) && isDef(i = data.ns) ? api.createElementNS(i, tag) : api.createElement(tag);
	      if (hash < dot) elm.id = sel.slice(hash + 1, dot);
	      if (dotIdx > 0) elm.className = sel.slice(dot + 1).replace(/\./g, ' ');
	      if (is.array(children)) {
	        for (i = 0; i < children.length; ++i) {
	          api.appendChild(elm, createElm(children[i], insertedVnodeQueue));
	        }
	      } else if (is.primitive(vnode.text)) {
	        api.appendChild(elm, api.createTextNode(vnode.text));
	      }
	      for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode, vnode);
	      i = vnode.data.hook; // Reuse variable
	      if (isDef(i)) {
	        if (i.create) i.create(emptyNode, vnode);
	        if (i.insert) insertedVnodeQueue.push(vnode);
	      }
	    } else {
	      elm = vnode.elm = api.createTextNode(vnode.text);
	    }
	    if (isDef(thunk)) thunk.elm = vnode.elm;
	    return vnode.elm;
	  }

	  function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
	    for (; startIdx <= endIdx; ++startIdx) {
	      api.insertBefore(parentElm, createElm(vnodes[startIdx], insertedVnodeQueue), before);
	    }
	  }

	  function invokeDestroyHook(vnode) {
	    var i,
	        j,
	        data = vnode.data;
	    if (isDef(data)) {
	      if (isDef(i = data.hook) && isDef(i = i.destroy)) i(vnode);
	      for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode);
	      if (isDef(i = vnode.children)) {
	        for (j = 0; j < vnode.children.length; ++j) {
	          invokeDestroyHook(vnode.children[j]);
	        }
	      }
	      if (isDef(i = data.vnode)) invokeDestroyHook(i);
	    }
	  }

	  function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
	    for (; startIdx <= endIdx; ++startIdx) {
	      var i,
	          listeners,
	          rm,
	          ch = vnodes[startIdx];
	      if (isDef(ch)) {
	        if (isDef(ch.sel)) {
	          invokeDestroyHook(ch);
	          listeners = cbs.remove.length + 1;
	          rm = createRmCb(ch.elm, listeners);
	          for (i = 0; i < cbs.remove.length; ++i) cbs.remove[i](ch, rm);
	          if (isDef(i = ch.data) && isDef(i = i.hook) && isDef(i = i.remove)) {
	            i(ch, rm);
	          } else {
	            rm();
	          }
	        } else {
	          // Text node
	          api.removeChild(parentElm, ch.elm);
	        }
	      }
	    }
	  }

	  function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
	    var oldStartIdx = 0,
	        newStartIdx = 0;
	    var oldEndIdx = oldCh.length - 1;
	    var oldStartVnode = oldCh[0];
	    var oldEndVnode = oldCh[oldEndIdx];
	    var newEndIdx = newCh.length - 1;
	    var newStartVnode = newCh[0];
	    var newEndVnode = newCh[newEndIdx];
	    var oldKeyToIdx, idxInOld, elmToMove, before;

	    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
	      if (isUndef(oldStartVnode)) {
	        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
	      } else if (isUndef(oldEndVnode)) {
	        oldEndVnode = oldCh[--oldEndIdx];
	      } else if (sameVnode(oldStartVnode, newStartVnode)) {
	        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
	        oldStartVnode = oldCh[++oldStartIdx];
	        newStartVnode = newCh[++newStartIdx];
	      } else if (sameVnode(oldEndVnode, newEndVnode)) {
	        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
	        oldEndVnode = oldCh[--oldEndIdx];
	        newEndVnode = newCh[--newEndIdx];
	      } else if (sameVnode(oldStartVnode, newEndVnode)) {
	        // Vnode moved right
	        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
	        api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
	        oldStartVnode = oldCh[++oldStartIdx];
	        newEndVnode = newCh[--newEndIdx];
	      } else if (sameVnode(oldEndVnode, newStartVnode)) {
	        // Vnode moved left
	        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
	        api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
	        oldEndVnode = oldCh[--oldEndIdx];
	        newStartVnode = newCh[++newStartIdx];
	      } else {
	        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
	        idxInOld = oldKeyToIdx[newStartVnode.key];
	        if (isUndef(idxInOld)) {
	          // New element
	          api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
	          newStartVnode = newCh[++newStartIdx];
	        } else {
	          elmToMove = oldCh[idxInOld];
	          patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
	          oldCh[idxInOld] = undefined;
	          api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
	          newStartVnode = newCh[++newStartIdx];
	        }
	      }
	    }
	    if (oldStartIdx > oldEndIdx) {
	      before = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
	      addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
	    } else if (newStartIdx > newEndIdx) {
	      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
	    }
	  }

	  function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
	    var i, hook;
	    if (isDef(i = vnode.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
	      i(oldVnode, vnode);
	    }
	    if (isDef(i = oldVnode.data) && isDef(i = i.vnode)) oldVnode = i;
	    if (isDef(i = vnode.data) && isDef(i = i.vnode)) {
	      patchVnode(oldVnode, i, insertedVnodeQueue);
	      vnode.elm = i.elm;
	      return;
	    }
	    var elm = vnode.elm = oldVnode.elm,
	        oldCh = oldVnode.children,
	        ch = vnode.children;
	    if (oldVnode === vnode) return;
	    if (!sameVnode(oldVnode, vnode)) {
	      var parentElm = api.parentNode(oldVnode.elm);
	      elm = createElm(vnode, insertedVnodeQueue);
	      api.insertBefore(parentElm, elm, oldVnode.elm);
	      removeVnodes(parentElm, [oldVnode], 0, 0);
	      return;
	    }
	    if (isDef(vnode.data)) {
	      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);
	      i = vnode.data.hook;
	      if (isDef(i) && isDef(i = i.update)) i(oldVnode, vnode);
	    }
	    if (isUndef(vnode.text)) {
	      if (isDef(oldCh) && isDef(ch)) {
	        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue);
	      } else if (isDef(ch)) {
	        if (isDef(oldVnode.text)) api.setTextContent(elm, '');
	        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
	      } else if (isDef(oldCh)) {
	        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
	      } else if (isDef(oldVnode.text)) {
	        api.setTextContent(elm, '');
	      }
	    } else if (oldVnode.text !== vnode.text) {
	      api.setTextContent(elm, vnode.text);
	    }
	    if (isDef(hook) && isDef(i = hook.postpatch)) {
	      i(oldVnode, vnode);
	    }
	  }

	  return function (oldVnode, vnode) {
	    var i, elm, parent;
	    var insertedVnodeQueue = [];
	    for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]();

	    if (isUndef(oldVnode.sel)) {
	      oldVnode = emptyNodeAt(oldVnode);
	    }

	    if (sameVnode(oldVnode, vnode)) {
	      patchVnode(oldVnode, vnode, insertedVnodeQueue);
	    } else {
	      elm = oldVnode.elm;
	      parent = api.parentNode(elm);

	      createElm(vnode, insertedVnodeQueue);

	      if (parent !== null) {
	        api.insertBefore(parent, vnode.elm, api.nextSibling(elm));
	        removeVnodes(parent, [oldVnode], 0, 0);
	      }
	    }

	    for (i = 0; i < insertedVnodeQueue.length; ++i) {
	      insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
	    }
	    for (i = 0; i < cbs.post.length; ++i) cbs.post[i]();
	    return vnode;
	  };
	}

	module.exports = { init: init };

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	var h = __webpack_require__(36);

	function init(thunk) {
	  var i,
	      cur = thunk.data;
	  cur.vnode = cur.fn.apply(undefined, cur.args);
	}

	function prepatch(oldThunk, thunk) {
	  var i,
	      old = oldThunk.data,
	      cur = thunk.data;
	  var oldArgs = old.args,
	      args = cur.args;
	  cur.vnode = old.vnode;
	  if (old.fn !== cur.fn || oldArgs.length !== args.length) {
	    cur.vnode = cur.fn.apply(undefined, args);
	    return;
	  }
	  for (i = 0; i < args.length; ++i) {
	    if (oldArgs[i] !== args[i]) {
	      cur.vnode = cur.fn.apply(undefined, args);
	      return;
	    }
	  }
	}

	module.exports = function (name, fn /* args */) {
	  var i,
	      args = [];
	  for (i = 2; i < arguments.length; ++i) {
	    args[i - 2] = arguments[i];
	  }
	  return h('thunk' + name, {
	    hook: { init: init, prepatch: prepatch },
	    fn: fn, args: args
	  });
	};

/***/ }
/******/ ]);