export class Inmueble{
    constructor(
        public noinventario: string,
        public codigopartida: string,
        public subcuenta: string,
        public desc: string,
        public superficie: string,
        public superficieCONST: string,
        public clasificacion: string,
        public monto: number,
        public valorenlibros: string,
        public poliza: string,
        public fechapoliza: string,
        public arearesponsable: areares,
        public areapresupuestal: string,
        public noescritura: number,
        public noregistro: number,
        public fechaalta: string,
        public tipoalta: string,
        public DAPB: string,
        public fechaDAPB: string,
        public elDAPB: string,
        public RFC: string,
        public nombrecompleto: string,
        public fecharesguardo: string,
        public motivo: string,
        public fechabaja: string,
        public tipobaja: string,
        public DAB: string,
        public elDAB: string,
        public clasOG: string,
        public polizaBAJA: string,
        public comentario: string,
        public validated: boolean,
       // public legend: boolean
    ){}
  }
  
  export class areares{
    constructor(
      public clave: string,
      public valor: string,
      public homoclave: string,
      public _id: string
    ){}
  }
