import { Injectable } from '@angular/core';
import { Student } from './student';

@Injectable()
export class StudentService {
  students: Student[] = [
    {
      regId: '1',
      name: 'Benjamin Nyota',
      contactDetails: {
        email: 'benjamin.nyota@thejitu.com',
        phone: '07123456768',
      },
      course: 'The Jitu Training',
      balance: 0,
    },
    {
      regId: '2',
      name: 'Freddie Mwau',
      contactDetails: {
        email: 'feddie.mwau@thejitu.com',
        phone: '07234567689',
      },
      course: 'The Jitu Training',
      balance: 0,
    },
    {
      regId: '3',
      name: 'Harrison Gacheru',
      contactDetails: {
        email: 'harrison.gacheru@thejitu.com',
        phone: '07345676890',
      },
      course: 'The Jitu Training',
      balance: 0,
    },
  ];

  constructor() {}

  addOne(student: Student) {
    this.students.push(student);
  }

  getOne(studentRegId: string) {
    return this.students.find((student) => student.regId === studentRegId);
  }

  getAll() {
    return this.students;
  }

  getAllWithBalance() {
    return this.students.filter((student) => student.balance > 0);
  }

  getAllWithoutBalance() {
    return this.students.filter((student) => student.balance <= 0);
  }

  updateBalance(studentRegId: string, studentBalance: number) {
    const student = this.getOne(studentRegId);
    if (student) student.balance = studentBalance;
  }

  deleteOne(studentRegId: string) {
    this.students.splice(
      this.students.findIndex((student) => student.regId === studentRegId),
      1
    );
  }
}
