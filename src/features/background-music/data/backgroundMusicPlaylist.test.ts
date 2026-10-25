import { BACKGROUND_MUSIC_PLAYLIST } from "@/features/background-music/data/backgroundMusicPlaylist";

describe("background music playlist", () => {
  it("bundles the four devotional tracks and matching artwork in playback order", () => {
    expect(BACKGROUND_MUSIC_PLAYLIST.map((track) => track.id)).toEqual([
      "agnus-dei-polyphony",
      "dies-irae",
      "kyrie-chant",
      "sanctus-polyphony",
    ]);

    for (const track of BACKGROUND_MUSIC_PLAYLIST) {
      expect(track.audioSource).toEqual(expect.any(Number));
      expect(track.artwork).toBeTruthy();
      expect(track.title.en).toEqual(expect.any(String));
      expect(track.title.es).toEqual(expect.any(String));
    }
  });
});
