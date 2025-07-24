import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { FormComponent } from './pages/form/form.component';
import { SuccessComponent } from './pages/success/success.component';


export const routes: Routes = [
  { path: '', component: AuthComponent, pathMatch: 'full' },
  { path: 'formulario', component: FormComponent },
  { path: 'success', component: SuccessComponent },
];