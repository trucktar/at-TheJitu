var Currency = /** @class */ (function () {
    function Currency(code, symbol) {
        console.log("Instantiating currency...");
        console.log("Currency code:", code, "\nSymbol:", symbol);
        this.code = code;
        this.symbol = symbol;
    }
    Currency.getInstance = function (code, symbol) {
        if (code === void 0) { code = "USD"; }
        if (symbol === void 0) { symbol = "$"; }
        return new Currency(code, symbol);
    };
    return Currency;
}());
Currency.getInstance();
Currency.getInstance("EUR", "€");
// Func to add unkown count of numbers
var addAll = function () {
    var nums = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        nums[_i] = arguments[_i];
    }
    return nums.reduce(function (a, b) { return a + b; }, 0);
};
console.log(addAll(1, 2, 3, 4, 5));
