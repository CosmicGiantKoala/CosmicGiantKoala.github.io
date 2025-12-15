+++
title = "SpawnableScreenProp"
description = "특수한 인터렉션을 포함한 오브젝트 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 417
+++
#### **(본 문서는 AI로 작성된 프로토타입 문서입니다.)**
## 개요

`SpawnableScreenProp`는 스크린 오브젝트 클래스입니다. `SpawnablePropBase`를 상속받아 벽에 배치되는 스크린의 특수 기능을 구현하며, 개인공간에서 실시간 파일 공유 기능 모듈(NetworkedScreen)을 사용할 수 있게 설정합니다.

## 주요 역할

- **스크린 인터페이스 제공**: 실시간 파일 공유를 위한 화면 제공
- **NetworkedScreen 연동**: 네트워크를 통한 파일 공유 모듈 연결
- **벽 배치 특화**: 벽면 배치에 최적화된 위치 및 기즈모
- **화면 트랜스폼 제공**: ScreenHandlerTr을 통한 화면 위치 제공

## 구현 인터페이스

- `IMoveableProp`: 이동 기능
- `IScreenProp`: 스크린 특수 기능
- `IInteractableProp`: 상호작용 기능 (상속)

## 주요 컴포넌트

### 필드
```csharp
[SerializeField]
private Transform screenPropTr;
public Transform ScreenHandlerTr => screenPropTr;

private Collider _collider;
private int _targetLayer;
private Vector3 _extentsCorrection;
private PropEditingState _propEditingState;
```

### 특수 기능
- **ScreenHandlerTr**: 스크린 표면의 트랜스폼 (파일 공유 UI 표시용)
- **NetworkedScreen**: 실시간 파일 공유 모듈과 연동

## 특징

### 편집 가능성
- **색상 편집**: 불가능
- **이동**: 가능 (벽면 이동)
- **회전**: 불가능 (벽면 고정)
- **스크린**: 가능 (특수 인터랙션)

### Interact 메서드
현재 빈 구현이지만, NetworkedScreen 모듈 초기화나 파일 공유 시작 등의 기능을 추가할 수 있습니다.

### 벽 배치
SpawnableWallProp과 동일하게 벽면에 배치되며 방향별 기즈모 계산을 수행합니다.

## 사용 예시

### NetworkedScreen 연동
```csharp
var screenProp = GetComponent<SpawnableScreenProp>();
var screenTransform = screenProp.ScreenHandlerTr;
// NetworkedScreen 모듈을 screenTransform에 연결
```

## 의존성

- **NetworkedScreen 모듈**: 실시간 파일 공유 기능
- **PropEditingState**: 하이라이트 관리
- **Collider**: 기즈모 계산용
