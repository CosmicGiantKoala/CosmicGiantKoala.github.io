# 포트폴리오 MD 작성규칙

## 규칙

### 1. 파일 생성
- MD 리스트의 첫줄을 파일명으로 사용하여 루트 폴더에 MD 파일을 생성한다.

### 2. 내용 참조
- MD 리스트의 모든 패스를 확인한다.
- 해당 패스를 참고하여 `content/docs/` 폴더에서 대응하는 MD 파일을 찾아 내용을 참조한다.
- frontmatter는 제외하고 본문 내용만 포함한다.

### 3. 링크 추가
- 실제 GitHub Pages 주소를 앞에 추가한다.
- 주소 형식: `https://cosmicgiantkoala.github.io` + 패스

## 예시

### Personal.md
- MD 리스트 첫줄: `Personal.md`
- 첫번째 패스: `/docs/personal/info/introduce/`
- 생성 파일: `Personal.md` (루트 폴더)
- 참조 파일: `content/docs/Personal/Info/Introduce.md`
- 링크: `https://cosmicgiantkoala.github.io/docs/personal/info/introduce/`