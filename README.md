# My G-Weather-Forecast (Front-End)

Welcome to G-Weather-Forecast. This is an application built using Create React App. Please follow the following introduction to get the project up and running!

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Settings](#settings)
- [Run the Project](#run-the-project)
- [Deployment](#deployment)

### Requirements
Make sure your device has the following installed or install them before we continue:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://classic.yarnpkg.com/)
- [git](https://git-scm.com/)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/truonghs/GO-WebDevIntern-test.git
    ```

2. Navigate into the project directory:

    ```bash
    cd GO-WebDevIntern-test
    ```

3. Install the project dependencies:

    Using npm:

    ```bash
    npm install
    ```

    Or using Yarn:

    ```bash
    yarn install
    ```

## Settings
Add environment variables.\
At the root of the project, create a .env file and add the following environment variables
```
REACT_APP_SERVER_URL = your_server_url
```
- Replace your_server_url with your actual server URL.
- You can use my api server: https://go-webdevintern-test-be.onrender.com
- This server is deployed on Render's free service so it will be stopped after a period of inactivity. It will take some time on the first request to redo the server deployment process. However, there will be no problem from the next request. So please be patient!
## Run the Project

To start the development server and run the project locally, use the following command:

Using npm:

```bash
npm start
```
Using yarn:

```bash
yarn start
```
## Deployment

The website is deployed with Vercel: [G-Weather-Forecast](https://go-web-dev-intern-test.vercel.app/) 
- As mentioned above, due to the limitations of the free service in the server-side deployment platform, it will take some time for the **first request**. Please be patient!
