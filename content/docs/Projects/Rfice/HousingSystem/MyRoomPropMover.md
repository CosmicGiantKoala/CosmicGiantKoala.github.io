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

`MyRoomEditorPropMover`는 `MyRoomEditorPropEditor`를 상속받아 오브젝트의 이동을 담당하는 클래스입니다. Raycast를 통해 마우스 포인터 위치에 배치 영역 검증을 수행하고 오브젝트 이동 이벤트를 발생시킵니다.

## 주요 역할

- **오브젝트 이동**: 실시간으로 마우스 위치에 따른 오브젝트 이동
- **배치 검증**: 이동 중 실시간 배치 가능성 검증
- **기즈모 표시**: 이동 방향을 나타내는 화살표 기즈모 표시
- **회전 지원**: 이동 중 우클릭으로 스냅 회전
- **실행 취소**: ESC 키로 이동 취소 및 원래 위치 복원

## 주요 멤버

### 이벤트
```csharp
public event Action OnUpdatePlacementProp;
public event Action OnFinishMove;
```

### 필드
```csharp
[SerializeField]
private Transform defaultPropTransform;

[SerializeField]
private GameObject moveArrow;

[SerializeField]
private Material arrowMaterial;

[SerializeField]
private float rotateSnapStepValue = 45;

private IMoveableProp _moveableProp;
private IRotatableProp _rotatableProp;
private Coroutine _detector;
private int _targetLayer;
private bool _isPlaceable;
private readonly int _rotateAnglePropertyId = Shader.PropertyToID("_Angle");
private Quaternion _nonRotatablePropCachedRotation;
```

### 주요 메서드
```csharp
private IEnumerator CoDetectMove()
private bool PlaceableHitPoint()
private void SetGizmo()
private void MoveAccept()
private void SetPropParent()
private void ReleaseMovementBehaviour()
```

## 코드 스니펫

### 전체 클래스 코드
```csharp
using System;
using System.Collections;
using UnityEngine;

namespace Dev.Scripts.Rsup.Scenes.MyRoomEditor
{
    public class MyRoomEditorPropMover : MyRoomEditorPropEditor
    {
        [SerializeField]
        private Transform defaultPropTransform;
        
        [SerializeField]
        private GameObject moveArrow; 
        
        [SerializeField]
        private Material arrowMaterial;
            
        [SerializeField]
        private float rotateSnapStepValue = 45;

        public event Action OnUpdatePlacementProp; 
        public event Action OnFinishMove;
        private IMoveableProp _moveableProp;
        private IRotatableProp _rotatableProp;
        private Coroutine _detector;
        private int _targetLayer;
        private bool _isPlaceable;
        private readonly int _rotateAnglePropertyId = Shader.PropertyToID("_Angle");
        private Quaternion _nonRotatablePropCachedRotation;
        private void Awake()
        {
            _targetLayer = 1 << LayerMask.NameToLayer("Wall") | 
                           1 << LayerMask.NameToLayer("Ground");
        }

        public override void Enable()
        {
            Debug.Log($"MoveStart");
            _detector = StartCoroutine(CoDetectMove());
            moveArrow.SetActive(true);
            SetGizmo();
        }

        public override void Disable()
        {
            StopCoroutine(_detector);
        }

        public override bool Setup(IMyRoomEditorEditableObject setUpObject)
        {
            if (!setUpObject.IsMovableProp(out _moveableProp)) return false;
            SelectedObject = setUpObject;
            CachedPosition = _moveableProp.GetPosition();
            CachedParent = _moveableProp.PropBaseComponent.ParentProp;
            if (_moveableProp.IsRotatableProp(out _rotatableProp))
            {
                CachedRotation = _rotatableProp.GetRotation();
            }
            else
            {
                _nonRotatablePropCachedRotation = _moveableProp.PropBaseComponent.transform.rotation;
            }
            return true;
        }

        public override void CleanUp()
        {
            _moveableProp = null;
            _rotatableProp = null;
            SelectedObject = null;
            _isPlaceable = false;
            CachedParent = null;
        }

        public override void OnPointerDown()
        {
            if (InputUtils.IsPointerOnUI()) return;
            if (!_isPlaceable) return;
            MoveAccept();
        }

        public override void OnPointerUp()
        {
        }

        public override void OnCancel()
        {
            _moveableProp.Move(CachedPosition);
            _moveableProp.PropBaseComponent.SetPropParent(CachedParent);
            if (_rotatableProp != null)
            {
                _rotatableProp?.SetRotation(CachedRotation);
            }
            else
            {
                _moveableProp.PropBaseComponent.transform.rotation = _nonRotatablePropCachedRotation;
            }
            ReleaseMovementBehaviour();
            Debug.Log("MoveCanceled");
        }

        public override void OnRightClick()
        {
            _rotatableProp?.RotationBySnapValue(rotateSnapStepValue);
        }

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
            SetGizmo();
            if (!InputUtils.GetRaycastHit(out var raycastHit, _targetLayer, _moveableProp.PropBaseComponent)) return false;
            if (!raycastHit.transform.TryGetComponent(out IPlaceableArea placeableArea) ||
                !_moveableProp.IsPlaceableArea(raycastHit.point, placeableArea)) return false;
            return true;
        }

        private void SetGizmo()
        {
            var pivotPoint = _moveableProp.GetGizmoPositionAndRotation();
            moveArrow.transform.position = pivotPoint.Item1;
            moveArrow.transform.rotation = pivotPoint.Item2;
        }

        private void MoveAccept()
        {
            SetPropParent();
            ReleaseMovementBehaviour();
            OnUpdatePlacementProp?.Invoke();
        }

        private void SetPropParent()
        {
            if (CachedParent == null)
            {
                if (_moveableProp.PropBaseComponent.ParentProp == null) return;
                _moveableProp.PropBaseComponent.ParentProp.AddChildProp(_moveableProp.PropBaseComponent);
                Debug.Log($"[MyRoomEditorPropMover] {_moveableProp.PropBaseComponent.Id} Changed Parent {_moveableProp.PropBaseComponent.ParentProp.Id}");
            }
            else
            {
                if (_moveableProp.PropBaseComponent.ParentProp == null)
                {
                    CachedParent.RemoveChildProp(_moveableProp.PropBaseComponent);
                    _moveableProp.PropBaseComponent.transform.parent = defaultPropTransform;
                    _moveableProp.PropBaseComponent.ClearPropParent();
                    Debug.Log($"[MyRoomEditorPropMover] {_moveableProp.PropBaseComponent.Id} Release Parent");
                }
                else
                {
                    if (_moveableProp.PropBaseComponent.ParentProp.GetPlacePropId() ==
                        CachedParent.GetPlacePropId()) return;
                    _moveableProp.PropBaseComponent.ParentProp.AddChildProp(_moveableProp.PropBaseComponent);
                    CachedParent.RemoveChildProp(_moveableProp.PropBaseComponent);
                    Debug.Log($"[MyRoomEditorPropMover] {_moveableProp.PropBaseComponent.ParentProp.GetPlacePropId()} Added Child {_moveableProp.PropBaseComponent.GetPlacePropId()}");
                    Debug.Log($"[MyRoomEditorPropMover] {CachedParent.GetPlacePropId()} Remove Child {_moveableProp.PropBaseComponent.GetPlacePropId()}");
                }
            }
        }

        private void ReleaseMovementBehaviour()
        {
            StopCoroutine(_detector);
            SelectedObject.Deselected();
            CleanUp();
            moveArrow.SetActive(false);
            Debug.Log("MovementReleased");
            OnFinishMove?.Invoke();
        }
    }
}
```

### 이동 감지 코루틴
```csharp
private IEnumerator CoDetectMove()
{
    while (true)
    {
        _isPlaceable = PlaceableHitPoint();
        yield return null;
    }
}
```

### 배치 검증 및 이동 로직
```csharp
private bool PlaceableHitPoint()
{
    SetGizmo();
    if (!InputUtils.GetRaycastHit(out var raycastHit, _targetLayer, _moveableProp.PropBaseComponent)) return false;
    if (!raycastHit.transform.TryGetComponent(out IPlaceableArea placeableArea) ||
        !_moveableProp.IsPlaceableArea(raycastHit.point, placeableArea)) return false;
    return true;
}
```

### 부모 설정 로직
```csharp
private void SetPropParent()
{
    if (CachedParent == null)
    {
        if (_moveableProp.PropBaseComponent.ParentProp == null) return;
        _moveableProp.PropBaseComponent.ParentProp.AddChildProp(_moveableProp.PropBaseComponent);
        Debug.Log($"[MyRoomEditorPropMover] {_moveableProp.PropBaseComponent.Id} Changed Parent {_moveableProp.PropBaseComponent.ParentProp.Id}");
    }
    else
    {
        if (_moveableProp.PropBaseComponent.ParentProp == null)
        {
            CachedParent.RemoveChildProp(_moveableProp.PropBaseComponent);
            _moveableProp.PropBaseComponent.transform.parent = defaultPropTransform;
            _moveableProp.PropBaseComponent.ClearPropParent();
            Debug.Log($"[MyRoomEditorPropMover] {_moveableProp.PropBaseComponent.Id} Release Parent");
        }
        else
        {
            if (_moveableProp.PropBaseComponent.ParentProp.GetPlacePropId() ==
                CachedParent.GetPlacePropId()) return;
            _moveableProp.PropBaseComponent.ParentProp.AddChildProp(_moveableProp.PropBaseComponent);
            CachedParent.RemoveChildProp(_moveableProp.PropBaseComponent);
            Debug.Log($"[MyRoomEditorPropMover] {_moveableProp.PropBaseComponent.ParentProp.GetPlacePropId()} Added Child {_moveableProp.PropBaseComponent.GetPlacePropId()}");
            Debug.Log($"[MyRoomEditorPropMover] {CachedParent.GetPlacePropId()} Remove Child {_moveableProp.PropBaseComponent.GetPlacePropId()}");
        }
    }
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

## 의존성

- `MyRoomEditorInputUtils`: Raycast 및 입력 처리
- `IMoveableProp`: 이동 가능한 오브젝트 인터페이스
- `IRotatableProp`: 회전 가능한 오브젝트 인터페이스
- `IPlaceableArea`: 배치 영역 인터페이스

## 관련 클래스

- **부모 클래스**: `MyRoomEditorPropEditor`
- **사용자**: `MyRoomEditorPropEditingManager`
- **관련 인터페이스**: `IMoveableProp`, `IRotatableProp`, `IPlaceableArea`
