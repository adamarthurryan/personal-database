export function normalize(path) {
  return path.replace(/\\/g, "/").replace(/(\/)+/g, "/").replace(/\/$/, "").replace(/^\//, "");
}

export function  getName(path) {
  return path.match(/[^\/]*$/)[0];
}

//returns the extension as eg. '.js'
//paths with no extension or names that begin with . (eg. '.bashrc') will return null
export function  getExtension(path) {
  let match = path.match(/[^\/]+(\.[^\.\/]+)$/);

  if (match==null)
    return match;

  return match[1];
}

//strips the extension if the path has one
export function stripExtension(path) {
  return path.replace(/([^\/]+)\.[^\.\/]+$/, "$1");
}

export function  isDescendantOf(path, parentPath) {
  return path.match("^"+parentPath+"(^|/).*$") != null;
}

export function  isChildOf(path, parentPath) {
  return (parentPath.length < path.length) && (path.match("^"+parentPath+"(^|/)[^/]*$") != null)       
}

export function hasParent(path) {
  return path != "";
}

export function getParent(path) {
  if (!hasParent(path))
    return null;

  let i = path.lastIndexOf('/');

  if (i < 0)
    return "";

  return path.slice(0, i);
}

export function isRoot(path) {
  return path == "";
}