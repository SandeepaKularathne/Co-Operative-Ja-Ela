export class Countbyitem {

  public id !: number;
  public item !: string;
  public count !: number;



  constructor(id: number, item: string, count: number) {
    this.id = id;
    this.item = item;
    this.count = count;
  }
}
