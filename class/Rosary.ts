import {
  ROSARY_AUDIOS,
  ROSARY_DAYS,
  ROSARY_LENGTH,
} from "@/constants/mysteries";
import crossImage from "@/public/assets/images/crucifixion.svg";
import {
  INTERFACE_LANGUAGES,
  INTERFACE_ROSARY_MYSTERIES,
  INTERFACE_ROSARY_STATE,
} from "@/interfaces";
import { capitalizeFirstLetter } from "../utils";

class Rosary {
  private rosaryAudioCover = "";
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

  private setBackgroundMusic = (withBGMusic?: boolean) => {
    // if (withBGMusic) this.rosaryBackgroundMusic = aveAudio;
  };

  public setAudioCover = (image: string) => {
    this.rosaryAudioCover = image;
  };

  public getAudio = (
    language: INTERFACE_LANGUAGES = INTERFACE_LANGUAGES.en
  ): string => {
    console.log("new language: ", language);
    return ROSARY_AUDIOS[this.mysteryName as INTERFACE_ROSARY_MYSTERIES][
      language
    ];
  };

  public getRosaryState = (
    language: INTERFACE_LANGUAGES = INTERFACE_LANGUAGES.en
  ): INTERFACE_ROSARY_STATE => {
    const subTitle = `${capitalizeFirstLetter(this.mysteryName)} Mystery`;
    return {
      title: "Rosary",
      mystery: subTitle,
      mysteryAudio: this.getAudio(language),
      audioCover: this.rosaryAudioCover,
    };
  };

  public setRosaryType = (length: keyof typeof ROSARY_LENGTH) => {
    // this.rosaryLength = ROSARY_LENGTH[length];
  };

  public mutePrayer = () => {};

  public changeMystery = (mystery: INTERFACE_ROSARY_MYSTERIES) => {
    this.mysteryName = mystery;
  };
}

export default Rosary;
