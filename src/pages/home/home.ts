import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Insomnia } from '@ionic-native/insomnia';

declare var $: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private lightIsOn : boolean = false
  protected turningOff : boolean = false
  protected showQuickInfo : boolean = false
  private turnOffTimer: any = null
  private minutesToTurnOff: number = 8
  private lightMode: string = 'inOut'

  //pulse effect
  private secondsToInhale: number = 4
  private secondsToIExhale: number = 6

  constructor(
    public navCtrl: NavController,
    public insomnia: Insomnia
  ) {}

  protected startPulseBucle(): void
  {
    $('#light').animate({
      backgroundColor: '#ce7b00'
    }, this.secondsToInhale*1000, () => {
      if (this.lightIsOn) {
        $('#light').animate({
          backgroundColor: '#ce4c00'
        }, 500, () => {
          $('#light').animate({
            backgroundColor: 'black'
          }, this.secondsToIExhale*1000, () => {
            if (this.lightIsOn) {
              this.startPulseBucle()
            } else {
              $('#light').css({
                backgroundColor: 'black',
                opacity: 1
              })
              this.turningOff = false;
            }
          });
        })
      } else{
        $('#light').css({
          backgroundColor: 'black',
          opacity: 1
        })
        this.turningOff = false;
      } 
    });
  }

  protected turnOn(): void
  {
    this.lightIsOn =  true
    this.startPulseBucle()
    this.insomnia.keepAwake()
    this.turnOffTimer = setTimeout(() => {
      this.turnOff()
    }, this.minutesToTurnOff*60*1000)
  }

  protected changeTime(): void
  {
    this.minutesToTurnOff = this.minutesToTurnOff == 8 ? 20 : 8
  }

  protected changeMode(): void
  {
    this.lightMode = this.lightMode == 'inOut' ? '478' : 'inOut'
    this.showQuickInfo = true
    console.log(this.showQuickInfo)
    setTimeout(() => {
      this.showQuickInfo = false
    }, 2000);
  }

  protected turnOff(): void
  {
    this.lightIsOn =  false 
    this.turningOff = true
    this.insomnia.allowSleepAgain()
    clearTimeout(this.turnOffTimer)
    $('#light').css({opacity: 0})
  }

}
