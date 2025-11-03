#!/usr/bin/env python
"""Simple helper to run Hugging Face Inference API or a local transformers pipeline.

Usage:
  python tools/run_hf_local.py --model gpt2 --prompt "Hello"

If HF_API_KEY is set in the environment, the script will call the HF Inference API.
Otherwise it will attempt to load a small local model via transformers (gpt2).
"""
import os
import sys
import argparse
import json

def call_hf_api(model, prompt, max_length=128):
    import requests
    api_key = os.environ.get("HF_API_KEY")
    if not api_key:
        raise RuntimeError("HF_API_KEY not set")
    url = f"https://api-inference.huggingface.co/models/{model}"
    headers = {"Authorization": f"Bearer {api_key}", "Accept": "application/json"}
    payload = {"inputs": prompt, "parameters": {"max_new_tokens": max_length}}
    r = requests.post(url, headers=headers, json=payload, timeout=60)
    r.raise_for_status()
    return r.json()

def run_local_transformers(model, prompt, max_length=128):
    try:
        from transformers import pipeline
    except Exception as e:
        raise RuntimeError("transformers not installed or failed to import: " + str(e))
    pipe = pipeline("text-generation", model=model, device=-1)
    out = pipe(prompt, max_new_tokens=max_length, do_sample=False)
    return out

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", default="gpt2", help="Model id (HF model id or local model)")
    parser.add_argument("--prompt", required=True, help="Prompt text to send to model")
    parser.add_argument("--max-tokens", type=int, default=128)
    args = parser.parse_args()

    if os.environ.get("HF_API_KEY"):
        print("Using Hugging Face Inference API")
        try:
            res = call_hf_api(args.model, args.prompt, args.max_tokens)
            print(json.dumps(res, indent=2, ensure_ascii=False))
        except Exception as e:
            print("HF API call failed:", e)
            sys.exit(2)
    else:
        print("HF_API_KEY not set; attempting local transformers pipeline (may download models).")
        try:
            out = run_local_transformers(args.model, args.prompt, args.max_tokens)
            print(json.dumps(out, indent=2, ensure_ascii=False))
        except Exception as e:
            print("Local transformers run failed:", e)
            sys.exit(3)

if __name__ == "__main__":
    main()
