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

`MyRoomEditorObjectEditUI`는 MyRoomEditor에서 선택된 오브젝트의 편집 UI를 관리하는 클래스입니다. Unity UI 시스템을 사용하여 편집 메뉴를 표시하고, 색상 변경, 이동, 회전, 삭제, 이미지 업로드 등의 기능을 제공합니다. 이벤트 기반 아키텍처를 통해 외부 매니저와 통신하며, 툴팁과 시각적 피드백을 지원합니다.

## 역할

- 선택된 프로퍼티의 편집 메뉴 표시 및 숨김
- 색상 선택 UI와의 통합 관리
- 편집 도구 상태 관리 (색상 편집, 이동, 자유 회전)
- 버튼 호버/클릭 이벤트 처리 및 시각적 피드백 제공
- 프로퍼티 타입에 따른 메뉴 아이템 활성화/비활성화
- 오브젝트 삭제 기능 제공
- 툴팁 표시 및 위치 조정

## 선언
```csharp
public class MyRoomEditorObjectEditUI : MonoBehaviour
```

## 멤버
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

### 속성
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

/// <summary>
/// 편집 버튼 리스트
/// </summary>
private List<Button> _editButtons;

/// <summary>
/// 메뉴 상태별 스프라이트
/// </summary>
[SerializeField]
private Sprite normalSprite, hoverSprite, pressedSprite, selectedSprite, disabledSprite;

/// <summary>
/// 툴팁 오브젝트 RectTransform
/// </summary>
[SerializeField]
private RectTransform hoverTooltip, activeTooltip;

```

### 메서드
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

### 버튼 상태 관리

```csharp
private void EnableAllButtons()
{
    _editButtons.ForEach(button =>
    {
        button.interactable = true;
        button.image.sprite = normalSprite;
        SetChildImageAlpha(button, _enabledIconColor);
    });
}

private void DisableButtons(List<Button> buttons)
{
    buttons.ForEach(button =>
    {
        button.interactable = false;
        button.image.sprite = disabledSprite;
        SetChildImageAlpha(button, _disabledIconColor);
    });
}
```

### 이벤트 트리거 추가 (툴팁 표시 및 숨김)
```csharp
private void AddListeners(Button button)
{
    EventTrigger trigger = button.gameObject.AddComponent<EventTrigger>();
    
    EventTrigger.Entry pointerEnterEntry = new EventTrigger.Entry{eventID = EventTriggerType.PointerEnter};
    pointerEnterEntry.callback.AddListener(data => OnPointerEnterEvent(button));
    trigger.triggers.Add(pointerEnterEntry);
    
    EventTrigger.Entry pointerExitEntry = new EventTrigger.Entry {eventID = EventTriggerType.PointerExit};
    pointerExitEntry.callback.AddListener(data => OnPointerExitEvent(button));
    trigger.triggers.Add(pointerExitEntry);
}

private void OnPointerEnterEvent(Button targetBtn)
{
    if (_activeTool != ActiveEditingTool.None) return;
    targetBtn.image.sprite = hoverSprite;
    if (_additionalStatusButtons.Contains(targetBtn))
    {
        ShowToolTip(hoverTooltip, targetBtn.transform.position);
    }
}

private void ShowToolTip(RectTransform targetToolTip, Vector2 position)
{
    targetToolTip.gameObject.SetActive(true);
    targetToolTip.position = new Vector3(position.x, targetToolTip.position.y);
}

private void OnPointerExitEvent(Button targetBtn)
{
    if (_activeTool != ActiveEditingTool.None) return; 
    targetBtn.image.sprite = normalSprite;
    hoverTooltip.gameObject.SetActive(false);
}
```

## 기능 설명

### UI 표시/숨김 관리
- **ShowSelectedPropMenu()**: 선택된 프로퍼티의 타입을 확인하여 적절한 편집 메뉴를 표시. 색상 변경, 회전, 이동, 이미지 업로드 기능의 사용 가능 여부를 체크.
- **HideMenu()**: 모든 메뉴와 툴팁을 숨기고 상태를 초기화합니다.

### 편집 도구 토글
- 색상 편집, 이동, 자유 회전 도구를 토글 방식으로 활성화/비활성화. 하나의 도구만 활성화.

### 시각적 피드백
- 버튼 호버 시 스프라이트 변경과 툴팁 표시를 통해 사용자 경험을 향상.
- 선택된 도구는 다른 버튼들을 비활성화하고 시각적으로 강조.

### 이벤트 처리
- 각 버튼 클릭 시 해당 이벤트를 발생시켜 외부 매니저에서 동작.
- 색상 선택 UI와의 통합을 통해 색상 변경 기능을 제공.

### 현지화
- [`Lean Localization`](https://carloswilkes.com/Documentation/LeanLocalization)을 통한 텍스트 현지화

## 의존성/상속 관계
- `MonoBehaviour`를 상속받음.
- [`UGUI`](https://docs.unity3d.com/Packages/com.unity.ugui@2.0/manual/index.html), [`TextMesh Pro`](https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.0/manual/index.html), [`Lean Localization`](https://carloswilkes.com/Documentation/LeanLocalization), Event System을 사용.
- [`IMyRoomEditorEditableObject`](/docs/projects/rfice/HousingSystem/IMyRoomEditorEditableObject), [`MyRoomEditorColorSelectUI`](/docs/projects/rfice/HousingSystem/MyRoomEditorColorSelectUI)에 의존.

## 사용 예시
####  [`MyRoomEditorPropEditingManager`](/docs/projects/rfice/HousingSystem/MyRoomEditorPropEditingManager)에서 오브젝트가 선택 될 때, 오브젝트 편집 UI표시
```csharp
private void OnObjectSelected(IMyRoomEditorEditableObject selectedObject)
{
    _editingObject = selectedObject;
    objectEditUI.ShowSelectedPropMenu(_editingObject);
}
```

## 관련 클래스
- [`MyRoomEditorPropEditingManager`](/docs/projects/rfice/HousingSystem/MyRoomEditorPropEditingManager)
- [`MyRoomEditorPlacementManager`](/docs/projects/rfice/HousingSystem/MyRoomEditorPlacementManager)
- [`MyRoomEditorColorSelectUI`](/docs/projects/rfice/housingsystem/myroomeditorcolorselectui/)
- [`IMyRoomEditorEditableObject`](/docs/projects/rfice/housingsystem/imyroomeditoreditableobject/)
- [`UGUI`](https://docs.unity3d.com/Packages/com.unity.ugui@2.0/manual/index.html)
- [`TextMesh Pro`](https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.0/manual/index.html)
- [`Lean Localization`](https://carloswilkes.com/Documentation/LeanLocalization)
