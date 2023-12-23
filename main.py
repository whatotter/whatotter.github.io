from flask import Flask

app = Flask(__name__)

@app.route("/<file>")
def ind(file):
    return open("./"+file, "r").read()

app.run(port=80, host="0.0.0.0")