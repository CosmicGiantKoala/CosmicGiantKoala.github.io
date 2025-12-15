+++
title = "MyRoomEditorEdittingInputDispatcher"
description = "편집 관련 입력 이벤트를 처리하는 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 412
+++
#### **(본 문서는 AI로 작성된 프로토타입 문서입니다.)**
## 개요

`MyRoomEditorEdittingInputDispatcher`는 편집 관련 입력 이벤트를 처리하는 클래스입니다. 포인터 이벤트, 삭제, 취소 등 편집 명령 처리를 담당합니다.

## 주요 역할

- **포인터 이벤트 처리**: 마우스 클릭/업 이벤트 중계
- **편집 명령 처리**: 취소, 삭제, 우클릭 이벤트 중계
- **이벤트 디스패칭**: 입력 컨트롤러로부터의 이벤트를 구독자에게 전달

## 주요 멤버

### 이벤트
```csharp
public event Action OnPointerDownEvent;
public event Action OnPointerUpEvent;
public event Action OnCancelEvent;
public event Action OnRightClickEvent;
public event Action OnDeletePressEvent;
```

### 주요 메서드
```csharp
public void OnPointerDown()
public void OnPointerUp()
public void OnCanceled()
public void OnRightClicked()
public void OnDeletePressed()
```

## 코드 스니펫

### 전체 클래스 코드
```csharp
using System;
using UnityEngine;

namespace Dev.Scripts.Rsup.Presentation.Dispatchers
{
    public class MyRoomEditorEdittingInputDispatcher
    {
        public event Action OnPointerDownEvent;
        public event Action OnPointerUpEvent;
        public event Action OnCancelEvent;
        public event Action OnRightClickEvent;
        public event Action OnDeletePressEvent;
        
        public void OnPointerDown()
        {
            OnPointerDownEvent?.Invoke();
        }

        public void OnPointerUp()
        {
            OnPointerUpEvent?.Invoke();
        }

        public void OnCanceled()
        {
            OnCancelEvent?.Invoke();
        }

        public void OnRightClicked()
        {
            OnRightClickEvent?.Invoke();
        }

        public void OnDeletePressed()
        {
            OnDeletePressEvent?.Invoke();
        }

    }
}
```

### 이벤트 호출 메서드들
```csharp
public void OnPointerDown()
{
    OnPointerDownEvent?.Invoke();
}

public void OnPointerUp()
{
    OnPointerUpEvent?.Invoke();
}

public void OnCanceled()
{
    OnCancelEvent?.Invoke();
}

public void OnRightClicked()
{
    OnRightClickEvent?.Invoke();
}

public void OnDeletePressed()
{
    OnDeletePressEvent?.Invoke();
}
```

## 주요 기능 설명

### 이벤트 유형
- **OnPointerDownEvent**: 마우스 버튼 눌림
- **OnPointerUpEvent**: 마우스 버튼 뗌
- **OnCancelEvent**: 취소 명령 (ESC 키)
- **OnRightClickEvent**: 우클릭
- **OnDeletePressEvent**: 삭제 명령 (Delete 키)

### 이벤트 흐름
1. `MyRoomEditorInputController`에서 입력 감지
2. 해당 이벤트 메서드 호출
3. 등록된 이벤트 핸들러 실행

## 의존성

- **InputController**: `MyRoomEditorInputController`에서 이벤트 호출
- **State Managers**: `MyRoomEditorState` 서브클래스들이 이벤트 구독

## 관련 클래스

- **호출자**: `MyRoomEditorInputController`
- **구독자**: `MyRoomEditorState`, `MyRoomEditorPropEditingManager` 등
