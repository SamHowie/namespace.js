root = exports ? this

if root.console is undefined then root.console = {}
if root.console.error is undefined then root.console.error = ->

class Namespace
  constructor: ->

  # Public Methods
  define: (module) ->
    # Validate module parameter
    if module is undefined
      console.error "Namespace.define(module): Expected module parameter to be defined. Module failed to be added to namespace."
      return @
    
    # Validate namespace
    namespace = module.namespace
    if (@toType namespace) isnt "String"
      console.error "Namespace.define(module): Expected module.namespace to be of type String. Module failed to be added to namespace."
      return @;

    # Validate definition
    definition = module.module
    if (@toType definition) isnt "Function"
      console.error "Namespace.define(module): Expected module '#{namespace}'s definition to be a function. Module failed to be added to namespace."
      return @;

    if (definition() is undefined)
      console.error "Namespace.define(module): Expected module '#{namespace}'s definition to return an object. Module failed to be added to namespace."
      return @;

    # Validate dependencies
    dependencies = module.using
    if dependencies is undefined
      dependencies = []
    else
      dependencies = @_getDependencies dependencies
      if dependencies is undefined
        return @

    # Insert module at namespace
    @insert namespace, definition.apply root, dependencies

    return @

  insert: (namespace, module) ->
    # Validate namespace parameter
    typeOfNamespace = @toType namespace
    if (typeOfNamespace) isnt "String"
      console.error "Namespace.insert(namespace, module): Expecting 'namespace' parameter to be of type String. Instead saw type #{typeOfNamespace}. Module failed to be inserted."
      return @

    # Init properties
    context     = root
    names       = namespace.split "."
    moduleName  = names.pop() # Dont want module name in for loop or it will become a namespace node

    for name in names
      # Create node if non-existant
      if context[name] is undefined
        context[name] = {isNamespaceNode: true}

      context = context[name]

      # Check for namespace conflict
      if context isnt root and context.isNamespaceNode is undefined
        console.error "Namespace.insert(namespace, module): Attempting to insert module with path '#{namespace}' through module with name '#{name}'. Module failed to be inserted."
        return @

    # Check for namespace conflict
    if context[moduleName] != undefined
      console.error "Namespace.insert(namespace, module): Attempting to insert module with path '#{namespace}' where a module already exists. Module failed to be inserted."
      return @

    # Insert module at specified location
    context[moduleName] = module;

    return @

  get: (namespace) ->
    # Validate namespace parameter
    typeOfNamespace = @toType namespace
    if (typeOfNamespace) isnt "String"
      console.error "Namespace.get(namespace): Expecting 'namespace' parameter to be of type String. Instead saw type #{typeOfNamespace}. Module failed to be retrieved."
      return undefined

    context = root;
    names   = namespace.split "."

    for name in names
      if context[name] is undefined
        console.error "Namespace.get(namespace): The module with namespace '#{namespace}' isnt defined. Module failed to be retrieved."
        return undefined
      context = context[name]

    return context

  # Private Methods
  _getDependencies: (dependencies) ->
    typeOfDependencies = @toType dependencies
    if (typeOfDependencies) isnt "Array"
      console.error "Namespace.define(module): Expected module.using to be of type Array, instead saw #{typeOfDependencies}. Module failed to be added to namespace."
      return undefined
    result = [];

    for namespace in dependencies
      dependency = @get namespace
      if dependency is undefined then return else result.push dependency
    
    return result

  # Util Methods
  toType: (object) ->
    return if object is undefined then "undefined" else (Object.prototype.toString.call object).slice 8, -1

root.Namespace = new Namespace
