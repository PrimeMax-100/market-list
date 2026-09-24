# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## Native builds (Capacitor)

Web assets for native builds come from `npm run build:mobile` (output: `dist-mobile`).

### Android (APK)
- Automatic: push to `main` on GitHub; the "Build Android APK" workflow runs and you download the `market-list-apk` artifact from the run and install it on your phone.
- Locally (Java 21 + Android SDK): `npm run sync:android`, then `cd android && ./gradlew assembleDebug`.

### iOS (needs a Mac with Xcode)
- `npm run build:mobile`
- `npx cap add ios`
- `npm run sync:ios`
- `npx cap open ios`, then run or archive from Xcode.
