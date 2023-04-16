import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Dating app';
  users: any;

  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.http.get('http://localhost:5251/users').subscribe({
      next: (response) => (this.users = response),
      error: (error) => console.log('getUsers err: ', error),
      complete: () => console.log('request completed'),
    });
  }
}
