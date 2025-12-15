+++
title = "MyRoomEditorPropSelector"
description = "오브젝트의 선택을 담당하는 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 406
+++

## 개요

`MyRoomEditorPropSelector`는 `MyRoomEditorPropEditor`를 상속받아 오브젝트의 선택을 담당하는 클래스입니다. Raycast를 이용해 편집 가능한 오브젝트를 선택하고, 결과 이벤트를 발생시킵니다.

## 주요 역할

- **오브젝트 감지**: 실시간으로 마우스 포인터 아래의 편집 가능 오브젝트 감지
- **선택 처리**: 클릭을 통해 오브젝트 선택 및 선택 해제
- **포커스 관리**: 오브젝트에 대한 포커스 상태 관리 (Focused/Unfocused)
- **레이어 우선순위**: Prop 레이어를 우선적으로 처리하는 레이어 마스크 관리

## 주요 멤버

### 이벤트
```csharp
public event Action<IMyRoomEditorEditableObject> OnObjectSelect;
public event Action OnReleaseSelect;
```

### 필드
```csharp
private Coroutine _detector;
private IMyRoomEditorEditableObject _focusedObject;
private int _targetLayer;
private int _firstPriorityLayer;
private const string MyRoomPropLayerNameKey = "MyRoomProp";
private const string MyRoomWallLayerNameKey = "Wall";
private const string MyRoomGroundLayerNameKey = "Ground";
```

### 주요 메서드
```csharp
private IEnumerator CoDetectObject()
private bool IsSelectedObject(IMyRoomEditorEditableObject focusedObject)
private void ReleaseSelect()
```

## 코드 스니펫

### 전체 클래스 코드
```csharp
using System;
using System.Collections;
using JetBrains.Annotations;
using UnityEngine;

namespace Dev.Scripts.Rsup.Scenes.MyRoomEditor
{
    public class MyRoomEditorPropSelector : MyRoomEditorPropEditor
    {
        public event Action<IMyRoomEditorEditableObject> OnObjectSelect;
        public event Action OnReleaseSelect;
        
        private Coroutine _detector;
        private IMyRoomEditorEditableObject _focusedObject;
        private int _targetLayer;
        private int _firstPriorityLayer;
        private const string MyRoomPropLayerNameKey = "MyRoomProp";
        private const string MyRoomWallLayerNameKey = "Wall";
        private const string MyRoomGroundLayerNameKey = "Ground";
        
        private void Awake()
        {
            _targetLayer =  1 << LayerMask.NameToLayer(MyRoomWallLayerNameKey) |
                            1 << LayerMask.NameToLayer(MyRoomPropLayerNameKey) |
                            1 << LayerMask.NameToLayer(MyRoomGroundLayerNameKey);
            
            _firstPriorityLayer = LayerMask.NameToLayer(MyRoomPropLayerNameKey);
        }

        public override void Enable()
        {
            _detector = StartCoroutine(CoDetectObject());
        }

        public override void Disable()
        {
            if (_detector != null)
            {
                StopCoroutine(_detector);
            }

            _focusedObject?.Deselected();
            _focusedObject = null;
            SelectedObject = null;
        }

        public override bool Setup(IMyRoomEditorEditableObject setUpObject)
        {
            return true;
        }

        public override void CleanUp()
        {
            ReleaseSelect();
        }

        public override void OnPointerDown()
        {
            if (InputUtils.IsPointerOnUI()) return;
            //현재는 벽에대한 편집 기능이 없어 벽 클릭시 선택이 Release되게함
            if (_focusedObject == null || _focusedObject.IsPlacementArea(out var area))
            {
                ReleaseSelect();
            }
            else
            {
                if (_focusedObject.Equals(SelectedObject))
                {
                    ReleaseSelect();
                    return;
                }
                SelectedObject?.Deselected();
                SelectedObject = _focusedObject;
                SelectedObject.Selected();
                Debug.Log($"[MyRoomEditorPropSelector] Object Selected {SelectedObject.GetPlacePropId()}");
                OnObjectSelect?.Invoke(SelectedObject);
            }
        }

        public override void OnPointerUp()
        {
        }

        public override void OnCancel()
        {
            ReleaseSelect();
        }

        public override void OnRightClick()
        {
        }

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

        private bool IsSelectedObject([CanBeNull] IMyRoomEditorEditableObject focusedObject)
        {
            return focusedObject != null && focusedObject.Equals(SelectedObject);
        }

        private void ReleaseSelect()
        {
            SelectedObject?.Deselected();
            SelectedObject = null;
            _focusedObject?.Deselected();
            _focusedObject = null;
            OnReleaseSelect?.Invoke();
        }
    }
}
```

### 오브젝트 감지 코루틴
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

### 선택 처리 로직
```csharp
public override void OnPointerDown()
{
    if (InputUtils.IsPointerOnUI()) return;
    //현재는 벽에대한 편집 기능이 없어 벽 클릭시 선택이 Release되게함
    if (_focusedObject == null || _focusedObject.IsPlacementArea(out var area))
    {
        ReleaseSelect();
    }
    else
    {
        if (_focusedObject.Equals(SelectedObject))
        {
            ReleaseSelect();
            return;
        }
        SelectedObject?.Deselected();
        SelectedObject = _focusedObject;
        SelectedObject.Selected();
        Debug.Log($"[MyRoomEditorPropSelector] Object Selected {SelectedObject.GetPlacePropId()}");
        OnObjectSelect?.Invoke(SelectedObject);
    }
}
```

## 주요 기능 설명

### 레이어 관리
- **타겟 레이어**: Wall, MyRoomProp, Ground 레이어 포함
- **우선순위 레이어**: MyRoomProp 레이어를 최우선으로 처리

### 오브젝트 상태
- **Focused**: 마우스가 오브젝트 위에 있음 (시각적 피드백)
- **Selected**: 클릭으로 선택됨 (편집 가능 상태)
- **Unfocused**: 마우스가 오브젝트에서 벗어남

### 선택 로직
1. 같은 오브젝트 재클릭 시 선택 해제
2. 다른 오브젝트 클릭 시 이전 선택 해제 후 새 오브젝트 선택
3. 배치 영역(벽, 바닥) 클릭 시 선택 해제
4. UI 위에서는 선택 동작 무시

### 실시간 감지
- 매 프레임마다 Raycast 수행
- UI 위에서는 감지하지 않음
- 선택된 오브젝트는 계속 선택 상태 유지

## 의존성

- `MyRoomEditorInputUtils`: Raycast 및 UI 감지 유틸리티
- `IMyRoomEditorEditableObject`: 편집 가능한 오브젝트 인터페이스

## 관련 클래스

- **부모 클래스**: `MyRoomEditorPropEditor`
- **사용자**: `MyRoomEditorPropEditingManager`
- **관련 인터페이스**: `IMyRoomEditorEditableObject`, `IPlaceableArea`
