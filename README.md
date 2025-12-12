# 🎅 Secret Santa Web App 🎄

A magical Secret Santa web application with a React frontend and Google Apps Script backend, featuring rich GSAP animations and a Google Sheet as the database.

## ✨ Features

- **Secure Login**: Users authenticate with name and date of birth
- **Animated Magic Hat**: Beautiful GSAP-powered animations with a magical hat scene
- **Interactive Experience**: Draggable hand or clickable hat to pick your Secret Santa
- **Unique Assignments**: Each user gets a unique recipient, with no duplicates
- **One-Time Picking**: Users can only pick once, preventing multiple attempts
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile
- **Rich Animations**: 
  - Floating snowflakes
  - Sparkles and magical effects
  - Card reveal animation with confetti
  - Smooth GSAP transitions throughout
- **Google Sheets Backend**: Simple, no-database-server-required solution

## 🏗️ Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│  React Frontend │◄────►│ Google Apps      │◄────►│  Google Sheets  │
│  (Vite + GSAP)  │      │  Script API      │      │   (Database)    │
└─────────────────┘      └──────────────────┘      └─────────────────┘
```

- **Frontend**: React with Vite, GSAP for animations
- **Backend**: Google Apps Script (serverless)
- **Database**: Google Sheets (two sheets: Users and Assignments)

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Google account

### 1. Clone the Repository

```bash
git clone https://github.com/Gagan-Vasanth/secret-santa.git
cd secret-santa
```

### 2. Set Up the Backend

Follow the detailed instructions in [`backend/README.md`](backend/README.md):

1. Create a Google Sheet with "Users" and "Assignments" sheets
2. Add participant data to the Users sheet
3. Deploy the Google Apps Script as a web app
4. Copy the deployment URL

### 3. Set Up the Frontend

```bash
cd frontend
npm install
```

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your Google Apps Script URL:

```
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

### 4. Run the Development Server

```bash
npm run dev
```

Open your browser to `http://localhost:5173`

## 📦 Building for Production

```bash
cd frontend
npm run build
```

The built files will be in the `frontend/dist` directory. Deploy them to any static hosting service (Netlify, Vercel, GitHub Pages, etc.).

## 🎮 How It Works

### User Flow

1. **Login**: User enters their name and date of birth
2. **Validation**: Backend validates credentials against the Users sheet
3. **Check Status**: Backend checks if user has already picked
4. **Magic Hat Scene**: If valid and hasn't picked, user sees the animated magic hat
5. **Pick Action**: User either:
   - Drags the hand into the hat, or
   - Clicks the hat directly
6. **Assignment**: Backend randomly assigns an available recipient
7. **Reveal**: Card with recipient name appears with confetti animation
8. **Save**: Assignment is saved to Google Sheets, user is marked as "HasPicked"

### Backend Logic

The Google Apps Script handles:

- **User Validation**: Checks name + DOB against Users sheet
- **Pick Prevention**: Ensures users can't pick multiple times
- **Unique Assignment**: Each recipient is assigned only once
- **Random Selection**: Picks from available (unassigned) recipients
- **Data Persistence**: Saves assignments to prevent re-entry

## 🎨 Customization

### Styling

Edit the CSS files in `frontend/src/components/`:
- `Login.css` - Login page styling
- `MagicalHat.css` - Magic hat scene styling

### Animations

Modify GSAP animations in `frontend/src/components/MagicalHat.jsx`:
- `useEffect` hook contains the initial animations
- `revealCard()` function handles the card reveal animation
- `createConfetti()` function generates confetti effect

### Colors

Update the gradient colors in the CSS files:
- Login page: `.login-container` background
- Magic hat scene: `.magical-hat-container` background

## 📱 Responsive Design

The app is fully responsive with breakpoints for:
- Desktop (> 768px)
- Tablet (480px - 768px)
- Mobile (< 480px)

## 🔒 Security Considerations

⚠️ **Important**: This is a demonstration app with basic security:

- User authentication is done via name + DOB (not cryptographically secure)
- Google Apps Script is deployed with "Anyone" access
- All data is in a Google Sheet (ensure proper sharing settings)

For production use, consider:
- Adding proper authentication (OAuth, JWT, etc.)
- Implementing rate limiting
- Adding HTTPS enforcement
- Using a proper database with encrypted connections

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI library
- **Vite 7** - Build tool and dev server
- **GSAP 3** - Animation library (with Draggable plugin)
- **CSS3** - Styling with animations

### Backend
- **Google Apps Script** - Serverless JavaScript runtime
- **Google Sheets API** - Data storage and retrieval

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👏 Acknowledgments

- GSAP for amazing animation capabilities
- Google Apps Script for serverless backend
- The Secret Santa tradition for bringing joy to the holidays!

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

Made with ❤️ for the holiday season 🎄