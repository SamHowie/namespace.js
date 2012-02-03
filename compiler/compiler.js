(function() {
	var	fs					= require('fs'),
		uglify				= require("./uglify-js"),
		CONFIG_URI			= process.argv[2] || "config.json",
		Builder;

	Builder = Object.create({
		// Properties
		configData:			null,
		fileDescriptions:	null,
		sourcePath:			null,
		compiledScript:		null,

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
		 * Pre-conditions:	This method assumes that the Builder has been initialised, and its configuration data has been loaded.
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
		 * Pre-conditions:	This method assumes that CONFIG_URI has been set. This is passed to the compiler.js script as a parameter.
		 *					If not defined, it assumes the file sits in the same directory as compiler.js.
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
			var	dir		= fs.readdirSync(directoryPath),
				length	= dir.length,
				i		= 0,
				path;

			for (i = 0; i < length; i++) {
				path = directoryPath + "/" + dir[i];
				if (this.isValidPath(dir[i])) {
					if (fs.statSync(path).isDirectory()) {
						this.describeFilesInDirectory(path);
					} else if (this.isJSFile(path)) {
						this.describeFile(path);
					}
				}
			}
		},

		/**
		 * Validates a directory path. 
		 * 
		 * Invalid paths:
		 *		- Any path that begins with "." (if ignoreHiddenFiles is set in config.json).
		 *		
		 * Pre-conditions:	This method assumes that the configuration data has been loaded.
		 * 
		 * @param  {String}  path - directory path
		 * @return {Boolean}
		 */
		isValidPath: function isValidPath(path) {
			var configData	= this.configData,
				settings	= configData.settings,
				result		= true;

			result = (settings && settings.ignoreHiddenFiles && path.indexOf(".") === 0) ? false : result;
			return result;
		},

		/**
		 * Determines whether the specified path is that of a Javascript file.
		 * 
		 * Pre-conditions:	This method assumes that Javascript files use the standardised file extension ".js".
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
		 *		1) A list of dependencies on other files
		 *		2) A count of how many other files depend upon this file
		 *		3) The contents of the file.
		 *		
		 * Pre-conditions:	This method assumes that dependencies have been declared using the namespace.js library.
		 * 
		 * @param  {[type]} filePath [description]
		 * @return {void}
		 */
		describeFile: function describeFile(filePath) {
			var script					= fs.readFileSync(filePath, 'utf8'),
				dependencyBlockPattern	= /using: \[(\"(\w|\.|\s|\t|\n|\,|\")+)\]/i,
				match					= script.match(dependencyBlockPattern),
				fileDescriptions		= this.fileDescriptions,
				sourcePath				= this.sourcePath,
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

			if (match) {
				dependenciesString = match[1];
				dependenciesString = dependenciesString.replace(/(\n|\t|\s|\"|\')/g, "");
				dependenciesString = dependenciesString.replace(/(\.)/g, "/");

				dependencies = dependenciesString.split(",");
				for (i = dependencies.length - 1; i >= 0; i--) {
					dependency = dependencies[i] + ".js";
					fileDesc.dependencies.push(dependency);
				}
			}
		},

		/**
		 * Resolves dependencies amongst all Javascript files to be compiled. 
		 * This is done to ensure that depended files are placed higher up in the compiled document.
		 * 
		 * @return {void}
		 */
		resolveDependencies: function resolveDependencies() {
			var fileDescriptions	= this.fileDescriptions,
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
			var	configData			= this.configData,
				fileDescriptions	= this.fileDescriptions,
				dependencies		= null,
				dependency			= null,
				i;

			if (fileDescription != null) {
				dependencies = fileDescription.dependencies;
				fileDescription.usedByCount += 1;
				if (configData.settings.priorities && configData.settings.priorities[filePath]) {
					fileDescription.usedByCount = configData.settings.priorities[filePath];
				}
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
			var fileDescriptions	= this.fileDescriptions,
				compiledScript		= this.compiledScript,
				descriptions		= [],
				k,
				i,
				length;

			for (k in fileDescriptions) {
				if (fileDescriptions.hasOwnProperty(k) && fileDescriptions[k] != null) {
					descriptions.push(fileDescriptions[k]);
				}
			}

			descriptions.sort(this.sortScript);

			compiledScript = "\"use strict\";\n";
			length = descriptions.length;
			for (i = 0; i < length; i++) {
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
		 * Pre-conditions:	- Assumes that the configuration data has been loaded.
		 *					- Assumes that the script has already been compiled.
		 * 
		 * @return {void}
		 */
		saveCompiledScript: function saveCompiledScript() {
			var configData		= this.configData,
				compiledScript	= this.compiledScript,
				toSave			= configData.settings.uglify ? uglify(compiledScript) : compiledScript,
				paths			= configData.paths.output ? configData.paths.output.split(";") : [],
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

	Builder.init().build();
}());
