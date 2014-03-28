# grunt-unfold

> Inserts script tags based on a folder path or file pattern

## Getting Started

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-unfold --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-unfold');
```

## The "unfold" task

### Overview
_Run this task with the `grunt unfold` command._

This will detect `<!-- unfold:TYPE PATH --> ... <!-- /unfold -->` blocks in your html files and rebuild the list of script tags from the matching files.

* **PATH** is a globbing pattern, such as \*.js, scripts/\*\*/\*.js etc.
* **TYPE** defines the tag template to insert;
  * **js** inserts a `<script src="foo.js"></script>`
  * **css** inserts a `<link rel="stylesheet" href="foo.cs" />`
  * **img** inserts a `<img src="foo.png" />`

### Options

#### templates

You can define a custom template for existing and custom types. You need to define the `$PATH$` variable in the template where you want the source path to be inserted.

```js
grunt.initConfig({
  unfold: {
    options: {
      root: 'path/to/www/root',
      templates: {
        'async-js': {
		  template: '<script src="$PATH$" type="text/javascript" async></script>'
		}
      }
    },
    files: ['index.html']
  },
})
```

### Usage Example

#### In "Gruntfile.js"

```js
grunt.initConfig({
  unfold: {
    files: ['index.html'] // Which html files to process
  },
})
```

#### In "index.html"

```html
<html>
  <head>
    <!-- unfold:css style/*.css -->
	This will be overwritten
	<!-- /unfold -->
  </head>
  <body>
    <!-- unfold:js scripts/*.js -->
	This will be overwritten
	<!-- /unfold -->
  </body>
</html>
```

## License

Copyright (c) 2014 Christian Rondeau. Licensed under the MIT license.

## Thanks

Thanks to Scott Laursen for [grunt-scriptlinker](http://github.com/scott-laursen/grunt-scriptlinker), from which this project was greatly inspired.
