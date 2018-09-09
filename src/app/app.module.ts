import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Brightness } from '@ionic-native/brightness';
import { ScreenOrientation } from '@ionic-native/screen-orientation'
import { NativeAudio } from '@ionic-native/native-audio'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Insomnia } from '@ionic-native/insomnia';
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { LanguageService } from '../providers/language-service/language-service';
import { HttpModule } from "@angular/http"

import { Globalization } from '@ionic-native/globalization';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp)
  ],
  exports: [
    TranslateModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Insomnia,
    Brightness,
    ScreenOrientation,
    NativeAudio,
    LanguageService,
    Globalization,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

// Change path for localization folder
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}