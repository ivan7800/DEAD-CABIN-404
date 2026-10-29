#!/usr/bin/env python3
"""Servidor local DEAD CABIN 404, solo loopback."""
import argparse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Timer
import webbrowser
ROOT=Path(__file__).resolve().parent.parent
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(ROOT),**kwargs)
 def end_headers(self):self.send_header('X-Content-Type-Options','nosniff');super().end_headers()
def main():
 p=argparse.ArgumentParser();p.add_argument('--port',type=int,default=0);p.add_argument('--no-open',action='store_true');a=p.parse_args()
 if a.port<0 or a.port>65535:p.error('Puerto inválido')
 with ThreadingHTTPServer(('127.0.0.1',a.port),Handler) as s:
  u='http://127.0.0.1:'+str(s.server_port)+'/'
  print('DEAD CABIN 404 v1.8',flush=True);print('Juega en:',u,flush=True);print('Ctrl+C para salir',flush=True)
  if not a.no_open:Timer(.7,lambda:webbrowser.open(u)).start()
  try:s.serve_forever(poll_interval=.2)
  except KeyboardInterrupt:print('Servidor cerrado.')
if __name__=='__main__':main()
