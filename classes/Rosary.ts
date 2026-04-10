import {
  ROSARY_AUDIOS,
  ROSARY_AUDIOS_SHORT,
  ROSARY_DAYS,
  ROSARY_LENGTH,
} from '@/constants/mysteries';
import {
  INTERFACE_ROSARY_MYSTERIES,
  INTERFACE_ROSARY_STATE,
  LANG,
} from '@/interfaces';
import crossImage from '@/public/assets/images/crucifixion.svg';

class Rosary {
  private rosaryAudioCover = '';
  private mysteryName = INTERFACE_ROSARY_MYSTERIES.GLORIOUS;

  constructor() {
    this.mysteryName = this.setTodaysMystery();
    this.setAudioCover(crossImage);
  }

  private setTodaysMystery = (): INTERFACE_ROSARY_MYSTERIES => {
    const dayOfTheWeek = new Date().getDay();
    const arrOfPrayersDays = Object.values(ROSARY_DAYS);
    const mysteryName = arrOfPrayersDays[dayOfTheWeek];
    return mysteryName as INTERFACE_ROSARY_MYSTERIES;
  };

  public setAudioCover = (imageSrc: string) => {
    this.rosaryAudioCover = imageSrc;
  };

  private getRosaryLength = (): string => {
    try {
      return localStorage.getItem('rosaryLength') ?? ROSARY_LENGTH.medium;
    } catch {
      return ROSARY_LENGTH.medium;
    }
  };

  public getAudio = (language: LANG = LANG.en): string => {
    const mystery = this.mysteryName as INTERFACE_ROSARY_MYSTERIES;
    const audios =
      this.getRosaryLength() === ROSARY_LENGTH.short
        ? ROSARY_AUDIOS_SHORT
        : ROSARY_AUDIOS;
    return audios[mystery][language];
  };

  public getRosaryState = (
    language: LANG = LANG.en,
  ): INTERFACE_ROSARY_STATE => {
    return {
      title: 'The Holy Rosary',
      mystery: this.mysteryName,
      mysteryAudio: this.getAudio(language),
      audioCover: this.rosaryAudioCover,
    };
  };

  public setRosaryType = (length: keyof typeof ROSARY_LENGTH) => {
    localStorage.setItem('rosaryLength', ROSARY_LENGTH[length]);
  };

  public mutePrayer = () => {};

  public changeMystery = (mystery: INTERFACE_ROSARY_MYSTERIES) => {
    this.mysteryName = mystery;
  };
}

const myRosary = new Rosary();

export { myRosary, Rosary };
