import { Observable } from "rxjs";
import { UserLoggedIn } from "../models/Users/UserLoggedIn.model";

export abstract class IAuthRepository {
    abstract login(email: string, password: string): Observable<UserLoggedIn>;
}