import { Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { merge } from 'rxjs';
import { AuthService } from '../../../services/Auth.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    public loginForm: FormGroup;

    errorMessages = signal<{ [key: string]: string | null }>({});

    constructor(
        protected _authService: AuthService,
        protected _router: Router
    ) {
        this.initForm();

        merge(
            ...Object.values(this.loginForm.controls).map(control =>
                merge(control.statusChanges, control.valueChanges)
            )
        )
            .pipe(takeUntilDestroyed())
            .subscribe(() => this.updateErrorMessages());
    }

    public tryLogin() {
        if (this.loginForm.valid) {
            const formData = this.loginForm.value;

            this._authService
                .tryLogin(formData.email, formData.password)
                .subscribe({
                    next: (response) => {
                        console.log('User logged in:', response);

                        this._router.navigate(['']);
                    },
                    error: (err) => {
                        //this.loginFailed = true;
                        console.error('Login error:', err);
                    },
                });
        } else {
            console.log("Invalid data!");
        }
    }

    private initForm(): void {
        this.loginForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required, Validators.minLength(10)])
        });
    }

    updateErrorMessages() {
        const messages: { [key: string]: string | null } = {};

        Object.entries(this.loginForm.controls).forEach(([key, control]) => {
            if (control.hasError('required')) {
                messages[key] = `${this.getFieldName(key)} is required`;
            } else if (control.hasError('email')) {
                messages[key] = 'Not a valid email';
            } else if (control.hasError('minlength')) {
                const requiredLength = control.getError('minlength')?.requiredLength;
                messages[key] = `${this.getFieldName(key)} must be at least ${requiredLength} characters long`;
            } else {
                messages[key] = null;
            }
        });

        this.errorMessages.set(messages);
    }

    private getFieldName(field: string): string {
        const fieldNames: { [key: string]: string } = {
            email: 'E-mail',
            password: 'Password',
        };

        return fieldNames[field] || field;
    }
}
