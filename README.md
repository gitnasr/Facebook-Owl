<img width="100" src="https://github.com/gitnasr/Facebook-Owl/assets/42423651/f80af6b7-02da-445d-8685-2ebcf41c33d8"/>

# Facebook Owl

Facebook Owl is a comprehensive Chrome Extension with a Node.js backend and a Next.js frontend. Its primary objective is to periodically fetch the Facebook friend list of a user, analyze it, and store it securely on the backend. Users can then access the history of their friends and trace their connections over time.

## Description

Facebook Owl uses modern technologies such as Vite, TypeScript, Node.js, MongoDB with Mongoose, Redis, and Next.js with Tailwind CSS. It seamlessly integrates into the user's Facebook experience, providing valuable insights into their friend network.

## Features

-   Periodically fetches and analyzes the user's Facebook friend list.
-   Stores friend list history securely on the backend.
-   Provides users with access to their friend list history and connections.
-   Integrates seamlessly into the Facebook interface as a Chrome Extension.
-   Utilizes background processing with BullMQ to handle heavy friend lists efficiently.
-   Implements a simple, no-auth service for securely accessing friend history with JWT tokens.

## Stack Used

-   **Extension**: Vite, TypeScript
-   **Backend**: Node.js, MongoDB with Mongoose, Redis
-   **Frontend**: Next.js, Tailwind CSS

## Challenges

1.  **Heavy Friend Lists Processing**: Facebook Owl encounters challenges when dealing with heavy friend lists, especially when tasks such as fetching profile pictures become intensive. To mitigate this, we utilize BullMQ for background processing, ensuring efficient handling of tasks without impacting user experience.
2.  **Simple User Access**: To simplify user access and ensure security, Facebook Owl introduces a no-auth service. Users can securely access their friend history using JWT tokens, providing a straightforward yet robust authentication mechanism.
3. **User Friends Changes Profile Pictures**: Keeping track of profile picture changes among user friends can be crucial for maintaining an up-to-date friend history. To address this, Facebook Owl registers a cron job to periodically check for picture changes, ensuring that the friend list history remains accurate and comprehensive.    

## Usage
Once installed, Facebook Owl seamlessly integrates into the user's browsing experience as a Popup extension. Users can access its features directly from their Facebook interface by clicking on the extension icon, allowing them to analyze and trace their friends' connections effortlessly.

## Installation

1.  Clone the repository.
2.  Navigate to the `backend` directory and install dependencies using `npm install`.
3.  Start the backend server with `npm start`.
4.  Similarly, navigate to the `frontend` directory and install dependencies using `npm install`.
5.  Start the frontend server with `npm run dev`.
6.  Load the Chrome Extension in developer mode.



## Support

For any questions, issues, or support, please get in touch with gitnasr@proton.me.
