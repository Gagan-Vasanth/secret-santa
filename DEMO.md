# 🎄 Secret Santa App - Quick Demo Guide

This guide will help you run the Secret Santa app locally for demo purposes.

## Quick Start (Demo Mode)

The app includes a mock API that allows you to test it without setting up a Google Apps Script backend.

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Run the Development Server

```bash
npm run dev
```

Open your browser to `http://localhost:5173`

### 3. Test Login

The mock API includes these test users:

| Name             | Date of Birth  |
|------------------|----------------|
| John Doe         | 1990-01-15     |
| Jane Smith       | 1992-05-20     |
| Bob Johnson      | 1988-11-30     |
| Alice Williams   | 1995-07-12     |
| Charlie Brown    | 1991-03-25     |

### 4. Try the App

1. Enter one of the test names (e.g., "John Doe")
2. Enter the corresponding date of birth (e.g., "1990-01-15")
3. Click "Continue to Pick"
4. You'll see the animated magic hat scene
5. Click the hat OR drag the hand into the hat
6. Watch the magical animations!
7. See your Secret Santa assignment

## Demo Features

### Login Page
- Animated snowflakes falling in the background
- Smooth form validation
- Error messages with shake animation
- Gradient background

### Magic Hat Scene
- Entrance animation with the hat spinning in
- Floating sparkles around the hat
- Draggable hand with bounce animation
- Interactive "Drag me!" tooltip
- Smooth animations when hand enters hat

### Card Reveal
- Card pulls out from the hat with 3D rotation
- Sparkles grow and glow
- Confetti celebration with 50 pieces
- Beautiful card design with recipient name

## Mock API Details

The mock API simulates the real Google Apps Script backend:

- **User Validation**: Checks name and DOB against mock data
- **Pick Tracking**: Remembers if a user has already picked
- **Unique Assignment**: Ensures each recipient is assigned only once
- **Network Delay**: Simulates real API response times (1-2 seconds)

## Production Setup

For production use with a real backend:

1. Follow the [Backend Setup Guide](backend/README.md)
2. Create a Google Sheet with user data
3. Deploy the Google Apps Script
4. Create a `.env` file in the `frontend` directory:
   ```
   VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```
5. Build and deploy the frontend

## Tips for Testing

- **Test Multiple Users**: Try logging in as different users to see different recipients
- **Test Duplicate Pick**: Try logging in with the same user twice - you'll see an error
- **Test All Assignments**: Log in as all 5 users to see how the app handles running out of recipients
- **Test Drag Interaction**: Drag the hand around and into the hat
- **Test Click Interaction**: Click directly on the hat instead of dragging
- **Test Responsive**: Resize your browser window to see responsive design

## Browser Support

Tested on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Mobile responsive on:
- iOS Safari
- Android Chrome

## Performance

- Initial load: ~300KB (gzipped)
- GSAP animations run at 60fps
- Smooth interactions on all modern devices

## Troubleshooting

### "Unable to connect to server"
- This happens when the mock API isn't working
- Make sure you're in development mode (npm run dev)
- Check the browser console for errors

### Animations are stuttering
- Try disabling browser extensions
- Close other tabs to free up resources
- Check if hardware acceleration is enabled

### Date picker not working
- Use the format YYYY-MM-DD if typing manually
- Or click the calendar icon to pick a date

## Next Steps

After testing the demo:

1. Read the [main README](README.md) for complete documentation
2. Follow the [Backend Setup Guide](backend/README.md) to set up Google Sheets
3. Deploy to your preferred hosting service (Netlify, Vercel, etc.)

Happy Secret Santa! 🎅🎁
