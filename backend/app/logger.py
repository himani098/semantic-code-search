from datetime import datetime

LOG_FILE = "query_logs.txt"

def log_query(question, response_time, chunks):
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write("=" * 60 + "\n")
        f.write(f"Time: {datetime.now()}\n")
        f.write(f"Question: {question}\n")
        f.write(f"Response Time: {response_time:.2f} seconds\n")
        f.write(f"Chunks Retrieved: {chunks}\n")
        f.write("=" * 60 + "\n\n")