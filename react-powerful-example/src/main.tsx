import App from './app';
import './index.css';
import { AppProps } from './types';

export default function Html({ searchParams }: AppProps) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>SNS掲示板 - React Server Components</title>
      </head>
      <body>
        <div id="root">
          <App searchParams={searchParams} />
        </div>
      </body>
    </html>
  );
}
