#!/usr/bin/env python3
"""
Deepseek API调用工具
用于翻译图标tags，支持进度显示、暂停、断点续传、并发翻译
"""

import json
import requests
import os
import time
import signal
import sys
import concurrent.futures

CONFIG_PATH = os.path.join(os.path.dirname(__file__), 'deepseek_api.json')
PROGRESS_FILE = os.path.join(os.path.dirname(__file__), 'translation_progress.json')

is_paused = False

def signal_handler(signum, frame):
    global is_paused
    if is_paused:
        sys.stdout.write("\n\n继续翻译...\n")
        sys.stdout.flush()
        is_paused = False
    else:
        sys.stdout.write("\n\n已暂停翻译（按Ctrl+C继续）...\n")
        sys.stdout.flush()
        is_paused = True

signal.signal(signal.SIGINT, signal_handler)

def load_config():
    with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

def load_progress():
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def save_progress(progress):
    with open(PROGRESS_FILE, 'w', encoding='utf-8') as f:
        json.dump(progress, f, ensure_ascii=False, indent=2)

def translate_single(text, config=None):
    if config is None:
        config = load_config()

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {config["api_key"]}'
    }

    prompt = f"翻译为中文，只返回中文：{text}"

    payload = {
        'model': config['model'],
        'messages': [{'role': 'user', 'content': prompt}],
        'temperature': 0.3,
        'max_tokens': 30,
        'extra_body': {'thinking': {'type': 'disabled'}}
    }

    try:
        response = requests.post(config['api_url'], headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        result = response.json()
        return result['choices'][0]['message']['content'].strip()
    except:
        return None

def translate_worker(args):
    tag, config = args
    translation = translate_single(tag, config)
    return tag, translation if translation else tag

def format_time(seconds):
    if seconds < 60:
        return f"{int(seconds)}秒"
    elif seconds < 3600:
        return f"{int(seconds//60)}分{int(seconds%60)}秒"
    else:
        return f"{int(seconds//3600)}时{int((seconds%3600)//60)}分"

def main():
    if len(sys.argv) < 2:
        print("用法: python3 translate_tags.py <tags文件路径> [并发数]")
        sys.exit(1)

    tags_file = sys.argv[1]
    max_workers = int(sys.argv[2]) if len(sys.argv) > 2 else 5

    tags = [line.strip() for line in open(tags_file, 'r', encoding='utf-8') if line.strip()]
    total = len(tags)

    config = load_config()
    progress = load_progress()
    completed = len(progress)

    pending_tags = [tag for tag in tags if tag not in progress]

    sys.stdout.write(f"总待翻译: {total} | 并发: {max_workers} | 已翻译: {completed}\n")
    sys.stdout.write("=" * 60 + "\n")
    sys.stdout.flush()

    start_time = time.time()
    batch_start = time.time()
    batch_count = 0
    failed = 0

    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(translate_worker, (tag, config)): tag for tag in pending_tags}

        for future in concurrent.futures.as_completed(futures):
            while is_paused:
                time.sleep(0.5)

            tag = futures[future]
            batch_count += 1

            try:
                result_tag, translation = future.result()
                if translation:
                    progress[result_tag] = translation
                    save_progress(progress)
                else:
                    failed += 1
            except:
                failed += 1

            completed = len(progress)
            elapsed = time.time() - start_time
            speed = batch_count / (time.time() - batch_start) if batch_count > 0 else 0
            remaining = (total - completed) / speed if speed > 0 else 0

            percent = (completed / total) * 100
            bar_len = 25
            filled = int(bar_len * completed / total) if total > 0 else 0
            bar = '█' * filled + '░' * (bar_len - filled)

            sys.stdout.write(f"\r[{bar}] {percent:5.1f}% | {completed}/{total} | {speed:.1f}/s | 剩余:{format_time(remaining)} | {tag[:15]}")
            sys.stdout.flush()

            time.sleep(0.05)

    sys.stdout.write(f"\n{'='*60}\n")
    sys.stdout.write(f"完成! 成功:{completed-failed} 失败:{failed}\n")
    sys.stdout.flush()

if __name__ == '__main__':
    main()