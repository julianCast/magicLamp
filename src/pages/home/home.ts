import { Component } from '@angular/core'
import { NavController } from 'ionic-angular'
import { Insomnia } from '@ionic-native/insomnia'
import { Brightness } from '@ionic-native/brightness'
import { ScreenOrientation } from '@ionic-native/screen-orientation'
import { NativeAudio } from '@ionic-native/native-audio'
import { TranslateService } from '@ngx-translate/core';

declare var $: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private lightIsOn : boolean = false
  private squareShapeOn : boolean = false
  protected hideQuickInfo : boolean = false
  private turnOffTimer: any = null
  private minutesToTurnOff: number = 8
  private lightMode: string = 'inOut'
  private lightModes: Array<string> = ["inOut", "478", "bonfire"]

  // inOut Mode
  private secondsToInhale_inOut: number = 4
  private colorToInhale_inOut: string = "#ce7b00"
  
  private secondsToExhale_inOut: number = 6
  private colorToExhale_inOut: string = "#ce4c00"

  // 478 Mode
  private secondsToInhale_478: number = 4
  private colorToInhale_478: string = "#ce7b00"
  
  private secondsToHoldBreathe_478: number = 7
  private colorToHoldBreathe_478: string = "#ff3b34"
  
  private secondsToExhale_478: number = 8
  private colorToExhale_478: string = "#ce4c00"
  private timeOutHoldBreath_478: any

  //bonfire 
  private bonFireTimeout: any
  private soundIsEnabled : boolean = false
  constructor(
    public navCtrl: NavController,
    public insomnia: Insomnia,
    private brightness: Brightness,
    private screenOrientation: ScreenOrientation,
    private nativeAudio: NativeAudio,
    private translate: TranslateService
  ) {}

  protected startInOutMode(): void
  {
    $('#light').animate({
      backgroundColor: this.colorToInhale_inOut
    }, this.secondsToInhale_inOut*1000, () => {
      if (this.lightIsOn) {
        $('#light').animate({
          backgroundColor: this.colorToExhale_inOut
        }, 500, () => {
          $('#light').animate({
            backgroundColor: 'black'
          }, this.secondsToExhale_inOut*1000, () => {
            if (this.lightIsOn) {
              this.startInOutMode()
            }
          });
        })
      }
    });
  }

  protected start478Mode(): void
  {
    $('#light').animate({
      backgroundColor: this.colorToInhale_478
    }, this.secondsToInhale_478*1000, () => {
      if (this.lightIsOn) {
        $('#light').animate({
          backgroundColor: this.colorToHoldBreathe_478
        }, 500, () => {
          this.timeOutHoldBreath_478 = setTimeout(() => {
            $('#light').animate({
              backgroundColor: this.colorToExhale_478
            },500, () => {
              $('#light').animate({
                backgroundColor: 'black'
              }, this.secondsToExhale_478 * 1000, () => {
                if (this.lightIsOn) {
                  this.start478Mode()
                }
              });
            })
          }, this.secondsToHoldBreathe_478*1000);
        })
      } 
    });
  }

  protected startBonfireMode(): void
  {
    $('#light').css({ backgroundColor: "#ce7b00" })

    $('#light').animate({ opacity: this._getRandomValue(0.7, 1) },this._getRandomValueNoDecimals(50, 1200), () =>{
      this.startBonfireMode()
    })
  }

  protected changeLightShape(): void
  {
    this.squareShapeOn = this.squareShapeOn ? false : true
  }

  protected invertScreen(): void
  {
    let orientationModeToChange = "portrait-primary"
    
    if (this.screenOrientation.type == "portrait-primary") {
      orientationModeToChange = "portrait-secondary"
    }
    this.screenOrientation.lock(orientationModeToChange);
  }

  protected _getRandomValue(min: number, max: number): number 
  {
    return Math.round((Math.random() * (max - min) + min) * 100) / 100
  }

  protected _getRandomValueNoDecimals(min: number, max: number): number 
  {
    return Math.round((Math.random() * (max - min) + min) )
  }

  protected _getRandomColor(): string 
  {
    let myArray = ["#ce7b00","#e7b00","#ce7b00","#ce7b00","#ce7b00", "#ff6600"]
    return myArray[Math.floor(Math.random() * myArray.length)];
  }

  protected turnOn(): void
  {
    this.lightIsOn =  true
    this.insomnia.keepAwake()
    setTimeout(() => {
      this.hideQuickInfo = true
    }, 2000);
    switch (this.lightMode) {
      case "inOut":
        this.startInOutMode()
        if (this.soundIsEnabled) {
          this.nativeAudio.loop('tictac').catch(
            e => {
              console.error(e)
            }
          );
        }
        break;
      case "478":
        this.start478Mode()
        if (this.soundIsEnabled) {
          this.nativeAudio.loop('tictac').catch(
            e => {
              console.error(e)
            }
          );
        }
        break;
      case "bonfire":
        this.startBonfireMode()
        break;
    }
   
    this.turnOffTimer = setTimeout(() => {
      this.turnOff()
    }, this.minutesToTurnOff*60*1000)
  }

  protected changeTime(): void
  {
    this.minutesToTurnOff = this.minutesToTurnOff == 8 ? 20 : 8
  }

  protected soundToggle(): void
  {
    this.soundIsEnabled = !this.soundIsEnabled
    if (this.lightIsOn) {
      if (this.soundIsEnabled ) {
        this.nativeAudio.loop('tictac')
      } else {
        this.nativeAudio.stop('tictac');
      }
    }
  }

  protected changeMode(): void
  {
    let currentIndex =  this.lightModes.indexOf(this.lightMode)
    let indexToGo =currentIndex+1 < this.lightModes.length ?currentIndex+1 : 0
    this.lightMode = this.lightModes[indexToGo]
  }

  protected turnOff(): void
  {
    this.lightIsOn =  false 
    this.insomnia.allowSleepAgain()
    this.hideQuickInfo = false
    this.nativeAudio.stop('tictac');
    clearTimeout(this.turnOffTimer)
    clearTimeout(this.timeOutHoldBreath_478)
    clearTimeout(this.bonFireTimeout)
    $('#light').stop()
    $('#light').css({backgroundColor: "black"})
  }

  protected ionViewDidLoad()
  {
    console.log('hla')
    console.log("YEAH", this.translate.instant("APP.MODE_CANDLE"))
    this.nativeAudio.preloadComplex('tictac', "assets/sounds/tictac.ogg", 0.5, 1, 0).then(
      () =>{
        console.log('success loading tic tac')
      }, e =>{
        console.error(e)
      }
    );
    this.brightness.setBrightness(0.8)
  }

}
