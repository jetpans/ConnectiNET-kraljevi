#!/bin/bash

# Get the current directory
current_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DATABASE_URL=<DBURL>
# List of Python files to run
python_files=("signUp.py" "editAccount.py" "deleteAccount.py" "createEvent_test.py" "leaveInterest_test.py")

# Loop through each Python file and run it

pg_dump -c "${DATABASE_URL}" > temp.sql 
for file in "${python_files[@]}"
do
    echo "Running $file..."
    python3 "$current_dir/$file"
done



# Run the SQL script
psql -d "${DATABASE_URL}" -f temp.sql