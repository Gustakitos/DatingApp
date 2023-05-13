import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, map, of } from 'rxjs';
import { GET_USERS } from '../gql/users';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  registerMode = false;
  users: any;

  constructor() {}

  ngOnInit(): void {
    // this.getMembersGql();
  }

  registerToggle() {
    this.registerMode = !this.registerMode;
  }

  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
  }
}
