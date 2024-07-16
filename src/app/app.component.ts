import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { NgIf } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AdminService } from './services/admin.service';
import { Admin } from './models/admin';
import * as XLSX from 'xlsx';
import { environment } from '../environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, FontAwesomeModule, CommonModule,RouterModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [AdminService]
})
export class AppComponent implements OnInit {

  isMenuOpen = false;

  
  prod = environment.production;
  baseUrl = environment.baseUrl;

  title= 'sibp';
  public admin: Admin;
  public identity;
  public token;
  public errorMessage;
  time = new Date();
  public admin1 = 'admin1@tizayuca.gob.mx';
  public admin2 = 'admin2@tizayuca.gob.mx';
  public admin4 = 'admin4@tizayuca.gob.mx'
  public mail;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _adminService: AdminService,
    private formBuilder: FormBuilder
  ) {
    this.admin = new Admin('', '', '', '', '', '', 'ROLE_admin');
  }

  loginForm = this.formBuilder.group({
    email: [''],
    password: [''],
  });
  fileName= 'ExcelSheet.xlsx';
  campoNoValido(campo: string) {
    if (
      this.loginForm.get(campo)?.valid! &&
      this.loginForm.get(campo)?.touched
    ) {
      return true;
    } else {
      return false;
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  ngOnInit() {
    this.identity = this._adminService.getIdentity();
    this.token = this._adminService.getToken();

  }

  public onSubmit() {
    this.mail = this.loginForm.controls.email.value;


      //conseguir los datos del usuario
      this._adminService.signup(this.loginForm.value).subscribe(
        (response) => {
          let identity = response.admin;

          this.identity = identity;
          if (!this.identity._id) {
            alert('el usuario no esta correctamente identificado');
          } else {
            // Crear elemento en local storage para tener al usuario en sesion
            localStorage.setItem('identity', JSON.stringify(identity));

            // Conseguir el token para enviarselo a cada peticion de http
            this._adminService.signup(this.admin, 'true').subscribe(
              (response) => {
                let token = response.token;
                this.token = token;

                if (this.token.length <= 0) {
                  alert('el token no se ha generado');
                } else {
                  // Crear elemento en local storage para tener el token disponible
                  localStorage.setItem('token', token);

                  this.admin = new Admin(
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    ''
                  );
                  location.reload();
                }
              },
              (error) => {
                var errorMessage = <any>error;
                if (errorMessage != null) {
                  this.errorMessage = error.error;

                } //if
              } //error
            );
          }
        },
        (error) => {
          var errorMessage = <any>error;
          if (errorMessage != null) {
            this.errorMessage = error.error.message;

          } //if
        } //error
      );


  }

  logout() {
    window.location.reload();
   
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity = null;
    this.token = null;
    
   
  }

  exportexcel(): void
  {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }
}
