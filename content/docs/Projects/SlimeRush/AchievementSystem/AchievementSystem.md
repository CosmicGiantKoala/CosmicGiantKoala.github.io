+++
title = "AchievementSystem"
description = "업적 시스템을 관리하는 핵심 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 201
+++
## 개요
`AchievementSystem` 클래스는 SlimeRush 게임의 업적 시스템을 관리하는 핵심 클래스입니다. 
이 클래스는 업적의 생성, 상태 관리, 진행 상황 추적, 저장 및 로드 기능을 담당하며, 게임 내 모든
업적 관련 로직을 중앙에서 관리합니다. 플레이어의 업적 달성 과정을 모니터링하고, 업적 완료 시
이벤트를 통해 관련된 시스템과 연동합니다.

## 역할
- 업적 데이터([`Achievement`](/docs/projects/SlimeRush/AchievementSystem/Achievement))의 초기화 및 생성([`AchievementCreator`](/docs/projects/SlimeRush/AchievementSystem/AchievementCreator))
- 업적 상태([`AchievementState`](/docs/projects/SlimeRush/AchievementSystem/AchievementState))별 업적 리스트 관리
- 업적 진행 상황 보고 및 처리
- 업적 데이터의 저장 및 로드
- 선행 조건 업적 검사
- 업적 상태 변경 알림

## 선언
```csharp
public class AchievementSystem : MonoBehaviour
```

## 멤버
### 이벤트
```csharp
/// <summary>
/// 업적 상태 변경 이벤트
/// </summary>
public System.Action OnChangedAchievementState;

/// <summary>
/// 진행 상황 보고 델리게이트
/// </summary>
private delegate void ReportNotifier(string conditionValue);

/// <summary>
/// 진행 상황 보고 이벤트
/// </summary>
private event ReportNotifier OnReportNotify;
```

### 속성
```csharp
/// <summary>
/// 업적 데이터 인터랙터 (의존성 주입)
/// </summary>
[Inject]
private IAchievementInteractor _achievementInteractor;

/// <summary>
/// 모든 업적 목록
/// </summary>
public List<Achievement> Achievements { get; private set; }

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
```

## 주요 코드 스니펫
### 업적 데이터 초기화 및 로드
```csharp
private void Awake()
{
    // 업적 생성
    CreateAchievements();
}

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

private void UpdateAchievementActivate()
{
    // 비활성화된 업적 목록을 복사하여 업데이트 대상을 가져옵니다
    var updateTargets = _inActiveAchievements.ToList();
    // 선행 조건을 만족하는 업적만 필터링하여 처리합니다
    foreach (var target in updateTargets.Where(CheckPreRequire))
    {
        // 이미 활성화된 업적은 건너뜁니다
        if (target.IsActive) continue;
        // 업적을 활성화하고 완료 시 호출될 콜백을 등록합니다
        target.Active(OnCompleteAchievement);
        // 업적 보고 이벤트를 보고 알림 시스템에 등록합니다
        OnReportNotify += target.Report;
        // 활성화된 업적 집합에 추가합니다
        _activeAchievements.Add(target);
        // 비활성화된 업적 집합에서 제거합니다
        _inActiveAchievements.Remove(target);
    }

    // 업적 상태가 변경되었음을 알리는 이벤트를 호출합니다
    OnChangedAchievementState?.Invoke();
}
```

### 진행 상황 보고 시스템
```csharp
public void Report(string conditionValue)
{
    OnReportNotify?.Invoke(conditionValue);
}

// Achievement.cs 에서 conditionValue를 통해 완료 조건이 충족될 시 OnCompleteAchievement(Achievement completeAchievement) 이벤트 발생
 
private void OnCompleteAchievement(Achievement completedAchievement)
{
    // 완료된 업적의 보고 이벤트를 보고 알림 시스템에서 제거합니다
    OnReportNotify -= completedAchievement.Report;
    // 활성화된 업적 집합에서 제거합니다
    _activeAchievements.Remove(completedAchievement);
    // 완료된 업적 집합에 추가합니다
    _completedAchievments.Add(completedAchievement);
    // 새로운 업적이 완료되었으므로 다른 업적들의 활성화 상태를 업데이트합니다
    UpdateAchievementActivate();
    // 업적 진행 상태를 저장합니다
    SaveCurrentAchievementInfo();
    // 새로운 업적 알림을 표시하기 위해 PlayerPrefs에 플래그를 설정합니다
    PlayerPrefs.SetInt(CONFIGIDX.HAS_NEW_ACHIEVEMENT.ToString(),1);
}
```

### 데이터 저장
```csharp
private void SaveCurrentAchievementInfo()
{
    // 모든 업적의 현재 진행 상태를 저장 데이터로 변환합니다
    var saveData = Achievements.Select(achievement => achievement.CreateAchievementSaveData()).ToList();
    // 변환된 저장 데이터를 파일로 저장합니다
    _achievementInteractor.SaveAchievementData(saveData);
}
```

### 선행 조건 검사
```csharp
private bool CheckPreRequire(Achievement targetAchievement)
{
    // 선행 조건이 없는 경우 바로 활성화할 수 있습니다
    if (targetAchievement.PreRequireCondition == null)
    {
        return true;
    }
    else
    {
        // 모든 선행 조건이 완료된 업적 목록에 존재하는지 확인합니다
        // 선행 조건 중 하나라도 완료되지 않았으면 false를 반환합니다
        return targetAchievement.PreRequireCondition.All(require => _completedAchievments.Any(x => x.Id == require) != false);
    }
}
```

### 다른 시스템에서 사용 가능한 업적 완료 확인 메서드
```csharp
public bool CheckAchievementCompletion(string achievementId)
{
    // 완료된 업적 목록에서 해당 ID의 업적을 찾습니다
    var targetAchievement = _completedAchievments.FirstOrDefault(target => target.Id == achievementId);
    // 찾은 업적이 있으면 true, 없으면 false를 반환합니다
    return targetAchievement != null;
}
```

## 기능 설명
### 업적 상태 관리 시스템
- **비활성(InActive)**: 선행 조건을 만족하지 못한 업적
- **활성(Active)**: 진행 가능한 업적, 조건 달성 가능 상태
- **완료(Complete)**: 모든 조건을 달성한 업적

### 업적 생명주기 관리
1. **초기화**: `Awake()`에서 `CreateAchievements()` 호출
2. **활성화**: 선행 조건(`Achievement.PreRequireCondition`) 만족 시 자동 활성화
3. **진행**: `Report(string conditionValue)`를 통해 진행 상황 갱신
4. **완료**: 조건 달성 시 `Achievement.OnCompleteEvent`를 받아 완료 처리
5. **저장**: 애플리케이션 종료 시 자동 저장

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
- [`IAchievementInteractor`](/docs/projects/SlimeRush/AchievementSystem/IAchievementInteractor)를 통해 데이터 저장소와 상호작용

### 이벤트 알림 시스템
- `OnChangedAchievementState`: 업적 상태 변경 시 알림
- 외부 시스템에서 상태 변화를 감지할 수 있음
- UI 업데이트 등에 활용

## 의존성/상속 관계
- `MonoBehaviour`를 상속받음 (Unity 컴포넌트)
- [`IAchievementInteractor`](/docs/projects/SlimeRush/AchievementSystem/IAchievementInteractor) 인터페이스를 통해 데이터 로드/세이브 (의존성 주입)
- [`AchievementCreator`](/docs/projects/SlimeRush/AchievementSystem/AchievementCreator) 클래스를 통해 업적 객체 생성
- [`Achievement`](/docs/projects/SlimeRush/AchievementSystem/Achievement) 클래스 관리

## 사용 예시
#### [`MagicBookLibrary`](/docs/projects/SlimeRush/BattleSystem/MagicBookLibrary)에서 마법 획득시 보고
```csharp
private void OnUpdatedMagic(MagicInfo magicInfo)
{
    // 업적 시스템에 마법 획득을 보고합니다
    _achievementSystem.Report(magicInfo.id);

    // 첫 번째 마법인 경우 기본 속성을 설정합니다
    if (IsFirstMagic())
    {
        DefaultMagicElement = magicInfo.element;
    }

    // 이미 해당 마법이 있는 경우 업데이트합니다
    if (HasMagicBook(magicInfo))
    {
        UpdateMagicBook(magicInfo);
    }
    else
    {
        // 새로운 마법을 생성합니다
        StartCoroutine(CreateMagicBook(magicInfo));
    }
}
```

#### `RuneController`에서 업적 완료 여부를 확인하여 인게임 상점 아이템 구성
```csharp
private void CheckAchievement()
{
    foreach (var runeStoreData in _allRuneStoreDatas)
    {
        // 룬상점에서 해당 아이템의 출연 조건이 없거나
        // 업적시스템에서 업적이 완료된 경우 룬상점에 해당 아이템을 출연시킨다.
        if (runeStoreData.achievementCondition == "" ||
            _achievementSystem.CheckAchievementCompletion(runeStoreData.achievementCondition))
        {
            purchasableStoreRunes.Add(runeStoreData);
        }
    }
}
```

## 관련 클래스
- [`AchievementState`](/docs/projects/SlimeRush/AchievementSystem/AchievementState)
- [`IAchievementInteractor`](/docs/projects/SlimeRush/AchievementSystem/IAchievementInteractor)
- [`AchievementInteractor`](/docs/projects/SlimeRush/AchievementSystem/AchievementInteractor)
- [`AchievementCreator`](/docs/projects/SlimeRush/AchievementSystem/AchievementCreator)
- [`Achievement`](/docs/projects/SlimeRush/AchievementSystem/Achievement)
- [`AchievementSaveData`](/docs/projects/SlimeRush/AchievementSystem/AchievementSaveData)
- [`AchievementSheetData`](/docs/projects/SlimeRush/AchievementSystem/AchievementSheetData)