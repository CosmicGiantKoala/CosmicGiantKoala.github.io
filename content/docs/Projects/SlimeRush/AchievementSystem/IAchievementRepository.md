+++
title = "IAchievementRepository"
description = "업적 시스템에서 데이터 저장소의 기본 기능을 정의"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 209
+++
## 개요
`IAchievementRepository` 인터페이스는 SlimeRush 게임의 업적 시스템에서 데이터 저장소의 기본
기능을 정의합니다. 이 인터페이스는 업적 데이터의 로드와 저장 기능을 추상화하여, 
다양한 저장소 구현체(로컬, 클라우드 등)에서 일관된 방식으로 업적 데이터를 관리할 수 있도록 합니다. 
저장소 계층의 추상화를 통해 유연한 데이터 관리 아키텍처를 제공합니다.

## 역할
- 업적 데이터 로드 기능 정의
- 업적 데이터 저장 기능 정의
- 저장소 계층 추상화 제공

## 선언
```csharp
public interface IAchievementRepository
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
### 저장소 추상화
- 구체적인 저장소 구현 숨김
- 인터페이스를 통한 일관된 접근
- 다양한 저장소 백엔드 지원

## 의존성/상속 관계
- [`AchievementSaveData`](/docs/projects/SlimeRush/AchievementSystem/AchievementSaveData) 클래스에 의존
- [`AchievementRepository`](/docs/projects/SlimeRush/AchievementSystem/AchievementRepository) 에서 인터페이스 구현 

## 사용 예시
#### [`AchievementInteractor`](/docs/projects/SlimeRush/AchievementSystem/AchievementInteractor)에서 세이브/로드시 사용
```csharp
// 의존성 주입을 통한 사용
[Inject]
private IAchievementRepository _achievementRepository;

public void SaveAchievementData(List<AchievementSaveData> saveData)
{
    // 업적 데이터를 JSON 형식으로 직렬화합니다
    var saveDataJson = JsonConvert.SerializeObject(saveData, Formatting.Indented);
    // 직렬화된 데이터를 저장소에 저장합니다
    _achievementRepository.SaveAchievementData(saveDataJson);
}

public List<AchievementSaveData> LoadAchievementSaveData()
{
    // 업적 저장 데이터를 저장할 새로운 목록을 생성합니다
    var achievementSaveData = new List<AchievementSaveData>();
    // 저장소에서 JSON 형식의 업적 데이터를 로드합니다
    var saveDataJson = _achievementRepository.LoadAchievementSaveData();

    // 로드된 데이터가 있는 경우
    if (saveDataJson.Length > 0)
    {
        // JSON 데이터를 업적 저장 데이터로 역직렬화합니다
        achievementSaveData = JsonConvert.DeserializeObject<List<AchievementSaveData>>(saveDataJson);
    }

    // 업적 저장 데이터를 반환합니다 (데이터가 없으면 빈 목록이 반환됩니다)
    return achievementSaveData;
}
```

## 관련 클래스
- [`AchievementInteractor`](/docs/projects/SlimeRush/AchievementSystem/AchievementInteractor)
- [`AchievementRepository`](/docs/projects/SlimeRush/AchievementSystem/AchievementRepository)
- [`IAchievementDataSource`](/docs/projects/SlimeRush/AchievementSystem/IAchievementDataSource)
- [`LocalAchievementDataSource`](/docs/projects/SlimeRush/AchievementSystem/LocalAchievementDataSource)