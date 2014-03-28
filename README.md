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

This will detect `<!-- unfold:js scripts/*.js --> ... <!-- /unfold --> blocks in your index.html and rebuild the list of script tags from the matching files.

```js
grunt.initConfig({
  unfold: {
      {
	      root: 'path/to/www/root'
	  },
      files: ['index.html'] // Which html files to process
  },
})
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
