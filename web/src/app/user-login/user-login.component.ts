import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

declare var google: any;
declare var $: any;

@Component({
  selector: 'app-user-login',
  standalone: false,
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})
export class UserLoginComponent {
  isGoogleLoading = false;

  // Login
  loginForm: FormGroup;
  isLoginLoading = false;
  loginError = '';

  // Register
  registerForm: FormGroup;
  isRegisterLoading = false;
  registerError = '';
  registerSuccess = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', Validators.required],
      agreeTerms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'visible';
      document.body.style.paddingRight = '0px';
    }

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
      return;
    }

    if (isPlatformBrowser(this.platformId)) {
      this.initGoogleSignIn();
    }
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirm_password')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isRegisterLoading = true;
    this.registerError = '';
    this.registerSuccess = '';

    const { first_name, last_name, email, password } = this.registerForm.value;

    this.authService.register({ first_name, last_name, email, password }).subscribe({
      next: () => {
        this.isRegisterLoading = false;
        this.registerSuccess = 'Account created successfully! Please sign in.';
        this.registerForm.reset();
        setTimeout(() => this.showLogin(), 2000);
      },
      error: (err: any) => {
        this.isRegisterLoading = false;
        this.registerError = err?.error?.message || 'Registration failed. Please try again.';
      }
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoginLoading = true;
    this.loginError = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        this.isLoginLoading = false;
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: res?.message || 'Login successful!',
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true
        });
        this.router.navigate(['/category']);
      },
      error: (err: any) => {
        this.isLoginLoading = false;
        this.loginError = err?.error?.message || 'Invalid email or password.';
      }
    });
  }

  // Login form getters
  get loginEmail() { return this.loginForm.get('email'); }
  get loginPassword() { return this.loginForm.get('password'); }

  // Register form getters
  get firstName() { return this.registerForm.get('first_name'); }
  get lastName() { return this.registerForm.get('last_name'); }
  get regEmail() { return this.registerForm.get('email'); }
  get regPassword() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirm_password'); }
  get agreeTerms() { return this.registerForm.get('agreeTerms'); }

  private initGoogleSignIn(): void {
    const waitForGoogle = setInterval(() => {
      if (typeof google !== 'undefined' && google.accounts) {
        clearInterval(waitForGoogle);
        google.accounts.id.initialize({
          client_id: 'YOUR_GOOGLE_CLIENT_ID',
          callback: (response: any) => this.handleGoogleCredential(response)
        });
      }
    }, 100);
  }

  loginWithGoogle(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.isGoogleLoading = true;
    google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        const client = google.accounts.oauth2.initCodeClient({
          client_id: 'YOUR_GOOGLE_CLIENT_ID',
          scope: 'openid email profile',
          callback: (tokenResponse: any) => {
            this.handleGoogleCredential({ credential: tokenResponse.code });
          }
        });
        client.requestCode();
      }
    });
  }

  private handleGoogleCredential(response: any): void {
    const idToken = response.credential;
    if (!idToken) {
      this.isGoogleLoading = false;
      return;
    }
    this.authService.loginWithGoogleBackend(idToken).subscribe({
      next: () => {
        this.isGoogleLoading = false;
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        console.error('Google login error:', err);
        this.isGoogleLoading = false;
      }
    });
  }

  showRegister() {
    this.registerError = '';
    this.registerSuccess = '';
    $('#registerForm').removeClass('hidden');
    $('#loginForm').addClass('hidden');
    $('#forgotPasswordForm').addClass('hidden');
  }

  showLogin() {
    $('#registerForm').addClass('hidden');
    $('#loginForm').removeClass('hidden');
    $('#forgotPasswordForm').addClass('hidden');
  }

  showForget() {
    $('#forgotPasswordForm').removeClass('hidden');
    $('#registerForm').addClass('hidden');
    $('#loginForm').addClass('hidden');
  }
}
