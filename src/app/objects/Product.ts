export class Product {
    name: string;
    price: number;
    status: string;
    guys: Array<any>;

    constructor(name: string, price: number, status: string, guys: Array<any>) {
      this.name = name;
      this.price = price;
      this.status = status;
      this.guys = guys;
    }
  }
