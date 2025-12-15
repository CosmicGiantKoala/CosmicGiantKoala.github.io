+++
title = "MyRoomEditorState"
description = "MyRoomEditor의 상태를 관리하는 abstract 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 402
+++
#### **(본 문서는 AI로 작성된 프로토타입 문서입니다.)**
## 개요

`MyRoomEditorState`는 MyRoomEditor 시스템의 상태 관리를 담당하는 추상 클래스입니다. 다양한 편집 상태(배치, 편집 등)를 관리하며, 입력 이벤트를 처리하고 상태 변화에 따라 입력을 활성화/비활성화합니다.

## 주요 역할

- **상태 관리**: `MyRoomEditorStateEnum`에 따라 상태를 전환하고 관리
- **입력 처리**: `MyRoomEditorEdittingInputDispatcher`를 통해 편집 관련 입력 이벤트를 처리
- **상태별 로직**: 서브클래스에서 구현되는 추상 메서드를 통해 상태별 동작을 정의
- **의존성 주입**: Zenject를 사용한 객체 간 의존성 주입

## 주요 멤버

### 필드
```csharp
[Inject]
protected MyRoomEditorStateHandle MyRoomEditorStateHandle;

[Inject]
protected MyRoomEditorEdittingInputDispatcher EditorInputDispatcher;

[SerializeField]
private MyRoomEditorStateEnum targetState;

[SerializeField]
protected MyRoomEditorPlacementPresenter _placementPresenter;

public virtual event Action OnUpdatedPlacementProp;
```

### 추상 메서드
```csharp
protected abstract void OnPointerDown();
protected abstract void OnPointerUp();
protected abstract void OnCancel();
protected abstract void OnRightClick();
protected abstract void Enable();
protected abstract void Disable();
```

## 코드 스니펫

### 전체 클래스 코드
```csharp
using System;
using Dev.Scripts.Rsup.Presentation.Dispatchers;
using Dev.Scripts.Rsup.Presentation.Presenters.MyRoomEditor;
using UnityEngine;
using Zenject;

public abstract class MyRoomEditorState : MonoBehaviour
{
    [Inject]
    protected MyRoomEditorStateHandle MyRoomEditorStateHandle;

    [Inject]
    protected MyRoomEditorEdittingInputDispatcher EditorInputDispatcher;

    [SerializeField]
    private MyRoomEditorStateEnum targetState;

    [SerializeField]
    protected MyRoomEditorPlacementPresenter _placementPresenter;

    public virtual event Action OnUpdatedPlacementProp;

    protected virtual void Awake()
    {
        MyRoomEditorStateHandle.OnStateChanged += OnChangedState;
    }

    protected virtual void OnDestroy()
    {
        MyRoomEditorStateHandle.OnStateChanged -= OnChangedState;
    }

    private void InputEnable()
    {
        EditorInputDispatcher.OnPointerDownEvent += OnPointerDown;
        EditorInputDispatcher.OnPointerUpEvent += OnPointerUp;
        EditorInputDispatcher.OnCancelEvent += OnCancel;
        EditorInputDispatcher.OnRightClickEvent += OnRightClick;
    }

    private void InputDisable()
    {
        EditorInputDispatcher.OnPointerDownEvent -= OnPointerDown;
        EditorInputDispatcher.OnPointerUpEvent -= OnPointerUp;
        EditorInputDispatcher.OnCancelEvent -= OnCancel;
        EditorInputDispatcher.OnRightClickEvent -= OnRightClick;
    }

    protected abstract void OnPointerDown();
    protected abstract void OnPointerUp();
    protected abstract void OnCancel();
    protected abstract void OnRightClick();
    protected abstract void Enable();
    protected abstract void Disable();

    private void OnChangedState(MyRoomEditorStateEnum state)
    {
        if (state == targetState)
        {
            InputEnable();
            Enable();
        }
        else
        {
            InputDisable();
            Disable();
        }
    }

    protected void ChangeState(MyRoomEditorStateEnum state)
    {
        MyRoomEditorStateHandle.ChangeState(state);
    }
}
```

### 상태 변경 로직
```csharp
private void OnChangedState(MyRoomEditorStateEnum state)
{
    if (state == targetState)
    {
        InputEnable();
        Enable();
    }
    else
    {
        InputDisable();
        Disable();
    }
}
```

## 상속 구조

`MyRoomEditorState`는 다음과 같은 서브클래스를 가집니다:
- `MyRoomEditorPlacementManager`: 오브젝트 생성 및 배치 상태 관리
- `MyRoomEditorPropEditingManager`: 오브젝트 편집 상태 관리

## 의존성

- `MyRoomEditorStateHandle`: 상태 변경 이벤트 관리
- `MyRoomEditorEdittingInputDispatcher`: 편집 입력 이벤트 처리
- `MyRoomEditorPlacementPresenter`: 배치 관련 프리젠터

## 사용 예시

서브클래스 구현 예시:
```csharp
public class MyRoomEditorPlacementManager : MyRoomEditorState
{
    protected override void Enable()
    {
        // 배치 모드 활성화 로직
    }

    protected override void Disable()
    {
        // 배치 모드 비활성화 로직
    }

    // ... 다른 추상 메서드 구현
}
