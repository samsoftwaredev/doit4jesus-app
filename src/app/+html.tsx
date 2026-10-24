import { ScrollViewStyleReset, useServerDocumentContext } from "expo-router/html";
import type { PropsWithChildren } from "react";

const WEB_DOCUMENT_STYLES = `
  :root {
    color-scheme: dark;
    --safe-area-inset-top: env(safe-area-inset-top, 0px);
    --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
  }

  html, body, #root {
    background-color: #071A26;
    min-height: 100%;
  }

  html, body {
    margin: 0;
    overscroll-behavior-y: none;
  }

  body, #root {
    min-height: 100dvh;
  }
`;

/** Defines the SDK 57 web document, Safari metadata, and overscroll-safe canvas color. */
export default function RootHtml({ children }: PropsWithChildren) {
  const { bodyAttributes, bodyNodes, headNodes, htmlAttributes } = useServerDocumentContext();

  return (
    <html lang="en" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" name="viewport" />
        <meta content="#071A26" name="theme-color" />
        <meta content="dark" name="color-scheme" />
        <meta content="yes" name="apple-mobile-web-app-capable" />
        <meta content="black-translucent" name="apple-mobile-web-app-status-bar-style" />
        <meta content="DoItForJesus" name="apple-mobile-web-app-title" />
        <link href="/manifest.json" rel="manifest" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: WEB_DOCUMENT_STYLES }} />
        {headNodes}
      </head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
}
