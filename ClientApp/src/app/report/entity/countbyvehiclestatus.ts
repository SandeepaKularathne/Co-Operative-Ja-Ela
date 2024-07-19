export class CountByVehiclestatus {

  public id !: number;
  public vehiclestatus !: string;
  public count !: number;
  public perecentage !: number;

  constructor(id:number,vehiclestatus:string,count:number,perecentage:number) {
    this.id=id;
    this.vehiclestatus=vehiclestatus;
    this.count=count;
    this.perecentage=perecentage;
  }

}
