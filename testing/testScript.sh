#!/bin/bash

# Get the current directory
current_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# List of Python files to run
python_files=("one.py" "two.py" "three.py")

# Loop through each Python file and run it
for file in "${python_files[@]}"
do
    echo "Running $file..."
    python3 "$current_dir/$file"
done