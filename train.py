import pandas as pd, joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

df = pd.read_csv("data/wine_clean.csv")
features = [c for c in df.columns if c not in ("quality", "good")]
X, y = df[features], df["quality"]
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

model = RandomForestClassifier(n_estimators=300, random_state=42, class_weight="balanced")
model.fit(Xtr, ytr)
pred = model.predict(Xte)
print("Accuracy:", round(accuracy_score(yte, pred), 3))
print(classification_report(yte, pred, zero_division=0))
joblib.dump({"model": model, "features": features}, "models/wine_model.pkl")
