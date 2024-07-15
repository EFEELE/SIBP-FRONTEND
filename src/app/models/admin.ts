export class Admin{
  constructor(
    public _id: string,
    public name: string,
    public father_lastname: string,
    public mother_lastname: string,
    public email: string,
    public password: string,
    public role: string
  ){}
}
