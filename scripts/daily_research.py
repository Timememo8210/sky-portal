#!/usr/bin/env python3
"""Daily Research — runs in GitHub Actions, publishes HTML to sky-portal"""
import os, sys, json, base64, datetime, re, subprocess

subprocess.check_call([sys.executable, "-m", "pip", "install", "anthropic", "requests", "-q"], 
                      stderr=subprocess.DEVNULL)

import anthropic
import requests

GITHUB_TOKEN = os.environ["GITHUB_TOKEN"]
ANTHROPIC_API_KEY = os.environ["ANTHROPIC_API_KEY"]
GITHUB_REPO = "Timememo8210/sky-portal"
PORTAL_BASE_URL = "https://timememo8210.github.io/sky-portal"

TODAY = datetime.date.today().isoformat()
NOW = datetime.datetime.now().strftime("%Y-%m-%d %H:%M UTC")

RESEARCH_TOPICS = [
    {"id": "semiconductor", "emoji": "🔬", "title": "半导体与AI",
     "prompt": "Search for today's most important semiconductor and AI industry news. Focus on: Intel, TSMC, Samsung foundry, NVIDIA, AMD, major fab investments, EUV/High-NA updates, advanced packaging, and AI chip developments. Summarize the top 5 stories with key takeaways. Be concise and factual."},
    {"id": "semi_stocks", "emoji": "📈", "title": "半导体股票",
     "prompt": "Search for today's semiconductor stock market movements. Cover: INTC, TSM, NVDA, AMD, ASML, KLAC, LRCX, AMAT, QCOM, AVGO. Highlight notable movers (>2% change), any analyst upgrades/downgrades, and sector sentiment. Include SOX index if available."},
    {"id": "barcelona", "emoji": "⚽", "title": "FC Barcelona",
     "prompt": "Search for the latest FC Barcelona news from the past 24 hours. Cover: recent match results or upcoming fixtures, transfer rumors, injury updates, LaLiga standings, Champions League status. Be specific with scores and player names."},
    {"id": "portland", "emoji": "🌲", "title": "Portland 本地",
     "prompt": "Search for today's Portland Oregon local news highlights. Cover: weather forecast, traffic/transit updates, notable local events, any major stories affecting the metro area. Keep it brief."},
]

def research_topic(client, topic):
    print(f"  🔍 {topic['title']}...")
    try:
        r = client.messages.create(
            model="claude-sonnet-4-20250514", max_tokens=2000,
            tools=[{"type": "web_search_20250305", "name": "web_search"}],
            messages=[{"role": "user", "content": topic["prompt"]}])
        texts = [b.text for b in r.content if hasattr(b, "text")]
        return "\n".join(texts).strip() or "(No results)"
    except Exception as e:
        return f"⚠️ Error: {e}"

def generate_html(sections):
    cards = ""
    for s in sections:
        c = s["content"].replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
        c = c.replace("\n\n","</p><p>").replace("\n","<br>")
        c = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', c)
        cards += f'<div class="card"><h2>{s["emoji"]} {s["title"]}</h2><div class="content"><p>{c}</p></div></div>\n'
    return f"""<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Daily Research — {TODAY}</title>
<style>
*{{margin:0;padding:0;box-sizing:border-box}}
body{{font-family:-apple-system,'Helvetica Neue','PingFang SC',sans-serif;background:#0f0f0f;color:#e0e0e0;padding:20px;max-width:800px;margin:0 auto}}
header{{text-align:center;padding:30px 0 20px;border-bottom:1px solid #333;margin-bottom:24px}}
header h1{{font-size:1.6em;color:#fff;font-weight:600}}
header .date{{color:#888;font-size:0.9em;margin-top:6px}}
.card{{background:#1a1a1a;border:1px solid #2a2a2a;border-radius:12px;padding:20px;margin-bottom:16px}}
.card h2{{font-size:1.1em;color:#f0a040;margin-bottom:12px;border-bottom:1px solid #2a2a2a;padding-bottom:8px}}
.content{{font-size:0.92em;line-height:1.7;color:#ccc}}
.content p{{margin-bottom:8px}} .content strong{{color:#fff}}
footer{{text-align:center;color:#555;font-size:0.8em;padding:20px 0;border-top:1px solid #222;margin-top:20px}}
</style></head><body>
<header><h1>📡 Daily Research Report</h1><div class="date">Generated: {NOW}</div></header>
{cards}
<footer>Powered by Claude API + Web Search | Auto-generated</footer>
</body></html>"""

def github_push(path, content, message):
    headers = {"Authorization": f"token {GITHUB_TOKEN}", "Accept": "application/vnd.github.v3+json"}
    url = f"https://api.github.com/repos/{GITHUB_REPO}/contents/{path}"
    sha = None
    r = requests.get(url, headers=headers)
    if r.status_code == 200:
        sha = r.json().get("sha")
    payload = {"message": message, "content": base64.b64encode(content.encode()).decode()}
    if sha:
        payload["sha"] = sha
    r = requests.put(url, headers=headers, json=payload)
    return r.status_code in (200, 201)

def main():
    print(f"\n📡 Daily Research — {NOW}\n")
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    
    sections = []
    for t in RESEARCH_TOPICS:
        content = research_topic(client, t)
        sections.append({**t, "content": content})
    
    html = generate_html(sections)
    filename = f"report-{TODAY}.html"
    
    if github_push(f"research/{filename}", html, f"📡 Daily research {TODAY}"):
        print(f"  ✅ Published: {PORTAL_BASE_URL}/research/{filename}")
    else:
        print("  ❌ Push failed")
    
    # Update index
    idx_url = f"https://api.github.com/repos/{GITHUB_REPO}/contents/research/index.html"
    headers = {"Authorization": f"token {GITHUB_TOKEN}", "Accept": "application/vnd.github.v3+json"}
    r = requests.get(idx_url, headers=headers)
    report_url = f"research/{filename}"
    if r.status_code == 200:
        existing = base64.b64decode(r.json()["content"]).decode()
        sha = r.json()["sha"]
        if report_url not in existing:
            item = f'  <li><a href="{report_url}">{TODAY}</a></li>\n'
            existing = existing.replace("</ul>", item + "</ul>")
            payload = {"message": f"Update index {TODAY}", "sha": sha,
                       "content": base64.b64encode(existing.encode()).decode()}
            requests.put(idx_url, headers=headers, json=payload)
    else:
        idx = f"""<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Research Reports</title>
<style>body{{font-family:sans-serif;max-width:600px;margin:40px auto;background:#111;color:#ddd;padding:20px}}a{{color:#f0a040}}h1{{font-size:1.3em}}</style></head>
<body><h1>📡 Daily Research Reports</h1><ul>
  <li><a href="{report_url}">{TODAY}</a></li>
</ul></body></html>"""
        github_push("research/index.html", idx, f"Create research index")
    
    print("\n✅ Done!\n")

if __name__ == "__main__":
    main()
