//!!! This config should be set alongside the other webpack config files in ../cfg
var config =  {
  /* upgraded to babel 6 to be able to use this preset */
  presets: ["node5"],
  sourceMaps: "both",
  highlightCode: false
};

require('babel-core/register')(config);
require('./server');