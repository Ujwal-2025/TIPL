# TIPL Employee Monitoring - Setup Script
# Run this script to set up your development environment

Write-Host "🚀 TIPL Employee Monitoring - Setup Script" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

# Check Node.js version
Write-Host "📦 Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node --version
Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green

# Check if .env file exists
if (!(Test-Path ".env")) {
    Write-Host "`n⚠️  .env file not found! Creating from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Created .env file. Please update it with your actual values." -ForegroundColor Green
    Write-Host "`nIMPORTANT: You need to:" -ForegroundColor Red
    Write-Host "  1. Set up a PostgreSQL database" -ForegroundColor White
    Write-Host "  2. Update DATABASE_URL in .env" -ForegroundColor White
    Write-Host "  3. Generate NEXTAUTH_SECRET with: openssl rand -base64 32" -ForegroundColor White
    Read-Host "`nPress Enter when you've updated the .env file"
}

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Generate Prisma Client
Write-Host "`n🔧 Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate

# Create migrations
Write-Host "`n🗄️  Setting up database..." -ForegroundColor Yellow
$createDb = Read-Host "Do you want to create the database migration now? (y/n)"
if ($createDb -eq "y") {
    npx prisma migrate dev --name init
    Write-Host "✅ Database migration created successfully!" -ForegroundColor Green
} else {
    Write-Host "⏭️  Skipped database migration. Run 'npx prisma migrate dev' later." -ForegroundColor Yellow
}

Write-Host "`n✨ Setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "  1. Start the development server: npm run dev" -ForegroundColor White
Write-Host "  2. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host "  3. (Optional) Open Prisma Studio: npx prisma studio" -ForegroundColor White
Write-Host "`n🎉 Happy coding!" -ForegroundColor Cyan
