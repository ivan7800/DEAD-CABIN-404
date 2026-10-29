@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul
if not errorlevel 1 (
  py -3 scripts\serve-local.py %*
  goto :end
)
where python >nul 2>nul
if not errorlevel 1 (
  python scripts\serve-local.py %*
  goto :end
)
echo ERROR: necesitas Python 3. Alternativa: JUGAR-SIN-INSTALAR.html
pause
:end
endlocal
