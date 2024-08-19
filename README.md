# Lynbrook App

## Organization

There are three repositories for the app:

- [lynbrook-app] (this one) for the app itself, written with React Native
- [lynbrook-app-backend] for the backend and API, using Django
- [lynbrook-app-api-hooks] to connect the app to the API

## Development

```bash
$ npm install --legacy-peer-deps
$ npm start
```

Press `i` to open the iOS simulator. You will need to have Xcode installed with an iOS simulator downloaded.

## Deployment

The app is submited to the App Store and Google Play Store using Expo App Services. Follow [the Expo documentation](https://docs.expo.dev/submit/) to submit new builds for the app.

**Most new builds don't need new App Store submissions!** We use EAS updates to update the app without submitting a new version to the App Store. There is a [GitHub Actions workflow] configured to push an over-the-air update to the app every time a new commit is pushed to the `production` branch. This is the recommended way to update the app. There is also the `staging` branch, which will push updates to the TestFlight app.

[lynbrook-app]: https://github.com/lynbrookhs/lynbrook-app
[lynbrook-app-backend]: https://github.com/lynbrookhs/lynbrook-app-backend
[lynbrook-app-api-hooks]: https://github.com/lynbrookhs/lynbrook-app-api-hooks
[github actions workflow]: https://github.com/lynbrookhs/lynbrook-app/blob/master/.github/workflows/ci.yml
