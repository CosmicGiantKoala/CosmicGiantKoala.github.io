+++
title = "MyRoomEditorCameraController"
description = "카메라 조작 동작 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 412
+++

## 개요

`MyRoomCameraController`는 MyRoom 에디터에서 카메라 조작을 담당하는 클래스. Cinemachine을 사용하여 WASD 이동, 마우스 회전, 줌 기능을 제공.

## 주요 역할

- **카메라 이동**: WASD 키를 통한 방향 기반 이동
- **카메라 회전**: 마우스 드래그를 통한 회전
- **카메라 줌**: 마우스 휠을 통한 줌 인/아웃
- **경계 제한**: 카메라 이동 범위를 박스 콜라이더로 제한

## 주요 멤버

### 필드
```csharp
/// <summary>
/// 입력 이벤트를 받아 카메라 조작을 수행하는 디스패처
/// </summary>
[Inject]
private MyRoomEditorCameraInputDispatcher _dispatcher;

/// <summary>
/// 카메라 팔로워 트랜스폼: 카메라가 따라다니는 대상
/// 이동 시 이 오브젝트의 위치를 변경하여 카메라를 이동시킴
/// </summary>
[SerializeField]
private Transform _cameraFollower;

/// <summary>
/// 카메라 이동 속도: WASD 키 이동 시 적용되는 속도
/// </summary>
[SerializeField]
private float moveSpeed = 5f;

/// <summary>
/// 카메라 회전 속도: 마우스 회전 시 적용되는 속도
/// </summary>
[SerializeField]
private float rotateSpeed = 2f;

/// <summary>
/// 카메라 줌 최소 거리: 줌 인 시 최소 거리 제한
/// </summary>
[SerializeField]
private float zoomDistanceMin = 1f;

/// <summary>
/// 카메라 줌 최대 거리: 줌 아웃 시 최대 거리 제한
/// </summary>
[SerializeField]
private float zoomDistanceMax = 10f;

/// <summary>
/// 카메라 줌 감도: 마우스 휠 입력에 대한 줌 반응 민감도
/// </summary>
[SerializeField]
private float zoomSensitive = 0.3f;

/// <summary>
/// Cinemachine Virtual Camera: 카메라 조작 기본 컴포넌트 
/// </summary>
[SerializeField]
private CinemachineVirtualCamera virtualCamera;

/// <summary>
/// Cinemachine Input Provider: 회전 입력을 처리하는 컴포넌트
/// </summary>
[SerializeField]
private CinemachineInputProvider inputProvider;

/// <summary>
/// Cinemachine POV 컴포넌트: 마우스 회전을 처리 (런타임에 초기화)
/// </summary>
private CinemachinePOV _cinemachinePOV;

/// <summary>
/// Cinemachine 프레이밍 트랜스포저: 줌 거리를 제어 (런타임에 초기화)
/// </summary>
private CinemachineFramingTransposer _cinemachineFramingTransposer;

/// <summary>
/// 카메라 이동 경계 콜라이더: 카메라 이동 범위를 제한하는 박스 콜라이더
/// </summary>
[SerializeField]
private BoxCollider cameraBoundary;

/// <summary>
/// 이동 방향 캐시: 현재 입력된 이동 방향
/// </summary>
private Vector3 _moveDir;

/// <summary>
/// 이동 활성화 상태: 현재 이동이 활성화되어 있는지 여부
/// </summary>
private bool _activeMove;

/// <summary>
/// 이동 코루틴: 카메라 이동을 처리하는 코루틴 참조
/// </summary>
private Coroutine _moveCoroutine;
```

### 주요 메서드
```csharp
/// <summary>
/// Cinemachine 카메라 컴포넌트를 초기화하는 프라이빗 메서드.
/// POV와 FramingTransposer 컴포넌트를 가져와 설정하고, 회전 속도를 적용.
/// </summary>
private void InitializeCinemachineCameraComponents()

/// <summary>
/// 카메라 이동 방향을 캐시하는 이벤트 핸들러.
/// 입력된 2D 벡터를 3D 이동 방향으로 변환하여 저장.
/// </summary>
/// <param name="moveVec2">입력된 이동 방향 벡터 (X, Y)</param>
private void OnCameraMoveDirectionCache(Vector2 moveVec2)

/// <summary>
/// 카메라 이동 상태 변경 이벤트 핸들러.
/// 이동 활성화 시 코루틴을 시작하고, 비활성화 시 코루틴을 중지.
/// </summary>
/// <param name="isActive">이동 활성화 상태</param>
private void OnCameraMoving(bool isActive)

/// <summary>
/// 카메라 이동을 처리하는 코루틴.
/// 카메라 전방/우측 방향을 고려하여 이동 방향을 계산하고, 경계 내에서 위치를 업데이트.
/// </summary>
private IEnumerator CoMove()

/// <summary>
/// 카메라 위치를 경계 박스 내로 클램핑하는 프라이빗 메서드.
/// X축과 Z축을 경계 범위 내로 제한.
/// </summary>
/// <param name="targetPos">클램핑할 목표 위치</param>
/// <returns>경계 내로 클램핑된 위치</returns>
private Vector3 ClampedPosition(Vector3 targetPos)

/// <summary>
/// 카메라 회전 시작 이벤트 핸들러.
/// Cinemachine 입력 제공자를 활성화하여 마우스 회전 입력을 허용.
/// </summary>
private void OnCameraEngaged()

/// <summary>
/// 카메라 회전 종료 이벤트 핸들러.
/// Cinemachine 입력 제공자를 비활성화하여 마우스 회전 입력을 차단.
/// </summary>
private void OnCameraDisengaged()

/// <summary>
/// 카메라 줌 이벤트 핸들러.
/// 줌 거리를 계산하여 최소/최대 범위 내에서 조정.
/// </summary>
/// <param name="value">줌 입력 값 (양수: 줌아웃, 음수: 줌인)</param>
private void OnCameraZoomed(float value)
```

## 코드 스니펫

### 카메라 이동 프로세스
```csharp
private void OnCameraMoving(bool isActive)
{
    _activeMove = isActive;
    if (isActive)
    {
        // 이동 코루틴 시작
        _moveCoroutine = StartCoroutine(CoMove());
    }
    else
    {
        // 이동 코루틴 중지 및 방향 초기화
        StopCoroutine(_moveCoroutine);
        _moveDir = Vector3.zero;
    }
}

private void OnCameraMoveDirectionCache(Vector2 moveVec2)
{
    _moveDir = new Vector3(moveVec2.x, 0, moveVec2.y);
}

private IEnumerator CoMove()
{
    if (Camera.main == null) yield break; // 메인 카메라가 존재하지 않으면 코루틴 종료

    var camTransform = Camera.main.transform;


    while (_activeMove) // 이동이 활성화된 동안 반복
    {
        var camForward = camTransform.TransformDirection(Vector3.forward); // 카메라 전방 방향 계산 (Y축은 0으로 고정)
        camForward.y = 0;

        var camRight = camTransform.TransformDirection(Vector3.right); // 카메라 우측 방향 계산

        var targetDir = _moveDir.x * camRight + _moveDir.z * camForward; // 최종 이동 방향 계산
        targetDir = targetDir.normalized;

        var targetPos = (targetDir * moveSpeed * Time.deltaTime) + _cameraFollower.position; // 목표 위치 계산

        _cameraFollower.position = ClampedPosition(targetPos); // 경계 내 위치로 클램핑하여 설정

        yield return null;
    }
}
```

### 카메라 이동 경계 클램핑
```csharp
private Vector3 ClampedPosition(Vector3 targetPos)
{
    var minBounds = cameraBoundary.bounds.min;
    var maxBounds = cameraBoundary.bounds.max;
    return new Vector3(
        Mathf.Clamp(targetPos.x, minBounds.x, maxBounds.x),
        targetPos.y,
        Mathf.Clamp(targetPos.z, minBounds.z, maxBounds.z)
    );
}
```

### 카메라 회전 프로세서
```csharp
private void OnCameraEngaged()
{
    inputProvider.enabled = true;
}

private void OnCameraDisengaged()
{
    inputProvider.enabled = false;
}
```

### 카메라 줌 프로세서
```csharp
private void OnCameraZoomed(float value)
{
    // 줌 거리가 유효 범위 내에 있는지 확인
    if (!(_cinemachineFramingTransposer.m_CameraDistance >= zoomDistanceMin) &&
        !(_cinemachineFramingTransposer.m_CameraDistance <= zoomDistanceMax)) return;

    // 줌 거리 조정
    _cinemachineFramingTransposer.m_CameraDistance -= value * zoomSensitive;

    // 최소/최대 범위 클램핑
    if (_cinemachineFramingTransposer.m_CameraDistance < zoomDistanceMin)
    {
        _cinemachineFramingTransposer.m_CameraDistance = zoomDistanceMin;
    }
    else if (_cinemachineFramingTransposer.m_CameraDistance > zoomDistanceMax)
    {
        _cinemachineFramingTransposer.m_CameraDistance = zoomDistanceMax;
    }
}
```

## 주요 기능 설명

### 카메라 이동
- WASD 키 입력을 받아 카메라 전방/우측 방향으로 이동
- 코루틴을 사용하여 부드러운 이동 구현
- 박스 콜라이더 경계를 벗어나지 않도록 위치 제한

### 카메라 회전
- 마우스 드래그 입력을 [`Cinemachine POV`](https://docs.unity3d.com/Packages/com.unity.cinemachine@2.7/manual/CinemachineAimPOV.html) 컴포넌트로 처리
- 입력 제공자의 활성화/비활성화로 회전 모드 제어

### 카메라 줌
- 마우스 휠 입력을 받아 카메라 거리 조정
- 최소/최대 줌 거리로 제한

### Cinemachine 통합
- [`Virtual Camera`](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/api/Unity.Cinemachine.CinemachineVirtualCamera.html), [`Input Provider`](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/api/Unity.Cinemachine.CinemachineInputProvider.html), [`Cinemachine POV`](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/api/Unity.Cinemachine.CinemachinePOV.html), [`Framing Transposer`](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/api/Unity.Cinemachine.CinemachineFramingTransposer.html) 사용
- 초기화 시 컴포넌트 검증 및 속도 설정

## 관련 클래스
- [`MyRoomEditorCameraInputDispatcher`](/docs/projects/rfice/housingsystem/myroomeditorcamerainputdispatcher/): 입력 이벤트 제공
- [`Cinemachine`](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/api/Unity.Cinemachine.html): 카메라 조작 라이브러리
