export class Asset {
  constructor(
    public subcuenta: string,
    public codigo: string,
    public noinventario: string,
    public tipo: string,
    public desc: string,
    public marca: string,
    public modelo: string,
    public noserie: string,
    public estado: string,
    public foto: undefined,
    public arearesponsable: string,
    public areapresupuestal: string,
    public costo: string,
    public depreciacion: string,
    public valorenlibros: string,
    public poliza: string,
    public fechapoliza: Date | null,
    public DAPB: string,
    public fechaDAPB: Date | null,
    public fechaalta: Date | null,
    public tipoalta: string,
    public RFC: string,
    public nombrecompleto: string,
    public fecharesguardo: Date | null,
    public fechabaja: Date | null,
    public tipobaja: string,
    public DAB: string,
    public validated: boolean,
    // public legend: string,
    public elDAB: string,
    public elDAPB: string,
    public polizanobaja: Date | null,
    public fechapolizabaja: Date | null,
    public _id: string,
    public ubicacionfisica: string,
    public localizado: string,
    public notes?: Note[]
  ) { }
}


export class AssetLIST {
  constructor(
    public subcuenta: string,
    public codigo: string,
    public noinventario: string,
    public tipo: string,
    public desc: string,
    public marca: string,
    public modelo: string,
    public noserie: string,
    public estado: string,
    public foto: undefined,
    public arearesponsable: string,
    public areapresupuestal: string,
    public costo: string,
    public depreciacion: string,
    public valorenlibros: string,
    public poliza: string,
    public fechapoliza: Date,
    public DAPB: string,
    public fechaDAPB: Date,
    public fechaalta: Date,
    public tipoalta: string,
    public RFC: string,
    public nombrecompleto: string,
    public fecharesguardo: Date,
    public fechabaja: Date,
    public tipobaja: string,
    public DAB: string,
    public validated: boolean,
    // public legend: string,
    public elDAB: string,
    public elDAPB: string,
    public polizanobaja: Date,
    public fechapolizabaja: Date,
    public _id: string,
    public ubicacionfisica: string,
    public localizado: string,
    public notes?: Note[]
  ) { }
}

// Define la clase Note si no existe
export class Note {
  constructor(
    public content: string,
    public date: Date
  ) { }
}