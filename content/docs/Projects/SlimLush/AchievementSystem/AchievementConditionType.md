+++
title = "Achievement"
description = "업적 시스템 핵심 데이터 모델"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 420
+++
# AchievementConditionType

## 개요

`AchievementConditionType` 열거형은 SlimeRush 게임의 업적 시스템에서 업적의 완료 조건 타입을 정의합니다. 이 열거형은 다양한 업적 달성 조건을 분류하며, 업적이 어떤 방식으로 완료될 수 있는지를 나타냅니다. 게임 내 다양한 이벤트와 연동하여 업적 달성 조건을 정의하는 데 사용됩니다.

## 역할

- 업적 조건 타입 정의
- 조건 분류 및 관리
- 조건 검증 로직 지원
- 조건 기반 업적 처리

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

## 주요 코드 스니펫

### 열거형 정의

```csharp
public enum AchievementConditionType
{
    StageClear,
    GetMagic,
    RuneMaxLevel,
    None = 99
}
```

## 기능 설명

### 조건 타입 분류

- **StageClear**: 스테이지 클리어와 관련된 업적
- **GetMagic**: 마법 획득과 관련된 업적
- **RuneMaxLevel**: 룬 강화와 관련된 업적
- **None**: 조건이 없거나 특수 조건인 경우

### 조건 처리 흐름

- 조건 타입에 따른 다른 처리 로직
- 조건 값과 함께 사용되어 구체적인 조건 정의
- 업적 시스템에서 조건 검증 시 사용

### 특수 값 처리

- `None = 99`: 기본값으로 사용
- 조건이 없는 업적에 사용
- 특수 조건 처리에 사용

## 의존성/상속 관계

- `Reward.Entity` 네임스페이스 사용

## 사용 예시

### 조건 타입 사용

```csharp
// AchievementSheetData에서 조건 타입 정의
var achievementData = new AchievementSheetData(
    "clear_stage_1",
    "ACHIEVEMENT_CLEAR_STAGE_1",
    "스테이지 1을 클리어하세요",
    "StageClear", // 조건 타입
    "stage_1",    // 조건 값
    "10 골드 보상"
);
```

### 조건 타입 변환

```csharp
// Achievement 클래스에서 조건 타입 변환
private AchievementConditionType ParseConditionType(string conditionTypeString)
{
    return Enum.TryParse(conditionTypeString, true, out AchievementConditionType parsedType)
        ? parsedType
        : AchievementConditionType.None;
}
```

### 조건 기반 처리

```csharp
// 조건 타입에 따른 다른 처리
switch (achievement.ConditionType)
{
    case AchievementConditionType.StageClear:
        // 스테이지 클리어 조건 처리
        break;
    case AchievementConditionType.GetMagic:
        // 마법 획득 조건 처리
        break;
    case AchievementConditionType.RuneMaxLevel:
        // 룬 최대 레벨 조건 처리
        break;
    case AchievementConditionType.None:
        // 조건 없는 업적 처리
        break;
}
```

## 관련 클래스

- [`Achievement`](/docs/projects/rfice/SlimeRush/AchievementSystem/Achievement): 업적 데이터 모델
- [`AchievementSheetData`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementSheetData): 업적 시트 데이터
- [`AchievementSystem`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementSystem): 업적 시스템 관리자

## 전체 코드

```csharp
namespace Reward.Entity
{
    public enum AchievementConditionType
    {
        StageClear,
        GetMagic,
        RuneMaxLevel,
        None = 99
    }
}
