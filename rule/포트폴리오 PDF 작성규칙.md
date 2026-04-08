# 포트폴리오 PDF 작성 규칙

포트폴리오 문서를 PDF로 변환할 때 적용할 규칙을 정리합니다.

---

## 0. 핵심 원칙

PDF는 **포트폴리오 문서의 완성본**으로, 사용자가 쉽게 읽을 수 있고 프린트 가능해야 합니다.

---

## 1. PDF 생성 방법

### 1.1 Hugo 사이트 빌드

```bash
hugo --destination public
```

### 1.2 로컬 서버 실행

```bash
hugo server --bind 0.0.0.0 --port 1313 --noHTTPCache --watch=false
```

### 1.3 Puppeteer로 PDF 생성

```javascript
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// PDF 리스트 파일 읽기
const pdfListPath = path.join(__dirname, 'rule', '포트폴리오 PDF 리스트.md');
const pdfListContent = fs.readFileSync(pdfListPath, 'utf-8');

// 카테고리별 페이지 정보 파싱
const categories = [];
const lines = pdfListContent.split('\n');
let currentCategory = null;

for (const line of lines) {
    const trimmedLine = line.trim();
    
    // 카테고리명 추출 (.pdf로 끝나는 line)
    if (trimmedLine.endsWith('.pdf')) {
        if (currentCategory) {
            categories.push(currentCategory);
        }
        currentCategory = {
            name: trimmedLine.replace('.pdf', ''),
            pages: []
        };
    } 
    // 페이지 경로 추출 (-로 시작하는 line)
    else if (trimmedLine.startsWith('-')) {
        const pagePath = trimmedLine.substring(1).trim();
        if (pagePath && currentCategory) {
            currentCategory.pages.push(pagePath);
        }
    }
}

// 마지막 카테고리 추가
if (currentCategory) {
    categories.push(currentCategory);
}

async function generatePDF() {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // 각 카테고리별 PDF 생성
    for (const category of categories) {
        console.log(`Generating PDF for category: ${category.name}`);

        // 카테고리 폴더 생성
        const categoryDir = path.join(__dirname, `pdfs`, category.name);
        if (!fs.existsSync(categoryDir)) {
            fs.mkdirSync(categoryDir, { recursive: true });
        }

        // 각 페이지를 PDF로 생성
        for (let i = 0; i < category.pages.length; i++) {
            const pagePath = category.pages[i];
            const url = `http://localhost:1313${pagePath}`;
            
            console.log(`Generating PDF for page ${i + 1}: ${url}`);

            await page.goto(url, {
                waitUntil: 'networkidle2',
                timeout: 60000
            });

            // 내부링크의 localhost를 cosmicgiantkoala.github.io로 변경
            await page.evaluate(() => {
                const anchorElements = document.querySelectorAll('a');
                anchorElements.forEach(anchor => {
                    if (anchor.href.startsWith('http://localhost:1313')) {
                        anchor.href = anchor.href.replace('http://localhost:1313', 'https://cosmicgiantkoala.github.io');
                    }
                });

                // 이미지 태그에 클릭 이벤트 추가 (github pages 링크로)
                const imgElements = document.querySelectorAll('img');
                imgElements.forEach(img => {
                    if (img.src.startsWith('http://localhost:1313')) {
                        const githubSrc = img.src.replace('http://localhost:1313', 'https://cosmicgiantkoala.github.io');
                        img.style.cursor = 'pointer';
                        img.addEventListener('click', () => {
                            window.open(githubSrc, '_blank');
                        });
                    }
                });

                // 비디오 태그에 클릭 이벤트 추가 (github pages 링크로)
                const videoElements = document.querySelectorAll('video');
                videoElements.forEach(video => {
                    const sourceElements = video.querySelectorAll('source');
                    sourceElements.forEach(source => {
                        if (source.src.startsWith('http://localhost:1313')) {
                            const githubSrc = source.src.replace('http://localhost:1313', 'https://cosmicgiantkoala.github.io');
                            video.style.cursor = 'pointer';
                            video.addEventListener('click', () => {
                                window.open(githubSrc, '_blank');
                            });
                        }
                    });
                });
            });

            const filename = path.basename(pagePath) || `page${i + 1}`;
            const pdfPath = path.join(categoryDir, `${filename}.pdf`);

            await page.pdf({
                path: pdfPath,
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '10mm',
                    right: '10mm',
                    bottom: '10mm',
                    left: '10mm'
                }
            });
        }
    }

    await browser.close();
    console.log('All PDFs generated successfully');
}

generatePDF().catch(error => {
    console.error('Error generating PDF:', error);
    process.exit(1);
});
```

### 1.4 PDF 병합

```javascript
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

// PDF 리스트 파일 읽기
const pdfListPath = path.join(__dirname, 'rule', '포트폴리오 PDF 리스트.md');
const pdfListContent = fs.readFileSync(pdfListPath, 'utf-8');

// 카테고리별 페이지 정보 파싱
const categories = [];
const lines = pdfListContent.split('\n');
let currentCategory = null;

for (const line of lines) {
    const trimmedLine = line.trim();
    
    // 카테고리명 추출 (.pdf로 끝나는 line)
    if (trimmedLine.endsWith('.pdf')) {
        if (currentCategory) {
            categories.push(currentCategory);
        }
        currentCategory = {
            name: trimmedLine.replace('.pdf', ''),
            pages: []
        };
    } 
    // 페이지 경로 추출 (-로 시작하는 line)
    else if (trimmedLine.startsWith('-')) {
        const pagePath = trimmedLine.substring(1).trim();
        if (pagePath && currentCategory) {
            currentCategory.pages.push(pagePath);
        }
    }
}

// 마지막 카테고리 추가
if (currentCategory) {
    categories.push(currentCategory);
}

async function mergePDFs() {
    // 각 카테고리별 PDF 병합
    for (const category of categories) {
        const categoryDir = path.join(__dirname, `pdfs`, category.name);
        const outputPath = path.join(__dirname, `${category.name}.pdf`);

        // 카테고리 폴더에 있는 모든 PDF 파일 가져오기
        const pdfFiles = category.pages.map(pagePath => {
            const filename = path.basename(pagePath) || `page${category.pages.indexOf(pagePath) + 1}`;
            return path.join(categoryDir, `${filename}.pdf`);
        }).filter(fs.existsSync);

        console.log(`Found ${pdfFiles.length} PDF files to merge for category: ${category.name}`);

        // 새로운 PDF 문서 생성
        const mergedPdf = await PDFDocument.create();

        // 각 PDF 파일을 병합
        for (let i = 0; i < pdfFiles.length; i++) {
            const pdfPath = pdfFiles[i];
            console.log(`Merging file ${i + 1}: ${path.basename(pdfPath)}`);

            const pdfBytes = fs.readFileSync(pdfPath);
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
            copiedPages.forEach(page => mergedPdf.addPage(page));
        }

        // 병합된 PDF 저장
        const mergedPdfBytes = await mergedPdf.save();
        fs.writeFileSync(outputPath, mergedPdfBytes);

        console.log(`PDFs merged successfully for category ${category.name}: ${outputPath}`);
    }
}

mergePDFs().catch(error => {
    console.error('Error merging PDFs:', error);
    process.exit(1);
});
```

---

## 2. PDF 스타일 규칙

### 2.1 페이지 설정

- **포맷**: A4
- **여백**: 상하좌우 10mm
- **배경**: 흰색
- **글자색**: 검은색

### 2.2 폰트

- **본문**: 12pt
- **제목**: 18pt
- **소제목**: 14pt

### 2.3 페이지 구조

- **머리말**: 문서 제목
- **꼬리말**: 페이지 번호
- **목차**: 각 페이지마다 있는 경우

---

## 3. PDF 검증 규칙

### 3.1 내용 확인

- [ ] 모든 문서가 포함되어 있는가?
- [ ] 이미지가 정상적으로 렌더링되어 있는가?
- [ ] 링크가 정상적으로 작동하는가?
- [ ] 코드 스니펫이 정상적으로 표시되어 있는가?

### 3.2 스타일 확인

- [ ] 페이지 여백이 적절한가?
- [ ] 폰트 크기가 일관적인가?
- [ ] 제목과 본문이 구분되어 있는가?

### 3.3 프린트 가능성 확인

- [ ] 흑백 프린트 가능한가?
- [ ] 페이지 넘김이 적절한가?
- [ ] 이미지가 프린트 될 수 있는 가로 세로비인가?

---

## 4. 작업 순서

1. **Hugo 사이트 빌드**: `hugo --destination public`
2. **로컬 서버 실행**: `hugo server --bind 0.0.0.0 --port 1313 --noHTTPCache --watch=false`
3. **PDF 생성**: `node generate-pdf.js`
4. **PDF 병합**: `node merge-pdfs.js`
5. **PDF 검증**: 생성된 PDF를 열어 내용과 스타일 확인

---

## 5. 유의점

- **로컬 서버 실행 중에만 PDF 생성**: 로컬 서버를 종료하면 PDF 생성이 불가능합니다.
- **PDF 생성 전에 사이트 빌드**: 사이트를 수정한 경우 다시 빌드해야 합니다.
- **PDF 병합 전에 모든 페이지 생성**: 모든 페이지가 생성된 후 병합해야 합니다.
- **PDF 검증 필수**: 생성된 PDF를 열어 내용과 스타일을 확인해야 합니다.
- **내부링크 변경**: localhost 링크는 cosmicgiantkoala.github.io로 변경해야 합니다.
- **이미지/영상 클릭**: PDF 내 이미지나 영상을 클릭하면 github pages 링크로 이동됩니다.