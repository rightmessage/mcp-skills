#!/usr/bin/env bash
# Optional helper: capture one version of a page with agent-browser (https://github.com/vercel-labs/agent-browser).
# Any browser the agent can run JavaScript in works; this script is the same steps for agent-browser.
#
#   capture.sh --out <captures-dir> --version <id> --url <page-url>
#              [--tabs '<css selector of tab buttons>'] [--state <signed-in state file>]
#              [--hero '<css selector>'] [--expect '<text this version must show>']
#
# Writes <captures-dir>/<id>-0.json, then <id>-1.json … for each tab in --tabs, and <id>-hero.png, replacing any
# earlier captures of <id>. --expect is required for every version but "default".
# --state loads a saved agent-browser state (for example after signing in to RightMessage, so draft preview
# links render instead of redirecting to the login page). --expect fails the capture when the page doesn't show
# that text, so a version that rendered the default isn't scored.
set -euo pipefail

out="" version="" url="" tabs="" state="" hero="" expect=""
while [ $# -gt 0 ]; do
  [ $# -ge 2 ] || { echo "capture.sh: $1 needs a value" >&2; exit 1; }
  case "$1" in
    --out) out=$2; shift 2 ;;
    --version) version=$2; shift 2 ;;
    --url) url=$2; shift 2 ;;
    --tabs) tabs=$2; shift 2 ;;
    --state) state=$2; shift 2 ;;
    --hero) hero=$2; shift 2 ;;
    --expect) expect=$2; shift 2 ;;
    *) echo "capture.sh: unknown argument $1" >&2; exit 1 ;;
  esac
done
[ -n "$out" ] && [ -n "$version" ] && [ -n "$url" ] || { echo "usage: capture.sh --out DIR --version ID --url URL [--tabs SEL] [--state FILE] [--hero SEL] [--expect TEXT]" >&2; exit 1; }

[ "$version" = default ] || [ -n "$expect" ] || { echo "capture.sh: --expect is required for version $version, so a default render isn't scored as it" >&2; exit 1; }

here=$(cd "$(dirname "$0")" && pwd)
extract=$(cat "$here/extract-blocks.js")
mkdir -p "$out"
for f in "$out/$version"-*.json; do
  [[ "$(basename "$f")" =~ ^${version//./\\.}-[0-9]+\.json$ ]] && rm -f "$f"
done
rm -f "$out/$version-hero.png"
s="segment-fit-$version-$$"
ab() { agent-browser --session "$s" "$@"; }
trap 'ab close >/dev/null 2>&1 || true' EXIT

ab set media light reduced-motion >/dev/null 2>&1 || true
[ -n "$state" ] && ab state load "$state" >/dev/null
ab open "$url" >/dev/null
ab set viewport 1440 900 >/dev/null
sleep 3

json() { node -e 'process.stdin.on("data",d=>process.stdout.write(JSON.stringify(String(d))))'; }
login_check() {
  case "$(ab get url)" in
    *app.rightmessage.com*|*/login|*/login[/?#]*|*/signin|*/signin[/?#]*|*/sign-in|*/sign-in[/?#]*) echo "capture.sh: $version landed on $(ab get url), not the page; sign in and pass --state" >&2; exit 2 ;;
  esac
}
login_check

settle() {
  ab eval '(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,200))}scrollTo(0,0);return 1})()' >/dev/null
  local a b
  for _ in 1 2 3 4 5; do
    a=$(ab eval 'document.body.innerText.length'); sleep 1.5; b=$(ab eval 'document.body.innerText.length')
    [ "$a" = "$b" ] && break
  done
}

opts=$( [ -n "$hero" ] && printf 'window.SEGMENT_FIT_OPTIONS={heroSelector:%s};' "$(printf '%s' "$hero" | json)" || true)
settle
login_check
if [ -n "$expect" ]; then
  found=$(ab eval "document.body.innerText.replace(/\\s+/g,' ').toLowerCase().includes($(printf '%s' "$expect" | json).replace(/\\s+/g,' ').toLowerCase())")
  [ "$found" = "true" ] || { echo "capture.sh: $version doesn't show \"$expect\"; it may have rendered the default" >&2; exit 3; }
fi
ab eval "$opts$extract" > "$out/$version-0.json"
ab screenshot "$out/$version-hero.png" >/dev/null

if [ -n "$tabs" ]; then
  sel=$(printf '%s' "$tabs" | json)
  page=$(ab get url)
  count=$(ab eval "[...document.querySelectorAll($sel)].filter(e=>e.getBoundingClientRect().width>0).length")
  for ((i = 0; i < count; i++)); do
    ab eval "(()=>{const t=[...document.querySelectorAll($sel)].filter(e=>e.getBoundingClientRect().width>0)[$i];t.scrollIntoView({block:'center'});t.click();return 1})()" >/dev/null
    sleep 1
    [ "$(ab get url)" = "$page" ] || { echo "capture.sh: tab $((i + 1)) navigated away; --tabs must select tab buttons, not links" >&2; exit 4; }
    settle
    ab eval "$opts$extract" > "$out/$version-$((i + 1)).json"
  done
fi
echo "$version: $(ls "$out" | grep -cE "^${version//./\\.}-[0-9]+\.json$") captures in $out"
