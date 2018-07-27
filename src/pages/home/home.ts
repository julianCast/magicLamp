import { Component, ValueProvider } from '@angular/core'
import { NavController } from 'ionic-angular'
import { Insomnia } from '@ionic-native/insomnia'
import { Brightness } from '@ionic-native/brightness'
import { ScreenOrientation } from '@ionic-native/screen-orientation'

declare var $: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private lightIsOn : boolean = false
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

  private soundIsEnabled : boolean = false
  constructor(
    public navCtrl: NavController,
    public insomnia: Insomnia,
    private brightness: Brightness,
    private screenOrientation: ScreenOrientation
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
    $('#light').css({backgroundColor: this.colorToInhale_478})
    
    $('#light').css({opacity: this._getRandomOpacityValue()})
   setTimeout(() => {
     this.startBonfireMode()
   }, 70);

  }

  protected invertScreen(): void
  {
    let orientationModeToChange = "portrait-primary"
    
    if (this.screenOrientation.type == "portrait-primary") {
      orientationModeToChange = "portrait-secondary"
    }
    this.screenOrientation.lock(orientationModeToChange);
  }

  protected _getRandomOpacityValue(): number 
  {
    return Math.round(Math.random() * (1) * 100) / 100
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
        break;
      case "478":
        this.start478Mode()
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

    clearTimeout(this.turnOffTimer)
    clearTimeout(this.timeOutHoldBreath_478)
    $('#light').stop()
    $('#light').css({backgroundColor: "black"})
  }

  protected ionViewDidLoad()
  {
    this.brightness.setBrightness(0.8)
  }

}
