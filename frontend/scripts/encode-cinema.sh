#!/usr/bin/env bash
# Turns a master clip (stock or AI-generated, 16:9) into the background film files of one page (content/cinema.ts):
#   src/assets/videos/cinema/<clip>.mp4     1920 px (1080p masters) or 1280 px, H.264, no audio
#   src/assets/videos/cinema/<clip>-sm.mp4  960 px, for phones
#   src/assets/videos/cinema/<clip>.webp    poster (first frame)
# The loop is seamless: the clip runs from start+1 s to start+length, and its last second cross-fades into
# start..start+1, so the last frame leads into the first. A light grade pulls every clip towards the navy identity.
#
#   scripts/encode-cinema.sh ~/Downloads/kling-home.mp4 home 0.5 10
set -euo pipefail

if [ $# -lt 2 ]; then
  echo "usage: $0 <master.mp4> <clip> [start seconds, default 0] [length seconds, default 10]" >&2
  exit 1
fi
in="$1"
clip="$2"
start="${3:-0}"
len="${4:-10}"
out="$(dirname "$0")/../src/assets/videos/cinema"
mkdir -p "$out"

grade="eq=saturation=0.82:contrast=1.06:brightness=-0.015,colorbalance=bs=0.06:bm=0.04:rs=-0.04:rm=-0.02"
offset=$(awk "BEGIN{print $len-2}")
loop="[0:v]fps=24,split[a][b];[a]trim=start=1:end=$len,setpts=PTS-STARTPTS,fps=24[A];[b]trim=start=0:end=1,setpts=PTS-STARTPTS,fps=24[B];[A][B]xfade=transition=fade:duration=1:offset=$offset,$grade"
height=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$in")
if [ "$height" -ge 1080 ]; then large="scale=1920:-2:flags=lanczos"; crf=27; else large="scale=1280:-2:flags=lanczos"; crf=25; fi

ffmpeg -nostdin -loglevel error -y -ss "$start" -t "$len" -i "$in" -filter_complex "$loop,$large,format=yuv420p" \
  -an -c:v libx264 -preset slow -crf "$crf" -profile:v high -movflags +faststart "$out/$clip.mp4"
ffmpeg -nostdin -loglevel error -y -ss "$start" -t "$len" -i "$in" -filter_complex "$loop,scale=960:-2:flags=lanczos,format=yuv420p" \
  -an -c:v libx264 -preset slow -crf 29 -profile:v high -movflags +faststart "$out/$clip-sm.mp4"
ffmpeg -nostdin -loglevel error -y -i "$out/$clip.mp4" -frames:v 1 -vf "scale=1280:-2" -c:v libwebp -quality 62 "$out/$clip.webp"

for f in "$out/$clip.mp4" "$out/$clip-sm.mp4" "$out/$clip.webp"; do
  printf '%-48s %6d kB\n' "$f" $(( $(stat -c %s "$f") / 1024 ))
done
