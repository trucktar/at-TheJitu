const fizzBuzz = () => {
  let m3, m5;
  for (let i = 1; i <= 100; i++) {
    m3 = isExactDivisor(i, 3);
    m5 = isExactDivisor(i, 5);

    if (m3 && m5) console.log("FIZZBUZZ");
    else if (m3) console.log("FIZZ");
    else if (m5) console.log("BUZZ");
    else console.log(i);
  }
};

const isExactDivisor = (dividend, divisor) => {
  if (dividend % divisor == 0) return true;
  return false;
};
