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

`MyRoomEditorColorEditItem`은 선택 가능한 색상 항목을 나타내는 UI 컴포넌트. 개별 색상을 표시하고 선택 상태를 관리.

## 주요 역할

- **색상 표시**: 개별 색상을 시각적으로 표시
- **선택 인터랙션**: 사용자의 클릭을 받아 색상 선택 처리
- **상태 관리**: 선택/해제 상태를 시각적으로 표현
- **이벤트 전달**: 선택 이벤트를 부모 컴포넌트로 전달

## 주요 멤버

### 이벤트
```csharp
/// <summary>
/// 색상 선택 이벤트: 이 항목이 선택되었을 때 발생
/// </summary>
public event Action<int> OnSelectMaterialColorEvent;
```

### 필드
```csharp
/// <summary>
/// 선택 상태 표시 오브젝트: 선택되었을 때 활성화되는 게임 오브젝트
/// </summary>
[SerializeField]
private GameObject selectedObject;

/// <summary>
/// 색상 패널: 선택 가능한 색상을 표시하는 이미지 컴포넌트
/// </summary>
[SerializeField]
private Image colorPanel;

/// <summary>
/// 항목 인덱스: 이 색상 항목의 인덱스 값
/// </summary>
private int _itemIndex;
```

### 주요 메서드
```csharp
/// <summary>
/// 색상 항목을 초기화하는 메서드.
/// 항목의 인덱스를 설정하여 선택 시 올바른 인덱스를 전달할 수 있도록 함.
/// </summary>
/// <param name="index">이 색상 항목의 인덱스</param>

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

## 주요 기능 설명

### 색상 표시 및 인터랙션
- **색상 렌더링**: 지정된 색상을 UI에 시각적으로 표시
- **인덱스 관리**: 각 항목의 고유 인덱스를 유지하여 정확한 선택 전달

## 관련 클래스

- [`MyRoomEditorColorSelectUI`](/docs/projects/rfice/housingsystem/myroomeditorcolorselectui/): 이 항목들을 관리하는 부모 UI 클래스
