+++
title = "MyRoomEditorPlacementManager"
description = "오브젝트 생성 및 배치 상태를 관리하는 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 403
+++

## 개요

`MyRoomEditorPlacementManager`는 [`MyRoomEditorState`](/docs/projects/rfice/housingsystem/myroomeditorstate/)를 상속받아 오브젝트의 생성 및 배치를 관리하는 클래스. Raycast를 이용해 사용자의 입력에 따라 오브젝트 배치 위치를 검증하고, 배치 상태에서 이동 및 회전 처리를 담당.

## 주요 역할

- **오브젝트 배치**: Raycast를 통해 배치 가능한 위치를 검증하고 오브젝트를 월드에 배치.
- **실시간 위치 검증**: 코루틴을 사용한 실시간 배치 검증.
- **회전 처리**: 마우스 입력에 따른 자유 회전 및 스냅 회전 지원.
- **배치 취소**: ESC 키를 통한 배치 취소 및 상태 복원.

## 주요 멤버

### 필드
```csharp
/// <summary>
/// 입력 유틸리티 클래스. 마우스 입력 및 Raycast 처리를 담당.
/// Zenject를 통해 주입되며, 입력 관련 공통 로직을 제공.
/// </summary>
[Inject]
private MyRoomEditorInputUtils _inputUtils;

/// <summary>
/// 현재 배치 중인 게임 오브젝트.
/// 배치 과정에서 실시간으로 위치와 회전을 조정.
/// </summary>
private GameObject placementGameObject;

/// <summary>
/// 배치된 오브젝트들의 부모 트랜스폼.
/// 배치 완료 시 오브젝트를 이 부모 아래로 이동시켜 계층 구조 유지.
/// </summary>
private Transform placementParents;

/// <summary>
/// 우클릭 시 회전할 스냅 각도 (기본값: 45도).
/// Inspector에서 조정 가능.
/// </summary>
[SerializeField]
private float rotateSnapStepValue = 45f;

/// <summary>
/// 현재 배치 중인 SpawnablePropBase 컴포넌트.
/// 배치 타입과 속성을 확인하기 위해 사용.
/// </summary>
private SpawnablePropBase _currentSpawnedProp;

/// <summary>
/// 배치 가능 위치를 검증하는 코루틴.
/// 실시간으로 Raycast를 수행하여 배치 가능성을 체크.
/// </summary>
private Coroutine _detector;

/// <summary>
/// 회전 처리를 담당하는 코루틴.
/// 마우스 드래그 중 실시간 회전을 수행.
/// </summary>
private Coroutine _rotator;

/// <summary>
/// 현재 위치에서 배치 가능한지 여부.
/// 검증 결과에 따라 배치 가능/불가능 상태를 나타냄.
/// </summary>
private bool _canPlaceable;

/// <summary>
/// 오브젝트가 이동/회전 중인지 여부.
/// 특정 조작의 실행 조건으로 사용.
/// </summary>
private bool _isMoving;
private bool _isRotating;

/// <summary>
/// Raycast 대상 레이어 마스크.
/// Wall과 Ground 레이어만 검출하도록 설정.
/// </summary>
private int _targetLayer;
```

### 주요 메서드
```csharp
/// <summary>
/// 배치를 취소하는 public 메서드.
/// 외부에서 배치 취소를 요청할 때 사용.
/// </summary>
public void CancelPlacement()

/// <summary>
/// 배치 대상을 설정하고 배치 모드로 전환.
/// 기존 배치 오브젝트가 있을 경우 정리하고 새 오브젝트로 배치 검증 시작.
/// </summary>
/// <param name="targetObject">배치할 대상 게임 오브젝트</param>
public void SetPlacementTarget(GameObject targetObject)

/// <summary>
/// 배치 가능 위치를 실시간으로 검증하는 코루틴.
/// 오브젝트의 이동 중 배치 가능성을 지속적으로 체크.
/// </summary>
/// <param name="targetObject">검증할 대상 오브젝트</param>
private IEnumerator CoDetectPlacement(GameObject targetObject)

/// <summary>
/// 특정 이동 가능 오브젝트의 배치 가능 위치를 검증.
/// Raycast를 통해 충돌 지점을 찾고, 배치 영역 인터페이스로 검증.
/// </summary>
/// <param name="moveableProp">검증할 이동 가능 오브젝트</param>
/// <returns>배치 가능한지 여부</returns>
private bool PlaceableHitPoint(IMoveableProp moveableProp)

/// <summary>
/// 마우스 드래그 중 실시간 회전을 처리하는 코루틴.
/// 마우스 이동량에 따라 Y축 회전을 적용.
/// </summary>
private IEnumerator CoRotationHandle()

/// <summary>
/// 실제 오브젝트 배치를 수행.
/// 배치 정보를 설정하고 부모 관계를 구성한 후 편집 모드로 전환.
/// </summary>
private void Placement()

/// <summary>
/// 배치 관련 동작을 정리하고 편집 모드로 전환.
/// 코루틴 중단, 플래그 초기화, 상태 변경.
/// </summary>
private void ReleasePlacementBehaviour()
```

## 코드 스니펫

### 오브젝트 배치 프로세스
```csharp
public void SetPlacementTarget(GameObject targetObject)
{
    ChangeState(MyRoomEditorStateEnum.Placement);  // 배치 상태로 전환
    targetObject.SetActive(false);  // 임시 비활성화
    if (placementGameObject != null) Destroy(placementGameObject);  // 기존 오브젝트 제거
    _isMoving = true;  // 이동 모드 활성화
    _detector = StartCoroutine(CoDetectPlacement(targetObject));  // 배치 검증 코루틴 시작
}

private IEnumerator CoDetectPlacement(GameObject targetObject)
{
    targetObject.SetActive(true);  // 오브젝트 활성화
    placementGameObject = targetObject;  // 배치 오브젝트 설정

    // SpawnablePropBase 컴포넌트 확인
    if (placementGameObject.TryGetComponent(out _currentSpawnedProp) == false)
    {
        Debug.Log($"[MyRoomEditorPlacementManager] Cant found SpawnablePropBase for {targetObject.name}");
        yield break;  // 컴포넌트 없으면 중단
    }

    // IMoveableProp 인터페이스 확인
    if (_currentSpawnedProp.TryGetComponent(out IMoveableProp moveableProp)==false)
    {
        Debug.Log($"[MyRoomEditorPlacementManager] Can't Placement Object : {targetObject.name}");
        yield break;  // 인터페이스 없으면 중단
    }

    Debug.Log($"[MyRoomEditorPlacementManager] Start PropPlacement {targetObject.name}]");

    // 이동 중 배치 가능성 검증 루프
    while (_isMoving)
    {
        _canPlaceable = PlaceableHitPoint(moveableProp);  // 배치 가능성 체크
        yield return null;  // 다음 프레임까지 대기
    }
}

private bool PlaceableHitPoint(IMoveableProp moveableProp)
{
    // Raycast 수행
    if (!_inputUtils.GetRaycastHit(out var raycastHit, _targetLayer, moveableProp.PropBaseComponent)) return false;

    // 배치 영역 인터페이스 확인 및 검증
    return raycastHit.transform.TryGetComponent(out IPlaceableArea placeableArea) &&
           moveableProp.IsPlaceableArea(raycastHit.point, placeableArea);
}

protected override void OnPointerUp()
{
    if (_canPlaceable) Placement();  // 배치 수행
}

private void Placement()
{
    var propBase = placementGameObject.GetComponent<SpawnablePropBase>();  // 컴포넌트 획득
    placementGameObject.transform.parent = placementParents;  // 부모 설정

    // 배치 정보 설정 (프리젠터를 통해 데이터 생성)
    propBase.SetPlacePropInfo(_placementPresenter.CreatePlaceProp(propBase.Id, placementGameObject.transform, propBase.ParentProp?.GetPlacePropId()));

    // 부모-자식 관계 구성
    propBase.ParentProp?.AddChildProp(propBase);

    // 선택 해제
    propBase.GetEditableObject().Deselected();

    // 배치 동작 정리
    ReleasePlacementBehaviour();

    // 이벤트 호출
    OnUpdatedPlacementProp?.Invoke();
}
```

### 회전 처리 코루틴
```csharp
protected override void OnPointerDown()
{
    if (_inputUtils.IsPointerOnUI()) return;  // UI 위에서 클릭 시 무시
    if (!_canPlaceable) return;  // 배치 불가능 시 무시
    if (_currentSpawnedProp.PlacementType == PlacementType.Wall) return;  // 벽 부착 오브젝트는 회전 불가

    _isRotating = true;  // 회전 모드 활성화
    _isMoving = false;   // 이동 모드 비활성화
    _rotator = StartCoroutine(CoRotationHandle());  // 회전 코루틴 시작
}

private IEnumerator CoRotationHandle()
{
    while (_isRotating)  // 회전 모드 중
    {
        var rotateAngle = _inputUtils.PointerDelta().x;  // 마우스 X축 이동량
        placementGameObject.transform.Rotate(0, -rotateAngle, 0);  // Y축 회전 적용
        yield return null;  // 다음 프레임까지 대기
    }
}
```

## 주요 기능 설명

### 배치 프로세스
1. `SetPlacementTarget()` 호출로 배치 모드 시작
2. `CoDetectPlacement` 코루틴이 실시간으로 배치 가능 위치 검증
3. 마우스 클릭으로 배치 완료 (`Placement()`)
4. 배치 후 편집 모드로 전환

### 입력 처리
- **좌클릭**: 배치 위치 선택
- **우클릭**: 스냅 회전 (45도 단위)
- **ESC**: 배치 취소

### 배치 검증
- Physics.Raycast를 사용한 충돌 감지
- [`IPlaceableArea`](/docs/projects/rfice/housingsystem/iplaceablearea/) 인터페이스를 통한 배치 영역 검증
- 실시간으로 배치 가능성 피드백 제공

## 관련 클래스
- [`MyRoomEditorState`](/docs/projects/rfice/housingsystem/myroomeditorstate/): 부모 클래스
- [`MyRoomEditorInputUtils`](/docs/projects/rfice/housingsystem/myroomeditorinpututils/): 입력 유틸리티
- [`IMoveableProp`](/docs/projects/rfice/housingsystem/imoveableprop/): 이동 가능한 오브젝트 인터페이스
- [`IPlaceableArea`](/docs/projects/rfice/housingsystem/iplaceablearea/): 배치 영역 인터페이스
- [`IRotatableProp`](/docs/projects/rfice/housingsystem/irotateableprop/): 회전 가능한 오브젝트 인터페이스
