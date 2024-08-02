export class CountByCategory {

  public id !: number;
  public disstatus !: string;
  public count !: number;
  public perecentage !: number;

  constructor(id:number,disstatus:string,count:number,perecentage:number) {
    this.id=id;
    this.disstatus=disstatus;
    this.count=count;
    this.perecentage=perecentage;
  }

}
