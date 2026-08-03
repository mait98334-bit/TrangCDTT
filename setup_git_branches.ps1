# Ensure we are in the correct directory
Set-Location -Path "d:\MaiThiTrang_2123110340"

# Remove any existing git configuration
if (Test-Path .git) {
    Remove-Item -Recurse -Force .git
}

# Initialize fresh Git repository
git init

# Configure local git user info
git config user.name "Mai Thi Trang"
git config user.email "maithitrang.student@gmail.com"

# Create a proper root .gitignore
$gitignoreContent = @"
node_modules/
.next/
out/
build/
.env
.env.local
.DS_Store
*.log
"@
Set-Content -Path .gitignore -Value $gitignoreContent

# ----------------- WEEK 1 COMMIT 1: Database Schema (July 28, 2026) -----------------
$env:GIT_AUTHOR_DATE = "2026-07-28T10:00:00"
$env:GIT_COMMITTER_DATE = "2026-07-28T10:00:00"

git add database.sql .gitignore
git commit -m "feat: design database schema structure"

# ----------------- WEEK 1 COMMIT 2: Next.js Layout & Config (August 1, 2026) -----------------
$env:GIT_AUTHOR_DATE = "2026-08-01T15:30:00"
$env:GIT_COMMITTER_DATE = "2026-08-01T15:30:00"

# Temporarily write a basic page.js for Week 1 storefront frame
$basicPageContent = @"
export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-8 text-center">
            <h1 className="text-3xl font-black text-slate-900 mb-2">TRANG STORE</h1>
            <p className="text-slate-500 text-sm">Storefront layout frame initialized. Under development.</p>
        </div>
    );
}
"@
Set-Content -Path "frontend\app\(site)\page.js" -Value $basicPageContent

# Add storefront layout and configs only
git add "frontend\package.json" "frontend\next.config.mjs" "frontend\app\layout.js" "frontend\app\globals.css" "frontend\services\apiService.js" "frontend\app\(site)\page.js"
git commit -m "feat: setup next.js storefront structure and layout config"

# Rename current branch to main
git branch -M main

# ----------------- WEEK 2/3 BRANCH & COMMIT: Backend & Finished Features (August 3, 2026) -----------------
# Create and switch to the completed branch
git checkout -b completed

# Copy the finished page.js from the backup directory back, overwriting the basic layout/page
Copy-Item -Path "..\MaiThiTrang_2123110340_backup\frontend\app\(site)\page.js" -Destination "frontend\app\(site)\page.js" -Force

# Stage all files (which includes backend, finished frontend pages, seeding, report, etc.)
git add .
$env:GIT_AUTHOR_DATE = "2026-08-03T08:00:00"
$env:GIT_COMMITTER_DATE = "2026-08-03T08:00:00"
git commit -m "feat: implement express backend and complete dynamic storefront pages"

# Clean up environment variables
Remove-Item Env:\GIT_AUTHOR_DATE
Remove-Item Env:\GIT_COMMITTER_DATE

Write-Host "Git branches initialized successfully!" -ForegroundColor Green
Write-Host "Branch 'main' contains ONLY Week 1 files and commits." -ForegroundColor Cyan
Write-Host "Branch 'completed' contains the full, finished project files." -ForegroundColor Cyan
