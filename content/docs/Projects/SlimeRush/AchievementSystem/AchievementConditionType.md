+++
title = "AchievementConditionType"
description = "업적의 완료 조건 타입 정의"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 201
+++

## 개요
`AchievementConditionType` 열거형은 SlimeRush 게임의 업적 시스템에서 업적의 완료 조건 타입을 정의합니다. 이 열거형은 다양한 업적 달성 조건을 분류하며, 업적이 어떤 방식으로 완료될 수 있는지를 나타냅니다. 게임 내 다양한 이벤트와 연동하여 업적 달성 조건을 정의하는 데 사용됩니다.

## 역할
- 업적 조건 타입 분류
- 업적 시스템의 조건 평가 기준 제공
- 다양한 게임 이벤트 기반 업적 조건 정의

## 멤버
### 열거형 값
```csharp
/// <summary>
/// 스테이지 클리어 조건 - 특정 스테이지를 클리어할 때 달성
/// </summary>
StageClear

/// <summary>
/// 마법 획득 조건 - 특정 마법을 획득할 때 달성
/// </summary>
GetMagic

/// <summary>
/// 룬 최대 레벨 조건 - 룬을 최대 레벨까지 강화할 때 달성
/// </summary>
RuneMaxLevel

/// <summary>
/// 조건 없음 - 기본값 또는 특수 조건
/// </summary>
None = 99
```

## 기능 설명
### 조건 타입 분류
- **StageClear**: 스테이지 클리어와 관련된 업적
- **GetMagic**: 마법 획득 및 마법 레벨업과 관련된 업적
- **RuneMaxLevel**: 룬 강화 및 최대 레벨 달성과 관련된 업적
- **None**: 조건 없음(기본값)

### 사용 패턴
- 업적 시스템에서 조건 타입을 식별하는 데 사용
- `Achievement` 클래스의 `ConditionType` 속성으로 사용
- 조건 평가 로직에서 타입별 처리 기준 제공

## 의존성/상속 관계
- `Achievement` 클래스에서 사용

## 사용 예시
#### `Achievement` 생성자에서 직렬화 데이터를 열거문으로 파싱하여 사용
```csharp
public Achievement(string id, string nameKey, string description, string conditionType,
    string conditionValue, string rewardDescription, int currentSuccess, int needSuccess,
    bool isComplete, string[] preRequireCondition)
{
    //sheetData
    Id = id;
    NameKey = nameKey;
    Description = description;
    ConditionType = ParseConditionType(conditionType);
    ConditionValue = conditionValue;
    RewardDescription = rewardDescription;
    PreRequireCondition = preRequireCondition;
    NeedSuccess = needSuccess;

    //saveData
    CurrentSuccess = currentSuccess;

    //state
    _state = isComplete ? AchievementState.Complete : AchievementState.InActive;
}

private AchievementConditionType ParseConditionType(string conditionTypeString)
{
    return Enum.TryParse(conditionTypeString, true, out AchievementConditionType parsedType)
        ? parsedType
        : AchievementConditionType.None;
}
```

## 관련 클래스
- [`Achievement`](/docs/projects/SlimeRush/AchievementSystem/Achievement)
- [`AchievementSheetData`](/docs/projects/SlimeRush/AchievementSystem/AchievementSheetData)
- [`AchievementSystem`](/docs/projects/SlimeRush/AchievementSystem/AchievementSystem)