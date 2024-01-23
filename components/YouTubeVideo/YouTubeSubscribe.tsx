import Script from "next/script";

const YouTubeSubscribe = () => {
  return (
    <>
      <Script src="https://apis.google.com/js/platform.js" />
      <div
        className="g-ytsubscribe"
        data-channelid="UCTrkFtRvvyp9pXm21iPcC6w"
        data-count="hidden"
      />
    </>
  );
};

export default YouTubeSubscribe;
