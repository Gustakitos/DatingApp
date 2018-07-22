import { Injectable } from '../../../node_modules/@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '../../../node_modules/@angular/router';
import { User } from '../_models/User';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { catchError } from '../../../node_modules/rxjs/operators';
import { of, Observable } from '../../../node_modules/rxjs';

@Injectable()
export class MemberDetailResolver implements Resolve<User> {
    constructor(private userService: UserService,
        private router: Router, private alertify: AlertifyService) {}

        resolve(route: ActivatedRouteSnapshot): Observable<User> {
            return this.userService.getUser(route.params['id']).pipe(
                catchError(error => {
                    this.alertify.error('Problem retrieving data');
                    this.router.navigate(['/members']);
                    return of(null);
                })
            );
        }
}
