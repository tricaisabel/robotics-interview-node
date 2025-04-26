# Description 

Your task consists of writing a Node.JS program which implements the functionalities
described below.

For that, you will need to have `MongoDB` and 
[`MongoDB Database Tools`](https://www.mongodb.com/try/download/database-tools) installed.

The most popular package for working with MongoDB in Node.JS is mongoose. 
```bash
npm install mongoose 
``` 
You can use any other libraries you need or think they're useful.

To get started, import the collections from the **dump** folder to your MongoDB database 
using the **mongorestore** tool.

## 1. Implement the documented GraphQL API 

The API which you need to implement is defined within the **``public``** folder. Implement an 
endpoint which supports the specified queries and mutations and saves the data into a MongoDB 
database called ``store``. You can use the [`GraphIQL app`](https://www.electronjs.org/apps/graphiql) 
to test your queries. 

Aditionally, the endpoint schema is provided as **``public/schema.graphql``** and 
**``public/schema.json``** files. 

## 2. Pictures

Explore the **labels** collection to determine the binary field and define a GET path which a browser can
use to access any stored picture within the labels collection.

**Hint**: The binary data is a bytestring of a JPEG encoded image.

## 3. Frontend

Develop a single HTML page to display the sessions and the labels associated with a session. 
Use the ```fetch``` API to query the backend side. 

**Hint**: You need to add another query to return the labels associated with a session.   
