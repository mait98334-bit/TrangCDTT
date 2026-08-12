import json
import re

log_path = r"C:\Users\Admin\.gemini\antigravity-ide\brain\51e128b0-e555-4555-a815-e2ac9413faa5\.system_generated\logs\transcript_full.jsonl"
target_file_pattern = re.compile(r"admin[/\\]product[/\\]page\.js", re.IGNORECASE)

print("Extracting replace_file_content calls for page.js...")

with open(log_path, "r", encoding="utf-8") as f:
    for line_num, line in enumerate(f, 1):
        try:
            data = json.loads(line)
            step_index = data.get("step_index")
            tool_calls = data.get("tool_calls", [])
            for tc in tool_calls:
                name = tc.get("name")
                if name in ("replace_file_content", "multi_replace_file_content"):
                    args = tc.get("args", {})
                    if isinstance(args, str):
                        try:
                            args = json.loads(args)
                        except:
                            pass
                    if isinstance(args, dict):
                        tf = args.get("TargetFile", "")
                        if tf and target_file_pattern.search(tf):
                            print(f"--- STEP {step_index} ({name}) ---")
                            if name == "replace_file_content":
                                print(f"StartLine: {args.get('StartLine')}")
                                print(f"EndLine: {args.get('EndLine')}")
                                print("TargetContent:")
                                print(args.get('TargetContent'))
                                print("ReplacementContent:")
                                print(args.get('ReplacementContent'))
                            elif name == "multi_replace_file_content":
                                chunks = args.get("ReplacementChunks", [])
                                for idx, chunk in enumerate(chunks):
                                    print(f"Chunk {idx}: StartLine: {chunk.get('StartLine')}, EndLine: {chunk.get('EndLine')}")
                                    print("TargetContent:")
                                    print(chunk.get('TargetContent'))
                                    print("ReplacementContent:")
                                    print(chunk.get('ReplacementContent'))
                            print("\n")
        except Exception as e:
            pass
