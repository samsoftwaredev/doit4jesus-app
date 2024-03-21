class YouTubeClass {
  private id?: string;

  constructor(id: string, elementId: string) {
    this.id = id;
    const divEl = document.createElement("div");
    divEl.setAttribute("id", this.idElFormat(this.id));
    const container = document.getElementById(elementId);
    if (container) container.appendChild(divEl);
  }

  public idElFormat(id?: string) {
    return `youtube-player-${id}`;
  }

  public add(callback: Function) {
    if (!window.YT) {
      // If YT instance was not already defined, load the script asynchronously
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
    const iframeEl = document.getElementById(this.idElFormat(this.id));
    if (iframeEl) {
      iframeEl.remove();
    }
  }

  public init(callback: Function) {
    return new window.YT.Player(this.idElFormat(this.id), {
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
