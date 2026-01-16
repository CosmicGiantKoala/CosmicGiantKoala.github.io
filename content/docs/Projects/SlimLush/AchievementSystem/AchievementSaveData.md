# AchievementSaveData

## 개요

`AchievementSaveData` 클래스는 SlimeRush 게임의 업적 시스템에서 플레이어의 진행 상황을 저장하는 데이터 모델입니다. 이 클래스는 업적의 현재 달성 횟수와 완료 여부를 저장하며, 게임 세션 간에 플레이어의 업적 진행 상황을 유지하는 데 사용됩니다. 직렬화 가능하여 다양한 저장소에 영구적으로 저장할 수 있습니다.

## 역할

- 플레이어 업적 진행 상황 저장
- 게임 세션 간 데이터 유지
- 직렬화 및 역직렬화 지원
- 업적 시스템 데이터 영속성 제공

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

### 데이터 구조

```csharp
[Serializable]
public class AchievementSaveData
{
    public string ID { get; private set; }
    public int CurrentSuccess { get; private set; }
    public bool IsComplete { get; private set; }
}
```

### 생성자 구현

```csharp
public AchievementSaveData(string id, int currentSuccess, bool isComplete)
{
    ID = id;
    CurrentSuccess = currentSuccess;
    IsComplete = isComplete;
}
```

## 기능 설명

### 데이터 영속성

- 플레이어의 업적 진행 상황 저장
- 게임 종료 시 자동 저장
- 게임 재시작 시 자동 로드
- 세션 간 진행 상황 유지

### 간단한 데이터 구조

- 업적 ID를 통한 식별
- 현재 달성 횟수 추적
- 완료 여부 표시
- 최소한의 데이터로 효율적 저장

### 데이터 무결성

- 읽기 전용 속성을 통해 데이터 보호
- 생성자를 통한 초기화만 가능
- 일관된 데이터 구조 유지

## 의존성/상속 관계

- `Serializable` 속성 사용 (직렬화 지원)
- `Reward.Entity` 네임스페이스 사용

## 사용 예시

### 업적 시스템에서 사용

```csharp
// Achievement에서 저장 데이터 생성
AchievementSaveData saveData = achievement.CreateAchievementSaveData();

// 저장소에 저장
_achievementInteractor.SaveAchievementData(saveDataList);
```

### 데이터 생성 및 사용

```csharp
// 저장 데이터 생성
var saveData = new AchievementSaveData(
    "kill_10_slimes",
    5, // 현재 5번 달성
    false // 아직 완료되지 않음
);

// 데이터 사용
Debug.Log($"업적 {saveData.ID}: {saveData.CurrentSuccess}/{neededSuccess} (완료: {saveData.IsComplete})");
```

### 데이터 로드 및 복원

```csharp
// IAchievementInteractor를 통해 데이터 로드
var saveDataList = _achievementInteractor.LoadAchievementSaveData();

// 업적 생성기에 전달
var achievements = _achievementCreator.Create(sheetDataList, saveDataList);
```

## 관련 클래스

- [`Achievement`](/docs/projects/rfice/SlimeRush/AchievementSystem/Achievement): 업적 데이터 모델
- [`AchievementCreator`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementCreator): 업적 생성기
- [`AchievementSheetData`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementSheetData): 업적 시트 데이터
- [`IAchievementInteractor`](/docs/projects/rfice/SlimeRush/AchievementSystem/IAchievementInteractor): 데이터 인터랙터 인터페이스

## 전체 코드

```csharp
using System;

namespace Reward.Entity
{
    [Serializable]
    public class AchievementSaveData
    {
        public string ID { get; private set; }
        public int CurrentSuccess { get; private set; }
        public bool IsComplete { get; private set; }

        public AchievementSaveData(string id, int currentSuccess, bool isComplete)
        {
            ID = id;
            CurrentSuccess = currentSuccess;
            IsComplete = isComplete;
        }
    }
}
