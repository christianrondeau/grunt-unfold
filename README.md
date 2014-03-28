# grunt-unfold

> Inserts script tags based on a folder path or file pattern

## Getting Started
This plugin requires Grunt `~0.4.0`

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

* **PATH** is a globbing pattern, such as *.js, scripts/**/*.js etc.
* **TYPE** defines the tag template to insert;
** **js** Inserts a `<script src="foo.js"></script>`
** **css** Inserts a `<link rel="stylesheet" href="foo.cs" />`
** **img** Inserts a `<img src="foo.png" />`

```js
grunt.initConfig({
  unfold: {
    options: {
      root: 'path/to/www/root'
    },
    files: ['index.html'] // Which html files to process
  },
})
```

### Options

#### templates

You can define a custom template for existing and custom types. You need to define the `$PATH$` variable in the template where you want the source path to be inserted.

```js
grunt.initConfig({
  unfold: {
    options: {
      root: 'path/to/www/root',
      templates: {
        js: {
		  template: 'script src="$PATH$" type="text/javascript"></script>'
		}
      }
    },
    files: ['index.html']
  },
})
```


```

### Usage Example

```html
<html>
  <head>
    <!-- unfold:js scripts/*.js -->
	<script src="scripts/this-will-be-regenerated.js"></script>
	<!-- /unfold -->
  </head>
```

## Upcoming features:

* Ability to provide custom templates
* Ability to specify css lists and custom lists (e.g.: `{ type: 'custom', template: '<custom>$1</custom>' }` would match `<!-- unfold:custom *.txt -->`)

## Thanks

Thanks to Scott Laursen for [grunt-scriptlinker](http://github.com/scott-laursen/grunt-scriptlinker), from which this project was greatly inspired.
