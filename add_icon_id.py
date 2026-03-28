#!/usr/bin/env python3
import os
import re

def add_icon_id_to_svg():
    """给所有 icon 的 SVG 文件增加 id="icon" 属性"""
    icon_dirs = [
        'dev/icons/filled',
        'dev/icons/outline'
    ]
    
    for directory in icon_dirs:
        if os.path.exists(directory):
            print(f'Processing directory: {directory}')
            for filename in os.listdir(directory):
                if filename.endswith('.svg'):
                    file_path = os.path.join(directory, filename)
                    print(f'Processing file: {filename}')
                    
                    # 读取文件内容
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # 在根 <svg> 标签中添加 id="icon"
                    # 匹配 <svg 开头的标签，确保不重复添加 id
                    if '<svg' in content and 'id="icon"' not in content:
                        # 使用正则表达式在 <svg 标签中添加 id="icon"
                        modified_content = re.sub(
                            r'(<svg[^>]+)',
                            r'\1 id="icon"',
                            content
                        )
                        
                        # 保存修改后的内容
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(modified_content)
                        print(f'Added id="icon" to {filename}')
                    else:
                        print(f'Skipping {filename} (already has id="icon" or no <svg> tag)')

if __name__ == '__main__':
    add_icon_id_to_svg()
