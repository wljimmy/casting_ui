// MD Module - 极简MD富文本输入与渲染模块
// 版本: 1.0.0

// Store editors
const editors = new Map();

/**
 * MD解析器: 将Markdown转换为HTML
 * @param {string} md - Markdown字符串
 * @returns {string} HTML字符串
 */
function mdParse(md) {
  if (!md) return '';

  // 标题
  md = md.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, text) => {
    const level = hashes.length;
    return `<h${level}>${text}</h${level}>`;
  });

  // 粗体
  md = md.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  md = md.replace(/__(.*?)__/g, '<strong>$1</strong>');

  // 斜体
  md = md.replace(/\*(.*?)\*/g, '<em>$1</em>');
  md = md.replace(/_(.*?)_/g, '<em>$1</em>');

  // 内联代码
  md = md.replace(/`(.*?)`/g, '<code>$1</code>');

  // 无序列表 (支持 * 和 -)
  md = md.replace(/^\s*[\*\-]\s+(.+)$/gm, '<li>$1</li>');
  
  // 有序列表 - 保持原始格式，不添加ol标签
  md = md.replace(/^\s*\d+\.\s+(.+)$/gm, '<li>$1</li>');
  
  // 处理所有列表，不重复处理
  md = md.replace(/(<li[\s\S]*?<\/li>)/gs, (match) => {
    if (!match.includes('<ul>')) {
      return `<ul>${match}</ul>`;
    }
    return match;
  });

  // 段落
  md = md.replace(/^(?!<h[1-6]|.*<\/ul>|.*<\/ol>|.*<li>).+$/gm, '<p>$&</p>');

  return md;
}

/**
 * HTML转MD: 将HTML转换回Markdown格式
 * @param {string} html - HTML字符串
 * @returns {string} Markdown字符串
 */
function htmlToMd(html) {
  if (!html) return '';

  return html
    .replace(/<h1>(.*?)<\/h1>/g, '# $1\n\n')
    .replace(/<h2>(.*?)<\/h2>/g, '## $1\n\n')
    .replace(/<h3>(.*?)<\/h3>/g, '### $1\n\n')
    .replace(/<h4>(.*?)<\/h4>/g, '#### $1\n\n')
    .replace(/<h5>(.*?)<\/h5>/g, '##### $1\n\n')
    .replace(/<h6>(.*?)<\/h6>/g, '###### $1\n\n')
    .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
    .replace(/<em>(.*?)<\/em>/g, '*$1*')
    .replace(/<code>(.*?)<\/code>/g, '`$1`')
    .replace(/<ul>(.*?)<\/ul>/gs, (match, content) => {
      return content.replace(/<li>([\s\S]*?)<\/li>/g, '* $1\n') + '\n';
    })
    .replace(/<p>(.*?)<\/p>/g, '$1\n\n')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]+>/g, '') // 清理所有剩余标签
    .trim();
}

/**
 * 检查元素是否为块级元素
 * @param {HTMLElement} element - 要检查的元素
 * @returns {boolean} 是否为块级元素
 */
function isBlockElement(element) {
  const blockElements = ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'pre', 'section', 'article'];
  return blockElements.includes(element.tagName.toLowerCase());
}

/**
 * 处理编辑器的回车和Shift+回车事件
 * @param {HTMLElement} editableDiv - 编辑器元素
 * @param {KeyboardEvent} e - 键盘事件
 */
function handleEnterKey(editableDiv, e) {
  const sel = window.getSelection();
  const range = sel.getRangeAt(0);
  
  // 获取当前光标所在的元素
  let currentElement = range.commonAncestorContainer;
  if (currentElement.nodeType === Node.TEXT_NODE) {
    currentElement = currentElement.parentElement;
  }
  
  if (e.shiftKey) {
    // Shift+Enter: 标签内换行
    e.preventDefault();
    
    // 在当前位置插入换行
    const br = document.createElement('br');
    range.insertNode(br);
    
    // 将光标移到换行符后面
    range.setStartAfter(br);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  } else {
    // Enter: 新增一个同类标签（默认为P标签）
    e.preventDefault();
    
    // 确定新标签的类型
    let newTag = 'p';
    if (isBlockElement(currentElement)) {
      // 如果当前元素是块级元素，使用相同类型
      newTag = currentElement.tagName.toLowerCase();
    }
    
    // 创建新元素
    const newElement = document.createElement(newTag);
    
    // 插入新元素
    if (currentElement.nextSibling) {
      currentElement.parentNode.insertBefore(newElement, currentElement.nextSibling);
    } else {
      currentElement.parentNode.appendChild(newElement);
    }
    
    // 将光标移到新元素内
    range.setStart(newElement, 0);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }
  
  // 清理DOM碎片
  editableDiv.normalize();
}

/**
 * 创建MD编辑器
 * @param {string} containerId - 容器元素ID
 * @param {Object} options - 编辑器选项
 * @returns {Object} 编辑器实例
 */
function mdInput(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return null;

  // 创建编辑器结构
  const editor = document.createElement('div');
  editor.className = 'md-editor';

  // 工具栏
  const toolbar = document.createElement('div');
  toolbar.className = 'md-toolbar';

  const buttons = [
    { icon: 'H1', title: '标题 1', tag: 'h1' },
    { icon: 'H2', title: '标题 2', tag: 'h2' },
    { icon: 'B', title: '粗体', tag: 'strong' },
    { icon: 'I', title: '斜体', tag: 'em' },
    { icon: '`', title: '代码', tag: 'code' },
    { icon: '•', title: '列表', tag: 'ul' },
    { icon: 'P', title: '段落', tag: 'p' },
  ];

  buttons.forEach(btn => {
    const button = document.createElement('button');
    button.className = 'md-toolbar-btn';
    button.textContent = btn.icon;
    button.title = btn.title;
    button.addEventListener('click', () => format(btn.tag, editableDiv));
    toolbar.appendChild(button);
  });

  // 创建contenteditable div用于所见即所得编辑
  const editableDiv = document.createElement('div');
  editableDiv.className = 'md-editable';
  editableDiv.contentEditable = true;
  
  // 添加键盘事件处理
  editableDiv.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleEnterKey(editableDiv, e);
    }
  });
  
  // 设置初始内容
  if (options.initialValue) {
    editableDiv.innerHTML = mdParse(options.initialValue);
  } else {
    editableDiv.innerHTML = '<p>在此处编写内容...</p>';
  }

  // 组装编辑器
  editor.appendChild(toolbar);
  editor.appendChild(editableDiv);
  container.appendChild(editor);

  // 存储编辑器实例
  const editorInstance = {
    element: editor,
    editableDiv: editableDiv,
    getValue: () => htmlToMd(editableDiv.innerHTML),
    setValue: (value) => {
      editableDiv.innerHTML = mdParse(value);
    },
    destroy: () => {
      if (editor.parentNode) {
        editor.parentNode.removeChild(editor);
      }
      editors.delete(containerId);
    }
  };

  editors.set(containerId, editorInstance);
  return editorInstance;
}

/**
 * 可视化格式化 - 用户点击按钮执行，无标签错乱
 * @param {string} tag - HTML标签名
 * @param {HTMLElement} el - 编辑器元素
 */
function format(tag, el) {
  // 获取选中文字
  const sel = window.getSelection();
  const text = sel.toString().trim();
  
  // 如果有选中文字，对选中文字进行操作
  if (text) {
    // 检查选中内容是否已经使用了目标标签
    let currentTag = null;
    const range = sel.getRangeAt(0);
    let commonAncestor = range.commonAncestorContainer;
    
    // 如果是文本节点，获取其父元素
    if (commonAncestor.nodeType === Node.TEXT_NODE) {
      commonAncestor = commonAncestor.parentElement;
    }
    
    // 检查是否在目标标签内
    if (commonAncestor.tagName && commonAncestor.tagName.toLowerCase() === tag) {
      currentTag = tag;
    }
    
    // 创建新元素
    let newElement;
    if (currentTag === tag) {
      // 如果已经是目标标签，取消格式，使用p标签
      newElement = document.createElement('p');
      newElement.textContent = text;
    } else {
      // 创建目标标签
      switch(tag) {
        case 'h1': newElement = document.createElement('h1'); newElement.textContent = text; break;
        case 'h2': newElement = document.createElement('h2'); newElement.textContent = text; break;
        case 'h3': newElement = document.createElement('h3'); newElement.textContent = text; break;
        case 'h4': newElement = document.createElement('h4'); newElement.textContent = text; break;
        case 'h5': newElement = document.createElement('h5'); newElement.textContent = text; break;
        case 'h6': newElement = document.createElement('h6'); newElement.textContent = text; break;
        case 'strong': newElement = document.createElement('strong'); newElement.textContent = text; break;
        case 'em': newElement = document.createElement('em'); newElement.textContent = text; break;
        case 'code': newElement = document.createElement('code'); newElement.textContent = text; break;
        case 'ul': 
        case 'ol': 
          newElement = document.createElement('ul');
          const li = document.createElement('li');
          li.textContent = text;
          newElement.appendChild(li);
          break;
        case 'p':
          newElement = document.createElement('p');
          newElement.textContent = text;
          break;
      }
    }

    // 替换选中内容
    range.deleteContents();
    range.insertNode(newElement);
    
    // 设置光标位置到新元素的末尾
    range.setStartAfter(newElement);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    
    el.normalize(); // 合并文本，清理DOM碎片
  } else {
    // 如果没有选中文字，对当前光标所在元素进行操作
    const range = sel.getRangeAt(0);
    let currentElement = range.commonAncestorContainer;
    
    // 如果当前节点是文本节点，获取其父元素
    if (currentElement.nodeType === Node.TEXT_NODE) {
      currentElement = currentElement.parentElement;
    }
    
    // 获取当前元素的文本内容
    const elementText = currentElement.textContent || '';
    
    // 保存光标位置
    let cursorOffset = 0;
    if (range.startContainer.nodeType === Node.TEXT_NODE) {
      cursorOffset = range.startOffset;
    }
    
    // 检查当前元素是否已经是目标标签
    const currentTag = currentElement.tagName ? currentElement.tagName.toLowerCase() : null;
    let newElement;
    
    if (currentTag === tag) {
      // 如果已经是目标标签，取消格式，使用p标签
      newElement = document.createElement('p');
      newElement.textContent = elementText || '段落文本';
    } else {
      // 创建目标标签
      switch(tag) {
        case 'h1': newElement = document.createElement('h1'); newElement.textContent = elementText; break;
        case 'h2': newElement = document.createElement('h2'); newElement.textContent = elementText; break;
        case 'h3': newElement = document.createElement('h3'); newElement.textContent = elementText; break;
        case 'h4': newElement = document.createElement('h4'); newElement.textContent = elementText; break;
        case 'h5': newElement = document.createElement('h5'); newElement.textContent = elementText; break;
        case 'h6': newElement = document.createElement('h6'); newElement.textContent = elementText; break;
        case 'strong': newElement = document.createElement('strong'); newElement.textContent = elementText; break;
        case 'em': newElement = document.createElement('em'); newElement.textContent = elementText; break;
        case 'code': newElement = document.createElement('code'); newElement.textContent = elementText; break;
        case 'ul': 
        case 'ol': 
          newElement = document.createElement('ul');
          const li = document.createElement('li');
          li.textContent = elementText || '列表项';
          newElement.appendChild(li);
          break;
        case 'p':
          newElement = document.createElement('p');
          newElement.textContent = elementText || '段落文本';
          break;
      }
    }
    
    // 替换当前元素
    if (currentElement !== el && currentElement.parentNode) {
      currentElement.parentNode.replaceChild(newElement, currentElement);
      
      // 恢复光标位置
      if (tag === 'ul' || tag === 'ol' && currentTag !== tag) {
        // 对于列表，光标应该在li元素内
        const liElement = newElement.querySelector('li');
        if (liElement) {
          const newRange = document.createRange();
          // 确保光标位置不超过文本长度
          const textNode = liElement.firstChild;
          if (textNode && textNode.nodeType === Node.TEXT_NODE) {
            const offset = Math.min(cursorOffset, textNode.textContent.length);
            newRange.setStart(textNode, offset);
          } else {
            newRange.setStart(liElement, 0);
          }
          newRange.collapse(true);
          sel.removeAllRanges();
          sel.addRange(newRange);
        }
      } else {
        // 对于其他元素，直接设置光标位置
        const newRange = document.createRange();
        const textNode = newElement.firstChild;
        if (textNode && textNode.nodeType === Node.TEXT_NODE) {
          // 确保光标位置不超过文本长度
          const offset = Math.min(cursorOffset, textNode.textContent.length);
          newRange.setStart(textNode, offset);
        } else {
          newRange.setStart(newElement, 0);
        }
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);
      }
      
      el.normalize(); // 合并文本，清理DOM碎片
    }
  }
  
  // 聚焦回编辑器
  el.focus();
}

/**
 * 销毁所有编辑器
 */
function destroyAllEditors() {
  editors.forEach(editor => {
    editor.destroy();
  });
  editors.clear();
}

/**
 * 解析MD并显示在输出div中
 */
function parseMD() {
  const md = document.getElementById('md-input').value;
  const html = mdParse(md);
  document.getElementById('html-output').innerHTML = html;
}

/**
 * 自动初始化标记的编辑器区域
 * 查找所有带有 data-md-editor 属性的元素并自动初始化
 */
function autoInitEditors() {
  const editorContainers = document.querySelectorAll('[data-md-editor]');
  
  editorContainers.forEach(container => {
    const containerId = container.id;
    if (!containerId || editors.has(containerId)) return;
    
    // 获取初始值
    const initialValue = container.getAttribute('data-md-initial') || '';
    
    // 初始化编辑器
    mdInput(containerId, { initialValue });
    
    // 标记为已初始化
    container.removeAttribute('data-md-editor');
    container.setAttribute('data-md-initialized', 'true');
  });
}

/**
 * 监听DOM变化，自动初始化新增的编辑器
 */
function observeNewEditors() {
  // 创建MutationObserver实例
  const observer = new MutationObserver((mutations) => {
    let shouldInit = false;
    
    mutations.forEach((mutation) => {
      // 检查新增的节点
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // 检查新增节点本身是否是编辑器容器
          if (node.hasAttribute && node.hasAttribute('data-md-editor')) {
            shouldInit = true;
          }
          // 检查新增节点内部是否包含编辑器容器
          if (node.querySelector && node.querySelector('[data-md-editor]')) {
            shouldInit = true;
          }
        }
      });
    });
    
    // 如果有新增的编辑器容器，执行初始化
    if (shouldInit) {
      autoInitEditors();
    }
  });
  
  // 开始监听document.body的变化
  observer.observe(document.body, {
    childList: true,  // 监听子节点的增删
    subtree: true     // 监听所有后代节点
  });
  
  return observer;
}

// DOM加载完成后自动初始化已有的编辑器并开始监听
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    autoInitEditors();
    observeNewEditors();
  });
} else {
  // DOM已经加载完成
  autoInitEditors();
  observeNewEditors();
}
