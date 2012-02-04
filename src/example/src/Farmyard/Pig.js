Namespace.define({
    namespace: "Farmyard",
    name: "Pig",
    definition: function () {
        var Pig = function Pig() {};
        Pig.prototype.speak = function speak() {
            console.log("Oink!");
        };
        return Pig;
    }
});