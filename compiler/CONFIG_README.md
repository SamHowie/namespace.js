# Configuration Options
The NamespaceJS compiler script has several options that can be set. 

The following options can be set in the config.json file.

## Paths

### source

The path to the source folder where all your Javascript files are kept.

### namespace-module

The path to the NamespaceJS script.

### output

Where to output the compiled script. Multiple paths may be specified by using ";" as a delimeter.
```
"output": "../debug/MyCompiledScript.js;../release/MyCompiledScript.js"
```

## Settings

### ignoreHiddenFiles

Set true to ignore hidden folders and files from being seen by the compiler.

### uglify

Set true to compress your script with [UglifyJS](https://github.com/mishoo/UglifyJS).

### priorities

An array of file priorities.

Sometimes you may want to include files or libraries that have not been implemented using the NamespaceJS boilerplate. This is when you use priorities.

Priorities are added at the top of the compiled script in the order they are defined.

```
"priorities": [
	"../lib/jQuery.js",
	"../lib/SomeOtherLibrary.js"
]
```

**NOTE:** priority paths must be relative to the compiler.js script.