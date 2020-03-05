import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { TabViewModule, DropdownModule, CalendarModule, InputTextareaModule, ButtonModule, ListboxModule } from 'primeng/primeng';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ListComponent } from './list/list.component';
import { firebaseConfig } from '../assets/firebase-config';
import { AppService } from './app.service';
import { HttpClientModule } from '@angular/common/http';
import { KeyinComponent } from './keyin/keyin.component';
import { FormsModule } from '@angular/forms';
import { CategoryComponent } from './category/category.component';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    KeyinComponent,
    CategoryComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    TabViewModule,
    HttpClientModule,
    FormsModule,
    DropdownModule,
    CalendarModule,
    DropdownModule,
    InputTextareaModule,
    InputTextareaModule,
    ButtonModule,
    ListboxModule
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
