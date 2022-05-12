# Classes

TypeScript adds type annotations and other syntax to express relationships between classes and other types.

## Class Members

### Fields

- By default, **field declaration** creates a public writeable property on a class
- The **initializer** of a class property is used to infer its type
- The `readonly` modifier prevents assignment outside the constructor

### Constructors

- Can take parameters with type annotations, default values, and overloads
- Constructors can’t have type parameters - these belong on the outer class declaration
- Constructors can’t have return type annotations - the class instance type is always what’s returned
- **`super()`** calls come before any **`this.`** members

### Methods

- Other than the standard type annotations, TypeScript doesn’t add anything else new to methods
- An unqualified name in a method body will always refer to something in the enclosing scope

### Getters / Setters

- Field-backed get/set pairs with no extra logic are rarely useful. It's fine to expose them as public fields
- It is possible to have accessors with different types for getting and setting

### Index Signatures

- Like other object types, classes can declare index types
- Generally, it’s better to store indexed data in another place instead of on the class instance itself

```js
class MyClass {
  [s: string]: boolean | ((s: string) => boolean);

  check(s: string) {
    return this[s] as boolean;
  }
}
```

## Class Heritage

### implements
