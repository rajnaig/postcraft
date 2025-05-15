# 🚀 PostCraft

**AI-Powered Social Media Content Generator**

## ⚠️ **IMPORTANT NOTICE - PROPRIETARY SOFTWARE**

<div align="center">

**📋 FOR EVALUATION PURPOSES ONLY 📋**

*This software is the intellectual property of **Gábor Rajnai***

</div>

### 🛡️ Usage Restrictions

- ✅ **PERMITTED**: Evaluation for employment by Astro Marketing Kft.
- ✅ **PERMITTED**: Technical assessment and code review
- ✅ **PERMITTED**: Academic demonstration in professional context
- ❌ **PROHIBITED**: Commercial use or deployment
- ❌ **PROHIBITED**: Code redistribution or sharing
- ❌ **PROHIBITED**: Creating derivative works
- ❌ **PROHIBITED**: Reverse engineering for competitive purposes

### 📞 Contact for Licensing

For commercial licensing, collaboration, or permission requests:
- **Email**: [rajnaigabor3@gmail.com](mailto:rajnaigabor3@gmail.com)
- **LinkedIn**: [linkedin.com/in/gaborrajnai](https://linkedin.com/in/gaborrajnai)

---

## 📝 Technical Demonstration

This project demonstrates expertise in:
- **AI/LLM Integration** (OpenAI GPT-4)
- **Full-Stack Development** (Angular + FastAPI)
- **Modern Web Technologies** (TypeScript, Material Design)
- **API Design** (REST, Swagger/OpenAPI)
- **Database Management** (SQLite, SQLAlchemy)

---

PostCraft is an intelligent social media content generator that transforms a single marketing message into platform-optimized posts for Facebook, Instagram, LinkedIn, and X (Twitter). Built with Angular 17+ and FastAPI, it features A/B testing, real-time platform previews, and an intuitive chat interface.

![PostCraft Demo](https://img.shields.io/badge/Status-Production_Ready-brightgreen)
![Angular](https://img.shields.io/badge/Angular-17+-red)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green)
![Python](https://img.shields.io/badge/Python-3.9+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)

## ✨ Features

### 🤖 AI-Powered Generation
- **OpenAI GPT-4 Integration** for intelligent content creation
- **Context-Aware Prompting** with platform-specific optimizations
- **Multi-Language Support** with primary focus on Hungarian content

### 📱 Multi-Platform Optimization
- **Facebook**: 2200 characters, engaging storytelling format
- **Instagram**: 2200 characters, hashtag-rich content with visual suggestions
- **LinkedIn**: 3000 characters, professional tone and networking focus
- **X (Twitter)**: 280 characters, concise and impactful messaging

### 🔄 A/B Testing Suite
- **Multiple Versions**: Generate 2-3 variations per platform
- **Version Selector**: Easy comparison between alternatives
- **Copy Optimization**: Each version tailored for maximum engagement

### 👁️ Platform Preview
- **Realistic Mockups**: See exactly how posts will appear
- **Live Preview**: Platform-specific UI simulation
- **Interactive Elements**: Hover effects and realistic social features

### 💬 Modern Chat Interface
- **Real-Time Generation**: Streaming responses with loading states
- **Quick Suggestions**: 30+ pre-built campaign ideas
- **History Management**: Track and revisit previous generations

### ⚙️ Advanced Features
- **Profile Management**: Save platform-specific configurations
- **History Tracking**: SQLite-based generation history
- **Responsive Design**: Optimized for desktop and mobile
- **Error Handling**: Comprehensive retry mechanisms

## 🏗️ Project Architecture

```
postcraft/
├── backend/                    # FastAPI Python backend
│   ├── app/
│   │   ├── api/               # REST API endpoints
│   │   │   ├── endpoints.py   # Generation, profiles, history
│   │   │   └── __init__.py    
│   │   ├── core/              # Core configurations
│   │   │   ├── config.py      # Environment settings
│   │   │   └── database.py    # SQLite connection
│   │   ├── models/            # Data models
│   │   │   ├── database.py    # SQLAlchemy models
│   │   │   └── schemas.py     # Pydantic models
│   │   ├── services/          # Business logic
│   │   │   ├── llm_service.py # OpenAI integration
│   │   │   └── __init__.py
│   │   └── main.py            # FastAPI application
│   ├── postcraft.db          # SQLite database
│   ├── requirements.txt      # Python dependencies
│   ├── run.py               # Development server
│   └── .env                 # Environment variables
├── postcraft-frontend/       # Angular 17+ frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # UI components
│   │   │   │   ├── chat-interface/    # Main chat UI
│   │   │   │   ├── profiles/          # Profile management
│   │   │   │   └── history/           # Generation history
│   │   │   ├── models/       # TypeScript interfaces
│   │   │   ├── services/     # HTTP services
│   │   │   └── app.routes.ts # Routing configuration
│   │   ├── assets/          # Static assets
│   │   └── styles.css       # Global styles
│   ├── package.json         # Node.js dependencies
│   └── angular.json         # Angular configuration
├── venv/                   # Python virtual environment
├── .gitignore             # Git ignore rules
└── README.md              # Project documentation
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.9+** with pip
- **Node.js 18+** with npm
- **OpenAI API Key** (required for content generation)
- **Git** for version control

### 1. Clone Repository

```bash
git clone https://github.com/rajnaig/postcraft.git
cd postcraft
```

### 2. Backend Setup

#### Virtual Environment Initialization

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment (macOS/Linux)
source venv/bin/activate

# Activate virtual environment (Windows)
.\venv\Scripts\activate
```

#### Install Dependencies

```bash
# Navigate to backend
cd backend

# Install Python packages
pip install -r requirements.txt
```

#### Environment Configuration

```bash
# Create .env file
touch .env

# Add your OpenAI API key to .env:
echo "OPENAI_API_KEY=your_openai_api_key_here" >> .env
echo "DATABASE_URL=sqlite:///./postcraft.db" >> .env
echo "DEBUG=True" >> .env
```

#### Run Backend

```bash
# Start FastAPI development server
python run.py

# Alternative using uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Backend runs on**: `http://localhost:8000`
**API Documentation**: `http://localhost:8000/docs`

### 3. Frontend Setup

#### Install Dependencies

```bash
# Navigate to frontend (new terminal)
cd postcraft-frontend

# Install Node.js packages
npm install
```

#### Angular Development Server

```bash
# Start Angular development server
ng serve

# With specific host and port
ng serve --host 0.0.0.0 --port 4200
```

**Frontend runs on**: `http://localhost:4200`

## 📊 API Endpoints

### Generation
- `POST /api/v1/generate` - Generate social media posts
- `GET /api/v1/platforms` - Get supported platforms
- `GET /api/v1/options` - Get configuration options

### Profile Management
- `GET /api/v1/profiles` - List user profiles
- `POST /api/v1/profiles` - Create new profile
- `PUT /api/v1/profiles/{id}` - Update profile
- `DELETE /api/v1/profiles/{id}` - Delete profile

### History
- `GET /api/v1/history` - Get generation history
- `GET /api/v1/history/{id}` - Get specific generation

## 🔧 Configuration

### Backend Environment Variables

```env
# Required
OPENAI_API_KEY=sk-...your-key-here

# Optional
DATABASE_URL=sqlite:///./postcraft.db
DEBUG=True
LOG_LEVEL=INFO
CORS_ORIGINS=http://localhost:4200
```

### Platform-Specific Settings

```python
PLATFORM_SETTINGS = {
    "facebook": {
        "max_chars": 2200,
        "style": "engaging_story",
        "hashtags": "moderate"
    },
    "instagram": {
        "max_chars": 2200,
        "style": "visual_focused",
        "hashtags": "maximum"
    },
    "linkedin": {
        "max_chars": 3000,
        "style": "professional",
        "hashtags": "minimal"
    },
    "x": {
        "max_chars": 280,
        "style": "concise_impactful",
        "hashtags": "moderate"
    }
}
```


## 🚀 Production Deployment

### Backend

```bash
# Install production dependencies
pip install -r requirements.txt

# Run with Gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker

# Or with uvicorn
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend

```bash
# Build for production
ng build --configuration production

# Serve built files
# Use nginx, Apache, or any static file server
```

### Docker Support

```dockerfile
# Dockerfile example for backend
FROM python:3.9-slim

WORKDIR /app
COPY backend/ .
RUN pip install -r requirements.txt

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🛠️ Development

### Project Structure Explained

- **Backend (FastAPI)**:
  - `app/api/` - REST endpoints with proper error handling
  - `app/services/` - Business logic, LLM integration
  - `app/models/` - SQLAlchemy ORM and Pydantic schemas
  - `app/core/` - Configuration and database setup

- **Frontend (Angular)**:
  - `components/chat-interface/` - Main application UI
  - `services/api.service.ts` - HTTP client for backend communication
  - `models/` - TypeScript interfaces for type safety

### Key Features Implementation

- **Streaming Responses**: Real-time content generation feedback
- **Error Boundaries**: Comprehensive error handling at all levels
- **Responsive Design**: Mobile-first approach with Material Design
- **Type Safety**: Full TypeScript integration with strict mode
- **State Management**: RxJS observables for reactive programming

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style

- **Backend**: Follow PEP 8, use Black formatter
- **Frontend**: Follow Angular style guide, use Prettier
- **Commits**: Use conventional commit messages

## 📄 License

This project is licensed under a Proprietary License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing the GPT-4 API
- **Angular Team** for the excellent framework
- **FastAPI** for the modern Python web framework
- **Material Design** for UI/UX inspiration

---

## 🔒 **Intellectual Property Notice**

### Copyright & Ownership
- **Author**: Gábor Rajnai
- **Copyright**: © 2025 All Rights Reserved
- **License**: Proprietary (See LICENSE file)

### For Astro Marketing Kft.
This PostCraft demonstration showcases technical capabilities in:
- AI-powered content generation systems
- Scalable full-stack architecture  
- Enterprise-grade API development
- Modern UI/UX design principles

**Note**: This is a technical demonstration. For production deployment or to discuss licensing terms, please contact me directly.

### Legal Protection
This software is protected by:
- Copyright law and international treaties
- Proprietary license agreement
- Intellectual property rights

**Unauthorized use, modification, or distribution is strictly prohibited.**

---

## 📞 Contact

**Gábor Rajnai**
- 📧 **Email**: [rajnaigabor3@gmail.com](mailto:rajnaigabor3@gmail.com)
---

<div align="center">

**© 2025 Gábor Rajnai - All Rights Reserved**

*PostCraft - Professional Social Media Content Generation*

</div>
