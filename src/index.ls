require! <[fs path @plotdb/colors]>

prefix = "[patch-punycode]".gray
local = count: 0

patch-traverse = (n) ->
  try
    if fs.stat-sync(n).is-directory! =>
      return fs.readdir-sync(n).map (f) -> patch-traverse path.join(n, f)
    if /\.js$/.exec(n) =>
      if /require\(['"]punycode["']\)/.exec(str = fs.read-file-sync(n, \utf-8)) =>
        console.log "#prefix - patch: " + (n).yellow
        str = str.replace /require\(['"]punycode["']\)/, "require('punycode/')"
        local.count++
        fs.write-file-sync n, str
  catch e

wd = path.resolve(_wd = (if process.argv.lsc => process.argv.lsc.1 else process.argv.2) or process.cwd!)

locate-npm = (n) ->
  _n = path.join(n, \node_modules)
  try if fs.stat-sync(_n).is-directory! => return _n catch e =>
  _n = path.resolve(path.join(n, \..))
  if _n == n => return null
  locate-npm(_n)

console.log "#prefix finding node_modules in " + (_wd).cyan + " ..."
if root = locate-npm(wd) =>
  console.log "#prefix node_modules found: " + (root).green
  console.log "#prefix traversing ..."
  patch-traverse(root)
  console.log "#prefix total " + "#{local.count}".cyan + " file#{if local.count > 1 => 's' else ''} patched."
else
  console.log "#prefix " + "No node_modules found.".red
  process.exit -1
