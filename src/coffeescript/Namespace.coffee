root = exports ? this;

class Namespace
  constructor: ->

  # Public Methods
  define: (module) ->
    if module is undefined
      if !!console and !!console.error
        console.error "Namespace.define(module): Expected module parameter to be defined. Module failed to be added to namespace."
      return @
    
    dependencies  = module.using
    namespace     = module.namespace
    definition    = module.module

    if namespace is undefined
      if !!console and !!console.error
        console.error "Namespace.define(module): Expected module to have property 'namespace'. Module failed to be added to namespace."
      return @;

    if dependencies is undefined
      dependencies = []
    else
      dependencies = @_getDependencies dependencies

    if (@toType definition) isnt "Function"
      if !!console and !!console.error
        console.error "Namespace.define(module): Expected module '#{namespace}'s definition to be a function.Module failed to be added to namespace."
      return @;

    @insert namespace, definition.apply root, dependencies

    return @

  insert: (namespace, module) ->
    # Validate namespace parameter
    if (@toType namespace) isnt "String"
      if !!console and !!console.error
          console.error "Namespace.insert(namespace, module): Expecting 'namespace' parameter to be of type String. Instead saw type #{@toType namespace}. Module failed to be inserted."
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
        if !!console and !!console.error
          console.error "Namespace.insert(namespace, module): Attempting to insert module with path '#{namespace}' through module with name '#{name}'. Module failed to be inserted."
        return @

    # Check for namespace conflict
    if context[moduleName] != undefined
      if !!console and !!console.error
          console.error "Namespace.insert(namespace, module): Attempting to insert module with path '#{namespace}' where a module already exists. Module failed to be inserted."
        return @

    # Insert module at specified location
    context[moduleName] = module;

    return @

  get: (namespace) ->
    # Validate namespace parameter
    if (@toType namespace) isnt "String"
      if !!console and !!console.error
          console.error "Namespace.get(namespace): Expecting 'namespace' parameter to be of type String. Instead saw type #{@toType namespace}. Module failed to be retrieved."
      return undefined

    context = root;
    names   = namespace.split "."

    for name in names
      if context[name] is undefined
        if !!console and !!console.error
          console.error "Namespace.get(namespace): The module with namespace '#{namespace}' isnt defined. Module failed to be retrieved."
        return undefined
      context = context[name]

    return context

  # Private Methods
  _getDependencies: (dependencies) ->
    if (@toType dependencies) isnt "Array"
      if !!console and !!console.error
        console.error "Namespace.define(module): Expected module to have property 'namespace'. Module failed to be added to namespace."
      return
    
    @get dependency for dependency in dependencies

  # Util Methods
  toType: (object) ->
    return if object is undefined then "undefined" else (Object.prototype.toString.call object).slice 8, -1

root.Namespace = new Namespace
