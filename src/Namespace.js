var Namespace = (function (context) {
	// Utilities
	var toType = function toType(object) {
			return object === undefined ? "undefined" : object === null ? "null" : Object.prototype.toString.call(object).slice(8, -1);
		},
		Namespace = {};

	// Public Properties
	Namespace.isNamespace = true;

	// Public Methods
	Namespace.namespace = function namespace(path) {
		var currentScope			= context,
			isPathingToNamespace	= true,
			splitNamespace,
			length,
			i,
			name,
			type;
		/**/
		if (toType(path) !== "String") {
			throw "Namespace::namespace(path): Expecting parameter \"path\" to be of type String";
		}

		splitNamespace	= path.split(".");
		length			= splitNamespace.length;

		for (i = 0; i < length; i++) {
			name = splitNamespace[i];
			if (currentScope[name] === undefined || currentScope[name] === null) {
				currentScope[name] = {isNamespace: true};
			} else {
				type = toType(currentScope[name]);
				if (type === "Object" && (currentScope[name].isNamespace !== true && i !== length - 1)) {
					isPathingToNamespace = false;
				} else if (type === "Function" && i !== length - 1) {
					isPathingToNamespace = false;
				} else if (type !== "Object" && type !== "Function") {
					isPathingToNamespace = false;
				}
				if (!isPathingToNamespace) {
					throw "Namespace::namespace(path): Namespaces may only path to namespace container objects, modules, and classes. Did you try to path to/through a module or class member? Namespace not created/returned.";
				}
			}
			currentScope = currentScope[name];
		}
		return currentScope;
	};

	Namespace.using = function using(path) {
		var target			= context,
			name			= "",
			splitNamespace,
			length,
			i,
			newTargetClass,
			result,
			k;

		if (toType(path) !== "String") {
			throw "Namespace::using(path): Expecting parameter \"path\" to be of type String";
		}

		splitNamespace	= path.split(".");
		length			= splitNamespace.length;

		for (i = 0; i < length; i++) {
			name = splitNamespace[i];
			newTargetClass = toType(target[name]);
			if ((newTargetClass === "undefined" || newTargetClass === "null") && name !== "*") {
				throw "Namespace::using(path): Namespace does not exist.";
			} else if (name === "*" && i < length - 1) {
				throw "Namespace::using(path): Namespace does not exist.";
			} else if (((newTargetClass === "Object" && !target[name].isNamespace) || newTargetClass === "Function") && i !== length - 1) {
				throw "Namespace::using(path): Can not import a member of a module, class, or singleton.";
			} else if (newTargetClass === "Object" && target[name].isNamespace && i === length - 1) {
				throw "Namespace::using(path): Can not import a namespace container object. To import all modules/classes/singletons in a namespace please use using(\"my.name.space.*\", context)";
			}
			if (name !== "*") {
				target = target[name];
			}
		}
		if (name !== "*") {
			//importing a single module/class/singleton.
			return target;
		} else {
			//importing all modules/classes/singletons in a given namespace.
			result = {};
			k = 0;
			for (k in target) {
				if (target.hasOwnProperty(k) && k !== "isNamespace" && k !== "__proto__") {
					result[k] = target[k];
			    }
			}
			return result;
		}
	};

	Namespace.define = function define(data) {
		var using,
			namespace,
			name,
			definition,
			paramString,
			usingLength,
			i;

		if (toType(data) !== "Object") {
			throw "Namespace::define(data): Expecting a data object as the data paramter.";
		}

		using		= data.using;
		namespace	= data.namespace;
		name		= data.name;
		definition	= data.definition;

		if (namespace === undefined || namespace === null) {
			throw "Namespace::define(data): Not enough data given to define. Please provide a \"namespace\", \"name\", and \"definition\" in your data object.";
		} else if (name === undefined || name === null) {
			throw "Namespace::define(data): Not enough data given to define. Please provide a \"namespace\", \"name\", and \"definition\" in your data object.";
		} else if (definition === undefined || definition === null) {
			throw "Namespace::define(data): Not enough data given to define. Please provide a \"namespace\", \"name\", and \"definition\" in your data object.";
		} else if (toType(name) !== "String") {
			throw "Namespace::define(data): Expecting data.name to be of type String";
		} else if (Namespace.namespace(namespace)[name] !== undefined) {
			throw "Namespace::define(data): Namespace conflict. The module/class/singleton you are defining already exists at given namespace.";
		}

		paramString = "";
		if (using && toType(using) === "Array") {
			usingLength = using.length;
			for (i = 0; i < usingLength; i++) {
				using[i] = Namespace.using(using[i]);
			}
		} else {
			using = [];
		}

		Namespace.namespace(namespace)[name] = definition.apply(this, using);
	};

	context.Namespace = Namespace;

	return Namespace;

}(window));