from flask import Flask, render_template, request, jsonify, redirect
import sqlite3

app = Flask(__name__)

def init_db():

    conn = sqlite3.connect("database.db")
    cur = conn.cursor()

    cur.execute("CREATE TABLE IF NOT EXISTS scans(id TEXT)")
    cur.execute("CREATE TABLE IF NOT EXISTS links(id TEXT, url TEXT)")

    conn.commit()
    conn.close()

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/track", methods=["POST"])
def track():

    data = request.json["data"]

    conn = sqlite3.connect("database.db")
    cur = conn.cursor()

    cur.execute("INSERT INTO scans VALUES(?)",(data,))
    conn.commit()
    conn.close()

    return jsonify({"status":"ok"})

@app.route("/r/<id>")
def redirect_qr(id):

    conn = sqlite3.connect("database.db")
    cur = conn.cursor()

    cur.execute("SELECT url FROM links WHERE id=?",(id,))
    result = cur.fetchone()

    cur.execute("INSERT INTO scans VALUES(?)",(id,))
    conn.commit()
    conn.close()

    if result:
        return redirect(result[0])

    return "Invalid QR"

@app.route("/dashboard")
def dashboard():

    conn = sqlite3.connect("database.db")
    cur = conn.cursor()

    cur.execute("SELECT COUNT(*) FROM scans")
    total = cur.fetchone()[0]

    return f"<h1>Total QR Scans: {total}</h1>"

if __name__ == "__main__":
    init_db()
    app.run(debug=True)