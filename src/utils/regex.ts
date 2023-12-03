export function match(s: string, p: RegExp): RegExpExecArray[] {
  if (!p.global) {
    const m = p.exec(s);
    return m ? [m] : [];
  }

  const a = [];
  let m;
  while ((m = p.exec(s))) {
    a.push(m);
  }
  return a;
}
