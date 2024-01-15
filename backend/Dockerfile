# Use the official Python image as a base image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Upgrade pip
RUN python -m pip install --upgrade pip

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Additional installation for psycopg2 (PostgreSQL adapter)
RUN apt-get update \
    && apt-get install -y libpq-dev \
    && pip install --no-cache-dir psycopg2-binary

# Copy the current directory contents into the container at /app
COPY . /app

# Set environment variables
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Expose the port your app runs on
EXPOSE 5000

# Command to run on container start
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "run:app"]
