import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { HomePage } from '../pages/home/home';
import { LanguageService } from '../providers/language-service/language-service';
import { WizardPage } from '../pages/wizard/wizard';
import { Storage } from '@ionic/storage';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any

  constructor(
    private platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    private translate: TranslateService,
    private language: LanguageService,
    private storage: Storage
  ) {

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.hide();
      this.selectAppLanguage().then(
        () => {
          this.storage.get('wizardShown').then(
            data => {
              if (data) {
                this.rootPage = HomePage
              } else {  
                this.rootPage = WizardPage
              }
              setTimeout(() => {
                splashScreen.hide();
              }, 500);
            },
            e => {
              console.error('e', e)
            }
          )    
        }
      )  
    }); 
  }


  private selectAppLanguage(): Promise<any>
  {
    return new Promise((resolve, reject) => {
      this.language.selectBestLanguage().then(
        langCode => {
          this.translate.use(langCode).subscribe(
            () => {
              this.platform.setLang(langCode, true)
              resolve()
            } )
        }
      )
    })
  }
}

