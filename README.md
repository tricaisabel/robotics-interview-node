# Description

This app is built to visualize and manage retail computer vision data, focusing on sessions and labels collected from store environments. 

A session refers to a specific data capture event (such as a scan or inspection of store shelves) where multiple images or observations are recorded.  

Within each session, labels represent price labels detected in the images, containing information like the product name, price, and possibly barcode data.  

These labels are stored as binary JPEG images in a MongoDB database and can be accessed via a dedicated image-serving endpoint.  

---

# Tech Stack

The backend exposes a GraphQL API for querying sessions and their associated price labels, while the React application (front-end) lets users browse the data, helping quality assurance teams or data annotators verify the accuracy and completeness of the label capture process.

- **Database:** MongoDB Compass (Cloud)  
- **Back-end:** Node.js, TypeScript, GraphQL  
- **Front-end:** React.js, bootstrap

---

# How to run this app?

1. Install dependencies:  
   Run `npm install` in both `/back-end` and `/front-end` folders.

``` bash 
cd front-end  
npm install
cd ..
cd back-end
npm install
```

2. Create a new `.env` file inside `/back-end`, paste the content received from Isabel.

3. Start the server (port 8080):  
   ```bash
   cd back-end  
   npm run dev
   ```

The following message should appear:
Server ready at http://localhost:8080  
Connected to MongoDB successfully

4. Start React app (port 3000):
``` bash
cd ..  
cd front-end  
npm run start
```

# Screenshots

<img width="1710" alt="Captură de ecran din 2025-04-29 la 19 22 34" src="https://github.com/user-attachments/assets/3433f61a-87e6-46e7-876f-3a9e07d25f86" /> 
<img width="1710" alt="Captură de ecran din 2025-04-29 la 19 24 10" src="https://github.com/user-attachments/assets/35d73830-4a93-45af-8303-923443c1d4eb" />

