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
## 개요

`MyRoomEditorEdittingInputDispatcher`는 편집 관련 입력 이벤트를 처리하는 클래스. 포인터 이벤트, 삭제, 취소 등 편집 명령 처리를 담당.

## 주요 역할

- **포인터 이벤트 처리**: 마우스 클릭/업 이벤트 중계
- **편집 명령 처리**: 취소, 삭제, 우클릭 이벤트 중계
- **이벤트 디스패칭**: 입력 컨트롤러로부터의 이벤트를 구독자에게 전달

## 주요 멤버

### 이벤트
```csharp
/// <summary>
/// 마우스 버튼이 눌렸을 때 발생
/// </summary>
public event Action OnPointerDownEvent;

/// <summary>
/// 마우스 버튼이 떼어졌을 때 발생
/// </summary>
public event Action OnPointerUpEvent;

/// <summary>
/// ESC 키 등 취소 입력 시 발생
/// </summary>
public event Action OnCancelEvent;

/// <summary>
/// 마우스 우클릭 시 발생
/// </summary>
public event Action OnRightClickEvent;

/// <summary>
/// Delete 키 등 삭제 입력 시 발생
/// </summary>
public event Action OnDeletePressEvent;
```

### 주요 메서드
```csharp
/// <summary>
/// 마우스 버튼이 눌렸음을 이벤트로 전달.
/// </summary>
public void OnPointerDown()

/// <summary>
/// 마우스 버튼이 떼어졌음을 이벤트로 전달.
/// </summary>
public void OnPointerUp()

/// <summary>
/// ESC 키 등 취소 입력을 이벤트로 전달.
/// </summary>
public void OnCanceled()

/// <summary>
/// 마우스 우클릭 입력을 이벤트로 전달.
/// </summary>
public void OnRightClicked()

/// <summary>
/// Delete 키 등 삭제 입력을 이벤트로 전달.
/// </summary>
public void OnDeletePressed()
```

## 코드 스니펫

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
1. [`MyRoomEditorInputController`](/docs/projects/rfice/housingsystem/myroomeditorinputcontroller/)에서 입력 감지
2. 해당 이벤트 메서드 호출
3. 등록된 이벤트 핸들러 실행

## 관련 클래스
- [`MyRoomEditorInputController`](/docs/projects/rfice/housingsystem/myroomeditorinputcontroller/): 이벤트 메서드 호출자
- [`MyRoomEditorState`](/docs/projects/rfice/housingsystem/myroomeditorstate/): 편집 입력 이벤트 리스너
