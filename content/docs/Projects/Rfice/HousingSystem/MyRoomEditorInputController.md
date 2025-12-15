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

`MyRoomEditorInputController`는 `InputAction`을 통해 발생하는 입력 이벤트를 각각의 `Dispatcher`로 전달하는 클래스입니다. 시스템 활성화 상태 기반 `InputAction` 토글을 담당합니다.

## 주요 역할

- **입력 이벤트 중계**: InputAction 이벤트를 적절한 Dispatcher로 라우팅
- **시스템 토글**: 에디터 활성화/비활성화에 따른 입력 시스템 전환
- **안전 영역 검증**: 포인터가 화면 안전 영역 내에 있는지 검증
- **입력 구분**: 카메라 조작과 편집 입력을 분리하여 처리

## 주요 멤버

### 필드
```csharp
[Inject]
private RficeAction _rficeInput;

[Inject]
private MyRoomEditorInput _myRoomInput;

[Inject]
private MyRoomEditorCameraInputDispatcher _cameraInputDispatcher;

[Inject]
private MyRoomEditorEdittingInputDispatcher _edittingDispatcher;
```

### 주요 메서드
```csharp
public void EnableAll()
public void DisableAll()
private void InputEventSubscribe()
private void InputEventUnsubscribe()
private bool IsPointerInsideScreen()
```

## 코드 스니펫

### 전체 클래스 코드
```csharp
using Dev.Scripts.Rsup.Presentation.Dispatchers;
using UnityEngine;
using UnityEngine.InputSystem;
using UnityEngine.InputSystem.Controls;
using Zenject;

namespace Dev.Scripts.Rsup.Scenes.MyRoomEditor
{
    public class MyRoomEditorInputController : MonoBehaviour
    {
        [Inject]
        private RficeAction _rficeInput;

        [Inject]
        private MyRoomEditorInput _myRoomInput;

        [Inject]
        private MyRoomEditorCameraInputDispatcher _cameraInputDispatcher;

        [Inject]
        private MyRoomEditorEdittingInputDispatcher _edittingDispatcher;

        private void EnableRficeInput() => _rficeInput.Enable();
        private void DisableRficeInput() => _rficeInput.Disable();
        private void EnableCameraMove() => _myRoomInput.MyRoomEditorCamera.CameraMove.Enable();
        private void DisableCameraMove() => _myRoomInput.MyRoomEditorCamera.CameraMove.Disable();
        private void EnableCameraRotate() => _myRoomInput.MyRoomEditorCamera.CameraEngage.Enable();
        private void DisableCameraRotate() => _myRoomInput.MyRoomEditorCamera.CameraEngage.Disable();
        private void EnableCameraRotateVector() => _myRoomInput.MyRoomEditorCamera.CameraRotationVector.Enable();
        private void DisableCameraRotateVector() => _myRoomInput.MyRoomEditorCamera.CameraRotationVector.Disable();
        private void EnableCameraZoom() => _myRoomInput.MyRoomEditorCamera.CameraZoom.Enable();
        private void DisableCameraZoom() => _myRoomInput.MyRoomEditorCamera.CameraZoom.Disable();
        private void EnablePointerDown() => _myRoomInput.MyRoomEditorEditting.PointerDown.Enable();
        private void DisablePointerDown() => _myRoomInput.MyRoomEditorEditting.PointerDown.Disable();
        private void EnablePointerUp() => _myRoomInput.MyRoomEditorEditting.PointerUp.Enable();
        private void DisablePointerUp() => _myRoomInput.MyRoomEditorEditting.PointerUp.Disable();
        private void EnableRightClick() => _myRoomInput.MyRoomEditorEditting.RightClick.Enable();
        private void DisableRightClick() => _myRoomInput.MyRoomEditorEditting.RightClick.Disable();
        private void EnableDelete()=> _myRoomInput.MyRoomEditorEditting.Delete.Enable();
        private void DisableDelete() => _myRoomInput.MyRoomEditorEditting.Delete.Disable();
        private Vector2 CameraMoveValue() => _myRoomInput.MyRoomEditorCamera.CameraMove.ReadValue<Vector2>();
        private float CameraZoomValue() => _myRoomInput.MyRoomEditorCamera.CameraZoom.ReadValue<float>();

        private void Awake()
        {
            InputEventSubscribe();
        }

        private void OnDestroy()
        {
            InputEventUnsubscribe();
        }

        public void EnableAll()
        {
            DisableRficeInput();
            _myRoomInput.Enable();

            EnableCameraMove();
            EnableCameraRotate();
            EnableCameraZoom();
            EnablePointerDown();
        }

        public void DisableAll()
        {
            EnableRficeInput();
            _myRoomInput.Disable();

            DisableCameraMove();
            DisableCameraRotate();
            DisableCameraZoom();
            DisablePointerDown();
        }

        private void InputEventSubscribe()
        {
            //CameraMove
            _myRoomInput.MyRoomEditorCamera.CameraMove.started += OnCameraMoveStart;
            _myRoomInput.MyRoomEditorCamera.CameraMove.performed += OnCameraMovePerform;
            _myRoomInput.MyRoomEditorCamera.CameraMove.canceled += OnCameraMoveStop;

            //CameraRotate
            _myRoomInput.MyRoomEditorCamera.CameraEngage.started += OnCameraControlStarted;
            _myRoomInput.MyRoomEditorCamera.CameraDisengage.performed += OnCameraControlCanceled;

            //CameraZoom
            _myRoomInput.MyRoomEditorCamera.CameraZoom.performed += OnCameraZoomWheel;

            //Pointer
            _myRoomInput.MyRoomEditorEditting.PointerDown.started += OnPointerDown;
            _myRoomInput.MyRoomEditorEditting.PointerUp.performed += OnPointerUp;
            
            //Shortcut
            _myRoomInput.MyRoomEditorEditting.Cancel.started += OnCancel;
            _myRoomInput.MyRoomEditorEditting.RightClick.started += OnRightClick;
            _myRoomInput.MyRoomEditorEditting.Delete.started += OnDeletePress;

        }

        private void InputEventUnsubscribe()
        {
            //cameraMove
            _myRoomInput.MyRoomEditorCamera.CameraMove.started -= OnCameraMoveStart;
            _myRoomInput.MyRoomEditorCamera.CameraMove.performed -= OnCameraMovePerform;
            _myRoomInput.MyRoomEditorCamera.CameraMove.canceled -= OnCameraMoveStop;

            //CameraRotate
            _myRoomInput.MyRoomEditorCamera.CameraEngage.started -= OnCameraControlStarted;
            _myRoomInput.MyRoomEditorCamera.CameraDisengage.performed -= OnCameraControlCanceled;

            //CameraZoom
            _myRoomInput.MyRoomEditorCamera.CameraZoom.performed -= OnCameraZoomWheel;
            
            //Pointer
            _myRoomInput.MyRoomEditorEditting.PointerDown.started -= OnPointerDown;
            _myRoomInput.MyRoomEditorEditting.PointerUp.performed -= OnPointerUp;
            
            //Shortcut
            _myRoomInput.MyRoomEditorEditting.Cancel.started -= OnCancel;
            _myRoomInput.MyRoomEditorEditting.RightClick.started -= OnRightClick;
            _myRoomInput.MyRoomEditorEditting.Delete.started -= OnDeletePress;
        }

        private void OnCameraMoveStart(InputAction.CallbackContext context)
        {
            _cameraInputDispatcher.OnCameraMoveStarted();
        }

        private void OnCameraMovePerform(InputAction.CallbackContext context)
        {
            _cameraInputDispatcher.OnCameraMovePerformed(CameraMoveValue());
        }

        private void OnCameraMoveStop(InputAction.CallbackContext context)
        {
            _cameraInputDispatcher.OnCameraMoveStopped();
        }

        private void OnCameraControlStarted(InputAction.CallbackContext context)
        {
            if (!IsPointerInsideScreen()) return;
            EnableCameraRotateVector();
            _cameraInputDispatcher.OnCameraEngageStarted();
        }

        private void OnCameraControlCanceled(InputAction.CallbackContext context)
        {
            DisableCameraRotateVector();
            _cameraInputDispatcher.OnCameraDisengaged();
        }

        private void OnCameraZoomWheel(InputAction.CallbackContext context)
        {
            _cameraInputDispatcher.OnCameraZoomed(CameraZoomValue());
        }

        private void OnPointerDown(InputAction.CallbackContext context)
        {
            if (IsPointerInsideScreen() == false) return;
            _edittingDispatcher.OnPointerDown();
        }

        private void OnPointerUp(InputAction.CallbackContext context)
        {
            _edittingDispatcher.OnPointerUp();
        }

        private void OnCancel(InputAction.CallbackContext context)
        {
            _edittingDispatcher.OnCanceled();
        }

        private void OnRightClick(InputAction.CallbackContext context)
        {
            _edittingDispatcher.OnRightClicked();
        }

        private void OnDeletePress(InputAction.CallbackContext context)
        {
            _edittingDispatcher.OnDeletePressed();
        }

        private bool IsPointerInsideScreen()
        {
            var pointer = InputSystem.GetDevice<Pointer>();
            return pointer == null || Screen.safeArea.Contains(pointer.position.ReadValue());
        }
    }
}
```

### 입력 활성화/비활성화
```csharp
public void EnableAll()
{
    DisableRficeInput();
    _myRoomInput.Enable();

    EnableCameraMove();
    EnableCameraRotate();
    EnableCameraZoom();
    EnablePointerDown();
}

public void DisableAll()
{
    EnableRficeInput();
    _myRoomInput.Disable();

    DisableCameraMove();
    DisableCameraRotate();
    DisableCameraZoom();
    DisablePointerDown();
}
```

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
    //CameraMove
    _myRoomInput.MyRoomEditorCamera.CameraMove.started += OnCameraMoveStart;
    _myRoomInput.MyRoomEditorCamera.CameraMove.performed += OnCameraMovePerform;
    _myRoomInput.MyRoomEditorCamera.CameraMove.canceled += OnCameraMoveStop;

    //CameraRotate
    _myRoomInput.MyRoomEditorCamera.CameraEngage.started += OnCameraControlStarted;
    _myRoomInput.MyRoomEditorCamera.CameraDisengage.performed += OnCameraControlCanceled;

    //CameraZoom
    _myRoomInput.MyRoomEditorCamera.CameraZoom.performed += OnCameraZoomWheel;

    //Pointer
    _myRoomInput.MyRoomEditorEditting.PointerDown.started += OnPointerDown;
    _myRoomInput.MyRoomEditorEditting.PointerUp.performed += OnPointerUp;
    
    //Shortcut
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

## 의존성

- `RficeAction`: 기본 게임 입력 액션
- `MyRoomEditorInput`: 에디터 전용 입력 액션
- `MyRoomEditorCameraInputDispatcher`: 카메라 입력 이벤트 처리
- `MyRoomEditorEdittingInputDispatcher`: 편집 입력 이벤트 처리

## 관련 클래스

- **Dispatcher들**: `MyRoomEditorCameraInputDispatcher`, `MyRoomEditorEdittingInputDispatcher`
- **입력 액션**: `MyRoomEditorInput`, `RficeAction`
