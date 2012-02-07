(function compile () {
    var fs                  = require('fs'),
        sys                 = require('sys'),
        exec                = require('child_process').exec,
        uglify              = require("./uglify-js"),
        CONFIG_URI          = process.argv[2] || "config.json",
        Builder;

    Builder = Object.create({
        // Properties
        configData:         null,
        fileDescriptions:   null,
        sourcePath:         null,
        compiledScript:     null,

        /**
         * Starts the build process.
         * 
         * @return {void}
         */
        start: function start() {
            var context     = this,
                configData,
                settings,
                paths;

            this.init();

            configData = this.configData;
            if (configData == null) {
                throw "Build failed: No config data found. Please confirm there is a config.json file in the compilers root directory.";
            }

            settings = configData.settings;

            if (settings == null || !settings.compile_coffeescript) {
                this.build();
                return;
            }

            paths = configData.paths;

            if (paths == null || paths.coffeescript_paths == null) {
                console.log("Build warning: CoffeesScript compile requested but either coffeescript_source or coffeescript_output has not been set in config.json. Coffeescript was not transpiled.");
                this.build();
                return;
            }

            this.compile_coffeescript(paths.coffeescript_paths);
            
        },

        compile_coffeescript: function compile_coffeescript(coffeescript_paths) {
            var i           = 0,
                length      = coffeescript_paths.length || 0,
                context     = this,
                output,
                source,
                doCompile;

            doCompile = function onCompiled (error, stdout, stderr) {
                var compileRequest;
                // Handle logging
                if (error) {
                   sys.puts(error);
                    return; 
                }
                if (stderr) {
                    sys.puts(stderr);
                    return;
                } 

                if (stdout) sys.puts(stdout);
                
                // Compile next load of CoffeeScript
                if (i < length) {
                    compileRequest = coffeescript_paths[i];
                    i++;
                    exec("coffee --compile --output " + compileRequest.output + " " + compileRequest.source, doCompile);
                } else {
                     context.build();
                }
            }

            doCompile();
        },

        /**
         * Initialises Builder properties and loads in config data.
         * 
         * @return {void}
         */
        init: function init() {
            this.fileDescriptions = {};
            this.configData = this.loadConfigData();
            return this;
        },

        /**
         * Builds the compiled script.
         * 
         * Pre-conditions:  This method assumes that the Builder has been initialised, and its configuration data has been loaded.
         * 
         * @return {void}
         */
        build: function build() {
            var configData = this.configData,
                sourcePath = (configData.paths && configData.paths.source) ? configData.paths.source : null;

            if (sourcePath == null) {
                throw "Build failed: configData.paths.source is undefined. Please define it in config.json.";
            }

            this.sourcePath = sourcePath;

            this.describeFilesInDirectory(sourcePath);
            this.resolveDependencies();
            this.compileScripts();
            this.saveCompiledScript();
        },

        /**
         * Loads the configuration data
         * 
         * Pre-conditions:  This method assumes that CONFIG_URI has been set. This is passed to the compiler.js script as a parameter.
         *                  If not defined, it assumes the file sits in the same directory as compiler.js.
         * 
         * @return {void}
         */
        loadConfigData: function loadConfigData() {
            var result = JSON.parse(fs.readFileSync(CONFIG_URI, 'utf8'));

            if (!result) {
                throw "Build failed: No config data found. Please confirm there is a config.json file in the compilers root directory.";
            }

            // Validate required settings
            result.settings = (result.settings == null) ? {} : result.settings;
            result.settings.ignoreHiddenFiles = (result.settings.ignoreHiddenFiles == null) ? true : result.settings.ignoreHiddenFiles;

            return result;
        },

        /**
         * Recursively describes all Javascript files in a directory and its subdirectories.
         * 
         * @param  {String} directoryPath - the directory path to the Javascript files that need to be described.
         * @return {void}
         */
        describeFilesInDirectory: function describeFilesInDirectory(directoryPath) {
            var dir     = fs.readdirSync(directoryPath),
                length  = dir.length,
                i       = 0,
                path;

            for (i = 0; i < length; i++) {
                path = directoryPath + "/" + dir[i];
                if (fs.statSync(path).isDirectory() && this.isValidDirectory(path)) {
                    this.describeFilesInDirectory(path);
                } else if (fs.statSync(path).isFile() && this.isValidFile(path)) {
                    this.describeFile(path);
                }
            }
        },

        isValidDirectory: function isValidDirectory(path) {
            var target      = path.split("/").pop(),
                configData  = this.configData,
                settings    = configData.settings,
                result      = true;

            if (settings && settings.ignoreHiddenFiles && target.indexOf(".") === 0) {
                result = false;
            }

            return result;
        },

        isValidFile: function isValidFile(path) {
            var script                  = fs.readFileSync(path, 'utf8'),
                namespacePattern        = /namespace: \"((\w|\.|\s|\t|\n)+)\"/i,
                namespaceMatch          = script.match(namespacePattern),
                target                  = path.split("/").pop(),
                configData              = this.configData,
                paths                   = configData.paths,
                settings                = configData.settings,
                result                  = true,
                matchedPath;

            if (settings && settings.ignoreHiddenFiles && target.indexOf(".") === 0) {
                return false;
            } else if (this.isJSFile(path) === false) {
                return false;
            } else if (paths && paths.ignored_files && this.isInArray(paths.ignored_files, path)) {
                return false;
            } else if (paths && paths.namespace_module && path === paths.namespace_module) {
                return false;
            } else if (paths && paths.hoisted_files && this.isInArray(paths.hoisted_files, path)) {
                return false;
            }

            namespaceMatch = (namespaceMatch != null) ? namespaceMatch[1].replace(/(\.)/g, "/") : "";
            matchedPath =  this.sourcePath + "/" + namespaceMatch + ".js";
            if (matchedPath != path) {
                console.log("Build Warning: filepath '" + path + "' did not match that of its namespace '" + matchedPath + "'.");
                return false;
            }

            return result;
        },

        isInArray: function isInArray(array, obj) {
            var result = false,
                i;

            if (this.toType(array) !== "Array") {
                return result;
            }

            for (i = array.length - 1; i >= 0; i--) {
                if (array[i] === obj) {
                    result = true;
                    break;
                }
            }

            return result;
        },

        toType: function toType(obj) {
            return (obj == null) ? "null" : Object.prototype.toString.call(obj).slice(8, -1);
        },

        /**
         * Determines whether the specified path is that of a Javascript file.
         * 
         * Pre-conditions:  This method assumes that Javascript files use the standardised file extension ".js".
         * 
         * @param  {String}  path - source path of candidate
         * @return {Boolean}
         */
        isJSFile: function isJSFile(path) {
            var fileType = path.split(".").pop();
            return fileType === "js";
        },

        /**
         * Describes a Javascript file.
         * 
         * A file description is made up of the following properties:
         *      1) A list of dependencies on other files
         *      2) A count of how many other files depend upon this file
         *      3) The contents of the file.
         *      
         * Pre-conditions:  This method assumes that dependencies have been declared using the namespace.js library.
         * 
         * @param  {[type]} filePath [description]
         * @return {void}
         */
        describeFile: function describeFile(filePath) {
            var script                  = fs.readFileSync(filePath, 'utf8'),
                dependencyBlockPattern  = /using: \[(\"(\w|\.|\s|\t|\n|\,|\")+)\]/i,
                dependenciesMatch       = script.match(dependencyBlockPattern),
                fileDescriptions        = this.fileDescriptions,
                sourcePath              = this.sourcePath,
                fileDesc,
                dependencies,
                dependency,
                dependenciesString,
                i;

            filePath = filePath.replace(sourcePath + "/", "");

            if (!fileDescriptions[filePath]) {
                fileDescriptions[filePath] = {dependencies: [], usedByCount: 0, script: script};
            }
            fileDesc = fileDescriptions[filePath];

            if (dependenciesMatch) {
                dependenciesString = dependenciesMatch[1];
                dependenciesString = dependenciesString.replace(/(\n|\t|\s|\"|\')/g, "");
                dependenciesString = dependenciesString.replace(/(\.)/g, "/");

                dependencies = dependenciesString.split(",");
                for (i = dependencies.length - 1; i >= 0; i--) {
                    dependency = dependencies[i] + ".js";
                    if (this.isValidDependency(dependency)) {
                        fileDesc.dependencies.push(dependency);
                    } else {
                        console.log("Build Warning: The file " + sourcePath + "/" + filePath + "' had a dependency on an invalid module '" + sourcePath + "/" + dependency + "'.");
                    }
                }
            }
        },

        isValidDependency: function isValidDependency(path) {
            var result      = true,
                sourcePath  = this.sourcePath;

            path = sourcePath + "/" + path;

            result = this.fileExists(path);

            return result;
        },

        fileExists: function fileExists(path) {
            var result = true;

            try {
                if (fs.statSync(path).isFile() === false) {
                    result = false;
                }
            } catch (er) {
                result = false;
            }

            return result;
        },

        /**
         * Resolves dependencies amongst all Javascript files to be compiled. 
         * This is done to ensure that depended files are placed higher up in the compiled document.
         * 
         * @return {void}
         */
        resolveDependencies: function resolveDependencies() {
            var fileDescriptions    = this.fileDescriptions,
                k;

            for (k in fileDescriptions) {
                if (fileDescriptions.hasOwnProperty(k)) {
                    this.tallyFileDependencies(k, fileDescriptions[k]);
                }
            }
        },

        /**
         * Tallies all dependencies the file at filePath has. 
         * 
         * @param  {String} filePath        - Path to the file
         * @param  {Object} fileDescription - Description object of the file
         * @return {void}
         */
        tallyFileDependencies: function tallyFileDependencies(filePath, fileDescription) {
            var configData          = this.configData,
                fileDescriptions    = this.fileDescriptions,
                dependencies        = null,
                dependency          = null,
                i;

            if (fileDescription != null) {
                dependencies = fileDescription.dependencies;
                fileDescription.usedByCount += 1;
                for (i = dependencies.length - 1; i > -1; i--) {
                    dependency = dependencies[i];
                    this.tallyFileDependencies(dependency, fileDescriptions[dependency]);
                }
            }
        },

        /**
         * Compiles all the scripts into a single file. Each scripts dependency tally determines how high in the file they are placed.it is placed.
         * 
         * @return {void}
         */
        compileScripts: function compileScripts() {
            var configData          = this.configData,
                fileDescriptions    = this.fileDescriptions,
                compiledScript      = this.compiledScript,
                descriptions        = [],
                paths               = (configData != null) ? configData.paths : null,
                namespace_module    = (paths != null) ? paths.namespace_module : null,
                hoisted_files       = (paths != null) ? paths.hoisted_files : null,
                k,
                i,
                length;

            for (k in fileDescriptions) {
                if (fileDescriptions.hasOwnProperty(k) && fileDescriptions[k] != null) {
                    descriptions.push(fileDescriptions[k]);
                }
            }

            descriptions.sort(this.sortScript);

            // Add strict mode
            compiledScript = "\"use strict\";\n";

            // Add hoisted files
            if (hoisted_files != null && this.toType(hoisted_files) === "Array") {
                for (i = 0, length = hoisted_files.length; i < length; i++) {
                    if (this.fileExists(hoisted_files[i])) {
                        compiledScript += fs.readFileSync(hoisted_files[i], 'utf8') + "\n";
                    }
                }
            }

            // Add the NamespaceJS module
            if (namespace_module != null && this.fileExists(namespace_module)) {
                compiledScript += fs.readFileSync(namespace_module, 'utf8') + "\n";
            }

            // Add scripts
            for (i = 0, length = descriptions.length; i < length; i++) {
                compiledScript += descriptions[i].script + "\n";
            }

            this.compiledScript = compiledScript;
        },

        sortScript: function sortScript(scriptDescA, scriptDescB) {
            return scriptDescB.usedByCount - scriptDescA.usedByCount;
        },

        /**
         * Saves the compiled script.
         * 
         * Pre-conditions:  - Assumes that the configuration data has been loaded.
         *                  - Assumes that the script has already been compiled.
         * 
         * @return {void}
         */
        saveCompiledScript: function saveCompiledScript() {
            var configData      = this.configData,
                compiledScript  = this.compiledScript,
                toSave          = configData.settings.uglify ? uglify(compiledScript) : compiledScript,
                paths           = configData.paths.output ? configData.paths.output.split(";") : [],
                formattedPaths,
                i,
                length;

            for (i = 0, length = paths.length; i < length; i++) {
                if (toSave != null) {
                    fs.writeFile(paths[i], toSave, 'utf8');
                    formattedPaths = (formattedPaths == null) ? "\"" + paths[i] + "\"" : formattedPaths + ", " + "\"" + paths[i] + "\"";
                } else {
                    throw "Build Failed: Compiled script could not be saved as it resolved to a null value. Please check that the source directory referenced in config.json is correct, and that your Javascript files are contained in this directory.";
                }
            }

            console.log("Build Successful: Compiled scripts were saved to " + formattedPaths + ".");
        }

    });

    Builder.start();
}());
