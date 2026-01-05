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
## 개요

`MyRoomEditorCameraInputDispatcher`는 카메라 조작 이벤트를 처리하는 클래스. WASD 이동, 마우스 회전, 줌 등 카메라 컨트롤 이벤트 관리를 담당.

## 주요 역할

- **카메라 이동 이벤트**: 방향 기반 이동 이벤트 처리
- **카메라 회전 이벤트**: 회전 시작/종료 이벤트 처리
- **카메라 줌 이벤트**: 줌 값 이벤트 처리
- **상태 관리**: 카메라 조작 활성화 상태 추적

## 주요 멤버

### 이벤트
```csharp
/// <summary>
/// 카메라 이동 방향 이벤트, 이동 방향 벡터(Vector2)를 매개변수로 전달
/// </summary>
public event Action<Vector2> OnCameraMoveDirection;

/// <summary>
/// 카메라 이동 상태 이벤트. 이동 시작/종료를 bool 값으로 전달.
/// </summary>
public event Action<bool> OnCameraMoved;

/// <summary>
/// 카메라 회전 모드 시작 이벤트.
/// </summary>
public event Action OnCameraEngage;

/// <summary>
/// 카메라 회전 모드 종료 이벤트.
/// </summary>
public event Action OnCameraDisengage;

/// <summary>
/// 카메라 줌 값 변경 이벤트.
/// </summary>
public event Action<float> OnCameraZoom;
```

### 필드
```csharp
/// <summary>
/// 이동 시작 시 true, 이동 종료 시 false로 설정.
/// </summary>
private bool _isActiveCameraMove;
```

### 주요 메서드
```csharp
/// <summary>
/// 카메라 이동이 시작되었을 때 호출되는 메서드.
/// 이동 상태를 활성화하고 이동 시작 이벤트를 발생시킴.
/// </summary>
public void OnCameraMoveStarted()

/// <summary>
/// 카메라 이동 중 방향 값이 변경되었을 때 호출되는 메서드.
/// 이동이 활성화된 경우에만 이동 방향 이벤트를 발생시킴.
/// </summary>
/// <param name="moveVec2">카메라 이동 방향 벡터</param>
public void OnCameraMovePerformed(Vector2 moveVec2)

/// <summary>
/// 카메라 이동이 종료되었을 때 호출되는 메서드.
/// 이동 상태를 비활성화하고 이동 종료 이벤트를 발생시킴.
/// </summary>
public void OnCameraMoveStopped()

/// <summary>
/// 카메라 회전 모드가 시작되었을 때 호출되는 메서드.
/// 회전 시작 이벤트를 발생시킴.
/// </summary>
public void OnCameraEngageStarted()

/// <summary>
/// 카메라 회전 모드가 종료되었을 때 호출되는 메서드.
/// 회전 종료 이벤트를 발생시킴.
/// </summary>
public void OnCameraDisengaged()

/// <summary>
/// 카메라 줌 값이 변경되었을 때 호출되는 메서드.
/// 줌 값 변경 이벤트를 발생시킴.
/// </summary>
/// <param name="value">줌 델타 값 (양수: 줌인, 음수: 줌아웃)</param>
public void OnCameraZoomed(float value)
```

## 코드 스니펫

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

## 관련 클래스
- [`MyRoomEditorInputController`](/docs/projects/rfice/housingsystem/myroomeditorinputcontroller/): 이벤트 호출자
- [`MyRoomCameraController`](/docs/projects/rfice/housingsystem/myroomcameracontroller/) : 카메라 조작 클래스
