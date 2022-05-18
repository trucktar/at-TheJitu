import { Component, OnInit } from '@angular/core';

import { Student } from '../student';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css'],
})
export class BodyComponent implements OnInit {
  students: Student[] = [];
  selectedStudents: Student[] = this.students;
  errorMsg = '';
  sortVal = '';

  nameInput: HTMLInputElement | null = null;
  balanceInput: HTMLInputElement | null = null;

  constructor() {}

  onSubmit(event: SubmitEvent) {
    event.preventDefault();
    const controls = (<HTMLFormElement>event.target).elements;

    this.nameInput = <HTMLInputElement>controls[0];
    this.balanceInput = <HTMLInputElement>controls[1];

    const studentName = this.nameInput.value.trim();
    const studentBalance = parseInt(this.balanceInput.value) || 0;

    if (!studentName) this.displayError("A student's name is required");
    else if (this.students.find((student) => student.name === studentName))
      this.displayError("Student's name already exists");
    else {
      const student: Student = { name: studentName, balance: studentBalance };
      this.students.push(student);

      this.nameInput.value = '';
      this.balanceInput.value = '';
    }
  }

  getStudents(category: '+b' | '-b' | void) {
    switch (category) {
      case '+b':
        this.selectedStudents = this.students.filter(
          (student) => student.balance > 0
        );
        break;
      case '-b':
        this.selectedStudents = this.students.filter(
          (student) => student.balance <= 0
        );
        break;
      default:
        this.selectedStudents = this.students;
        break;
    }
  }

  sortData(by: 'name' | 'balance') {
    if (by === 'name') this.sortVal = 'name';
    else this.sortVal = 'balance'
  }

  private displayError(msg: string) {
    this.errorMsg = msg;
    setTimeout(() => (this.errorMsg = ''), 5000);
  }

  ngOnInit(): void {}
}
