# net-parser
A parser for scraping interesting information from logs of common network analysis tools.


Example crontab:
```bash
SERVERS="103.9.171.248 211.125.123.69 104.16.62.3 198.27.76.27 94.228.132.139 220.243.233.15 202.181.132.41"

FTP="ftp://ftp.acc.umu.se/mirror/cdimage.ubuntu.com/releases/yakkety/release/ubuntu-16.10-server-s390x.template ftp://ftp.acc.umu.se/mirror/cdimage.ubuntu.com/releases/yakkety/release/ubuntu-16.10-server-powerpc.iso.zsync ftp://ftp.acc.umu.se/mirror/cdimage.ubuntu.com/releases/yakkety/release/ubuntu-16.10-server-s390x.jigdo "

00 3 * * * ~/rtt.sh $SERVERS
00 4 * * * ~/thruput.sh $FTP

00 9 * * * ~/rtt.sh $SERVERS
00 10 * * * ~/thruput.sh $FTP

00 15 * * * ~/rtt.sh $SERVERS
00 16 * * * ~/thruput.sh $FTP

00 21 * * * ~/rtt.sh $SERVERS
00 22 * * * ~/thruput.sh $FTP
```
