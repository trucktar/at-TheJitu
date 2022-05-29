import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Student } from '../shared/student';
import { StudentService } from '../shared/student.service';

@Component({
  selector: 'app-student-add',
  templateUrl: './student-add.component.html',
  styleUrls: ['./student-add.component.css'],
})
export class StudentAddComponent implements OnInit {
  studentForm = new FormGroup({
    regId: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    contactDetails: new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.pattern(/@thejitu\.com$/i),
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(/^01|7/),
      ]),
    }),
    course: new FormControl('', Validators.required),
    balance: new FormControl(0),
  });

  constructor(
    private _router: Router,
    private _studentService: StudentService
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    this._studentService.addOne(<Student>this.studentForm.value);
    this._router.navigate(['/']);
  }
}
