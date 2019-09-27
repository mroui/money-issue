import { Component, OnInit } from '@angular/core';
import { AlertController, IonItemSliding, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Issue, Issueservice } from '../../services/issueservice/issueservice.service';
import { Person, Peopleservice } from '../../services/peopleservice/peopleservice.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-people',
  templateUrl: './people.page.html',
  styleUrls: ['./people.page.scss'],
})


export class PeoplePage implements OnInit {

  issue: Issue = {
    title: '',
    date: '',
    price: 0
  };

  idIssue: any;

  people: Observable<Person[]>;


  constructor(private activatedRoute: ActivatedRoute, private alertController: AlertController,
              private router: Router, private issueservice: Issueservice, private toastCtrl: ToastController,
              private peopleservice: Peopleservice ) {
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
      this.people = this.peopleservice.getSpecificPeople(this.idIssue );
    }
  }


  removePerson(slidingItem: IonItemSliding, person: Person) {
    this.peopleservice.deletePerson(person.id);
    slidingItem.close();
  }


  async addPerson() {
    const alert = await this.alertController.create({
      inputs: [{
          name: 'name',
          placeholder: 'Imię nowej osoby'
        }],
      buttons: [{
        text: 'Anuluj',
        handler: () => {
          alert.dismiss();
        }}, {
        text: 'Stwórz',
        handler: data => {
          this.add(data.name);
        }}]
    });
    await alert.present();
  }


  add(Name: string) {
    if (Name !== '') {
      this.peopleservice.addPerson({
        idIssue: this.idIssue,
        name: Name,
        price: 0.0
      });
    } else {
      this.presentToast();
      this.addPerson();
    }
  }


  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Imię nie może być puste.',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

}
