#!/usr/bin/env node
var fs, path, colors, prefix, local, patchTraverse, wd, _wd, locateNpm, root;
fs = require('fs');
path = require('path');
colors = require('@plotdb/colors');
prefix = "[patch-punycode]".gray;
local = {
  count: 0
};
patchTraverse = function(n){
  var str, e;
  try {
    if (fs.statSync(n).isDirectory()) {
      return fs.readdirSync(n).map(function(f){
        return patchTraverse(path.join(n, f));
      });
    }
    if (/\.js$/.exec(n)) {
      if (/require\(['"]punycode["']\)/.exec(str = fs.readFileSync(n, 'utf-8'))) {
        console.log((prefix + " - patch: ") + n.yellow);
        str = str.replace(/require\(['"]punycode["']\)/, "require('punycode/')");
        local.count++;
        return fs.writeFileSync(n, str);
      }
    }
  } catch (e$) {
    return e = e$;
  }
};
wd = path.resolve(_wd = (process.argv.lsc
  ? process.argv.lsc[1]
  : process.argv[2]) || process.cwd());
locateNpm = function(n){
  var _n, e;
  _n = path.join(n, 'node_modules');
  try {
    if (fs.statSync(_n).isDirectory()) {
      return _n;
    }
  } catch (e$) {
    e = e$;
  }
  _n = path.resolve(path.join(n, '..'));
  if (_n === n) {
    return null;
  }
  return locateNpm(_n);
};
console.log((prefix + " finding node_modules in ") + _wd.cyan + " ...");
if (root = locateNpm(wd)) {
  console.log((prefix + " node_modules found: ") + root.green);
  console.log(prefix + " traversing ...");
  patchTraverse(root);
  console.log((prefix + " total ") + (local.count + "").cyan + (" file" + (local.count > 1 ? 's' : '') + " patched."));
} else {
  console.log((prefix + " ") + "No node_modules found.".red);
  process.exit(-1);
}
