+++
title = "IScreenProp"
description = "실시간 파일 공유 모듈 정의"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 425
+++
## 개요

`IScreenProp` 인터페이스는 MyRoomEditor에서 스크린 타입의 오브젝트를 식별하기 위한 마커 인터페이스입니다. 이 인터페이스는 [`IInteractableProp`](/docs/projects/rfice/HousingSystem/IInteractableProp)를 상속받아 상호작용 기능을 제공합니다.

## 역할
- 스크린 타입 프로퍼티의 식별자 역할
- 스크린 관련 오브젝트 공통 인터페이스 제공
- 상호작용 가능한 스크린 객체들의 표준화

## 선언
```csharp
public interface IScreenProp : IInteractableProp
```

## 멤버
(상속받은 [`IInteractableProp`](/docs/projects/rfice/HousingSystem/IInteractableProp)의 메서드 사용)

## 기능 설명

### 마커 인터페이스
- `IScreenProp`는 특정 기능을 정의하지 않고 타입 식별만 수행
- 스크린 관련 오브젝트들을 구분하기 위한 용도로 사용
- 컴포넌트 검색 시 타입 체크에 활용

### 상속된 기능
- [`IInteractableProp`](/docs/projects/rfice/HousingSystem/IInteractableProp)의 `Interact()` 메서드 상속
- 스크린 오브젝트들의 기본 상호작용 기능 제공

## 의존성/상속 관계

- [`IInteractableProp`](/docs/projects/rfice/HousingSystem/IInteractableProp)를 상속받음.
- [`SpawnableScreenProp`](/docs/projects/rfice/housingsystem/spawnablescreenprop/): 실시간 파일 공유가 가능한 스크린 오브젝트들에서 구현

## 사용 예시
#### 스크린 프로퍼티 타입 확인
```csharp
if (editableObject is IScreenProp screenProp)
{
    // 스크린 타입 프로퍼티로 처리
    screenProp.Interact(); // 상호작용 실행
}
```

## 관련 클래스

- [`SpawnableScreenProp`](/docs/projects/rfice/HousingSystem/SpawnableScreenProp)
- [`IInteractableProp`](/docs/projects/rfice/HousingSystem/IInteractableProp)
- [`MyRoomEditorInteractionManager`](/docs/projects/rfice/HousingSystem/MyRoomEditorInteractionManager)