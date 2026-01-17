# Use Python 3.12 Alpine base image
FROM python:3.12-alpine

# Set working directory
WORKDIR /app

# Install system dependencies commonly needed for Python packages
RUN apk add --no-cache \
    build-base \
    libffi-dev

# Create virtual environment at /app/venv
RUN python -m venv /app/venv

# Ensure venv is used by default
ENV PATH="/app/venv/bin:$PATH"

# Copy requirements first for better layer caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the project files
COPY . /app

CMD ["python3","/app"]
