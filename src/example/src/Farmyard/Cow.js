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