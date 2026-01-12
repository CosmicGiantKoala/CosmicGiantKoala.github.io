+++
title = "MyRoomEditorPropMover"
description = "오브젝트의 이동을 담당하는 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 407
+++

## 개요

`MyRoomEditorPropMover`는 [`MyRoomEditorPropEditor`](/docs/projects/rfice/housingsystem/myroompropeditor/)를 상속받아 오브젝트의 이동을 담당하는 클래스. Raycast를 통해 마우스 포인터 위치에 배치 영역 검증을 수행하고 오브젝트 이동 이벤트를 발생.

## 주요 역할

- **오브젝트 이동**: 실시간으로 마우스 위치에 따른 오브젝트 이동
- **배치 검증**: 이동 중 실시간 배치 가능성 검증
- **기즈모 표시**: 이동 방향을 나타내는 화살표 기즈모 표시
- **회전 지원**: 이동 중 우클릭으로 스냅 회전
- **실행 취소**: ESC 키로 이동 취소 및 원래 위치 복원

## 주요 멤버

### 이벤트
```csharp
/// <summary>
/// 오브젝트 이동 완료시 발생되는 이벤트
/// </summary>
public event Action OnFinishMove;
```

### 필드
```csharp
/// <summary>
/// 이동 시 부모가 없을 때 사용할 기본 트랜스폼.
/// </summary>
[SerializeField]
private Transform defaultPropTransform;

/// <summary>
/// 이동 방향을 표시하는 화살표 기즈모 오브젝트.
/// </summary>
[SerializeField]
private GameObject moveArrow;

/// <summary>
/// 우클릭 시 회전 스냅 값 (45도 단위).
/// </summary>
[SerializeField]
private float rotateSnapStepValue = 45;

/// <summary>
/// 이동 가능한 프로퍼티 인터페이스 참조.
/// </summary>
private IMoveableProp _moveableProp;

/// <summary>
/// 회전 가능한 프로퍼티 인터페이스 참조 (optinal).
/// </summary>
private IRotatableProp _rotatableProp;

/// <summary>
/// 이동 감지 코루틴 참조.
/// </summary>
private Coroutine _detector;

/// <summary>
/// 레이캐스트 타겟 레이어 마스크.
/// </summary>
private int _targetLayer;

/// <summary>
/// 현재 위치가 배치 가능한지 여부.
/// </summary>
private bool _isPlaceable;

/// <summary>
/// 회전 불가능한 오브젝트의 초기 회전 값 캐시.
/// </summary>
private Quaternion _nonRotatablePropCachedRotation;
```

### 주요 메서드
```csharp
/// <summary>
/// 이동할 오브젝트 설정 메서드.
/// </summary>
/// <param name="setUpObject">설정할 편집 가능 오브젝트</param>
/// <returns>설정 성공 여부</returns>
public override bool Setup(IMyRoomEditorEditableObject setUpObject)

/// <summary>
/// 이동 모드 활성화 메서드.
/// </summary>
public override void Enable()

/// <summary>
/// 마우스 클릭 이벤트 핸들러.
/// </summary>
public override void OnPointerDown()

/// <summary>
/// 오브젝트 이동 상태일때 활성화 되는 이동감지 코루틴.
/// </summary>
private IEnumerator CoDetectMove()

/// <summary>
/// 배치 가능한 히트 포인트인지 확인하는 메서드.
/// </summary>
/// <returns>배치 가능 여부</returns>
private bool PlaceableHitPoint()

/// <summary>
/// 이동 확정 메서드.
/// </summary>
private void MoveAccept()

/// <summary>
/// 오브젝트 부모 관계 설정 메서드.
/// </summary>
private void SetPropParent()

/// <summary>
/// 이동 동작 해제 메서드.
/// </summary>
private void ReleaseMovementBehaviour()

/// <summary>
/// 이동 취소 이벤트 핸들러 (ESC 키).
/// </summary>
public override void OnCancel()
```

## 코드 스니펫

### 이동 모드 시작 프로세스
```csharp
public override bool Setup(IMyRoomEditorEditableObject setUpObject)
{
    if (!setUpObject.IsMovableProp(out _moveableProp)) return false; // 이동 가능한 프로퍼티인지 확인, 아니면 false 반환
    SelectedObject = setUpObject; // 선택된 오브젝트 설정
    CachedPosition = _moveableProp.GetPosition(); // 초기 위치 캐시
    CachedParent = _moveableProp.PropBaseComponent.ParentProp; // 초기 부모 캐시
    if (_moveableProp.IsRotatableProp(out _rotatableProp)) // 회전 가능한 프로퍼티인지 확인
    {
        CachedRotation = _rotatableProp.GetRotation(); // 회전 값 캐시
    }
    else // 회전 불가능한 경우
    {
        _nonRotatablePropCachedRotation = _moveableProp.PropBaseComponent.transform.rotation; // 회전 값 캐시
    }
    return true; // 설정 성공
}

public override void Enable()
{
_detector = StartCoroutine(CoDetectMove()); // 이동 감지 코루틴 시작
moveArrow.SetActive(true); // 이동 화살표 기즈모 활성화
SetGizmo(); // 기즈모 위치 설정
}
```

### 이동 감지 및 배치검증 프로세스
```csharp
private IEnumerator CoDetectMove()
{
    while (true)
    {
        _isPlaceable = PlaceableHitPoint();
        yield return null;
    }
}

private bool PlaceableHitPoint()
{
    SetGizmo(); // 기즈모 설정
    if (!InputUtils.GetRaycastHit(out var raycastHit, _targetLayer, _moveableProp.PropBaseComponent)) return false; // 레이캐스트 실패 시 false
    if (!raycastHit.transform.TryGetComponent(out IPlaceableArea placeableArea) || // 배치 영역 컴포넌트 확인
        !_moveableProp.IsPlaceableArea(raycastHit.point, placeableArea)) return false; // 배치 가능성 확인 실패 시 false
    return true; // 배치 가능
}
```

### 이동 적용 프로세스
```csharp
public override void OnPointerDown()
{
    if (InputUtils.IsPointerOnUI()) return; // UI 위에서 클릭했으면 무시
    if (!_isPlaceable) return; // 배치 불가능한 위치면 무시
    MoveAccept(); // 이동 확정
}

private void MoveAccept()
{
    SetPropParent(); // 부모 관계 설정
    ReleaseMovementBehaviour(); // 이동 동작 해제
}

private void SetPropParent()
{
    if (CachedParent == null) // 캐시된 부모가 없는 경우
    {
        if (_moveableProp.PropBaseComponent.ParentProp == null) return; // 현재 부모도 없으면 리턴
        _moveableProp.PropBaseComponent.ParentProp.AddChildProp(_moveableProp.PropBaseComponent); // 현재 부모에 자식 추가
        Debug.Log($"[MyRoomEditorPropMover] {_moveableProp.PropBaseComponent.Id} Changed Parent {_moveableProp.PropBaseComponent.ParentProp.Id}"); // 부모 변경 로그
    }
    else // 캐시된 부모가 있는 경우
    {
        if (_moveableProp.PropBaseComponent.ParentProp == null) // 현재 부모가 없는 경우
        {
            CachedParent.RemoveChildProp(_moveableProp.PropBaseComponent); // 캐시된 부모에서 자식 제거
            _moveableProp.PropBaseComponent.transform.parent = defaultPropTransform; // 기본 트랜스폼으로 부모 설정
            _moveableProp.PropBaseComponent.ClearPropParent(); // 부모 관계 클리어
            Debug.Log($"[MyRoomEditorPropMover] {_moveableProp.PropBaseComponent.Id} Release Parent"); // 부모 해제 로그
        }
        else // 현재 부모가 있는 경우
        {
            if (_moveableProp.PropBaseComponent.ParentProp.GetPlacePropId() == // 현재 부모와 캐시된 부모가 같은지 확인
                CachedParent.GetPlacePropId()) return; // 같으면 리턴
            _moveableProp.PropBaseComponent.ParentProp.AddChildProp(_moveableProp.PropBaseComponent); // 현재 부모에 자식 추가
            CachedParent.RemoveChildProp(_moveableProp.PropBaseComponent); // 캐시된 부모에서 자식 제거
            Debug.Log($"[MyRoomEditorPropMover] {_moveableProp.PropBaseComponent.ParentProp.GetPlacePropId()} Added Child {_moveableProp.PropBaseComponent.GetPlacePropId()}"); // 자식 추가 로그
            Debug.Log($"[MyRoomEditorPropMover] {CachedParent.GetPlacePropId()} Remove Child {_moveableProp.PropBaseComponent.GetPlacePropId()}"); // 자식 제거 로그
        }
    }
}

private void ReleaseMovementBehaviour()
{
    StopCoroutine(_detector); // 감지 코루틴 중지
    SelectedObject.Deselected(); // 선택 해제
    CleanUp(); // 리소스 정리
    moveArrow.SetActive(false); // 화살표 기즈모 비활성화
    OnFinishMove?.Invoke(); // 이동 완료 이벤트 호출
}
```

## 주요 기능 설명

### 이동 프로세스
1. **Setup**: 이동 가능한 오브젝트 확인 및 초기 상태 캐시
2. **Enable**: 이동 감지 코루틴 시작 및 기즈모 활성화
3. **실시간 이동**: 마우스 위치에 따른 오브젝트 이동
4. **배치 검증**: 실시간으로 배치 가능성 확인
5. **클릭으로 확정**: 마우스 클릭 시 이동 완료
6. **부모 관계 설정**: 오브젝트 계층 구조 업데이트

### 기즈모 표시
- 이동 방향을 나타내는 화살표 표시
- 오브젝트의 기즈모 위치 및 회전에 따라 표시

### 실행 취소
- ESC 키로 이동 취소
- 캐시된 위치, 회전, 부모 관계로 복원

### 부모 관계 관리
- 오브젝트가 다른 오브젝트 위에 배치될 때 부모-자식 관계 설정
- 부모 변경 시 기존 부모에서 제거하고 새 부모에 추가
- 독립 배치 시 부모 관계 해제

## 관련 클래스
- [`MyRoomEditorInputUtils`](/docs/projects/rfice/housingsystem/myroomeditorinpututils/): Raycast 및 입력 처리
- [`MyRoomEditorPropEditor`](/docs/projects/rfice/housingsystem/myroompropeditor/): 부모 클래스
- [`MyRoomEditorPropEditingManager`](/docs/projects/rfice/housingsystem/myroomeditorpropeditingmanager/): 사용 클래스
- [`IMoveableProp`](/docs/projects/rfice/housingsystem/imoveableprop/), [`IRotatableProp`](/docs/projects/rfice/housingsystem/irotateableprop/), [`IPlaceableArea`](/docs/projects/rfice/housingsystem/iplaceablearea/): 배치 검증 및 기능 인터페이스