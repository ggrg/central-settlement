#!/usr/bin/env bash
echo "---------------------------------------------------------------------"
echo "Starting script to populate test data.."
echo "---------------------------------------------------------------------"
echo

CWD="${0%/*}"

if [[ "$CWD" =~ ^(.*)\.sh$ ]];
then
    CWD="."
fi

echo "Loading env vars..."
source $CWD/env.sh

echo
echo
echo "*********************************************************************"
echo "Setting Hub threshold notification endpoint"
echo "---------------------------------------------------------------------"
sh -c "curl -X POST \
  ${CENTRAL_LEDGER_ADMIN_URI_PREFIX}://${CENTRAL_LEDGER_ADMIN_HOST}:${CENTRAL_LEDGER_ADMIN_PORT}${CENTRAL_LEDGER_ADMIN_BASE}participants/Hub/endpoints \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 75c639bd-fd38-43b7-9146-5097b989cc1f' \
  -H 'cache-control: no-cache' \
  -d '{
	\"type\": \"NET_DEBIT_CAP_THRESHOLD_BREACH_EMAIL\",
	\"value\": \"georgi.georgiev@modusbox.com\"
  }'"

echo
echo "Setting Hub NDC change notification endpoint"
echo "---------------------------------------------------------------------"
sh -c "curl -X POST \
  ${CENTRAL_LEDGER_ADMIN_URI_PREFIX}://${CENTRAL_LEDGER_ADMIN_HOST}:${CENTRAL_LEDGER_ADMIN_PORT}${CENTRAL_LEDGER_ADMIN_BASE}participants/Hub/endpoints \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 75c639bd-fd38-43b7-9146-5097b989cc1f' \
  -H 'cache-control: no-cache' \
  -d '{
	\"type\": \"NET_DEBIT_CAP_ADJUSTMENT_EMAIL\",
	\"value\": \"georgi.georgiev@modusbox.com\"
  }'"

for FSP in "${FSPList[@]}"
do
  echo
  echo
  echo "*********************************************************************"
  echo "Set callback URIs for each FSP '$FSP'"
  echo "---------------------------------------------------------------------"
  sh -c "curl -X POST \
    ${CENTRAL_LEDGER_ADMIN_URI_PREFIX}://${CENTRAL_LEDGER_ADMIN_HOST}:${CENTRAL_LEDGER_ADMIN_PORT}${CENTRAL_LEDGER_ADMIN_BASE}participants/${FSP}/endpoints \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/json' \
    -d '{
	\"type\": \"NET_DEBIT_CAP_THRESHOLD_BREACH_EMAIL\",
	\"value\": \"georgi.georgiev@modusbox.com\"
  }'"

  sh -c "curl -X POST \
    ${CENTRAL_LEDGER_ADMIN_URI_PREFIX}://${CENTRAL_LEDGER_ADMIN_HOST}:${CENTRAL_LEDGER_ADMIN_PORT}${CENTRAL_LEDGER_ADMIN_BASE}participants/${FSP}/endpoints \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/json' \
    -d '{
	\"type\": \"NET_DEBIT_CAP_ADJUSTMENT_EMAIL\",
	\"value\": \"georgi.georgiev@modusbox.com\"
  }'"
  echo
  echo "Retrieving EndPoints for '$FSP'"
  echo "---------------------------------------------------------------------"
  curl -X GET \
    ${CENTRAL_LEDGER_ADMIN_URI_PREFIX}://${CENTRAL_LEDGER_ADMIN_HOST}:${CENTRAL_LEDGER_ADMIN_PORT}${CENTRAL_LEDGER_ADMIN_BASE}participants/${FSP}/endpoints \
    -H 'Cache-Control: no-cache'

done

echo
