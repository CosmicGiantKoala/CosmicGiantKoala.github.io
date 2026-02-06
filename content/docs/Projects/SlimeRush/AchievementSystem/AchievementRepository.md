+++
title = "AchievementRepository"
description = "`IAchievementRepository` 인터페이스를 구현하는 구체적인 데이터 계층 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 210
+++
## 개요
`AchievementRepository` 클래스는 SlimeRush 게임의 업적 시스템에서 [`IAchievementRepository`](/docs/projects/SlimeRush/AchievementSystem/IAchievementRepository)
인터페이스를 구현하는 구체적인 데이터 저장소 클래스입니다. 이 클래스는 데이터 소스 계층과 업적 시스템 간의 브리지 역할을 하며,
의존성 주입을 통해 다양한 데이터 소스(로컬, 클라우드 등)를 유연하게 사용할 수 있도록 합니다. 저장소 패턴을 구현하여 데이터 접근을 추상화합니다.

## 역할
- 데이터 소스와 시스템 간의 브리지
- 데이터 저장 기능 제공
- 데이터 로드 기능 제공
- 의존성 주입을 통한 유연한 데이터 소스 관리

## 선언
```csharp
public class AchievementRepository : IAchievementRepository
```

## 멤버
### 속성
```csharp
/// <summary>
/// 데이터 소스 (의존성 주입)
/// </summary>
[Inject]
private IAchievementDataSource _achievementDataSource;
```

### 메서드
```csharp
/// <summary>
/// 업적 데이터 저장
/// </summary>
/// <param name="saveDataJson">저장할 데이터 문자열 (JSON 형식)</param>
public void SaveAchievementData(string saveDataJson)

/// <summary>
/// 업적 저장 데이터 로드
/// </summary>
/// <returns>저장된 데이터 문자열 (JSON 형식)</returns>
public string LoadAchievementSaveData()
```

## 주요 코드 스니펫

### 데이터 저장

```csharp
public void SaveAchievementData(string saveDataJson)
{
    _achievementDataSource.SaveAchievementData(saveDataJson);
}
```

### 데이터 로드

```csharp
public string LoadAchievementSaveData()
{
    return _achievementDataSource.LoadAchievementSaveData();
}
```

## 기능 설명
### 저장소 패턴 구현
- 데이터 접근 추상화
- 데이터 소스 교체 용이
- 테스트 용이성 향상

### 데이터 흐름 관리
- 상위 계층에서 데이터 전달
- 데이터 소스로 데이터 전달
- 결과 반환

## 의존성/상속 관계
- [`IAchievementRepository`](/docs/projects/SlimeRush/AchievementSystem/IAchievementRepository) 인터페이스를 구현
- [`IAchievementDataSource`](/docs/projects/SlimeRush/AchievementSystem/IAchievementDataSource) 인터페이스를 통해 DataSource에 접근 (의존성 주입)
- [`AchievementInteractor`](/docs/projects/SlimeRush/AchievementSystem/AchievementInteractor)에서 인터페이스를 통해 해당 클래스 접근(기본값)

## 관련 클래스
- [`IAchievementRepository`](/docs/projects/SlimeRush/AchievementSystem/IAchievementRepository)
- [`IAchievementDataSource`](/docs/projects/SlimeRush/AchievementSystem/IAchievementDataSource)
- [`LocalAchievementDataSource`](/docs/projects/SlimeRush/AchievementSystem/LocalAchievementDataSource)
- [`CloudSyncDataSource`](/docs/projects/SlimeRush/AchievementSystem/CloudSyncDataSource)
- [`AchievementInteractor`](/docs/projects/SlimeRush/AchievementSystem/AchievementInteractor)