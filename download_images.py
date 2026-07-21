import os
import re
import urllib.parse
import pandas as pd
import requests

# 1. Input CSV வாசித்தல்
csv_file = "products_supabase_clean.csv"
if not os.path.exists(csv_file):
  print(f"❌ Error: {csv_file} file கிடைக்கவில்லை! Project folder-ல் வைக்கவும்.")
  exit()

df = pd.read_csv(csv_file)

# படங்களைச் சேமிக்க images folder உருவாக்குதல்
os.makedirs("images", exist_ok=True)

# 2. Category தானாகப் பிரிக்கும் சார்பு
def assign_category(name):
  name_lower = str(name).lower()
  if "chakkar" in name_lower or "wheel" in name_lower:
    return "Ground Chakkars"
  elif (
      "pot" in name_lower
      or "koti" in name_lower
      or "siron" in name_lower
      or "jamuna" in name_lower
  ):
    return "Flower Pots & Fountains"
  elif (
      "pencil" in name_lower
      or "candle" in name_lower
      or "twinkling" in name_lower
      or "jil jil" in name_lower
  ):
    return "Pencils & Candles"
  elif (
      "bomb" in name_lower
      or "cit put" in name_lower
      or "king" in name_lower
      or "classic" in name_lower
      or "7 ply" in name_lower
      or "adiyal" in name_lower
  ):
    return "Atom Bombs"
  elif "rocket" in name_lower or "lunik" in name_lower:
    return "Rockets"
  elif (
      "laxmi" in name_lower
      or "kurivi" in name_lower
      or "sound" in name_lower
      or "chorsa" in name_lower
      or "tiger" in name_lower
      or "deluxe" in name_lower
      or "bijili" in name_lower
  ):
    return "Crackers & Bijili"
  elif "lar" in name_lower or "garland" in name_lower:
    return "Garlands (Saravedi)"
  elif "sparkler" in name_lower or "cap" in name_lower or "table" in name_lower:
    return "Sparklers"
  elif (
      "gift box" in name_lower
      or "pack" in name_lower
      or "jackpot" in name_lower
      or "vinayaga" in name_lower
      or "bheem" in name_lower
      or "andal" in name_lower
  ):
    return "Gift Boxes"
  else:
    return "Fancy & Aerial Shots"

# Assign categories
df["category"] = df["name"].apply(assign_category)

print("🚀 Starting 230 Image Generation & Download...")

image_urls = []

# 3. Generate AI image URLs and download images
for idx, row in df.iterrows():
  name = str(row["name"])
  cat = str(row["category"])

  clean_name = name.split("(")[0].replace("/", " ").strip()
  prompt = f"Product shot of Indian Diwali firecracker {clean_name}, {cat} category, festive packaging, 8k product photography, studio lighting"
  encoded_prompt = urllib.parse.quote(prompt)

  # AI Image URL
  image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=600&height=600&seed={idx+100}&nologo=true"
  image_urls.append(image_url)

  # Safe filename
  safe_name = re.sub(r"[^\w\-_\. ]", "_", name)
  filename = f"images/{idx+1}_{safe_name}.jpg"

  try:
    resp = requests.get(image_url, timeout=15)
    if resp.status_code == 200:
      with open(filename, "wb") as f:
        f.write(resp.content)
      print(f"[{idx+1}/230] Downloaded: {filename}")
    else:
      print(f"[{idx+1}/230] HTTP Error {resp.status_code} for {name}")
  except Exception as e:
    print(f"[{idx+1}/230] Failed: {name} - {e}")

# 4. Save CSV for Supabase import
df["image"] = image_urls
df.to_csv("products_supabase_ready.csv", index=False)

print("\n✅ Done! All images saved in 'images/' and CSV created as 'products_supabase_ready.csv'.")
