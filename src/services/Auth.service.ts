import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthRepository } from "../infrastructure/repositories/Auth.repository";
import { catchError, map, Observable, of, tap } from "rxjs";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    claimIdentifiers: { [key: string]: string } = {
        role: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
    };

    constructor(
        private jwtHelper: JwtHelperService,
        private _repo: AuthRepository,
        @Inject(PLATFORM_ID) private platformId: object
    ) { }

    public tryLogin(email: string, password: string): Observable<boolean> {
        return this._repo.login(email, password).pipe(
            // Process the response
            tap((response) => {
                // Store the token in localStorage
                localStorage.setItem('jwtToken', response.token);
                localStorage.setItem('userId', response.userId);
                localStorage.setItem('userRole', this.getDecodedToken()[this.claimIdentifiers['role']]);
            }),
            // Map the response to a boolean to indicate success
            map(() => true),
            // Handle errors if needed and convert them to a boolean or custom error handling
            catchError((error) => {
                console.error('Login failed', error);
                return of(false); // Return false to indicate login failure
            })
        );
    }

    public isAuthenticated(): boolean {
        const token = this.getToken();

        return !this.jwtHelper.isTokenExpired(token);
    }

    public hasRole(role: string): boolean {
        const userRole = localStorage.getItem('userRole');

        return userRole === role;
    }

    public getToken(): string | null {
        return this.getLocalStorageItem('jwtToken');
    }

    private getDecodedToken(): any {
        const token = this.getToken();

        if (!token) {
            console.error('No token found');
            return null;
        }

        return this.jwtHelper.decodeToken(token);
    }

    private getLocalStorageItem(item: string): any {
        return isPlatformBrowser(this.platformId) ? localStorage.getItem(item) : null;
    }
}