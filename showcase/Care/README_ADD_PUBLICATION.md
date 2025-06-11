# Add New Publication Feature

This document explains how to use the "Add New Publication" feature that permanently saves data to the `publications_data.js` file.

## Problem Solved

Previously, the "Add New Publication" button only added data to memory, which was lost when the page was refreshed or the project was recompiled. Now, the feature saves data permanently to the `publications_data.js` file.

## How It Works

1. **Frontend**: The web interface collects publication data through a form
2. **Backend**: A Python server receives the data and writes it to `publications_data.js`
3. **Persistence**: New publications are saved permanently and survive page refreshes

## Setup Instructions

### Step 1: Start the Server

Before using the "Add New Publication" feature, you need to start the backend server:

```bash
# Option 1: Use the start script
./start_server.sh

# Option 2: Run directly with Python
python3 add_publication_server.py
```

The server will start on `http://localhost:8000`

### Step 2: Use the Web Interface

1. Open `paper.html` in your browser
2. Click the "Add New Publication" button
3. Fill in all required fields:
   - Title
   - Publication
   - Year
   - Application
   - Organ
   - Methodology
   - Data
   - Main Results
   - Tasks
4. Click "Add Publication"

## Features

### ✅ Permanent Storage
- New publications are saved to `publications_data.js`
- Data persists after page refresh or project recompilation
- Publications are added to the beginning of the array

### ✅ Real-time Updates
- Publication list updates immediately
- Charts and statistics refresh automatically
- Filter options update with new data

### ✅ Data Validation
- All fields are required
- Server-side validation ensures data integrity
- Error messages for missing or invalid data

### ✅ User Experience
- Loading states during save operation
- Success/error notifications
- Form automatically clears after successful submission

## File Structure

```
showcase/Care/
├── paper.html                    # Main web interface
├── publications_data.js          # Data file (updated by server)
├── add_publication_server.py     # Backend server
├── start_server.sh              # Server startup script
└── README_ADD_PUBLICATION.md    # This documentation
```

## Technical Details

### Server API

**Endpoint**: `POST http://localhost:8000`

**Request Body** (JSON):
```json
{
    "title": "Publication Title",
    "publication": "Journal Name",
    "year": "2024",
    "application": "Application Area",
    "organ": "Organ Type",
    "methodology": "Methodology Description",
    "data": "Data Description",
    "mainResults": "Main Results",
    "tasks": "Task Type"
}
```

**Response** (JSON):
```json
{
    "success": true,
    "message": "Publication added successfully!"
}
```

### Data Format

New publications are added to `publications_data.js` in this format:

```javascript
{
    title: "Publication Title",
    publication: "Journal Name",
    year: "2024",
    application: "Application Area",
    organ: "Organ Type",
    methodology: "Methodology Description",
    data: "Data Description",
    mainResults: "Main Results",
    tasks: "Task Type"
}
```

## Troubleshooting

### Server Not Running
If you see "Error connecting to server", make sure:
1. The server is running (`python3 add_publication_server.py`)
2. The server is accessible on `http://localhost:8000`
3. No firewall is blocking the connection

### Permission Errors
If the server can't write to `publications_data.js`:
1. Check file permissions
2. Make sure the server has write access to the directory

### CORS Issues
The server includes CORS headers to allow cross-origin requests from the web interface.

## Security Notes

- This server is designed for local development use
- Do not expose the server to the internet without proper security measures
- The server runs on localhost only by default

## Future Enhancements

Possible improvements:
- Edit existing publications
- Delete publications
- Bulk import from Excel files
- User authentication
- Data backup and restore
