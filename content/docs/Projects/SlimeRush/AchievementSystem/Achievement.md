+++
title = "Achievement"
description = "업적 시스템 핵심 데이터 모델"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 201
+++
## 개요
`Achievement` 클래스는 SlimeRush 게임의 업적 시스템의 핵심 데이터 모델을 나타냅니다. 이 클래스는 개별 업적의 상태, 진행 상황, 완료 조건 등을 관리하며, 업적 달성 시 보상 시스템과 연동됩니다. 플레이어의 게임 진행 상황을 추적하고, 특정 조건을 달성했을 때 업적을 완료 처리하는 기능을 제공합니다.

## 역할
- 업적의 기본 데이터(ID, 이름, 설명, 조건 등) 관리
- 업적의 현재 데이터(비활성, 활성, 완료) 추적 및 관리
- 업적 완료 조건 검증 및 진행 상황 업데이트
- 업적 완료 시 이벤트 발생 및 콜백 처리
- 업적 데이터의 직렬화 및 저장소와의 호환성 제공

## 멤버
### 이벤트
```csharp
/// <summary>
/// 업적 완료 시 발생하는 이벤트
/// </summary>
/// <param name="achievement">완료된 업적 객체</param>
public delegate void CompleteHandler(Achievement achievement);
public event CompleteHandler OnCompleteEvent;
```

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
/// 현재 상태
/// </summary>
private AchievementState _state;

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

### 메서드
```csharp
/// <summary>
/// 업적 생성자
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
### 업적 생성 및 초기화
```csharp
public Achievement(string id, string nameKey, string description, string conditionType,
    string conditionValue, string rewardDescription, int currentSuccess, int needSuccess,
    bool isComplete, string[] preRequireCondition)
{
    //업적 기본 데이터 셋업
    Id = id;
    NameKey = nameKey;
    Description = description;
    ConditionType = ParseConditionType(conditionType);
    ConditionValue = conditionValue;
    RewardDescription = rewardDescription;
    PreRequireCondition = preRequireCondition;
    NeedSuccess = needSuccess;

    //업적 상태 데이터 셋업
    CurrentSuccess = currentSuccess;
    _state = isComplete ? AchievementState.Complete : AchievementState.InActive;
}
```

### 업적 상태 관리
```csharp
// 업적 상태는 내부적으로 AchievementState 열거형으로 관리
private AchievementState _state;

// 상태 확인 속성
public bool IsInActive => _state == AchievementState.InActive;
public bool IsActive => _state == AchievementState.Active;
public bool IsComplete => _state == AchievementState.Complete;
```

### 업적 활성화
```csharp
public void Active(CompleteHandler onCompleteCallBack)
{
    // 상태 활성화
    _state = AchievementState.Active;
    // 완료 이벤트 설정
    OnCompleteEvent = onCompleteCallBack;
}
```

### 진행상황 보고 및 완료 처리

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

### 업적 상태 관리
- **비활성(InActive)**: 초기 상태, 아직 활성화되지 않은 업적
- **활성(Active)**: 진행 중인 업적, 조건 달성 가능 상태
- **완료(Complete)**: 모든 조건을 달성한 업적

### 진행 상황 추적
- `CurrentSuccess` 속성을 통해 현재 달성 횟수 추적
- `NeedSuccess` 속성과 비교하여 완료 조건 검증
- `Report()` 메서드를 통해 조건 달성 보고
- `CurrentSuccess`가 `NeedSuccess`에 도달하면 자동으로 완료 처리

### 이벤트 처리 시스템
- `OnCompleteEvent` 델리게이트를 통해 업적 완료 시 알림
- 콜백 패턴을 사용하여 외부 시스템과 연동
- 이벤트 발생 후 핸들러 자동 제거로 메모리 관리

### 데이터 호환성
- 업적 기본 정보(시트 데이터)와 진행 상태(저장 데이터) 분리 관리
- `CreateAchievementSaveData()`를 통해 저장 가능한 데이터 생성
- `AchievementSaveData` 객체로 변환하여 직렬화 데이터 제공
- 조건 타입 문자열을 열거형으로 변환하여 타입 안전성 보장

## 의존성/상속 관계
- `AchievementConditionType` 열거형에 의존
- `AchievementState` 열거형에 의존
- `AchievementSaveData` 클래스에 의존

## 사용 예시
#### `AchievementCreator`에서 시트데이터와 저장데이터를 통해 업적 데이터 생성
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

#### `AchievementSystem`에서 업적 정보 저장시 업적 저장 데이터로 변환
```csharp
private void SaveCurrentAchievementInfo()
{
    // 저장 데이터 생성
    var saveData = Achievements.Select(achievement => achievement.CreateAchievementSaveData()).ToList();
    // 업적 데이터 저장
    _achievementInteractor.SaveAchievementData(saveData);
}
```

#### `MagicBookLibrary`에서 마법이 업데이트 됬을 때 프로세스
```csharp
// MagicBookLibrary.cs
private void OnUpdatedMagic(MagicInfo magicInfo)
{
    _achievementSystem.Report(magicInfo.id);
    
    ...     
}

// AchievementSystem.cs
public void Report(string conditionValue)
{
    // 보고 알림 이벤트 호출(OnReportNotify에 메서드가 Achievement.Report(string conditionValue)가 매핑되어있음.
    OnReportNotify?.Invoke(conditionValue);
}

// Achievement.cs
public void Report(string conditionValue)
{
    // 조건 값이 일치하지 않는 경우
    if (ConditionValue != conditionValue) return;

    // 성공 횟수 증가
    CurrentSuccess++;
    // 필요한 성공 횟수에 도달한 경우
    if (CurrentSuccess >= NeedSuccess)
    {
        // 완료 처리
        OnComplete();
    }
}
```

## 관련 클래스
- [`AchievementConditionType`](/docs/projects/slimlush/achievementsystem/achievementconditiontype/)
- [`AchievementState`](/docs/projects/slimerush/achievementsystem/achievementstate)
- [`AchievementSaveData`](/docs/projects/slimerush/achievementsystem/achievementsavedata)
- [`AchievementSystem`](/docs/projects/slimerush/achievementsystem/achievementsystem)