#!/bin/sh
# Podbija numer wersji przy CSS/JS w podstronach, żeby przeglądarka
# nie podała starych plików z pamięci podręcznej po aktualizacji.
# Uruchamiać przed każdym commitem: ./wersja.sh
W=$(date +%Y%m%d%H%M)
for f in *.html; do
  sed -i '' -E "s/(css\/style\.css|js\/shop\.js|js\/kasa\.js)\?v=[0-9]+/\1?v=$W/g" "$f"
done
echo "wersja zasobów: $W"
