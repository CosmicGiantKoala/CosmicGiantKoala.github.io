+++
title = "MyRoomEditorColorSelectUI"
description = "색상 선택 UI를 처리하는 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 430
+++
## 개요

`MyRoomEditorColorSelectUI`는 색상 선택 UI를 처리하는 클래스. 사용할 수 있는 색상 옵션을 표시하고 선택 이벤트 처리.

## 주요 역할

- **색상 리스트 표시**: 사용 가능한 색상 옵션들을 UI에 표시
- **선택 상태 관리**: 현재 선택된 색상을 하이라이트 표시
- **이벤트 전달**: 색상 선택 이벤트를 외부로 전달
- **UI 상태 제어**: 색상 항목들의 활성화/비활성화 관리

### 이벤트
```csharp
/// <summary>
/// 색상 선택 이벤트: 색상이 선택되었을 때 발생
/// </summary>
public event Action<int> OnSelectedColor;
```

### 필드
```csharp
/// <summary>
/// 색상 편집 항목 리스트: 개별 색상을 표시하는 UI 항목들
/// </summary>
[SerializeField]
private List<MyRoomEditorColorEditItem> colorEditItems;
```

### 주요 메서드
```csharp
/// <summary>
/// 색상 리스트를 받아 UI에 표시하는 메서드.
/// 제공된 색상 리스트를 UI 항목에 할당하고 현재 선택된 색상을 하이라이트.
/// </summary>
/// <param name="colorList">표시할 색상 리스트</param>
/// <param name="currentColorIndex">현재 선택된 색상의 인덱스</param>
public void OnDrawColorList(List<MyRoomPropColor> colorList, int currentColorIndex)

/// <summary>
/// 색상 선택 이벤트 핸들러.
/// 특정 색상이 선택되었을 때 다른 모든 항목을 해제하고 선택 이벤트를 발생.
/// </summary>
/// <param name="index">선택된 색상의 인덱스</param>
private void OnSelectMaterialColor(int index)
```

## 코드 스니펫
### 색상 리스트 UI 표시
```csharp
public void OnDrawColorList(List<MyRoomPropColor> colorList, int currentColorIndex)
{
    // 모든 항목을 초기화 상태로 설정
    InitializeListItem();

    // 각 색상을 UI 항목에 할당
    for (int colorListIndex = 0; colorListIndex < colorList.Count; colorListIndex++)
    {
        var uiItem = colorEditItems[colorListIndex];
        uiItem.gameObject.SetActive(true);
        uiItem.SetItemColor(colorList[colorListIndex].color);

        // 현재 선택된 색상인 경우 선택 상태로 표시
        if (colorListIndex == currentColorIndex) uiItem.Selected();
    }
}

private void InitializeListItem()
{
    colorEditItems.ForEach(item => item.Release());
    colorEditItems.ForEach(item => item.gameObject.SetActive(false));
}
```

### 색상 선택 이벤트
```csharp
private void OnSelectMaterialColor(int index)
{
    // 활성화된 모든 항목을 해제
    colorEditItems.Where(item => item.gameObject.activeSelf).ToList().ForEach(item => item.Release());

    // 선택된 항목을 선택 상태로 변경
    colorEditItems[index].Selected();

    // 외부 이벤트 발생
    OnSelectedColor?.Invoke(index);
}
```

## 주요 기능 설명

### 색상 리스트 관리
- **동적 리스트 생성**: 제공된 색상 리스트에 따라 UI 항목들을 동적으로 생성 및 표시
- **항목 상태 관리**: 각 색상 항목의 선택/해제 상태를 독립적으로 관리
- **현재 선택 표시**: 현재 적용된 색상을 시각적으로 구분하여 표시

### 이벤트 처리
- **단일 선택 보장**: 하나의 색상만 선택된 상태로 유지
- **이벤트 전파**: 선택된 색상 인덱스를 외부 컴포넌트로 전달
- **상태 동기화**: 선택 변경 시 모든 관련 UI 요소들의 상태 업데이트

### UI 라이프사이클
- **초기화**: Awake에서 색상 항목들을 초기 설정하고 이벤트 연결
- **재사용**: 리스트 변경 시 기존 항목들을 재활용하여 성능 최적화
- **정리**: 선택 해제 시 모든 항목을 초기 상태로 복원

## 관련 클래스

- [`MyRoomEditorColorEditItem`](/docs/projects/rfice/housingsystem/myroomeditorcoloredititem/): 개별 색상 항목을 표시하는 UI 컴포넌트
- `MyRoomPropColor`: 색상 정보를 담는 데이터 클래스
- [`MyRoomEditorObjectEditUI`](/docs/projects/rfice/housingsystem/myroomeditorobjecteditui/): 색상 선택 UI를 사용하는 부모 UI 클래스