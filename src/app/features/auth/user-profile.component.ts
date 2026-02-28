import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/serivces/auth.service';
import { UserService, User, FileState, FilePayload } from '../../core/serivces/user.service';
import { NotificationService } from '../../core/serivces/notification.service';
import { LoadingService } from '../../shared/services/loading.service';
import { DynamicFormComponent } from '../../shared/components/dynamic-form/dynamic-form.component';
import { BaseFormField, TextField, UploadField, GridSection } from '../../shared/models/form.model';
import { Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-user-profile',
    standalone: true,
    imports: [CommonModule, DynamicFormComponent],
    template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-10">
          <div class="glass-card p-0 overflow-hidden rounded-4 shadow-lg animate-fade-in">
            <!-- Profile Header/Banner -->
            <div class="profile-banner"></div>
            
            <div class="profile-content p-4 p-md-5">
              <div class="row align-items-start mt-n5 mb-4">
                <div class="col-auto mt-n5">
                    <div class="avatar-wrapper shadow-lg">
                        <img [src]="user?.avatarUrl ? (url + '/' + user?.avatarUrl) : 'assets/images/default-avatar.png'" 
                             class="rounded-circle border border-4" alt="Avatar">
                    </div>
                </div>
                <div class="col mt-2 pt-2">
                    <h2 class="fw-bold mb-1 text-main">{{ user?.nickname || user?.userName }}</h2>
                    <p class="text-muted mb-0">
                        <i class="fas fa-envelope me-2"></i>{{ user?.email }}
                        <span class="mx-2">|</span>
                        <i class="fas fa-user-tag me-2"></i>{{ user?.roles?.join(', ') }}
                    </p>
                </div>
              </div>

              <div class="row">
                <div class="col-md-12">
                    <div class="card border-0 profile-edit-card rounded-4">
                        <div class="card-body p-4">
                            <h5 class="fw-bold mb-4 text-main">
                                <i class="fas fa-user-edit me-2 text-primary"></i> Update Profile
                            </h5>
                            
                            <div class="form-container">
                                <app-dynamic-form
                                    *ngIf="isLoaded"
                                    [fields]="formFields"
                                    [gridSections]="gridConfig"
                                    [submitLabel]="'Save Changes'"
                                    (formSubmit)="onUpdateProfile($event)">
                                </app-dynamic-form>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .profile-banner {
        height: 150px;
        background: var(--primary-gradient);
    }
    .mt-n5 { margin-top: -5rem !important; }
    .avatar-wrapper {
        width: 140px;
        height: 140px;
        background: var(--bg-surface);
        border-radius: 50%;
        padding: 4px;
        border: 4px solid var(--border-color);
        box-shadow: var(--shadow-md);
    }
    .avatar-wrapper img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
        border: 4px solid var(--bg-surface);
    }
    .text-main { color: var(--text-main); }
    .profile-edit-card {
        background: var(--bg-surface);
        border: 1px solid var(--border-color) !important;
        color: var(--text-main);
    }
    .glass-card {
        background: var(--bg-glass);
        color: var(--text-main);
        border: 1px solid var(--border-color);
    }
    .profile-content {
        color: var(--text-main);
    }
  `]
})
export class UserProfileComponent implements OnInit {
    private authService = inject(AuthService);
    private userService = inject(UserService);
    private notification = inject(NotificationService);
    private loading = inject(LoadingService);
    private cdr = inject(ChangeDetectorRef);
    url: string = environment.resourceApiUrl;
    user: User | null = null;
    isLoaded = false;

    gridConfig: GridSection[] = [
        { key: 'info', label: 'Basic Info', colSpan: 12, order: 1 },
        { key: 'media', label: 'Profile Picture', colSpan: 12, order: 2 }
    ];

    formFields: BaseFormField<any>[] = [];

    ngOnInit() {
        const currentUser = this.authService.currentUserValue();
        if (currentUser) {
            this.loading.show();
            this.userService.getById(currentUser.userId).subscribe({
                next: (res) => {
                    if (res.isSuccess) {
                        this.user = res.data;
                        this.initializeForm();
                        this.isLoaded = true;
                        this.cdr.detectChanges();
                    }
                    this.loading.hide();
                },
                error: () => this.loading.hide()
            });
        }
    }

    private initializeForm() {
        if (!this.user) return;

        this.formFields = [
            new TextField({
                key: 'userName',
                label: 'Username',
                value: this.user.userName,
                required: true,
                validators: [Validators.required],
                colSpan: 6,
                gridKey: 'info',
                order: 1
            }),
            new TextField({
                key: 'email',
                label: 'Email Address',
                value: this.user.email,
                required: true,
                validators: [Validators.required, Validators.email],
                colSpan: 6,
                gridKey: 'info',
                order: 2
            }),
            new TextField({
                key: 'nickname',
                label: 'Nickname',
                value: this.user.nickname,
                colSpan: 6,
                gridKey: 'info',
                order: 3
            }),
            new TextField({
                key: 'phoneNumber',
                label: 'Phone Number',
                value: this.user.phoneNumber,
                colSpan: 6,
                gridKey: 'info',
                order: 4
            }),
            new TextField({
                key: 'description',
                label: 'Bio',
                value: this.user.description,
                colSpan: 12,
                gridKey: 'info',
                order: 5
            }),
            new UploadField({
                key: 'imagePayload',
                label: 'Profile Picture',
                value: this.user.avatarUrl ? {
                    filename: 'avatar.png',
                    url: this.url + "/" + this.user.avatarUrl,
                    state: FileState.Attached
                } : null,
                colSpan: 12,
                gridKey: 'media',
                order: 1,
                multiple: false
            })
        ];
    }

    onUpdateProfile(data: any) {
        if (!this.user) return;

        this.loading.show();
        this.userService.update(this.user.id, { id: this.user.id, ...data }).subscribe({
            next: (res) => {
                if (res.isSuccess) {
                    this.notification.success('Profile updated successfully!');
                    this.user = res.data;
                    this.initializeForm();
                } else {
                    this.notification.error(res.message);
                }
                this.loading.hide();
            },
            error: () => {
                this.notification.error('Error updating profile.');
                this.loading.hide();
            }
        });
    }
}
