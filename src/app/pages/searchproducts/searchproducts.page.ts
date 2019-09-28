import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { AlertController, IonItemSliding, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Issue, IssueService } from '../../services/issue/issue.service';
import { Person, PeopleService } from '../../services/people/people.service';
import { Product, ProductsService } from '../../services/products/products.service';
import { Observable } from 'rxjs';


export interface DatabaseProduct {
  id?: string;
  name: string;
}

@Component({
  selector: 'app-searchproducts',
  templateUrl: './searchproducts.page.html',
  styleUrls: ['./searchproducts.page.scss'],
})


export class SearchproductsPage implements OnInit {

  issue: Issue = {
    title: '',
    date: '',
    price: 0
  };


  idIssue: any;
  issues: Issue[] = [];

  private databaseproductsCollection: AngularFirestoreCollection<DatabaseProduct>;
  private peopleCollection: AngularFirestoreCollection<Person>;

  people: Observable<Person[]>;

  nameSearchedProduct: string;
  checkedSearchedProduct = false;

  allProducts: Array<any> = [];
  tempProducts: Array<any> = [];

  contacts: Array<any> = [];
  names: Observable<string[]>;

  pricesAndPersons: Array<Person> = [];

  productsprices: Array<any> = [];


  constructor(private alertController: AlertController, private toastCtrl: ToastController,
              private router: Router, private afs: AngularFirestore, private activatedRoute: ActivatedRoute,
              private issueservice: IssueService, private peopleService: PeopleService,
              private productsservice: ProductsService) {

              this.databaseproductsCollection = this.afs.collection<DatabaseProduct>('databaseproducts');
              this.databaseproductsCollection.valueChanges().subscribe(data => {
                data.forEach(element => {
                  this.allProducts.push({name: element.name, isChecked: false});
                });
              });
              this.tempProducts = this.allProducts;

              this.issueservice.getIssues().subscribe(res => {
                this.issues = res;
              });
  }


  ngOnInit() {
    this.idIssue = this.activatedRoute.snapshot.paramMap.get('id');
    this.issueservice.getIssue(this.idIssue).subscribe(issue => {
      this.issue = issue;
    });
  }


  ionViewWillEnter() {
    this.idIssue = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.idIssue ) {
      this.issueservice.getIssue(this.idIssue ).subscribe(issue => {
        this.issue = issue;
      });
      this.tempProducts = this.allProducts;
      this.initializeContacts();
    }
  }


  initializeArray() {
    this.tempProducts = Object.assign([], this.allProducts);
  }


  getItems(ev: any) {
    this.initializeArray();
    const val = ev.target.value;
    this.nameSearchedProduct = ev.target.value;

    if (val && val.trim() !== '') {
      this.tempProducts = this.tempProducts.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
  }


  async addPriceGuysProduct(e: any, name: string, product: string) {
    if (e.target.checked === false) {
      if (this.tempProducts.length === 0) {
        this.checkedSearchedProduct = true;
        name = this.nameSearchedProduct;
        product = this.nameSearchedProduct;
      }
      const alert = await this.alertController.create({
      header: name,
      message: 'Enter the price of product',
      inputs: [{
          name: 'price',
          type: 'number',
          min: '0',
          value: '0'
        }],
      buttons: [{
        text: 'Cancel',
        handler: () => {
          e.target.checked = false;
          this.checkedSearchedProduct = false;
          alert.dismiss();
        }}, {
        text: 'Next',
        handler: data => {
          this.setGuys(e, name, data.price, product);
        }}]
    });
      await alert.present();
    }
  }


  initializeContacts() {
    this.people = this.peopleService.getPeopleAgain();

    this.contacts = [];
    this.pricesAndPersons = [];

    this.people.forEach(element => {
      element.forEach( x => {
        if (x.idIssue === this.idIssue ) {
          this.contacts.push({type: 'checkbox', label: x.name, value: x.name});
          this.pricesAndPersons.push({ id: x.id, idIssue: this.idIssue, name: x.name, price: 0.0});
        }
      });
    });
  }


  addProduct(e: any, priceprod: number, guysprod: Array<string>, product: string) {
    if(this.tempProducts.length === 0) {
      this.allProducts.push({name: this.nameSearchedProduct, isChecked: true});
    }
    if (guysprod.length > 0) {
      this.productsprices.push({name: product, price: priceprod});
      const priceForPerson = priceprod / guysprod.length;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < guysprod.length; i++) {
        // tslint:disable-next-line: prefer-for-of
        for (let j = 0; j < this.pricesAndPersons.length; j++) {
          if (guysprod[i] === this.pricesAndPersons[j].name) {
            this.pricesAndPersons[j].price += priceForPerson;
          }
        }
      }
    } else {
      e.target.checked = false;
      this.checkedSearchedProduct = false;
      this.presentToast();
    }
  }


  async setGuys(e: any, name: string, cena: number, product: string) {
    const alert = await this.alertController.create({
      header: name,
      message: 'Select people who pay',
      inputs: this.contacts,
      buttons: [{
        text: 'Cancel',
        handler: () => {
          e.target.checked = false;
          this.checkedSearchedProduct = false;
          alert.dismiss();
        }}, {
        text: 'Add',
        handler: data => {
          const guysprod: Array<string> = data;
          this.addProduct(e, cena, guysprod, product);
        }}]
    });
    await alert.present();
    }


  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'List of people cannot be empty!',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }


    addListOfGetProducts() {
      let foundedprice;
      let sumofproducts;

      this.allProducts.forEach( a => {
          if (a.isChecked === true) {
          this.productsprices.forEach( x => {
              if (x.name === a.name) {
                foundedprice = x.price;
                this.productsservice.addProduct({idIssue: this.idIssue, name: a.name, price: foundedprice});
                sumofproducts += foundedprice;
              }
          });
        }
        });

      this.pricesAndPersons.forEach( a => {
        let person: Person;
        this.peopleService.getSpecificPeopleForUpdatePrice(a.id).subscribe(x => {
          person = x;
          const newprice = person.price + a.price;
          person.price = newprice;
          this.peopleService.updatePerson(person);
        });
      });

      this.router.navigate(['issue/' + this.idIssue]);
    }

}
