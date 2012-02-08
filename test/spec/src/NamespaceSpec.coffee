describe "Namespace", ->
  it "Should be defined on the global object.", ->
    expect(Namespace).toBeDefined()

  # Public Method Tests
  describe "Public Methods", ->
    describe "Namespace.define(module)", ->
      it "Should not throw error if define is passed no parameters", ->
        passed = true
        try
          Namespace.define()
        catch error
          passed = false
        expect(passed).toEqual true

      it "Should not throw error if module properties are all defined as intended.", ->
        passed = true
        try
          Namespace.define
            using: []
            namespace: "NamespaceSpec.tests.test01"
            module: -> {}
        catch error
          passed = false
        expect(passed).toEqual true

      it "Should create namespace if module properties are all defined as intended.", ->
        passed = true
        try
          Namespace.define
            using: []
            namespace: "NamespaceSpec.tests.test02"
            module: -> {}
        catch error
          passed = false
        expect(passed is true and Namespace.get("NamespaceSpec.tests.test02") isnt undefined).toEqual true

      it "Should not throw error if module.using is undefined.", ->
        passed = true
        try
          Namespace.define
            namespace: "No.Using.Module"
            module: -> {}
        catch error
          passed = false
        expect(passed).toEqual true

      it "Should create namespace even if module.using is undefined.", ->
        passed = true
        try
          Namespace.define
            namespace: "No.Using.Module2"
            module: -> {}
        catch error
          passed = false
        expect(passed is true and Namespace.get("No.Using.Module") isnt undefined).toEqual true
      
      it "Should not throw error if module.namespace is undefined.", ->
        passed = true
        try
          Namespace.define
            module: -> {}
        catch error
          passed = false
        expect(passed).toEqual true

      it "Should not throw error if module.namespace is not of required Type.", ->
        passed = true
        try
          Namespace.define
            namespace: []
            module: ->
        catch error
          passed = false
        expect(passed).toEqual true

      it "Should not throw error if module.module is undefined.", ->
        passed = true
        try
          Namespace.define
            namespace: "My.Test.Namespace"
        catch error
          passed = false
        expect(passed).toEqual true

      it "Should not throw error if module.module is not of required Type.", ->
        passed = true
        try
          Namespace.define
            namespace: "My.Test.Namespace"
            module: {}
        catch error
          passed = false
        expect(passed).toEqual true

      it "Should not create namespace if module.module is not of required Type.", ->
        passed = true;
        try
          Namespace.define
            namespace: "My.Test.Namespace.Module"
            module: {}
        catch error
        expect(Namespace.get("My.Test.Namespace.Module") is undefined).toEqual true

      it "Should not throw error if module.module does not return an object.", ->
        passed = true
        try
          Namespace.define
            namespace: "NoUsing"
            module: ->
        catch error
          passed = false
        expect(passed).toEqual true

      it "Should not create namespace if module.module does not return an object.", ->
        try
          Namespace.define
            namespace: "NoUsing"
            module: ->
        catch error
        expect(Namespace.get("NoUsing") is undefined).toEqual true

      it "Should not throw error if namespace.using is of unexpected Type.", ->
        passed = true
        try
          Namespace.define
            using: {}
            namespace: "This.will.Never.Work"
            module: -> {}
        catch error
          passed = false
        expect(passed).toEqual true

      it "Should not throw error if namespace.using items are of unexpected Types.", ->
        passed = true
        try
          Namespace.define
            using: [{}, []]
            namespace: "This.will.Never.Work"
            module: -> {}
        catch error
          passed = false
        expect(passed).toEqual true

      it "Should not throw error if namespace.using items are of unexpected Types.", ->
        passed = true
        try
          Namespace.define
            using: [[], {}]
            namespace: "This.will.Never.Work"
            module: -> {}
        catch error
          passed = false
        expect(passed).toEqual true

      it "Should not create namespace if namespace.using items are of unexpected Types.", ->
      passed = true
      try
        Namespace.define
          using: [[], {}]
          namespace: "This.will.Never.Work"
          module: -> {}
      catch error
        passed = false
      expect(passed and Namespace.get("This.will.Never.Work") is undefined).toEqual true
            
          