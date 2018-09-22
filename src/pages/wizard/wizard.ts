import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
import { InAppBrowser } from '@ionic-native/in-app-browser';

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

  protected getDomeWeb(): void
  {
    const iab = new InAppBrowser
    iab.create("https://www.thingiverse.com/thing:3101864", "_system", "location=yes");
  }

  protected getIntoTheApp(): void
  {
    this.storage.set('wizardShown', true)

    $('#overlay').animate({
      opacity: 1,
    }, 2000, () => {
      this.nav.setRoot(HomePage)
    })
  }

}
