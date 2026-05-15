#!/bin/bash
# PrivPulse One-Command Deploy Script
# Run: bash scripts/deploy.sh

set -e
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'

echo -e "${BLUE}"
echo "  ██████╗ ██████╗ ██╗██╗   ██╗██████╗ ██╗   ██╗██╗     ███████╗███████╗"
echo "  ██╔══██╗██╔══██╗██║██║   ██║██╔══██╗██║   ██║██║     ██╔════╝██╔════╝"
echo "  ██████╔╝██████╔╝██║██║   ██║██████╔╝██║   ██║██║     ███████╗█████╗  "
echo "  ██╔═══╝ ██╔══██╗██║╚██╗ ██╔╝██╔═══╝ ██║   ██║██║     ╚════██║██╔══╝  "
echo "  ██║     ██║  ██║██║ ╚████╔╝ ██║     ╚██████╔╝███████╗███████║███████╗"
echo "  ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝  ╚═╝      ╚═════╝ ╚══════╝╚══════╝╚══════╝"
echo -e "${NC}"
echo -e "${GREEN}Privacy-first Analytics SaaS — Deployment Script${NC}"
echo ""

# Check Node
if ! command -v node &> /dev/null; then
  echo -e "${RED}✗ Node.js not found. Install from https://nodejs.org${NC}"; exit 1
fi
echo -e "${GREEN}✓ Node.js $(node --version)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
  echo -e "${RED}✗ npm not found${NC}"; exit 1
fi

# Install dependencies
echo -e "\n${YELLOW}→ Installing dependencies...${NC}"
npm install

# Check .env.local
if [ ! -f .env.local ]; then
  echo -e "\n${YELLOW}→ Creating .env.local from template...${NC}"
  cp .env.example .env.local
  echo -e "${YELLOW}⚠  Please fill in your API keys in .env.local then run this script again${NC}"
  echo -e "${YELLOW}   See SETUP.md for where to get each value${NC}"
  exit 0
fi

# Validate required env vars
REQUIRED_VARS=(
  "NEXT_PUBLIC_SUPABASE_URL"
  "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  "SUPABASE_SERVICE_KEY"
  "HASH_SALT"
)
MISSING=0
for var in "${REQUIRED_VARS[@]}"; do
  val=$(grep "^$var=" .env.local | cut -d= -f2)
  if [ -z "$val" ] || [[ "$val" == *"YOUR_"* ]] || [[ "$val" == *"replace-this"* ]]; then
    echo -e "${RED}✗ Missing or placeholder: $var${NC}"
    MISSING=1
  else
    echo -e "${GREEN}✓ $var is set${NC}"
  fi
done

if [ "$MISSING" -eq 1 ]; then
  echo -e "\n${RED}Please fill in the missing values in .env.local${NC}"
  echo -e "${YELLOW}See SETUP.md for instructions${NC}"
  exit 1
fi

# Build
echo -e "\n${YELLOW}→ Building...${NC}"
npm run build
echo -e "${GREEN}✓ Build successful${NC}"

# Minify tracking script
echo -e "\n${YELLOW}→ Minifying tracking script...${NC}"
if command -v npx &> /dev/null; then
  npx terser public/p.js -o public/p.min.js -c -m 2>/dev/null && echo -e "${GREEN}✓ p.min.js created${NC}" || echo -e "${YELLOW}⚠ Minification skipped (terser not available)${NC}"
fi

# Deploy
if command -v vercel &> /dev/null; then
  echo -e "\n${YELLOW}→ Deploying to Vercel...${NC}"
  vercel --prod
  echo -e "${GREEN}✓ Deployed!${NC}"
else
  echo -e "\n${YELLOW}→ Vercel CLI not found. Installing...${NC}"
  npm install -g vercel
  echo -e "\n${YELLOW}→ Deploying to Vercel...${NC}"
  vercel --prod
fi

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✓ PrivPulse deployed successfully!      ║${NC}"
echo -e "${GREEN}║                                          ║${NC}"
echo -e "${GREEN}║  Next steps:                             ║${NC}"
echo -e "${GREEN}║  1. Add env vars in Vercel dashboard     ║${NC}"
echo -e "${GREEN}║  2. Connect your domain in Vercel        ║${NC}"
echo -e "${GREEN}║  3. Sign up at yourdomain.com/signup     ║${NC}"
echo -e "${GREEN}║  4. Add your first site                  ║${NC}"
echo -e "${GREEN}║  5. Paste the script tag on your site    ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}"
