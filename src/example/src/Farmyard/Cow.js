Namespace.define({
    namespace: "Farmyard",
    name: "Cow",
    definition: function () {
        var Cow = function Cow() {};
        Cow.prototype.speak = function speak() {
            console.log("Moo!");
        };
        return Cow;
    }
});