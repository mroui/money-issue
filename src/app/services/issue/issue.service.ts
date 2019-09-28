import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface Issue {
  id?: string;
  title: string;
  date: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class IssueService {

  private issues: Observable<Issue[]>;
  private issueCollection: AngularFirestoreCollection<Issue>;

  constructor(private afs: AngularFirestore) {
    this.issueCollection = this.afs.collection<Issue>('issues');
    this.issues = this.issueCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }


  getIssues(): Observable<Issue[]> {
    return this.issues;
  }


  getIssue(id: string): Observable<Issue> {
    return this.issueCollection.doc<Issue>(id).valueChanges().pipe(
      take(1),
      map(issue => {
        issue.id = id;
        return issue;
      })
    );
  }


  addIssue(issue: Issue): Promise<DocumentReference> {
    return this.issueCollection.add(issue);
  }


  updateIssue(issue: Issue): Promise<void> {
    return this.issueCollection.doc(issue.id).update({ title: issue.title, date: issue.date, price: issue.price });
  }


  deleteIssue(id: string): Promise<void> {
    return this.issueCollection.doc(id).delete();
  }


}
