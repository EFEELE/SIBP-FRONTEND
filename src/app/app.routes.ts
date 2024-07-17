import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AssetDetailComponent } from './asset-detail/asset-detail.component';
import { AssetDetailDialogComponent } from './asset-detail-dialog/asset-detail-dialog.component';
import { AssetEditComponent } from './asset-edit/asset-edit.component';
import { ValorCeroComponent } from './valor-cero/valor-cero.component';
import { AssetAddMuebleComponent } from './asset-add-mueble/asset-add-mueble.component';

export const routes: Routes = [
  { path: 'valor-cero', component: ValorCeroComponent },
  { path: 'bien-mueble/:id', component: AssetDetailComponent },
  { path: 'bien-mueble/:id', component: AssetDetailDialogComponent },
  { path: 'editar-bien-mueble/:id', component: AssetEditComponent },
  { path: 'agregar-bien-mueble', component: AssetAddMuebleComponent },
  
  { path: '', component: HomeComponent },
];