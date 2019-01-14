#!/usr/bin/env bash
CWD="${0%/*}"

if [[ "$CWD" =~ ^(.*)\.sh$ ]];
then
    CWD="."
fi

echo "Loading env vars..."
source $CWD/env.sh

echo "---------------------------------------------------------------------"
echo "Fulfil all 8 transfers"
echo "---------------------------------------------------------------------"

sh -c "curl -X PUT \
  http://localhost:3000/transfers/125ec534-ee48-4575-b6a9-ead2955b8103 \
  -H 'Accept: application/vnd.interoperability.transfers+json;version=1.0' \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/vnd.interoperability.transfers+json;version=1' \
  -H 'Date: $HEADER_DATE' \
  -H 'FSPIOP-Destination: dfsp3' \
  -H 'FSPIOP-Source: dfsp2' \
  -H 'Postman-Token: 13197130-8434-4707-a130-9e2816a94cc8' \
  -d '{
    \"fulfilment\": \"f5sqb7tBTWPd5Y8BDFdMm9BJR_MNI4isf8p8n4D5pHA\",
    \"transferState\": \"COMMITTED\",
    \"completedTimestamp\": \"$CURRENT_DATE\",
    \"extensionList\": {
      \"extension\": [{
        \"key\": \"fulfilmentKey1\",
        \"value\": \"fufiflmentValue1\"
      }]
    }
  }'"
sh -c "curl -X PUT \
  http://localhost:3000/transfers/125ec534-ee48-4575-b6a9-ead2955b8104 \
  -H 'Accept: application/vnd.interoperability.transfers+json;version=1.0' \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/vnd.interoperability.transfers+json;version=1' \
  -H 'Date: $HEADER_DATE' \
  -H 'FSPIOP-Destination: dfsp3' \
  -H 'FSPIOP-Source: dfsp2' \
  -H 'Postman-Token: 13197130-8434-4707-a130-9e2816a94cc8' \
  -d '{
    \"fulfilment\": \"f5sqb7tBTWPd5Y8BDFdMm9BJR_MNI4isf8p8n4D5pHA\",
    \"transferState\": \"COMMITTED\",
    \"completedTimestamp\": \"$CURRENT_DATE\",
    \"extensionList\": {
      \"extension\": [{
        \"key\": \"fulfilmentKey1\",
        \"value\": \"fufiflmentValue1\"
      }]
    }
  }'"
sh -c "curl -X PUT \
  http://localhost:3000/transfers/125ec534-ee48-4575-b6a9-ead2955b8105 \
  -H 'Accept: application/vnd.interoperability.transfers+json;version=1.0' \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/vnd.interoperability.transfers+json;version=1' \
  -H 'Date: $HEADER_DATE' \
  -H 'FSPIOP-Destination: dfsp3' \
  -H 'FSPIOP-Source: dfsp2' \
  -H 'Postman-Token: 13197130-8434-4707-a130-9e2816a94cc8' \
  -d '{
    \"fulfilment\": \"f5sqb7tBTWPd5Y8BDFdMm9BJR_MNI4isf8p8n4D5pHA\",
    \"transferState\": \"COMMITTED\",
    \"completedTimestamp\": \"$CURRENT_DATE\",
    \"extensionList\": {
      \"extension\": [{
        \"key\": \"fulfilmentKey1\",
        \"value\": \"fufiflmentValue1\"
      }]
    }
  }'"
sh -c "curl -X PUT \
  http://localhost:3000/transfers/125ec534-ee48-4575-b6a9-ead2955b8106 \
  -H 'Accept: application/vnd.interoperability.transfers+json;version=1.0' \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/vnd.interoperability.transfers+json;version=1' \
  -H 'Date: $HEADER_DATE' \
  -H 'FSPIOP-Destination: dfsp3' \
  -H 'FSPIOP-Source: dfsp2' \
  -H 'Postman-Token: 13197130-8434-4707-a130-9e2816a94cc8' \
  -d '{
    \"fulfilment\": \"f5sqb7tBTWPd5Y8BDFdMm9BJR_MNI4isf8p8n4D5pHA\",
    \"transferState\": \"COMMITTED\",
    \"completedTimestamp\": \"$CURRENT_DATE\",
    \"extensionList\": {
      \"extension\": [{
        \"key\": \"fulfilmentKey1\",
        \"value\": \"fufiflmentValue1\"
      }]
    }
  }'"
sh -c "curl -X PUT \
  http://localhost:3000/transfers/125ec534-ee48-4575-b6a9-ead2955b8107 \
  -H 'Accept: application/vnd.interoperability.transfers+json;version=1.0' \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/vnd.interoperability.transfers+json;version=1' \
  -H 'Date: $HEADER_DATE' \
  -H 'FSPIOP-Destination: dfsp3' \
  -H 'FSPIOP-Source: dfsp2' \
  -H 'Postman-Token: 13197130-8434-4707-a130-9e2816a94cc8' \
  -d '{
    \"fulfilment\": \"f5sqb7tBTWPd5Y8BDFdMm9BJR_MNI4isf8p8n4D5pHA\",
    \"transferState\": \"COMMITTED\",
    \"completedTimestamp\": \"$CURRENT_DATE\",
    \"extensionList\": {
      \"extension\": [{
        \"key\": \"fulfilmentKey1\",
        \"value\": \"fufiflmentValue1\"
      }]
    }
  }'"
sh -c "curl -X PUT \
  http://localhost:3000/transfers/125ec534-ee48-4575-b6a9-ead2955b8108 \
  -H 'Accept: application/vnd.interoperability.transfers+json;version=1.0' \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/vnd.interoperability.transfers+json;version=1' \
  -H 'Date: $HEADER_DATE' \
  -H 'FSPIOP-Destination: dfsp1' \
  -H 'FSPIOP-Source: dfsp3' \
  -H 'Postman-Token: 13197130-8434-4707-a130-9e2816a94cc8' \
  -d '{
    \"fulfilment\": \"f5sqb7tBTWPd5Y8BDFdMm9BJR_MNI4isf8p8n4D5pHA\",
    \"transferState\": \"COMMITTED\",
    \"completedTimestamp\": \"$CURRENT_DATE\",
    \"extensionList\": {
      \"extension\": [{
        \"key\": \"fulfilmentKey1\",
        \"value\": \"fufiflmentValue1\"
      }]
    }
  }'"
sh -c "curl -X PUT \
  http://localhost:3000/transfers/125ec534-ee48-4575-b6a9-ead2955b8109 \
  -H 'Accept: application/vnd.interoperability.transfers+json;version=1.0' \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/vnd.interoperability.transfers+json;version=1' \
  -H 'Date: $HEADER_DATE' \
  -H 'FSPIOP-Destination: dfsp1' \
  -H 'FSPIOP-Source: dfsp3' \
  -H 'Postman-Token: 13197130-8434-4707-a130-9e2816a94cc8' \
  -d '{
    \"fulfilment\": \"f5sqb7tBTWPd5Y8BDFdMm9BJR_MNI4isf8p8n4D5pHA\",
    \"transferState\": \"COMMITTED\",
    \"completedTimestamp\": \"$CURRENT_DATE\",
    \"extensionList\": {
      \"extension\": [{
        \"key\": \"fulfilmentKey1\",
        \"value\": \"fufiflmentValue1\"
      }]
    }
  }'"
sh -c "curl -X PUT \
  http://localhost:3000/transfers/125ec534-ee48-4575-b6a9-ead2955b8110 \
  -H 'Accept: application/vnd.interoperability.transfers+json;version=1.0' \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/vnd.interoperability.transfers+json;version=1' \
  -H 'Date: $HEADER_DATE' \
  -H 'FSPIOP-Destination: dfsp1' \
  -H 'FSPIOP-Source: dfsp3' \
  -H 'Postman-Token: 13197130-8434-4707-a130-9e2816a94cc8' \
  -d '{
    \"fulfilment\": \"f5sqb7tBTWPd5Y8BDFdMm9BJR_MNI4isf8p8n4D5pHA\",
    \"transferState\": \"COMMITTED\",
    \"completedTimestamp\": \"$CURRENT_DATE\",
    \"extensionList\": {
      \"extension\": [{
        \"key\": \"fulfilmentKey1\",
        \"value\": \"fufiflmentValue1\"
      }]
    }
  }'"
echo
echo "---------------------------------------------------------------------"
echo "Fulfil 8 transfers completed"
echo "---------------------------------------------------------------------"
echo
