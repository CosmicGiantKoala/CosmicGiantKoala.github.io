+++
title = "SpawnablePropBase"
description = "모든 배치 가능한 오브젝트의 abstract 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 414
+++

## 개요

`SpawnablePropBase`는 모든 배치 가능한 오브젝트의 abstract 클래스입니다. 공용 Property 데이터 설정, 상태 정보 관리, 부모-자식 오브젝트 관계 구성, 상태 표현 등 공통 로직을 처리합니다.

## 주요 역할

- **데이터 관리**: 오브젝트의 속성 및 배치 정보 관리
- **계층 구조**: 부모-자식 관계 관리
- **색상 처리**: 색상 변형 및 하이라이트 설정
- **배치 영역 설정**: 추가 배치 영역 구성
- **상호작용**: 인터랙터블 컴포넌트 초기화

## 주요 멤버

### 속성
```csharp
public PlacementType PlacementType { get; private set; }
public MyRoomPropMainCategory GetMainCategory { get; private set; }
public Feature PropFeature { get; private set; }
public string PropNameKey { get; private set; }
public string Id { get; private set; }
protected MyRoomProp MyRoomPropData { get; private set; }
protected MyRoomPlaceProp MyRoomPlacePropData { get; private set; }
protected MyRoomPropColor CurrentColor { get; set; }
public SpawnablePropBase ParentProp { get; private set; }
private List<SpawnablePropBase> _childrenProps = new();
```

### 추상 메서드
```csharp
public abstract IMyRoomEditorEditableObject GetEditableObject();
protected abstract void SetupPropHighlight();
```

### 주요 메서드
```csharp
public void SetPropInfo(MyRoomProp propInfo)
public void SetPlacePropInfo(MyRoomPlaceProp placePropInfo)
public MyRoomPlaceProp GetPlacePropInfo()
public void AddChildProp(SpawnablePropBase childProp)
public void RemoveChildProp(SpawnablePropBase childProp)
```

## 코드 스니펫

### 전체 클래스 코드
```csharp
using System.Collections.Generic;
using System.Linq;
using Dev.Scripts.Rsup.Domain.Entities.MyRoom;
using Dev.Scripts.Rsup.Scenes.Components.MyRoomEditor;
using Dev.Scripts.Rsup.Scenes.MyRoomEditor;
using UnityEngine;

public abstract class SpawnablePropBase : MonoBehaviour
{
    public PlacementType PlacementType { get; private set; }
    public MyRoomPropMainCategory GetMainCategory { get; private set; }
    public Feature PropFeature { get; private set; }
    public string PropNameKey { get; private set; }
    public string Id { get; private set; }
    protected MyRoomProp MyRoomPropData { get; private set; }
    protected MyRoomPlaceProp MyRoomPlacePropData { get; private set; }
    protected MyRoomPropColor CurrentColor { get; set; }
    public SpawnablePropBase ParentProp { get; private set; }
    private List<SpawnablePropBase> _childrenProps = new ();
    
    public abstract IMyRoomEditorEditableObject GetEditableObject();
    protected abstract void SetupPropHighlight();

    public void SetPropInfo(MyRoomProp propInfo)
    {
        Id = propInfo.id;
        PlacementType = propInfo.placementType;
        GetMainCategory = propInfo.mainCategory;
        PropNameKey = propInfo.nameKey;
        PropFeature = propInfo.feature;
        MyRoomPropData = propInfo;
    }

    public void SetPlacePropInfo(MyRoomPlaceProp placePropInfo)
    {
        MyRoomPlacePropData = placePropInfo;
        if (MyRoomPropData.CheckColorVariation())
        {
            if (string.IsNullOrEmpty(placePropInfo.colorKey))
            {
                CurrentColor = null;
            }
            else
            {
                CurrentColor = MyRoomPropData.colorList.FirstOrDefault(key => key.materialKey == placePropInfo.colorKey);
            }
        }
        SetupPropHighlight();
        SetupAdditivePlaceArea();

        if (TryGetComponent(out IInteractableProp interactableProp))
        {
            interactableProp.Interact();
        }
    }

    public void RegisterProp(MyRoomEditorPropEditingManager manager)
    {
        manager.RegisterProp(this);
    }

    public MyRoomPlaceProp GetPlacePropInfo()
    {
        MyRoomPlacePropData.position = transform.position;
        MyRoomPlacePropData.rotation = transform.rotation.eulerAngles;
        MyRoomPlacePropData.colorKey = CurrentColor != null ? CurrentColor.materialKey : string.Empty;
        MyRoomPlacePropData.prop = MyRoomPropData;
        if (ParentProp != null)
        {
            MyRoomPlacePropData.parentPropId = ParentProp.GetPlacePropId();
            UpdatePositionToAbsoluteWorldPosition();
        }

        if (_childrenProps.Count > 0)
        {
            _childrenProps.ForEach(x => x.UpdatePositionToAbsoluteWorldPosition());
        }

        return MyRoomPlacePropData;
    }

    public void UpdatePositionToAbsoluteWorldPosition()
    {
        if (transform.parent == null) return;
        var absolutePos = transform.parent.localToWorldMatrix.MultiplyPoint3x4(transform.localPosition);
        MyRoomPlacePropData.position = absolutePos;
    }

    public string GetPlacePropId()
    {
        return MyRoomPlacePropData.id;
    }

    private void SetupAdditivePlaceArea()
    {
        var placementAreaInProps = GetComponentsInChildren<PlacementAreaInProp>();
        if (placementAreaInProps == null) return;
        foreach (var areaInProp in placementAreaInProps)
        {
            areaInProp.SetPlacementAreaInProp(this);
        }
    }

    public void AddChildProp(SpawnablePropBase childProp)
    {
        if (_childrenProps.Any(x => x.MyRoomPlacePropData.id == childProp.MyRoomPlacePropData.id))
        {
            Debug.Log($"Already Set Child Prop : {childProp.GetPlacePropId()}");
            return;
        }
        
        _childrenProps.Add(childProp);
        childProp.transform.parent = transform;
        childProp.MyRoomPlacePropData.parentPropId = MyRoomPlacePropData.id;
        childProp.ParentProp = this;
        Debug.Log($"[SpawnablePropBase] Prop: {GetPlacePropId()} Add Child Prop : {childProp.GetPlacePropId()}");
    }

    public void RemoveChildProp(SpawnablePropBase childProp)
    {
        if (_childrenProps.All(x => x.MyRoomPlacePropData.id != childProp.MyRoomPlacePropData.id)) return;
        _childrenProps.Remove(childProp);
        Debug.Log($"[SpawnablePropBase] Prop: {GetPlacePropId()} Remove Child Prop : {childProp.GetPlacePropId()}");
    }

    public void SetPropParent(SpawnablePropBase propParent)
    {
        ParentProp = propParent;
    }

    public void ClearPropParent()
    {
        ParentProp = null;
        if (MyRoomPlacePropData != null) MyRoomPlacePropData.parentPropId = null;
    }
}
```

### 배치 정보 설정
```csharp
public void SetPlacePropInfo(MyRoomPlaceProp placePropInfo)
{
    MyRoomPlacePropData = placePropInfo;
    if (MyRoomPropData.CheckColorVariation())
    {
        if (string.IsNullOrEmpty(placePropInfo.colorKey))
        {
            CurrentColor = null;
        }
        else
        {
            CurrentColor = MyRoomPropData.colorList.FirstOrDefault(key => key.materialKey == placePropInfo.colorKey);
        }
    }
    SetupPropHighlight();
    SetupAdditivePlaceArea();

    if (TryGetComponent(out IInteractableProp interactableProp))
    {
        interactableProp.Interact();
    }
}
```

### 자식 오브젝트 추가
```csharp
public void AddChildProp(SpawnablePropBase childProp)
{
    if (_childrenProps.Any(x => x.MyRoomPlacePropData.id == childProp.MyRoomPlacePropData.id))
    {
        Debug.Log($"Already Set Child Prop : {childProp.GetPlacePropId()}");
        return;
    }
    
    _childrenProps.Add(childProp);
    childProp.transform.parent = transform;
    childProp.MyRoomPlacePropData.parentPropId = MyRoomPlacePropData.id;
    childProp.ParentProp = this;
    Debug.Log($"[SpawnablePropBase] Prop: {GetPlacePropId()} Add Child Prop : {childProp.GetPlacePropId()}");
}
```

### 배치 정보 조회
```csharp
public MyRoomPlaceProp GetPlacePropInfo()
{
    MyRoomPlacePropData.position = transform.position;
    MyRoomPlacePropData.rotation = transform.rotation.eulerAngles;
    MyRoomPlacePropData.colorKey = CurrentColor != null ? CurrentColor.materialKey : string.Empty;
    MyRoomPlacePropData.prop = MyRoomPropData;
    if (ParentProp != null)
    {
        MyRoomPlacePropData.parentPropId = ParentProp.GetPlacePropId();
        UpdatePositionToAbsoluteWorldPosition();
    }

    if (_childrenProps.Count > 0)
    {
        _childrenProps.ForEach(x => x.UpdatePositionToAbsoluteWorldPosition());
    }

    return MyRoomPlacePropData;
}
```

## 주요 기능 설명

### 데이터 초기화
- **속성 설정**: 오브젝트의 기본 속성 (ID, 타입, 카테고리 등)
- **배치 정보 설정**: 위치, 회전, 색상 등의 배치 데이터 설정

### 색상 관리
- **색상 변형 확인**: 오브젝트가 색상 변경 가능한지 검증
- **색상 키 매핑**: 저장된 색상 키에 따라 현재 색상 설정

### 계층 구조 관리
- **부모 설정**: 다른 오브젝트 위에 배치될 때 부모 관계 설정
- **자식 관리**: 자식 오브젝트 추가/제거 및 계층 구조 유지
- **절대 위치 변환**: 로컬 좌표를 월드 좌표로 변환

### 배치 영역 설정
- **추가 배치 영역**: 자식 컴포넌트의 배치 영역을 현재 오브젝트와 연결

### 인터랙션 초기화
- **컴포넌트 인터랙션**: 인터랙터블 컴포넌트가 있으면 초기화 실행

## 상속 구조

`SpawnablePropBase`는 다음과 같은 서브클래스를 가집니다:
- `SpawnableFloorAndCeilProp`: 바닥/천장 배치 오브젝트
- `SpawnableWallProp`: 벽 배치 오브젝트
- `SpawnablePhotoFrameProp`: 사진 프레임 오브젝트
- `SpawnableScreenProp`: 스크린 오브젝트

## 의존성

- `MyRoomProp`: 오브젝트 기본 정보
- `MyRoomPlaceProp`: 배치 정보
- `MyRoomPropColor`: 색상 정보
- `IInteractableProp`: 인터랙션 인터페이스

## 관련 클래스

- **관리자**: `MyRoomEditorPropEditingManager`
- **인터페이스**: `IMyRoomEditorEditableObject`, `IInteractableProp`
