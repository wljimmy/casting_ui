#!/usr/bin/env python3
import json

# 读取图标数据
json_file = '/Users/wanglin/工作_本地/trae/Casting_UI/public/manual/data-display/icon-search/icons_data.json'
with open(json_file, 'r', encoding='utf-8') as f:
    icon_data = json.load(f)

# 读取HTML模板
html_file = '/Users/wanglin/工作_本地/trae/Casting_UI/public/manual/data-display/icon-search/index.html'
with open(html_file, 'r', encoding='utf-8') as f:
    html_content = f.read()

# 替换图标数据
icon_data_str = json.dumps(icon_data, ensure_ascii=False, indent=2)
updated_html = html_content.replace('const iconData = [\n            // 这里将内嵌所有图标数据\n        ];', f'const iconData = {icon_data_str};')

# 移除fetch加载代码
updated_html = updated_html.replace('''            // 加载图标数据
            fetch('/manual/data-display/icon-search/icons_data.json')
                .then(response => response.json())
                .then(data => {
                    iconData.length = 0;
                    iconData.push(...data);
                    filteredIcons = [...iconData];
                    renderIcons();
                    updatePagination();
                })
                .catch(error => {
                    console.error('加载图标数据失败:', error);
                    document.getElementById('search-info').textContent = '加载图标数据失败';
                });''', '''            // 图标数据已内嵌
            filteredIcons = [...iconData];
            renderIcons();
            updatePagination();''')

# 保存更新后的HTML
with open(html_file, 'w', encoding='utf-8') as f:
    f.write(updated_html)

print(f"已将图标数据内嵌到HTML页面: {html_file}")
print(f"内嵌图标数据数量: {len(icon_data)}")