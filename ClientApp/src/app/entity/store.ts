

export class Store{

  public id !: number;
  public storenumber !: number;
  public location !: string;
  public esdate !: string;
  public cnumber !: string;

  constructor(id: number, storenumber: number, location: string, esdate: string, cnumber: string) {
    this.id = id;
    this.storenumber = storenumber;
    this.location = location;
    this.esdate = esdate;
    this.cnumber = cnumber;
  }

}





