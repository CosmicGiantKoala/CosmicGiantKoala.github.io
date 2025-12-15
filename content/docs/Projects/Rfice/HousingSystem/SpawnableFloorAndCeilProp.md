+++
title = "SpawnableFloorAndCeilProp"
description = "바닥과 천장에 배치되는 일반적인 오브젝트 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 415
+++

## 개요

`SpawnableFloorAndCeilProp`는 바닥과 천장에 배치되는 일반적인 오브젝트 클래스입니다. `SpawnablePropBase`를 상속받아 바닥(Floor)과 천장(Ceiling)에 배치 가능한 오브젝트의 기본 구현을 제공합니다.

## 주요 역할

- **편집 인터페이스 구현**: 색상 편집, 이동, 회전 기능 제공
- **하이라이트 상태 관리**: PropEditingState를 통한 시각적 피드백
- **Material 변경**: MyRoomMaterialChangeHelper를 통한 동적 색상 변경
- **기즈모 위치 계산**: 배치 타입에 따른 기즈모 위치 결정

## 구현 인터페이스

- `IColorEditableProp`: 색상 편집 기능
- `IMoveableProp`: 이동 기능
- `IRotatableProp`: 회전 기능
- `IMyRoomEditorEditableObject`: 편집 가능한 오브젝트

## 주요 멤버

### 필드
```csharp
private Collider _collider;
private PropEditingState _propEditingState;
private MyRoomMaterialChangeHelper _materialChangeHelper;
```

### 주요 메서드
```csharp
public void Delete()
protected override void SetupPropHighlight()
public void Focused()
public void Unfocused()
public void Selected()
public void Deselected()
public bool IsPlaceableArea(Vector3 hitPosition, IPlaceableArea area)
public void Move(Vector3 position)
public Quaternion GetRotation()
public void SetRotation(Quaternion rotation)
public void RotationBySnapValue(float snapStepValue)
public List<MyRoomPropColor> GetColorList()
public void SetColor(Material mat, int colorIndex)
public (Vector3, Quaternion) GetGizmoPositionAndRotation()
```

## 코드 스니펫

### 전체 클래스 코드
```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using Dev.Scripts.Rsup.Domain.Entities.MyRoom;
using Dev.Scripts.Rsup.Scenes.MyRoomEditor;
using UnityEngine;

namespace Dev.Scripts.Rsup.Scenes.Components.MyRoomEditor
{
    public class SpawnableFloorAndCeilProp : SpawnablePropBase, IColorEditableProp, IMoveableProp, IRotatableProp
    {
        private Collider _collider;
        private PropEditingState _propEditingState;
        private MyRoomMaterialChangeHelper _materialChangeHelper;

        private void Awake()
        {
            _collider = GetComponent<Collider>();
            _propEditingState = gameObject.AddComponent<PropEditingState>();
            _materialChangeHelper = GetComponentInChildren<MyRoomMaterialChangeHelper>();
            if (_materialChangeHelper != null)
            {
                _materialChangeHelper.OnChangedMaterial += SetupPropHighlight;
            }
            else
            {
                SetupPropHighlight();
            }
        }
        
        public void Delete()
        {
            if (_materialChangeHelper != null) _materialChangeHelper.OnChangedMaterial -= SetupPropHighlight;
            Debug.Log($"[SpawnableFloorAndCeilProp] Destroy {GetPlacePropId()}");
            Destroy(gameObject);
        }
        
        public override IMyRoomEditorEditableObject GetEditableObject() => this;

        #region EditableProperties
        public bool IsEditableColor(out IColorEditableProp prop)
        {
            if (MyRoomPropData.CheckColorVariation()
                && MyRoomPropData.colorList.Count > 0
                && _materialChangeHelper != null)
            {
                prop = this;
                return true;
            }
            else
            {
                prop = null;
                return false;
            }
        }

        public bool IsMovableProp(out IMoveableProp prop)
        {
            prop = this;
            return true;
        }

        public bool IsRotatableProp(out IRotatableProp prop)
        {
            prop = this;
            return true;
        }
        
        public bool IsPlacementArea(out IPlaceableArea area)
        {
            area = null;
            return false;
        }

        public bool IsPhotoFrameProp(out IPhotoFrameProp prop)
        {
            prop = null;
            return false;
        }

        #endregion
        
        #region HighlightSetting
        protected override void SetupPropHighlight()
        {
            _propEditingState.Setup();
        }

        public void Focused()
        {
            _propEditingState.Valid();
        }

        public void Unfocused()
        {
            _propEditingState.Default();
        }

        public void Selected()
        {
            _propEditingState.Selected();
        }

        public void Deselected()
        {
            _propEditingState.Default();
        }
        #endregion
        
        #region Movement Implementation
        public SpawnablePropBase PropBaseComponent => this;
        public bool  IsPlaceableArea(Vector3 hitPosition, IPlaceableArea area)
        {
            Move(hitPosition);
            if (area.GetPlacementType() != PlacementType)
            {
                _propEditingState.Invalid();
                return false;
            }
            if (area.IsPlacementAreaInProp(out var parent))
            {
                SetPropParent(parent);
            }
            else
            {
                ClearPropParent();
            }

            _propEditingState.Valid();
            return true;
        }

        public Vector3 GetPosition() => transform.position;
        public void Move(Vector3 position)
        {
            transform.position = position;
        }
        #endregion
        
        #region Rotation Implementation
        public Quaternion GetRotation() => transform.rotation;
        public void SetRotation(Quaternion rotation)
        {
            transform.rotation = rotation;
        }
        public void RotationBySnapValue(float snapStepValue)
        {
            var currentRot = transform.eulerAngles.y;
            var targetRot = Mathf.Round((currentRot + snapStepValue) / snapStepValue) * snapStepValue;
            transform.rotation = Quaternion.Euler(0,targetRot,0);
        }
        #endregion
        
        #region Change Color Implementation
        public List<MyRoomPropColor> GetColorList()
        {
            return MyRoomPropData.colorList ?? new List<MyRoomPropColor>();
        }
        public void SetColor(Material mat, int colorIndex)
        {
            var cloneMat = new Material(mat);
            _materialChangeHelper.ChangeMaterial(cloneMat);
            _propEditingState.Selected();
            CurrentColor = GetColorList()[colorIndex];
        }
        #endregion
        public (Vector3,Quaternion) GetGizmoPositionAndRotation()
        {
            var bounds = _collider.bounds;
            var gizmoRotation = Quaternion.Euler(0, 0, 0);
            Vector3 offsetDirection = PlacementType switch
            {
                PlacementType.Floor => (Vector3.up * bounds.size.y), 
                PlacementType.Ceiling => (Vector3.down * bounds.size.y),
                _ => Vector3.zero
            };
            Vector3 offset = transform.position + offsetDirection; 
            return (offset, gizmoRotation);
        }

        public bool Equals(IMyRoomEditorEditableObject other)
        {
            return other != null && GetPlacePropId() == other.GetPlacePropId();            
        }

        

    }
}
```

### 초기화 및 설정
```csharp
private void Awake()
{
    _collider = GetComponent<Collider>();
    _propEditingState = gameObject.AddComponent<PropEditingState>();
    _materialChangeHelper = GetComponentInChildren<MyRoomMaterialChangeHelper>();
    if (_materialChangeHelper != null)
    {
        _materialChangeHelper.OnChangedMaterial += SetupPropHighlight;
    }
    else
    {
        SetupPropHighlight();
    }
}
```

### 배치 가능성 검증
```csharp
public bool IsPlaceableArea(Vector3 hitPosition, IPlaceableArea area)
{
    Move(hitPosition);
    if (area.GetPlacementType() != PlacementType)
    {
        _propEditingState.Invalid();
        return false;
    }
    if (area.IsPlacementAreaInProp(out var parent))
    {
        SetPropParent(parent);
    }
    else
    {
        ClearPropParent();
    }

    _propEditingState.Valid();
    return true;
}
```

### 스냅 회전
```csharp
public void RotationBySnapValue(float snapStepValue)
{
    var currentRot = transform.eulerAngles.y;
    var targetRot = Mathf.Round((currentRot + snapStepValue) / snapStepValue) * snapStepValue;
    transform.rotation = Quaternion.Euler(0,targetRot,0);
}
```

### 색상 변경
```csharp
public void SetColor(Material mat, int colorIndex)
{
    var cloneMat = new Material(mat);
    _materialChangeHelper.ChangeMaterial(cloneMat);
    _propEditingState.Selected();
    CurrentColor = GetColorList()[colorIndex];
}
```

### 기즈모 위치 계산
```csharp
public (Vector3,Quaternion) GetGizmoPositionAndRotation()
{
    var bounds = _collider.bounds;
    var gizmoRotation = Quaternion.Euler(0, 0, 0);
    Vector3 offsetDirection = PlacementType switch
    {
        PlacementType.Floor => (Vector3.up * bounds.size.y), 
        PlacementType.Ceiling => (Vector3.down * bounds.size.y),
        _ => Vector3.zero
    };
    Vector3 offset = transform.position + offsetDirection; 
    return (offset, gizmoRotation);
}
```

## 주요 기능 설명

### 초기화 프로세스
1. **컴포넌트 수집**: Collider, PropEditingState, MaterialChangeHelper
2. **이벤트 등록**: Material 변경 시 하이라이트 재설정
3. **하이라이트 설정**: PropEditingState 초기화

### 편집 가능성 검증
- **색상 편집**: 색상 변형 지원 + 색상 리스트 존재 + MaterialChangeHelper 존재
- **이동 가능**: 항상 true (바닥/천장 오브젝트는 이동 가능)
- **회전 가능**: 항상 true (Y축 회전 지원)

### 하이라이트 상태
- **Focused**: 녹색 (Valid)
- **Unfocused**: 기본 (Default)
- **Selected**: 파란색 (Selected)
- **Deselected**: 기본 (Default)

### 배치 검증 로직
1. **위치 이동**: 히트 포인트로 즉시 이동
2. **타입 검증**: 배치 영역 타입과 PlacementType 일치 확인
3. **부모 설정**: 배치 영역이 다른 오브젝트 위면 부모 관계 설정
4. **시각 피드백**: 유효/무효에 따라 하이라이트 변경

### 기즈모 위치
- **Floor**: 오브젝트 위쪽 (bounds.height만큼 위)
- **Ceiling**: 오브젝트 아래쪽 (bounds.height만큼 아래)
- 기즈모는 수직 방향으로 표시

## 의존성

- **PropEditingState**: 하이라이트 상태 관리
- **MyRoomMaterialChangeHelper**: Material 변경 처리
- **Collider**: 기즈모 위치 계산용

## 관련 클래스

- **부모 클래스**: `SpawnablePropBase`
- **관련 컴포넌트**: `MyRoomMaterialChangeHelper`
- **사용 인터페이스**: `IColorEditableProp`, `IMoveableProp`, `IRotatableProp`
