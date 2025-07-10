# ICPedia - AI-Powered Internet Computer Learning Platform

ICPedia is an innovative educational platform that combines the power of the Internet Computer blockchain with AI-driven tutoring to provide an interactive learning experience for ICP, Motoko, and Rust development.

## 🌟 Features

### 🤖 AI Tutor Integration
- **Omnidimension AI**: Intelligent tutoring powered by advanced AI
- **Interactive Chat**: Real-time conversations with your AI tutor
- **Code Examples**: Automatic code block detection and syntax highlighting
- **Voice Assistant**: Speech-to-text and text-to-speech capabilities
- **Persistent Storage**: Chat history stored on ICP blockchain

### 🔗 Blockchain Integration
- **User Canisters**: Personal storage on Internet Computer
- **Decentralized Profiles**: User progress and achievements on-chain
- **Secure Authentication**: ICP identity-based access control
- **Scalable Architecture**: Modular canister design

### 📚 Learning Features
- **Progress Tracking**: XP system and learning streaks
- **Interactive Quizzes**: Hands-on learning assessments  
- **Video Integration**: Educational content with progress tracking
- **Modern UI**: Beautiful, responsive interface built with React + TypeScript

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```bash
# Clone and setup everything
git clone <repository>
cd icpedia
./setup_ai_tutor.sh

# Configure your AI agent
python3 setup_omnidimension_agent.py

# Test the integration
./test_ai_integration.sh

# Start development
cd src/icpedia_frontend && npm run dev
```

### Option 2: Manual Setup
See [DEVELOPMENT.md](DEVELOPMENT.md) for detailed manual setup instructions.

## 📋 Prerequisites

- **dfx CLI**: [Install here](https://internetcomputer.org/docs/current/developer-docs/setup/install/)
- **Node.js**: Version 16 or higher
- **Python 3.7+**: For Omnidimension AI setup
- **Omnidimension Account**: Sign up at [omnidimension.ai](https://omnidimension.ai)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + TypeScript)          │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │   Chat UI       │ │  Voice Assistant │ │   Progress UI   ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┼─────────┐
                    │                   │
        ┌───────────▼──────────┐ ┌─────▼──────────────┐
        │  Omnidimension AI    │ │  Internet Computer │
        │     (External)       │ │    (Blockchain)    │
        └──────────────────────┘ └────────────────────┘
                                         │
                            ┌────────────┼────────────┐
                            │                         │
                  ┌─────────▼─────────┐    ┌─────────▼─────────┐
                  │  User Canister    │    │ Directory Canister │
                  │  (Personal Data)  │    │  (User Registry)   │
                  └───────────────────┘    └───────────────────┘
```

## 📁 Project Structure

```
icpedia/
├── src/
│   ├── icpedia_backend/           # Rust canisters
│   │   ├── user_canister/         # User profiles & chat storage
│   │   ├── directory_canister/    # User registry management
│   │   └── shared/                # Common types and utilities
│   └── icpedia_frontend/          # React frontend
│       ├── src/
│       │   ├── pages/Tutor.tsx    # AI chat interface
│       │   ├── hooks/useAIChat.ts # Chat state management
│       │   ├── services/          # API integrations
│       │   └── components/        # Reusable UI components
│       └── .env                   # Configuration
├── setup_ai_tutor.sh             # Automated setup script
├── test_ai_integration.sh         # Integration testing
├── setup_omnidimension_agent.py  # AI agent configuration
├── AI_TUTOR_SETUP.md             # Detailed setup guide
└── DEVELOPMENT.md                 # Development documentation
```

## 🔧 Configuration

### Environment Variables
Copy `.env.example` to `.env` and configure:

```bash
# Omnidimension AI Configuration
VITE_OMNI_API_KEY=your_api_key_here
VITE_OMNI_AGENT_ID=your_agent_id_here

# User Canister Configuration  
VITE_USER_CANISTER_ID=your_canister_id_here

# Development settings
VITE_LOCAL_REPLICA_PORT=4943
VITE_DFX_NETWORK=local
```

### AI Agent Setup
1. Sign up at [omnidimension.ai](https://omnidimension.ai)
2. Run the setup script: `python3 setup_omnidimension_agent.py`
3. Copy the generated credentials to your `.env` file

## 🛠️ Development

### Local Development
```bash
# Start ICP replica
dfx start --background

# Deploy canisters
dfx deploy

# Start frontend development server
cd src/icpedia_frontend
npm run dev
```

### Testing
```bash
# Run integration tests
./test_ai_integration.sh

# Test specific canister functions
dfx canister call user_canister ping
dfx canister call user_canister get_chat_messages '(opt 10)'
```

## 📚 Documentation

- **[AI Tutor Setup Guide](AI_TUTOR_SETUP.md)**: Detailed integration setup
- **[Development Guide](DEVELOPMENT.md)**: Development workflow and best practices
- **[ICP Documentation](https://internetcomputer.org/docs)**: Official Internet Computer docs
- **[Omnidimension API](https://docs.omnidimension.ai)**: AI service documentation

## 🔗 Key Technologies

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Rust, IC CDK, Candid
- **AI**: Omnidimension AI Platform
- **Blockchain**: Internet Computer Protocol (ICP)
- **Voice**: Web Speech API, Omnidimension Voice

## 🤝 Contributing

We welcome contributions! Please see [DEVELOPMENT.md](DEVELOPMENT.md) for:
- Development setup for contributors
- Code style guidelines
- Pull request process
- Testing requirements

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Issues**: Report bugs and feature requests on GitHub
- **ICP Community**: [Developer Forum](https://forum.dfinity.org)
- **AI Integration**: [Omnidimension Support](mailto:support@omnidimension.ai)

## 🎯 Roadmap

- [ ] Advanced voice interaction features
- [ ] Multi-language support for tutorials
- [ ] Collaborative learning features
- [ ] Mobile app development
- [ ] Advanced analytics and progress tracking
- [ ] Integration with more AI providers

---

Built with ❤️ for the Internet Computer ecosystem
