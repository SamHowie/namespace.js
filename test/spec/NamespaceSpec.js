(function() {

  describe("Namespace", function() {
    it("Should be defined on the global object.", function() {
      return expect(Namespace).toBeDefined();
    });
    return describe("Public Methods", function() {
      return describe("Namespace.define(module)", function() {
        var passed;
        it("Should not throw error if define is passed no parameters", function() {
          var passed;
          passed = true;
          try {
            Namespace.define();
          } catch (error) {
            passed = false;
          }
          return expect(passed).toEqual(true);
        });
        it("Should not throw error if module properties are all defined as intended.", function() {
          var passed;
          passed = true;
          try {
            Namespace.define({
              using: [],
              namespace: "NamespaceSpec.tests.test01",
              module: function() {
                return {};
              }
            });
          } catch (error) {
            passed = false;
          }
          return expect(passed).toEqual(true);
        });
        it("Should create namespace if module properties are all defined as intended.", function() {
          var passed;
          passed = true;
          try {
            Namespace.define({
              using: [],
              namespace: "NamespaceSpec.tests.test02",
              module: function() {
                return {};
              }
            });
          } catch (error) {
            passed = false;
          }
          return expect(passed === true && Namespace.get("NamespaceSpec.tests.test02") !== void 0).toEqual(true);
        });
        it("Should not throw error if module.using is undefined.", function() {
          var passed;
          passed = true;
          try {
            Namespace.define({
              namespace: "No.Using.Module",
              module: function() {
                return {};
              }
            });
          } catch (error) {
            passed = false;
          }
          return expect(passed).toEqual(true);
        });
        it("Should create namespace even if module.using is undefined.", function() {
          var passed;
          passed = true;
          try {
            Namespace.define({
              namespace: "No.Using.Module2",
              module: function() {
                return {};
              }
            });
          } catch (error) {
            passed = false;
          }
          return expect(passed === true && Namespace.get("No.Using.Module") !== void 0).toEqual(true);
        });
        it("Should not throw error if module.namespace is undefined.", function() {
          var passed;
          passed = true;
          try {
            Namespace.define({
              module: function() {
                return {};
              }
            });
          } catch (error) {
            passed = false;
          }
          return expect(passed).toEqual(true);
        });
        it("Should not throw error if module.namespace is not of required Type.", function() {
          var passed;
          passed = true;
          try {
            Namespace.define({
              namespace: [],
              module: function() {}
            });
          } catch (error) {
            passed = false;
          }
          return expect(passed).toEqual(true);
        });
        it("Should not throw error if module.module is undefined.", function() {
          var passed;
          passed = true;
          try {
            Namespace.define({
              namespace: "My.Test.Namespace"
            });
          } catch (error) {
            passed = false;
          }
          return expect(passed).toEqual(true);
        });
        it("Should not throw error if module.module is not of required Type.", function() {
          var passed;
          passed = true;
          try {
            Namespace.define({
              namespace: "My.Test.Namespace",
              module: {}
            });
          } catch (error) {
            passed = false;
          }
          return expect(passed).toEqual(true);
        });
        it("Should not create namespace if module.module is not of required Type.", function() {
          var passed;
          passed = true;
          try {
            Namespace.define({
              namespace: "My.Test.Namespace.Module",
              module: {}
            });
          } catch (error) {

          }
          return expect(Namespace.get("My.Test.Namespace.Module") === void 0).toEqual(true);
        });
        it("Should not throw error if module.module does not return an object.", function() {
          var passed;
          passed = true;
          try {
            Namespace.define({
              namespace: "NoUsing",
              module: function() {}
            });
          } catch (error) {
            passed = false;
          }
          return expect(passed).toEqual(true);
        });
        it("Should not create namespace if module.module does not return an object.", function() {
          try {
            Namespace.define({
              namespace: "NoUsing",
              module: function() {}
            });
          } catch (error) {

          }
          return expect(Namespace.get("NoUsing") === void 0).toEqual(true);
        });
        it("Should not throw error if namespace.using is of unexpected Type.", function() {
          var passed;
          passed = true;
          try {
            Namespace.define({
              using: {},
              namespace: "This.will.Never.Work",
              module: function() {
                return {};
              }
            });
          } catch (error) {
            passed = false;
          }
          return expect(passed).toEqual(true);
        });
        it("Should not throw error if namespace.using items are of unexpected Types.", function() {
          var passed;
          passed = true;
          try {
            Namespace.define({
              using: [{}, []],
              namespace: "This.will.Never.Work",
              module: function() {
                return {};
              }
            });
          } catch (error) {
            passed = false;
          }
          return expect(passed).toEqual(true);
        });
        it("Should not throw error if namespace.using items are of unexpected Types.", function() {
          var passed;
          passed = true;
          try {
            Namespace.define({
              using: [[], {}],
              namespace: "This.will.Never.Work",
              module: function() {
                return {};
              }
            });
          } catch (error) {
            passed = false;
          }
          return expect(passed).toEqual(true);
        });
        it("Should not create namespace if namespace.using items are of unexpected Types.", function() {});
        passed = true;
        try {
          Namespace.define({
            using: [[], {}],
            namespace: "This.will.Never.Work",
            module: function() {
              return {};
            }
          });
        } catch (error) {
          passed = false;
        }
        return expect(passed && Namespace.get("This.will.Never.Work") === void 0).toEqual(true);
      });
    });
  });

}).call(this);
