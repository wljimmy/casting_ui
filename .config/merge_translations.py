#!/usr/bin/env python3
import json
import csv

# 读取翻译结果
translations = json.load(open('/Users/wanglin/工作_本地/trae/Casting_UI/.config/translation_progress.json'))

# 保存为独立的tag词典
with open('/Users/wanglin/工作_本地/trae/Casting_UI/public/icons/tag_dictionary.txt', 'w', encoding='utf-8') as f:
    for tag, cn in sorted(translations.items()):
        f.write(f"{tag}	{cn}\n")

print(f"已保存tag词典: {len(translations)} 个条目")

# 更新CSV索引
csv_file = '/Users/wanglin/工作_本地/trae/Casting_UI/public/icons/icons_index.csv'

with open(csv_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

for row in rows:
    tag = row['tags']
    tag_translations = []
    for t in tag.split(', '):
        t = t.strip()
        if t in translations:
            tag_translations.append(translations[t])
        else:
            tag_translations.append(t)
    row['tags_cn'] = '，'.join(tag_translations)

with open(csv_file, 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['name', 'path', 'type', 'type_en', 'tags', 'tags_cn'])
    writer.writeheader()
    writer.writerows(rows)

print(f"已更新CSV索引: {len(rows)} 个图标")
print("\n示例翻译:")
for tag, cn in list(translations.items())[:5]:
    print(f"  {tag} → {cn}")