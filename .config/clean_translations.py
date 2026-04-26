#!/usr/bin/env python3
import json
import csv
import unicodedata

# 读取翻译结果
translations = json.load(open('/Users/wanglin/工作_本地/trae/Casting_UI/.config/translation_progress.json'))

# 清理翻译结果
clean_translations = {}

# 特殊处理的缩写
abbreviations = {
    'nw': '西北',
    'sw': '西南',
    'ne': '东北',
    'se': '东南',
    'doc': '文档',
    'h': '小时',
    'lek': '莱克',
    'nem': '否定',
    'crest': ' crest',
    'cubeplus': '立方体加',
    'deca': '十',
    'doublefifty': '双五十',
    'doubleone': '双一',
    'duo': '二重奏',
    'duodec': '十二',
    'entry': '入口',
    'fitting': '合适的',
    'flops': '浮点运算',
    'fournine': '四九',
    'fourtwo': '四二',
    'novendec': '十九',
    'novendecad': '十九',
    'evencompass': '偶数指南针'
}

def is_special_char(c):
    """判断是否为特殊字符（非ASCII，非中文，非数字）"""
    if c.isascii():
        return False
    if c.isdigit():
        return False
    # 检查是否为中文字符
    try:
        c.encode('ascii')
        return False
    except UnicodeEncodeError:
        # 检查是否为中文字符
        if 'CJK' in unicodedata.name(c, ''):
            return False
        return True

def contains_special_chars(tag):
    """判断标签是否包含特殊字符"""
    for c in tag:
        if is_special_char(c):
            return True
    return False

for tag, cn in translations.items():
    # 特殊缩写处理
    if tag in abbreviations:
        clean_translations[tag] = abbreviations[tag]
    # 包含特殊字符（如波兰语字母）的标签保持原样
    elif contains_special_chars(tag):
        clean_translations[tag] = tag
    # 移除提示信息
    elif '可以翻译' in cn or '具体取决于' in cn or '如果你能提供' in cn:
        # 特殊符号直接使用原文
        if tag.isalnum() and len(tag) <= 3:
            # 短缩写直接使用原文
            clean_translations[tag] = tag
        else:
            # 其他情况使用tag作为翻译
            clean_translations[tag] = tag
    # 阿拉伯数字保持原样
    elif tag.isdigit():
        clean_translations[tag] = tag
    # 特殊符号保持原样
    elif len(tag) == 1 and not tag.isalnum():
        clean_translations[tag] = tag
    else:
        # 其他正常翻译保留
        clean_translations[tag] = cn

# 保存清理后的tag词典
with open('/Users/wanglin/工作_本地/trae/Casting_UI/public/icons/tag_dictionary.txt', 'w', encoding='utf-8') as f:
    for tag, cn in sorted(clean_translations.items()):
        f.write(f"{tag}	{cn}\n")

# 保存清理后的进度
with open('/Users/wanglin/工作_本地/trae/Casting_UI/.config/translation_progress.json', 'w', encoding='utf-8') as f:
    json.dump(clean_translations, f, ensure_ascii=False, indent=2)

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
        if t in clean_translations:
            tag_translations.append(clean_translations[t])
        else:
            tag_translations.append(t)
    row['tags_cn'] = '，'.join(tag_translations)

with open(csv_file, 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['name', 'path', 'type', 'type_en', 'tags', 'tags_cn'])
    writer.writeheader()
    writer.writerows(rows)

print(f"已清理翻译结果: {len(clean_translations)} 个条目")
print("示例清理结果:")
for tag, cn in list(clean_translations.items())[:10]:
    print(f"  {tag} → {cn}")

# 检查特殊字符翻译
print("\n特殊字符翻译示例:")
test_chars = ['ą', 'ł', 'é', 'ü', 'ñ']
for char in test_chars:
    if char in clean_translations:
        print(f"  {char} → {clean_translations[char]}")
    else:
        print(f"  {char} → 未找到")

# 检查NW翻译
if 'nw' in clean_translations:
    print(f"\nNW翻译: {clean_translations['nw']}")
else:
    print("\nNW翻译: 未找到")