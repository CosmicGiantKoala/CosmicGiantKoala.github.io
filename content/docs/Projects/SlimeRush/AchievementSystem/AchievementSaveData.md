+++
title = "AchievementSaveData"
description = "업적 시스템에서 플레이어의 진행 상황을 저장하는 데이터 모델"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 201
+++
## 개요

`AchievementSaveData` 클래스는 SlimeRush 게임의 업적 시스템에서 플레이어의 진행 상황을 저장하는 데이터 모델입니다.
이 클래스는 업적의 현재 달성 횟수와 완료 여부를 저장하며, 게임 세션 간에 플레이어의 업적 진행 상황을 유지하는 데 사용됩니다.
직렬화 가능하여 다양한 저장소에 영구적으로 저장할 수 있습니다.

## 역할
- 플레이어 업적 진행 상황 저장
- 게임 세션 간 데이터 유지
- 직렬화 및 역직렬화 지원
- 업적 시스템 데이터 영속성 제공

## 선언
```csharp
[Serializable]
public class AchievementSaveData
```

## 멤버
### 속성
```csharp
/// <summary>
/// 업적의 고유 식별자
/// </summary>
public string ID { get; private set; }

/// <summary>
/// 현재 달성 횟수
/// </summary>
public int CurrentSuccess { get; private set; }

/// <summary>
/// 완료 여부
/// </summary>
public bool IsComplete { get; private set; }
```

### 생성자
```csharp
/// <summary>
/// AchievementSaveData 생성자
/// </summary>
/// <param name="id">업적 ID</param>
/// <param name="currentSuccess">현재 달성 횟수</param>
/// <param name="isComplete">완료 여부</param>
public AchievementSaveData(string id, int currentSuccess, bool isComplete)
```

## 주요 코드 스니펫
### 생성자 구현
```csharp
public AchievementSaveData(string id, int currentSuccess, bool isComplete)
{
    // 업적 ID 설정
    ID = id;
    // 현재 성공 횟수 설정
    CurrentSuccess = currentSuccess;
    // 완료 여부 설정
    IsComplete = isComplete;
}
```

## 기능 설명
### 데이터 구조
- **ID**: 업적 식별자 (고유 키)
- **CurrentSuccess**: 현재 달성한 성공 횟수
- **IsComplete**: 업적 완료 여부 (불리언)

### 직렬화 기능
- **JSON 호환성**: Newtonsoft.Json 또는 Unity의 JsonUtility와 호환
- **데이터 영속성**: 파일 저장 및 로드 지원
- **네트워크 전송**: JSON 형식으로 네트워크 전송 가능

## 의존성/상속 관계
- [`Serializable`](https://docs.unity3d.com/2022.3/Documentation/ScriptReference/Serializable.html) 속성 사용 (직렬화 지원)
- [`Achievement`](/docs/projects/SlimeRush/AchievementSystem/Achievement)클래스에서 해당 클래스 생성
- [`AchievementInteractor`](/docs/projects/SlimeRush/AchievementSystem/AchievementInteractor) 에서 해당 클래스 직렬화/역직렬화를 통해 문자열/클래스로 변경

## 사용 예시
#### [`AchievementSystem`](/docs/projects/SlimeRush/AchievementSystem/Achievementsystem)에서 저장 데이터 생성시 사용
```csharp
// Achievement에서 저장 데이터 생성
private void SaveCurrentAchievementInfo()
{
    // 모든 업적의 현재 진행 상태를 저장 데이터로 변환합니다
    var saveData = Achievements.Select(achievement => achievement.CreateAchievementSaveData()).ToList();
    // 변환된 저장 데이터를 파일로 저장합니다
    _achievementInteractor.SaveAchievementData(saveData);
}
```

#### [`AchievementInteractor`](/docs/projects/SlimeRush/AchievementSystem/AchievementInteractor)에서 저장 데이터 저장/로드
```csharp
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
- [`AchievementSystem`](/docs/projects/SlimeRush/AchievementSystem/Achievementsystem)
- [`AchievementCreator`](/docs/projects/SlimeRush/AchievementSystem/AchievementCreator)
- [`AchievementSheetData`](/docs/projects/SlimeRush/AchievementSystem/AchievementSheetData)
- [`IAchievementInteractor`](/docs/projects/SlimeRush/AchievementSystem/IAchievementInteractor)
- [`AchievementInteractor`](/docs/projects/SlimeRush/AchievementSystem/AchievementInteractor)