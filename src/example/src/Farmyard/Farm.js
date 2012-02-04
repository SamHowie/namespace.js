Namespace.define({
    using: ["Farmyard.Cow", "Farmyard.Pig"],
    namespace: "Farmyard",
    name: "Farm",
    definition: function (Cow, Pig) {
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