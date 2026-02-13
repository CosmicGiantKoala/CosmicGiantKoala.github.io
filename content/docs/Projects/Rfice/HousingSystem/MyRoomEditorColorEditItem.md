+++
title = "MyRoomEditorColorEditItem"
description = "선택 가능한 색상 항목을 나타내는 UI 컴포넌트"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 431
+++
## 개요

`MyRoomEditorColorEditItem` 클래스는 MyRoom 에디터에서 색상 선택 UI의 개별 아이템을 관리하는 컴포넌트입니다. 색상 패널 표시와 선택 상태 관리를 담당하며, 색상 선택 이벤트를 발생시킵니다.

## 역할

- 색상 선택 UI 아이템 표시 및 상호작용 처리
- 선택 상태 시각적 피드백 제공
- 색상 값 설정 및 표시
- 색상 선택 이벤트 발생

## 선언
```csharp
public class MyRoomEditorColorEditItem : MonoBehaviour
```

## 멤버
### 이벤트
```csharp
/// <summary>
/// 색상 선택 이벤트 (아이템 인덱스 전달)
/// </summary>
public event Action<int> OnSelectMaterialColorEvent;
```

### 속성
```csharp
/// <summary>
/// 색상 선택 버튼
/// </summary>
[SerializeField]
private Button selectColorButton;

/// <summary>
/// 선택 상태 표시 오브젝트
/// </summary>
[SerializeField]
private GameObject selectedObject;

/// <summary>
/// 색상 패널 이미지
/// </summary>
[SerializeField]
private Image colorPanel;
```

### 메서드
```csharp
/// <summary>
/// 색상 항목을 초기화하는 메서드.
/// 항목의 인덱스를 설정하여 선택 시 올바른 인덱스를 전달할 수 있도록 함.
/// </summary>
/// <param name="index">이 색상 항목의 인덱스</param>
public void Initialize(int index)

/// <summary>
/// 색상 항목을 선택된 상태로 변경하는 메서드.
/// 선택 상태 표시 오브젝트를 활성화하여 사용자가 선택된 항목을 시각적으로 확인할 수 있도록 함.
/// </summary>
public void Selected()

/// <summary>
/// 색상 항목의 색상을 설정하는 메서드.
/// 색상 패널의 색상을 지정된 색상으로 변경하여 사용자가 선택 가능한 색상을 미리 볼 수 있도록 함.
/// </summary>
/// <param name="color">표시할 색상</param>
public void SetItemColor(Color color)

/// <summary>
/// 버튼 클릭 이벤트 핸들러.
/// 색상 항목이 클릭되었을 때 선택 이벤트를 발생시키고 항목 인덱스를 전달.
/// </summary>
private void OnClick()

/// <summary>
/// 색상 항목을 해제하는 메서드.
/// 선택 상태 표시 오브젝트를 비활성화하여 선택 해제 상태로 변경.
/// </summary>
public void Release()
```


## 기능 설명

### 색상 표시
- `SetItemColor()`: 지정된 색상으로 패널 색상 설정
- UI를 통해 사용 가능한 색상 옵션 표시

### 선택 상태 관리
- `Selected()`: 선택 시 시각적 표시 활성화
- `Release()`: 선택 해제 시 시각적 표시 비활성화

### 이벤트 처리
- 버튼 클릭 시 인덱스와 함께 이벤트 발생
- 부모 UI 컴포넌트가 선택 처리 수행

### 초기화
- `Initialize()`: 아이템 인덱스 설정으로 고유 식별

## 의존성/상속 관계

- `MonoBehaviour`를 상속받음.
- [`UGUI`](https://docs.unity3d.com/Packages/com.unity.ugui@2.0/manual/index.html) 컴포넌트 사용 (Button, Image).

## 관련 클래스
- [`MyRoomEditorColorSelectUI`](/docs/projects/rfice/housingsystem/myroomeditorcolorselectui/)
- [`IColorEditableProp`](/docs/projects/rfice/HousingSystem/IColorEditableProp)
- [`UGUI`](https://docs.unity3d.com/Packages/com.unity.ugui@2.0/manual/index.html)
