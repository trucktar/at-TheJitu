import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Student } from '../shared/student';
import { StudentService } from '../shared/student.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css'],
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  selectedStudents: Student[] = [];

  constructor(
    private _router: Router,
    private _studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.students = this.selectedStudents = this._studentService.getAll();
  }

  getStudents(event: Event) {
    const studentFilter = <HTMLSelectElement>event.target;
    const category = studentFilter.options[studentFilter.selectedIndex].value;

    this._router.navigate(['/']);
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
}
