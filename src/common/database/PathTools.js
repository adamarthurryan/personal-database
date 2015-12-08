export const ROOT = "~"

export function normalize(path) {
  let normPath = path.replace(/\\/g, "/").replace(/(\/)+/g, "/").replace(/\/$/, "").replace(/^\//, "");
  if (normPath == "")
    return ROOT
  else 
    return normPath 
}

export function  getName(path) {
  if (path == ROOT)
    return ""
  return path.match(/[^\/]*$/)[0];
}

//returns the extension as eg. '.js'
//paths with no extension or names that begin with . (eg. '.bashrc') will return null
export function  getExtension(path) {
  let match = path.match(/[^\/]+(\.[^\.\/]+)$/);

  if (match==null)
    return "";

  return match[1];
}

//strips the extension if the path has one
export function stripExtension(path) {
  return path.replace(/([^\/]+)\.[^\.\/]+$/, "$1");
}

export function  isDescendantOf(path, parentPath) {
  if (parentPath == ROOT) parentPath = ""
  return path.match("^"+parentPath+"(^|/).*$") != null;
}

export function  isChildOf(path, parentPath) {
  if (parentPath == ROOT) parentPath = ""
  return (parentPath.length < path.length) && (path.match("^"+parentPath+"(^|/)[^/]*$") != null)       
}

export function hasParent(path) {
  return path != ROOT;
}

export function getParent(path) {
  if (!hasParent(path))
    return null;

  let i = path.lastIndexOf('/');

  if (i < 0)
    return ROOT;

  return path.slice(0, i);
}

export function isRoot(path) {
  return path == ROOT;
}