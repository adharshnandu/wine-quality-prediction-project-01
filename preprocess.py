import pandas as pd, numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib

df = pd.read_csv("data/WineQT.csv")
print("Raw shape:", df.shape)

# 1. Drop Id (row index, no predictive value)
df = df.drop(columns=["Id"])

# 2. Standardise column names
df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")

# 3. Remove duplicates (125 hidden once Id is dropped)
df = df.drop_duplicates().reset_index(drop=True)
print("After dedup:", df.shape)

# 4. Missing values (none in this file, kept for safety)
df = df.fillna(df.median(numeric_only=True))

# 5. Outliers: cap with IQR (winsorize) instead of deleting rows
features = [c for c in df.columns if c != "quality"]
for c in features:
    q1, q3 = df[c].quantile([0.25, 0.75])
    iqr = q3 - q1
    df[c] = df[c].clip(q1 - 1.5 * iqr, q3 + 1.5 * iqr)

# 6. Target: binary label (good = quality >= 7) for classification
df["good"] = (df["quality"] >= 7).astype(int)

df.to_csv("data/wine_clean.csv", index=False)
print("Clean shape:", df.shape)
print(df["good"].value_counts())

# 7. Train/test split + scaling (fit scaler on train only)
X, y = df[features], df["quality"]
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
sc = StandardScaler().fit(Xtr)
joblib.dump(sc, "models/scaler.pkl")
print("Train/test:", Xtr.shape, Xte.shape)
