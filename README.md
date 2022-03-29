# Guesty bulk proxy

### 1.Setup
```bash
npm install
```
### 2.1. Run in dev mode (nodemon)
```bash
npm run dev
```
### 2.2. Run in prod mode
```bash
npm run start
```
### 3. Server listen on port 8080 (http://localhost:8080)
```bash
npm run start
```

# Use POSTMAN collection
### **guesty-bulk.postman_collection.json** attached in repo

# API schema
* URL: localhost:8080/bulk
* METHOD: POST
* Headers
  * 'Content-Type': 'application/json'
* Body
```json
{
    "endpoint": {
        "url": "https://guesty-user-service.herokuapp.com/user/{userId}",
        "method": "PUT"
    },
    "payload": [
        {
            "pathParams": {
                "userId": "14"
            },
            "body": {
                    "age": 30
                }
        },
        {
            "pathParams": {
                "userId": "29"
            },
            "body": {
                    "age": 30
                }
        },
        {
            "pathParams": {
                "userId": "103"
            },
            "body": {
                    "age": 30
                }
        }      
    ]
}
```
