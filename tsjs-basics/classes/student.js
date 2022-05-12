class FourthYearStudent {
  constructor(name, age, units) {
    this.name = name;
    this.age = age;
    this.units = units;
  }

  static getYearOfStudy() {
    return 4;
  }

  getStudentAge() {
    return this.age;
  }
}

// Create a FourthYearStudent instance
const student1 = new FourthYearStudent("John Doe", 24, [
  "Compiler Construction",
  "Distributed Systems",
  "Network and Systems Security",
]);

// Log the instance's properties
console.log(student1.name);
console.log(student1.age);
console.log(student1.units);

// Log output of getYearOfSTudy static method call on class
console.log(FourthYearStudent.getYearOfStudy());

// Log output of getStudentAge method call on the instance
console.log(student1.getStudentAge());
