+++
title = "IAchievementInteractor"
description = "업적 시스템에서 데이터 저장소와 상호작용하는 메서드들을 정의"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 205
+++
## 개요
`IAchievementInteractor` 인터페이스는 SlimeRush 게임의 업적 시스템에서 데이터 저장소와 상호작용하는
메서드들을 정의합니다. 이 인터페이스는 업적 데이터의 로드, 저장, 초기화 기능을 추상화하여, 다양한
데이터 소스(로컬, 클라우드 등)에서 일관된 방식으로 업적 데이터를 관리할 수 있도록 합니다.

## 역할
- 업적 데이터 접근 계층 정의
- 데이터 소스 추상화
- 데이터 로드/저장 인터페이스 제공
- 데이터 초기화 기능 제공
- 의존성 주입 지원

## 선언
```csharp
public interface IAchievementInteractor
```

## 멤버
### 메서드
```csharp
/// <summary>
/// 업적 시트 데이터 로드
/// </summary>
/// <returns>업적 시트 데이터 목록</returns>
List<AchievementSheetData> LoadAchievementData();

/// <summary>
/// 업적 저장 데이터 로드
/// </summary>
/// <returns>업적 저장 데이터 목록</returns>
List<AchievementSaveData> LoadAchievementSaveData();

/// <summary>
/// 업적 데이터 저장
/// </summary>
/// <param name="saveData">저장할 업적 데이터 목록</param>
void SaveAchievementData(List<AchievementSaveData> saveData);

/// <summary>
/// 업적 데이터 초기화
/// </summary>
/// <param name="onClearCompleteCallBack">초기화 완료 시 호출될 콜백</param>
void ClearAchievementData(Action onClearCompleteCallBack = null);
```

## 기능 설명

### 데이터 로드 기능
- `LoadAchievementData()`: 업적 시트 데이터([`AchievementSheetData`](/docs/projects/SlimeRush/AchievementSystem/AchievementSheetData)) 로드
- `LoadAchievementSaveData()`: 업적 저장 데이터([`AchievementSaveData`](/docs/projects/SlimeRush/AchievementSystem/AchievementSaveData)) 로드

### 데이터 저장 기능
- `SaveAchievementData()`: 플레이어의 업적 진행 상황 저장
- 업적 저장 데이터([`AchievementSaveData`](/docs/projects/SlimeRush/AchievementSystem/AchievementSaveData)) 목록을 받아 일괄 처리
- 게임 종료 시 자동으로 호출되어 진행 상황 유지

### 데이터 초기화 기능
- `ClearAchievementData()`: 모든 업적 데이터 초기화
- 콜백 패턴을 통해 초기화 완료 시 알림

## 의존성/상속 관계
- [`AchievementSheetData`](/docs/projects/SlimeRush/AchievementSystem/AchievementSheetData) 클래스에 의존
- [`AchievementSaveData`](/docs/projects/SlimeRush/AchievementSystem/AchievementSaveData) 클래스에 의존
- [`AchievementInteractor`](/docs/projects/SlimeRush/AchievementSystem/AchievementInteractor) 에서 해당 인터페이스 구현 

## 사용 예시
#### [`AchievementSystem`](/docs/projects/SlimeRush/AchievementSystem/AchievementSystem)에서 업적 초기화시 사용
```csharp
[Inject]
private IAchievementInteractor _achievementInteractor;

private void CreateAchievements()
{
    // 업적 기본 정보(시트 데이터)를 로드합니다
    var sheetData = _achievementInteractor.LoadAchievementData();
    // 플레이어의 업적 진행 상태(저장 데이터)를 로드합니다
    var saveData = _achievementInteractor.LoadAchievementSaveData();
    // 시트 데이터와 저장 데이터를 조합하여 업적 객체 목록을 생성합니다
    Achievements = _achievementCreator.Create(sheetData, saveData);
    // 완료된 업적들을 필터링하여 별도 집합에 저장합니다
    _completedAchievments = Achievements.Where(achievement => achievement.IsComplete).ToHashSet();
    // 비활성화된 업적들을 필터링하여 별도 집합에 저장합니다
    _inActiveAchievements = Achievements.Where(achievement => achievement.IsInActive).ToHashSet();
    // 업적들의 활성화 상태를 업데이트하여 선행 조건을 만족하는 업적들을 활성화합니다
    UpdateAchievementActivate();
}
});
```

#### [`AchievementSystem`](/docs/projects/SlimeRush/AchievementSystem/AchievementSystem)에서 데이터 저장시 사용
```csharp
[Inject]
private IAchievementInteractor _achievementInteractor;

private void SaveCurrentAchievementInfo()
{
    // 모든 업적의 현재 진행 상태를 저장 데이터로 변환합니다
    var saveData = Achievements.Select(achievement => achievement.CreateAchievementSaveData()).ToList();
    // 변환된 저장 데이터를 파일로 저장합니다
    _achievementInteractor.SaveAchievementData(saveData);
}
```

## 관련 클래스
- [`AchievementSystem`](/docs/projects/SlimeRush/AchievementSystem/AchievementSystem)
- [`AchievementSheetData`](/docs/projects/SlimeRush/AchievementSystem/AchievementSheetData)
- [`AchievementSaveData`](/docs/projects/SlimeRush/AchievementSystem/AchievementSaveData)
- [`LocalAchievementDataSource`](/docs/projects/SlimeRush/AchievementSystem/LocalAchievementDataSource)
- [`CloudSyncDataSource`](/docs/projects/SlimeRush/AchievementSystem/CloudSyncDataSource)
- [`AchievementInteractor`](/docs/projects/SlimeRush/AchievementSystem/AchievementInteractor)