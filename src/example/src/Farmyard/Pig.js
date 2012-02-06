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