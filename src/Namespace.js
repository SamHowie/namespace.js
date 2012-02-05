(function () {
    // Utilities
    var toType = function toType(object) {
            return object === undefined ? "undefined" : object === null ? "null" : Object.prototype.toString.call(object).slice(8, -1);
        },
        context     = this,
        Namespace   = {};

    // Public Properties
    Namespace.isNamespace = true;

    // Public Methods
    Namespace.create = function create(path) {
        var currentScope            = context,
            isPathingToNamespace    = true,
            splitNamespace,
            length,
            i,
            name,
            type;

        type = toType(path);
        if (type !== "String") {
            if (type === "undefined" || type == "null") {
                if (console && console.warn) {
                    console.log(path);
                    console.warn("Namespace::create(path): the path '" + path + "'' could not be found so this module is being defined in the global scope.");
                }
                return context;
            } else {
                throw "Namespace::create(path): Expecting parameter \"path\" to be of type String/undefined/null, instead saw " + type + ". Namespace failed to be created.";
            }
        }

        splitNamespace  = path.split(".");
        length          = splitNamespace.length;

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
                    throw "Namespace::create(path): Namespaces may only path to namespace container objects, modules, and classes. Did you try to path to/through a module or class member? Namespace not created/returned.";
                }
            }
            currentScope = currentScope[name];
        }
        return currentScope;
    };

    Namespace.get = function get(path) {
        var target          = context,
            name            = "",
            splitNamespace,
            length,
            i,
            newTargetClass,
            result,
            k;

        //console.log(path);

        if (toType(path) !== "String") {
            throw "Namespace::get(path): Expecting parameter \"path\" to be of type String.";
        }

        splitNamespace  = path.split(".");
        length          = splitNamespace.length;

        for (i = 0; i < length; i++) {
            name = splitNamespace[i];
            newTargetClass = toType(target[name]);
            if ((newTargetClass === "undefined" || newTargetClass === "null") && name !== "*") {
                if (console && console.warn) {
                    console.warn("Namespace::get(path): Namespace '" + path + "' does not exist. Returning null.");
                }
                return null;
            } else if (name === "*" && i < length - 1) {
                if (console && console.logWarning) {
                    console.logWarning("Namespace::get(path): Namespace '" + path + "' does not exist. Returning null.");
                }
                return null;
            } else if (((newTargetClass === "Object" && !target[name].isNamespace) || newTargetClass === "Function") && i !== length - 1) {
                throw "Namespace::get(path): Can not import a member of a module, class, or singleton.";
                //return null;
            } else if (newTargetClass === "Object" && target[name].isNamespace && i === length - 1) {
                throw "Namespace::get(path): Can not import a namespace container object. To import all modules/classes/singletons in a namespace please use get(\"my.name.space.*\", context)";
                //return null;
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
            usingLength,
            i;

        if (toType(data) !== "Object") {
            throw "Namespace::define(data): Expecting a data object as the data paramter.";
        }

        using       = data.using;
        namespace   = data.namespace;
        name        = data.name;
        definition  = data.definition;

        if (name == null) {
            throw "Namespace::define(data): Not enough data given to define. Please provide a \"name\", and \"definition\" in your data object.";
        } else if (definition == null) {
            throw "Namespace::define(data): Not enough data given to define. Please provide a \"name\", and \"definition\" in your data object.";
        } else if (toType(name) !== "String") {
            throw "Namespace::define(data): Expecting data.name to be of type String";
        } else if (Namespace.isDefined(namespace + "." + name) === true) {
            throw "Namespace::define(data): Namespace conflict. The module you are defining ('" + namespace + "." + name + "') already exists at given namespace.";
        }

        if (using && toType(using) === "Array") {
            usingLength = using.length;
            for (i = 0; i < usingLength; i++) {
                using[i] = Namespace.get(using[i]);
            }
        } else {
            using = [];
        }

        if (!!definition.apply) {
            Namespace.create(namespace)[name] = definition.apply(context, using);
        } else {
            if (!!console && !!console.warn) {
                console.warn("Namespace::define(data): Expecting data.definition to be a function.");
            }
        }
    };

    Namespace.isDefined = function isDefined(namespace) {
        var result          = true,
            names           = namespace.split("."),
            currentScope    = context,
            i,
            length,
            name;

        for (i = 0, length = names.length; i < length; i++) {
            name = names[i];
            currentScope = currentScope[name];
            //console.log(currentScope);
            if (currentScope == null) {
                return false;
            }
        }

        return result;
    };

    context.Namespace = Namespace;
}).call(this);