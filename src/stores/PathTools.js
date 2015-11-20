
export function normalize(path) {
  return path.replace(/\/$/, "").replace(/^\//, "");
}

export function  getNamePart(path) {
  return path.match(/[^\/]*$/)[0];
}

export function  isDescendantOf(path, parentPath) {
  return path.match("^"+parentPath+"(^|/).*$");
}

export function  isChildOf(path, parentPath) {
  return path.match("^"+parentPath+"(^|/)[^/]*$") 
        && (parentPath.length < path.length)
}
