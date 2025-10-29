# Amr Booking - Premium Hotel Booking

![Amr Booking](./public/hero/hero-1.jpg)

Welcome to **Amr Booking**, your premium platform for discovering and booking top hotels. This project provides exclusive deals, personalized recommendations, and a seamless booking experience for users.

---

## ✨ Features

- 🌍 Explore a wide range of hotels
- 🎯 Get personalized hotel recommendations
- 🖼️ Modern and fully responsive UI
- ⚡ Fast performance and smooth user experience
- 📱 Compatible with all mobile and tablet devices

---

## 🧠 Informations

The project uses the following INFO configuration:

```ts
# Backend Domain
NEXT_PUBLIC_BASEURL=https://the-maysan.api.bookingengine.pixelksa.com
# https://the-wosol.api.bookingengine.pixelksa.com

# App Status  (production, development, testing)
NEXT_PUBLIC_APP_STATUS=development
```

```ts
// (handleAPIDomain.ts), if client side domain (https://github.com/omarnazih/booking-engine-fe) then server side domain (https://github.api.bookingengine.pixelksa.com) will be used
let BASEURL: string[] = `${process.env.NEXT_PUBLIC_BASEURL}`.split("customer1");
let finalBaseUrl: string;

switch (`${process.env.NEXT_PUBLIC_APP_STATUS}`) {
  case "production":
    if (typeof window !== "undefined") {
      const MYDOMAIN = window.location.hostname.split(".")[0];
      BASEURL = `${BASEURL[0] + MYDOMAIN + BASEURL[1]}`.split(".");
    }
    finalBaseUrl = BASEURL.join(".");
    break;
  case "development":
    finalBaseUrl = `${process.env.NEXT_PUBLIC_BASEURL}`;
    break;
  default:
    finalBaseUrl = BASEURL.join(".");
    break;
}

export default finalBaseUrl;

/**
 * const myUrl = BASEURL.split('customer1')[0]+window.location.hostname.split(".")[0]+BASEURL.split('customer1')[1]
 *
 * output: (github example)
 * 'https://github.api.bookingengine.pixelksa.com'
 */
```

- <del>refresh token</del>
- <del>countries</del>
- <del>about page</del>
- <del>contact page</del>
- <del>refunds</del>
- <del>reset-password</del>
- <del>review Module</del>
- <del>search</del>
- <del>policy</del>
- <del>add sections rooms in home</del>
- <del>filter mobile</del>
- <del>reservation singel page</del>
- <del>reservation oprations</del>
- <del>payment methodes</del>
