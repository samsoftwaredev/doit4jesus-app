class YouTubeClass {
  private id: string;

  constructor(id: string) {
    this.id = id;
  }

  private idElFormat() {
    return `youtube-player-${this.id}`;
  }

  public add(callback: Function) {
    if (!window.YT) {
      // If not, load the script asynchronously
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";

      // onYouTubeIframeAPIReady will load the video after the script is loaded
      window.onYouTubeIframeAPIReady = callback;

      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode!.insertBefore(tag, firstScriptTag);
    } else {
      // If script is already there, load the video directly
      callback();
    }
  }

  public remove() {
    // remove iframe and creates div element
    const iframeEl = document.getElementById(this.idElFormat());
    if (iframeEl) {
      iframeEl.remove();
      const divEl = document.createElement("div");
      divEl.setAttribute("id", this.idElFormat());
      const container = document.getElementById("youtube-container");
      if (container) container.appendChild(divEl);
    }
  }

  public init(callback: Function) {
    return new window.YT.Player(this.idElFormat(), {
      videoId: this.id,
      width: 0,
      height: 0,
      playerVars: {
        playsinline: 1,
      },
      events: {
        onStateChange: callback,
      },
    });
  }
}

export default YouTubeClass;
