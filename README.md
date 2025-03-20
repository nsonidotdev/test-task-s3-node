### Requirements
You should have following tools installed
- `Node.js`
- `pnpm`

### Setup Web
To start web application for testing navigate to the `./web` and run follwoing commands.

```sh
pnpm install
pnpm dev
```

### Setup server
To launch server navigate to the `./server` directory and complete following steps.

1. Add `.env` file with this contents
```ini
PORT=3000

# AWS S3
AWS_S3_REGION=eu-north-1
AWS_S3_SECRET_ACCESS_KEY=PCvo8T/3MCNmX4kNXxzEmPiz51A5pLlWEmPy9J80
AWS_S3_ACCESS_KEY_ID=AKIA5MSUB3O7JNFI5UNT
AWS_S3_BUCKET_NAME=test-bucket-34452
```

2. Install deps and run the server
```sh
pnpm install
pnpm dev 
```

### API Reference

#### `GET /`
Returns a list of S3 objecs with basic file information and metadata.

##### Query Parameters
- `c` (optional): Specifies the number of elements to return. Defaults to `10` if not provided.

**Example Success Response**
```json
{
  "objects": [
    {
      "key": "77ed396c44617ba8ed3f660906aea.jp",
      "size": 0,
      "lastModified": "Thu Mar 20 2025 10:38:19 GMT+0200",
      "meta": {},
      "url": "https://test-bucket-34452.s3.eu-north-1.amazonaws.com/77ed396c44617ba8ed3f660906aea.jp"
    },
    {
      "key": "77ed396c44617ba8ed3f660906aea.jpg",
      "size": 4774208,
      "lastModified": "Thu Mar 20 2025 14:55:48 GMT+0200",
      "meta": {},
      "url": "https://test-bucket-34452.s3.eu-north-1.amazonaws.com/77ed396c44617ba8ed3f660906aea.jpg"
    },
    {
      "key": "Matt_Smith.jpg",
      "size": 1600321,
      "lastModified": "Thu Mar 20 2025 10:49:44 GMT+0200",
      "meta": {},
      "url": "https://test-bucket-34452.s3.eu-north-1.amazonaws.com/Matt_Smith.jpg"
    },
    {
      "key": "jk/fabien-frankel_66 (1).jpg",
      "size": 58658,
      "lastModified": "Thu Mar 20 2025 09:59:19 GMT+0200",
      "meta": {
        "originalname": "fabien-frankel_66 (1).jpg"
      },
      "url": "https://test-bucket-34452.s3.eu-north-1.amazonaws.com/jk/fabien-frankel_66 (1).jpg"
    }
  ]
}
```

#### `POST /`
Handles file uploads to an S3 bucket. 


##### Request Headers
- `Content-Type` (required): The MIME type of the file being uploaded.
- `X-File-Name` (required): The name of the file being uploaded.

##### Query Parameters
- `dir` (optional): Specifies the directory within the S3 bucket where the file should be stored. If omitted, the file is uploaded to the root.

##### Request Body
The raw binary file data should be sent in the request body.

##### Validation
Only allows pdf, jpg and png file types. 
File size should be less then 10MB.

**Example Success Response**
  ```json
  {
    "url": "https://s3-bucket-url/path-to-file"
  }
  ```

#### `PUT /:key`
Replaces an existing object in the S3 bucket.

##### Path Parameters
- `key` (required): The S3 key of the object to be replaced.

##### Request Headers
- `Content-Type` (required): The MIME type of the new file.

##### Request Body
The raw binary file data should be sent in the request body.

##### Validation
Only allows pdf, jpg and png file types. 
File size should be less then 10MB.

**Example Success Response**
```json
{
    "message": "Replace successful"
}
```

#### `DELETE /:key`
Deletes an existing object from the S3 bucket.

##### Path Parameters
- `key` (required): The S3 key of the object to be deleted.

**Example Success Response**
```json
{
    "message": "Delete successful"
}
```