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
2. **Compiler** - A NodeJS script to compile your Javascript files and modules into a single file (This includes a pre-compilation step for CoffeeScript users to transpile your codebase to Javascript).


### How Does NamespaceJS Differ From AMD (Asynchronous Module Definition)?

* **NamespaceJS is not a script loader** - Instead of loading scripts as modules are required, NamespaceJS builds (and optionally minifies) all your scripts into a single file that is loaded with the page.


## Requirements

* [NodeJS](http://nodejs.org/) (to run the build script).
* [CoffeeScript](http://coffeescript.org/) (only required if you need to precompile your CoffeeScript to Javascript before compiling your files/modules).


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

In order to be compiled properly, Javascript files must be saved in your source directory under a folder structure that matches your namespace.

##### For example: 

The script for the module at namespace **Foo.Bar.MyModule** is found at **[source directory]/Foo/Bar/MyModule.js**.

#### **file:** myproject/src/Farmyard/Cow.js
```javascript
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
```

#### **file:** myproject/src/Farmyard/Pig.js
```javascript
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
```

#### **file:** myproject/src/Farmyard/Farm.js
```javascript
Namespace.define({
    using: ["Farmyard.Cow", "Farmyard.Pig"],
    namespace: "Farmyard.Farm",
    module: function (Cow, Pig) {
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

#### **file:** myproject/compiler/config.json
```javascript
{
    "paths":{
        "source": "../src/example/src",
        "namespace_module": "../src/Namespace.js",
        "output": "../builds/Farmyard.js",
        "hoisted_files": ["../src/example/lib/ExampleLibrary.js"],
        "ignored_files": ["../src/example/src/IgnoredFile.js"],
        "coffeescript_paths": [
            {"source": "../src/coffeescript/", "output": "../src/"}
        ]
    },
    "settings":{
        "ignoreHiddenFiles": true,
        "uglify": false,
        "compile_coffeescript": true
    }
}
```
**Note:** Please refer to the compiler folder [README](https://github.com/SamHowie/Namespace.js/blob/master/compiler/README.md) for a breakdown of the configuration options.


### Step Three - Compile Your Scripts

1. Navigate to the directory where your compiler script is located.
```
cd ~/Development/myproject/compiler/
```
2. Execute the compiler script with node, making sure to feed in the path to your config file.
```
node compiler.js config.json
```
3. **Rejoice!** Your source files are now compiled in a single file and saved at the location specified as output in your config.json file.

## Sublime Text 2 Build System

For those of you using Sublime Text 2 your workflow can be streamlined further by using the NamespaceJS build system.


### Installation

1. Copy the **NamespaceJS.sublime-build** file to your user packages directory.
```
~/Library/Application\ Support/Sublime\ Text\ 2/Packages/User/
```
2. In your Sublime Project Workspace go to **Tools** > **Build System** and select **NamespaceJS**.

**Note:** This build system assumes that your .sublime-project file is a directory above your compiler directory.


### Usage

* In Sublime Text 2 press **Command + B** to build your project.

## Issues?

Feel free to shoot me a message!