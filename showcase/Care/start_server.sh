#!/bin/bash

# Start the publication server
echo "Starting Publication Server..."
echo "This server allows the 'Add New Publication' feature to save data permanently."
echo ""
echo "Server will run on http://localhost:8000"
echo "Press Ctrl+C to stop the server"
echo ""

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    python3 add_publication_server.py
elif command -v python &> /dev/null; then
    python add_publication_server.py
else
    echo "Error: Python is not installed or not in PATH"
    echo "Please install Python 3 to run the server"
    exit 1
fi
