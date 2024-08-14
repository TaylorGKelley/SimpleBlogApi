# Goal

The goal of this API is to serve as a interface to manage your blog's database. It has a few endpoints to do so.

## Basic endpoints (no auth required)

### Get All Posts

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

### Get a Single Post

This endpoint can be accessed at the route `/api/v1/posts/::POSTID` and returns the post with a matching Post Id.

### Sign In

This endpoint can be accessed at the route `/api/v1/admin/signin` and should have a request body of the following.

```json
{
  "email": "john.doe@example.com",
  "password": "Pa$$w0rd!"
}
```

-> [!info]
-> This is just a sample user

### Sign Out

This endpoint can be accessed at the route `/api/v1/admin/signout`.

## Authenticated Endpoints (auth required)

### Create a Post

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

### Update a Post

This endpoint can be accessed at the route `/api/v1/posts` and should have a request body with at least one field to update.
(_example:_)

```json
{
  "title": "Example Post 4"
}
```

### Delete a Post

This endpoint can be accessed at the route `/api/v1/posts/::POSTID` and deletes the post with a matching Post Id, returning `null` in the data field.

### Create Author

As a temporary route, you can create an author if you are signed in to an author account. This may be changed in the future
Route `/api/v1/admin/createAuthor`
