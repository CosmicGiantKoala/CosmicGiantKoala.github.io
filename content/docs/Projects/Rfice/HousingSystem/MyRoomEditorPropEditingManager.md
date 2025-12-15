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
#### **(본 문서는 AI로 작성된 프로토타입 문서입니다.)**
## 개요

`MyRoomEditorPropEditingManager`는 `MyRoomEditorState`를 상속받아 오브젝트의 편집 상태를 관리하는 클래스입니다. 오브젝트 선택, 이동, 회전, 색상 변경, 삭제 등의 기능을 수행하며, 서브 에디터들과 UI 이벤트를 통해 편집 동작을 처리합니다.

## 주요 역할

- **오브젝트 관리**: 배치된 오브젝트들의 등록 및 관리
- **편집 모드 전환**: 선택, 이동, 회전 모드 간 전환
- **UI 연동**: 편집 UI와의 상호작용 처리
- **상태 스택 관리**: 실행 취소 및 삭제 작업 관리
- **색상 및 인터렉션 편집**: Material 변경 및 특수 인터렉션 처리

## 주요 멤버

### 필드
```csharp
[Inject]
private MyRoomEditorInputUtils _inputUtils;

[Inject]
private MyRoomEditorInteractionManager _interactionManager;

[Inject]
private IPropSpawner _propSpawner;

[SerializeField]
private MyRoomEditorObjectEditUI objectEditUI;

[SerializeField]
private GameObject editingCanvas;

[SerializeField]
private MyRoomEditorPropEditor propEditor;

[SerializeField]
private MyRoomEditorPropSelector propSelector;

[SerializeField]
private MyRoomEditorPropMover propMover;

[SerializeField]
private MyRoomEditorPropRotator propRotator;

[SerializeField]
private PropEditMode editingMode;

public override event Action OnUpdatedPlacementProp;
public event Action<bool> OnActiveCategoryUI;

private IMyRoomEditorEditableObject _editingObject;
private List<SpawnablePropBase> _spawnedPropBases = new();
private Stack<IMyRoomEditorEditableObject> _deleteStack = new();
```

### 주요 메서드
```csharp
public void RegisterProp(SpawnablePropBase prop)
private void OnDeleteEvent()
private void OnChangedEditMode(PropEditMode mode)
private void UpdatePlacePropInfo(MyRoomPlaceProp placePropInfo)
private void OnObjectSelected(IMyRoomEditorEditableObject selectedObject)
private MyRoomEditorPropEditor SwitchPropEditor()
```

## 코드 스니펫

### 전체 클래스 코드
```csharp
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Dev.Scripts.Rsup.Domain.Entities.MyRoom;
using Dev.Scripts.Rsup.Presentation.Presenters.MyRoomEditor;
using Dev.Scripts.Rsup.Scenes.Components.Common;
using Dev.Scripts.Rsup.Scenes.Components.MyRoomEditor;
using UnityEngine;
using Zenject;

namespace Dev.Scripts.Rsup.Scenes.MyRoomEditor
{
    public class MyRoomEditorPropEditingManager : MyRoomEditorState
    {
        [Inject]
        private MyRoomEditorInputUtils _inputUtils;
        
        [Inject]
        private MyRoomEditorInteractionManager _interactionManager;
        
        [Inject]
        private IPropSpawner _propSpawner;
        
        [SerializeField]
        private MyRoomEditorObjectEditUI objectEditUI;

        [SerializeField]
        private GameObject editingCanvas;

        [SerializeField]
        private MyRoomEditorPropEditor propEditor; //
        
        [SerializeField]
        private MyRoomEditorPropSelector propSelector;
        
        [SerializeField]
        private MyRoomEditorPropMover propMover;
        
        [SerializeField]
        private MyRoomEditorPropRotator propRotator;

        [SerializeField]
        private PropEditMode editingMode;
        
        public override event Action OnUpdatedPlacementProp;
        public event Action<bool> OnActiveCategoryUI;
        
        private IMyRoomEditorEditableObject _editingObject;
        private List<SpawnablePropBase> _spawnedPropBases = new ();
        private Stack<IMyRoomEditorEditableObject> _deleteStack = new ();

        protected override void Awake()
        {
            base.Awake();
            EditorInputDispatcher.OnDeletePressEvent += OnDeleteEvent;
            objectEditUI.OnClickDeleteEvent += OnDeleteEvent;
            objectEditUI.OnClickEditColorEvent += OnActiveChangeColorTool;
            objectEditUI.OnClickMoveEvent += OnActiveMoveTool;
            objectEditUI.OnClickRotateQuarterEvent += OnRotateQuarter;
            objectEditUI.OnClickRotateFreeEvent += OnActiveRotateFreeTool;
            objectEditUI.OnClickUploadPhotoEvent += OnUploadPhoto;
            objectEditUI.OnSelectColorToChange += OnSelectedColorToChange;
            
            propSelector.OnObjectSelect += OnObjectSelected;
            propSelector.OnReleaseSelect += OnReleaseSelected;
            propMover.OnFinishMove += OnFinishMove;
            propMover.OnUpdatePlacementProp += OnUpdatePlacementProp;
            propRotator.OnFinishRotate += OnFinishRotate;
            propRotator.OnUpdatePlacementProp += OnUpdatePlacementProp;

            _propSpawner.OnFinishLoadPlacedPropList += SetPropBaseParentTransform;
        }

        protected override void OnDestroy()
        {
            base.OnDestroy();
            EditorInputDispatcher.OnDeletePressEvent -= OnDeleteEvent;
            objectEditUI.OnClickDeleteEvent -= OnDeleteEvent;
            objectEditUI.OnClickEditColorEvent -= OnActiveChangeColorTool;
            objectEditUI.OnClickMoveEvent -= OnActiveMoveTool;
            objectEditUI.OnClickRotateQuarterEvent -= OnRotateQuarter;
            objectEditUI.OnClickRotateFreeEvent -= OnActiveRotateFreeTool;
            objectEditUI.OnClickUploadPhotoEvent -= OnUploadPhoto;
            objectEditUI.OnSelectColorToChange -= OnSelectedColorToChange;
            
            propSelector.OnObjectSelect -= OnObjectSelected;
            propSelector.OnReleaseSelect -= OnReleaseSelected;
            propMover.OnFinishMove -= OnFinishMove;
            propMover.OnUpdatePlacementProp -= OnUpdatePlacementProp;
            propRotator.OnFinishRotate -= OnFinishRotate;
            propRotator.OnUpdatePlacementProp -= OnUpdatePlacementProp;
            
            _propSpawner.OnFinishLoadPlacedPropList -= SetPropBaseParentTransform;
        }

        protected override void OnPointerDown()
        {
            if (_inputUtils.IsPointerOnUI()) return;
            propEditor.OnPointerDown();
        }
        protected override void OnPointerUp()
        {
            propEditor.OnPointerUp();
        }
        protected override void OnCancel()
        {
            objectEditUI.HideMenu();
            propEditor.OnCancel();
        }
        protected override void OnRightClick()
        {
            propEditor.OnRightClick();
        }

        private void OnDeleteEvent()
        {
            if (_editingObject == null) return;
            var deleteCalledProp = _editingObject;
            OnReleaseSelected();
            _deleteStack.Push(deleteCalledProp);
            SearchChildDeletedTarget(deleteCalledProp.GetPlacePropId());

            while (_deleteStack.Count > 0)
            {
                var deleteTarget = _deleteStack.Pop();
                RemovePlacePropInfo(deleteTarget.GetPlacePropId());
                UnRegisterProp(deleteTarget.GetPlacePropId());
                deleteTarget.Delete();
                OnUpdatedPlacementProp?.Invoke();
            }
            
            OnChangedEditMode(PropEditMode.Select);
            _deleteStack.Clear();
        }

        private void SearchChildDeletedTarget(string parentId)
        {
            var targets = _spawnedPropBases.Where
                    (basePropComp => basePropComp.ParentProp !=null && 
                      basePropComp.ParentProp.GetPlacePropId() == parentId).ToList();
            if (targets.Count == 0) return;
            foreach (var target in targets)
            {
                _deleteStack.Push(target.GetEditableObject());
                SearchChildDeletedTarget(target.GetPlacePropId());
            }
        }

        private void OnActiveChangeColorTool()
        {
            if (_editingObject == null) return;
            if (!_editingObject.IsEditableColor(out var colorEditableProp)) return;
            var colorList = colorEditableProp.GetColorList();
            objectEditUI.DrawColorList(colorList);
        }

        private void OnSelectedColorToChange(int index)
        {
            if (_editingObject == null) return;
            if (!_editingObject.IsEditableColor(out var colorEditableProp)) return;
            var selectedColor = colorEditableProp.GetColorList()[index].materialKey;
            _propSpawner.SpawnMaterial(selectedColor, (loadedMat) =>
            {
                colorEditableProp.SetColor(loadedMat, index);
                UpdatePlacePropInfo(_editingObject.GetPlacePropInfo());
                OnUpdatedPlacementProp?.Invoke();
            });
        }

        private void OnActiveMoveTool()
        {
            OnChangedEditMode(PropEditMode.Move);
        }

        private void OnRotateQuarter()
        {
            if (!_editingObject.IsRotatableProp(out var rotatableProp)) return;
            rotatableProp.RotationBySnapValue(90f);
            UpdatePlacePropInfo(_editingObject.GetPlacePropInfo());
            OnUpdatedPlacementProp?.Invoke();
        }

        private void OnActiveRotateFreeTool()
        {
            OnChangedEditMode(PropEditMode.Rotate);
        }

        private void OnUploadPhoto()
        {
            if (_editingObject.IsPhotoFrameProp(out var photoFrameProp))
            {
                _interactionManager.UploadImage(photoFrameProp.OnCompleteUpload);
                photoFrameProp.ReserveCompletedApplyImageCallback(UpdatePlacePropInfo);
            }
            else
            {
                Debug.Log($"{_editingObject.PropNameKey} is not interactable");
            }
        }


        private void OnObjectSelected(IMyRoomEditorEditableObject selectedObject)
        {
            _editingObject = selectedObject;
            objectEditUI.ShowSelectedPropMenu(_editingObject);
        }

        private void OnReleaseSelected()
        {
            _editingObject = null;
            objectEditUI.HideMenu();
        }

        private void OnFinishMove()
        {
            UpdatePlacePropInfo(_editingObject.GetPlacePropInfo());
            OnReleaseSelected();
            OnChangedEditMode(PropEditMode.Select);
            
            OnActiveCategoryUI?.Invoke(true);
        }

        private void OnFinishRotate()
        {
            UpdatePlacePropInfo(_editingObject.GetPlacePropInfo());
            OnReleaseSelected();
            OnChangedEditMode(PropEditMode.Select);
        }

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

        private void CleanUpPropEditor()
        {
            propEditor?.CleanUp();
            propEditor?.Disable();
            propEditor = null;
        }

        private void UpdatePlacePropInfo(MyRoomPlaceProp placePropInfo)
        {
            _placementPresenter.UpdatePlaceProp(placePropInfo);
            OnUpdatedPlacementProp?.Invoke();
        }

        private void RemovePlacePropInfo(string placePropId)
        {
            _placementPresenter.RemovePlaceProp(placePropId);
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

        private void OnUpdatePlacementProp()
        {
            OnUpdatedPlacementProp?.Invoke();
        }

        protected override void Enable()
        {
            OnChangedEditMode(PropEditMode.Select);
        }

        protected override void Disable()
        {
            OnReleaseSelected();
            OnChangedEditMode(PropEditMode.Disable);
        }

        public void RegisterProp(SpawnablePropBase prop)
        {
            _spawnedPropBases.Add(prop);
        }

        private void UnRegisterProp(string propBaseId)
        {
            var propBase = _spawnedPropBases.FirstOrDefault(x=>x.GetPlacePropId() == propBaseId);
            if (propBase == null)
            {
                return;
            }
            _spawnedPropBases.Remove(propBase);
        }

        private void SetPropBaseParentTransform()
        {
            var childProps = _spawnedPropBases.Where(x=>
                x.GetPlacePropInfo().parentPropId.IsNullOrEmpty() == false).ToList();
            foreach (var childProp in childProps)
            {
                var parent =
                    _spawnedPropBases.FirstOrDefault(parent => parent.GetPlacePropId() == childProp.GetPlacePropInfo().parentPropId);
                if (parent != null)
                {
                    parent.AddChildProp(childProp);
                }
            }
        }

        [ContextMenu("Delete All")]
        private void DeleteAll()
        {
            for (int i = _spawnedPropBases.Count - 1; i >= 0; i--)
            {
                var propBase = _spawnedPropBases[i];
                var prop = propBase.GetEditableObject();
                _editingObject = prop;
                OnDeleteEvent();
            }
        }


        public List<string> GetSpawnableProps()
        {
            return _spawnedPropBases.Select(prop => prop.GetPlacePropId()).ToList();
        }

        public void DeleteSelectedProp(string propId)
        {
            var propBase = _spawnedPropBases.FirstOrDefault(x=>x.GetPlacePropId() == propId);
            if (propBase == null)
            {
                Debug.Log($"The SpawnablePropBase component corresponding to the '{propId}' could not be found.");
                return;
            }
            
            var prop = propBase.GetEditableObject();
            _editingObject = prop;
            OnDeleteEvent();
        }
        
        public void DeleteSelectedProp(GameObject propObj)
        {
            var propBase = propObj.GetComponent<SpawnablePropBase>();
            if (propBase == null)
            {
                Debug.Log($"The SpawnablePropBase component could not be found on the '{propObj.name}' object.");
                return;
            }
            
            var prop = propBase.GetEditableObject();
            _editingObject = prop;
            OnDeleteEvent();
        }
    }

    public enum PropEditMode
    {
        Disable,
        Select,
        Move,
        Rotate
    }
}
```

### 삭제 처리 로직
```csharp
private void OnDeleteEvent()
{
    if (_editingObject == null) return;
    var deleteCalledProp = _editingObject;
    OnReleaseSelected();
    _deleteStack.Push(deleteCalledProp);
    SearchChildDeletedTarget(deleteCalledProp.GetPlacePropId());

    while (_deleteStack.Count > 0)
    {
        var deleteTarget = _deleteStack.Pop();
        RemovePlacePropInfo(deleteTarget.GetPlacePropId());
        UnRegisterProp(deleteTarget.GetPlacePropId());
        deleteTarget.Delete();
        OnUpdatedPlacementProp?.Invoke();
    }
    
    OnChangedEditMode(PropEditMode.Select);
    _deleteStack.Clear();
}
```

### 편집 모드 전환
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
```

### 에디터 스위칭
```csharp
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

## 주요 기능 설명

### 편집 모드
- **Select**: 오브젝트 선택 모드
- **Move**: 오브젝트 이동 모드
- **Rotate**: 오브젝트 회전 모드
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

## 의존성

- `MyRoomEditorInputUtils`: 입력 처리 유틸리티
- `MyRoomEditorInteractionManager`: 인터렉션 관리
- `IPropSpawner`: 오브젝트 스포닝 인터페이스
- `MyRoomEditorObjectEditUI`: 편집 UI
- 다양한 `MyRoomEditorPropEditor` 서브클래스들

## 관련 클래스

- **부모 클래스**: `MyRoomEditorState`
- **서브 에디터**: `MyRoomEditorPropSelector`, `MyRoomEditorPropMover`, `MyRoomEditorPropRotator`
- **UI 컴포넌트**: `MyRoomEditorObjectEditUI`
- **인터페이스**: `IMyRoomEditorEditableObject`, `IColorEditableProp`, `IPhotoFrameProp`
