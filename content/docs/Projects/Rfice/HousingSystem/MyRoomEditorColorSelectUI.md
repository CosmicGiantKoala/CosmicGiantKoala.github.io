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

`MyRoomEditorColorSelectUI` 클래스는 MyRoomEditor에서 색상 선택 UI를 관리하는 컴포넌트입니다. 색상 리스트를 표시하고 사용자의 선택을 처리하며, 선택된 색상 인덱스를 이벤트로 전달합니다.

## 역할
- 색상 아이템 리스트 관리 및 표시
- 색상 선택 상태 관리
- 선택된 색상 이벤트 발생
- UI 초기화 및 상태 동기화

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

## 기능 설명

### 색상 리스트 표시
- `OnDrawColorList()`: 제공된 색상 리스트를 UI 아이템에 바인딩
- 현재 선택된 색상 인덱스에 따라 선택 상태 표시

### 선택 상태 관리
- 단일 선택 모드: 하나의 색상만 선택 가능
- 선택 변경 시 이전 선택 해제 및 새로운 선택 활성화
- 현재 적용된 색상을 시각적으로 구분하여 표시

### 이벤트 처리
- 색상 선택 시 인덱스를 이벤트로 전달
- 부모 컴포넌트가 선택 처리 수행

### 초기화
- 색상 항목들을 초기 설정하고 이벤트 연결
- 선택 해제 시 모든 항목을 초기 상태로 복원
- 리스트 변경 시 기존 항목들을 재활용하여 성능 최적화

## 의존성/상속 관계
- `MonoBehaviour`를 상속받음.
- [`MyRoomEditorColorEditItem`](/docs/projects/rfice/HousingSystem/MyRoomEditorColorEditItem)에 의존.
- `MyRoomPropColor` 클래스 사용.

## 관련 클래스

- [`MyRoomEditorColorEditItem`](/docs/projects/rfice/housingsystem/myroomeditorcoloredititem/)
- [`MyRoomEditorObjectEditUI`](/docs/projects/rfice/housingsystem/myroomeditorobjecteditui/)
- [`IColorEditableProp`](/docs/projects/rfice/HousingSystem/IColorEditableProp)