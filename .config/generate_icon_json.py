#!/usr/bin/env python3
import csv
import json
import re

csv_file = '/Users/wanglin/工作_本地/trae/Casting_UI/public/icons/icons_index.csv'
with open(csv_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

all_tags_set = set()
icon_records = []

for row in rows:
    tags = []
    if row['tags']:
        parts = re.split(r'[,，]', row['tags'])
        for part in parts:
            part = part.strip()
            if part:
                tags.append(part)
    
    tags_cn = []
    if row['tags_cn']:
        parts = re.split(r'[,，]', row['tags_cn'])
        for part in parts:
            part = part.strip()
            if part:
                tags_cn.append(part)
    
    all_tags = []
    seen = set()
    for tag in tags:
        lower_tag = tag.lower()
        if lower_tag not in seen:
            seen.add(lower_tag)
            all_tags.append(tag)
            all_tags_set.add(tag)
    for tag in tags_cn:
        lower_tag = tag.lower()
        if lower_tag not in seen:
            seen.add(lower_tag)
            all_tags.append(tag)
            all_tags_set.add(tag)
    
    has_outline = bool(row['outline_path'].strip())
    has_filled = bool(row['filled_path'].strip())
    icon_type = 0
    if has_outline and has_filled:
        icon_type = 2
    elif has_outline:
        icon_type = 1
    elif has_filled:
        icon_type = 3
    
    icon_records.append({
        'name': row['name'],
        'tags': all_tags,
        'type': icon_type
    })

tag_list = sorted(list(all_tags_set))
tag_index = {tag: i for i, tag in enumerate(tag_list)}

icon_data = []
for record in icon_records:
    tag_indices = [tag_index[tag] for tag in record['tags']]
    icon_data.append([record['name'], tag_indices, record['type']])

icon_data.sort(key=lambda x: x[0])

output = {
    'd': icon_data,
    't': tag_list
}

output_file = '/Users/wanglin/工作_本地/trae/Casting_UI/public/manual/data-display/icon-search/icons_data.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, separators=(',', ':'))

print(f"生成图标数据JSON: {output_file}")
print(f"共 {len(icon_data)} 个图标")
print(f"共 {len(tag_list)} 个唯一标签")