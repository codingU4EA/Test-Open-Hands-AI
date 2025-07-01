#!/usr/bin/env python3
"""
Simple HTTP server for testing the Pomodoro Timer application
"""

import http.server
import socketserver
import os
import sys

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 12000
    
    # Change to the directory containing the HTML files
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("0.0.0.0", port), CORSHTTPRequestHandler) as httpd:
        print(f"Serving Pomodoro Timer at http://0.0.0.0:{port}")
        print(f"Main app: http://0.0.0.0:{port}")
        print(f"Tests: http://0.0.0.0:{port}/tests/test.html")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

if __name__ == "__main__":
    main()