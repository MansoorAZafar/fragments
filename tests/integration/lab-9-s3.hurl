# Post Request
POST http://localhost:8080/v1/fragments
Content-Type: text/plain

[BasicAuth]
user1@email.com:password1
`Hello S3!`

# Expectations / Assertions 
HTTP/1.1 201

[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"

jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/plain"
jsonpath "$.fragment.size" == 9
[Captures]
url: header "Location"


GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/plain
Content-Length: 9
[Asserts]
body == "Hello S3!"


# Delete the fragment
DELETE {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200


# Get the fragment after its been deleted
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 404
