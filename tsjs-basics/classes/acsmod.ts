class Currency {
  readonly code: string;
  readonly symbol: string;

  private constructor(code: string, symbol: string) {
    console.log("Instantiating currency...");

    this.code = code;
    this.symbol = symbol;

    console.log("Currency code:", code, "\nSymbol:", symbol);
  }

  static getInstance(code = "USD", symbol = "$") {
    return new Currency(code, symbol);
  }
}

Currency.getInstance();
Currency.getInstance("EUR", "€");

// Func to add unkown count of numbers
const addAll = (...nums: number[]) => nums.reduce((a, b) => a + b, 0);
console.log(addAll(1, 2, 3, 4, 5));
