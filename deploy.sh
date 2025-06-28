#!/bin/bash

# Codette AI Deployment Script
# Supports multiple deployment targets for hackathon judges

set -e

echo "🏆 Codette AI - Deployment Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env exists, if not copy from example
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from .env.example..."
    cp .env.example .env
    print_warning "Please edit .env with your Supabase credentials (optional for demo)"
fi

# Function to check dependencies
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 16+ and try again."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm and try again."
        exit 1
    fi
    
    print_success "Dependencies check passed"
}

# Function to install packages
install_packages() {
    print_status "Installing packages..."
    npm install
    print_success "Packages installed successfully"
}

# Function to build the project
build_project() {
    print_status "Building project..."
    npm run build
    print_success "Project built successfully"
}

# Function to deploy to Netlify
deploy_netlify() {
    print_status "Deploying to Netlify..."
    
    if ! command -v netlify &> /dev/null; then
        print_status "Installing Netlify CLI..."
        npm install -g netlify-cli
    fi
    
    install_packages
    build_project
    
    print_status "Deploying to Netlify..."
    npx netlify deploy --prod --dir=dist
    
    print_success "Deployed to Netlify successfully!"
    print_status "Your site should be available at the URL shown above"
}

# Function to deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_status "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    install_packages
    build_project
    
    print_status "Deploying to Vercel..."
    npx vercel --prod
    
    print_success "Deployed to Vercel successfully!"
}

# Function to deploy with Docker
deploy_docker() {
    print_status "Deploying with Docker..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker and try again."
        exit 1
    fi
    
    print_status "Building Docker image..."
    docker build -t codette-ai .
    
    print_status "Starting Docker container..."
    docker run -d -p 3000:3000 --name codette-ai-container codette-ai
    
    print_success "Docker deployment successful!"
    print_status "Application is running at http://localhost:3000"
    print_status "To stop: docker stop codette-ai-container"
    print_status "To remove: docker rm codette-ai-container"
}

# Function to start local development
start_local() {
    print_status "Starting local development server..."
    
    install_packages
    
    print_status "Starting development server..."
    print_success "Development server will start at http://localhost:3000"
    print_status "Press Ctrl+C to stop the server"
    
    npm run dev
}

# Function to run demo mode
run_demo() {
    print_status "Starting Codette AI Demo Mode..."
    
    install_packages
    
    print_status "Opening demo in browser..."
    print_success "Demo is starting at http://localhost:3000"
    print_status "The browser should open automatically"
    print_status "If not, manually navigate to http://localhost:3000"
    
    # Try to open browser (works on most systems)
    if command -v open &> /dev/null; then
        open http://localhost:3000 &
    elif command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:3000 &
    elif command -v start &> /dev/null; then
        start http://localhost:3000 &
    fi
    
    npm run demo
}

# Main menu
show_menu() {
    echo ""
    echo "Choose deployment option:"
    echo "1) 🚀 Quick Demo (Recommended for judges)"
    echo "2) 🌐 Deploy to Netlify"
    echo "3) ⚡ Deploy to Vercel"
    echo "4) 🐳 Deploy with Docker"
    echo "5) 💻 Local Development"
    echo "6) ❌ Exit"
    echo ""
}

# Main script logic
main() {
    check_dependencies
    
    if [ $# -eq 0 ]; then
        # Interactive mode
        while true; do
            show_menu
            read -p "Enter your choice (1-6): " choice
            
            case $choice in
                1)
                    run_demo
                    break
                    ;;
                2)
                    deploy_netlify
                    break
                    ;;
                3)
                    deploy_vercel
                    break
                    ;;
                4)
                    deploy_docker
                    break
                    ;;
                5)
                    start_local
                    break
                    ;;
                6)
                    print_status "Goodbye!"
                    exit 0
                    ;;
                *)
                    print_error "Invalid option. Please choose 1-6."
                    ;;
            esac
        done
    else
        # Command line mode
        case $1 in
            "demo")
                run_demo
                ;;
            "netlify")
                deploy_netlify
                ;;
            "vercel")
                deploy_vercel
                ;;
            "docker")
                deploy_docker
                ;;
            "local")
                start_local
                ;;
            *)
                print_error "Unknown command: $1"
                echo "Usage: $0 [demo|netlify|vercel|docker|local]"
                exit 1
                ;;
        esac
    fi
}

# Run main function
main "$@"