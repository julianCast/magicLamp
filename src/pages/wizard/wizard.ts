import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
declare var $: any;

@Component({
  templateUrl: 'wizard.html',
  selector: '.wizard-page'
})
export class WizardPage {
  @ViewChild('viewSlider') slider: Slides;

  constructor(
    private nav: NavController,
    private storage: Storage
  )
  {
 
  }

  getIntoTheApp()
  {
    this.storage.set('wizardShown', true)

    $('#overlay').animate({
      opacity: 1,
    }, 2000, () => {
      this.nav.setRoot(HomePage)
    })
  }

}
