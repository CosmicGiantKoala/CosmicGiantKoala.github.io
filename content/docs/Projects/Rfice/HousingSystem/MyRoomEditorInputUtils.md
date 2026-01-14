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

MyRoomEditorInputUtils는 MyRoomEditor에서 입력 관련 유틸리티 기능을 제공하는 클래스입니다. Unity의 Physics Raycast를 사용하여 포인터 위치 기반 레이캐스트를 수행하고, 결과를 필터링하며, UI 요소 클릭 감지와 포인터 입력 값 제공 기능을 포함합니다. 편집 및 배치 작업에서 정확한 타겟 감지를 지원합니다.

## 역할
- 포인터 기반 레이캐스트 수행 및 결과 반환
- 무시할 오브젝트 필터링을 통한 정확한 타겟 감지
- 우선순위 레이어 기반 레이캐스트 결과 선택
- 포인터 위치 및 델타 값 제공
- UI 요소 위 포인터 감지

## 멤버

### 속성
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

### 메서드
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
- 결과 제한: 최대 10개의 충돌 결과만 처리
- 거리 필터링: 최소/최대 거리 기반 필터링
- `GetRaycastHit` (무시 오브젝트 버전): 포인터 위치에서 레이캐스트를 수행하고, 지정된 ignoreObject를 제외한 가장 가까운 BoxCollider를 가진 오브젝트를 반환. 최소/최대 거리 필터링을 적용.
- `GetRaycastHit` (우선순위 레이어 버전): 레이캐스트 결과를 우선순위 레이어에 따라 선택. 우선순위 레이어의 오브젝트가 있으면 이를, 없으면 가장 가까운 오브젝트를 반환.

### 포인터 입력 처리
- `PointerDelta()`: 마우스 또는 터치 입력의 델타 값을 반환.
- `PointerPosition()`: 현재 포인터의 화면 좌표를 반환.

### UI 감지
- `IsPointerOnUI()`: [`GraphicRaycaster`](https://docs.unity3d.com/2019.1/Documentation/ScriptReference/UI.GraphicRaycaster.html)를 사용하여 포인터가 UI 요소 위에 있는지 확인. UI 클릭을 방지하기 위해 편집 작업에서 사용.

### 결과 필터링
- `RemoveIgnoring()`: [`IPlaceableArea`](/docs/projects/rfice/HousingSystem/IPlaceableArea) 인터페이스를 구현한 오브젝트 중 ignoreObject와 다른 경우만 유지. 배치 작업에서 자기 자신을 무시하기 위해 사용.

## 의존성/상속 관계
- `MonoBehaviour`를 상속받음.
- [`InputSystem`](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.17/manual/index.html), [`UGUI`](https://docs.unity3d.com/Packages/com.unity.ugui@2.0/manual/index.html) 사용.
- [`IPlaceableArea`](/docs/projects/rfice/HousingSystem/IPlaceableArea), [`SpawnablePropBase`](/docs/projects/rfice/HousingSystem/SpawnablePropBase)에 의존.

## 사용 예시
### [`MyRoomEditorPropSelector`](/docs/projects/rfice/housingsystem/myroompropselector/)에서 레이캐스트를 통해 오브젝트 선택
```csharp
private IEnumerator CoDetectObject()
{
    while (true)
    {
        yield return null;

        if (InputUtils.GetRaycastHit(out RaycastHit hits, _targetLayer, _firstPriorityLayer))
        {
            if (hits.transform.TryGetComponent(out IMyRoomEditorEditableObject focusedObject)
                && InputUtils.IsPointerOnUI() == false)
            {
                if (focusedObject.Equals(_focusedObject)) continue;
                if (IsSelectedObject(focusedObject))
                {
                    _focusedObject?.Unfocused();
                    _focusedObject = focusedObject;
                }
                else
                {
                    if (IsSelectedObject(_focusedObject) == false)
                    {
                        _focusedObject?.Unfocused();
                    }
                    _focusedObject = focusedObject;
                    _focusedObject.Focused();
                }
            }
            else
            {
                //Unfocus조건
                //1. 선택된 오브젝트는 Unfocus되지 않는다.
                //2. 선택된 오브젝트가 아니며 포커싱 중인 오브젝트가 있는 경우는 Unfocus 한다.
                if (IsSelectedObject(_focusedObject))
                {
                    _focusedObject = null;
                }
                else
                {
                    _focusedObject?.Unfocused();
                    _focusedObject = null;
                }
            }
        }
    }
}
```

### [`MyRoomEditorPropMover`](/docs/projects/rfice/housingsystem/myroompropmover/)에서 UI위에 포인터가 올라간 상태에서 `PointerDown()` 시 동작하지 않게 적용
```csharp
public override void OnPointerDown()
{
    if (InputUtils.IsPointerOnUI()) return;
    if (!_isPlaceable) return;
    MoveAccept();
}
```

## 관련 클래스
- [`MyRoomEditorPropEditingManager`](/docs/projects/rfice/HousingSystem/MyRoomEditorPropEditingManager)
- [`MyRoomEditorPlacementManager`](/docs/projects/rfice/HousingSystem/MyRoomEditorPlacementManager)
- [`SpawnablePropBase`](/docs/projects/rfice/HousingSystem/SpawnablePropBase)
- [`IPlaceableArea`](/docs/projects/rfice/HousingSystem/IPlaceableArea)
- [`MyRoomEditorPropSelector`](/docs/projects/rfice/housingsystem/myroompropselector/)
- [`MyRoomEditorPropMover`](/docs/projects/rfice/housingsystem/myroompropmover/)
- [`MyRoomEditorPropRotator`](/docs/projects/rfice/housingsystem/myroomproprotator/)