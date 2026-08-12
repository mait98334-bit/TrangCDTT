import json
import re

log_path = r"C:\Users\Admin\.gemini\antigravity-ide\brain\51e128b0-e555-4555-a815-e2ac9413faa5\.system_generated\logs\transcript_full.jsonl"

print("Starting extraction with fixed regex...")
# Allow backslashes or forward slashes
target_file_pattern = re.compile(r"admin[/\\]product[/\\]page\.js", re.IGNORECASE)

with open(log_path, "r", encoding="utf-8") as f:
    for line_num, line in enumerate(f, 1):
        try:
            data = json.loads(line)
            step_index = data.get("step_index")
            source = data.get("source")
            step_type = data.get("type")
            
            tool_calls = data.get("tool_calls", [])
            for tc in tool_calls:
                name = tc.get("name")
                args = tc.get("args", {})
                
                # If args is a string representation of dict, parse it
                if isinstance(args, str):
                    try:
                        args = json.loads(args)
                    except:
                        pass
                
                target_file = ""
                if isinstance(args, dict):
                    # Clean quotes and resolve target file
                    tf = args.get("TargetFile", "") or args.get("AbsolutePath", "")
                    if isinstance(tf, str):
                        target_file = tf.strip('"\'')
                
                if target_file and target_file_pattern.search(target_file):
                    print(f"Line {line_num} | Step {step_index} | Tool: {name}")
            
            # Print VIEW_FILE or others
            if step_type == "VIEW_FILE" and data.get("status") == "DONE":
                content = data.get("content", "")
                if target_file_pattern.search(content):
                    print(f"Line {line_num} | Step {step_index} | VIEW_FILE content found")
                    
        except Exception as e:
            pass
