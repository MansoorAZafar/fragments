# Post Request
POST http://localhost:8080/v1/fragments
Content-Type: application/msword

[BasicAuth]
user1@email.com:password1
`This is a fragment`

# Expectations / Assertions 
HTTP/1.1 415

[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 415
jsonpath "$.error.message" == "Invalid Buffer: [object Object]"


