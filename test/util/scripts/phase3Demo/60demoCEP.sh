#!/usr/bin/env bash
CWD="${0%/*}"

if [[ "$CWD" =~ ^(.*)\.sh$ ]];
then
    CWD="."
fi

echo "Loading env vars..."
source $CWD/env.sh

sh $CWD/50initCEP.sh
read -p "Press ENTER to run: 51transfer950.sh -- Trigger limit threshold alarm percentage for dfsp1"
sh 51transfer950.sh | less -MQ~+Gg
read -p "Press ENTER to run: 52ndcChange2000.sh -- Trigger NDC change notification for dfsp1"
sh 52ndcChange2000.sh | less -MQ~+Gg
read -p "Press ENTER to run: 53transfer1000.sh -- Trigger limit threshold alarm percentage for dfsp1 #2"
sh 53transfer1000.sh | less -MQ~+Gg
read -p "Demo completed."