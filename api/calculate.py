from http.server import BaseHTTPRequestHandler
import json
from datetime import datetime

from calc import calculate_compensation


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers.get("content-length", 0))
        body = self.rfile.read(length)
        data = json.loads(body)

        d1 = datetime.strptime(data["d1"], "%Y-%m-%d").date()
        d2 = datetime.strptime(data["d2"], "%Y-%m-%d").date()

        result = calculate_compensation(
            d1=d1,
            d2=d2,
            used_old=data["used_work"],
            used_new=data["used_cal"],
            prog_old=data["prog_old"],
            prog_new=data["prog_new"],
            bs_old=data["bs_old"],
            bs_new=data["bs_new"],
        )

        response = json.dumps(result).encode()

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(response)
