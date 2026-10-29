from subprocess import Popen,PIPE
from urllib.request import urlopen
from pathlib import Path
import re
p=Path(__file__).resolve().parents[1]
s=Popen(['python3',str(p/'scripts/serve-local.py'),'--no-open','--port','0'],stdout=PIPE,stderr=PIPE,text=True,bufsize=1)
try:
 out=''.join(s.stdout.readline() for _ in range(3));url=re.search(r'http://127\.0\.0\.1:\d+/',out).group()
 for asset in ['','index.html','js/engine.js','js/chapter-art.js','js/feedback.js','css/edition18.css','sw.js']:
  with urlopen(url+asset,timeout=5) as res:
   assert res.status==200 and len(res.read())>100
   assert res.headers['X-Content-Type-Options']=='nosniff'
 print('PASS: local launcher HTTP tests')
finally:
 s.terminate();s.communicate(timeout=3)
