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
import { ResetPasswordComponent } from './access/reset-password/reset-password.component';
import { SignupComponent } from './access/signup/signup.component';
import { AuthGuardService } from './services/auth-guard.service';

export const routes: Routes = [
    { path: '', component: MainComponent, canActivate: [AuthGuardService], children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'dashboard', component: DashboardComponent },
        { path: 'expenses', component: ExpensesComponent },
        { path: 'budgets', component: BudgetsComponent },
        { path: 'categories', component: CategoriesComponent },
        { path: 'settings', component: SettingsComponent },
        { path: 'legal-notice', component: LegalNoticeComponent },
        { path: 'privacy-policy', component: PrivacyComponent },
        { path: 'help', component: HelpComponent },
    ]},
    { path: '', component: AccessComponent, children: [
        { path: '', redirectTo: 'login', pathMatch: 'full' },
        { path: 'login', component: LoginComponent },
        { path: 'signup', component: SignupComponent },
        { path: 'reset-password', component: ResetPasswordComponent },
        { path: 'access-help', component: HelpComponent },
        { path: 'access-legal-notice', component: LegalNoticeComponent },
        { path: 'access-privacy-policy', component: PrivacyComponent },
    ]}
];
