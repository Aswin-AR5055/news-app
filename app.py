from flask import Flask, render_template, jsonify, request
import requests

app = Flask(__name__)
api_key = "pub_b09392a9820446c191902504fe99a6d2"

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/news")
def get_news():
    category = request.args.get("category")

    if category == "all" or category is None:
        url = f"https://newsdata.io/api/1/news?apikey={api_key}&language=ta"
    else:
        url = f"https://newsdata.io/api/1/news?apikey={api_key}&language=ta&category={category}"

    res = requests.get(url).json()
    return jsonify(res)


if __name__ == "__main__":
    app.run(debug=True, port=5000)