export class CountByPostatus {

  public id !: number;
  public postatus !: string;
  public count !: number;
  public perecentage !: number;

  constructor(id:number,postatus:string,count:number,perecentage:number) {
    this.id=id;
    this.postatus=postatus;
    this.count=count;
    this.perecentage=perecentage;
  }

}
