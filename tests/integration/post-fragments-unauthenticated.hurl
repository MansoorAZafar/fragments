POST http://localhost:8080/v1/fragments
Content-Type: application/json
`This is a fragment`

# Expectations / Assertions 
HTTP/1.1 401

[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" == "Unauthorized"


