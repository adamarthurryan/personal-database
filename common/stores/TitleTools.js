import * as PathTools from 'stores/PathTools'

export function titleize(path) {
  let name = PathTools.getName(path);

  let title = name.replace(/([^ ])-([^])/g, '$1 $2');
  let words = title.split(' ');
  words=words.map(word => word.slice(0,1).toUpperCase()+word.slice(1).toLowerCase());
  return words.join(' ');
}
