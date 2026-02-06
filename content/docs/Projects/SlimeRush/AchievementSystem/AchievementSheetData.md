+++
title = "AchievementSheetData"
description = "업적 시스템에서 업적의 기본 정보를 정의하는 데이터 모델"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 207
+++
## 개요
`AchievementSheetData` 클래스는 SlimeRush 게임의 업적 시스템에서 업적의 기본 정보를 정의하는 데이터 모델입니다.
이 클래스는 업적의 기본 정보(ID, 이름, 설명, 조건 등)를 저장하며, 게임 디자이너가 정의한 업적 스펙을 코드에서 사용할 수 있는 형태로 변환합니다.

## 역할
- 업적 기본 정보 정의
- 게임 디자인 데이터 표현
- 직렬화 및 역직렬화 지원
- 업적 생성 시 기본 데이터 제공

## 선언
```csharp
[Serializable]
public class AchievementSheetData
```

## 멤버
### 속성
```csharp
/// <summary>
/// 업적의 고유 식별자
/// </summary>
public string iD { get; private set;}

/// <summary>
/// 로컬라이징용 업적 이름 키
/// </summary>
public string nameKey { get; private set;}

/// <summary>
/// 업적 설명
/// </summary>
public string description { get; private set;}

/// <summary>
/// 업적 완료 조건 타입
/// </summary>
public string conditionType { get; private set;}

/// <summary>
/// 업적 완료 조건 값
/// </summary>
public string conditionValue { get; private set;}

/// <summary>
/// 업적 보상 설명
/// </summary>
public string rewardDes { get; private set;}

/// <summary>
/// 업적 완료에 필요한 성공 횟수
/// </summary>
public int needSuccess { get; set;}

/// <summary>
/// 선행 조건 업적 ID 목록
/// </summary>
public string[] preRequireCondition { get; set;}
```

### 생성자
```csharp
/// <summary>
/// AchievementSheetData 생성자
/// </summary>
/// <param name="id">업적 ID</param>
/// <param name="nameKey">로컬라이징 키</param>
/// <param name="description">업적 설명</param>
/// <param name="conditionType">조건 타입</param>
/// <param name="conditionValue">조건 값</param>
/// <param name="rewardDes">보상 설명</param>
/// <param name="needSuccess">필요 성공 횟수 (기본값: 1)</param>
/// <param name="preRequireCondition">선행 조건 업적 목록 (기본값: null)</param>
public AchievementSheetData(string id, string nameKey, string description, string conditionType,
    string conditionValue, string rewardDes, int needSuccess = 1, string[] preRequireCondition = null)
```

## 주요 코드 스니펫
### 데이터 구조
```csharp
[Serializable]
public class AchievementSheetData
{
    public string iD { get; private set;}
    public string nameKey { get; private set;}
    public string description { get; private set;}
    public string conditionType { get; private set;}
    public string conditionValue { get; private set;}
    public string rewardDes { get; private set;}
    public int needSuccess { get; set;}
    public string[] preRequireCondition { get; set;}
}
```

### 생성자 구현
```csharp
public AchievementSheetData(string id, string nameKey, string description, string conditionType,
    string conditionValue, string rewardDes, int needSuccess = 1, string[] preRequireCondition = null)
{
    this.iD = id;
    this.nameKey = nameKey;
    this.description = description;
    this.conditionType = conditionType;
    this.conditionValue = conditionValue;
    this.rewardDes = rewardDes;
    this.needSuccess = needSuccess;
    this.preRequireCondition = preRequireCondition;
}
```

## 기능 설명
### 데이터 모델링
- 업적의 기본 속성을 정의
- 게임 디자인 데이터와 코드 간의 브리지 역할
- 직렬화 속성을 통해 데이터 저장 및 로드 지원

### 데이터 특성
- 게임 디자인 시 결정되는 정적 데이터
- 대부분의 속성이 private로 읽기 전용

## 의존성/상속 관계
- [`Serializable`](https://docs.unity3d.com/2022.3/Documentation/ScriptReference/Serializable.html) 속성 사용 (직렬화 지원)
- [`Achievement`](/docs/projects/SlimeRush/AchievementSystem/Achievement) 클래스와 연관
- [`AchievementCreator`](/docs/projects/SlimeRush/AchievementSystem/AchievementCreator) 클래스와 연관
- [`IAchievementInteractor`](/docs/projects/SlimeRush/AchievementSystem/IAchievementInteractor) 인터페이스에서 사용

## 사용 예시
#### `ProjectStreamingAssets`에서 역직렬화를 통해 외부 데이터를 로드하여 시트 데이터로 변경
```csharp
public List<AchievementSheetData> LoadAchievementSheetData()
{
    var sheetData = _jsonHelper.GetJsonData<AchievementSheetData>(AchievementDataPath);
    return sheetData;
}
```

#### [`AchievementInteractor`](/docs/projects/SlimeRush/AchievementSystem/AchievementInteractor)에서 데이터 초기화시 기본 시트 데이터 활용
```csharp
public void ClearAchievementData(Action onClearCompleteCallBack = null)
{
    // 업적 시트 데이터를 기반으로 초기화된 저장 데이터를 생성합니다
    var clearedSaveData = _sheetData.Select(data => new AchievementSaveData(data.iD, DefaultSuccessCount, DefaultSuccessTrigger)).ToList();
    // 초기화된 데이터를 JSON 형식으로 직렬화합니다
    var saveDataJson = JsonConvert.SerializeObject(clearedSaveData, Formatting.Indented);
    // 직렬화된 데이터를 저장소에 저장합니다
    _achievementRepository.SaveAchievementData(saveDataJson);
    // 초기화 완료 콜백이 있는 경우 호출합니다
    onClearCompleteCallBack?.Invoke();
}
```

## 관련 클래스

- [`AchievementCreator`](/docs/projects/SlimeRush/AchievementSystem/AchievementCreator)
- [`AchievementSaveData`](/docs/projects/SlimeRush/AchievementSystem/AchievementSaveData)
- [`Achievement`](/docs/projects/SlimeRush/AchievementSystem/Achievement)
- [`IAchievementInteractor`](/docs/projects/SlimeRush/AchievementSystem/IAchievementInteractor)
- [`AchievementInteractor`](/docs/projects/SlimeRush/AchievementSystem/AchievementInteractor)