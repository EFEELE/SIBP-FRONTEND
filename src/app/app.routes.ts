import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AssetDetailComponent } from './asset-detail/asset-detail.component';

export const routes: Routes = [
    { path: 'bien-mueble/:id', component: AssetDetailComponent },
    { path: '', component: HomeComponent},
  ];