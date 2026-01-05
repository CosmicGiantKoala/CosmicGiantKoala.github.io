+++
title = "MyRoomEditorInputUtils"
description = "입력 유틸리티 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 413
+++
## 개요

`MyRoomEditorInputUtils`는 입력 유틸리티 클래스. UI 검증, Raycast 실행, 포인터 델타 계산 등 입력 관련 헬퍼 함수를 제공.

## 주요 역할

- **Raycast 수행**: 화면 포인터 위치에서 3D 공간으로의 Raycast 실행
- **UI 검증**: 포인터가 UI 요소 위에 있는지 확인
- **포인터 정보**: 포인터 위치 및 델타 값 제공
- **충돌 필터링**: 배치 영역 및 오브젝트 무시 로직

## 주요 멤버

### 필드
```csharp
/// <summary>
/// Raycast를 수행할 카메라: 화면 좌표를 3D 공간으로 변환
/// </summary>
[SerializeField]
private Camera raycastCamera;

/// <summary>
/// Raycast 최대 거리: 이 거리 이상의 충돌은 무시
/// </summary>
[SerializeField]
private float raycastMaxDistance = 50f;

/// <summary>
/// Raycast 최소 거리: 이 거리 이하의 충돌은 무시 (너무 가까운 충돌 방지)
/// </summary>
[SerializeField]
private float raycastMinDistance = 0.5f;

/// <summary>
/// 현재 이벤트 시스템: UI 검증에 사용
/// </summary>
private EventSystem _eventSystem = EventSystem.current;

/// <summary>
/// Raycast 결과 최대 개수 제한
/// </summary>
private const int RaycastLimit = 10;
```

### 주요 메서드
```csharp
/// <summary>
/// 특정 오브젝트를 무시한 Raycast 결과를 반환하는 메서드.
/// ignoreObject를 제외한 가장 가까운 충돌을 찾아 반환.
/// </summary>
/// <param name="raycastHit">반환받을 RaycastHit 구조체</param>
/// <param name="targetLayerMask">Raycast 대상 레이어 마스크</param>
/// <param name="ignoreObject">Raycast 결과에서 무시할 SpawnablePropBase 오브젝트</param>
/// <returns>유효한 충돌이 있으면 true, 없으면 false</returns>
public bool GetRaycastHit(out RaycastHit raycastHit, LayerMask targetLayerMask, SpawnablePropBase ignoreObject)
        

/// <summary>
/// 우선순위 레이어를 기반으로 Raycast 결과를 반환하는 메서드.
/// priorityLayer의 오브젝트를 우선 선택하며, 없으면 가장 가까운 오브젝트 선택.
/// </summary>
/// <param name="raycastHit">반환받을 RaycastHit 구조체</param>
/// <param name="targetLayerMask">Raycast 대상 레이어 마스크</param>
/// <param name="priorityLayer">우선시할 레이어 (-1이면 우선순위 없음)</param>
/// <returns>유효한 충돌이 있으면 true, 없으면 false</returns>
public bool GetRaycastHit(out RaycastHit raycastHit, LayerMask targetLayerMask, int priorityLayer)

/// <summary>
/// Raycast 결과에서 무시할 오브젝트를 제거하는 메서드.
/// IPlaceableArea 인터페이스를 구현한 오브젝트 중 ignoreObject와 다른 경우만 유지.
/// </summary>
/// <param name="raycastHits">필터링할 RaycastHit 배열</param>
/// <param name="ignoreObject">무시할 SpawnablePropBase 오브젝트</param>
/// <returns>필터링된 RaycastHit 배열</returns>
private RaycastHit[] RemoveIgnoring(RaycastHit[] raycastHits, SpawnablePropBase ignoreObject)

/// <summary>
/// 현재 포인터의 화면 좌표를 반환하는 메서드.
/// Raycast를 위한 시작점으로 사용.
/// </summary>
/// <returns>포인터 화면 좌표</returns>
public Vector2 PointerDelta()

/// <summary>
/// 포인터가 UI 요소 위에 있는지 검증하는 메서드.
/// GraphicRaycaster를 사용하여 UI 요소에 대한 Raycast 수행.
/// </summary>
/// <returns>포인터가 UI 위에 있으면 true, 없으면 false</returns>
public bool IsPointerOnUI()
```

## 코드 스니펫

### 우선순위 기반 Raycast
```csharp
public bool GetRaycastHit(out RaycastHit raycastHit, LayerMask targetLayerMask, int priorityLayer)
{
    // 포인터 위치에서 카메라를 통해 Ray 생성
    var ray = raycastCamera.ScreenPointToRay(PointerPosition());

    // 가비지 생성을 방지하기 위해 비할당 Raycast 사용
    RaycastHit[] results = new RaycastHit[RaycastLimit];
    var hitLength = Physics.RaycastNonAlloc(ray, results, raycastMaxDistance, targetLayerMask);

    // 충돌이 없으면 실패 반환
    if (hitLength == 0)
    {
        raycastHit = new RaycastHit();
        return false;
    }

    // 유효한 콜라이더를 가진 결과만 필터링하고 최소 거리 이상 확인
    results = Array.FindAll(results, raycastHit =>
        raycastHit.collider != null
        && raycastHit.distance > raycastMinDistance);

    // 필터링 후 결과가 없으면 실패 반환
    if (results.Length == 0)
    {
        raycastHit = new RaycastHit();
        return false;
    }

    // 거리순으로 정렬
    Array.Sort(results, (raycast1, raycast2) => raycast1.distance.CompareTo(raycast2.distance));

    // 우선순위 레이어가 지정되지 않은 경우
    if (priorityLayer == -1)
    {
        raycastHit = results.First();
    }
    else
    {
        // 우선순위 레이어의 오브젝트들만 필터링
        var priorityRaycastHits = results.Where(hits => hits.transform.gameObject.layer == priorityLayer).ToArray();
        // 우선순위 레이어 오브젝트가 있으면 첫 번째 선택, 없으면 전체 결과의 첫 번째 선택
        raycastHit = priorityRaycastHits.Length != 0 ? priorityRaycastHits.First() : results.First();
    }
    return true;
}
```

### 특정 오브젝트를 무시한 가장 가까운 오브젝트를 반환하는 Raycast
```csharp
public bool GetRaycastHit(out RaycastHit raycastHit, LayerMask targetLayerMask, SpawnablePropBase ignoreObject)
{
    // 포인터 위치에서 카메라를 통해 Ray 생성
    var ray = raycastCamera.ScreenPointToRay(PointerPosition());

    // 가비지 생성을 방지하기 위해 비할당 Raycast 사용
    RaycastHit[] results = new RaycastHit[RaycastLimit];
    var hitLength = Physics.RaycastNonAlloc(ray, results, raycastMaxDistance, targetLayerMask);

    // 충돌이 없으면 실패 반환
    if (hitLength == 0)
    {
        raycastHit = new RaycastHit();
        return false;
    }

    // BoxCollider만 허용하고 최소 거리 이상인 결과만 필터링
    results = Array.FindAll(results, raycastHit =>
        raycastHit.collider is BoxCollider
        && raycastHit.distance > raycastMinDistance);

    // 필터링 후 결과가 없으면 실패 반환
    if (results.Length == 0)
    {
        raycastHit = new RaycastHit();
        return false;
    }

    // 무시할 오브젝트 제거
    results = RemoveIgnoring(results, ignoreObject);

    // 무시 후 결과가 없으면 실패 반환
    if (results.Length == 0)
    {
        raycastHit = new RaycastHit();
        return false;
    }

    // 거리순으로 정렬하여 가장 가까운 충돌 선택
    Array.Sort(results, (raycast1, raycast2) => raycast1.distance.CompareTo(raycast2.distance));
    raycastHit = results.First();
    return true;
}
```

### UI 포인터 검증
```csharp
public bool IsPointerOnUI()
{
    // 씬의 모든 GraphicRaycaster를 찾음
    var graphicRaycaster = FindObjectsOfType<GraphicRaycaster>();

    // 포인터 이벤트 데이터 생성
    var pointerEvent = new PointerEventData(_eventSystem);
    var raycastResult = new List<RaycastResult>();
    pointerEvent.position = PointerPosition();

    // 각 Raycaster에 대해 Raycast 수행
    foreach (var raycaster in graphicRaycaster)
    {
        raycaster.Raycast(pointerEvent, raycastResult);
    }

    // Raycast 결과가 있으면 UI 위에 있는 것으로 판단
    return raycastResult.Count > 0;
}
```

### 무시 오브젝트 필터링
```csharp
private RaycastHit[] RemoveIgnoring(RaycastHit[] raycastHits, SpawnablePropBase ignoreObject)
{
    var result = Array.FindAll(raycastHits, hit =>
        hit.collider.TryGetComponent<IPlaceableArea>(out var area)
        && (area.IsPlacementAreaInProp(out var propBase) == false || propBase != ignoreObject));
    return result;
}
```

## 주요 기능 설명

### Raycast 수행
- [`Physics.RaycastNonAlloc`](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Physics.RaycastNonAlloc.html): 가비지 생성 방지를 위한 비할당 Raycast
- **결과 제한**: 최대 10개의 충돌 결과만 처리
- **거리 필터링**: 최소/최대 거리 기반 필터링

### 충돌 필터링
- **BoxCollider만 허용**: 정확한 충돌 감지를 위해
- **거리 검증**: 너무 가까운 충돌 무시
- **오브젝트 무시**: 특정 SpawnablePropBase 제외

### 우선순위 처리
- **레이어 우선순위**: 특정 레이어의 오브젝트를 우선 선택
- **거리 정렬**: 가장 가까운 오브젝트 우선

### UI 검증
- **GraphicRaycaster 사용**: UI 요소에 대한 Raycast
- **모든 Raycaster 검색**: 씬의 모든 GraphicRaycaster 확인
