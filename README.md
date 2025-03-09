# Blood Bridge

Blood Bridge aims to connect users with local blood banks, facilitating both blood requests and donations. Blood banks maintain real-time inventories of various blood types, enabling them to respond to blood requests based on their current stock.

Additionally, blood banks manage blood donation requests and promptly update users on the status of their requests or donations.

Furthermore, the platform allows blood banks to generate events and notify connected users. If a blood bank lacks a specific blood type, it can request it from nearby users or other blood banks.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Technologies Used](#technologies-used)
- [License](#license)

## Features

### 1. User Registration
   - Register as a user / blood bank on the platform.

### 2. User Authentication
   - Securely log in as a user / blood bank.

### 3. Location-Based Display
   - Display blood banks to a user based on their current location.

### 4. Switch Location
   - Allow a user to switch to a different location if the nearby blood banks in their current location do not meet their needs.

### 5. Donor Request Generation
   - Enable users to generate requests to donate blood to a nearby blood bank of their choice, for health benefits or personal preference.

### 6. Blood Request Generation
   - Allow individuals to request a specific blood type from a nearby blood bank based on the available samples in the blood bank's inventory.

### 7. Blood Request Processing and Notification
   - Allow a blood bank to accept, reject, or complete an individual's request for blood.
     - If accepted, notify the user that their blood samples for a specific blood type have been reserved.
     - If declined, provide a reason for rejection.
     - If completed, allow a user to make an another request.

### 8. Blood Donation Request Processing and Notification
   - Allow a blood bank to accept, reject, or complete an individual's request for blood donation.
     - If accepted, notify the user with further details, including the date and time.
     - If declined, provide a reason for rejection.
     - If completed, allow the user to make another request after a period of three months.

### 9. Inventory Management
   - Enable a blood bank to efficiently manage and maintain their blood inventory.

### 10. Blood Type Shortage and Donor Mobilization
   - Each blood bank will statistically analyze the consumption of specific blood types.
   - If a shortage is detected, notify nearby blood banks and registered users with that blood type to donate blood.

### 11. Event Generation
   - Enable a blood bank to create an event.
   - Notify the registered users about the blood bank's event.

## Getting Started

To set up the Blood Bridge locally, follow these steps:

### Clone the Repository

1. Clone the repository to your local machine using the following command:

   ```bash
   git clone https://github.com/abrehan2/Blood-Bridge.git
   ```

## Technologies Used

The Blood Bridge leverages a modern tech stack to provide a robust and efficient solution:

### Frontend

- [Next.js](https://nextjs.org/) - React framework for building user interfaces.
- [React](https://reactjs.org/) - JavaScript library for building UI components.
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework for styling.

### Backend

- [Node.js](https://nodejs.org/) - JavaScript runtime for server-side development.
- [Express.js](https://expressjs.com/) - Web application framework for Node.js.
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Cloud-based MongoDB database for data storage.
- Web Sockets - For real-time location.

### Testing

- [Postman](https://www.postman.com/) - API development and testing tool.

## License

This project is licensed under the [MIT License](LICENSE).

The MIT License (MIT) is a permissive open-source license that allows for the use, modification, and distribution of this software. Feel free to use the code in this project for your own purposes, subject to the terms of the MIT License.

For more information, see the [LICENSE](LICENSE) file.
