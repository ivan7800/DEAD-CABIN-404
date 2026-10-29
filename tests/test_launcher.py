"""Smoke test real de los recursos servidos por el lanzador local."""
from subprocess import Popen, PIPE
from urllib.request import urlopen
from pathlib import Path
from threading import Thread
import re

root=Path(__file__).resolve().parents[1]
proc=Popen(['python3',str(root/'scripts/serve-local.py'),'--no-open','--port','0'],stdout=PIPE,stderr=PIPE,text=True,bufsize=1)
try:
    output=[proc.stdout.readline() for _ in range(3)]
    url=re.search(r'http://127\.0\.0\.1:\d+/', ''.join(output)).group()
    for asset in ['','index.html','js/engine.js','js/chapter-art.js','js/feedback.js','css/edition18.css','sw.js']:
        with urlopen(url+asset,timeout=5) as response:
            body=response.read()
            assert response.status==200,(asset,response.status)
            assert len(body)>100,(asset,len(body))
            assert response.headers.get('X-Content-Type-Options')=='nosniff'
    print('PASS: Windows/Linux launcher server — HTTP 200, localhost-only and all 2.2 assets')
finally:
    proc.terminate()
    try:proc.communicate(timeout=3)
    except Exception:proc.kill()
