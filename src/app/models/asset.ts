export class Asset{
  constructor(
    public subcuenta: string,
    public codigo: string,
    public noinventario: string,
    public tipo: string,
    public desc: string,
    public marca: string,
    public modelo: string,
    public noserie: string,
    public  estado: string,
    public foto: string,
    public  arearesponsable: string,
    public areapresupuestal: string,
    public costo: string,
    public depreciacion: string,
    public valorenlibros: string,
    public  poliza: string,
    public  fechapoliza: Date,
    public DAPB: string,
    public  fechaDAPB: Date,
    public  fechaalta: Date,
    public  tipoalta: string,
    public  RFC: string,
    public  nombrecompleto: string,
    public  fecharesguardo: string,
    public  fechabaja: string,
    public  tipobaja: string,
    public  DAB: string,
    public validated: boolean,
    public legend: string,
    public elDAB: string,
    public elDAPB: string,
    public polizanobaja: string,
    public fechapolizabaja: string,
 

    public _id: string,           // Añadir aquí
    public status_report: string,   // Añadir aquí
    public usrxgene: string // Añadir aquí
  ){}
}
