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
echo "=> EXPECTED RESULT: Settlement state hasn't changed yet."
echo
echo

echo "TABLE transferStateChange"
docker exec -it $DB_ID mysql -uroot -e "SELECT * FROM central_ledger.transferStateChange ORDER BY createdDate DESC LIMIT 6"
echo "=> EXPECTED RESULT: Showing last 6 transfer state changes..."
echo
echo

echo "TABLE participantPosition (w/ enums)"
docker exec -it $DB_ID mysql -uroot -e "
SELECT pp.participantPositionId AS id,
CONCAT(pp.participantCurrencyId, '-', p.name, '-', lat.name) AS participantCurrencyId,
pp.value, pp.reservedValue, pp.changedDate
FROM central_ledger.participantPosition pp
JOIN central_ledger.participantCurrency pc
ON pc.participantCurrencyId = pp.participantCurrencyId
JOIN central_ledger.ledgerAccountType lat
ON lat.ledgerAccountTypeId = pc.ledgerAccountTypeId
JOIN central_ledger.participant p
ON p.participantId = pc.participantId
ORDER BY 1 DESC"
echo "=> EXPECTED RESULT: Credit for SETTLEMENT_NET_SENDER has been applied during PS_TRANSFERS_COMMITTED."
echo
echo
