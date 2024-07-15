import { Component, OnInit, ViewChild, ElementRef, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { Router, ActivatedRoute, Params , RouterOutlet, RouterModule} from '@angular/router';
import { environment } from '../../environments/environment';
import { Asset } from '../models/asset';
import { AssetService } from '../services/asset.service';
import { AdminService } from '../services/admin.service';
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";
import { CommonModule , NgIf} from '@angular/common';
import { QrCodeModule } from 'ng-qrcode';

@Component({
  selector: 'app-asset-detail',
  standalone: true,
  imports: [  RouterOutlet, CommonModule , NgIf,  RouterModule, QrCodeModule] ,
  templateUrl: './asset-detail.component.html',
  styleUrl: './asset-detail.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    AdminService,
    AssetService,
  ],
})
export class AssetDetailComponent implements OnInit {
  public titulo: string;
  public asset: Asset;
  
  lightBoxVisible: boolean = false;

    showLightBox() {
        this.lightBoxVisible = true;
        console.log('this.lightBoxVisible')
    }

    closeLightBox() {
        this.lightBoxVisible = false;
        console.log('this.lightBoxVisible')
    }
  //public courses: Course[];
  //public sanction: Sanction;
  //public notes: NoteAsset[];
  public name;
  elementType = 'url';
  public value; 
  public noinventario;
  public identity;
  public token;
  private baseUrl: string = environment.baseUrl;
  public errorMessage;
  public birth;
  public date_start;
  public date_end;
  public downloadedCheck: boolean;
  public edad;
  public id;
  public foto;
  //public sanctions: SanctionAsset[];

  @ViewChild('divToDownload', { static: false }) divToDownload: ElementRef;
  imagesLoaded: number = 0;
  totalImages: number = 2; // Cambiar al número total de imágenes en tu div

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _adminService: AdminService,
    private _assetService: AssetService,
    //private _courseService: CourseService,
    //private _sanctionService: SanctionService,
    //private _noteService: NoteService
  ) {
    this.titulo = "Agregar Nuevo Bien";
    this.identity = this._adminService.getIdentity();
    this.token = this._adminService.getToken();
    this.downloadedCheck = true;
    this.baseUrl = environment.baseUrl;
  }
  downloadAsImage() {
    const divElement = this.divToDownload.nativeElement;

    // Guardar la posición original de los elementos posicionados absolutamente
    const absoluteElements = Array.from(divElement.querySelectorAll('*[style*="position: absolute"]')) as HTMLElement[];
    const originalPositions = absoluteElements.map((el: HTMLElement) => el.style.position);

    // Cambiar la posición de los elementos a relativa temporalmente
    absoluteElements.forEach((el: HTMLElement) => el.style.position = 'relative');

    // Aumentar la resolución del canvas
    const canvas = document.createElement('canvas');
    const scale = 1; // Puedes ajustar este valor según sea necesario
    canvas.width = divElement.offsetWidth * scale;
    canvas.height = divElement.offsetHeight * scale;
    const context = canvas.getContext('2d');
    if (context) {
      context.scale(scale, scale);

      // Capturar la imagen con html2canvas
      html2canvas(divElement, { canvas: canvas }).then(canvas => {
        // Restaurar las posiciones originales de los elementos
        absoluteElements.forEach((el: HTMLElement, index) => el.style.position = originalPositions[index]);

        // Convertir el canvas a una imagen PNG y descargarla
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${this.noinventario}_sticker.png`;
        link.href = imgData;
        link.click();
      }).catch(error => {
        console.error('Error al capturar la imagen:', error);
      });
    } else {
      console.error('Error al obtener el contexto 2D del canvas.');
    }
  }

  // downloadAsImage() {
  //   const divElement = this.divToDownload.nativeElement;

  //   html2canvas(divElement).then(canvas => {
      
  //     const imgData = canvas.toDataURL('image/png', 1.0);
  //     const link = document.createElement('a');
  //     link.download = `${this.noinventario}_sticker.png`; 
  //     link.href = imgData;
  //     link.click();
  //   });
  // }

  downloadPDF() {
    this.downloadedCheck = false;
    console.log('poner en false')
    // Extraemos el
    const DATA: any = document.getElementById('htmlData');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3,
    };
    // Usar la URL de la imagen directamente

    setTimeout(() => {
      const DATA: any = document.getElementById('htmlData');
      const doc = new jsPDF('p', 'pt', 'a4');
      const options = {
        background: 'white',
        scale: 3,
        useCORS: true
      };

  html2canvas(DATA, options)
      .then((canvas) => {
        const img = canvas.toDataURL('image/JPEG');
        const img2 = this.foto;
        // Add image Canvas to PDF
        const bufferX = 0;
        const bufferY = 0;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = doc.internal.pageSize.getHeight();
        doc.addImage(
          img,
          'JPEG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'NONE'
        );
        doc.addImage(
          img2,
          'JPEG',
          0,
          0,
          1,
          1,
          undefined,
          'NONE'
        );
       
        return doc;
      })
      .then((docResult) => {
        docResult.save(`${this.noinventario}_SIBP.pdf`);
        this.downloadedCheck = true;
        console.log('poner en false')
      });

    }, 500); // Agregamos un retardo de 500 milisegundos (puedes ajustarlo según sea necesario)
  }
  ngOnInit() {
    console.log(this.lightBoxVisible)
   // window.location.reload();
    //lamar al metodo de la api para sacar un artista en base a su id getAsset
    this.getAsset();
    //this.value = 'http://localhost:4200/bien/' + this.id;
    this.value = 'https://sibp.lat/bien-mueble/' + this.id;
  }

  getAsset() {
    this._route.params.forEach((params: Params) => {
      let id = params["id"];
      this.id = id;
      this._assetService.getAsset(id).subscribe(
        (response) => {
          if (!response.asset) {
            this._router.navigate(["/"]);
          } else {
            this.asset = response.asset;
            this.foto = response.asset.foto;
           
            this.noinventario = response.asset.noinventario;
       
          }
        },
        (error) => {
          var errorMessage = <any>error;

          return errorMessage;
        }
      );
    });
  }

 


  backPage() {
    this._router.navigate(['/']);
  }
}

