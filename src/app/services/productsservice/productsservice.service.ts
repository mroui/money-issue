import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';


export interface Product {
  id?: string;
  idIssue: string;
  name: string;
  price: number;
}


@Injectable({
  providedIn: 'root'
})
export class Productsservice {

  private products: Observable<Product[]>;
  private productsCollection: AngularFirestoreCollection<Product>;

  constructor(private afs: AngularFirestore) {
    this.productsCollection = this.afs.collection<Product>('products');
    this.products = this.productsCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }


  getProducts(): Observable<Product[]> {
    return this.products;
  }


  getProduct(id: string): Observable<Product> {
    return this.productsCollection.doc<Product>(id).valueChanges().pipe(
      take(1),
      map(product => {
        product.id = id;
        return product;
      })
    );
  }


  getSpecificProducts(idIssue: string): Observable<Product[]> {

    return this.afs.collection<Product>('products', ref => ref.where ( 'idIssue' , '==' , idIssue )).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }


  addProduct(product: Product): Promise<DocumentReference> {
    return this.productsCollection.add(product);
  }


  updateProduct(product: Product): Promise<void> {
    return this.productsCollection.doc(product.id).update({ idIssue: product.idIssue, name: product.name, price: product.price });
  }


  deleteProduct(id: string): Promise<void> {
    return this.productsCollection.doc(id).delete();
  }


}
