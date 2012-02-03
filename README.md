# NamespaceJS

**NamespaceJS** is a module management system for Javascript projects. It allows you to seperate your code out across multiple files and modules, without worrying about the dirty work of dependency management.


## The Problem

* As Web Applications become larger and more complex, so too do their code bases.
* Working on a large single file is cumbersome. 
* Manually maintaining multiple files is a dependency nightmare.


## The Solution

A **module management system** that does the hard work for you. NamespaceJS keeps track of each files dependencies and builds your source files into a single script ready for you to test or deploy.


### What NamespaceJS Provides

1. A boiler plate for defining files/modules and their dependencies.
2. A NodeJS script to compile your Javascript files and modules into a single file.


### Why Not Use AMD (Asynchronous Module Definition)?

* AMD requires each Javascript module/file to be loaded individually. This inflates the number of HTTPRequests being made and ultimately slows the load time of your page.
* AMD's asynchronous loading adds an unnecessary second phase of script loading once the document is loaded. This delays the responsiveness of your Javascript and end user experience.
* Script loading can be considered dangerous as it relies on browser detection. This reliance means that these libraries may break as new browser versions are released.


### How Does NamespaceJS Differ From AMD?
* Instead of loading many scripts asynchronously after the page loads, NamespaceJS builds your scripts into a single file that is loaded with the page.


## Requirements

NodeJS installed on your build machine (to run the build script).


## Installation

1. Make a directory where you wish to store the repository.
```$
mkdir ~/GitHub
```
2. Change into the directory you just made.
```$
cd ~/GitHub
```
3. Clone the NamespaceJS repository into your directory.
```$
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
```$
cd ~/Development/myproject/compiler/
```
2. Execute the compiler script with node, making sure to feed in the path to your config file.
```$
node compiler.js config.json
```
3. Rejoice for your source files have now been compiled into a single file and saved to the location specified as output in your config.json file.