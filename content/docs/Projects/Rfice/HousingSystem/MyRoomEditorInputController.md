+++
title = "MyRoomEditorInputController"
description = "InputAction를 통해 발생하는 입력 이벤트를 각각의 Dispatcher로 전달하는 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 410
+++

## 개요

`MyRoomEditorInputController`는 `InputAction`을 통해 발생하는 입력 이벤트를 각각의 `Dispatcher`로 전달하는 클래스. 시스템 활성화 상태 기반 `InputAction` 토글을 담당.

## 주요 역할

- **입력 이벤트 중계**: InputAction 이벤트를 적절한 Dispatcher로 전달
- **시스템 토글**: 에디터 활성화/비활성화에 따른 입력 시스템 전환
- **안전 영역 검증**: 포인터가 화면 안전 영역 내에 있는지 검증
- **입력 구분**: 카메라 조작과 편집 입력을 분리하여 처리

## 주요 멤버

### 필드
```csharp
/// <summary>
/// 어플리케이션 기본 입력 시스템.
/// </summary>
[Inject]
private RficeAction _rficeInput;

/// <summary>
/// MyRoom 에디터 시스템 전용 입력 액션
/// </summary>
[Inject]
private MyRoomEditorInput _myRoomInput;

/// <summary>
/// 카메라 관련 입력 이벤트를 처리하는 클래스
/// </summary>
[Inject]
private MyRoomEditorCameraInputDispatcher _cameraInputDispatcher;

/// <summary>
/// 오브젝트 편집 관련 입력 이벤트를 처리하는 클래스
/// </summary>
[Inject]
private MyRoomEditorEdittingInputDispatcher _edittingDispatcher;
```

### 주요 메서드
```csharp
/// <summary>
/// 모든 MyRoom 에디터 입력을 활성화하는 메서드.
/// 기본 게임 입력을 비활성화하고 에디터 입력을 활성화.
/// </summary>
public void EnableAll()

/// <summary>
/// 모든 MyRoom 에디터 입력을 비활성화하는 메서드.
/// 기본 게임 입력을 활성화하고 에디터 입력을 비활성화.
/// </summary>
public void DisableAll()

/// <summary>
/// 입력 이벤트를 구독하는 메서드.
/// 각 InputAction의 이벤트에 핸들러를 등록하여 입력 처리 시작.
/// </summary>
private void InputEventSubscribe()

/// <summary>
/// 입력 이벤트를 구독 해제하는 메서드.
/// 각 InputAction의 이벤트에서 핸들러를 제거하여 입력 처리 중지.
/// </summary>
private void InputEventUnsubscribe()

/// <summary>
/// 포인터가 화면 안전 영역 내에 있는지 검증하는 메서드.
/// 노치나 시스템 UI 영역을 제외한 안전 영역 내 입력만 처리.
/// </summary>
/// <returns>포인터가 안전 영역 내에 있으면 true, 아니면 false</returns>
private bool IsPointerInsideScreen()
```

## 코드 스니펫

### 안전 영역 검증
```csharp
private bool IsPointerInsideScreen()
{
    var pointer = InputSystem.GetDevice<Pointer>();
    return pointer == null || Screen.safeArea.Contains(pointer.position.ReadValue());
}
```

### 이벤트 구독
```csharp
private void InputEventSubscribe()
{
    // 카메라 이동 입력 이벤트 구독
    _myRoomInput.MyRoomEditorCamera.CameraMove.started += OnCameraMoveStart;
    _myRoomInput.MyRoomEditorCamera.CameraMove.performed += OnCameraMovePerform;
    _myRoomInput.MyRoomEditorCamera.CameraMove.canceled += OnCameraMoveStop;

    // 카메라 회전 입력 이벤트 구독
    _myRoomInput.MyRoomEditorCamera.CameraEngage.started += OnCameraControlStarted;
    _myRoomInput.MyRoomEditorCamera.CameraDisengage.performed += OnCameraControlCanceled;

    // 카메라 줌 입력 이벤트 구독
    _myRoomInput.MyRoomEditorCamera.CameraZoom.performed += OnCameraZoomWheel;

    // 포인터 입력 이벤트 구독
    _myRoomInput.MyRoomEditorEditting.PointerDown.started += OnPointerDown;
    _myRoomInput.MyRoomEditorEditting.PointerUp.performed += OnPointerUp;
    
    // 단축키 입력 이벤트 구독
    _myRoomInput.MyRoomEditorEditting.Cancel.started += OnCancel;
    _myRoomInput.MyRoomEditorEditting.RightClick.started += OnRightClick;
    _myRoomInput.MyRoomEditorEditting.Delete.started += OnDeletePress;
}
```

## 주요 기능 설명

### 입력 시스템 토글
- **EnableAll()**: Rfice 입력 비활성화, MyRoomEditor 입력 활성화
- **DisableAll()**: Rfice 입력 활성화, MyRoomEditor 입력 비활성화

### 입력 카테고리
- **카메라 입력**: 이동, 회전, 줌
- **편집 입력**: 포인터 클릭, 취소, 삭제, 우클릭
- **시스템 입력**: 전체 활성화/비활성화

### 안전 영역 처리
- 포인터가 화면 안전 영역 내에 있을 때만 입력 처리
- 노치나 시스템 UI 영역 제외

### 이벤트 라우팅
- 각 입력 이벤트를 적절한 Dispatcher로 전달
- Dispatcher가 실제 비즈니스 로직 처리

## 관련 클래스

- `RficeAction`: 기본 게임 입력 액션
- `MyRoomEditorInput`: 에디터 전용 입력 액션
- [`MyRoomEditorCameraInputDispatcher`](/docs/projects/rfice/housingsystem/myroomeditorcamerainputdispatcher/): 카메라 입력 이벤트 처리
- [`MyRoomEditorEdittingInputDispatcher`](/docs/projects/rfice/housingsystem/myroomeditoreditinginputdispatcher/): 편집 입력 이벤트 처리