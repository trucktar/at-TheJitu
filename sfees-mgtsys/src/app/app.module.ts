import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Routing
import { AppRoutingModule } from './app-routing.module';
// Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MainComponent } from './main/main.component';
import { LoginComponent } from "./login/login.component";
import { FooterComponent } from './footer/footer.component';
import { StudentListComponent } from './main/student-list/student-list.component';
import { StudentDetailComponent } from './main/student-detail/student-detail.component';
// Pipes
import { SortPipe } from './sort.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MainComponent,
    LoginComponent,
    FooterComponent,
    StudentListComponent,
    StudentDetailComponent,
    SortPipe
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
