#!/bin/bash
printf "START OF SCRIPT"
mkdir -p "PING" "TRACEROUTE"

TIMESTAMP="$(date +%s)"

for i in "$@"; do

    IP="$i"
    IP_LOG="$IP.log"

    printf "\n$TIMESTAMP\n" >> "PING/$IP_LOG"
    ping -c 120 "$IP" >> "PING/$IP_LOG"

    printf "\n$TIMESTAMP\n" >> "TRACEROUTE/$IP_LOG"
    traceroute "$IP" >> "TRACEROUTE/$IP_LOG"

done
