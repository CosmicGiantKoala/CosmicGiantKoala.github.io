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
# Achievement

## 개요

`Achievement` 클래스는 SlimeRush 게임의 업적 시스템의 핵심 데이터 모델을 나타냅니다. 이 클래스는 개별 업적의 상태, 진행 상황, 완료 조건 등을 관리하며, 업적 달성 시 보상 시스템과 연동됩니다. 플레이어의 게임 진행 상황을 추적하고, 특정 조건을 달성했을 때 업적을 완료 처리하는 기능을 제공합니다.

## 역할

- 업적의 기본 정보(ID, 이름, 설명, 조건 등) 관리
- 업적의 현재 상태(비활성, 활성, 완료) 추적 및 관리
- 업적 완료 조건 검증 및 진행 상황 업데이트
- 업적 완료 시 이벤트 발생 및 콜백 처리
- 업적 데이터의 직렬화 및 저장소와의 호환성 제공

## 멤버

### 속성

```csharp
/// <summary>
/// 업적의 고유 식별자
/// </summary>
public string Id { get; private set; }

/// <summary>
/// 로컬라이징용 업적 이름 키
/// </summary>
public string NameKey { get; private set;}

/// <summary>
/// 업적 설명
/// </summary>
public string Description { get; private set; }

/// <summary>
/// 업적 완료 조건 타입
/// </summary>
public AchievementConditionType ConditionType { get; private set; }

/// <summary>
/// 업적 완료 조건 값
/// </summary>
public string ConditionValue { get; private set; }

/// <summary>
/// 업적 보상 설명
/// </summary>
public string RewardDescription { get; private set; }

/// <summary>
/// 업적 완료에 필요한 성공 횟수
/// </summary>
public int NeedSuccess { get; private set;}

/// <summary>
/// 선행 조건 업적 ID 목록
/// </summary>
public string[] PreRequireCondition { get; private set; }

/// <summary>
/// 현재 달성 횟수
/// </summary>
public int CurrentSuccess { get; private set; }

/// <summary>
/// 비활성 상태 여부
/// </summary>
public bool IsInActive => _state == AchievementState.InActive;

/// <summary>
/// 활성 상태 여부
/// </summary>
public bool IsActive => _state == AchievementState.Active;

/// <summary>
/// 완료 상태 여부
/// </summary>
public bool IsComplete => _state == AchievementState.Complete;
```

### 이벤트

```csharp
/// <summary>
/// 업적 완료 시 발생하는 이벤트
/// </summary>
/// <param name="achievement">완료된 업적 객체</param>
public delegate void CompleteHandler(Achievement achievement);
public event CompleteHandler OnCompleteEvent;
```

### 메서드

```csharp
/// <summary>
/// 업적 객체 생성자
/// </summary>
/// <param name="id">업적 ID</param>
/// <param name="nameKey">로컬라이징 키</param>
/// <param name="description">업적 설명</param>
/// <param name="conditionType">조건 타입 문자열</param>
/// <param name="conditionValue">조건 값</param>
/// <param name="rewardDescription">보상 설명</param>
/// <param name="currentSuccess">현재 달성 횟수</param>
/// <param name="needSuccess">필요 달성 횟수</param>
/// <param name="isComplete">완료 여부</param>
/// <param name="preRequireCondition">선행 조건 업적 목록</param>
public Achievement(string id, string nameKey, string description, string conditionType,
    string conditionValue, string rewardDescription, int currentSuccess, int needSuccess,
    bool isComplete, string[] preRequireCondition)

/// <summary>
/// 업적을 활성화하고 완료 콜백 설정
/// </summary>
/// <param name="onCompleteCallBack">완료 시 호출될 콜백</param>
public void Active(CompleteHandler onCompleteCallBack)

/// <summary>
/// 업적 저장 데이터 생성
/// </summary>
/// <returns>업적 저장 데이터 객체</returns>
public AchievementSaveData CreateAchievementSaveData()

/// <summary>
/// 업적 진행 상황 보고
/// </summary>
/// <param name="conditionValue">조건 값</param>
public void Report(string conditionValue)

/// <summary>
/// 업적 완료 처리 (내부 사용)
/// </summary>
private void OnComplete()

/// <summary>
/// 조건 타입 문자열을 열거형으로 변환
/// </summary>
/// <param name="conditionTypeString">조건 타입 문자열</param>
/// <returns>변환된 조건 타입</returns>
private AchievementConditionType ParseConditionType(string conditionTypeString)
```

## 주요 코드 스니펫

### 업적 상태 관리

```csharp
// 업적 상태는 내부적으로 AchievementState 열거형으로 관리
private AchievementState _state;

// 상태 확인 속성
public bool IsInActive => _state == AchievementState.InActive;
public bool IsActive => _state == AchievementState.Active;
public bool IsComplete => _state == AchievementState.Complete;
```

### 업적 완료 처리

```csharp
public void Report(string conditionValue)
{
    if (ConditionValue != conditionValue) return;

    // 업적 진행 상황 업데이트
    CurrentSuccess++;
    if (CurrentSuccess >= NeedSuccess)
    {
        OnComplete(); // 완료 조건 달성 시 처리
    }
}

private void OnComplete()
{
    _state = AchievementState.Complete; // 상태 업데이트
    OnCompleteEvent?.Invoke(this); // 이벤트 발생
    OnCompleteEvent = null; // 이벤트 핸들러 제거
}
```

### 데이터 변환 및 저장

```csharp
public AchievementSaveData CreateAchievementSaveData()
{
    return new AchievementSaveData(Id, CurrentSuccess, IsComplete);
}

private AchievementConditionType ParseConditionType(string conditionTypeString)
{
    return Enum.TryParse(conditionTypeString, true, out AchievementConditionType parsedType)
        ? parsedType
        : AchievementConditionType.None;
}
```

## 기능 설명

### 상태 관리 시스템

- **비활성(InActive)**: 초기 상태, 아직 활성화되지 않은 업적
- **활성(Active)**: 진행 중인 업적, 조건 달성 가능 상태
- **완료(Complete)**: 모든 조건을 달성한 업적

### 진행 상황 추적

- `CurrentSuccess` 속성을 통해 현재 달성 횟수 추적
- `NeedSuccess` 속성과 비교하여 완료 조건 검증
- `Report()` 메서드를 통해 조건 달성 보고

### 이벤트 처리 시스템

- `OnCompleteEvent` 델리게이트를 통해 업적 완료 시 알림
- 콜백 패턴을 사용하여 외부 시스템과 연동
- 이벤트 발생 후 핸들러 자동 제거로 메모리 관리

### 데이터 호환성

- `CreateAchievementSaveData()`를 통해 저장 가능한 데이터 생성
- `AchievementSaveData` 객체로 변환하여 영속성 제공
- 조건 타입 문자열을 열거형으로 변환하여 타입 안전성 보장

## 의존성/상속 관계

- `AchievementConditionType` 열거형에 의존
- `AchievementState` 열거형에 의존
- `AchievementSaveData` 클래스에 의존
- `Reward.Entity` 네임스페이스 사용

## 사용 예시

### 업적 생성 및 관리

```csharp
// 업적 생성
var achievement = new Achievement(
    "kill_100_slimes",
    "ACHIEVEMENT_KILL_100_SLIMES",
    "100마리의 슬라임을 처치하세요",
    "Kill",
    "slime",
    "100 골드 보상",
    0,
    100,
    false,
    new string[] { "tutorial_complete" }
);

// 콜백 설정 및 활성화
achievement.Active((completedAchievement) => {
    Debug.Log($"업적 완료: {completedAchievement.NameKey}");
    // 보상 지급 로직
});

// 진행 상황 보고
achievement.Report("slime"); // 슬라임 처치 보고
```

### 저장 데이터 생성

```csharp
// 게임 저장 시 호출
AchievementSaveData saveData = achievement.CreateAchievementSaveData();
// 저장소에 데이터 저장
```

## 관련 클래스

- [`AchievementConditionType`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementConditionType): 업적 조건 타입 정의
- [`AchievementState`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementState): 업적 상태 열거형
- [`AchievementSaveData`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementSaveData): 업적 저장 데이터 모델
- [`AchievementSystem`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementSystem): 업적 시스템 관리자
- [`AchievementRepository`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementRepository): 업적 데이터 저장소

## 전체 코드

```csharp
using System;
using Reward.Entity;
using UnityEngine;

namespace Reward
{
    public class Achievement
    {
        #region MainProperty

            #region SheetBaseData
            public string Id { get; private set; }
            public string NameKey { get; private set;}
            public string Description { get; private set; }
            public AchievementConditionType ConditionType { get; private set; }
            public string ConditionValue { get; private set; }
            public string RewardDescription { get; private set; }
            public int NeedSuccess { get; private set;}
            public string[] PreRequireCondition { get; private set; }
            #endregion

            #region StateData
            public int CurrentSuccess { get; private set; }
            public bool IsInActive => _state == AchievementState.InActive;
            public bool IsActive => _state == AchievementState.Active;
            public bool IsComplete => _state == AchievementState.Complete;
            #endregion

        #endregion

        private AchievementState _state;

        #region EventHandler
        public delegate void CompleteHandler(Achievement achievement);
        public event CompleteHandler OnCompleteEvent;
        #endregion

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

        public void Active(CompleteHandler onCompleteCallBack)
        {
            _state = AchievementState.Active;
            OnCompleteEvent = onCompleteCallBack;
        }

        public AchievementSaveData CreateAchievementSaveData()
        {
            return new AchievementSaveData(Id, CurrentSuccess, IsComplete);
        }

        public void Report(string conditionValue)
        {
            if (ConditionValue != conditionValue) return;

            //AchievementAction
            CurrentSuccess++;
            if (CurrentSuccess >= NeedSuccess)
            {
                OnComplete();
            }
        }

        private void OnComplete()
        {
            _state = AchievementState.Complete;
            OnCompleteEvent?.Invoke(this);
            OnCompleteEvent = null;
        }

        private AchievementConditionType ParseConditionType(string conditionTypeString)
        {
            return Enum.TryParse(conditionTypeString, true, out AchievementConditionType parsedType) ? parsedType : AchievementConditionType.None;
        }

        #region TestCode
        //Todo - 테스트후 삭제
        public void ChangeComplete(bool complete)
        {
            if (complete)
            {
                _state = AchievementState.Complete;
                CurrentSuccess = NeedSuccess;
                OnComplete();
            }
            else
            {
                _state = AchievementState.InActive;
                CurrentSuccess = 0;
            }
        }
        #endregion
    }
}
