## Graduation thesis project (2023)
This project is a part of the graduation project and acts as a product demo.
>The **Deliveryou** project consists of 3 separate repositories: [deliveryou-server](https://github.com/Deliveryou/deliveryou-server) for the server side and [deliveryou-mobile-manager](https://github.com/Deliveryou/deliveryou-mobile-manager)/[deliveyou-mobile-client](https://github.com/Deliveryou/deliveryou-mobile-client) for the client side.
## Deliveryou
The **Deliveryou** project consists of 3 separate repositories: [deliveryou-server](https://github.com/Deliveryou/deliveryou-server) for the server side and [deliveryou-mobile-manager](https://github.com/Deliveryou/deliveryou-mobile-manager)/[deliveyou-mobile-client](https://github.com/Deliveryou/deliveryou-mobile-client) for the client side.
## Features
-   **Server**: handles requests from the client apps and provides resources such as maps, routes, chat messages, etc.

-   **Client app**: allows clients to create delivery packages with detailed information, view the status and location of their packages, chat with the matched driver, rate and review the service, etc.

-   **Driver app**: allows drivers to view available delivery jobs, accept and complete them, chat with the client, view their income and performance, etc.

-   **Manager app**: allows managers to monitor and manage the delivery system, users and drivers, generate reports and statistics, etc.

## Technologies
- **Database**: MySQL.
- **Server side**: Spring boot with Java, Spring Data JPA `(database manipulation)`, LocationIQ `(geolocation processing)`, Sendbird `(real-time chat/voice call functionalities)`, Cloudinary `(media storage)`.
	>The server also supports **websocket** `(for bidirectional communication)` and **GraphQL**  `(fetching only required data with queries)` .
- **Client side** (mobile): React Native with Typescript, Javascript, Java and Google Firebase.

## Requisites
- **MySQL**: the default 3306 port must be used.
- **Spring Boot server**: should be built with Java 17 or newer, modify the `application.properties` file to fit your system configurations, the default server port is 8080 (http).
	>*Https is also supported but might not work as intended as this project is configured to run on virtual machines for demo purpose only.*
>
- **Mobile app**: only Android is supported at the moment, Android SDK level 23 or newer is required.

## Screenshots
![](https://i.imgur.com/9agO5Ek.png)
![](https://i.imgur.com/kOx6hBa.png)
![](https://i.imgur.com/munYmmz.png)
![](https://i.imgur.com/mn6CEkl.png)
![](https://i.imgur.com/fybyJni.png)
![](https://i.imgur.com/GSgiBpO.png)
![](https://i.imgur.com/xVWxafF.png)
![](https://i.imgur.com/3z1AvIK.png)
![](https://i.imgur.com/w7n1Vuq.png)
![](https://i.imgur.com/1ZdhFVk.png)
![](https://i.imgur.com/eASWXSk.png)
![](https://i.imgur.com/ov97wjQ.png)
