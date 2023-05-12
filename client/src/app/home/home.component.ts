import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, map, of } from 'rxjs';
import { GET_USERS } from '../gql/users';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  registerMode = false;
  users: any;

  constructor() {}

  ngOnInit(): void {}
  ngOnInit(): void {
    this.getMembersGql();
  }

  getMembersGql() {
    this.members$ = this.apollo
      .watchQuery<{ members: any }>({ query: GET_USERS })
      .valueChanges.pipe(map((result) => result.data.members));
  }

  getUsers() {
    this.http.get('http://localhost:5251/api/users').subscribe({
      next: (response) => (this.users = response),
      error: (error) => console.log('getUsers err: ', error),
      complete: () => console.log('request completed'),
    });
  }

  registerToggle() {
    this.registerMode = !this.registerMode;
  }

  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
  }
}
