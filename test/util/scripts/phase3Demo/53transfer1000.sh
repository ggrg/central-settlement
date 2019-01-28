#!/usr/bin/env bash
CWD="${0%/*}"

if [[ "$CWD" =~ ^(.*)\.sh$ ]];
then
    CWD="."
fi

echo "Loading env vars..."
source $CWD/env.sh

echo "---------------------------------------------------------------------"
echo "Prepare a transfer (dfsp1 -> dfsp2: 1000 USD)"
echo "---------------------------------------------------------------------"

sh -c "curl -X POST \
  http://localhost:3000/transfers \
  -H 'Accept: application/vnd.interoperability.transfers+json;version=1' \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/vnd.interoperability.transfers+json;version=1.0' \
  -H 'Date: $HEADER_DATE' \
  -H 'FSPIOP-Destination: dfsp2' \
  -H 'FSPIOP-Source: dfsp1' \
  -H 'Postman-Token: 52f127ff-7ed6-41c8-951e-c82276539b1d' \
  -d '{
    \"transferId\": \"888ec534-ee48-4575-b6a9-ead2955b8202\",
    \"payerFsp\": \"dfsp1\",
    \"payeeFsp\": \"dfsp2\",
    \"amount\": {
      \"currency\": \"USD\",
      \"amount\": \"1000\"
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

echo "Awaiting $SLEEP_FACTOR_IN_SECONDS seconds..."
sleep $SLEEP_FACTOR_IN_SECONDS

echo
echo "---------------------------------------------------------------------"
echo "Fulfil the prepared transfer"
echo "---------------------------------------------------------------------"

sh -c "curl -X PUT \
  http://127.0.0.1:3000/transfers/888ec534-ee48-4575-b6a9-ead2955b8202 \
  -H 'Accept: application/vnd.interoperability.transfers+json;version=1.0' \
  -H 'Content-Type: application/vnd.interoperability.transfers+json;version=1' \
  -H 'Date: Mon, 25 Feb 2019 19:10:56 GMT' \
  -H 'FSPIOP-Destination: dfsp1' \
  -H 'FSPIOP-Source: dfsp2' \
  -H 'Postman-Token: 2bc30323-e4b2-4b40-8700-a941525fe84b' \
  -H 'cache-control: no-cache' \
  -d '{
	\"fulfilment\": \"f5sqb7tBTWPd5Y8BDFdMm9BJR_MNI4isf8p8n4D5pHA\",
	\"transferState\": \"COMMITTED\",
	\"completedTimestamp\": \"2019-01-05T08:00:00.000-03:00\",
	\"extensionList\": {
		\"extension\": [{
			\"key\": \"fulfilmentDetail\",
			\"value\": \"This is a fulfilment call from JMeter\"
		}]
	}
  }'"
echo "Done."