+++
title = "MyRoomEditorObjectEditUI"
description = "오브젝트 편집 메뉴를 표시하고 조작하는 UI 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 429
+++
#### **(본 문서는 AI로 작성된 프로토타입 문서입니다.)**
## 개요

`MyRoomEditorObjectEditUI`는 오브젝트 편집 메뉴를 표시하고 조작하는 UI 클래스입니다. 선택된 오브젝트의 이름 및 사용 가능한 편집 기능 표시하고 편집 기능(이동, 회전, 삭제, 색변경, 인터렉션) 등을 제어하는 버튼과 메뉴 관리합니다.

## 주요 역할

- **편집 메뉴 표시**: 선택된 오브젝트의 편집 옵션 표시
- **버튼 상태 관리**: 활성화/비활성화 상태 및 툴팁 표시
- **이벤트 처리**: 편집 액션에 대한 이벤트 발생
- **색상 선택 UI 연동**: 색상 변경 UI와의 상호작용

## 주요 메서드

```csharp
public void ShowSelectedPropMenu(IMyRoomEditorEditableObject selectedProp)
public void DrawColorList(List<MyRoomPropColor> colorList)
public void HideMenu()
```

선택된 오브젝트의 편집 가능 기능에 따라 UI 요소들을 동적으로 활성화/비활성화합니다.
