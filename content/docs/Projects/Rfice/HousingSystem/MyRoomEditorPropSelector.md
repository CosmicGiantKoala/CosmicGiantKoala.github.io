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
`MyRoomEditorPropSelector`는 MyRoomEditor에서 오브젝트 선택 기능을 제공하는 클래스입니다. [`MyRoomEditorPropEditor`](/docs/projects/rfice/HousingSystem/MyRoomEditorPropEditor)를 상속받아 [`MyRoomEditorInputUtils`](/docs/projects/rfice/housingsystem/myroomeditorinpututils/)의 레이캐스트를 통한 오브젝트 검출, 포커스 및 선택 상태 관리를 담당합니다.

## 역할
- [`MyRoomEditorInputUtils`](/docs/projects/rfice/housingsystem/myroomeditorinpututils/)를 활용해 레이캐스트를 통한 편집 가능 오브젝트 검출
- 오브젝트 포커스 및 선택 상태 관리
- 우선순위 레이어를 통한 정확한 타겟팅
- 선택 해제 및 상태 정리 기능 제공

## 멤버
### 이벤트
```csharp
/// <summary>
/// 오브젝트 선택시 호출되는 이벤트.
/// 선택된 오브젝트의 정보가 필요한 클래스에서 해당 이벤트 구독하여 사용.
/// </summary>
public event Action<IMyRoomEditorEditableObject> OnObjectSelect;

/// <summary>
/// 오브젝트 선택 해제시 호출되는 이벤트.
/// </summary>
public event Action OnReleaseSelect;
```

### 속성
```csharp
/// <summary>
/// 오브젝트 감지 상태일때 실행되는 코루틴 참조.
/// </summary>
private Coroutine _detector;

/// <summary>
/// 현재 포커스된 오브젝트 참조.
/// </summary>
private IMyRoomEditorEditableObject _focusedObject;

/// 레이케스트 타겟 레이어, 우선순위 레이어, 레이어 상수 이름 
private int _targetLayer;
private int _firstPriorityLayer;
private const string MyRoomPropLayerNameKey = "MyRoomProp";
private const string MyRoomWallLayerNameKey = "Wall";
private const string MyRoomGroundLayerNameKey = "Ground";
```

### 메서드
```csharp
/// <summary>
/// Raycast 오브젝트 감지 코루틴.
/// </summary>
private IEnumerator CoDetectObject()

/// <summary>
/// 오브젝트가 선택되었는지 확인하는 메서드.
/// </summary>
/// <param name="focusedObject">확인할 오브젝트</param>
/// <returns>선택 여부</returns>
private bool IsSelectedObject(IMyRoomEditorEditableObject focusedObject)

/// <summary>
/// 오브젝트 선택 해제 메서드.
/// </summary>
private void ReleaseSelect()
```

## 코드 스니펫

### 오브젝트 감지 프로세스
```csharp

private IEnumerator CoDetectObject()
{
    while (true) // 무한 루프
    {
        yield return null; // 다음 프레임까지 대기

        if (InputUtils.GetRaycastHit(out RaycastHit hits, _targetLayer, _firstPriorityLayer)) // 레이캐스트 수행
        {
            if (hits.transform.TryGetComponent(out IMyRoomEditorEditableObject focusedObject) // 히트된 오브젝트에 편집 가능 컴포넌트가 있고
                && InputUtils.IsPointerOnUI() == false) // UI 위가 아니면
            {
                if (focusedObject.Equals(_focusedObject)) continue; // 같은 오브젝트면 스킵
                if (IsSelectedObject(focusedObject)) // 선택된 오브젝트인지 확인
                {
                    _focusedObject?.Unfocused(); // 이전 포커스 해제
                    _focusedObject = focusedObject; // 포커스 설정
                }
                else // 선택되지 않은 오브젝트
                {
                    if (IsSelectedObject(_focusedObject) == false) // 이전 포커스 오브젝트가 선택되지 않았으면
                    {
                        _focusedObject?.Unfocused(); // 포커스 해제
                    }
                    _focusedObject = focusedObject; // 새로운 포커스 설정
                    _focusedObject.Focused(); // 포커스 상태로 설정
                }
            }
            else // 편집 가능 오브젝트가 아니거나 UI 위면
            {
                //Unfocus조건 // Unfocus 조건 설명
                //1. 선택된 오브젝트는 Unfocus되지 않는다. // 선택된 오브젝트는 포커스 유지
                //2. 선택된 오브젝트가 아니며 포커싱 중인 오브젝트가 있는 경우는 Unfocus 한다. // 선택되지 않은 포커스 오브젝트는 해제
                if (IsSelectedObject(_focusedObject)) // 포커스 오브젝트가 선택된 상태면
                {
                    _focusedObject = null; // 참조만 해제 (선택 상태 유지)
                }
                else // 포커스만 된 상태면
                {
                    _focusedObject?.Unfocused(); // 포커스 해제
                    _focusedObject = null; // 참조 해제
                }
            }
        }
    }
}

private bool IsSelectedObject([CanBeNull] IMyRoomEditorEditableObject focusedObject)
{
    return focusedObject != null && focusedObject.Equals(SelectedObject); // 널이 아니고 선택된 오브젝트와 같으면 true
}
```

### 선택 처리 프로세스
```csharp
public override void OnPointerDown()
{
    if (InputUtils.IsPointerOnUI()) return; // UI 위에서 클릭했으면 무시
    //현재는 벽에대한 편집 기능이 없어 벽 클릭시 선택이 Release되게함 // 현재 벽 편집 기능이 없으므로 벽 클릭 시 선택 해제
    if (_focusedObject == null || _focusedObject.IsPlacementArea(out var area)) // 포커스 오브젝트가 없거나 배치 영역이면
    {
        ReleaseSelect(); // 선택 해제
    }
    else // 편집 가능한 오브젝트가 포커스된 경우
    {
        if (_focusedObject.Equals(SelectedObject)) // 같은 오브젝트를 다시 클릭했으면
        {
            ReleaseSelect(); // 선택 해제
            return; // 메서드 종료
        }
        SelectedObject?.Deselected(); // 이전 선택 오브젝트 선택 해제
        SelectedObject = _focusedObject; // 새로운 오브젝트 선택
        SelectedObject.Selected(); // 선택 상태로 설정
        Debug.Log($"[MyRoomEditorPropSelector] Object Selected {SelectedObject.GetPlacePropId()}"); // 선택 로그 출력
        OnObjectSelect?.Invoke(SelectedObject); // 선택 이벤트 호출
    }
}

private void ReleaseSelect()
{
    SelectedObject?.Deselected(); // 선택된 오브젝트 선택 해제
    SelectedObject = null; // 선택 오브젝트 참조 해제
    _focusedObject?.Deselected(); // 포커스 오브젝트 선택 해제 (안전하게)
    _focusedObject = null; // 포커스 오브젝트 참조 해제
    OnReleaseSelect?.Invoke(); // 선택 해제 이벤트 호출
}
```

## 기능 설명
### 오브젝트 검출
- 레이캐스트를 통한 타겟 레이어(MyRoomProp, Wall, Ground) 히트 검출
- 우선순위 레이어를 통한 정확한 오브젝트 타겟팅
- UI 위 포인터는 무시

### 포커스 관리
- 포커스된 오브젝트에 Focused() 호출
- 선택된 오브젝트는 Unfocus되지 않음
- 포커스 변경 시 이전 오브젝트 Unfocus

### 선택 로직
- 포인터 다운 시 포커스된 오브젝트 선택
- 같은 오브젝트 재선택 시 선택 해제
- 배치 영역(벽) 클릭 시 선택 해제

### 선택 해제
- 취소 키 입력 시 선택 해제
- 선택된 오브젝트 Deselected() 호출
- 포커스된 오브젝트 정리

### 실시간 감지
- 매 프레임마다 Raycast 수행
- 선택된 오브젝트는 계속 선택 상태 유지

## 의존성/상속 관계

- [`MyRoomEditorPropEditor`](/docs/projects/rfice/HousingSystem/MyRoomEditorPropEditor)를 상속받음.
- [`IMyRoomEditorEditableObject`](/docs/projects/rfice/HousingSystem/IMyRoomEditorEditableObject), [`IPlaceableArea`](/docs/projects/rfice/HousingSystem/IPlaceableArea) 인터페이스 사용.
- [`MyRoomEditorInputUtils`](/docs/projects/rfice/HousingSystem/MyRoomEditorInputUtils)에 의존.

## 사용 예시
### [`MyRoomEditorPropEditingManager`](/docs/projects/rfice/HousingSystem/MyRoomEditorPropEditingManager)에서 선택모드 전환
```csharp
private void OnChangedEditMode(PropEditMode mode)
{
    editingMode = mode;
    if (editingMode == PropEditMode.Disable)
    {
        CleanUpPropEditor();
        return;
    }
    
    propEditor?.Disable();
    propEditor = SwitchPropEditor();
    if(propEditor.Setup(_editingObject)) propEditor.Enable();
}

private MyRoomEditorPropEditor SwitchPropEditor()
{
    return editingMode switch
    {
        PropEditMode.Select => propSelector,
        PropEditMode.Move => propMover,
        PropEditMode.Rotate => propRotator,
    };
}
```

## 관련 클래스

- [`MyRoomEditorInputUtils`](/docs/projects/rfice/housingsystem/myroomeditorinpututils/)
- [`IMyRoomEditorEditableObject`](/docs/projects/rfice/housingsystem/imyroomeditoreditableobject/)
- [`MyRoomEditorPropEditingManager`](/docs/projects/rfice/housingsystem/myroomeditorpropeditingmanager/)
- [`MyRoomEditorPropEditor`](/docs/projects/rfice/housingsystem/myroompropeditor/)
