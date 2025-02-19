import { Routes } from '@angular/router';
import { DashboardComponent } from './main/content/dashboard/dashboard.component';
import { BudgetsComponent } from './main/content/budgets/budgets.component';
import { ExpensesComponent } from './main/content/expenses/expenses.component';
import { CategoriesComponent } from './main/content/categories/categories.component';
import { ReportsComponent } from './main/content/reports/reports.component';
import { SettingsComponent } from './main/content/settings/settings.component';
import { LegalNoticeComponent } from './main/content/legal-notice/legal-notice.component';
import { PrivacyComponent } from './main/content/privacy/privacy.component';
import { HelpComponent } from './main/content/help/help.component';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'expenses', component: ExpensesComponent },
    { path: 'budgets', component: BudgetsComponent },
    { path: 'categories', component: CategoriesComponent },
    { path: 'reports', component: ReportsComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'legal-notice', component: LegalNoticeComponent },
    { path: 'privacy-policy', component: PrivacyComponent },
    { path: 'help', component: HelpComponent },
];
