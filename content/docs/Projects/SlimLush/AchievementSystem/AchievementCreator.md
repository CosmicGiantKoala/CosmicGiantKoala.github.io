# AchievementCreator

## 개요

`AchievementCreator` 클래스는 SlimeRush 게임의 업적 시스템에서 업적 객체를 생성하는 팩토리 클래스입니다. 이 클래스는 시트 데이터(AchievementSheetData)와 저장 데이터(AchievementSaveData)를 결합하여 완전한 Achievement 객체를 생성하는 역할을 담당합니다. 게임 데이터와 플레이어 진행 상황을 통합하여 업적 시스템이 사용할 수 있는 객체로 변환합니다.

## 역할

- 시트 데이터와 저장 데이터 매핑
- Achievement 객체 생성 및 초기화
- 데이터 통합 및 변환
- 업적 초기 상태 설정

## 멤버

### 메서드

```csharp
/// <summary>
/// 업적 객체 생성
/// </summary>
/// <param name="sheetData">시트 데이터 목록</param>
/// <param name="saveData">저장 데이터 목록</param>
/// <returns>생성된 업적 객체 목록</returns>
public List<Achievement> Create(List<AchievementSheetData> sheetData, List<AchievementSaveData> saveData)
```

## 주요 코드 스니펫

### 업적 생성 로직

```csharp
public List<Achievement> Create(List<AchievementSheetData> sheetData, List<AchievementSaveData> saveData)
{
    List<Achievement> objectives = new List<Achievement>();
    foreach (var sheet in sheetData)
    {
        var targetSaveData = saveData.FirstOrDefault(target => target.ID == sheet.iD);

        var currentSuccess = 0;
        var isComplete = false;
        if (targetSaveData != null)
        {
            currentSuccess = targetSaveData.CurrentSuccess;
            isComplete = targetSaveData.IsComplete;
        }

        objectives.Add(new Achievement(
            id: sheet.iD,
            nameKey: sheet.nameKey,
            description: sheet.description,
            conditionType: sheet.conditionType,
            conditionValue: sheet.conditionValue,
            rewardDescription: sheet.rewardDes,
            currentSuccess: currentSuccess,
            needSuccess: sheet.needSuccess,
            isComplete: isComplete,
            preRequireCondition: sheet.preRequireCondition
            ));
    }

    return objectives;
}
```

## 기능 설명

### 데이터 매핑 및 통합

- 시트 데이터(AchievementSheetData)와 저장 데이터(AchievementSaveData) 매핑
- ID를 기준으로 데이터 연결
- 저장 데이터가 없는 경우 기본값 사용

### 업적 객체 생성

- Achievement 생성자를 통해 객체 생성
- 시트 데이터에서 기본 정보 추출 (ID, 이름, 설명, 조건 등)
- 저장 데이터에서 진행 상황 추출 (현재 달성 횟수, 완료 여부)
- 통합된 데이터를 기반으로 완전한 업적 객체 생성

### 상태 초기화

- 저장 데이터가 없는 경우 기본값(0, false)으로 초기화
- 저장 데이터가 있는 경우 진행 상황 유지
- 생성된 업적 객체는 즉시 사용 가능 상태

## 의존성/상속 관계

- `Achievement` 클래스에 의존
- `AchievementSheetData` 클래스에 의존
- `AchievementSaveData` 클래스에 의존
- `Reward.Entity` 네임스페이스 사용

## 사용 예시

### 업적 시스템에서 사용

```csharp
// AchievementSystem에서 사용 예시
var sheetData = _achievementInteractor.LoadAchievementData();
var saveData = _achievementInteractor.LoadAchievementSaveData();
Achievements = _achievementCreator.Create(sheetData, saveData);
```

### 데이터 변환 예시

```csharp
// 시트 데이터와 저장 데이터를 결합하여 업적 생성
var achievementCreator = new AchievementCreator();
List<Achievement> achievements = achievementCreator.Create(sheetDataList, saveDataList);

// 생성된 업적 사용
foreach (var achievement in achievements)
{
    Debug.Log($"업적: {achievement.NameKey}, 상태: {achievement.IsComplete}");
}
```

## 관련 클래스

- [`Achievement`](/docs/projects/rfice/SlimeRush/AchievementSystem/Achievement): 생성되는 업적 객체
- [`AchievementSheetData`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementSheetData): 시트 데이터 모델
- [`AchievementSaveData`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementSaveData): 저장 데이터 모델
- [`AchievementSystem`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementSystem): 업적 시스템 관리자

## 전체 코드

```csharp
using System.Collections.Generic;
using System.Linq;
using Reward.Entity;

namespace Reward.Data
{
    public class AchievementCreator
    {
        public List<Achievement> Create(List<AchievementSheetData> sheetData, List<AchievementSaveData> saveData)
        {
            List<Achievement> objectives = new List<Achievement>();
            foreach (var sheet in sheetData)
            {
                var targetSaveData = saveData.FirstOrDefault(target => target.ID == sheet.iD);

                var currentSuccess = 0;
                var isComplete = false;
                if (targetSaveData != null)
                {
                    currentSuccess = targetSaveData.CurrentSuccess;
                    isComplete = targetSaveData.IsComplete;
                }

                objectives.Add(new Achievement(
                    id: sheet.iD,
                    nameKey: sheet.nameKey,
                    description: sheet.description,
                    conditionType: sheet.conditionType,
                    conditionValue: sheet.conditionValue,
                    rewardDescription: sheet.rewardDes,
                    currentSuccess: currentSuccess,
                    needSuccess: sheet.needSuccess,
                    isComplete: isComplete,
                    preRequireCondition: sheet.preRequireCondition
                    ));
            }

            return objectives;
        }
    }
}
