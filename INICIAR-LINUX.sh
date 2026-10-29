#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
if ! command -v python3 >/dev/null 2>&1; then
 echo 'ERROR: necesitas Python 3. Alternativa: abre JUGAR-SIN-INSTALAR.html.'
 exit 1
fi
exec python3 scripts/serve-local.py "$@"
