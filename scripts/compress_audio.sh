#!/bin/bash

# Base directory containing your audio files
BASE_DIR="/Users/larrygrpolanco/Documents/GitHub/standard-chinese-platform/static/modules"

# Find all .mp3 files and process them
find "$BASE_DIR" -type f -name "*.mp3" | while read file; do
    echo "Processing: $file"
    
    # Create a temporary output file
    temp_file="${file%.mp3}_temp.mp3"
    
    # Compress the audio to 64 kbps
    ffmpeg -i "$file" -b:a 64k -y "$temp_file"
    
    # If successful, replace the original file
    if [ $? -eq 0 ]; then
        mv "$temp_file" "$file"
        echo "✓ Compressed: $file"
    else
        echo "✗ Failed: $file"
        rm -f "$temp_file"
    fi
done

echo "All files processed!"