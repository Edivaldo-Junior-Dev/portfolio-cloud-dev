export {};

declare global {
  var process: {
    env: {
      API_KEY: string;
      [key: string]: string | undefined;
    }
  };
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';