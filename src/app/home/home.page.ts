import { Component, OnInit } from '@angular/core';
import { NavController, IonItemSliding, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Issue, Issueservice } from '../services/issueservice/issueservice.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage implements OnInit {

  issues: Issue[];

  constructor(private navCtrl: NavController, private alertController: AlertController,
              private toastCtrl: ToastController, private router: Router, private issueservice: Issueservice) {
              }


  ngOnInit() {
    this.issueservice.getIssues().subscribe(res => {
      this.issues = res;
    });
  }


  removeIssue(slidingItem: IonItemSliding, issue: Issue) {
    this.issueservice.deleteIssue(issue.id);
    slidingItem.close();
  }


  async addIssue() {
    const alert = await this.alertController.create({
      inputs: [{
          name: 'title',
          placeholder: 'Tytuł nowej składki'
        }],
      buttons: [{
        text: 'Anuluj',
        handler: () => {
          alert.dismiss();
        }}, {
        text: 'Stwórz',
        handler: data => {
          this.add(data.title);
        }}]
    });
    await alert.present();
  }


  add(Title: string) {
    if (Title !== '') {

      let day = '', month = '';

      if (new Date().getDate().toString().length === 1) {
        day = '0';
      }
      day += new Date().getDate().toString();

      if (new Date().getUTCMonth().toString().length === 1) {
        month = '0';
      }
      month +=  new Date().getUTCMonth().toString();

      const time = day + '.' + month + '.' + new Date().getFullYear().toString();

      let newissue =  {title: Title, date: time, price: 0.0 };

      this.issueservice.addIssue(newissue);

      this.navigateToIssue(newissue);

    } else {
      this.presentToast();
      this.addIssue();
    }
  }


  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Tytuł nie może być pusty.',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }


  navigateToIssue(item: Issue) {
    this.router.navigate(['issue/' + item.id]);
  }


}
