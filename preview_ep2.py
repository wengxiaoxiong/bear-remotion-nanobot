import os
import re

# Find the actual file
for f in os.listdir('.'):
    if 'ep2' in f.lower() and f.endswith('.md'):
        print('Found file:', f)
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        
        html = content
        # Escape HTML
        html = html.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
        
        # Headers
        html = re.sub(r'^###### (.*)$', r'<h6>\1</h6>', html, flags=re.MULTILINE)
        html = re.sub(r'^##### (.*)$', r'<h5>\1</h5>', html, flags=re.MULTILINE)
        html = re.sub(r'^#### (.*)$', r'<h4>\1</h4>', html, flags=re.MULTILINE)
        html = re.sub(r'^### (.*)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)
        html = re.sub(r'^## (.*)$', r'<h2>\1</h2>', html, flags=re.MULTILINE)
        html = re.sub(r'^# (.*)$', r'<h1>\1</h1>', html, flags=re.MULTILINE)
        
        # Bold and italic
        html = re.sub(r'\*\*\*(.*?)\*\*\*', r'<strong><em>\1</em></strong>', html)
        html = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', html)
        html = re.sub(r'\*(.*?)\*', r'<em>\1</em>', html)
        
        # Code blocks
        html = re.sub(r'```(.*?)```', r'<pre><code>\1</code></pre>', html, flags=re.DOTALL)
        html = re.sub(r'`(.*?)`', r'<code>\1</code>', html)
        
        # Tables
        lines = html.split('\n')
        in_table = False
        new_lines = []
        table_rows = []
        for line in lines:
            if '|' in line and not in_table:
                in_table = True
                table_rows = [line]
            elif '|' in line and in_table:
                table_rows.append(line)
            elif in_table:
                filtered = [r for r in table_rows if not re.match(r'^\s*\|[-\s:|]+\|\s*$', r)]
                if filtered:
                    table_html = '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;">'
                    for i, row in enumerate(filtered):
                        cells = [c.strip() for c in row.split('|')]
                        cells = [c for c in cells if c]
                        tag = 'th' if i == 0 else 'td'
                        table_html += '<tr>' + ''.join([f'<{tag}>{c}</{tag}>' for c in cells]) + '</tr>'
                    table_html += '</table>'
                    new_lines.append(table_html)
                table_rows = []
                in_table = False
                new_lines.append(line)
            else:
                new_lines.append(line)
        if in_table:
            filtered = [r for r in table_rows if not re.match(r'^\s*\|[-\s:|]+\|\s*$', r)]
            if filtered:
                table_html = '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;">'
                for i, row in enumerate(filtered):
                    cells = [c.strip() for c in row.split('|')]
                    cells = [c for c in cells if c]
                    tag = 'th' if i == 0 else 'td'
                    table_html += '<tr>' + ''.join([f'<{tag}>{c}</{tag}>' for c in cells]) + '</tr>'
                table_html += '</table>'
                new_lines.append(table_html)
        html = '\n'.join(new_lines)
        
        # Blockquotes
        html = re.sub(r'^&gt; (.*)$', r'<blockquote>\1</blockquote>', html, flags=re.MULTILINE)
        
        # Horizontal rules
        html = re.sub(r'^---+$', r'<hr>', html, flags=re.MULTILINE)
        
        # Paragraphs
        paragraphs = html.split('\n\n')
        new_paragraphs = []
        for p in paragraphs:
            p = p.strip()
            if not p:
                continue
            if p.startswith('<h') or p.startswith('<table') or p.startswith('<pre') or p.startswith('<blockquote') or p.startswith('<hr'):
                new_paragraphs.append(p)
            else:
                p = p.replace('\n', '<br>')
                new_paragraphs.append(f'<p>{p}</p>')
        html = '\n\n'.join(new_paragraphs)
        
        full_html = f'''<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>EP2 分镜表预览</title>
<style>
body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; max-width: 1200px; margin: 40px auto; padding: 20px; line-height: 1.6; color: #333; background: #fafafa; }}
h1 {{ color: #1a1a1a; border-bottom: 3px solid #333; padding-bottom: 10px; }}
h2 {{ color: #2a2a2a; border-bottom: 2px solid #666; padding-bottom: 8px; margin-top: 40px; }}
h3 {{ color: #444; margin-top: 30px; }}
h4 {{ color: #555; }}
table {{ background: white; font-size: 14px; }}
th {{ background: #333; color: white; text-align: left; }}
td {{ background: white; vertical-align: top; }}
tr:nth-child(even) td {{ background: #f5f5f5; }}
pre {{ background: #2d2d2d; color: #f8f8f2; padding: 16px; border-radius: 8px; overflow-x: auto; }}
code {{ background: #f0f0f0; padding: 2px 6px; border-radius: 4px; font-family: Consolas, monospace; }}
pre code {{ background: transparent; padding: 0; }}
blockquote {{ border-left: 4px solid #333; margin: 0; padding-left: 16px; color: #666; }}
strong {{ color: #1a1a1a; }}
</style>
</head>
<body>
{html}
</body>
</html>'''
        
        out_path = 'ep2_preview.html'
        with open(out_path, 'w', encoding='utf-8') as out:
            out.write(full_html)
        print(f'HTML preview created: {os.path.abspath(out_path)}')
        break
