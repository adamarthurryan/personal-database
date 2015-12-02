import * as PathTools from './PathTools'

export function titleize(path) {
  if (PathTools.isRoot(path))
    return "Root"

  let name = PathTools.getName(path);

  let title = name.replace(/([^ ])-([^])/g, '$1 $2');
  let words = title.split(' ');
  words=words.map(word => word.slice(0,1).toUpperCase()+word.slice(1).toLowerCase());
  return words.join(' ');
}
