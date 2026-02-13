+++
title = "MyRoomEditorEditingInputDispatcher"
description = "편집 관련 입력 이벤트를 처리하는 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 412
+++
## 개요

`MyRoomEditorEditingInputDispatcher` 클래스는 MyRoom 에디터에서 편집 관련 입력 이벤트를 중앙에서 관리하고 배포하는 디스패처입니다. 포인터 클릭, 취소, 삭제 등의 편집 입력을 적절한 리스너들에게 전달합니다.

## 역할
- 편집 관련 입력 이벤트 처리
- 이벤트 구독 패턴을 통한 느슨한 결합 구현
- 포인터, 키보드 입력 상태 관리 및 이벤트 중계

## 선언
```csharp
public class MyRoomEditorEditingInputDispatcher
```

## 멤버
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

### 메서드
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

## 기능 설명

### 포인터 입력 이벤트
- `OnPointerDown()`: 마우스 왼쪽 버튼이나 터치 시작 시 이벤트 발생
- `OnPointerUp()`: 마우스 왼쪽 버튼이나 터치 종료 시 이벤트 발생
- `OnRightClicked()`: 마우스 우클릭 시 이벤트 발생

### 키보드 입력 이벤트
- `OnCanceled()`: ESC 키나 취소 입력 시 이벤트 발생
- `OnDeletePressed()`: Delete 키나 Backspace 키 입력 시 이벤트 발생

### 이벤트 구독 패턴
- Observer 패턴 구현으로 입력 처리와 비즈니스 로직 분리
- 다중 리스너 지원으로 확장성 제공

### 이벤트 흐름
1. [`MyRoomEditorInputController`](/docs/projects/rfice/housingsystem/myroomeditorinputcontroller/)에서 입력 감지
2. 해당 이벤트 메서드 호출
3. 등록된 이벤트 핸들러 실행

## 관련 클래스
- [`MyRoomEditorInputController`](/docs/projects/rfice/housingsystem/myroomeditorinputcontroller/)
- [`MyRoomEditorState`](/docs/projects/rfice/housingsystem/myroomeditorstate/)
- [`InputSystem`](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.17/manual/index.html)
