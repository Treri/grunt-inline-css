## grunt-inline-css
insert css styles to js files

### Usage

Assume we have some js files and css files and every js file have corresponding css file.

We may want put the css file to js file. So that we can only have one request when using require.js

Thus, we can use the grunt plugin.


Below example config, will insert every css file's content in css directory to corresponding js file in controllers directory.

```js
grunt.initConfig({
  inline_css: {
    dist: {
      options: {
        main: 'main.js'
        // the addStyle function will apend to the file.
        // If no `options.main` applied, no addStyle function will be added.
      },
      expand: true,
      cwd: 'css',
      src: [
        '**/*.css'
      ],
      dest: 'controllers',
      ext: '.js'
    }
  }
});
```

### License
MIT