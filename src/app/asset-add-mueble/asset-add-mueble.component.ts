import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewEncapsulation, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params, RouterOutlet, RouterModule, RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';
import { AdminService } from '../services/admin.service';
import { Asset } from '../models/asset';
import { AssetService } from '../services/asset.service';
import { GlobalConfig, ToastrService, ToastrModule } from 'ngx-toastr';
import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-asset-add-mueble',
  standalone: true,
  imports: [NgIf, CommonModule, RouterOutlet, CommonModule, NgIf, RouterModule, FormsModule, MatDialogModule],
  templateUrl: './asset-add-mueble.component.html',
  styleUrl: './asset-add-mueble.component.css',
  providers: [AdminService, AssetService,],
  encapsulation: ViewEncapsulation.None,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],


})


export class AssetAddMuebleComponent implements OnInit {
  public titulo: string;
  public asset: Asset;
  public identity;
  private options: GlobalConfig;
  public token;
  prod = environment.production;
  baseUrl = environment.baseUrl;
  public errorMessage;
  public is_edit;
  otherOption: string;
  loadingADD = false;
  uploadedADD = false;
  areaResElected: string;
  isOtherSelected: boolean = false;
  DAPBname: any;
  DABname: any;
  file: any;
  fileTemp: any;
  fotoname: any;
  itempic: any;
  itemelDAPB: any;
  itemelDAB: any;
  public id;
  areaPresElected: string;
  UbiSelected: string;
  isOtherSelectedpres: boolean = false;
  isOtherSelectedUbi: boolean = false;
  otherOptionUbi: string;
  otherOptionpres: string;
  constructor(
    public dialogRef: MatDialogRef<AssetAddMuebleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _route: ActivatedRoute,
    private _router: Router,
    private _adminService: AdminService,
    private toastr: ToastrService,
    private _assetService: AssetService
  ) {
    this.titulo = 'Agregar Bien';
    this.identity = this._adminService.getIdentity();
    this.token = this._adminService.getToken();
    this.options = this.toastr.toastrConfig;
    this.baseUrl = environment.baseUrl;
    this.asset = new Asset(
      '', // subcuenta
      '', // codigo
      '', // noinventario
      '', // tipo
      '', // desc
      '', // marca
      '', // modelo
      '', // noserie
      '', // estado
      undefined, // foto
      '', // arearesponsable
      '', // areapresupuestal
      '', // costo
      '', // depreciacion
      '', // valorenlibros
      '', // poliza
      null, // fechapoliza
      '', // DAPB
      null, // fechaDAPB
      null, // fechaalta
      '', // tipoalta
      '', // RFC
      '', // nombrecompleto
      null, // fecharesguardo
      null, // fechabaja
      '', // tipobaja
      '', // DAB
      false, // validated
      //'', // legend
      '', // elDAB
      '', // elDAPB
      null, // polizanobaja
      null, // fechapolizabaja
      '', // _id
      '', // ubicación física DPMTH-511-01-001
      '' //  Localizado
    );

    this.is_edit = true;

  }

  ngOnInit() {

    //lamar al metodo de la api para sacar un artista en base a su id getAsset


  }



  onSubmit() {
    this.loadingADD = true;
    /*   if (this.identity.role == 'ROLE_editor'){
        this.asset.validated = true
      }else{
        this.asset.validated = false
      } */

    this.asset.elDAPB = this.itemelDAPB
    this.asset.elDAB = this.itemelDAB

    if (this.areaResElected === 'OTRO') {
      this.areaResElected = this.otherOption;
    }
    this.asset.arearesponsable = this.areaResElected




    if (this.areaPresElected === 'OTRO') {
      this.areaPresElected = this.otherOptionpres;
    }
    this.asset.areapresupuestal = this.areaPresElected

    this.asset.ubicacionfisica = this.UbiSelected






    this._assetService.addAsset(this.token, this.asset).subscribe(
      (response) => {




        if (!response.asset) {
          this.errorMessage = 'error en el servidor';
        } else {

          this.uploadedADD = true;

         
          


          setTimeout(() => {
            this.loadingADD = false;
            this.closeDialog();
            this.uploadedADD = false;
          }, 2500); 

         /*  // Agregar un retraso de 2 segundos antes de navegar
          setTimeout(() => {
            this._router.navigate(['/bien-mueble', response.asset._id]);
          }, 2500); */


        }
      },
      (error) => {
        var errorMessage = <any>error;
        if (errorMessage != null) {
          this.errorMessage = error.error.message;

        } //if
      }
    );



  }
  backPage() {
    window.history.back();
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
  async UpPhoto(e: any) {
    const originalFileName = e.target.files[0].name;
    this.fotoname = this.sanitizeFileName(originalFileName);

    this.file = e.target.files[0];
    await this._assetService.Toolformat64(this.file).then(resp => {

      this.itempic = resp;

      this.asset.foto = this.itempic.base

    });
  }


  async UpELDAPB(e: any) {
    const originalFileName = e.target.files[0].name;
    this.DAPBname = this.sanitizeFileName(originalFileName);

    this.file = e.target.files[0];
    await this._assetService.Toolformat64(this.file).then(resp => {

      this.itemelDAPB = resp;

    });
  }
  async UpELDAB(e: any) {
    const originalFileName = e.target.files[0].name;
    this.DABname = this.sanitizeFileName(originalFileName);

    this.file = e.target.files[0];
    await this._assetService.Toolformat64(this.file).then(resp => {

      this.itemelDAB = resp;

    });
  }
  sanitizeFileName(fileName: string): string {
    // Remover caracteres especiales y acentos
    const sanitizedFileName = fileName
      .normalize("NFD") // Normalizar caracteres a su forma sin acento
      .replace(/[\u0300-\u036f]/g, "") // Eliminar caracteres diacríticos (acentos)
      .replace(/[^\w-]/g, ''); // Eliminar caracteres especiales excepto letras, números, guiones y guiones bajos

    return sanitizedFileName;
  }
  checkIfOtherSelected() {
    if (this.areaResElected === 'OTRO') {
      this.isOtherSelected = true;
    } else {
      this.isOtherSelected = false;
    }
  }
  checkIfOtherSelectedPres() {
    if (this.areaPresElected === 'OTRO') {
      this.isOtherSelectedpres = true;
    } else {
      this.isOtherSelectedpres = false;
    }
  }

  checkIfOtherSelectedUbi() {
    if (this.UbiSelected === 'OTRO') {
      this.isOtherSelectedUbi = true;
    } else {
      this.isOtherSelectedUbi = false;
    }
  }
}
