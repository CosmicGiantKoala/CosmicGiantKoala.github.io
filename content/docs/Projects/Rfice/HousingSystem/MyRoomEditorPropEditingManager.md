+++
title = "MyRoomEditorPropEditingManager"
description = "오브젝트 편집 상태를 관리하는 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 404
+++

## 개요

`MyRoomEditorPropEditingManager`는 [`MyRoomEditorState`](/docs/projects/rfice/housingsystem/myroomeditorstate/)를 상속받아 오브젝트의 편집 상태를 관리하는 클래스. 오브젝트 선택, 이동, 회전, 색상 변경, 삭제 등의 기능을 수행하며, 서브 에디터들과 UI 이벤트를 통해 편집 동작을 처리.

## 주요 역할

- **오브젝트 편집 모드 관리**: 상태 관리와 전략패턴을 결합하여 분리된 편집모드를 관리하고 상황에 따라 편집모드 전환.
- **편집 모드별 명령 호출**: 전환된 편집모드에 override된 입력 동작을 전달.
- **UI 연동**: 편집 UI와의 상호작용 처리.
- **색상 및 인터렉션 편집**: Material 변경 및 특수 인터렉션 처리.
- **데이터베이스 처리**: 편집 모드에서 변경된 오브젝트 데이터베이스 처리 이벤트 호출. 
- **오브젝트 삭제**: 편집 UI를 통해 오브젝트 삭제 및 데이터베이스 이벤트 호출.

## 주요 멤버

### 필드
```csharp
/// <summary>
/// 입력 처리 유틸리티 클래스.
/// 마우스 입력, UI 포인터 감지 등을 담당하며, 편집 동작 중 입력 상태를 확인.
/// </summary>
[Inject]
private MyRoomEditorInputUtils _inputUtils;

/// <summary>
/// 오브젝트 스포닝 인터페이스. Zenject를 통해 주입.
/// Material 로드 및 오브젝트 생성을 담당(Addressable 관리).
/// </summary>
[Inject]
private IPropSpawner _propSpawner;

/// <summary>
/// 인터렉션 관리자.
/// 사진 업로드 등의 특수 인터렉션을 처리.
/// </summary>
[Inject]
private MyRoomEditorInteractionManager _interactionManager;

/// <summary>
/// 오브젝트 편집 UI 컴포넌트.
/// 편집 메뉴 표시, 색상 선택, 버튼 이벤트 처리.
/// </summary>
[SerializeField]
private MyRoomEditorObjectEditUI objectEditUI;

/// <summary>
/// 현재 활성화된 Prop 에디터.
/// 전략 패턴을 통해 선택, 이동, 회전 모드별로 교체됨.
/// </summary>
[SerializeField]
private MyRoomEditorPropEditor propEditor;

/// <summary>
/// 오브젝트 선택 에디터.
/// Select 모드에서 사용되며, 오브젝트 선택 및 해제를 담당.
/// </summary>
[SerializeField]
private MyRoomEditorPropSelector propSelector;

/// <summary>
/// 오브젝트 이동 에디터.
/// Move 모드에서 사용되며, 오브젝트 이동 처리.
/// </summary>
[SerializeField]
private MyRoomEditorPropMover propMover;

/// <summary>
/// 오브젝트 회전 에디터.
/// Rotate 모드에서 사용되며, 드래그를 통한 오브젝트 회전 처리.
/// </summary>
[SerializeField]
private MyRoomEditorPropRotator propRotator;

/// <summary>
/// 현재 편집 중인 오브젝트.
/// 선택된 오브젝트의 편집 작업을 수행.
/// </summary>
private IMyRoomEditorEditableObject _editingObject;

/// <summary>
/// 배치된 모든 오브젝트 리스트.
/// 편집 관리 대상 오브젝트들을 추적.
/// </summary>
private List<SpawnablePropBase> _spawnedPropBases = new();

/// <summary>
/// 삭제 스택.
/// 삭제 작업 시 부모-자식 관계를 고려한 순차적 삭제를 위해 사용.
/// </summary>
private Stack<IMyRoomEditorEditableObject> _deleteStack = new();

/// <summary>
/// 오브젝트 편집 모드 열거형.
/// 해당 열거형을 매개변수로 메서드를 호출해 편집 모드 전환.
/// </summary>
public enum PropEditMode { Disable, Select, Move, Rotate }

/// <summary>
/// 현재 편집 모드 상태.
/// Select, Move, Rotate, Disable 중 하나의 값.
/// </summary>
private PropEditMode editingMode;
```

### 주요 메서드
```csharp
/// <summary>
/// 배치된 오브젝트를 등록하여 편집 관리 대상으로 추가.
/// 새로 배치된 오브젝트가 편집 시스템에 등록되어 선택, 이동, 삭제 등의 작업이 가능해짐.
/// </summary>
/// <param name="prop">등록할 SpawnablePropBase 컴포넌트</param>
public void RegisterProp(SpawnablePropBase prop)

/// <summary>
/// 오브젝트 삭제 이벤트 처리.
/// 선택된 오브젝트와 그 자식 오브젝트들을 재귀적으로 삭제.
/// 데이터베이스에서 정보 제거 및 UI 업데이트.
/// </summary>
private void OnDeleteEvent()

/// <summary>
/// 자식 오브젝트를 재귀적으로 검색하여 삭제 스택에 추가.
/// 부모 ID를 기준으로 자식들을 찾아 순차 삭제 준비.
/// </summary>
/// <param name="parentId">부모 오브젝트의 ID</param>
private void SearchChildDeletedTarget(string parentId)

/// <summary>
/// 편집 모드를 변경하고 해당 모드의 에디터를 활성화.
/// 전략 패턴을 통해 선택, 이동, 회전 모드를 전환.
/// </summary>
/// <param name="mode">변경할 편집 모드</param>
private void OnChangedEditMode(PropEditMode mode)

/// <summary>
/// Prop 에디터 정리.
/// 현재 에디터를 정리하고 비활성화.
/// </summary>
private void CleanUpPropEditor()

/// <summary>
/// 편집 모드에 따른 에디터 선택.
/// 스위치 표현식을 사용하여 적절한 에디터 반환.
/// </summary>
/// <returns>선택된 모드의 PropEditor 인스턴스</returns>
private MyRoomEditorPropEditor SwitchPropEditor()

/// <summary>
/// 배치 정보 업데이트를 처리.
/// 프리젠터를 통해 데이터베이스를 업데이트하고 변경 이벤트를 발생.
/// </summary>
/// <param name="placePropInfo">업데이트할 배치 정보</param>
private void UpdatePlacePropInfo(MyRoomPlaceProp placePropInfo)

/// <summary>
/// 색상 변경 도구 활성화.
/// 선택된 오브젝트의 색상 리스트를 UI에 표시.
/// </summary>
private void OnActiveChangeColorTool()

/// <summary>
/// 색상 선택 시 처리.
/// 선택된 색상을 로드하여 오브젝트에 적용.
/// </summary>
/// <param name="index">선택된 색상의 인덱스</param>
private void OnSelectedColorToChange(int index)

/// <summary>
/// 오브젝트 선택 이벤트 처리.
/// 선택된 오브젝트를 편집 대상으로 설정하고 편집 UI 표시.
/// </summary>
/// <param name="selectedObject">선택된 편집 가능 오브젝트</param>
private void OnObjectSelected(IMyRoomEditorEditableObject selectedObject)

/// <summary>
/// 이동 완료 처리.
/// 배치 정보 업데이트 후 선택 해제 및 모드 전환.
/// </summary>
private void OnFinishMove()

/// <summary>
/// 회전 완료 처리.
/// 배치 정보 업데이트 후 선택 해제 및 모드 전환.
/// </summary>
private void OnFinishRotate()
```

## 코드 스니펫

### 삭제 처리 프로세스
```csharp
private void OnDeleteEvent()
{
      if (_editingObject == null) return;  // 편집 중인 오브젝트 레퍼런스 체크
        var deleteCalledProp = _editingObject;  // 삭제할 오브젝트 임시 캐싱
        OnReleaseSelected();  // 선택 해제 호출
        _deleteStack.Push(deleteCalledProp);  // 삭제 스택에 푸시
        SearchChildDeletedTarget(deleteCalledProp.GetPlacePropId());  // 자식 검색

        // 스택에 있는 모든 오브젝트 삭제
        while (_deleteStack.Count > 0)
        {
            var deleteTarget = _deleteStack.Pop();  // 스택에서 꺼냄
            RemovePlacePropInfo(deleteTarget.GetPlacePropId());  // DB 제거
            UnRegisterProp(deleteTarget.GetPlacePropId());  // 등록 해제
            deleteTarget.Delete();  // 실제 삭제
            OnUpdatedPlacementProp?.Invoke();  // 변경 이벤트
        }

        OnChangedEditMode(PropEditMode.Select);  // 선택 모드 전환
        _deleteStack.Clear();  // 스택 초기화
}

private void SearchChildDeletedTarget(string parentId)
{
    // 부모를 가진 오브젝트 중 parentId와 일치하는 자식들 찾기
    var targets = _spawnedPropBases.Where
            (basePropComp => basePropComp.ParentProp != null &&
              basePropComp.ParentProp.GetPlacePropId() == parentId).ToList();
    if (targets.Count == 0) return;  // 자식 없음
    foreach (var target in targets)
    {
        _deleteStack.Push(target.GetEditableObject());  // 자식 추가
        SearchChildDeletedTarget(target.GetPlacePropId());  // 재귀 호출
    }
}
```

### 오브젝트 색상 변경 프로세스(material변경)
```csharp
private void OnActiveChangeColorTool()
{
    if (_editingObject == null) return;  // 편집 오브젝트 확인
    if (!_editingObject.IsEditableColor(out var colorEditableProp)) return;  // 색상 편집 가능한 오브젝트 확인
    var colorList = colorEditableProp.GetColorList();  // 색상 리스트 획득
    objectEditUI.DrawColorList(colorList);  // UI에 색상 리스트 표시
}

private void OnSelectedColorToChange(int index)
{
    if (_editingObject == null) return;  
    if (!_editingObject.IsEditableColor(out var colorEditableProp)) return; 
    var selectedColor = colorEditableProp.GetColorList()[index].materialKey;  // 색상 키 획득
    _propSpawner.SpawnMaterial(selectedColor, (loadedMat) =>  // Material 로드
    {
        colorEditableProp.SetColor(loadedMat, index);  // 색상 적용
        UpdatePlacePropInfo(_editingObject.GetPlacePropInfo());  // 정보 업데이트
        OnUpdatedPlacementProp?.Invoke();  // 변경 이벤트
    });
}
```


### 편집 모드 전환
```csharp
private void OnChangedEditMode(PropEditMode mode)
{
    editingMode = mode;  // 모드 설정
    if (editingMode == PropEditMode.Disable)
    {
        CleanUpPropEditor();  // 에디터 정리
        return;
    }

    propEditor?.Disable();  // 기존 에디터 비활성화
    propEditor = SwitchPropEditor();  // 새 에디터 선택
    if (propEditor.Setup(_editingObject)) propEditor.Enable();  // 설정 및 활성화
}

private void CleanUpPropEditor()
{
    propEditor?.CleanUp();  // 정리
    propEditor?.Disable();  // 비활성화
    propEditor = null;      // 초기화
}

private MyRoomEditorPropEditor SwitchPropEditor()
{
    return editingMode switch
    {
        PropEditMode.Select => propSelector,  // 선택 에디터
        PropEditMode.Move => propMover,       // 이동 에디터
        PropEditMode.Rotate => propRotator,   // 회전 에디터
        _ => null  // 기본값
    };
}
```

## 주요 기능 설명

### 편집 모드
- **Select**: 오브젝트 선택 모드(OnObjectSelected호출)
- **Move**: 오브젝트 이동 모드(OnFinishMove호출)
- **Rotate**: 오브젝트 회전 모드(OnFinishRotate호출)
- **Disable**: 편집 비활성화

### 삭제 처리
- 재귀적으로 자식 오브젝트까지 삭제
- 데이터베이스에서 정보 제거
- UI 및 상태 업데이트

### 색상 변경
- Material 동적 로드 및 적용
- 프리젠터를 통한 데이터 업데이트

### 인터렉션 처리
- 사진 프레임 이미지 업로드
- 특수 오브젝트 인터렉션 지원

## 관련 클래스
- [`MyRoomEditorState`](/docs/projects/rfice/housingsystem/myroomeditorstate/): 부모 클래스
- [`MyRoomEditorInputUtils`](/docs/projects/rfice/housingsystem/myroomeditorinpututils/): 입력 처리 유틸리티
- [`MyRoomEditorInteractionManager`](/docs/projects/rfice/housingsystem/myroomeditorinteractionmanager/): 인터렉션 관리
- `IPropSpawner`: 오브젝트 스포닝 인터페이스
- [`MyRoomEditorObjectEditUI`](/docs/projects/rfice/housingsystem/myroomeditorobjecteditui/): 편집 UI
- [`MyRoomEditorPropSelector`](/docs/projects/rfice/housingsystem/myroompropselector/), [`MyRoomEditorPropMover`](/docs/projects/rfice/housingsystem/myroompropmover/), [`MyRoomEditorPropRotator`](/docs/projects/rfice/housingsystem/myroomproprotator/) : 서브에디터