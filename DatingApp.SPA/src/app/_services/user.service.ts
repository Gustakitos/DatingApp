import { Http, RequestOptions, Headers} from '@angular/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { User } from '../_models/User';
import { AuthHttp } from 'angular2-jwt';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

constructor(private authHttp: AuthHttp) { }

  getUsers(): Observable<User []> {
    return this.authHttp.get(this.baseUrl + 'users')
      .map(response => <User[]>response.json())
      .catch(this.handleError);
  }

  getUser(id): Observable<User> {
    return this.authHttp
      .get(this.baseUrl + 'users/' + id)
      .map(response => <User>response.json())
      .catch(this.handleError);
  }

  updateUser(id: Number, user: User) {
    return this.authHttp.put(this.baseUrl + 'users/' + id, user);
  }

private handleError(error: any) {
  const applicationError = error.headers.get('Application-Error');

  if (applicationError) {
    return Observable.throw(applicationError);
  }

  const serverError = error.json();
  let modelStateErrors = '';
  if (serverError) {
    for (const key in serverError) {
      if (serverError[key]) {
      modelStateErrors += serverError[key] + '\n';
    }
    }
  }

  return Observable.throw(
    modelStateErrors || 'Server error'
  );

}

}
