export class CountByCRDate {
  
  public id !: number;
  public year !: number;
  public month !: number;
  public gender !: string;
  public tcount !: number

  constructor(year: number, month: number, gender: string, tcount: number) {
    this.year = year;
    this.month = month;
    this.gender = gender;
    this.tcount = tcount;
  }

}
