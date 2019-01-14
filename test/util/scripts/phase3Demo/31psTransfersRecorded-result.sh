#!/usr/bin/env bash
echo "*********************************************************************"
echo "---------------------------------------------------------------------"
echo "Showing current database state"
echo "---------------------------------------------------------------------"
echo

CWD="${0%/*}"

if [[ "$CWD" =~ ^(.*)\.sh$ ]];
then
    CWD="."
fi
source $CWD/env.sh

echo "TABLE settlementStateChange"
docker exec -it $DB_ID mysql -uroot -e "SELECT * FROM central_ledger.settlementStateChange ORDER BY 1 DESC"
echo "=> EXPECTED RESULT: Settlement state has changed also to PS_TRANSFERS_RECORDED. Showing 2 records."
echo
echo

echo "TABLE settlementWindowStateChange"
docker exec -it $DB_ID mysql -uroot -e "SELECT * FROM central_ledger.settlementWindowStateChange ORDER BY 1 DESC"
echo "=> EXPECTED RESULT: Settlement window is unchanged PENDING_SETTLEMENT state."
echo
echo

echo "TABLE settlementParticipantCurrencyStateChange"
docker exec -it $DB_ID mysql -uroot -e "SELECT * FROM central_ledger.settlementParticipantCurrencyStateChange ORDER BY 1 DESC"
echo "=> EXPECTED RESULT: All 3 accounts are PS_TRANSFERS_RECORDED."
echo
echo

echo "TABLE transfer"
docker exec -it $DB_ID mysql -uroot -e "SELECT * FROM central_ledger.transfer ORDER BY createdDate DESC LIMIT 6"
echo "=> EXPECTED RESULT: 3 new transfers have been just created. Showing last 6 records..."
echo
echo

echo "TABLE transferStateChange"
docker exec -it $DB_ID mysql -uroot -e "SELECT * FROM central_ledger.transferStateChange ORDER BY createdDate DESC LIMIT 6"
echo "=> EXPECTED RESULT: Showing last 6 transfer state changes..."
echo
echo
