# AchievementSystem

## 개요

`AchievementSystem` 클래스는 SlimeRush 게임의 업적 시스템을 관리하는 핵심 클래스입니다. 이 클래스는 업적의 생성, 상태 관리, 진행 상황 추적, 저장 및 로드 기능을 담당하며, 게임 내 모든 업적 관련 로직을 중앙에서 관리합니다. 플레이어의 업적 달성 과정을 모니터링하고, 업적 완료 시 적절한 보상 시스템과 연동합니다.

## 역할

- 업적 데이터의 초기화 및 생성
- 업적 상태(비활성, 활성, 완료) 관리
- 업적 진행 상황 보고 및 처리
- 업적 완료 조건 검증
- 업적 데이터의 저장 및 로드
- 선행 조건 업적 검사
- 업적 상태 변경 알림

## 멤버

### 속성

```csharp
/// <summary>
/// 모든 업적 목록
/// </summary>
public List<Achievement> Achievements { get; private set; }

/// <summary>
/// 업적 상태 변경 이벤트
/// </summary>
public System.Action OnChangedAchievementState;
```

### 의존성 주입

```csharp
/// <summary>
/// 업적 데이터 인터랙터 (의존성 주입)
/// </summary>
[Inject]
private IAchievementInteractor _achievementInteractor;
```

### 내부 필드

```csharp
/// <summary>
/// 비활성 업적 집합
/// </summary>
private HashSet<Achievement> _inActiveAchievements = new HashSet<Achievement>();

/// <summary>
/// 활성 업적 집합
/// </summary>
private HashSet<Achievement> _activeAchievements = new HashSet<Achievement>();

/// <summary>
/// 완료된 업적 집합
/// </summary>
private HashSet<Achievement> _completedAchievments = new HashSet<Achievement>();

/// <summary>
/// 업적 생성기
/// </summary>
private readonly AchievementCreator _achievementCreator = new AchievementCreator();

/// <summary>
/// 진행 상황 보고 델리게이트
/// </summary>
private delegate void ReportNotifier(string conditionValue);

/// <summary>
/// 진행 상황 보고 이벤트
/// </summary>
private event ReportNotifier OnReportNotify;
```

### 메서드

```csharp
/// <summary>
/// 초기화 시 호출 (Unity Awake)
/// </summary>
private void Awake()

/// <summary>
/// 애플리케이션 종료 시 호출 (Unity OnApplicationQuit)
/// </summary>
private void OnApplicationQuit()

/// <summary>
/// 업적 활성화 상태 업데이트
/// </summary>
private void UpdateAchievementActivate()

/// <summary>
/// 진행 상황 보고
/// </summary>
/// <param name="conditionValue">조건 값</param>
public void Report(string conditionValue)

/// <summary>
/// 업적 완료 상태 확인
/// </summary>
/// <param name="achievementId">업적 ID</param>
/// <returns>완료 여부</returns>
public bool CheckAchievementCompletion(string achievementId)

/// <summary>
/// 선행 조건 업적 검사
/// </summary>
/// <param name="targetAchievement">검사할 업적</param>
/// <returns>선행 조건 만족 여부</returns>
private bool CheckPreRequire(Achievement targetAchievement)

/// <summary>
/// 업적 완료 처리
/// </summary>
/// <param name="completedAchievement">완료된 업적</param>
private void OnCompleteAchievement(Achievement completedAchievement)

/// <summary>
/// 업적 생성 및 초기화
/// </summary>
private void CreateAchievements()

/// <summary>
/// 현재 업적 정보 저장
/// </summary>
private void SaveCurrentAchievementInfo()

/// <summary>
/// 업적 데이터 초기화 (테스트용)
/// </summary>
[ContextMenu("ClearAchievementData")]
private void ClearAchievement()

/// <summary>
/// 업적 완료 상태 변경 (테스트용)
/// </summary>
/// <param name="achievementId">업적 ID</param>
/// <param name="isComplete">완료 여부</param>
public void OnChangedAchievementComplete(string achievementId, bool isComplete)
```

## 주요 코드 스니펫

### 업적 상태 관리

```csharp
// 업적 상태별 집합 관리
private HashSet<Achievement> _inActiveAchievements = new HashSet<Achievement>();
private HashSet<Achievement> _activeAchievements = new HashSet<Achievement>();
private HashSet<Achievement> _completedAchievments = new HashSet<Achievement>();

// 상태 업데이트 로직
private void UpdateAchievementActivate()
{
    var updateTargets = _inActiveAchievements.ToList();
    foreach (var target in updateTargets.Where(CheckPreRequire))
    {
        if (target.IsActive) continue;
        target.Active(OnCompleteAchievement);
        OnReportNotify += target.Report;
        _activeAchievements.Add(target);
        _inActiveAchievements.Remove(target);
    }

    OnChangedAchievementState?.Invoke();
}
```

### 진행 상황 보고 시스템

```csharp
public void Report(string conditionValue)
{
    OnReportNotify?.Invoke(conditionValue);
}

private void OnCompleteAchievement(Achievement completedAchievement)
{
    OnReportNotify -= completedAchievement.Report;
    _activeAchievements.Remove(completedAchievement);
    _completedAchievments.Add(completedAchievement);
    UpdateAchievementActivate();
    SaveCurrentAchievementInfo();
    PlayerPrefs.SetInt(CONFIGIDX.HAS_NEW_ACHIEVEMENT.ToString(),1);
}
```

### 데이터 저장 및 로드

```csharp
private void CreateAchievements()
{
    var sheetData = _achievementInteractor.LoadAchievementData();
    var saveData = _achievementInteractor.LoadAchievementSaveData();
    Achievements = _achievementCreator.Create(sheetData, saveData);
    _completedAchievments = Achievements.Where(achievement => achievement.IsComplete).ToHashSet();
    _inActiveAchievements = Achievements.Where(achievement => achievement.IsInActive).ToHashSet();
    UpdateAchievementActivate();
}

private void SaveCurrentAchievementInfo()
{
    var saveData = Achievements.Select(achievement => achievement.CreateAchievementSaveData()).ToList();
    _achievementInteractor.SaveAchievementData(saveData);
}
```

### 선행 조건 검사

```csharp
private bool CheckPreRequire(Achievement targetAchievement)
{
    if (targetAchievement.PreRequireCondition == null)
    {
        return true;
    }
    else
    {
        return targetAchievement.PreRequireCondition.All(require =>
            _completedAchievments.Any(x => x.Id == require) != false);
    }
}
```

## 기능 설명

### 업적 상태 관리 시스템

- **비활성(InActive)**: 선행 조건을 만족하지 못한 업적
- **활성(Active)**: 진행 가능한 업적, 조건 달성 가능 상태
- **완료(Complete)**: 모든 조건을 달성한 업적

### 진행 상황 추적 및 보고

- `Report()` 메서드를 통해 조건 달성 보고
- `OnReportNotify` 이벤트를 통해 활성 업적들에게 알림
- 조건 달성 시 자동으로 완료 처리

### 선행 조건 시스템

- `CheckPreRequire()`를 통해 선행 조건 검사
- 선행 조건 업적이 완료되어야만 해당 업적 활성화
- 조건이 없는 경우 즉시 활성화 가능

### 데이터 영속성

- `CreateAchievements()`: 초기 데이터 로드 및 업적 생성
- `SaveCurrentAchievementInfo()`: 현재 상태 저장
- `IAchievementInteractor`를 통해 데이터 저장소와 상호작용

### 이벤트 알림 시스템

- `OnChangedAchievementState`: 업적 상태 변경 시 알림
- 외부 시스템에서 상태 변화를 감지할 수 있음
- UI 업데이트 등에 활용 가능

## 의존성/상속 관계

- `MonoBehaviour`를 상속받음 (Unity 컴포넌트)
- `IAchievementInteractor` 인터페이스에 의존 (의존성 주입)
- `AchievementCreator` 클래스에 의존
- `Achievement` 클래스에 의존
- `Zenject` DI 프레임워크 사용
- `CONFIGIDX` 열거형 사용

## 사용 예시

### 업적 시스템 초기화 및 사용

```csharp
// 게임 시작 시 자동으로 Awake()에서 초기화
// 업적 진행 상황 보고
achievementSystem.Report("kill_slime");

// 업적 완료 상태 확인
bool isComplete = achievementSystem.CheckAchievementCompletion("kill_100_slimes");

// 상태 변경 알림 구독
achievementSystem.OnChangedAchievementState += () => {
    Debug.Log("업적 상태가 변경되었습니다.");
    UpdateUI();
};
```

### 데이터 저장 및 로드

```csharp
// 자동으로 처리됨
// Awake()에서 CreateAchievements() 호출
// OnApplicationQuit()에서 SaveCurrentAchievementInfo() 호출
```

## 관련 클래스

- [`IAchievementInteractor`](/docs/projects/rfice/SlimeRush/AchievementSystem/IAchievementInteractor): 업적 데이터 인터랙터 인터페이스
- [`AchievementCreator`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementCreator): 업적 생성기
- [`Achievement`](/docs/projects/rfice/SlimeRush/AchievementSystem/Achievement): 개별 업적 데이터 모델
- [`AchievementSaveData`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementSaveData): 업적 저장 데이터
- [`AchievementSheetData`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementSheetData): 업적 시트 데이터

## 전체 코드

```csharp
using System.Collections.Generic;
using System.Linq;
using Reward.Data;
using UnityEngine;
using Zenject;

namespace Reward
{
    public class AchievementSystem : MonoBehaviour
    {
        [Inject]
        private IAchievementInteractor _achievementInteractor;
        public List<Achievement> Achievements { get; private set; }
        private HashSet<Achievement> _inActiveAchievements = new HashSet<Achievement>();
        private HashSet<Achievement> _activeAchievements = new HashSet<Achievement>();
        private HashSet<Achievement> _completedAchievments = new HashSet<Achievement>();

        private readonly AchievementCreator _achievementCreator = new AchievementCreator();

        private delegate void ReportNotifier(string conditionValue);
        private event ReportNotifier OnReportNotify;

        private void Awake()
        {
            CreateAchievements();
        }

        private void OnApplicationQuit()
        {
            SaveCurrentAchievementInfo();
        }

        private void UpdateAchievementActivate()
        {
            var updateTargets = _inActiveAchievements.ToList();
            foreach (var target in updateTargets.Where(CheckPreRequire))
            {
                if (target.IsActive) continue;
                target.Active(OnCompleteAchievement);
                OnReportNotify += target.Report;
                _activeAchievements.Add(target);
                _inActiveAchievements.Remove(target);
            }

            OnChangedAchievementState?.Invoke();
        }

        public void Report(string conditionValue)
        {
            OnReportNotify?.Invoke(conditionValue);
        }

        public bool CheckAchievementCompletion(string achievementId)
        {
            var targetAchievement = _completedAchievments.FirstOrDefault(target => target.Id == achievementId);
            return targetAchievement != null;
        }

        private bool CheckPreRequire(Achievement targetAchievement)
        {
            if (targetAchievement.PreRequireCondition == null)
            {
                return true;
            }
            else
            {
                return targetAchievement.PreRequireCondition.All(require => _completedAchievments.Any(x => x.Id == require) != false);
            }
        }

        private void OnCompleteAchievement(Achievement completedAchievement)
        {
            OnReportNotify -= completedAchievement.Report;
            _activeAchievements.Remove(completedAchievement);
            _completedAchievments.Add(completedAchievement);
            UpdateAchievementActivate();
            SaveCurrentAchievementInfo();
            PlayerPrefs.SetInt(CONFIGIDX.HAS_NEW_ACHIEVEMENT.ToString(),1);
        }

        #region Save/Load/Clear
        private void CreateAchievements()
        {
            var sheetData = _achievementInteractor.LoadAchievementData();
            var saveData = _achievementInteractor.LoadAchievementSaveData();
            Achievements = _achievementCreator.Create(sheetData, saveData);
            _completedAchievments = Achievements.Where(achievement => achievement.IsComplete).ToHashSet();
            _inActiveAchievements = Achievements.Where(achievement => achievement.IsInActive).ToHashSet();
            UpdateAchievementActivate();
        }
        private void SaveCurrentAchievementInfo()
        {
            var saveData = Achievements.Select(achievement => achievement.CreateAchievementSaveData()).ToList();
            _achievementInteractor.SaveAchievementData(saveData);
        }

        [ContextMenu("ClearAchievementData")]
        private void ClearAchievement()
        {
            Achievements.Clear();
            _inActiveAchievements.Clear();
            _activeAchievements.Clear();
            _completedAchievments.Clear();
            _achievementInteractor.ClearAchievementData(CreateAchievements);
        }
        #endregion

        #region TestCode
        //todo - 업적 데이터 필요한 요소들 테스트후 삭제

        public System.Action OnChangedAchievementState;
        public void OnChangedAchievementComplete(string achievementId, bool isComplete)
        {
            var matchedAchievement = Achievements.FirstOrDefault(obj => obj.Id == achievementId);
            if (matchedAchievement != null)
            {
                matchedAchievement.ChangeComplete(isComplete);
                if (isComplete)
                {
                    if (_activeAchievements.Contains(matchedAchievement))
                        _activeAchievements.Remove(matchedAchievement);
                    if (_inActiveAchievements.Contains(matchedAchievement))
                        _inActiveAchievements.Remove(matchedAchievement);
                    _completedAchievments.Add(matchedAchievement);
                }
                else
                {
                    _completedAchievments.Remove(matchedAchievement);
                    _inActiveAchievements.Add(matchedAchievement);
                }
                UpdateAchievementActivate();
                SaveCurrentAchievementInfo();
                OnChangedAchievementState?.Invoke();
            }
        }
        #endregion
    }
}
