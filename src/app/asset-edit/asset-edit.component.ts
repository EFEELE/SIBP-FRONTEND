
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewEncapsulation, Inject} from '@angular/core';
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
  selector: 'app-asset-edit',
  standalone: true,
  imports: [NgIf, CommonModule, RouterOutlet, CommonModule, NgIf, RouterModule, FormsModule, MatDialogModule ],
  templateUrl: './asset-edit.component.html',
  styleUrl: './asset-edit.component.css',
  providers: [AdminService, AssetService,  ],
  encapsulation: ViewEncapsulation.None,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  
  
})


export class AssetEditComponent implements OnInit {
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
  isOtherSelectedpres: boolean = false;
  otherOptionpres: string;
  constructor(
    public dialogRef: MatDialogRef<AssetEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _route: ActivatedRoute,
    private _router: Router,
    private _adminService: AdminService,
     private toastr: ToastrService,
    private _assetService: AssetService
  ) {
    this.titulo = 'Editar Bien';
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
      '', // foto
      '', // arearesponsable
      '', // areapresupuestal
      '', // costo
      '', // depreciacion
      '', // valorenlibros
      '', // poliza
      new Date(), // fechapoliza
      '', // DAPB
      new Date(), // fechaDAPB
      new Date(), // fechaalta
      '', // tipoalta
      '', // RFC
      '', // nombrecompleto
      new Date(), // fecharesguardo
      new Date(), // fechabaja
      '', // tipobaja
      '', // DAB
      false, // validated
      '', // legend
      '', // elDAB
      '', // elDAPB
      new Date(), // polizanobaja
      new Date(), // fechapolizabaja
      '', // _id
      '', // status_report
      ''  // usrxgene
    );
    
    this.is_edit = true;
    this.id = data.id;
  }

  ngOnInit() {

    //lamar al metodo de la api para sacar un artista en base a su id getAsset
    this.getAsset();

  }

  getAsset() {

    this._assetService.getAsset(this.id).subscribe(
      (response) => {
        this.asset = response.asset;

        if (!response.asset) {
          this.errorMessage = 'error en el servidor';
          this._router.navigate(['/']);
        } else {
          this.errorMessage = 'El bien se ha obtenido correctamente';
          this.asset = response.asset;

        }
      },
      (error) => {
        var errorMessage = <any>error;

        return errorMessage;
      }
  );
  }


  onSubmit() {

    if (this.identity.role == 'ROLE_editor'){
      this.asset.validated = true
    }else{
      this.asset.validated = false
    }

    this.asset.elDAPB = this.itemelDAPB
    this.asset.elDAB = this.itemelDAB

    if (this.areaResElected === 'OTRO') {
      this.areaResElected = this.otherOption;
    }
    this.asset.arearesponsable =  this.areaResElected
    


    if (this.areaPresElected === 'OTRO') {
      this.areaPresElected = this.otherOptionpres;
    }
    this.asset.areapresupuestal =  this.areaPresElected
    
console.log("Prueba 1")
   
    this.asset.foto = this.itempic
    
     

      this._assetService
        .editAsset(this.token, this.id, this.asset)
        .subscribe(

          (response) => {
            console.log("Prueba 2")
            if (!response.asset) {
              this.errorMessage = 'error en el servidor';
            } else {
              this.errorMessage = 'El bien se ha actualizado correctamente';

              this.toastr.success('Bien actualizado correctamente', 'Actualizado' , {
                progressBar: true,
                toastClass: 'toast ngx-toastr',
                closeButton: true
              });

             
             this.closeDialog();
            }

          },
          (error) => {
            var errorMessage = <any>error;
            if (errorMessage != null) {
              this.errorMessage = error.error.message;
            }
          }
        );
   
    console.log("Prueba 3")
  }
  backPage(){
    window.history.back();
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
  async UpPhoto(e:any){
    const originalFileName = e.target.files[0].name;
    this.fotoname = this.sanitizeFileName(originalFileName);

    this.file = e.target.files[0];
    await this._assetService.Toolformat64(this.file).then(resp =>{

      this.itempic = resp;
      
    });
  }


  async UpELDAPB(e:any){
    const originalFileName = e.target.files[0].name;
    this.DAPBname = this.sanitizeFileName(originalFileName);

    this.file = e.target.files[0];
    await this._assetService.Toolformat64(this.file).then(resp =>{

        this.itemelDAPB = resp;
      
    });
  }
  async UpELDAB(e:any){
    const originalFileName = e.target.files[0].name;
    this.DABname = this.sanitizeFileName(originalFileName);

    this.file = e.target.files[0];
    await this._assetService.Toolformat64(this.file).then(resp =>{

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
}
