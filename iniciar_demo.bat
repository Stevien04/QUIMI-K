@echo off
title QUIMI-K | Servidor y Laboratorio Virtual
echo =========================================================================
echo    QUIMI-K: Simulador de Laboratorio Virtual de Quimica
echo    Institucion Educativa Alexander Fleming - Tacna, Peru (2026)
echo =========================================================================
echo.
echo Iniciando el servidor local en http://localhost:8000 ...
echo.

start "" "http://localhost:8000"
python server.py

pause
