import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewEncapsulation, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params, RouterOutlet, RouterModule, RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';
import { AdminService } from '../services/admin.service';
import { Asset } from '../models/asset';
import { AssetService } from '../services/asset.service';
import { GlobalConfig, ToastrService, ToastrModule } from 'ngx-toastr';
import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, FormsModule, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule, } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
@Component({
  selector: 'app-asset-add-mueble',
  standalone: true,
  imports: [NgIf, CommonModule, RouterOutlet, ReactiveFormsModule, RouterModule, FormsModule, MatDialogModule, MatSelectModule, NgxMatSelectSearchModule, MatFormFieldModule],
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
  firstnote: any;
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
      '', //  Localizado,
      undefined
    );

    this.is_edit = true;

  }





  onSubmit() {
    if (this.identity.role == 'ROLE_editor') {
      this.asset.validated = false
    } else {
      this.asset.validated = true
    }

    this.loadingADD = true;


    this.asset.elDAPB = this.itemelDAPB
    this.asset.elDAB = this.itemelDAB

    /*  VERIFICAR SI SE SELECCIONO OTRA AREA RESPONSABLE Y REASIGNARLA */
    if (this.areaResElected === 'OTRO') {
      this.areaResElected = this.otherOption;
    }
    this.asset.arearesponsable = this.areaResElected

    /*  VERIFICAR SI SE SELECCIONO OTRA AREA PRESUPUESTAL Y REASIGNARLA */
    if (this.areaPresElected === 'OTRO') {
      this.areaPresElected = this.otherOptionpres;
    }
    this.asset.areapresupuestal = this.areaPresElected

    /*  VERIFICAR SI SE SELECCIONO OTRA UBICACION FISICA Y REASIGNARLA */
    if (this.UbiSelected === 'OTRO') {
      this.UbiSelected = this.otherOptionUbi;
    }
    this.asset.ubicacionfisica = this.UbiSelected

   


    this._assetService.addAsset(this.token, this.asset).subscribe(
      (response) => {




        if (!response.asset) {
          this.errorMessage = 'error en el servidor';
        } else {

          this.uploadedADD = true;
          if(this.firstnote){
            console.log(this.firstnote)

           setTimeout(() => {
            this._assetService.addNoteToAsset(this.token, response.asset._id, this.firstnote).subscribe(
              (response) => {
                console.log('Nota añadida exitosamente');
                // Puedes manejar la respuesta aquí si es necesario
              },
              (error) => {
                this.errorMessage = 'Ocurrió un error al añadir la nota'; // Mensaje genérico
                if (error && error.error && error.error.message) {
                  this.errorMessage = error.error.message;
                }
                console.error('Error al añadir la nota:', error);
              }
            );
           },1000)
          }
          



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
    console.log(this.areaResElected)
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



  ngOnInit() {
    this.filteredSubcuentas = this.subcuentaFilterCtrl.valueChanges
      .pipe(
        startWith(''),
        map(subcuenta => subcuenta ? this._filterSubcuentas(subcuenta) : this.subcuentas.slice())
      );

    this.filteredAreasResponsables = this.areaResponsableFilterCtrl.valueChanges
      .pipe(
        startWith(''),
        map(arearesponsable => arearesponsable ? this._filteredAreasResponsables(arearesponsable) : this.areasresponsables.slice())
      );


    this.filteredAreasPresupuestales = this.areaPresupuestalFilterCtrl.valueChanges
      .pipe(
        startWith(''),
        map(areapresupuestal => areapresupuestal ? this._filteredAreasPresupuestales(areapresupuestal) : this.areaspresupuestales.slice())
      );


    this.filteredAreasFisicas = this.areaFisicaFilterCtrl.valueChanges
      .pipe(
        startWith(''),
        map(areafisica => areafisica ? this._filteredAreasFisicas(areafisica) : this.areasfisicas.slice())
      );
  }



  /* SUBCUENTAS */
  subcuentaControl = new FormControl();
  subcuentaFilterCtrl = new FormControl();
  subcuentas: string[] = [
    '1.2.4.1', '1.2.4.1.1', '1.2.4.1.2', '1.2.4.1.3', '1.2.4.1.9',
    '1.2.4.2', '1.2.4.2.1', '1.2.4.2.2', '1.2.4.2.3', '1.2.4.2.9',
    '1.2.4.3', '1.2.4.3.1', '1.2.4.3.2', '1.2.4.4', '1.2.4.4.1',
    '1.2.4.4.2', '1.2.4.4.3', '1.2.4.4.4', '1.2.4.4.5', '1.2.4.4.9',
    '1.2.4.5', '1.2.4.6', '1.2.4.6.1', '1.2.4.6.2', '1.2.4.6.3',
    '1.2.4.6.4', '1.2.4.6.5', '1.2.4.6.6', '1.2.4.6.7', '1.2.4.6.9',
    '1.2.4.7', '1.2.4.7.1', '1.2.4.7.2', '1.2.4.8', '1.2.4.8.1',
    '1.2.4.8.2', '1.2.4.8.3', '1.2.4.8.4', '1.2.4.8.5', '1.2.4.8.6',
    '1.2.4.8.7', '1.2.4.8.8', '1.2.4.8.9'
  ];

  filteredSubcuentas: Observable<string[]>;


  private _filterSubcuentas(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.subcuentas.filter(subcuenta => subcuenta.toLowerCase().includes(filterValue));
  }


  /* area responsables */
  areaResponsableControl = new FormControl([Validators.required]);
  areaResponsableFilterCtrl = new FormControl();
  areasresponsables: string[] = [
    "CENTRO DE JUSTICIA CIVICA",
    "DESPACHO DE LA PRESIDENCIA MUNICIPAL",
    "DIRECCION DE ADMINISTRACION",
    "DIRECCION DE ADMINISTRACION DE LA SSC",
    "DIRECCION DE ANALISIS",
    "DIRECCION DE ARCHIVO MUNICIPAL",
    "DIRECCION DE ATENCION A VIOLENCIA FAMILIAR Y DE GENERO",
    "DIRECCION DE AUDITORIA",
    "DIRECCION DE CATASTRO Y RECAUDACION FISCAL",
    "DIRECCION DE COMUNICACION SOCIAL E IMAGEN INSTITUCIONAL",
    "DIRECCION DE COMPETITIVIDAD ECONOMICA",
    "DIRECCION DE CUENTA PUBLICA",
    "DIRECCION DE CULTURA Y ARTES",
    "DIRECCION DE ECOLOGIA Y PROTECCION AL MEDIO AMBIENTE",
    "DIRECCION DE EDUCACION",
    "DIRECCION DE EGRESOS",
    "DIRECCION DE FOMENTO AGROPECUARIO",
    "DIRECCION DE GOBERNACION",
    "DIRECCION DE IMDIS (INSTITUTO MUNICIPAL DE PERSONAS CON DISCAPACIDAD)",
    "DIRECCION DE INGRESOS",
    "DIRECCION DE INNOVACION Y MODERNIZACIÓN GUBERNAMENTAL",
    "DIRECCION DE INVESTIGACION",
    "DIRECCION DE LICENCIAS DE CONSTRUCCION",
    "DIRECCION DE OBRAS PUBLICAS",
    "DIRECCION DE OPERADORA MUNICIPAL DE PROYECTOS ESTRATEGICOS",
    "DIRECCION DE PARTICIPACION CIUDADANA",
    "DIRECCION DE PLANEACION Y ADMINISTRACION",
    "DIRECCION DE PLANEACION Y EVALUACION",
    "DIRECCION DE PROTECCION CIVIL Y BOMBEROS",
    "DIRECCION DE RECURSOS HUMANOS",
    "DIRECCION DE REGLAMENTOS",
    "DIRECCION DE SALUD MUNICIPAL",
    "DIRECCION DE SEGURIDAD PUBLICA",
    "DIRECCION DE SERVICIOS PUBLICOS MUNICIPALES",
    "DIRECCION DE TRANSITO Y VIALIDAD",
    "DIRECCION DE TRANSPARENCIA, ACCESO A LA INFORMACION PUBLICA Y PROTECCION DE DATOS PERSONALES",
    "DIRECCION DE TURISMO, COMERCIO Y SERVICIOS",
    "DIRECCION DEL CENTRO DE ATENCION PSICOLOGICA",
    "DIRECCION GENERAL DE LA CONSEJERIA JURIDICA",
    "DIRECCION JURIDICA DE LA CONSEJERIA JURIDICA",
    "DIRECCION JURIDICA DE LA SSC",
    "DIRECTOR DE PREVENCION SOCIAL DEL DELITO",
    "INSTITUTO MUNICIPAL DE LAS MUJERES",
    "INSTITUTO MUNICIPAL DEL DEPORTE Y ACTIVACION FISICA",
    "INSTITUTO TIZAYUQUENSE DE LA JUVENTUD",
    "OFICIALIA MAYOR H. ASAMBLEA",
    "RASTRO MUNICIPAL",
    "REGISTRO DEL ESTADO FAMILIAR",
    "SECRETARIA DE BIENESTAR SOCIAL",
    "SECRETARIA DE DESARROLLO ECONOMICO",
    "SECRETARIA DE FINANZAS",
    "SECRETARIA DE LA CONTRALORIA MUNICIPAL",
    "SECRETARIA DE OBRAS PUBLICAS",
    "SECRETARIA DE SEGURIDAD CIUDADANA",
    "SECRETARIA DE SECRETARIA TECNICA DE LA SCC",
    "SECRETARIA EJECUTIVA DE SIPINNA",
    "SECRETARIA GENERAL MUNICIPAL",
    "UNIDAD DE ASUNTOS INTERNOS",
    "OTRO"
  ];

  filteredAreasResponsables: Observable<string[]>;


  private _filteredAreasResponsables(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.areasresponsables.filter(areasresponsable => areasresponsable.toLowerCase().includes(filterValue));
  }

  /* area presupuestal */
  areaPresupuestalControl = new FormControl([Validators.required]);
  areaPresupuestalFilterCtrl = new FormControl();
  areaspresupuestales: string[] = [
    "CENTRO DE JUSTICIA CIVICA",
    "DESPACHO DE LA PRESIDENCIA MUNICIPAL",
    "DIRECCION DE ADMINISTRACION",
    "DIRECCION DE ADMINISTRACION DE LA SSC",
    "DIRECCION DE ANALISIS",
    "DIRECCION DE ARCHIVO MUNICIPAL",
    "DIRECCION DE ATENCION A VIOLENCIA FAMILIAR Y DE GENERO",
    "DIRECCION DE AUDITORIA",
    "DIRECCION DE CATASTRO Y RECAUDACION FISCAL",
    "DIRECCION DE COMUNICACION SOCIAL E IMAGEN INSTITUCIONAL",
    "DIRECCION DE COMPETITIVIDAD ECONOMICA",
    "DIRECCION DE CUENTA PUBLICA",
    "DIRECCION DE CULTURA Y ARTES",
    "DIRECCION DE ECOLOGIA Y PROTECCION AL MEDIO AMBIENTE",
    "DIRECCION DE EDUCACION",
    "DIRECCION DE EGRESOS",
    "DIRECCION DE FOMENTO AGROPECUARIO",
    "DIRECCION DE GOBERNACION",
    "DIRECCION DE IMDIS (INSTITUTO MUNICIPAL DE PERSONAS CON DISCAPACIDAD)",
    "DIRECCION DE INGRESOS",
    "DIRECCION DE INNOVACION Y MODERNIZACIÓN GUBERNAMENTAL",
    "DIRECCION DE INVESTIGACION",
    "DIRECCION DE LICENCIAS DE CONSTRUCCION",
    "DIRECCION DE OBRAS PUBLICAS",
    "DIRECCION DE OPERADORA MUNICIPAL DE PROYECTOS ESTRATEGICOS",
    "DIRECCION DE PARTICIPACION CIUDADANA",
    "DIRECCION DE PLANEACION Y ADMINISTRACION",
    "DIRECCION DE PLANEACION Y EVALUACION",
    "DIRECCION DE PROTECCION CIVIL Y BOMBEROS",
    "DIRECCION DE RECURSOS HUMANOS",
    "DIRECCION DE REGLAMENTOS",
    "DIRECCION DE SALUD MUNICIPAL",
    "DIRECCION DE SEGURIDAD PUBLICA",
    "DIRECCION DE SERVICIOS PUBLICOS MUNICIPALES",
    "DIRECCION DE TRANSITO Y VIALIDAD",
    "DIRECCION DE TRANSPARENCIA, ACCESO A LA INFORMACION PUBLICA Y PROTECCION DE DATOS PERSONALES",
    "DIRECCION DE TURISMO, COMERCIO Y SERVICIOS",
    "DIRECCION DEL CENTRO DE ATENCION PSICOLOGICA",
    "DIRECCION GENERAL DE LA CONSEJERIA JURIDICA",
    "DIRECCION JURIDICA DE LA CONSEJERIA JURIDICA",
    "DIRECCION JURIDICA DE LA SSC",
    "DIRECTOR DE PREVENCION SOCIAL DEL DELITO",
    "INSTITUTO MUNICIPAL DE LAS MUJERES",
    "INSTITUTO MUNICIPAL DEL DEPORTE Y ACTIVACION FISICA",
    "INSTITUTO TIZAYUQUENSE DE LA JUVENTUD",
    "OFICIALIA MAYOR H. ASAMBLEA",
    "RASTRO MUNICIPAL",
    "REGISTRO DEL ESTADO FAMILIAR",
    "SECRETARIA DE BIENESTAR SOCIAL",
    "SECRETARIA DE DESARROLLO ECONOMICO",
    "SECRETARIA DE FINANZAS",
    "SECRETARIA DE LA CONTRALORIA MUNICIPAL",
    "SECRETARIA DE OBRAS PUBLICAS",
    "SECRETARIA DE SEGURIDAD CIUDADANA",
    "SECRETARIA DE SECRETARIA TECNICA DE LA SCC",
    "SECRETARIA EJECUTIVA DE SIPINNA",
    "SECRETARIA GENERAL MUNICIPAL",
    "UNIDAD DE ASUNTOS INTERNOS",
    "OTRO",

  ];

  filteredAreasPresupuestales: Observable<string[]>;


  private _filteredAreasPresupuestales(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.areaspresupuestales.filter(areapresupuestal => areapresupuestal.toLowerCase().includes(filterValue));
  }




  /* ubicación física */
  areaFisicaControl = new FormControl([Validators.required]);
  areaFisicaFilterCtrl = new FormControl();
  areasfisicas: string[] = [
    "CENTRO DE JUSTICIA CIVICA",
    "DESPACHO DE LA PRESIDENCIA MUNICIPAL",
    "DIRECCION DE ADMINISTRACION",
    "DIRECCION DE ADMINISTRACION DE LA SSC",
    "DIRECCION DE ANALISIS",
    "DIRECCION DE ARCHIVO MUNICIPAL",
    "DIRECCION DE ATENCION A VIOLENCIA FAMILIAR Y DE GENERO",
    "DIRECCION DE AUDITORIA",
    "DIRECCION DE CATASTRO Y RECAUDACION FISCAL",
    "DIRECCION DE COMUNICACION SOCIAL E IMAGEN INSTITUCIONAL",
    "DIRECCION DE COMPETITIVIDAD ECONOMICA",
    "DIRECCION DE CUENTA PUBLICA",
    "DIRECCION DE CULTURA Y ARTES",
    "DIRECCION DE ECOLOGIA Y PROTECCION AL MEDIO AMBIENTE",
    "DIRECCION DE EDUCACION",
    "DIRECCION DE EGRESOS",
    "DIRECCION DE FOMENTO AGROPECUARIO",
    "DIRECCION DE GOBERNACION",
    "DIRECCION DE IMDIS (INSTITUTO MUNICIPAL DE PERSONAS CON DISCAPACIDAD)",
    "DIRECCION DE INGRESOS",
    "DIRECCION DE INNOVACION Y MODERNIZACIÓN GUBERNAMENTAL",
    "DIRECCION DE INVESTIGACION",
    "DIRECCION DE LICENCIAS DE CONSTRUCCION",
    "DIRECCION DE OBRAS PUBLICAS",
    "DIRECCION DE OPERADORA MUNICIPAL DE PROYECTOS ESTRATEGICOS",
    "DIRECCION DE PARTICIPACION CIUDADANA",
    "DIRECCION DE PLANEACION Y ADMINISTRACION",
    "DIRECCION DE PLANEACION Y EVALUACION",
    "DIRECCION DE PROTECCION CIVIL Y BOMBEROS",
    "DIRECCION DE RECURSOS HUMANOS",
    "DIRECCION DE REGLAMENTOS",
    "DIRECCION DE SALUD MUNICIPAL",
    "DIRECCION DE SEGURIDAD PUBLICA",
    "DIRECCION DE SERVICIOS PUBLICOS MUNICIPALES",
    "DIRECCION DE TRANSITO Y VIALIDAD",
    "DIRECCION DE TRANSPARENCIA, ACCESO A LA INFORMACION PUBLICA Y PROTECCION DE DATOS PERSONALES",
    "DIRECCION DE TURISMO, COMERCIO Y SERVICIOS",
    "DIRECCION DEL CENTRO DE ATENCION PSICOLOGICA",
    "DIRECCION GENERAL DE LA CONSEJERIA JURIDICA",
    "DIRECCION JURIDICA DE LA CONSEJERIA JURIDICA",
    "DIRECCION JURIDICA DE LA SSC",
    "DIRECTOR DE PREVENCION SOCIAL DEL DELITO",
    "INSTITUTO MUNICIPAL DE LAS MUJERES",
    "INSTITUTO MUNICIPAL DEL DEPORTE Y ACTIVACION FISICA",
    "INSTITUTO TIZAYUQUENSE DE LA JUVENTUD",
    "OFICIALIA MAYOR H. ASAMBLEA",
    "RASTRO MUNICIPAL",
    "REGISTRO DEL ESTADO FAMILIAR",
    "SECRETARIA DE BIENESTAR SOCIAL",
    "SECRETARIA DE DESARROLLO ECONOMICO",
    "SECRETARIA DE FINANZAS",
    "SECRETARIA DE LA CONTRALORIA MUNICIPAL",
    "SECRETARIA DE OBRAS PUBLICAS",
    "SECRETARIA DE SEGURIDAD CIUDADANA",
    "SECRETARIA DE SECRETARIA TECNICA DE LA SCC",
    "SECRETARIA EJECUTIVA DE SIPINNA",
    "SECRETARIA GENERAL MUNICIPAL",
    "UNIDAD DE ASUNTOS INTERNOS",
    "OTRO",

  ];

  filteredAreasFisicas: Observable<string[]>;


  private _filteredAreasFisicas(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.areasfisicas.filter(areafisica => areafisica.toLowerCase().includes(filterValue));
  }
}
