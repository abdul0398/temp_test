import sys

# Read arguments passed from Next.js API route
arg1 = sys.argv[1] if len(sys.argv) > 1 else "Default Arg 1"
arg2 = sys.argv[2] if len(sys.argv) > 2 else "Default Arg 2"

# Print output to be captured by Next.js
print(f"Received arguments: {arg1}, {arg2}")
print("Hello from Python!")
