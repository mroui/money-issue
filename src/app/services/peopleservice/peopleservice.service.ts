import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';


export interface Person {
  id?: string;
  idIssue: string;
  name: string;
  price: number;
}


@Injectable({
  providedIn: 'root'
})
export class Peopleservice {

  private people: Observable<Person[]>;
  private peopleCollection: AngularFirestoreCollection<Person>;


  constructor(private afs: AngularFirestore) {
    this.peopleCollection = this.afs.collection<Person>('people');
    this.people = this.peopleCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }


  getPeople(): Observable<Person[]> {
    this.peopleCollection = this.afs.collection<Person>('people');
    this.people = this.peopleCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
    return this.people;
  }


  getPeopleAgain(): Observable<Person[]> {
    this.peopleCollection = this.afs.collection<Person>('people');
    this.people = this.peopleCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
    return this.people;
  }


  getPerson(id: string): Observable<Person> {
    return this.peopleCollection.doc<Person>(id).valueChanges().pipe(
      take(1),
      map(person => {
        person.id = id;
        return person;
      })
    );
  }


  getSpecificPeople(idIssue: string): Observable<Person[]> {
    return this.afs.collection<Person>('people', ref => ref.where ( 'idIssue' , '==' , idIssue )).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }


  getSpecificPeopleForUpdatePrice(id: string): Observable<Person> {
    return this.peopleCollection.doc<Person>(id).valueChanges().pipe(
      take(1),
      map(person => {
        person.id = id;
        return person;
      })
    );
  }


  addPerson(person: Person): Promise<DocumentReference> {
    return this.peopleCollection.add(person);
  }


  updatePerson(person: Person): Promise<void> {
    return this.peopleCollection.doc(person.id).update({ idIssue: person.idIssue, name: person.name, price: person.price });
  }


  deletePerson(id: string): Promise<void> {
    return this.peopleCollection.doc(id).delete();
  }

}
