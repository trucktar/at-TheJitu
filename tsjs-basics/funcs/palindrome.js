const isPalindrome = (x) => {
  const xstring = x.toString();
  const xlen = xstring.length;

  let fi, fl;
  for (let i = 1; i < xstring.length + 1; i++) {
    fi = xstring[i - 1];
    fl = xstring[xlen - i];

    if (fi !== fl) return false;
  }
  return true;
};
