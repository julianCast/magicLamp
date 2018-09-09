import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Platform } from 'ionic-angular';
import { Globalization } from "@ionic-native/globalization";
import 'rxjs/add/operator/map'
@Injectable()
export class LanguageService {
  public langSelected: string;
  public langConfig: any;

  constructor(
    private http: Http,
    private plat: Platform,
    private globalization: Globalization
  )
  {

  }

  private readLanguageConfig(): Promise<any>
  {
    if (this.langConfig) {
      return Promise.resolve(this.langConfig)
    } else {
      return new Promise((resolve, reject) => {
        this.http.get('assets/i18n/config.json')
          .map(data => data.json())
          .subscribe(
            data => {
              this.langConfig = data
              resolve(data)
            }
          )

      })
    }
  }

  isSupported(langCode: string)
  {
    if (this.langConfig) {
      return this.langConfig.supported.indexOf(langCode) != -1;
    } else {
      throw new Error('Configuration not ready');
    }
  }

  selectBestLanguage(): Promise<string>
  {
    return this.readLanguageConfig().then(
      () => {
       
       if (this.plat.is('cordova')) {
          return this.globalization.getPreferredLanguage().then(
            l => {
              const langCode = l.value.substr(0, l.value.indexOf('-'))

              if (this.isSupported(langCode)) {
                this.langSelected = langCode
              } else {
                this.langSelected = this.langConfig.default
              }

              return this.langSelected
            }
          )
        } else {
          this.langSelected = this.langConfig.default
          return this.langSelected
        }
      },
      error => {
        console.error('There was an error reading language Configuration: '+error)
        this.langSelected = 'en'
        return 'en'
      }
    )
  }

}
