import json
import re
import os
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass

log_path = r"C:\Users\Admin\.gemini\antigravity-ide\brain\51e128b0-e555-4555-a815-e2ac9413faa5\.system_generated\logs\transcript_full.jsonl"
target_file_pattern = re.compile(r"admin[/\\]product[/\\]page\.js", re.IGNORECASE)
original_file_path = r"d:\TrangCDTT\frontend\app\(admin)\admin\product\page.js"

with open(original_file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Normalize line endings to \n
content = content.replace("\r\n", "\n")
print(f"Original file length: {len(content.splitlines())} lines.")

replacements = []

with open(log_path, "r", encoding="utf-8") as f:
    for line in f:
        try:
            data = json.loads(line)
            step_index = data.get("step_index")
            if step_index >= 300:
                continue
                
            tool_calls = data.get("tool_calls", [])
            for tc in tool_calls:
                name = tc.get("name")
                if name == "replace_file_content":
                    args = tc.get("args", {})
                    if isinstance(args, str):
                        try:
                            args = json.loads(args)
                        except:
                            pass
                    if isinstance(args, dict):
                        tf = args.get("TargetFile", "")
                        if tf and target_file_pattern.search(tf):
                            target = args.get("TargetContent", "")
                            repl = args.get("ReplacementContent", "")
                            replacements.append((step_index, target, repl))
        except Exception as e:
            pass

print(f"Found {len(replacements)} replacements from steps: {[r[0] for r in replacements]}")
replacements.sort(key=lambda x: x[0])

# Apply replacements
for step, target, repl in replacements:
    normalized_target = target.replace("\r\n", "\n")
    normalized_repl = repl.replace("\r\n", "\n")
    
    if normalized_target in content:
        content = content.replace(normalized_target, normalized_repl)
        print(f"Applied replacement from Step {step} successfully!")
    else:
        # Try without any normalization
        if target in content:
            content = content.replace(target, repl)
            print(f"Applied replacement from Step {step} directly successfully!")
        else:
            print(f"WARNING: Replacement from Step {step} FAILED to match target!")

# Save reconstructed file with standard newline conversion
reconstructed_path = r"d:\TrangCDTT\frontend\app\(admin)\admin\product\page.js"
with open(reconstructed_path, "w", encoding="utf-8", newline="\r\n") as f:
    f.write(content)

print(f"Reconstructed file saved. Length: {len(content.splitlines())} lines.")
