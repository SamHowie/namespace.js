# NamespaceJS

A module management system for Javascript projects the does the dirty work for you.


## The Problem

* As Web Applications become larger and more complex, so too do their code bases.
* Working on a large single file is cumbersome. 
* Manually maintaining multiple files is a dependency nightmare.


## The Solution

A **module management system** that does the hard work of dependency management for you.


### What NamespaceJS Provides

1. **Definition Boilerplate** - An AMD-like boiler plate for defining files/modules and their dependencies.
2. **Compiler** - A NodeJS script to compile your Javascript files and modules into a single file.


### How Does NamespaceJS Differ From AMD (Asynchronous Module Definition)?

* **NamespaceJS is not a script loader** - Instead of loading scripts as modules are required, NamespaceJS builds (and optionally minifies) all your scripts into a single file that is loaded with the page.


## Requirements

* [NodeJS](http://nodejs.org/) installed (to run the build script).


## Installation

1. Make a directory where you wish to store the repository.
```
mkdir ~/GitHub
```
2. Change into the directory you just made.
```
cd ~/GitHub
```
3. Clone the NamespaceJS repository into your directory.
```
git clone git@github.com:SamHowie/Namespace.js.git
```


## Usage

### Step One - Define Your Modules

**file:** myproject/src/Farmyard/Cow.js

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
```

**file:** myproject/src/Farmyard/Pig.js

```javascript
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
```

**file:** myproject/src/Farmyard/Farm.js

```javascript
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


### Step Two - Setup The Configuration File

**file:** myproject/compiler/config.json

```javascript
{
	"paths":{
		"source": "../src",
		"namespace-module": "../src/Namespace.js",
		"output": "../debug/Farmyard.js"
	},
	"settings":{
		"ignoreHiddenFiles": true,
		"uglify": false,
		"priorities": {}
	}
}
```


### Step Three - Compile Your Scripts

1. Navigate to the directory where your compiler script is located.

```
cd ~/Development/myproject/compiler/
```
2. Execute the compiler script with node, making sure to feed in the path to your config file.

```
node compiler.js config.json
```
3. **Rejoice**! Your source files are now compiled in a single file and saved at the location specified as output in your config.json file.

## Sublime Text 2 Build System

For those of you using Sublime Text 2 your workflow can be streamlined further by using the NamespaceJS build system.


### Build Script Installation

1. Copy the NamespaceJS.sublime-build file to.


### Usage

* To build your project, simply press **Command + B**.