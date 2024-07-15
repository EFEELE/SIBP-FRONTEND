export class Course{
  constructor(
    public name: string,
    public date: Date,
    public archive: undefined,
    public employee: string,
    public _id: string
  ){}
}
export interface CourseInterface {
  _id:             string;
  name:            string;
  date:           Date;
  url:             string;
  employee:        Employee;
  id:              string;
  __v:             number;
}
export interface Employee {
   carnet: string,
   name: string,
   father_lastname: string,
   mother_lastname: string,
   birth: Date,
   date_start: Date,
   blood_type: string,
   scolarship: string,
   address: string,
   last_evaluation: string,
   result: string,
   photo: string,
   status: string,
   affiliation_area: string,
   department: string,
   job: string,
   CURP: string,
   RFC: string,
   _id: string,
}
