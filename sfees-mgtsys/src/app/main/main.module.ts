import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MainComponent } from './main.component';
import { MainRoutingModule } from './main-routing.module';
import { StudentListComponent } from './student-list/student-list.component';
import { StudentAddComponent } from './student-add/student-add.component';
import { StudentEditComponent } from './student-edit/student-edit.component';
import { StudentService } from './shared/student.service';

@NgModule({
  declarations: [
    MainComponent,
    StudentListComponent,
    StudentAddComponent,
    StudentEditComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MainRoutingModule],
  providers: [StudentService],
})
export class MainModule {}
