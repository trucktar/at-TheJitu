import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { StudentService } from '../shared/student.service';

@Component({
  selector: 'app-student-edit',
  templateUrl: './student-edit.component.html',
  styleUrls: ['./student-edit.component.css'],
})
export class StudentEditComponent implements OnInit {
  studentRegId = '';
  studentBalance = 0;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _studentService: StudentService
  ) {}

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.studentRegId = params['id'];
      const student = this._studentService.getOne(this.studentRegId);
      if (student) this.studentBalance = student.balance;
    });
  }

  onSubmit() {
    this._studentService.updateBalance(this.studentRegId, this.studentBalance);
    this._router.navigate(['/']);
  }
}
