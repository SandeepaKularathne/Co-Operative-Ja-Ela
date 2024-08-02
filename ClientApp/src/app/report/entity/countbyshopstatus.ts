export class CountByShopstatus {

  public id !: number;
  public shopstatus !: string;
  public count !: number;
  public perecentage !: number;

  constructor(id:number,shopstatus:string,count:number,perecentage:number) {
    this.id=id;
    this.shopstatus=shopstatus;
    this.count=count;
    this.perecentage=perecentage;
  }

}
