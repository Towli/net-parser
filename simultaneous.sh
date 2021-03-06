#!/bin/bash
printf "START OF SCRIPT"
mkdir -p "SIM"

TIMESTAMP="$(date +%s)"

for i in {1..5}; do

    HOST="$1"
    HOST_LOG="$i.$(echo $HOST | tail -c 5).log"

    printf "\n$TIMESTAMP\n" >> "SIM/$HOST_LOG"
    wget -O "/dev/null" -a "SIM/$HOST_LOG" "$HOST" &

done
