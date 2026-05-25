import os
import re
import glob

def read_md_file(path):
    """MD 파일 읽기 - frontmatter 제외하고 본문만 반환"""
    try:
        with open(path, 'r', encoding='utf-8-sig') as f:
            content = f.read()
        
        # frontmatter 제거 (+++ 로 감싸진 부분)
        content = re.sub(r'^\+\+\+.*?\+\+\+', '', content, flags=re.DOTALL)
        return content.strip()
    except Exception as e:
        return f"Error reading {path}: {e}"

def path_to_file_path(path):
    """URL 패스를 실제 파일 경로로 변환"""
    # /docs/ 제거
    path = path.replace('/docs/', '')
    # 마지막 / 제거
    if path.endswith('/'):
        path = path[:-1]
    
    # 각 부분을 대문자로 변환
    parts = path.split('/')
    for i in range(len(parts)):
        # 첫글자 대문자
        parts[i] = parts[i].capitalize()
    
    # 파일 경로 생성
    file_path = os.path.join('content', 'docs', *parts) + '.md'
    return file_path

def generate_merged_md():
    """통합 MD 파일 생성"""
    # MD 리스트 파일 읽기
    with open('rule/포트폴리오 MD 리스트.md', 'r', encoding='utf-8-sig') as f:
        lines = f.readlines()
    
    # UTF-8 BOM 제거
    import codecs
    if lines and lines[0].startswith(codecs.BOM_UTF8.decode('utf-8')):
        lines[0] = lines[0][1:]
    
    current_file = None
    current_content = ""
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # 새로운 파일 시작
        if line.endswith('.md'):
            if current_file:
                # 이전 파일 저장
                with open(current_file, 'w', encoding='utf-8') as f:
                    f.write(current_content)
                print(f"Generated {current_file}")
            
            current_file = line
            current_content = ""
            print(f"Processing {current_file}...")
            continue
        
        # 패스 라인 처리
        if line.startswith('-'):
            # 패스 추출
            path = line.replace('-', '').strip().strip('`').strip("'")
            file_path = path_to_file_path(path)
            
            print(f"  Adding {path} -> {file_path}")
            
            if os.path.exists(file_path):
                content = read_md_file(file_path)
                current_content += content + "\n\n---\n\n"
                current_content += f"[GitHub Pages 링크: https://cosmicgiantkoala.github.io{path}]\n\n---\n\n"
            else:
                current_content += f"## 파일 없음: {path}\n\n"
                current_content += f"[GitHub Pages 링크: https://cosmicgiantkoala.github.io{path}]\n\n---\n\n"
    
    # 마지막 파일 저장
    if current_file:
        with open(current_file, 'w', encoding='utf-8') as f:
            f.write(current_content)
        print(f"Generated {current_file}")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    generate_merged_md()
    print("All merged MD files generated successfully!")