# Configuration Options
The NamespaceJS compiler script has several options that can be set. All configuration options are stored in the compilers config.json file.

## Paths

### source

The path to the source folder where all your Javascript files are kept.

### namespace_module

The path to the NamespaceJS script.

### output

Where to output the compiled script. Multiple paths may be specified by using ';' as a delimeter.

```javascript
// Example of multiple output paths.
"output": "../debug/MyCompiledScript.js;../release/MyCompiledScript.js"
```

### hoisted_files

An array of paths to files that are to be hoisted to the top of the compiled script.

Sometimes, when you compile your project, you may want to include files (such as libraries) that have not been implemented using the NamespaceJS boilerplate. This is where you define these files.

Hoisted files are added to the top of the compiled script in the order they are defined in the array.

```javascript
// Example of including some libraries in a compiled project.
"hoisted_files": [
	"../lib/jQuery.js",
	"../lib/SomeOtherLibrary.js"
]
```

### ignored_files

An array of paths to files that are to be ignored. Ignored files will not be compiled.

```javascript
// Example of ignoring some files from appearing in the compiled project.
"ignored_files": [
	"../src/bad.js",
	"../src/ugly.js"
]
```

### coffeescript_paths

An array of objects that point to CoffeeScript source files and output directories for transpiled Javascript.

```javascript
// Example of adding multiple coffeescript resource folders to be transpiled.
"coffeescript_paths": [
	{"source": "../src/coffeescript/", "output": "../src/"},
	{"source": "../src/other_coffeescript/", "output": "../other_src/"}
]
```


## Settings

### ignoreHiddenFiles

Set true to ignore hidden folders and files from being seen by the compiler.

### uglify

Set true to compress your script with [UglifyJS](https://github.com/mishoo/UglifyJS).

### compile_coffeescript

Set to true if you want to pre-compile CoffeeScript to Javascript before compiling your modules.

**Note:** If compile_coffeescript is set to true, the path variables 'coffeescript_source' and 'coffeescript_output' must be defined.
