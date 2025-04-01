import { Routes } from '@angular/router';
import { DashboardComponent } from './main/content/dashboard/dashboard.component';
import { BudgetsComponent } from './main/content/budgets/budgets.component';
import { ExpensesComponent } from './main/content/expenses/expenses.component';
import { CategoriesComponent } from './main/content/categories/categories.component';
import { SettingsComponent } from './main/content/settings/settings.component';
import { LegalNoticeComponent } from './main/content/legal-notice/legal-notice.component';
import { PrivacyComponent } from './main/content/privacy/privacy.component';
import { HelpComponent } from './main/content/help/help.component';
import { MainComponent } from './main/main.component';
import { AccessComponent } from './access/access.component';
import { LoginComponent } from './access/login/login.component';
import { ResetPasswordMailComponent } from './access/reset-password-mail/reset-password-mail.component';
import { SignupComponent } from './access/signup/signup.component';
import { AuthGuardService } from './services/auth-guard.service';
import { VerificationComponent } from './access/verification/verification.component';
import { ResetPasswordComponent } from './access/reset-password/reset-password.component';
import { ArchiveComponent } from './main/content/archive/archive.component';
import { ArchiveCategoriesComponent } from './main/content/archive-categories/archive-categories.component';
import { ArchiveExpensesComponent } from './main/content/archive-expenses/archive-expenses.component';

export const routes: Routes = [
    { path: '', component: MainComponent, canActivate: [AuthGuardService], children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'dashboard', component: DashboardComponent },
        { path: 'expenses', component: ExpensesComponent },
        { path: 'budgets', component: BudgetsComponent },
        { path: 'categories', component: CategoriesComponent },
        { path: 'archive', component: ArchiveComponent },
        { path: 'archive-categories', component: ArchiveCategoriesComponent },
        { path: 'archive-expenses', component: ArchiveExpensesComponent },
        { path: 'settings', component: SettingsComponent },
        { path: 'legal-notice', component: LegalNoticeComponent },
        { path: 'privacy-policy', component: PrivacyComponent },
        { path: 'help', component: HelpComponent },
    ]},
    { path: '', component: AccessComponent, children: [
        { path: '', redirectTo: 'login', pathMatch: 'full' },
        { path: 'login', component: LoginComponent },
        { path: 'signup', component: SignupComponent },
        { path: 'reset-password-mail', component: ResetPasswordMailComponent },
        { path: 'reset-password', component: ResetPasswordComponent },
        { path: 'verification', component: VerificationComponent },
        { path: 'access-help', component: HelpComponent },
        { path: 'access-legal-notice', component: LegalNoticeComponent },
        { path: 'access-privacy-policy', component: PrivacyComponent },
    ]}
];
