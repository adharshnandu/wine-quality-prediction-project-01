import joblib, pandas as pd
from flask import Flask, render_template, request

app = Flask(__name__)
bundle = joblib.load("models/wine_model.pkl")
model, features = bundle["model"], bundle["features"]

@app.route("/", methods=["GET", "POST"])
def home():
    result = None
    if request.method == "POST":
        row = {f: float(request.form[f]) for f in features}
        q = int(model.predict(pd.DataFrame([row]))[0])
        result = {"quality": q, "label": "Good" if q >= 7 else "Average" if q >= 5 else "Poor"}
    return render_template("index.html", features=features, result=result)

if __name__ == "__main__":
    app.run(debug=True)
