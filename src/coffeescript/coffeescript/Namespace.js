(function() {
  var Namespace, root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  Namespace = (function() {

    function Namespace() {}

    Namespace.prototype.define = function(module) {
      var definition, dependencies, namespace;
      dependencies = module.using;
      namespace = module.namespace;
      definition = module.module;
      if (namespace === void 0) {
        if (!!console && !!console.warn) {
          console.warn("Namespace.define(module): Expected module to have property 'namespace'. Module failed to be added to namespace.");
        }
        return this;
      }
      if (dependencies === void 0) {
        dependencies = [];
      } else {
        dependencies = this._getDependencies(dependencies);
      }
      if ((this.toType(definition)) === !"Function") {
        if (!!console && !!console.warn) {
          console.warn("Namespace.define(module): Expected module '" + namespace + "'s definition to be a function.Module failed to be added to namespace.");
        }
        return this;
      }
      this.insert(namespace, definition.apply(root, dependencies));
      return this;
    };

    Namespace.prototype.insert = function(namespace, module) {
      var context, moduleName, name, names, _i, _len;
      if ((this.toType(namespace)) === !"String") {
        if (!!console && !!console.warn) {
          console.error("Namespace.insert(namespace, module): Expecting 'namespace' parameter to be of type String. Instead saw type " + (this.toType(namespace)) + ". Module failed to be inserted.");
        }
        return this;
      }
      context = root;
      names = namespace.split(".");
      moduleName = names.pop();
      for (_i = 0, _len = names.length; _i < _len; _i++) {
        name = names[_i];
        if (context[name] === void 0) {
          context[name] = {
            isNamespaceNode: true
          };
        }
        context = context[name];
        if (context === !root && context.isNamespaceNode === void 0) {
          if (!!console && !!console.warn) {
            console.error("Namespace.insert(namespace, module): Attempting to insert module with path '" + namespace + "' through module with name '" + name + "'. Module failed to be inserted.");
          }
          return this;
        }
      }
      if (context[moduleName] !== void 0) {
        if (!!console && !!console.warn) {
          console.error("Namespace.insert(namespace, module): Attempting to insert module with path '" + namespace + "' where a module already exists. Module failed to be inserted.");
        }
        return this;
      }
      context[moduleName] = module;
      return this;
    };

    Namespace.prototype.get = function(namespace) {
      var context, name, names, _i, _len;
      if ((this.toType(namespace)) === !"String") {
        if (!!console && !!console.warn) {
          console.error("Namespace.get(namespace): Expecting 'namespace' parameter to be of type String. Instead saw type " + (this.toType(namespace)) + ". Module failed to be retrieved.");
        }
        return;
      }
      context = root;
      names = namespace.split(".");
      for (_i = 0, _len = names.length; _i < _len; _i++) {
        name = names[_i];
        if (context[name] === void 0) {
          if (!!console && !!console.warn) {
            console.error("Namespace.get(namespace): The module with namespace '" + namespace + "' is not defined. Module failed to be retrieved.");
          }
          return;
        }
        context = context[name];
      }
      return context;
    };

    Namespace.prototype._getDependencies = function(dependencies) {
      var dependency, _i, _len, _results;
      if ((this.toType(dependencies)) === !"Array") {
        if (!!console && !!console.warn) {
          console.error("Namespace.define(module): Expected module to have property 'namespace'. Module failed to be added to namespace.");
        }
        return;
      }
      _results = [];
      for (_i = 0, _len = dependencies.length; _i < _len; _i++) {
        dependency = dependencies[_i];
        _results.push(this.get(dependency));
      }
      return _results;
    };

    Namespace.prototype.toType = function(object) {
      if (object === void 0) {
        return "undefined";
      } else {
        return (Object.prototype.toString.call(object)).slice(8, -1);
      }
    };

    return Namespace;

  })();

  root.Namespace = new Namespace;

}).call(this);
