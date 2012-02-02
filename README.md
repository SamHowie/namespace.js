# NamespaceJS

**NamespaceJS** is a Javascript file and module management system. It allows you to seperate your code out across multiple files and modules, handling the dirty work of dependency management for you.


## The Problem

* As Web Applications become larger and more complex, so too do their code bases.
* Working on a large single file is cumbersome. 
* Manually maintaining multiple files is a dependency nightmare.


## The Solution

A **management system** that provides:

1. A boiler plate for defining files/modules and their dependencies.
2. A NodeJS script to compile your Javascript files and modules into a single file.


### Why Not AMD?

* AMD requires each Javascript module/file to be loaded individually. This inflates the number of HTTPRequests being made and ultimately slows your page load time.
* AMD's asynchronous loading adds an unnecessary second phase of page loading once the document is loaded. This delays the responsiveness of your Javascript and end user experience.


## Installation

1. mkdir ~/GitHub
2. cd ~/GitHub
3. git clone git@github.com:SamHowie/Namespace.js.git

## Usage


