@echo off
echo ========================================
echo   OneTime Chat - Git Commit Helper
echo ========================================
echo.

echo Checking git status...
git status

echo.
echo ========================================
echo Adding all files to git...
git add .

echo.
echo ========================================
echo Committing changes...
git commit -m "Initial commit - Complete setup with Frontend and Backend"

echo.
echo ========================================
echo Checking if remote exists...
git remote -v

echo.
echo ========================================
echo.
echo NEXT STEPS:
echo 1. If you haven't created a GitHub repo yet:
echo    - Go to https://github.com/new
echo    - Create a new repository named "onetime-chat"
echo    - Don't initialize with README
echo.
echo 2. If remote doesn't exist, run:
echo    git remote add origin https://github.com/YOUR_USERNAME/onetime-chat.git
echo    (Replace YOUR_USERNAME with your GitHub username)
echo.
echo 3. Then push:
echo    git push -u origin main
echo.
echo ========================================
pause

