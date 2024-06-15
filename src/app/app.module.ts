import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableComponent } from './table/table.component';
import { TaskComponent } from './task/task.component';
import { LoginPromptComponent } from './login-prompt/login-prompt.component';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    TaskComponent,
    LoginPromptComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
