var Path = require('path');

var srcRoot = Path.join(__dirname, 'src')//.replace(/\\/g, "/")

//!!! This config should be set alongside the other webpack config files in ../cfg
var config =  {
  /* upgraded to babel 6 to be able to use this preset */
  presets: ["node5"],
  sourceMaps: "both",
  //highlightCode: false,
  sourceRoot: srcRoot,
  only: /src/

};

require('babel-core/register')(config);


const PIPING = true

//!!! Need to guard for production environments
//if (process.env.NODE_ENV !== "production") {
if (PIPING)
  if (!require("piping")({hook: true, includeModules: false})) {
    return;
  }
//}

try {
  require('./src/server/server');
}
catch (error) {
  console.error(error.stack);
}
