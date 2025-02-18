import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IAuthRepository } from "../../domain/repositories/IAuth.repository";
import { catchError, Observable, throwError } from "rxjs";
import { UserLoggedIn } from "../../domain/models/Users/UserLoggedIn.model";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AuthRepository extends IAuthRepository {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
        super();
    }

    public login(email: string, password: string): Observable<UserLoggedIn> {
        return this.http.post<UserLoggedIn>(`${this.baseUrl}/auth`,
            {
                email: email,
                password: password
            }
        ).pipe(
            catchError((error) => {
                console.error('Error occurred:', error);
                return throwError(() => new Error('Something went wrong!'));
            })
        );
    }
}