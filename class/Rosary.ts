import { ROSARY_DAYS, ROSARY_LENGTH } from "@/constants/mysteries";
// import { aveAudio } from "@/public/assets/audio/index";
import crossImage from "@/public/assets/images/crucifixion.svg";

class Rosary {
  private isPlaying = false;
  private rosaryLength = ROSARY_LENGTH.medium;
  private rosaryBackgroundMusic = "";
  private rosaryAudioCover = "";
  private currentPrayerIndex = 0;
  private rosaryPrayer = null;

  constructor(withBGMusic?: boolean) {
    const mysteryName = this.setTodaysMystery();
    this.setBackgroundMusic(withBGMusic);
    this.setAudioCover(crossImage);
    this.fetchRosaryAudio(mysteryName);
  }

  private fetchRosaryAudio = (mysteryName: string) => {
    // this.rosaryPrayer =
  };

  private setTodaysMystery = () => {
    const dayOfTheWeek = new Date().getDay();
    const arrOfPrayersDays = Object.values(ROSARY_DAYS);
    const mysteryName = arrOfPrayersDays[dayOfTheWeek];
    return mysteryName;
  };

  private setBackgroundMusic = (withBGMusic?: boolean) => {
    // if (withBGMusic) this.rosaryBackgroundMusic = aveAudio;
  };

  public setAudioCover = (image: string) => {
    this.rosaryAudioCover = image;
  };

  public pausePrayer = () => {
    this.isPlaying = false;
  };

  public playPrayer = () => {
    this.isPlaying = true;
  };

  public togglePrayer = () => {
    this.isPlaying = !this.isPlaying;
  };

  public getRosaryState = () => ({
    isPlaying: this.isPlaying,
    length: this.rosaryLength,
    backgroundMusic: this.rosaryBackgroundMusic,
    audioCover: this.rosaryAudioCover,
    index: this.currentPrayerIndex,
    audio: this.rosaryPrayer,
  });

  public setRosaryType = (length: keyof typeof ROSARY_LENGTH) => {
    this.rosaryLength = ROSARY_LENGTH[length];
  };

  public mutePrayer = () => {};
  public changeMystery = () => {};

  public nextPrayer = () => {
    // if (this.currentPrayerIndex > ROSARY_LENGTH)
    this.currentPrayerIndex = this.currentPrayerIndex + 1;
  };

  public prevPrayer = () => {
    // if (this.currentPrayerIndex < 0)
    this.currentPrayerIndex = this.currentPrayerIndex - 1;
  };

  public resetRosary = () => {
    this.isPlaying = false;
    this.rosaryLength = ROSARY_LENGTH.medium;
    this.rosaryBackgroundMusic = "";
    this.rosaryAudioCover = "";
    this.currentPrayerIndex = 0;
  };
}

export default Rosary;
