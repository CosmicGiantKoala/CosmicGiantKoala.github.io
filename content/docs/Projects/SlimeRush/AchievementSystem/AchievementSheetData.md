# AchievementSheetData

## 개요

`AchievementSheetData` 클래스는 SlimeRush 게임의 업적 시스템에서 게임 디자인 데이터를 나타내는 데이터 모델입니다. 이 클래스는 업적의 기본 정보(ID, 이름, 설명, 조건 등)를 저장하며, 게임 디자이너가 정의한 업적 스펙을 코드에서 사용할 수 있는 형태로 변환합니다. 직렬화 가능하여 다양한 데이터 소스에서 로드 및 저장할 수 있습니다.

## 역할

- 업적 기본 정보 저장
- 게임 디자인 데이터 표현
- 직렬화 및 역직렬화 지원
- 업적 생성 시 기본 데이터 제공

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

### 유연한 초기화

- 선택적 매개변수를 통한 유연한 객체 생성
- 기본값을 통해 간단한 업적 정의 가능
- 복잡한 조건을 가진 업적도 지원

### 데이터 무결성

- 읽기 전용 속성을 통해 데이터 보호
- 필요한 경우 수정 가능한 속성 제공 (needSuccess, preRequireCondition)
- 일관된 데이터 구조 유지

## 의존성/상속 관계

- `Serializable` 속성 사용 (직렬화 지원)
- `Reward.Entity` 네임스페이스 사용

## 사용 예시

### 업적 시트 데이터 생성

```csharp
// 기본 업적 생성
var basicAchievement = new AchievementSheetData(
    "kill_10_slimes",
    "ACHIEVEMENT_KILL_10_SLIMES",
    "10마리의 슬라임을 처치하세요",
    "Kill",
    "slime",
    "10 골드 보상"
);

// 복잡한 업적 생성
var complexAchievement = new AchievementSheetData(
    "kill_100_slimes",
    "ACHIEVEMENT_KILL_100_SLIMES",
    "100마리의 슬라임을 처치하세요",
    "Kill",
    "slime",
    "100 골드 보상",
    needSuccess: 100,
    preRequireCondition: new string[] { "kill_10_slimes" }
);
```

### 데이터 로드 및 사용

```csharp
// IAchievementInteractor를 통해 데이터 로드
var sheetDataList = _achievementInteractor.LoadAchievementData();

// 업적 생성기에 전달
var achievements = _achievementCreator.Create(sheetDataList, saveDataList);
```

## 관련 클래스

- [`AchievementCreator`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementCreator): 업적 생성기
- [`AchievementSaveData`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementSaveData): 업적 저장 데이터
- [`Achievement`](/docs/projects/rfice/SlimeRush/AchievementSystem/Achievement): 생성된 업적 객체
- [`IAchievementInteractor`](/docs/projects/rfice/SlimeRush/AchievementSystem/IAchievementInteractor): 데이터 인터랙터 인터페이스

## 전체 코드

```csharp
using System;

namespace Reward.Entity
{
    [Serializable]
    public class AchievementSheetData
    {
        public string iD { get; private set;}
        public string nameKey { get; private set;}
        public string description { get; private set;}
        public string conditionType { get; private set;}
        public string conditionValue { get; private set;}
        public string rewardDes { get; private set;}
        //필요횟수
        public int needSuccess { get; set;}
        //선행조건
        public string[] preRequireCondition { get; set;}

        public AchievementSheetData(string id, string nameKey, string description, string conditionType, string conditionValue, string rewardDes, int needSuccess = 1, string[] preRequireCondition = null)
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
    }
}
