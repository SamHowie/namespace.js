# NamespaceJS

**NamespaceJS** is a module management system for Javascript. It allows you to seperate your code out across multiple files and modules, without worrying about the dirty work of dependency management.


## The Problem

* As Web Applications become larger and more complex, so too do their code bases.
* Working on a large single file is cumbersome. 
* Manually maintaining multiple files is a dependency nightmare.


## The Solution

A module **management system** that does the hard work for you. NamespaceJS keeps track of each files dependencies and builds your source files into a single script ready for you to test or deploy.


### What NamespaceJS Provides

1. A boiler plate for defining files/modules and their dependencies.
2. A NodeJS script to compile your Javascript files and modules into a single file.


### Why Not Use AMD (Asynchronous Module Definition)?

* AMD requires each Javascript module/file to be loaded individually. This inflates the number of HTTPRequests being made and ultimately slows the load time of your page.
* AMD's asynchronous loading adds an unnecessary second phase of script loading once the document is loaded. This delays the responsiveness of your Javascript and end user experience.
* Script loading can be considered dangerous as it relies on browser detection. This reliance means that these libraries may break as new browser versions are released.


### How Does NamespaceJS Differ From AMD?
* Instead of loading many scripts asynchronously after page load, NamespaceJS builds your scripts into a single file that can be loaded with the page.

## Requirements

NodeJS installed on your build machine (to run the build script).

## Installation

1. mkdir ~/GitHub
2. cd ~/GitHub
3. git clone git@github.com:SamHowie/Namespace.js.git

## Usage

### Step One - Define Your Modules
```javascript
Namespace.define({
	namespace: "Farmyard",
	name: "Cow",
	definition: function () {
		var Cow = function Cow() {};
		Cow.prototype.speak = function speak(
			console.log("Moo!");
		) {};
		return Cow;
	}
});

Namespace.define({
	namespace: "Farmyard",
	name: "Pig",
	definition: function () {
		var Pig = function Pig() {};
		Pig.prototype.speak = function speak(
			console.log("Oink!");
		) {};
		return Pig;
	}
});

Namespace.define({
	using: ["Farmyard.Cow",
				"Farmyard.Pig"],
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
```

