import { Component, OnInit } from '@angular/core';

import { Student } from '../shared/student';
import { StudentService } from '../shared/student.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css'],
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  constructor(private _studentService: StudentService) {}

  ngOnInit(): void {
    this.students = this._studentService.getAll();
  }
}
