+++
title = "AchievementState"
description = "게임의 업적 시스템에서 업적의 상태를 정의하는 열거형"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 201
+++
## 개요
`AchievementState` 열거형은 SlimeRush 게임의 업적 시스템에서 업적의 상태를 정의합니다. 이 열거형은 업적의 현재 상태를 추적하고 관리하는 데 사용됩니다. 업적은 비활성 상태에서 시작하여 활성 상태로 전환되고, 최종적으로 완료 상태로 도달합니다.

## 역할
- 업적 상태 정의
- 상태 전환 로직 지원
- 상태 기반 조건 검사

## 선언
```csharp
public enum AchievementState
```

## 멤버
### 열거형
```csharp
/// <summary>
/// 비활성 상태 - 선행 조건을 만족하지 못하거나 아직 활성화되지 않은 업적
/// </summary>
InActive

/// <summary>
/// 활성 상태 - 진행 중인 업적, 조건 달성 가능 상태
/// </summary>
Active

/// <summary>
/// 완료 상태 - 모든 조건을 달성한 업적
/// </summary>
Complete
```

## 기능 설명
### 상태 전환 흐름
- **InActive → Active**: 선행 조건을 만족하면 활성화
- **Active → Complete**: 모든 조건을 달성하면 완료
- **Complete**: 최종 상태, 더 이상 변경되지 않음

### 상태별 특징
- **InActive**: 초기 상태, 선행조건 달성 안됨. 조건 달성 불가능
- **Active**: 진행 중인 상태, 조건 달성 가능
- **Complete**: 완료된 상태, 보상 지급 대상

### 상태 관리
- 업적 시스템([`AchievementSystem`](/docs/projects/SlimeRush/AchievementSystem/AchievementSystem))에서 상태 전환 관리
- 상태에 따른 다른 동작 수행
- 상태 기반 UI 표시 변경

## 의존성/상속 관계
- [`Achievement`](/docs/projects/SlimeRush/AchievementSystem/Achievement) 클래스에서 사용

## 사용 예시
#### [`Achievement`](/docs/projects/SlimeRush/AchievementSystem/Achievement) 클래스에서 현재 상태 확인
```csharp
// Achievement 클래스에서 상태 확인
private AchievementState _state;

public bool IsInActive => _state == AchievementState.InActive;
public bool IsActive => _state == AchievementState.Active;
public bool IsComplete => _state == AchievementState.Complete;
```

#### [`AchievementPopupItem`](/docs/projects/slimerush/AchievementSystem/AchievementPopupItem) 에서 `AchievementState`상태에 따라 동작 변화
```csharp
public void InitializeAchievementInfo(Reward.Achievement info)
{
    // 업적 이름 키를 설정합니다
    achievementDes.text = info.NameKey;
    // 업적 설명을 설정합니다
    achievementRewardDes.text = info.Description;

    // 완료 표시 오브젝트를 활성화/비활성화합니다
    achievementCompletation.SetActive(info.IsComplete);
    // 잠금 표시 오브젝트를 활성화/비활성화합니다 (완료 상태의 반대)
    achievementLock.SetActive(!info.IsComplete);

    // 완료 상태가 변경되었을 때 애니메이션 효과를 적용합니다
    if (info.IsComplete != _isComplete)
    {
        // 랜덤한 회전 값을 생성합니다
        var randomRot = Random.Range(-randomRange,randomRange);
        // 완료 표시 오브젝트의 회전을 설정합니다
        achievementCompletation.GetComponent<RectTransform>().rotation = Quaternion.Euler(0f, 0f, randomRot);
    }

    // 업적 정보를 내부 변수에 저장합니다
    AchievementID = info.Id;
    _currentSuccess = info.CurrentSuccess;
    _needSuccess = info.NeedSuccess;
    _isComplete = info.IsComplete;
    // 로컬라이제이션 문자열을 설정합니다
    SetLocalizedStringReference();
}
```

#### [`AchievementSystem`](/docs/projects/SlimeRush/AchievementSystem/AchievementSystem)에서 업적 상태를 필터링 하여 목록 관리
```csharp
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
```

## 관련 클래스
- [`Achievement`](/docs/projects/SlimeRush/AchievementSystem/Achievement)
- [`AchievementSystem`](/docs/projects/SlimeRush/AchievementSystem/AchievementSystem)
- [`AchievementCreator`](/docs/projects/SlimeRush/AchievementSystem/AchievementCreator)
- [`AchievementPopupItem`](/docs/projects/SlimeRush/AchievementSystem/AchievementPopupItem)