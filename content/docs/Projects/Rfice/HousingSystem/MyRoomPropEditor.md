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

## 개요

`MyRoomEditorPropEditor`는 각각의 편집 기능에서 사용되는 공통 메서드와 멤버를 정의하는 추상 클래스. [`MyRoomEditorPropEditingManager`](/docs/projects/rfice/housingsystem/myroomeditorpropeditingmanager/)를 통해 받은 입력 및 UI 동작에 대한 처리를 서브클래스에서 구현.

## 주요 역할

- **공통 인터페이스 제공**: 모든 편집 에디터의 기본 인터페이스 정의
- **상태 캐싱**: 편집 중인 오브젝트의 상태를 캐시하여 실행 취소 지원
- **입력 처리**: 포인터 이벤트 처리 추상 메서드 정의
- **라이프사이클 관리**: Enable/Disable 및 Setup/CleanUp 메서드 정의

## 주요 멤버

### 필드
```csharp
/// <summary>
/// 입력 처리 유틸리티 클래스.
/// 마우스 입력, UI 포인터 감지 등을 담당하며, 편집 동작 중 입력 상태를 확인.
/// Zenject를 통해 주입되며, protected로 서브클래스에서 접근 가능.
/// </summary>
[Inject]
protected MyRoomEditorInputUtils InputUtils;

/// <summary>
/// 현재 선택된 편집 가능한 오브젝트.
/// 편집 작업의 대상이 되는 오브젝트를 참조.
/// </summary>
protected IMyRoomEditorEditableObject SelectedObject;

/// <summary>
/// 편집 시작 시점의 색상 인덱스 캐시.
/// 실행 취소 시 원래 색상으로 복원하기 위해 저장.
/// </summary>
protected int CachedColorIndex;

/// <summary>
/// 편집 시작 시점의 위치 캐시.
/// 실행 취소 시 원래 위치로 복원하기 위해 저장.
/// </summary>
protected Vector3 CachedPosition;

/// <summary>
/// 편집 시작 시점의 회전 값 캐시.
/// 실행 취소 시 원래 회전으로 복원하기 위해 저장.
/// </summary>
protected Quaternion CachedRotation;

/// <summary>
/// 편집 시작 시점의 부모 오브젝트 캐시.
/// 실행 취소 시 원래 부모 관계로 복원하기 위해 저장.
/// </summary>
protected SpawnablePropBase CachedParent;
```

### 추상 메서드
```csharp
/// <summary>
/// 에디터를 활성화하는 메서드.
/// 이벤트 등록, UI 표시, 편집 준비 작업을 수행.
/// 서브클래스에서 구체적인 활성화 로직을 구현.
/// </summary>
public abstract void Enable();

/// <summary>
/// 에디터를 비활성화하는 메서드.
/// 이벤트 해제, UI 숨김, 편집 종료 작업을 수행.
/// 서브클래스에서 구체적인 비활성화 로직을 구현.
/// </summary>
public abstract void Disable();

/// <summary>
/// 편집할 오브젝트를 설정하고 초기화하는 메서드.
/// 선택된 오브젝트의 상태를 캐시하고 편집 준비.
/// </summary>
/// <param name="setUpObject">편집할 오브젝트</param>
/// <returns>설정이 성공했는지 여부 (true: 성공, false: 실패)</returns>
public abstract bool Setup(IMyRoomEditorEditableObject setUpObject);

/// <summary>
/// 에디터의 상태를 정리하고 리소스를 해제하는 메서드.
/// 캐시된 상태 초기화, 참조 제거 등의 정리 작업.
/// </summary>
public abstract void CleanUp();

/// <summary>
/// 마우스 왼쪽 버튼 눌림 이벤트를 처리하는 메서드.
/// 편집 시작, 드래그 모드 진입 등의 동작을 수행.
/// </summary>
public abstract void OnPointerDown();

/// <summary>
/// 마우스 왼쪽 버튼 떼어짐 이벤트를 처리하는 메서드.
/// 편집 완료, 드래그 종료 등의 동작을 수행.
/// </summary>
public abstract void OnPointerUp();

/// <summary>
/// 취소 입력 (ESC 키)을 처리하는 메서드.
/// 현재 편집 작업을 취소하고 이전 상태로 복원.
/// </summary>
public abstract void OnCancel();

/// <summary>
/// 마우스 오른쪽 버튼 클릭 이벤트를 처리하는 메서드.
/// 컨텍스트 메뉴 표시, 특수 동작 수행 등의 기능.
/// </summary>
public abstract void OnRightClick();
```

## 상속 구조

`MyRoomEditorPropEditor`의 서브클래스.
- [`MyRoomPropSelector`](/docs/projects/rfice/housingsystem/myroompropselector/): 오브젝트 선택 로직 구현.
- [`MyRoomPropMover`](/docs/projects/rfice/housingsystem/myroompropmover/): 오브젝트 이동 로직 구현.
- [`MyRoomPropRotator`](/docs/projects/rfice/housingsystem/myroomproprotator/): 오브젝트 회전 로직 구현.

## 주요 기능 설명

### 상태 캐싱
- `CachedPosition`: 편집 전 위치 저장
- `CachedRotation`: 편집 전 회전 값 저장
- `CachedColorIndex`: 편집 전 색상 인덱스 저장
- `CachedParent`: 편집 전 부모 오브젝트 저장

### 공통 동작 순서
1. **Setup(IMyRoomEditorEditableObject setUpObject)**: 편집할 오브젝트 설정 및 초기화
2. **Enable()**: 에디터 활성화 및 이벤트 등록
3. **편집 작업 수행**: 서브클래스별 로직 실행
4. **Disable()**: 에디터 비활성화 및 이벤트 해제
5. **CleanUp()**: 상태 정리 및 리소스 해제

## 관련 클래스

- [`MyRoomEditorInputUtils`](/docs/projects/rfice/housingsystem/myroomeditorinpututils/): 입력 처리 유틸리티
- [`IMyRoomEditorEditableObject`](/docs/projects/rfice/housingsystem/imyroomeditoreditableobject/): 편집 가능한 오브젝트 인터페이스
- [`MyRoomEditorPropEditingManager`](/docs/projects/rfice/housingsystem/myroomeditorpropeditingmanager/): 사용 클래스
- [`MyRoomPropSelector`](/docs/projects/rfice/housingsystem/myroompropselector/), [`MyRoomPropMover`](/docs/projects/rfice/housingsystem/myroompropmover/), [`MyRoomPropRotator`](/docs/projects/rfice/housingsystem/myroomproprotator/): 서브 클래스.