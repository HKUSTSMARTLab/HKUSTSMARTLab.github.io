#!/usr/bin/env python3
"""
Simple HTTP server to handle adding new publications to publications_data.js
"""

import json
import re
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs
import urllib.parse

class PublicationHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        """Handle POST request to add new publication"""
        try:
            # Read the request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            # Parse JSON data
            publication_data = json.loads(post_data.decode('utf-8'))
            
            # Validate required fields
            required_fields = ['title', 'publication', 'year', 'application', 'organ', 'methodology', 'data', 'mainResults', 'tasks']
            for field in required_fields:
                if field not in publication_data or not publication_data[field].strip():
                    self.send_error_response(f"Missing required field: {field}")
                    return
            
            # Add the publication to the file
            success = self.add_publication_to_file(publication_data)
            
            if success:
                self.send_success_response("Publication added successfully!")
            else:
                self.send_error_response("Failed to add publication to file")
                
        except json.JSONDecodeError:
            self.send_error_response("Invalid JSON data")
        except Exception as e:
            self.send_error_response(f"Server error: {str(e)}")

    def add_publication_to_file(self, publication_data):
        """Add new publication to publications_data.js file"""
        try:
            # Read current file
            with open('publications_data.js', 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Clean and escape text for JavaScript
            def clean_text(text):
                if not text:
                    return ''
                text = str(text).strip()
                text = text.replace('\\', '\\\\')
                text = text.replace('"', '\\"')
                text = text.replace("'", "\\'")
                text = text.replace('\n', '\\n')
                text = text.replace('\r', '\\r')
                text = text.replace('\t', '\\t')
                return text
            
            # Create new publication object
            new_publication = f"""    {{
        title: "{clean_text(publication_data['title'])}",
        publication: "{clean_text(publication_data['publication'])}",
        year: "{clean_text(publication_data['year'])}",
        application: "{clean_text(publication_data['application'])}",
        organ: "{clean_text(publication_data['organ'])}",
        methodology: "{clean_text(publication_data['methodology'])}",
        data: "{clean_text(publication_data['data'])}",
        mainResults: "{clean_text(publication_data['mainResults'])}",
        tasks: "{clean_text(publication_data['tasks'])}"
    }}"""
            
            # Find insertion point (after const publicationsData = [)
            pattern = r'const\s+publicationsData\s*=\s*\['
            match = re.search(pattern, content)
            if not match:
                return False
            
            insert_position = match.end()
            
            # Check if there are existing publications
            remaining_content = content[insert_position:].strip()
            if remaining_content and not remaining_content.startswith(']'):
                # There are existing publications, add comma after new one
                new_content = '\n' + new_publication + ','
            else:
                # No existing publications
                new_content = '\n' + new_publication
            
            # Insert the new publication at the beginning of the array
            updated_content = (
                content[:insert_position] + 
                new_content + 
                content[insert_position:]
            )
            
            # Write updated content back to file
            with open('publications_data.js', 'w', encoding='utf-8') as f:
                f.write(updated_content)
            
            return True
            
        except Exception as e:
            print(f"Error adding publication to file: {e}")
            return False

    def send_success_response(self, message):
        """Send success response"""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        response = json.dumps({"success": True, "message": message})
        self.wfile.write(response.encode('utf-8'))

    def send_error_response(self, message):
        """Send error response"""
        self.send_response(400)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        response = json.dumps({"success": False, "error": message})
        self.wfile.write(response.encode('utf-8'))

def run_server(port=8000):
    """Run the HTTP server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, PublicationHandler)
    print(f"Server running on http://localhost:{port}")
    print("Use Ctrl+C to stop the server")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped")
        httpd.server_close()

if __name__ == "__main__":
    run_server()
