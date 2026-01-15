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

`MyRoomEditorInputController`는 `InputAction`을 통해 발생하는 입력 이벤트를 각각의 `Dispatcher`로 전달하는 클래스입니다. Rfice 게임 입력과 MyRoomEditor 전용 입력을 토글하며, 카메라 이동/회전/줌과 편집 관련 입력 이벤트를 적절한 디스패처로 전달합니다.  [`InputSystem`](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.17/manual/index.html)을 사용하여 입력을 처리하고, 안전 영역 내 포인터 입력을 보장합니다.

## 역할
- Rfice 입력과 MyRoom 에디터 입력의 활성화/비활성화 토글
- 카메라 제어 입력 이벤트(이동, 회전, 줌)의 구독 및 디스패처 전달
- 편집 입력 이벤트(포인터 클릭, 취소, 삭제, 우클릭)의 구독 및 디스패처 전달
- 화면 안전 영역 내 포인터 입력 검증 및 필터링


## 멤버
### 속성
```csharp
/// <summary>
/// 기본 게임 입력 액션 (Rfice 입력)
/// </summary>
[Inject]
private RficeAction _rficeInput;

/// <summary>
/// MyRoom 에디터 전용 입력 액션
/// </summary>
[Inject]
private MyRoomEditorInput _myRoomInput;

/// <summary>
/// 카메라 입력 이벤트 처리 디스패처
/// </summary>
[Inject]
private MyRoomEditorCameraInputDispatcher _cameraInputDispatcher;

/// <summary>
/// 편집 입력 이벤트 처리 디스패처
/// </summary>
[Inject]
private MyRoomEditorEditingInputDispatcher _edittingDispatcher;
```

### 메서드
```csharp
/// <summary>
/// 모든 MyRoomEditor 입력을 활성화하는 메서드.
/// 기본 게임 입력을 비활성화하고 에디터 입력을 활성화.
/// </summary>
public void EnableAll()

/// <summary>
/// 모든 MyRoomEditor 입력을 비활성화하는 메서드.
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
    _myRoomInput.MyRoomEditorEditing.PointerDown.started += OnPointerDown;
    _myRoomInput.MyRoomEditorEditing.PointerUp.performed += OnPointerUp;

    // 단축키 입력 이벤트 구독
    _myRoomInput.MyRoomEditorEditing.Cancel.started += OnCancel;
    _myRoomInput.MyRoomEditorEditing.RightClick.started += OnRightClick;
    _myRoomInput.MyRoomEditorEditing.Delete.started += OnDeletePress;
}
```

## 기능 설명
### 입력 시스템 토글
- **EnableAll()**: Rfice 입력을 비활성화하고 MyRoomEditor 입력을 활성화. 카메라 이동, 회전, 줌, 포인터 입력을 모두 활성화.
- **DisableAll()**: Rfice 입력을 활성화하고 MyRoomEditor 입력을 비활성화. 모든 에디터 입력을 비활성화.

### 이벤트 처리
- 카메라 입력 이벤트(이동, 회전, 줌)를 MyRoomEditorCameraInputDispatcher로 전달.
- 편집 입력 이벤트(포인터 클릭, 취소, 삭제, 우클릭)를 MyRoomEditorEdittingInputDispatcher로 전달.
- Dispatcher가 실제 비즈니스 로직 처리

### 안전 영역 검증
- 포인터 입력 시 Screen.safeArea를 사용하여 노치나 시스템 UI 영역을 제외한 안전 영역 내 입력만 처리.

## 의존성/상속 관계
- `MonoBehaviour`를 상속받음.
- Zenject를 사용하여 의존성 주입: `RficeAction`, `MyRoomEditorInput`, [`MyRoomEditorCameraInputDispatcher`](/docs/projects/rfice/housingsystem/myroomeditorcamerainputdispatcher/), [`MyRoomEditorEditingInputDispatcher`](/docs/projects/rfice/housingsystem/myroomeditoreditinginputdispatcher/).
- [`InputSystem`](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.17/manual/index.html) 패키지를 사용.

## 관련 클래스
- [`MyRoomEditorCameraInputDispatcher`](/docs/projects/rfice/housingsystem/myroomeditorcamerainputdispatcher/)
- [`MyRoomEditorEditingInputDispatcher`](/docs/projects/rfice/housingsystem/myroomeditoreditinginputdispatcher/)
- [`InputSystem`](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.17/manual/index.html)
