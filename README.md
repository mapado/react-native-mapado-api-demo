# react-native-mapado-api-demo

An example application to access Mapado Ticketing API data

## Purpose

This demo application is developped with [expo](https://docs.expo.dev/). It is designed to be a simple and understandable demo case that should help you starting developping with Mapado API.

All API-related code can be found in the `src/` folder.

- [oauth2.ts](src/oauth2.ts) file handle the oauth2 connection of the user,
- [App.tsx](src/App.tsx) handle if the user is connected or not,
- [UserWelcome.tsx](src/UserWelcome.tsx) file fetch the connected user and display a welcome message,
- [TicketingList.tsx](src/TicketingList.tsx) file fetch some ticketing and event dates and list them

## Can I run this demo application ?

Yes, you can ! (but that's not required, you can browse the source code as well !)

You will need to have [node and npm](https://nodejs.org/en/) installed on your computer, and the [expo go](https://expo.dev/expo-go) application on your smartphone.

### Configuration

You will need to [create an application](https://help.mapado.com/portal/fr/kb/articles/obtenir-des-cl%C3%A9s-d-api-mapado-billetterie) on Mapado application page (if you are here, you may already have created one) to get a CLIENT_ID and CLIENT_SECRET.

You will need to know your CONTRACT_ID and optionally the MINISITE_ID where you want to authenticate you users (if you want to do that, that's not needed to access the API).

Copy the `.env.template` to `.env` and fill all missing variables.

### Installation

```sh
# clone the repository
git clone git@github.com:mapado/react-native-mapado-api-demo

## move into the repository folder
cd react-native-mapado-api-demo

## Install dependencies
npm install
```

### Running

Then run the expo server

```sh
npx expo start
```

#### Android / iOS

You can then open the expo go application on your smartphone and scan the displayed QRCode.

#### Web

You can press the `w` key, that should open your browser on the localhost url.

It should open the application with a login button !
