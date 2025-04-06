# Post Request
POST http://localhost:8080/v1/fragments
Content-Type: application/json

[BasicAuth]
user1@email.com:password1
`{"service": "DynamoDB"}`

# Expectations / Assertions 
HTTP/1.1 201

[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"

jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "application/json"
jsonpath "$.fragment.size" == 23
[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragment.id"



GET {{fragment1_url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: application/json
Content-Length: 23
[Asserts]
jsonpath "$.service" == "DynamoDB"



# Post Request
POST http://localhost:8080/v1/fragments
Content-Type: text/markdown

[BasicAuth]
user1@email.com:password1
`DynamoDB is **great**.`

# Expectations / Assertions 
HTTP/1.1 201


[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"

jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/markdown"
jsonpath "$.fragment.size" == 22
[Captures]
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragment.id"



GET {{fragment2_url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/markdown
Content-Length: 22
[Asserts]
body == "DynamoDB is **great**."



GET http://localhost:8080/v1/fragments
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: application/json; charset=utf-8


[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragments" contains {{fragment1_id}}
jsonpath "$.fragments" contains {{fragment2_id}}



# Delete the fragment
DELETE {{fragment1_url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

# Get the fragment after its been deleted
GET {{fragment1_url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 404



GET http://localhost:8080/v1/fragments
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: application/json; charset=utf-8


[Asserts]
jsonpath "$.status" == "ok"

# Check both IDs are included in the fragments array
jsonpath "$.fragments" contains {{fragment2_id}}
