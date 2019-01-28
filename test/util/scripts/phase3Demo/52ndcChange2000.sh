#!/usr/bin/env bash
CWD="${0%/*}"

if [[ "$CWD" =~ ^(.*)\.sh$ ]];
then
    CWD="."
fi

echo "Loading env vars..."
source $CWD/env.sh

echo "---------------------------------------------------------------------"
echo "Change dfsp1 NDC to 2000."
echo "---------------------------------------------------------------------"

sh -c "curl -X PUT \
  http://127.0.0.1:3001/participants/dfsp1/limits \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 445fd290-ccf1-403a-b811-7b897917c91c' \
  -H 'cache-control: no-cache' \
  -d '{
  \"currency\": \"USD\",
  \"limit\": {
    \"type\": \"NET_DEBIT_CAP\",
    \"value\": 2000,
    \"alarmPercentage\": 10
  }
}'"

echo
echo "Done."