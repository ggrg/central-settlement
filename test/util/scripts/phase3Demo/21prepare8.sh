#!/usr/bin/env bash
CWD="${0%/*}"

if [[ "$CWD" =~ ^(.*)\.sh$ ]];
then
    CWD="."
fi

echo "Loading env vars..."
source $CWD/env.sh

echo "---------------------------------------------------------------------"
echo "Prepare 5 transfers (dfsp2 -> dfsp3: 100 USD)"
echo "---------------------------------------------------------------------"

sh -c "curl -X POST \
  http://localhost:3000/transfers \
  -H 'Accept: application/vnd.interoperability.transfers+json;version=1' \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/vnd.interoperability.transfers+json;version=1.0' \
  -H 'Date: $HEADER_DATE' \
  -H 'FSPIOP-Destination: dfsp3' \
  -H 'FSPIOP-Source: dfsp2' \
  -H 'Postman-Token: 52f127ff-7ed6-41c8-951e-c82276539b1d' \
  -d '{
    \"transferId\": \"125ec534-ee48-4575-b6a9-ead2955b8103\",
    \"payerFsp\": \"dfsp2\",
    \"payeeFsp\": \"dfsp3\",
    \"amount\": {
      \"currency\": \"USD\",
      \"amount\": \"100\"
    },
    \"ilpPacket\": \"AYIBgQAAAAAAAASwNGxldmVsb25lLmRmc3AxLm1lci45T2RTOF81MDdqUUZERmZlakgyOVc4bXFmNEpLMHlGTFGCAUBQU0svMS4wCk5vbmNlOiB1SXlweUYzY3pYSXBFdzVVc05TYWh3CkVuY3J5cHRpb246IG5vbmUKUGF5bWVudC1JZDogMTMyMzZhM2ItOGZhOC00MTYzLTg0NDctNGMzZWQzZGE5OGE3CgpDb250ZW50LUxlbmd0aDogMTM1CkNvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbgpTZW5kZXItSWRlbnRpZmllcjogOTI4MDYzOTEKCiJ7XCJmZWVcIjowLFwidHJhbnNmZXJDb2RlXCI6XCJpbnZvaWNlXCIsXCJkZWJpdE5hbWVcIjpcImFsaWNlIGNvb3BlclwiLFwiY3JlZGl0TmFtZVwiOlwibWVyIGNoYW50XCIsXCJkZWJpdElkZW50aWZpZXJcIjpcIjkyODA2MzkxXCJ9IgA\",
    \"condition\": \"bSqIkHNqib-I69QFoVR--ja3L4Raye2WERq2Gzitb-U\",
    \"expiration\": \"$EXPIRATION_DATE\",
    \"extensionList\": {
      \"extension\": [{
        \"key\": \"key1\",
        \"value\": \"value1\"
      }]
    }
  }'"
sh -c "curl -X POST \
  http://localhost:3000/transfers \
  -H 'Accept: application/vnd.interoperability.transfers+json;version=1' \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/vnd.interoperability.transfers+json;version=1.0' \
  -H 'Date: $HEADER_DATE' \
  -H 'FSPIOP-Destination: dfsp3' \
  -H 'FSPIOP-Source: dfsp2' \
  -H 'Postman-Token: 52f127ff-7ed6-41c8-951e-c82276539b1d' \
  -d '{
    \"transferId\": \"125ec534-ee48-4575-b6a9-ead2955b8104\",
    \"payerFsp\": \"dfsp2\",
    \"payeeFsp\": \"dfsp3\",
    \"amount\": {
      \"currency\": \"USD\",
      \"amount\": \"100\"
    },
    \"ilpPacket\": \"AYIBgQAAAAAAAASwNGxldmVsb25lLmRmc3AxLm1lci45T2RTOF81MDdqUUZERmZlakgyOVc4bXFmNEpLMHlGTFGCAUBQU0svMS4wCk5vbmNlOiB1SXlweUYzY3pYSXBFdzVVc05TYWh3CkVuY3J5cHRpb246IG5vbmUKUGF5bWVudC1JZDogMTMyMzZhM2ItOGZhOC00MTYzLTg0NDctNGMzZWQzZGE5OGE3CgpDb250ZW50LUxlbmd0aDogMTM1CkNvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbgpTZW5kZXItSWRlbnRpZmllcjogOTI4MDYzOTEKCiJ7XCJmZWVcIjowLFwidHJhbnNmZXJDb2RlXCI6XCJpbnZvaWNlXCIsXCJkZWJpdE5hbWVcIjpcImFsaWNlIGNvb3BlclwiLFwiY3JlZGl0TmFtZVwiOlwibWVyIGNoYW50XCIsXCJkZWJpdElkZW50aWZpZXJcIjpcIjkyODA2MzkxXCJ9IgA\",
    \"condition\": \"bSqIkHNqib-I69QFoVR--ja3L4Raye2WERq2Gzitb-U\",
    \"expiration\": \"$EXPIRATION_DATE\",
    \"extensionList\": {
      \"extension\": [{
        \"key\": \"key1\",
        \"value\": \"value1\"
      }]
    }
  }'"
sh -c "curl -X POST \
  http://localhost:3000/transfers \
  -H 'Accept: application/vnd.interoperability.transfers+json;version=1' \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/vnd.interoperability.transfers+json;version=1.0' \
  -H 'Date: $HEADER_DATE' \
  -H 'FSPIOP-Destination: dfsp3' \
  -H 'FSPIOP-Source: dfsp2' \
  -H 'Postman-Token: 52f127ff-7ed6-41c8-951e-c82276539b1d' \
  -d '{
    \"transferId\": \"125ec534-ee48-4575-b6a9-ead2955b8105\",
    \"payerFsp\": \"dfsp2\",
    \"payeeFsp\": \"dfsp3\",
    \"amount\": {
      \"currency\": \"USD\",
      \"amount\": \"100\"
    },
    \"ilpPacket\": \"AYIBgQAAAAAAAASwNGxldmVsb25lLmRmc3AxLm1lci45T2RTOF81MDdqUUZERmZlakgyOVc4bXFmNEpLMHlGTFGCAUBQU0svMS4wCk5vbmNlOiB1SXlweUYzY3pYSXBFdzVVc05TYWh3CkVuY3J5cHRpb246IG5vbmUKUGF5bWVudC1JZDogMTMyMzZhM2ItOGZhOC00MTYzLTg0NDctNGMzZWQzZGE5OGE3CgpDb250ZW50LUxlbmd0aDogMTM1CkNvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbgpTZW5kZXItSWRlbnRpZmllcjogOTI4MDYzOTEKCiJ7XCJmZWVcIjowLFwidHJhbnNmZXJDb2RlXCI6XCJpbnZvaWNlXCIsXCJkZWJpdE5hbWVcIjpcImFsaWNlIGNvb3BlclwiLFwiY3JlZGl0TmFtZVwiOlwibWVyIGNoYW50XCIsXCJkZWJpdElkZW50aWZpZXJcIjpcIjkyODA2MzkxXCJ9IgA\",
    \"condition\": \"bSqIkHNqib-I69QFoVR--ja3L4Raye2WERq2Gzitb-U\",
    \"expiration\": \"$EXPIRATION_DATE\",
    \"extensionList\": {
      \"extension\": [{
        \"key\": \"key1\",
        \"value\": \"value1\"
      }]
    }
  }'"
sh -c "curl -X POST \
  http://localhost:3000/transfers \
  -H 'Accept: application/vnd.interoperability.transfers+json;version=1' \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/vnd.interoperability.transfers+json;version=1.0' \
  -H 'Date: $HEADER_DATE' \
  -H 'FSPIOP-Destination: dfsp3' \
  -H 'FSPIOP-Source: dfsp2' \
  -H 'Postman-Token: 52f127ff-7ed6-41c8-951e-c82276539b1d' \
  -d '{
    \"transferId\": \"125ec534-ee48-4575-b6a9-ead2955b8106\",
    \"payerFsp\": \"dfsp2\",
    \"payeeFsp\": \"dfsp3\",
    \"amount\": {
      \"currency\": \"USD\",
      \"amount\": \"100\"
    },
    \"ilpPacket\": \"AYIBgQAAAAAAAASwNGxldmVsb25lLmRmc3AxLm1lci45T2RTOF81MDdqUUZERmZlakgyOVc4bXFmNEpLMHlGTFGCAUBQU0svMS4wCk5vbmNlOiB1SXlweUYzY3pYSXBFdzVVc05TYWh3CkVuY3J5cHRpb246IG5vbmUKUGF5bWVudC1JZDogMTMyMzZhM2ItOGZhOC00MTYzLTg0NDctNGMzZWQzZGE5OGE3CgpDb250ZW50LUxlbmd0aDogMTM1CkNvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbgpTZW5kZXItSWRlbnRpZmllcjogOTI4MDYzOTEKCiJ7XCJmZWVcIjowLFwidHJhbnNmZXJDb2RlXCI6XCJpbnZvaWNlXCIsXCJkZWJpdE5hbWVcIjpcImFsaWNlIGNvb3BlclwiLFwiY3JlZGl0TmFtZVwiOlwibWVyIGNoYW50XCIsXCJkZWJpdElkZW50aWZpZXJcIjpcIjkyODA2MzkxXCJ9IgA\",
    \"condition\": \"bSqIkHNqib-I69QFoVR--ja3L4Raye2WERq2Gzitb-U\",
    \"expiration\": \"$EXPIRATION_DATE\",
    \"extensionList\": {
      \"extension\": [{
        \"key\": \"key1\",
        \"value\": \"value1\"
      }]
    }
  }'"
sh -c "curl -X POST \
  http://localhost:3000/transfers \
  -H 'Accept: application/vnd.interoperability.transfers+json;version=1' \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/vnd.interoperability.transfers+json;version=1.0' \
  -H 'Date: $HEADER_DATE' \
  -H 'FSPIOP-Destination: dfsp3' \
  -H 'FSPIOP-Source: dfsp2' \
  -H 'Postman-Token: 52f127ff-7ed6-41c8-951e-c82276539b1d' \
  -d '{
    \"transferId\": \"125ec534-ee48-4575-b6a9-ead2955b8107\",
    \"payerFsp\": \"dfsp2\",
    \"payeeFsp\": \"dfsp3\",
    \"amount\": {
      \"currency\": \"USD\",
      \"amount\": \"100\"
    },
    \"ilpPacket\": \"AYIBgQAAAAAAAASwNGxldmVsb25lLmRmc3AxLm1lci45T2RTOF81MDdqUUZERmZlakgyOVc4bXFmNEpLMHlGTFGCAUBQU0svMS4wCk5vbmNlOiB1SXlweUYzY3pYSXBFdzVVc05TYWh3CkVuY3J5cHRpb246IG5vbmUKUGF5bWVudC1JZDogMTMyMzZhM2ItOGZhOC00MTYzLTg0NDctNGMzZWQzZGE5OGE3CgpDb250ZW50LUxlbmd0aDogMTM1CkNvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbgpTZW5kZXItSWRlbnRpZmllcjogOTI4MDYzOTEKCiJ7XCJmZWVcIjowLFwidHJhbnNmZXJDb2RlXCI6XCJpbnZvaWNlXCIsXCJkZWJpdE5hbWVcIjpcImFsaWNlIGNvb3BlclwiLFwiY3JlZGl0TmFtZVwiOlwibWVyIGNoYW50XCIsXCJkZWJpdElkZW50aWZpZXJcIjpcIjkyODA2MzkxXCJ9IgA\",
    \"condition\": \"bSqIkHNqib-I69QFoVR--ja3L4Raye2WERq2Gzitb-U\",
    \"expiration\": \"$EXPIRATION_DATE\",
    \"extensionList\": {
      \"extension\": [{
        \"key\": \"key1\",
        \"value\": \"value1\"
      }]
    }
  }'"

echo
echo "---------------------------------------------------------------------"
echo "Prepare 3 transfers (dfsp3 -> dfsp1: 100 USD)"
echo "---------------------------------------------------------------------"

sh -c "curl -X POST \
  http://localhost:3000/transfers \
  -H 'Accept: application/vnd.interoperability.transfers+json;version=1' \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/vnd.interoperability.transfers+json;version=1.0' \
  -H 'Date: $HEADER_DATE' \
  -H 'FSPIOP-Destination: dfsp1' \
  -H 'FSPIOP-Source: dfsp3' \
  -H 'Postman-Token: 52f127ff-7ed6-41c8-951e-c82276539b1d' \
  -d '{
    \"transferId\": \"125ec534-ee48-4575-b6a9-ead2955b8108\",
    \"payerFsp\": \"dfsp3\",
    \"payeeFsp\": \"dfsp1\",
    \"amount\": {
      \"currency\": \"USD\",
      \"amount\": \"100\"
    },
    \"ilpPacket\": \"AYIBgQAAAAAAAASwNGxldmVsb25lLmRmc3AxLm1lci45T2RTOF81MDdqUUZERmZlakgyOVc4bXFmNEpLMHlGTFGCAUBQU0svMS4wCk5vbmNlOiB1SXlweUYzY3pYSXBFdzVVc05TYWh3CkVuY3J5cHRpb246IG5vbmUKUGF5bWVudC1JZDogMTMyMzZhM2ItOGZhOC00MTYzLTg0NDctNGMzZWQzZGE5OGE3CgpDb250ZW50LUxlbmd0aDogMTM1CkNvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbgpTZW5kZXItSWRlbnRpZmllcjogOTI4MDYzOTEKCiJ7XCJmZWVcIjowLFwidHJhbnNmZXJDb2RlXCI6XCJpbnZvaWNlXCIsXCJkZWJpdE5hbWVcIjpcImFsaWNlIGNvb3BlclwiLFwiY3JlZGl0TmFtZVwiOlwibWVyIGNoYW50XCIsXCJkZWJpdElkZW50aWZpZXJcIjpcIjkyODA2MzkxXCJ9IgA\",
    \"condition\": \"bSqIkHNqib-I69QFoVR--ja3L4Raye2WERq2Gzitb-U\",
    \"expiration\": \"$EXPIRATION_DATE\",
    \"extensionList\": {
      \"extension\": [{
        \"key\": \"key1\",
        \"value\": \"value1\"
      }]
    }
  }'"
sh -c "curl -X POST \
  http://localhost:3000/transfers \
  -H 'Accept: application/vnd.interoperability.transfers+json;version=1' \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/vnd.interoperability.transfers+json;version=1.0' \
  -H 'Date: $HEADER_DATE' \
  -H 'FSPIOP-Destination: dfsp1' \
  -H 'FSPIOP-Source: dfsp3' \
  -H 'Postman-Token: 52f127ff-7ed6-41c8-951e-c82276539b1d' \
  -d '{
    \"transferId\": \"125ec534-ee48-4575-b6a9-ead2955b8109\",
    \"payerFsp\": \"dfsp3\",
    \"payeeFsp\": \"dfsp1\",
    \"amount\": {
      \"currency\": \"USD\",
      \"amount\": \"100\"
    },
    \"ilpPacket\": \"AYIBgQAAAAAAAASwNGxldmVsb25lLmRmc3AxLm1lci45T2RTOF81MDdqUUZERmZlakgyOVc4bXFmNEpLMHlGTFGCAUBQU0svMS4wCk5vbmNlOiB1SXlweUYzY3pYSXBFdzVVc05TYWh3CkVuY3J5cHRpb246IG5vbmUKUGF5bWVudC1JZDogMTMyMzZhM2ItOGZhOC00MTYzLTg0NDctNGMzZWQzZGE5OGE3CgpDb250ZW50LUxlbmd0aDogMTM1CkNvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbgpTZW5kZXItSWRlbnRpZmllcjogOTI4MDYzOTEKCiJ7XCJmZWVcIjowLFwidHJhbnNmZXJDb2RlXCI6XCJpbnZvaWNlXCIsXCJkZWJpdE5hbWVcIjpcImFsaWNlIGNvb3BlclwiLFwiY3JlZGl0TmFtZVwiOlwibWVyIGNoYW50XCIsXCJkZWJpdElkZW50aWZpZXJcIjpcIjkyODA2MzkxXCJ9IgA\",
    \"condition\": \"bSqIkHNqib-I69QFoVR--ja3L4Raye2WERq2Gzitb-U\",
    \"expiration\": \"$EXPIRATION_DATE\",
    \"extensionList\": {
      \"extension\": [{
        \"key\": \"key1\",
        \"value\": \"value1\"
      }]
    }
  }'"
sh -c "curl -X POST \
  http://localhost:3000/transfers \
  -H 'Accept: application/vnd.interoperability.transfers+json;version=1' \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/vnd.interoperability.transfers+json;version=1.0' \
  -H 'Date: $HEADER_DATE' \
  -H 'FSPIOP-Destination: dfsp1' \
  -H 'FSPIOP-Source: dfsp3' \
  -H 'Postman-Token: 52f127ff-7ed6-41c8-951e-c82276539b1d' \
  -d '{
    \"transferId\": \"125ec534-ee48-4575-b6a9-ead2955b8110\",
    \"payerFsp\": \"dfsp3\",
    \"payeeFsp\": \"dfsp1\",
    \"amount\": {
      \"currency\": \"USD\",
      \"amount\": \"100\"
    },
    \"ilpPacket\": \"AYIBgQAAAAAAAASwNGxldmVsb25lLmRmc3AxLm1lci45T2RTOF81MDdqUUZERmZlakgyOVc4bXFmNEpLMHlGTFGCAUBQU0svMS4wCk5vbmNlOiB1SXlweUYzY3pYSXBFdzVVc05TYWh3CkVuY3J5cHRpb246IG5vbmUKUGF5bWVudC1JZDogMTMyMzZhM2ItOGZhOC00MTYzLTg0NDctNGMzZWQzZGE5OGE3CgpDb250ZW50LUxlbmd0aDogMTM1CkNvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbgpTZW5kZXItSWRlbnRpZmllcjogOTI4MDYzOTEKCiJ7XCJmZWVcIjowLFwidHJhbnNmZXJDb2RlXCI6XCJpbnZvaWNlXCIsXCJkZWJpdE5hbWVcIjpcImFsaWNlIGNvb3BlclwiLFwiY3JlZGl0TmFtZVwiOlwibWVyIGNoYW50XCIsXCJkZWJpdElkZW50aWZpZXJcIjpcIjkyODA2MzkxXCJ9IgA\",
    \"condition\": \"bSqIkHNqib-I69QFoVR--ja3L4Raye2WERq2Gzitb-U\",
    \"expiration\": \"$EXPIRATION_DATE\",
    \"extensionList\": {
      \"extension\": [{
        \"key\": \"key1\",
        \"value\": \"value1\"
      }]
    }
  }'"
echo
echo "---------------------------------------------------------------------"
echo "Prepare 8 transfers completed"
echo "---------------------------------------------------------------------"
echo
