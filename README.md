# SkillSwap AI - Professional Service Marketplace

SkillSwap AI is a modern, full-featured service marketplace platform connecting clients with professional service providers. Built with React, TypeScript, and Tailwind CSS, it offers a premium user experience with real-time capabilities and AI-powered features.

## 🚀 Key Features

### Core Marketplace
-   **Professional Services**: Browse, search, and filter services by category, price, and rating.
-   **Job Board**: Clients can post service requests, and providers can submit offers.
-   **User Profiles**: Comprehensive profiles with portfolios, skills, badges, and service listings.
-   **Real-Time Chat**: Instant messaging between clients and providers with file sharing.

### Advanced Features
-   **AI Skill Assessment**: Interactive quiz to verify and badge user skills.
-   **AI Dispute Resolution**: Smart tips and advice for resolving conflicts.
-   **AI Content Analysis**: Intelligent tag suggestions for community posts.
-   **Community Hub**: A space for professionals to network, share knowledge, and discuss topics.
-   **Learning Center**: Educational paths with progress tracking and certificate generation.

### Technical Highlights
-   **Real-Time Updates**: Notifications, status, and job board updates powered by Supabase Realtime.
-   **Responsive Design**: Fully optimized for mobile, tablet, and desktop.
-   **Performance**: Code splitting, lazy loading, and optimized assets.
-   **Security**: Input validation and secure authentication flows.

## 🛠️ Tech Stack

-   **Frontend**: React 18, TypeScript, Vite
-   **Styling**: Tailwind CSS, Lucide React (Icons)
-   **State Management**: React Context API
-   **Backend / Database**: Supabase (PostgreSQL, Auth, Realtime, Storage)
-   **Notifications**: React Hot Toast
-   **SEO**: React Helmet Async

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/skillswap-ai.git
    cd skillswap-ai
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory and add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  **Build for production**
    ```bash
    npm run build
    ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.