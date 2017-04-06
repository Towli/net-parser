#!/bin/bash
printf "START OF SCRIPT"
mkdir -p "WGET"

TIMESTAMP="$(date +%s)"

for i in "$@"; do

    HOST="$i"
    HOST_LOG="$(echo $HOST | tail -c 5).log"

    printf "\n$TIMESTAMP\n" >> "WGET/$HOST_LOG"
    wget -O "/dev/null" -a "WGET/$HOST_LOG" "$HOST"

done
