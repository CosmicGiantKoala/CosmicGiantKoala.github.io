+++
title = "IMyRoomEditorEditableObject"
description = "편집 가능한 오브젝트 정의 및 기능 정의 인터페이스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 419
+++

## 개요

`IMyRoomEditorEditableObject`는 편집 가능한 오브젝트를 정의하는 인터페이스입니다. 오브젝트의 기본 속성과 편집 관련 기능들을 정의합니다.

## 주요 역할

- **속성 정의**: 오브젝트의 기본 속성 제공
- **기능 검증**: 다양한 편집 기능 지원 여부 확인
- **상태 관리**: 선택, 포커스 등의 상태 관리
- **데이터 접근**: 배치 정보 및 기즈모 정보 제공

## 인터페이스 멤버

### 속성
```csharp
string PropNameKey { get; }
```

### 메서드
```csharp
void Delete();
bool IsEditableColor(out IColorEditableProp prop);
bool IsMovableProp(out IMoveableProp prop);
bool IsRotatableProp(out IRotatableProp prop);
bool IsPhotoFrameProp(out IPhotoFrameProp prop);
bool IsPlacementArea(out IPlaceableArea area);
void Focused();
void Unfocused();
void Selected();
void Deselected();
(Vector3, Quaternion) GetGizmoPositionAndRotation();
MyRoomPlaceProp GetPlacePropInfo();
string GetPlacePropId();
```

## 코드 스니펫

### 전체 인터페이스 코드
```csharp
using System;
using Dev.Scripts.Rsup.Domain.Entities.MyRoom;
using Dev.Scripts.Rsup.Scenes.Components.MyRoomEditor;
using Dev.Scripts.Rsup.Scenes.MyRoomEditor;
using UnityEngine;

public interface IMyRoomEditorEditableObject : IEquatable<IMyRoomEditorEditableObject>
{
    public string PropNameKey { get;}
    public void Delete();
    public bool IsEditableColor(out IColorEditableProp prop);
    public bool IsMovableProp(out IMoveableProp prop);
    public bool IsRotatableProp(out IRotatableProp prop);
    public bool IsPhotoFrameProp(out IPhotoFrameProp prop);
    public bool IsPlacementArea(out IPlaceableArea area);
    public void Focused();
    public void Unfocused();
    public void Selected();
    public void Deselected();
    public (Vector3,Quaternion) GetGizmoPositionAndRotation();
    public MyRoomPlaceProp GetPlacePropInfo();
    public string GetPlacePropId();
}
```

## 주요 기능 설명

### 속성
- **PropNameKey**: 오브젝트의 이름 키 (로컬라이제이션용)

### 기능 검증 메서드들
- **IsEditableColor**: 색상 편집 가능 여부 및 인터페이스 반환
- **IsMovableProp**: 이동 가능 여부 및 인터페이스 반환
- **IsRotatableProp**: 회전 가능 여부 및 인터페이스 반환
- **IsPhotoFrameProp**: 사진 프레임 여부 및 인터페이스 반환
- **IsPlacementArea**: 배치 영역 여부 및 인터페이스 반환

### 상태 관리 메서드들
- **Focused**: 오브젝트가 포커스될 때 호출
- **Unfocused**: 오브젝트가 포커스 해제될 때 호출
- **Selected**: 오브젝트가 선택될 때 호출
- **Deselected**: 오브젝트가 선택 해제될 때 호출

### 데이터 접근 메서드들
- **GetGizmoPositionAndRotation**: 기즈모 표시를 위한 위치 및 회전 정보 반환
- **GetPlacePropInfo**: 배치된 오브젝트의 정보 반환
- **GetPlacePropId**: 배치된 오브젝트의 고유 ID 반환

### 삭제
- **Delete**: 오브젝트 삭제 처리

## 구현 클래스

이 인터페이스는 다음과 같은 클래스에서 구현됩니다:
- `SpawnablePropBase`의 서브클래스들
- `SpawnableFloorAndCeilProp`
- `SpawnableWallProp`
- `SpawnablePhotoFrameProp`
- `SpawnableScreenProp`

## 관련 인터페이스

- **확장 인터페이스들**:
    - `IColorEditableProp`: 색상 편집 기능
    - `IMoveableProp`: 이동 기능
    - `IRotatableProp`: 회전 기능
    - `IPhotoFrameProp`: 사진 프레임 기능
    - `IPlaceableArea`: 배치 영역 기능

## 사용 예시

### 인터페이스 검증 및 사용
```csharp
if (editableObject.IsMovableProp(out IMoveableProp movableProp))
{
    // 이동 가능한 오브젝트 처리
    Vector3 position = movableProp.GetPosition();
    // ...
}

if (editableObject.IsEditableColor(out IColorEditableProp colorProp))
{
    // 색상 편집 가능한 오브젝트 처리
    var colors = colorProp.GetColorList();
    // ...
}
```

### 상태 변경
```csharp
// 오브젝트 선택
editableObject.Focused();
editableObject.Selected();

// 오브젝트 선택 해제
editableObject.Unfocused();
editableObject.Deselected();
```

## 의존성

- `IEquatable<IMyRoomEditorEditableObject>`: 동등성 비교를 위한 인터페이스
- `MyRoomPlaceProp`: 배치 정보 데이터
- 관련 서브 인터페이스들
