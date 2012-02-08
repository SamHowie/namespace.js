"use strict";
(function () {
	console.log("I am an example library that was hoisted to the top of compiled script.")
}());  
(function() {
  var Namespace, root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  if (root.console === void 0) root.console = {};

  if (root.console.error === void 0) root.console.error = function() {};

  Namespace = (function() {

    function Namespace() {}

    Namespace.prototype.define = function(module) {
      var definition, dependencies, namespace;
      if (module === void 0) {
        console.error("Namespace.define(module): Expected module parameter to be defined. Module failed to be added to namespace.");
        return this;
      }
      namespace = module.namespace;
      if ((this.toType(namespace)) !== "String") {
        console.error("Namespace.define(module): Expected module.namespace to be of type String. Module failed to be added to namespace.");
        return this;
      }
      definition = module.module;
      if ((this.toType(definition)) !== "Function") {
        console.error("Namespace.define(module): Expected module '" + namespace + "'s definition to be a function. Module failed to be added to namespace.");
        return this;
      }
      if (definition() === void 0) {
        console.error("Namespace.define(module): Expected module '" + namespace + "'s definition to return an object. Module failed to be added to namespace.");
        return this;
      }
      dependencies = module.using;
      if (dependencies === void 0) {
        dependencies = [];
      } else {
        dependencies = this._getDependencies(dependencies);
        if (dependencies === void 0) return this;
      }
      this.insert(namespace, definition.apply(root, dependencies));
      return this;
    };

    Namespace.prototype.insert = function(namespace, module) {
      var context, moduleName, name, names, typeOfNamespace, _i, _len;
      typeOfNamespace = this.toType(namespace);
      if (typeOfNamespace !== "String") {
        console.error("Namespace.insert(namespace, module): Expecting 'namespace' parameter to be of type String. Instead saw type " + typeOfNamespace + ". Module failed to be inserted.");
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
        if (context !== root && context.isNamespaceNode === void 0) {
          console.error("Namespace.insert(namespace, module): Attempting to insert module with path '" + namespace + "' through module with name '" + name + "'. Module failed to be inserted.");
          return this;
        }
      }
      if (context[moduleName] !== void 0) {
        console.error("Namespace.insert(namespace, module): Attempting to insert module with path '" + namespace + "' where a module already exists. Module failed to be inserted.");
        return this;
      }
      context[moduleName] = module;
      return this;
    };

    Namespace.prototype.get = function(namespace) {
      var context, name, names, typeOfNamespace, _i, _len;
      typeOfNamespace = this.toType(namespace);
      if (typeOfNamespace !== "String") {
        console.error("Namespace.get(namespace): Expecting 'namespace' parameter to be of type String. Instead saw type " + typeOfNamespace + ". Module failed to be retrieved.");
        return;
      }
      context = root;
      names = namespace.split(".");
      for (_i = 0, _len = names.length; _i < _len; _i++) {
        name = names[_i];
        if (context[name] === void 0) {
          console.error("Namespace.get(namespace): The module with namespace '" + namespace + "' isnt defined. Module failed to be retrieved.");
          return;
        }
        context = context[name];
      }
      return context;
    };

    Namespace.prototype._getDependencies = function(dependencies) {
      var dependency, namespace, result, typeOfDependencies, _i, _len;
      typeOfDependencies = this.toType(dependencies);
      if (typeOfDependencies !== "Array") {
        console.error("Namespace.define(module): Expected module.using to be of type Array, instead saw " + typeOfDependencies + ". Module failed to be added to namespace.");
        return;
      }
      result = [];
      for (_i = 0, _len = dependencies.length; _i < _len; _i++) {
        namespace = dependencies[_i];
        dependency = this.get(namespace);
        if (dependency === void 0) {
          return;
        } else {
          result.push(dependency);
        }
      }
      return result;
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

Namespace.define({
    namespace: "Farmyard.Cow",
    module: function () {
        var Cow = function Cow() {};
        Cow.prototype.speak = function speak() {
            console.log("Moo!");
        };
        return Cow;
    }
});
Namespace.define({
    namespace: "Farmyard.Pig",
    module: function () {
        var Pig = function Pig() {};
        Pig.prototype.speak = function speak() {
            console.log("Oink!");
        };
        return Pig;
    }
});
Namespace.define({
    using: ["Farmyard.Cow", "Farmyard.Pig"],
    namespace: "Farmyard.Farm",
    module: function (Cow, Pig) {
        var Farm = function Farm() {
            this.animals = [];
            this.animals.push(new Cow());
            this.animals.push(new Pig());
        };

        Farm.prototype.stir = function stir() {
            var animals = this.animals,
                animal,
                i,
                length;
            for (i = 0, length = animals.length; i < length; i++) {
                animal = animals[i];
                animal.speak();
            };
        };

        return Farm;
    }
});
