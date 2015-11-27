export function normalize(path) {
  return path.replace(/\/$/, "").replace(/^\//, "").replace(/(\/)+/g, "/");
}

export function  getName(path) {
  return path.match(/[^\/]*$/)[0];
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