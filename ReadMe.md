# Goal

The goal of this API is to serve as a interface to manage your blog's database. It has a few endpoints to do so.

## Initialize the project

To properly configure this project to run on your machine, follow the following steps.

- clone this repo
- run `npm i` to install all node packages
- create a `config.env` file that looks like so:

```bash
PORT = 4000;
JWT_SECRET = 'random key for jwt secret'; # be sure it is long and hard to guess
JWT_EXPIRES_IN = '90d'; # expiration date
JWT_COOKIE_EXPIRES_IN = 90; # cookie expiration date matching JWT expiration date
NODE_ENV = 'development'; # current envirionment

DATABASE_URI = 'mongodb://localhost:27017/simpleBlogApi'; # Database URI for mongodb, this placeholder is for if mongodb is hosted locally
DATABASE_PASSWORD = ''; # Database Password which replaces the '<password>' placeholder in the URI
```

- use the command `npm start` to begin running your api! The default URL will be http://localhost:(PORT number in ENV file, or 4000 by default)
- To use the `/createAuthor` function for creating a new author, you will have to remove the `(protectRoute, )` function on _line 14_ to create an initial user.

## Basic endpoints (no auth required)

### Get All Posts (get)

This endpoint can be accessed at the route `/api/v1/posts` and returns all the post data.
It has the following parameters that can be passed in to filter/sort

For Pagination:

- page (_number_, example: 2)
- limit (_number_, example: 10) // the limit of items per page

Sorting:

- sort (_string_, example: +createdDate or -title) // +/- before the field Id determin the desc/asc order for sorting

Specific Fields:

- fields (_string/comma delemited_, example: title,body) // used to instruct the api to only return certain fields in a response.

Filtering fields:

- _field-name(optionally use: [gte]/[lte]/[lt]/[gt] for number values, greater than/less than or equal too)_ (string/number, example: _/?likes[gte]=3&commentsTotal[lt]=10_)
  (_As a note, the fields likes/comments do not exist in the current api version_)

### Get a Single Post (get)

This endpoint can be accessed at the route `/api/v1/posts/::POSTID` and returns the post with a matching Post Id.

### Sign In (post)

This endpoint can be accessed at the route `/api/v1/admin/signin` and should have a request body of the following.

```json
{
  "email": "john.doe@example.com",
  "password": "Pa$$w0rd!"
}
```

> This is just a sample user

### Sign Out (post)

This endpoint can be accessed at the route `/api/v1/admin/signout`.

## Authenticated Endpoints (auth required)

### Check if User/Author is Logged In (get)

This endpoint can be accessed at the route `/api/v1/isLoggedIn`.
It returns an object of:

```json
"data": {
  "isAuthenticated": true,
  "user": {
    "fullName": "first last",
    "email": "john.doe@example.com",
    "photo": "photoBase64String"
  }
}
```

### Create a Post (post)

This endpoint can be accessed at the route `/api/v1/posts` and should have a request body of the following.

```json
{
  "title": "Example Post 4",
  "tags": ["example", "test"],
  "body": [
    {
      "attribute": "('h1', 'h2', 'h3', 'p', 'code', 'img')",
      "data": "sample data"
    }
  ]
}
```

### Update a Post (patch)

This endpoint can be accessed at the route `/api/v1/posts` and should have a request body with at least one field to update.
(_example:_)

```json
{
  "title": "Example Post 4"
}
```

### Delete a Post (delete)

This endpoint can be accessed at the route `/api/v1/posts/::POSTID` and deletes the post with a matching Post Id, returning `null` in the data field.

### Create Author (post)

As a temporary route, you can create an author if you are signed in to an author account. This may be changed in the future
Route `/api/v1/admin/createAuthor`
