+++
title = "MyRoomEditorObjectEditUI"
description = "오브젝트 편집 메뉴를 표시하고 조작하는 UI 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 429
+++
## 개요

`MyRoomEditorObjectEditUI`는 오브젝트 편집 메뉴를 표시하고 조작하는 UI 클래스. 선택된 오브젝트의 이름 및 사용 가능한 편집 기능 표시하고 편집 기능(이동, 회전, 삭제, 색변경, 인터렉션) 등을 제어하는 버튼과 메뉴 관리.

## 주요 역할

- **편집 메뉴 표시**: 선택된 오브젝트의 편집 옵션 표시
- **버튼 상태 관리**: 활성화/비활성화 상태 및 툴팁 표시
- **이벤트 처리**: 편집 액션에 대한 이벤트 발생
- **색상 선택 UI 연동**: 색상 변경 UI와의 상호작용

## 주요 멤버

### 열거형
```csharp
/// <summary>
/// 활성 편집 도구 열거형.
/// 현재 활성화된 편집 도구의 상태를 나타냄.
/// </summary>
public enum ActiveEditingTool
{
    None = 0,      // 활성 도구 없음
    EditColor,     // 색상 편집 모드
    Move,          // 이동 모드
    RotateFree,    // 자유 회전 모드
}
```

### 이벤트(각각의 편집 기능 버튼 클릭시 발생되는 이벤트)
```csharp
public event Action OnClickDeleteEvent;
public event Action OnClickEditColorEvent;
public event Action<int> OnSelectColorToChange;
public event Action OnClickMoveEvent;
public event Action OnClickRotateQuarterEvent;
public event Action OnClickRotateFreeEvent;
public event Action OnClickUploadPhotoEvent;
```

### 필드
```csharp
/// <summary>
/// 메뉴 게임 오브젝트: 편집 메뉴의 루트 오브젝트
/// </summary>
[SerializeField]
private GameObject menuGameObject;

/// <summary>
/// 색상 선택 UI: 색상 변경을 위한 UI 컴포넌트
/// </summary>
[SerializeField]
private MyRoomEditorColorSelectUI colorSelectUI;

/// <summary>
/// 편집 버튼들: 삭제, 색상 편집, 이동, 회전, 이미지 업로드 버튼
/// </summary>
[SerializeField]
private Button deleteBtn, editColorBtn, moveBtn, rotateQuarterBtn, rotateFreeBtn, imgUploadBtn;

/// <summary>
/// 현재 선택한 오브젝트 레퍼런스 캐싱.
/// </summary>
private IMyRoomEditorEditableObject _selectedProp;


```

### 주요 메서드
```csharp
/// <summary>
/// 선택된 오브젝트의 편집 메뉴를 표시하는 메서드.
/// 오브젝트의 편집 가능 기능에 따라 UI 요소들을 활성화/비활성화.
/// </summary>
/// <param name="selectedProp">선택된 편집 가능한 오브젝트</param>
public void ShowSelectedPropMenu(IMyRoomEditorEditableObject selectedProp)

/// <summary>
/// 편집 도구 변경 시 UI 상태를 업데이트하는 프라이빗 메서드.
/// 활성 도구에 따라 버튼 상태와 툴팁을 변경.
/// </summary>
private void EditingToolChanged()

/// <summary>
/// 사용 가능한 메뉴 항목들을 활성화하는 프라이빗 메서드.
/// 오브젝트의 기능 지원 여부에 따라 버튼들을 활성화/비활성화.
/// </summary>
/// <param name="colorChangeable">색상 변경 가능 여부</param>
/// <param name="rotatable">회전 가능 여부</param>
/// <param name="moveable">이동 가능 여부</param>
/// <param name="imgUploadAble">이미지 업로드 가능 여부</param>
/// <param name="useNamePanel">이름 패널 사용 여부</param>
private void ActiveUsableMenuItem(bool colorChangeable, bool rotatable, bool moveable, bool imgUploadAble, bool useNamePanel)

/// <summary>
/// 색상 리스트를 그리는 메서드.
/// 현재 선택된 색상을 찾아 색상 선택 UI에 표시.
/// </summary>
/// <param name="colorList">표시할 색상 리스트</param>
public void DrawColorList(List<MyRoomPropColor> colorList)
```

## 코드 스니펫

### 선택 오브젝트 편집 메뉴 활성화
```csharp
public void ShowSelectedPropMenu(IMyRoomEditorEditableObject selectedProp)
{
    // 메뉴 활성화 및 초기화
    menuGameObject.SetActive(true);
    _activeTool = ActiveEditingTool.None;
    EditingToolChanged();

    // 선택된 오브젝트 저장
    _selectedProp = selectedProp;

    // 오브젝트의 편집 가능 기능 확인
    var colorChangeable = _selectedProp.IsEditableColor(out _);
    var rotatable = _selectedProp.IsRotatableProp(out _);
    var moveable = _selectedProp.IsMovableProp(out _);
    var imgUploadAble = _selectedProp.IsPhotoFrameProp(out _);
    var useNamePanel = _selectedProp.IsPlacementArea(out _) == false;

    // 이름 패널 설정 (배치 영역이 아닌 경우)
    if (useNamePanel)
    {
        _localizedText.TranslationName = _selectedProp.PropNameKey;
    }

    // 사용 가능한 메뉴 항목 활성화
    ActiveUsableMenuItem(colorChangeable, rotatable, moveable, imgUploadAble,useNamePanel);
}

private void EditingToolChanged()
{
    // 툴팁 비활성화
    hoverTooltip.gameObject.SetActive(false);

    // 도구가 없는 경우
    if (_activeTool == ActiveEditingTool.None)
    {
        // 모든 버튼 활성화
        EnableAllButtons();
        activeTooltip.gameObject.SetActive(false);
        hoverTooltip.gameObject.SetActive(false);
        colorSelectUI.gameObject.SetActive(false);
        return;
    }

    // 활성 도구에 따라 대상 버튼 설정
    var targetBtn = _activeTool switch
    {
        ActiveEditingTool.EditColor => editColorBtn,
        ActiveEditingTool.RotateFree => rotateFreeBtn,
        ActiveEditingTool.Move => moveBtn,
    };

    // 대상 버튼 선택 상태로 설정
    targetBtn.image.sprite = selectedSprite;
    targetBtn.interactable = true;

    // 다른 버튼들은 비활성화
    var disableBtn = _editButtons.FindAll(btn => btn != targetBtn);
    DisableButtons(disableBtn);

    // 활성 툴팁 표시
    ShowToolTip(activeTooltip, targetBtn.transform.position);
}

private void ActiveUsableMenuItem(bool colorChangeable, bool rotatable, bool moveable, bool imgUploadAble, bool useNamePanel)
{
    // 각 버튼의 활성화 상태 설정
    editColorBtn.gameObject.SetActive(colorChangeable);
    rotateQuarterBtn.gameObject.SetActive(rotatable);
    moveBtn.gameObject.SetActive(moveable);
    rotateFreeBtn.gameObject.SetActive(rotatable);
    imgUploadBtn.gameObject.SetActive(imgUploadAble);
    propNamePanel.gameObject.SetActive(useNamePanel);

    // 모든 버튼 활성화
    EnableAllButtons();
}
```

### 컬러 변경 UI 활성화
```csharp
public void DrawColorList(List<MyRoomPropColor> colorList)
{
    var currentColorKey = _selectedProp.GetPlacePropInfo().colorKey;
    var currentColorIndex = colorList.FindIndex(key => key.materialKey == currentColorKey);
    colorSelectUI.OnDrawColorList(colorList, currentColorIndex);
    colorSelectUI.gameObject.SetActive(true);
}
```

## 주요 기능 설명

### UI 상태 관리
- **편집 메뉴 표시**: 선택된 오브젝트의 편집 가능 기능에 따라 버튼들을 동적으로 활성화
- **툴팁 시스템**: 호버와 액티브 툴팁을 통한 사용자 가이드
- **편집 도구 토글**: 색상 편집, 이동, 자유 회전 모드 간 전환

### 이벤트 처리
- **버튼 인터랙션**: 클릭, 호버 이벤트 처리 및 시각적 피드백
- **다국어 지원**: Lean Localization을 통한 텍스트 현지화

### 상태 동기화
- **오브젝트 상태 반영**: 선택된 오브젝트의 속성에 따른 UI 상태 변경
- **실시간 업데이트**: 편집 작업 중 UI 상태 실시간 반영
- **배치 연동**: 배치 매니저와의 상태 동기화

## 관련 클래스

- [`MyRoomEditorColorSelectUI`](/docs/projects/rfice/housingsystem/myroomeditorcolorselectui/): 색상 선택 UI 컴포넌트
- [`IMyRoomEditorEditableObject`](/docs/projects/rfice/housingsystem/imyroomeditoreditableobject/): 편집 가능한 오브젝트 인터페이스
- `ActiveEditingTool`: 편집 도구 상태 열거형