+++
title = "MyRoomEditorCameraInputDispatcher"
description = "카메라 조작 이벤트를 처리하는 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 411
+++
#### **(본 문서는 AI로 작성된 프로토타입 문서입니다.)**
## 개요

`MyRoomEditorCameraInputDispatcher`는 카메라 조작 이벤트를 처리하는 클래스입니다. WASD 이동, 마우스 회전, 줌 등 카메라 컨트롤 이벤트 관리를 담당합니다.

## 주요 역할

- **카메라 이동 이벤트**: 방향 기반 이동 이벤트 처리
- **카메라 회전 이벤트**: 회전 시작/종료 이벤트 처리
- **카메라 줌 이벤트**: 줌 값 이벤트 처리
- **상태 관리**: 카메라 조작 활성화 상태 추적

## 주요 멤버

### 이벤트
```csharp
public event Action<Vector2> OnCameraMoveDirection;
public event Action<bool> OnCameraMoved;
public event Action OnCameraEngage;
public event Action OnCameraDisengage;
public event Action<float> OnCameraZoom;
```

### 필드
```csharp
private bool _isActiveCameraMove;
```

### 주요 메서드
```csharp
public void OnCameraMoveStarted()
public void OnCameraMovePerformed(Vector2 moveVec2)
public void OnCameraMoveStopped()
public void OnCameraEngageStarted()
public void OnCameraDisengaged()
public void OnCameraZoomed(float value)
```

## 코드 스니펫

### 전체 클래스 코드
```csharp
using System;
using UnityEngine;
using UnityEngine.InputSystem;

namespace Dev.Scripts.Rsup.Presentation.Dispatchers
{
    public class MyRoomEditorCameraInputDispatcher
    {
    #region CameraMove
        public event Action<Vector2> OnCameraMoveDirection;
        public event Action<bool> OnCameraMoved; 
        private bool _isActiveCameraMove;

        public void OnCameraMoveStarted()
        {
            _isActiveCameraMove = true;
            OnCameraMoved?.Invoke(_isActiveCameraMove);
        }

        public void OnCameraMovePerformed(Vector2 moveVec2)
        {
            if (!_isActiveCameraMove) return;
            OnCameraMoveDirection?.Invoke(moveVec2);
        }

        public void OnCameraMoveStopped()
        {
            _isActiveCameraMove = false;
            OnCameraMoved?.Invoke(_isActiveCameraMove);
        }
    #endregion

    #region CameraRotation
        public event Action OnCameraEngage;
        public event Action OnCameraDisengage;
        public event Action<float> OnCameraZoom;
    
        public void OnCameraEngageStarted()
        {
            OnCameraEngage?.Invoke();
        }

        public void OnCameraDisengaged()
        {
            OnCameraDisengage?.Invoke();
        }

        public void OnCameraZoomed(float value)
        {
            OnCameraZoom?.Invoke(value);
        }
        #endregion

    }
}
```

### 카메라 이동 처리
```csharp
public void OnCameraMoveStarted()
{
    _isActiveCameraMove = true;
    OnCameraMoved?.Invoke(_isActiveCameraMove);
}

public void OnCameraMovePerformed(Vector2 moveVec2)
{
    if (!_isActiveCameraMove) return;
    OnCameraMoveDirection?.Invoke(moveVec2);
}

public void OnCameraMoveStopped()
{
    _isActiveCameraMove = false;
    OnCameraMoved?.Invoke(_isActiveCameraMove);
}
```

### 카메라 회전 처리
```csharp
public void OnCameraEngageStarted()
{
    OnCameraEngage?.Invoke();
}

public void OnCameraDisengaged()
{
    OnCameraDisengage?.Invoke();
}
```

### 카메라 줌 처리
```csharp
public void OnCameraZoomed(float value)
{
    OnCameraZoom?.Invoke(value);
}
```

## 주요 기능 설명

### 카메라 이동 이벤트
- **시작**: 이동 시작 시 상태 변경 및 이벤트 발생
- **수행**: 이동 방향 벡터를 실시간으로 이벤트로 전달
- **종료**: 이동 종료 시 상태 변경 및 이벤트 발생

### 카메라 회전 이벤트
- **시작**: 회전 모드 활성화 이벤트
- **종료**: 회전 모드 비활성화 이벤트

### 카메라 줌 이벤트
- 줌 값(스크롤 휠 델타)을 이벤트로 전달

### 상태 추적
- `_isActiveCameraMove`: 현재 카메라 이동이 활성화되어 있는지 추적

## 이벤트 흐름

### 카메라 이동
1. `OnCameraMoveStarted()` → `OnCameraMoved(true)`
2. `OnCameraMovePerformed(Vector2)` → `OnCameraMoveDirection(Vector2)` (반복)
3. `OnCameraMoveStopped()` → `OnCameraMoved(false)`

### 카메라 회전
1. `OnCameraEngageStarted()` → `OnCameraEngage()`
2. 회전 동작 수행
3. `OnCameraDisengaged()` → `OnCameraDisengage()`

### 카메라 줌
1. `OnCameraZoomed(float)` → `OnCameraZoom(float)`

## 의존성

- **InputController**: `MyRoomEditorInputController`에서 이벤트 호출
- **CameraController**: 실제 카메라 조작을 수행하는 컨트롤러

## 관련 클래스

- **호출자**: `MyRoomEditorInputController`
- **구독자**: `MyRoomCameraController` 등 카메라 조작 클래스
