+++
title = "MyRoomEditorPropEditor"
description = "편집 기능에서 사용되는 공통 메서드와 멤버를 정의하는 abstract 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 405
+++
#### **(본 문서는 AI로 작성된 프로토타입 문서입니다.)**
## 개요

`MyRoomEditorPropEditor`는 각각의 편집 기능에서 사용되는 공통 메서드와 멤버를 정의하는 추상 클래스입니다. `MyRoomEditorPropEditingManager`를 통해 받은 입력 및 UI 동작에 대한 처리를 서브클래스에서 구현합니다.

## 주요 역할

- **공통 인터페이스 제공**: 모든 편집 에디터의 기본 인터페이스 정의
- **상태 캐싱**: 편집 중인 오브젝트의 상태를 캐시하여 실행 취소 지원
- **입력 처리**: 포인터 이벤트 처리 추상 메서드 정의
- **라이프사이클 관리**: Enable/Disable 및 Setup/CleanUp 메서드 정의

## 주요 멤버

### 필드
```csharp
[Inject]
protected MyRoomEditorInputUtils InputUtils;

protected IMyRoomEditorEditableObject SelectedObject;
protected int CachedColorIndex;
protected Vector3 CachedPosition;
protected Quaternion CachedRotation;
protected SpawnablePropBase CachedParent;
```

### 추상 메서드
```csharp
public abstract void Enable();
public abstract void Disable();
public abstract bool Setup(IMyRoomEditorEditableObject setUpObject);
public abstract void CleanUp();
public abstract void OnPointerDown();
public abstract void OnPointerUp();
public abstract void OnCancel();
public abstract void OnRightClick();
```

## 코드 스니펫

### 전체 클래스 코드
```csharp
using System;
using UnityEngine;
using Zenject;

namespace Dev.Scripts.Rsup.Scenes.MyRoomEditor
{
    public abstract class MyRoomEditorPropEditor : MonoBehaviour
    {
        [Inject]
        protected MyRoomEditorInputUtils InputUtils;
        
        protected IMyRoomEditorEditableObject SelectedObject;
        protected int CachedColorIndex;
        protected Vector3 CachedPosition;
        protected Quaternion CachedRotation;
        protected SpawnablePropBase CachedParent;

        public abstract void Enable();
        public abstract void Disable();
        public abstract bool Setup(IMyRoomEditorEditableObject setUpObject);
        public abstract void CleanUp();
        public abstract void OnPointerDown();
        public abstract void OnPointerUp();
        public abstract void OnCancel();
        public abstract void OnRightClick();
    }
}
```

## 상속 구조

`MyRoomEditorPropEditor`는 다음과 같은 서브클래스를 가집니다:
- `MyRoomPropSelector`: 오브젝트 선택 담당
- `MyRoomPropMover`: 오브젝트 이동 담당
- `MyRoomPropRotator`: 오브젝트 회전 담당

## 주요 기능 설명

### 상태 캐싱
- `CachedPosition`: 편집 전 위치 저장
- `CachedRotation`: 편집 전 회전 값 저장
- `CachedColorIndex`: 편집 전 색상 인덱스 저장
- `CachedParent`: 편집 전 부모 오브젝트 저장

### 라이프사이클
1. **Setup**: 편집할 오브젝트 설정 및 초기화
2. **Enable**: 에디터 활성화 및 이벤트 등록
3. **편집 작업 수행**: 서브클래스별 로직 실행
4. **Disable**: 에디터 비활성화 및 이벤트 해제
5. **CleanUp**: 상태 정리 및 리소스 해제

### 입력 처리
- **OnPointerDown**: 마우스 버튼 눌림 이벤트
- **OnPointerUp**: 마우스 버튼 뗌 이벤트
- **OnCancel**: 편집 취소 (ESC 키)
- **OnRightClick**: 우클릭 이벤트

## 의존성

- `MyRoomEditorInputUtils`: 입력 처리 유틸리티
- `IMyRoomEditorEditableObject`: 편집 가능한 오브젝트 인터페이스

## 관련 클래스

- **사용자**: `MyRoomEditorPropEditingManager`
- **서브클래스**: `MyRoomPropSelector`, `MyRoomPropMover`, `MyRoomPropRotator`
