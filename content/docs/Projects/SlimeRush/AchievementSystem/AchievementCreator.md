+++
title = "AchievementCreator"
description = "업적 객체를 생성하는 팩토리 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 201
+++
## 개요
`AchievementCreator` 클래스는 SlimeRush 게임의 업적 시스템에서 업적 객체를 생성하는 팩토리 클래스입니다. 이 클래스는 `AchievementSheetData`와 `AchievementSaveData`를 결합하여 `Achievement` 객체를 생성하는 역할을 담당합니다. 게임 데이터와 플레이어 진행 상황을 통합하여 업적 시스템이 사용할 수 있는 객체로 변환합니다.

## 역할
- 시트 데이터와 저장 데이터 매핑
- `Achievement` 객체 생성 및 초기화
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
    // 업적 목록 생성
    List<Achievement> objectives = new List<Achievement>();
    // 시트 데이터 반복
    foreach (var sheet in sheetData)
    {
        // 저장 데이터 찾기
        var targetSaveData = saveData.FirstOrDefault(target => target.ID == sheet.iD);

        // 초기 값 설정
        var currentSuccess = 0;
        var isComplete = false;
        // 저장 데이터가 있는 경우
        if (targetSaveData != null)
        {
            // 현재 성공 횟수 설정
            currentSuccess = targetSaveData.CurrentSuccess;
            // 완료 여부 설정
            isComplete = targetSaveData.IsComplete;
        }

        // 업적 생성
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

    // 생성된 업적 목록 반환
    return objectives;
}
```

## 기능 설명
### 데이터 매핑 프로세스
1. **시트 데이터 반복**: 업적 시트 데이터 목록을 순회
2. **저장 데이터 매칭**: 각 시트 데이터에 해당하는 저장 데이터 찾기
3. **데이터 통합**: 시트 데이터와 저장 데이터를 결합하여 업적 초기화
4. **객체 생성**: 매핑된 데이터를 기반으로 `Achievement` 객체 생성

### 데이터 매핑 및 통합
- 시트 데이터(AchievementSheetData)와 저장 데이터(AchievementSaveData) 매핑
- ID를 기준으로 데이터 연결
- 저장 데이터가 없는 경우 기본값 사용

## 의존성/상속 관계
- `Achievement` 클래스에 의존
- `AchievementSheetData` 클래스에 의존
- `AchievementSaveData` 클래스에 의존

## 사용 예시
### `AchievementSystem` 초기화
```csharp
private void CreateAchievements()
{
    // 시트 데이터 로드
    var sheetData = _achievementInteractor.LoadAchievementData();
    // 저장 데이터 로드
    var saveData = _achievementInteractor.LoadAchievementSaveData();
    // 업적 생성
    Achievements = _achievementCreator.Create(sheetData, saveData);
    // 완료 업적 필터링
    _completedAchievments = Achievements.Where(achievement => achievement.IsComplete).ToHashSet();
    // 비활성화 업적 필터링
    _inActiveAchievements = Achievements.Where(achievement => achievement.IsInActive).ToHashSet();
    // 업적 활성화 상태 업데이트
    UpdateAchievementActivate();
}
```

## 관련 클래스
- [`Achievement`](/docs/projects/SlimeRush/AchievementSystem/Achievement)
- [`AchievementSheetData`](/docs/projects/SlimeRush/AchievementSystem/AchievementSheetData)
- [`AchievementSaveData`](/docs/projects/SlimeRush/AchievementSystem/AchievementSaveData)
- [`AchievementSystem`](/docs/projects/SlimeRush/AchievementSystem/AchievementSystem)