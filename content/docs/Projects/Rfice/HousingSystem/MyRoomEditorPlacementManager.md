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
#### **(본 문서는 AI로 작성된 프로토타입 문서입니다.)**
## 개요

`MyRoomEditorPlacementManager`는 `MyRoomEditorState`를 상속받아 오브젝트의 생성 및 배치 상태를 관리하는 클래스입니다. Raycast를 이용해 사용자의 입력에 따라 오브젝트 배치 위치를 검증하고, 배치 상태에서 이동 및 회전 처리를 담당합니다.

## 주요 역할

- **오브젝트 배치**: Raycast를 통해 배치 가능한 위치를 검증하고 오브젝트를 월드에 배치
- **실시간 위치 검증**: 코루틴을 사용한 실시간 배치 가능성 검증
- **회전 처리**: 마우스 입력에 따른 자유 회전 및 스냅 회전 지원
- **배치 취소**: ESC 키를 통한 배치 취소 및 상태 복원

## 주요 멤버

### 필드
```csharp
[Inject]
private MyRoomEditorInputUtils _inputUtils;

[SerializeField]
private GameObject placementGameObject;

[SerializeField]
private Transform placementParents;

[SerializeField]
private float rotateSnapStepValue = 45f;

public event Action OnSetActiveUIEvent;
public override event Action OnUpdatedPlacementProp;

private SpawnablePropBase _currentSpawnedProp;
private Coroutine _detector;
private Coroutine _rotator;
private bool _canPlaceable;
private bool _isMoving;
private bool _isRotating;
private int _targetLayer;
```

### 주요 메서드
```csharp
public void CancelPlacement()
public void SetPlacementTarget(GameObject targetObject)
private IEnumerator CoDetectPlacement(GameObject targetObject)
private bool PlaceableHitPoint(IMoveableProp moveableProp)
private IEnumerator CoRotationHandle()
private void Placement()
private void ReleasePlacementBehaviour()
```

## 코드 스니펫

### 전체 클래스 코드
```csharp
using System;
using System.Collections;
using Dev.Scripts.Rsup.Domain.Entities.MyRoom;
using Dev.Scripts.Rsup.Presentation.Dispatchers;
using UnityEngine;
using Zenject;

namespace Dev.Scripts.Rsup.Scenes.MyRoomEditor
{
    public class MyRoomEditorPlacementManager : MyRoomEditorState
    {
        [Inject]
        private MyRoomEditorInputUtils _inputUtils;

        [SerializeField]
        private GameObject placementGameObject;

        [SerializeField]
        private Transform placementParents;

        [SerializeField]
        private float rotateSnapStepValue = 45f;

        public event Action OnSetActiveUIEvent;

        public override event Action OnUpdatedPlacementProp;

        private SpawnablePropBase _currentSpawnedProp;
        private Coroutine _detector;
        private Coroutine _rotator;
        private bool _canPlaceable;
        private bool _isMoving;
        private bool _isRotating;
        private int _targetLayer;

        protected override void Awake()
        {
            base.Awake();
            _targetLayer = 1 << LayerMask.NameToLayer("Wall") |
                           1 << LayerMask.NameToLayer("Ground");
        }

        protected override void OnPointerDown()
        {
            if (_inputUtils.IsPointerOnUI()) return;
            if (!_canPlaceable) return;
            if (_currentSpawnedProp.PlacementType == PlacementType.Wall) return;

            _isRotating = true;
            _isMoving = false;
            _rotator = StartCoroutine(CoRotationHandle());
        }

        protected override void OnPointerUp()
        {
            if (_canPlaceable) Placement();
        }

        protected override void OnCancel()
        {
            if (placementGameObject != null) Destroy(placementGameObject);
            ReleasePlacementBehaviour();
        }

        protected override void OnRightClick()
        {
            if (placementGameObject == null) return;
            if (_currentSpawnedProp.PlacementType == PlacementType.Wall) return;
            var rotatable = placementGameObject.GetComponentInChildren<IRotatableProp>();
            rotatable?.RotationBySnapValue(rotateSnapStepValue);
        }

        protected override void Enable()
        {
            Debug.Log("PlacementEnable");
        }

        protected override void Disable()
        {
            Debug.Log("PlacementDisable");
        }

        public void CancelPlacement()
        {
            OnCancel();
        }

        public void SetPlacementTarget(GameObject targetObject)
        {
            ChangeState(MyRoomEditorStateEnum.Placement);
            targetObject.SetActive(false);
            if (placementGameObject != null) Destroy(placementGameObject);
            _isMoving = true;
            _detector = StartCoroutine(CoDetectPlacement(targetObject));
        }

        private IEnumerator CoDetectPlacement(GameObject targetObject)
        {
            targetObject.SetActive(true);
            placementGameObject = targetObject;
            if (placementGameObject.TryGetComponent(out _currentSpawnedProp) == false)
            {
                Debug.Log($"[MyRoomEditorPlacementManager] Cant found SpawnablePropBase for {targetObject.name}");
                yield break;
            }

            if (_currentSpawnedProp.TryGetComponent(out IMoveableProp moveableProp)==false)
            {
                Debug.Log($"[MyRoomEditorPlacementManager] Can't Placement Object : {targetObject.name}");
                yield break;
            }

            Debug.Log($"[MyRoomEditorPlacementManager] Start PropPlacement {targetObject.name}]");

            while (_isMoving)
            {
                _canPlaceable = PlaceableHitPoint(moveableProp);
                yield return null;
            }
        }

        private bool PlaceableHitPoint(IMoveableProp moveableProp)
        {
            if (!_inputUtils.GetRaycastHit(out var raycastHit, _targetLayer, moveableProp.PropBaseComponent)) return false;
            return raycastHit.transform.TryGetComponent(out IPlaceableArea placeableArea) &&
                   moveableProp.IsPlaceableArea(raycastHit.point, placeableArea);
        }

        private IEnumerator CoRotationHandle()
        {
            while (_isRotating)
            {
                var rotateAngle = _inputUtils.PointerDelta().x;
                placementGameObject.transform.Rotate(0, -rotateAngle, 0);
                yield return null;
            }
        }

        private void Placement()
        {
            var propBase = placementGameObject.GetComponent<SpawnablePropBase>();
            placementGameObject.transform.parent = placementParents;
            propBase.SetPlacePropInfo(_placementPresenter.CreatePlaceProp(propBase.Id, placementGameObject.transform, propBase.ParentProp?.GetPlacePropId()));
            propBase.ParentProp?.AddChildProp(propBase);
            propBase.GetEditableObject().Deselected();
            ReleasePlacementBehaviour();

            OnUpdatedPlacementProp?.Invoke();
        }

        private void ReleasePlacementBehaviour()
        {
            placementGameObject = null;

            if (_detector != null) StopCoroutine(_detector);
            if (_rotator != null) StopCoroutine(_rotator);
            _isMoving = false;
            _isRotating = false;
            _canPlaceable = false;
            ChangeState(MyRoomEditorStateEnum.Edit);

            OnSetActiveUIEvent?.Invoke();
        }
    }
}
```

### 배치 검증 로직
```csharp
private bool PlaceableHitPoint(IMoveableProp moveableProp)
{
    if (!_inputUtils.GetRaycastHit(out var raycastHit, _targetLayer, moveableProp.PropBaseComponent)) return false;
    return raycastHit.transform.TryGetComponent(out IPlaceableArea placeableArea) &&
           moveableProp.IsPlaceableArea(raycastHit.point, placeableArea);
}
```

### 회전 처리 코루틴
```csharp
private IEnumerator CoRotationHandle()
{
    while (_isRotating)
    {
        var rotateAngle = _inputUtils.PointerDelta().x;
        placementGameObject.transform.Rotate(0, -rotateAngle, 0);
        yield return null;
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
- `IPlaceableArea` 인터페이스를 통한 배치 영역 검증
- 실시간으로 배치 가능성 피드백 제공

## 의존성

- `MyRoomEditorInputUtils`: 입력 유틸리티
- `IMoveableProp`: 이동 가능한 오브젝트 인터페이스
- `IPlaceableArea`: 배치 영역 인터페이스
- `IRotatableProp`: 회전 가능한 오브젝트 인터페이스

## 관련 클래스

- **부모 클래스**: `MyRoomEditorState`
- **관련 인터페이스**: `IMoveableProp`, `IRotatableProp`, `IPlaceableArea`
- **상태 전환**: `MyRoomEditorStateEnum.Placement` ↔ `MyRoomEditorStateEnum.Edit`
