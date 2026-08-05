cd /d "c:\Users\Kavyasri\OneDrive\Desktop\nxtwave project"
if exist frontend goto already
if exist client ren client frontend
:already
if exist backend goto done
if exist server ren server backend
:done
dir /b > rename-check.txt
