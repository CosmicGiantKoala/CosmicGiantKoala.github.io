# AchievementState

## 개요

`AchievementState` 열거형은 SlimeRush 게임의 업적 시스템에서 업적의 상태를 정의합니다. 이 열거형은 업적의 생명 주기를 표현하며, 업적의 현재 상태를 추적하고 관리하는 데 사용됩니다. 업적은 비활성 상태에서 시작하여 활성 상태로 전환되고, 최종적으로 완료 상태로 도달합니다.

## 역할

- 업적 상태 정의
- 업적 생명 주기 관리
- 상태 전환 로직 지원
- 상태 기반 조건 검사

## 멤버

### 열거형 값

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

## 주요 코드 스니펫

### 열거형 정의

```csharp
public enum AchievementState
{
    InActive,
    Active,
    Complete
}
```

## 기능 설명

### 상태 전환 흐름

- **InActive → Active**: 선행 조건을 만족하면 활성화
- **Active → Complete**: 모든 조건을 달성하면 완료
- **Complete**: 최종 상태, 더 이상 변경되지 않음

### 상태별 특징

- **InActive**: 초기 상태, 조건 달성 불가능
- **Active**: 진행 중인 상태, 조건 달성 가능
- **Complete**: 완료된 상태, 보상 지급 대상

### 상태 관리

- 업적 시스템에서 상태 전환 관리
- 상태에 따른 다른 동작 수행
- 상태 기반 UI 표시 변경

## 의존성/상속 관계

- `Reward.Entity` 네임스페이스 사용

## 사용 예시

### 업적 상태 확인

```csharp
// Achievement 클래스에서 상태 확인
public bool IsInActive => _state == AchievementState.InActive;
public bool IsActive => _state == AchievementState.Active;
public bool IsComplete => _state == AchievementState.Complete;
```

### 상태 전환 처리

```csharp
// AchievementSystem에서 상태 전환
private void UpdateAchievementActivate()
{
    var updateTargets = _inActiveAchievements.ToList();
    foreach (var target in updateTargets.Where(CheckPreRequire))
    {
        if (target.IsActive) continue;
        target.Active(OnCompleteAchievement); // InActive → Active
        _activeAchievements.Add(target);
        _inActiveAchievements.Remove(target);
    }
}

private void OnCompleteAchievement(Achievement completedAchievement)
{
    _activeAchievements.Remove(completedAchievement);
    _completedAchievments.Add(completedAchievement); // Active → Complete
}
```

### 상태 기반 로직

```csharp
// 상태에 따른 다른 처리
if (achievement.IsInActive)
{
    Debug.Log("선행 조건을 만족해야 활성화됩니다.");
}
else if (achievement.IsActive)
{
    Debug.Log("진행 중인 업적입니다.");
    achievement.Report("condition_value");
}
else if (achievement.IsComplete)
{
    Debug.Log("완료된 업적입니다.");
    // 보상 지급 로직
}
```

## 관련 클래스

- [`Achievement`](/docs/projects/rfice/SlimeRush/AchievementSystem/Achievement): 업적 데이터 모델
- [`AchievementSystem`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementSystem): 업적 시스템 관리자
- [`AchievementCreator`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementCreator): 업적 생성기

## 전체 코드

```csharp
namespace Reward.Entity
{
    public enum AchievementState
    {
        InActive,
        Active,
        Complete
    }
}
