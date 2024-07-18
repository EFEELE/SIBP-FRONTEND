import { Component, OnInit, LOCALE_ID, ViewChild, signal } from '@angular/core';
import { Router, ActivatedRoute, Params, RouterOutlet, RouterModule, RouterLink } from '@angular/router';
import { ColumnMode, DatatableComponent, NgxDatatableModule, } from '@swimlane/ngx-datatable';
import { AssetLIST } from '../models/asset';
import { Admin } from '../models/admin';
import { AdminService } from '../services/admin.service';
import { AssetService } from '../services/asset.service';
import { environment } from '../../environments/environment';
import { FormBuilder, FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { CommonModule, NgIf } from '@angular/common';
import localeEs from '@angular/common/locales/es-MX';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEs, 'es-MX');
import { ReactiveFormsModule } from '@angular/forms';
import { AssetEditComponent } from '../asset-edit/asset-edit.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { AssetDetailDialogComponent } from '../asset-detail-dialog/asset-detail-dialog.component';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AssetAddMuebleComponent } from '../asset-add-mueble/asset-add-mueble.component';
@Component({
  selector: 'app-home',
  standalone: true,

  imports: [NgxDatatableModule, RouterOutlet, ReactiveFormsModule, CommonModule, NgIf, FormsModule, RouterModule, MatExpansionModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [provideNativeDateAdapter(), AdminService, AssetService, { provide: LOCALE_ID, useValue: 'es-MX' }, MatDialogModule,],
})


export class HomeComponent implements OnInit {
  prod = environment.production;
  baseUrl = environment.baseUrl;

  public titulo: string;
  public assets: AssetLIST[];
  public identity;
  public token;

  public next_page: number;
  public prev_page: number;
  public confirmado;
  public errorMessage;
  public mail;
  public admin: Admin;
  public tempData: AssetLIST[] = [];
  public rows;
  public tempFilterData;
  public tempFilterDataUser;
  public previousStatusFilter = '';
  public previousUserFilter = '';
  loadingExcel = false;
  loadingExcel2 = false;
  aplicarFiltroSiniNV: boolean = false;
  aplicarFiltroduplicated: boolean = false;
  aplicarFiltroCostoCero: boolean = false;
  aplicarFiltroInt: boolean = false;
  fileName = 'bienes.xlsx';
  filter_value = '';
  public searchValue = '';
  public ColumnMode = ColumnMode;
  loadingIndicator = true;
  darkMode: boolean = false;
  hasMaterialClass: boolean = true;
  showMode: boolean = true;


  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _adminService: AdminService,
    private _assetService: AssetService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    this.titulo = 'Bienes';
    this.identity = this._adminService.getIdentity();
    this.token = this._adminService.getToken();
    this.baseUrl = environment.baseUrl;
    this.next_page = 1;
    this.prev_page = 1;
    this.admin = new Admin('', '', '', '', '', '', 'ROLE_admin');
  }

  loginForm = this.formBuilder.group({
    email: [''],
    password: [''],
  });

  step = signal(0);

  setStep(index: number) {
    this.step.set(index);
  }

  nextStep() {
    this.step.update(i => i + 1);
  }

  prevStep() {
    this.step.update(i => i - 1);
  }
  changueMode() {
    this.darkMode = !this.darkMode;
    this.hasMaterialClass = !this.darkMode; // Cambia a false si darkMode es true
  }
  onViewClick(id: string): void {

    this.openDialogPreView(id);

  }
  onEditClick(id: string): void {

    this.openDialogEdit(id);

  }
  onOpenClick(id: string): void {

    this._router.navigate([`/bien-mueble/${id}`])

  }

  onADDClick(): void{
    this.openDialogADD();
  }
  resetFilters(): void {
    // Reset the rows to the original data
    this.rows = this.tempData;
  
    // Reset filter variables
    this.previousStatusFilter = '';
    this.previousUserFilter = '';
    this.searchValue = '';
  
    // Reset any other filter toggles
    this.aplicarFiltroSiniNV = false;
    this.aplicarFiltroduplicated = false;
    this.aplicarFiltroCostoCero = false;
    this.aplicarFiltroInt = false;
  
    // Optionally, reset any select elements or other UI components related to filtering
    // For example, if you're using form controls, you can reset them like this:
    // this.loginForm.reset();
  
    // If you have dropdowns, you can set their values to the default as well
    // Example: this.selectedUser = '';
    // Example: this.selectedStatus = '';
  }

  openDialogPreView(id: string): void {
    const dialogRef = this.dialog.open(AssetDetailDialogComponent, {
      height: '90vh',
      width: '80vw',
      maxHeight: '95vh',
      maxWidth: '95vw',
      panelClass: 'full-screen-modal',
      data: { id: id },
      enterAnimationDuration: 300,
      exitAnimationDuration: 200,
    });

    dialogRef.afterClosed().subscribe(result => {
     
      // puedes manejar el resultado aquí si lo necesitas
    });
  }
  openDialogADD(): void {

    const dialogRef = this.dialog.open(AssetAddMuebleComponent, {
      height: '90vh',
      width: '80vw',
      maxHeight: '95vh',
      maxWidth: '95vw',
      panelClass: 'full-screen-modal',
      enterAnimationDuration: 300,

      exitAnimationDuration: 200,


    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAssets();
      this.resetFilters()
      // puedes manejar el resultado aquí si lo necesitas
    });
  }
  openDialogEdit(id: string): void {

    const dialogRef = this.dialog.open(AssetEditComponent, {
      height: '90vh',
      width: '80vw',
      maxHeight: '95vh',
      maxWidth: '95vw',
      panelClass: 'full-screen-modal',
      data: { id: id },
      enterAnimationDuration: 300,

      exitAnimationDuration: 200,


    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAssets();
      this.resetFilters()
      // puedes manejar el resultado aquí si lo necesitas
    });
  }

  open(id: string): void {

  }
  filterUpdate(event) {
    const val = event.target.value.toLowerCase(); // Convertir el valor de búsqueda a minúsculas

    // Filtrar los datos basados en cualquier campo que contenga el valor de búsqueda
    const temp = this.tempData.filter(function (d) {
      // Convertir los valores de cada campo a minúsculas y verificar si contienen el valor de búsqueda
      return Object.values(d).some((field: any) => {
        return field && typeof field === 'string' && field.toLowerCase().includes(val);
      }) || !val; // Si no hay valor de búsqueda, no aplicar ningún filtro
    });

    // Actualizar los datos de la tabla
    this.rows = temp;
    // Resetear la paginación a la primera página
    this.table.offset = 0;
  }



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
  ngOnInit() {
    this.identity = this._adminService.getIdentity();
    this.token = this._adminService.getToken();
    // Redirigir según el rol
    // Reemplaza con la ruta deseada
    if (this.identity.role === 'ROLE_V0') {
      this._router.navigate(['/valor-cero']); // O la ruta para usuarios normales
    }

    this.getAssets();


  }

  getAssets() {
    this._route.params.forEach((params: Params) => {
      let page = +params['page'];

      if (!page) {
        page = 1;
      } else {
        this.next_page = page + 1;
        this.prev_page = page - 1;

        if (this.prev_page == 0) {
          this.prev_page = 1;
        }
      }
      this._assetService.getAssets(this.token, page).subscribe(
        (response) => {
          if (!response.assets) {
            this._router.navigate(['/']);
          } else {
            this.assets = response.assets;
            this.rows = this.assets;
            this.tempData = this.rows;
            this.tempFilterData = this.rows;
            this.tempFilterDataUser = this.rows;
            this.tempFilterData = this.rows.length;
            this.tempFilterDataUser = this.rows.length;

            setTimeout(() => {
              this.loadingIndicator = false;
            }, 1500);

          }
        },
        (error) => {
          var errorMessage = <any>error;


        }
      );
    });
  }
  getUniqueEstadoOptions(): string[] {
    if (!this.rows) {
      return ["Sin Asignar"];
    }

    const uniqueOptions: Set<string> = new Set<string>();

    // Agregar opciones únicas después de normalizar y manejar "Sin Asignar"
    this.rows.forEach(asset => {
      if (asset.estado && asset.estado.trim() !== "") {
        uniqueOptions.add(asset.estado.trim().toUpperCase());
      } else {
        uniqueOptions.add("Sin Asignar");
      }
    });

    // Convertir el conjunto a un array y ordenarlo alfabéticamente
    return Array.from(uniqueOptions).sort((a, b) => a.localeCompare(b));
  }

  filterByEstado(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const option = selectElement.value;

    if (option === "") {
      // Si se selecciona la opción "Todos", muestra todos los datos
      this.rows = this.tempData;
    } else {
      // Normalizar la opción seleccionada eliminando espacios en blanco adicionales
      const normalizedOption = option.trim().toUpperCase();

      // Filtrar los datos para mostrar solo los que coinciden con la opción seleccionada (después de normalizar)
      this.rows = this.tempData.filter(asset => {
        // Normalizar el estado del activo eliminando espacios en blanco adicionales y convirtiéndolo a mayúsculas
        const normalizedAssetEstado = asset.estado ? asset.estado.trim().toUpperCase() : "";

        if (normalizedOption === "SIN ASIGNAR") {
          // Mostrar solo los elementos cuyo estado sea undefined o vacío
          return !normalizedAssetEstado || normalizedAssetEstado === "";
        } else {
          // Mostrar solo los elementos cuyo estado coincida con la opción seleccionada (después de normalizar)
          return normalizedAssetEstado === normalizedOption;
        }
      });
    }
  }


  getUniqueCodigoOptions(): string[] {
    if (!this.rows) {
      return ["Sin Asignar"];
    }

    const uniqueOptions: Set<string> = new Set<string>();

    // Agregar opciones únicas después de normalizar y manejar "Sin Asignar"
    this.rows.forEach(asset => {
      if (asset.codigo && asset.codigo.trim() !== "") {
        uniqueOptions.add(asset.codigo.trim().toUpperCase());
      } else {
        uniqueOptions.add("Sin Asignar");
      }
    });

    // Convertir el conjunto a un array y ordenarlo alfabéticamente
    return Array.from(uniqueOptions).sort((a, b) => a.localeCompare(b));
  }


  filterByCodigo(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const option = selectElement.value;
    if (option === "") {
      // Si se selecciona la opción "Todos", muestra todos los datos
      this.rows = this.tempData;
    } else {
      // Normalizar la opción seleccionada eliminando espacios en blanco adicionales
      const normalizedOption = option.trim();

      // Filtrar los datos para mostrar solo los que coinciden con la opción seleccionada (después de normalizar)
      this.rows = this.tempData.filter(asset => {
        if (normalizedOption === "Sin Asignar") {
          // Mostrar solo los elementos cuyo código sea undefined o vacío
          return !asset.codigo || asset.codigo.trim() === "";
        } else {
          // Mostrar solo los elementos cuyo código coincida con la opción seleccionada (después de normalizar)
          return asset.codigo && asset.codigo.trim() === normalizedOption;
        }
      });
    }
  }


  getUniqueSubcuentaOptions(): string[] {
    if (!this.rows) {
      return ["Sin Asignar"];
    }

    const uniqueOptions: Set<string> = new Set(
      this.rows.map(asset => asset.subcuenta?.trim()).filter(option => typeof option === 'string')
    );

    if (this.rows.some(asset => !asset.subcuenta)) {
      uniqueOptions.add("Sin Asignar");
    }

    return Array.from(uniqueOptions).sort((a, b) => a.localeCompare(b, 'es', { ignorePunctuation: true }));
  }

  filterBySubcuenta(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const option = selectElement.value;
    if (option === "") {
      // Si se selecciona la opción "Todos", muestra todos los datos
      this.rows = this.tempData;
    } else {
      // Normalizar la opción seleccionada eliminando espacios en blanco adicionales
      const normalizedOption = option.trim();

      // Filtrar los datos para mostrar solo los que coinciden con la opción seleccionada (después de normalizar)
      this.rows = this.tempData.filter(asset => {
        if (normalizedOption === "Sin Asignar") {
          // Mostrar solo los elementos cuya subcuenta sea undefined o vacía
          return !asset.subcuenta || asset.subcuenta.trim() === "";
        } else {
          // Mostrar solo los elementos cuya subcuenta coincida con la opción seleccionada (después de normalizar)
          return asset.subcuenta && asset.subcuenta.trim() === normalizedOption;
        }
      });
    }
  }


  filterByTipo(option: string) {
    if (option === "") {
      // Si se selecciona la opción "Todos", muestra todos los datos
      this.rows = this.tempData;
    } else {
      // Normalizar la opción seleccionada eliminando espacios en blanco adicionales y convirtiéndola a mayúsculas
      const normalizedOption = option.trim().toUpperCase();

      // Filtrar los datos para mostrar solo los que coinciden con la opción seleccionada (después de normalizar)
      this.rows = this.tempData.filter(asset => {
        // Normalizar el tipo del activo eliminando espacios en blanco adicionales y convirtiéndolo a mayúsculas
        const normalizedAssetTipo = asset.tipo ? asset.tipo.trim().toUpperCase() : "";

        if (normalizedOption === "SIN ASIGNAR") {
          // Mostrar solo los elementos cuyo tipo sea undefined o vacío
          return !normalizedAssetTipo || normalizedAssetTipo === "";
        } else {
          // Mostrar solo los elementos cuyo tipo coincida con la opción seleccionada (después de normalizar)
          return normalizedAssetTipo === normalizedOption;
        }
      });
    }
  }

  getUniqueArearesOptions(): string[] {
    if (!this.rows) {
      return ["Sin Asignar"];
    }
  
    const uniqueOptions: Set<string> = new Set();
  
    this.rows.forEach(asset => {
      if (asset.arearesponsable) {
        const normalizedArea = this.normalizeString(asset.arearesponsable);
        if (normalizedArea) {
          uniqueOptions.add(normalizedArea);
        }
      }
    });
  
    if (this.rows.some(asset => !asset.arearesponsable)) {
      uniqueOptions.add("Sin Asignar");
    }
  
    const optionsArray = Array.from(uniqueOptions).sort((a, b) => {
      if (a === "Sin Asignar") {
        return -1;
      } else if (b === "Sin Asignar") {
        return 1;
      } else {
        return a.localeCompare(b, 'es', { ignorePunctuation: true });
      }
    });
  
    return optionsArray;
  }
  

  normalizeString(str: string | undefined): string {
    if (!str) {
      return "";
    }
    return str.trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  filterByAreares(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const option = selectElement.value;
  
    if (option === "") {
      // Si se selecciona la opción "Todos", muestra todos los datos
      this.rows = this.tempData;
    } else {
      // Normalizar la opción seleccionada
      const normalizedOption = this.normalizeString(option);
  
      // Filtrar los datos para mostrar solo los que coinciden con la opción seleccionada (después de normalizar)
      this.rows = this.tempData.filter(asset => {
        if (normalizedOption === "SIN ASIGNAR") {
          // Mostrar solo los elementos cuyo arearesponsable sea undefined, null o vacío
          return !asset.arearesponsable || this.normalizeString(asset.arearesponsable) === "";
        } else {
          // Mostrar solo los elementos cuyo arearesponsable coincida con la opción seleccionada (después de normalizar)
          return asset.arearesponsable && this.normalizeString(asset.arearesponsable) === normalizedOption;
        }
      });
    }
  
    // Mostrar mensaje de "no hay coincidencias" si no hay resultados
    if (this.rows.length === 0) {
      console.log("Parece que no hay coincidencias con tu búsqueda...");
    }
  }
  


  getUniqueAreaPresOptions(): string[] {
    if (!this.rows) {
      return ["Sin Asignar"];
    }
  
    const uniqueOptions: Set<string> = new Set();
  
    this.rows.forEach(asset => {
      if (asset.areapresupuestal) {
        const normalizedArea = this.normalizeString(asset.areapresupuestal);
        if (normalizedArea) {
          uniqueOptions.add(normalizedArea);
        }
      }
    });
  
    if (this.rows.some(asset => !asset.areapresupuestal)) {
      uniqueOptions.add("Sin Asignar");
    }
  
    const optionsArray = Array.from(uniqueOptions).sort((a, b) => {
      if (a === "Sin Asignar") {
        return -1;
      } else if (b === "Sin Asignar") {
        return 1;
      } else {
        return a.localeCompare(b, 'es', { ignorePunctuation: true });
      }
    });
  
    return optionsArray;
  }
  

  filterByAreaPres(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const option = selectElement.value;
  
    if (option === "") {
      this.rows = this.tempData;
    } else {
      const normalizedOption = this.normalizeString(option);
  
      this.rows = this.tempData.filter(asset => {
        if (normalizedOption === "SIN ASIGNAR") {
          return !asset.areapresupuestal || this.normalizeString(asset.areapresupuestal) === "";
        } else {
          return asset.areapresupuestal && this.normalizeString(asset.areapresupuestal) === normalizedOption;
        }
      });
    }
  
    // Mostrar mensaje de "no hay coincidencias" si no hay resultados
    if (this.rows.length === 0) {
      console.log("Parece que no hay coincidencias con tu búsqueda...");
    }
  }
  


  getUniqueTipoaltaOptions(): string[] {
    const uniqueOptions: Set<string> = new Set(this.rows.map(asset => asset.tipoalta && asset.tipoalta.trim().toUpperCase()).filter(option => typeof option === 'string'));
    if (this.rows.some(asset => !asset.tipoalta)) {
      uniqueOptions.add("Sin Asignar");
    }
    return Array.from(uniqueOptions).sort();
  }


  filterByTipoalta(option: string) {
    if (option === "") {
      // Si se selecciona la opción "Todos", muestra todos los datos
      this.rows = this.tempData;
    } else {
      // Normalizar la opción seleccionada a mayúsculas
      const normalizedOption = option.trim().toUpperCase();

      // Filtrar los datos para mostrar solo los que coinciden con la opción seleccionada (después de normalizar)
      this.rows = this.tempData.filter(asset => {
        if (normalizedOption === "SIN ASIGNAR") {
          // Mostrar solo los elementos cuyo tipoalta sea undefined o vacío
          return !asset.tipoalta || asset.tipoalta.trim() === "";
        } else {
          // Mostrar solo los elementos cuyo tipoalta coincida con la opción seleccionada (después de normalizar)
          return asset.tipoalta && asset.tipoalta.trim().toUpperCase() === normalizedOption;
        }
      });
    }
  }



  getUniqueYearOptions(): (string | 'Sin Asignar')[] {
    if (!this.rows) {
      return ['Sin Asignar'];
    }

    // Obtener valores únicos de los años de la fecha y filtrar los valores indefinidos
    const uniqueYears: (string | 'Sin Asignar')[] = [...new Set<string>(this.rows
      .map(asset => asset.fechaalta ? new Date(asset.fechaalta).getFullYear().toString() : 'Sin Asignar'))
    ];

    // Filtrar y ordenar los años válidos numéricamente
    const validYears: string[] = uniqueYears.filter(year => year !== 'Sin Asignar');
    validYears.sort((a, b) => parseInt(a) - parseInt(b));

    // Agregar 'Sin Asignar' al principio del array
    validYears.unshift('Sin Asignar');

    return validYears;
  }

  filterByYear(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const option = selectElement.value;

    if (option === "") {
      // Si se selecciona la opción "Todos", muestra todos los datos
      this.rows = this.tempData;
    } else if (option === "Sin Asignar") {
      // Filtra los datos para mostrar solo los que no tienen fecha de alta definida
      this.rows = this.tempData.filter(asset => !asset.fechaalta);
    } else {
      // Filtra los datos para mostrar solo los que coinciden con el año seleccionado
      this.rows = this.tempData.filter(asset => {
        const assetYear = asset.fechaalta ? new Date(asset.fechaalta).getFullYear().toString() : 'Sin Asignar';
        return assetYear === option;
      });
    }
  }


  aplicarFiltroSNI() {
    if (this.aplicarFiltroSiniNV) {
      // Filtrar los elementos que tengan el campo 'noinventario' vacío
      this.rows = this.tempData.filter(asset => !asset.noinventario);
    } else {
      // Mostrar todos los elementos
      this.rows = this.tempData;
    }

  }
  aplicarFiltroInterinato() {

    if (this.aplicarFiltroInt) {
      // Filtrar los elementos que tengan el campo 'noinventario' vacío y fechaalta igual al 15 de diciembre de 2020
      this.rows = this.tempData.filter(asset => this.esFechaAltaValida(asset.fechaalta));
    } else {
      // Mostrar todos los elementos
      this.rows = this.tempData;
    }
  }

  esFechaAltaValida(fechaalta: Date): boolean {
    // Crear una nueva fecha con la fecha específica que deseas comparar (en formato ISO 8601)
    const fechaFiltro = new Date('2020-12-15T00:00:00Z');
    // Convertir la cadena de fechaalta en un objeto Date
    const fechaaltaDate = new Date(fechaalta);
    // Verificar si las fechas son iguales (solo comparando el año, el mes y el día)
    return fechaaltaDate.getFullYear() === fechaFiltro.getFullYear() &&
      fechaaltaDate.getMonth() === fechaFiltro.getMonth() &&
      fechaaltaDate.getDate() === fechaFiltro.getDate();
  }
  aplicarFiltroRepetidos() {
    if (this.aplicarFiltroduplicated) {
      // Filtrar los elementos con valores repetidos exactos en el campo 'noinv' y que no sean espacios en blanco
      this.rows = this.tempData
        .filter((asset, index, self) =>
          asset.noinventario && asset.noinventario.trim() !== '' && self.filter(a => a.noinventario === asset.noinventario).length > 1
        )
        .sort((a, b) => (a.noinventario > b.noinventario ? 1 : -1))
        .map((asset, index, self) => ({
          ...asset,
          duplicated: index > 0 && self[index - 1].noinventario === asset.noinventario
        }));
    } else {
      // Mostrar todos los elementos
      this.rows = this.tempData;
    }
  }



  contienePalabraProhibida(desc: string): boolean {
    if (!desc) {
      return false; // Si desc es undefined, retornar false
    }
    const palabrasProhibidas = ['teclado', 'mouse', 'repisa', 'perforadora', 'guillotina', 'basura', 'portapapeles', 'papelera', 'arreador', 'soporta libro'];
    const palabrasDesc = desc.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Normaliza y convierte a minúsculas sin acentos
    return palabrasProhibidas.some(palabra => palabrasDesc.includes(palabra));
  }

  exportexcel(table: any): void {
    this.loadingExcel2 = true;
    let data = table.rows.map(row => {
      const { _id, ...rowWithoutId } = row; // Eliminar el campo '_id' de cada objeto de la fila
      return rowWithoutId;
    });

    let ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data); // Convertir los datos en un objeto de hoja de cálculo
    let wb: XLSX.WorkBook = XLSX.utils.book_new(); // Crear un nuevo libro de trabajo
    let dateexcel = new Date();
    let formattedDate = dateexcel.toLocaleDateString().replace(/\//g, "-");
    XLSX.utils.book_append_sheet(wb, ws, 'Bienes muebles'); // Agregar la hoja de trabajo al libro
    XLSX.writeFile(wb, 'Bienes_muebles_Tizayuca_fragmento_' + formattedDate + '.xlsx'); // Guardar el libro en un archivo con el nombre 'data.xlsx'

    setTimeout(() => {
      this.loadingExcel2 = false;
    }, 1500);
  }

  getReportsExcel() {
    this._route.params.forEach((params: Params) => {

      let page = +params['page'];

      if (!page) {
        page = 1;
      } else {
        this.next_page = page + 1;
        this.prev_page = page - 1;

        if (this.prev_page == 0) {
          this.prev_page = 1;
        }
      }
      this._assetService.getAssets(this.token, page).subscribe(
        (response) => {
          this.loadingExcel = false;
          if (!response.assets) {
            this._router.navigate(['/']);

          }


          else {
            // Eliminar el campo '_id' de cada objeto en la lista de assets
            const assetsWithoutId = response.assets.map(asset => {
              const { _id, ...assetWithoutId } = asset;
              return assetWithoutId;
            });



            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(assetsWithoutId);
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Bienes muebles TOTAL');
            let dateexcel = new Date();
            let formattedDate = dateexcel.toLocaleDateString().replace(/\//g, "-");
            /* generar un archivo excel y forzar la descarga */
            XLSX.writeFile(wb, 'Bienes_muebles_Tizayuca_' + formattedDate + '.xlsx');

          }
        },
        (error) => {
          this.loadingExcel = false;
          var errorMessage = <any>error;


        }
      );
    });

  }


  onDeleteConfirm(id) {
    this.confirmado = id;
  }

  onCancelAsset() {
    this.confirmado = null;
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

              

                // Redirigir según el rol
                if (this.identity.role === 'ROLE_admin') {
                  this._router.navigate(['/']); // Reemplaza con la ruta deseada
                } else if (this.identity.role === 'ROLE_V0') {
                  this._router.navigate(['/valor-cero']); // O la ruta para usuarios normales
                }



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
  onDeleteAsset(id) {
    this._assetService.deleteAsset(this.token, id).subscribe(
      (response) => {
        if (!response.asset) {
          alert('Error en el servidor');
        }

      },
      (error) => {
        var errorMessage = <any>error;

      }
    );
  }



  /*  borrar() {
     const deleteButtons = document.querySelectorAll('.notification .delete') as NodeListOf<Element>;
 
     deleteButtons.forEach(($delete) => {
       const $notification = $delete.parentNode;
 
       if ($notification) {
         $notification.parentNode.removeChild($notification);
       }
     });
   } */

  backPage() {
    window.history.back();
  }



  downloadExcel() {
    this.loadingExcel = true;
    this.getReportsExcel();
  }






  
  getUniqueUbicacionOptions(): string[] {
    if (!this.rows) {
      return ["Sin Asignar"];
    }
  
    const uniqueOptions: Set<string> = new Set();
  
    this.rows.forEach(asset => {
      if (asset.ubicacionfisica) {
        const normalizedUbicacion = this.normalizeString(asset.ubicacionfisica);
        if (normalizedUbicacion) {
          uniqueOptions.add(normalizedUbicacion);
        }
      }
    });
  
    if (this.rows.some(asset => !asset.ubicacionfisica)) {
      uniqueOptions.add("Sin Asignar");
    }
  
    const optionsArray = Array.from(uniqueOptions).sort((a, b) => {
      if (a === "Sin Asignar") {
        return -1;
      } else if (b === "Sin Asignar") {
        return 1;
      } else {
        return a.localeCompare(b, 'es', { ignorePunctuation: true });
      }
    });
  
    return optionsArray;
  }
  

  filterByUbicacion(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const option = selectElement.value;
  
    console.log('Opción seleccionada:', option);
    console.log('Datos originales:', this.tempData);
  
    if (option === "") {
      this.rows = this.tempData;
    } else {
      const normalizedOption = this.normalizeString(option);
  
      this.rows = this.tempData.filter(asset => {
        if (normalizedOption === "SIN ASIGNAR") {
          return !asset.ubicacionfisica || this.normalizeString(asset.ubicacionfisica) === "";
        } else {
          return asset.ubicacionfisica && this.normalizeString(asset.ubicacionfisica) === normalizedOption;
        }
      });
    }
  
    console.log('Filas filtradas:', this.rows);
  
    if (this.rows.length === 0) {
      console.log("Parece que no hay coincidencias con tu búsqueda...");
    }
  }
  






}
