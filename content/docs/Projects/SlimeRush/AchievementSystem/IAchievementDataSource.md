+++
title = "IAchievementDataSource"
description = "업적 시스템에서 데이터 소스의 기본 기능을 정의"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 201
+++
## 개요
`IAchievementDataSource` 인터페이스는 SlimeRush 게임의 업적 시스템에서 데이터 소스의 기본 기능을
정의합니다. 이 인터페이스는 업적 데이터의 로드와 저장 기능을 추상화하여, 다양한 데이터 소스(로컬, 클라우드
등)에서 일관된 방식으로 업적 데이터를 관리할 수 있도록 합니다. 데이터 소스의 구현체는 이 인터페이스를 
통해 업적 시스템과 상호작용합니다.

## 역할
- 업적 데이터 로드 기능 정의
- 업적 데이터 저장 기능 정의
- 데이터 소스 추상화 제공
- 유연한 데이터 소스 교체 지원([`LocalAchievementDataSource`](/docs/projects/SlimeRush/AchievementSystem/LocalAchievementDataSource), [`CloudSyncDataSource`](/docs/projects/SlimeRush/AchievementSystem/CloudSyncDataSource))

## 선언
```csharp
public interface IAchievementDataSource
```

## 멤버
### 메서드
```csharp
/// <summary>
/// 업적 저장 데이터를 로드합니다.
/// </summary>
/// <returns>업적 저장 데이터 JSON 문자열</returns>
public string LoadAchievementSaveData();

/// <summary>
/// 업적 데이터를 저장합니다.
/// </summary>
/// <param name="saveDataJson">저장할 업적 데이터 JSON 문자열</param>
public void SaveAchievementData(string saveDataJson);
```

## 기능 설명
### 추상화 계층
- 데이터 소스의 구체적인 구현 숨김
- 인터페이스를 통한 일관된 접근
- 다양한 데이터 소스 지원

### 의존성/상속 관계
- [`LocalAchievementDataSource`](/docs/projects/SlimeRush/AchievementSystem/LocalAchievementDataSource): 로컬 데이터 소스 구현 클래스
- [`CloudSyncDataSource`](/docs/projects/SlimeRush/AchievementSystem/CloudSyncDataSource): 클라우드 데이터 소스 구현 클래스

## 사용 예시
#### [`AchievementRepository`](/docs/projects/SlimeRush/AchievementSystem/AchievementRepository)에서 사용
```csharp
[Inject]
private IAchievementDataSource _achievementDataSource;

public void SaveAchievementData(string saveDataJson)
{
    _achievementDataSource.SaveAchievementData(saveDataJson);
}

public string LoadAchievementSaveData()
{
    return _achievementDataSource.LoadAchievementSaveData();
}
```

## 관련 클래스
- [`LocalAchievementDataSource`](/docs/projects/SlimeRush/AchievementSystem/LocalAchievementDataSource)
- [`CloudSyncDataSource`](/docs/projects/SlimeRush/AchievementSystem/CloudSyncDataSource)
- [`AchievementRepository`](/docs/projects/SlimeRush/AchievementSystem/AchievementRepository)
- [`AchievementInteractor`](/docs/projects/SlimeRush/AchievementSystem/AchievementInteractor)