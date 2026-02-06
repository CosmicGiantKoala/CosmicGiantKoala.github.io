+++
title = "AchievementInteractor"
description = "`IAchievementInteractor` 인터페이스를 구현하는 구체적인 데이터 인터랙터"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 201
+++
## 개요
`AchievementInteractor` 클래스는 SlimeRush 게임의 업적 시스템에서 [`IAchievementInteractor`](/docs/projects/SlimeRush/AchievementSystem/IAchievementInteractor)
인터페이스를 구현하는 구체적인 데이터 인터랙터입니다. 이 클래스는 업적 데이터의 로드, 저장, 초기화 기능을 제공하며,
JSON 직렬화를 통해 데이터를 영구 저장소에 저장하고 로드합니다. 클라우드 동기화 및 로컬 저장소를 지원하며, 의존성 주입을 통해
유연한 데이터 소스 관리를 제공합니다.

## 역할
- 업적 시트 데이터([`AchievementSheetData`](/docs/projects/SlimeRush/AchievementSystem/AchievementSheetData)) 로드
- 업적 저장 데이터([`AchievementSaveData`](/docs/projects/SlimeRush/AchievementSystem/AchievementSaveData)) 로드 및 저장
- 업적 데이터 초기화
- JSON 직렬화/역직렬화 처리
- 데이터 저장소와의 상호작용

## 선언
```csharp
public class AchievementInteractor : IAchievementInteractor
```

## 멤버
### 속성
```csharp
/// <summary>
/// 프로젝트 스트리밍 에셋 접근 (의존성 주입)
/// </summary>
[Inject]
private ProjectStreamingAssets _projectStreamingAssets;

/// <summary>
/// 업적 저장소 (의존성 주입)
/// </summary>
[Inject]
private IAchievementRepository _achievementRepository;

/// <summary>
/// 캐시된 시트 데이터
/// </summary>
private List<AchievementSheetData> _sheetData;

/// <summary>
/// 기본 성공 횟수
/// </summary>
private const int DefaultSuccessCount = 0;

/// <summary>
/// 기본 성공 트리거
/// </summary>
private const bool DefaultSuccessTrigger = false;
```

### 메서드
```csharp
/// <summary>
/// 업적 시트 데이터 로드
/// </summary>
/// <returns>업적 시트 데이터 리스트</returns>
public List<AchievementSheetData> LoadAchievementData()

/// <summary>
/// 업적 저장 데이터 저장
/// </summary>
/// <param name="saveData">저장할 업적 데이터 리스트</param>
public void SaveAchievementData(List<AchievementSaveData> saveData)

/// <summary>
/// 업적 저장 데이터 로드
/// </summary>
/// <returns>업적 저장 데이터 리스트</returns>
public List<AchievementSaveData> LoadAchievementSaveData()

/// <summary>
/// 업적 데이터 초기화
/// </summary>
/// <param name="onClearCompleteCallBack">초기화 완료 시 호출될 콜백</param>
public void ClearAchievementData(Action onClearCompleteCallBack = null)
```

## 주요 코드 스니펫
### 업적 시트 데이터 로드 및 캐싱
```csharp
public List<AchievementSheetData> LoadAchievementData()
{
    // 캐싱된 데이터가 없으면 프로젝트 스트리밍 에셋에서 로드합니다
    return _sheetData ??= _projectStreamingAssets.LoadAchievementSheetData();
}
```

### 데이터 저장 (JSON 직렬화)
```csharp
public void SaveAchievementData(List<AchievementSaveData> saveData)
{
    // 업적 데이터를 JSON 형식으로 직렬화합니다
    var saveDataJson = JsonConvert.SerializeObject(saveData, Formatting.Indented);
    // 직렬화된 데이터를 저장소에 저장합니다
    _achievementRepository.SaveAchievementData(saveDataJson);
}
```

### 데이터 로드 (JSON 역직렬화)
```csharp
public List<AchievementSaveData> LoadAchievementSaveData()
{
    // 업적 저장 데이터를 저장할 새로운 목록을 생성합니다
    var achievementSaveData = new List<AchievementSaveData>();
    // 저장소에서 JSON 형식의 업적 데이터를 로드합니다
    var saveDataJson = _achievementRepository.LoadAchievementSaveData();

    // 로드된 데이터가 있는 경우
    if (saveDataJson.Length > 0)
    {
        // JSON 데이터를 업적 저장 데이터로 역직렬화합니다
        achievementSaveData = JsonConvert.DeserializeObject<List<AchievementSaveData>>(saveDataJson);
    }

    // 업적 저장 데이터를 반환합니다 (데이터가 없으면 빈 목록이 반환됩니다)
    return achievementSaveData;
}
```

### 데이터 초기화
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

## 기능 설명
### 데이터 로드 기능
- 시트 데이터([`AchievementSheetData`](/docs/projects/SlimeRush/AchievementSystem/AchievementSheetData)) 로드 및 캐싱
- 저장 데이터([`AchievementSaveData`](/docs/projects/SlimeRush/AchievementSystem/AchievementSaveData)) 로드 및 JSON 역직렬화

### 데이터 저장 기능
- JSON 직렬화를 통한 데이터 저장
- 저장소 인터페이스를 통한 유연한 저장

### 데이터 초기화 기능
- 모든 업적 데이터를 기본값으로 재설정
- 시트 데이터를 기반으로 초기화
- 콜백을 통한 완료 알림

## 의존성/상속 관계
- [`IAchievementInteractor`](/docs/projects/SlimeRush/AchievementSystem/IAchievementInteractor) 인터페이스 구현
- `ProjectStreamingAssets` 클래스에 의존 (의존성 주입)
- [`IAchievementRepository`](/docs/projects/SlimeRush/AchievementSystem/IAchievementRepository) 인터페이스를 통해 저장소 기능 호출 (의존성 주입)
- [`Newtonsoft.Json`](https://docs.unity3d.com/Packages/com.unity.nuget.newtonsoft-json@3.2/manual/index.html) 라이브러리를 통해 저장 데이터 직렬화/역직렬화 처리

## 관련 클래스
- [`IAchievementInteractor`](/docs/projects/SlimeRush/AchievementSystem/IAchievementInteractor)
- [`AchievementSystem`](/docs/projects/SlimeRush/AchievementSystem/AchievementSystem)
- [`AchievementRepository`](/docs/projects/SlimeRush/AchievementSystem/AchievementRepository)
- [`AchievementCreator`](/docs/projects/SlimeRush/AchievementSystem/AchievementCreator)
- [`AchievementSheetData`](/docs/projects/SlimeRush/AchievementSystem/AchievementSheetData)
- [`AchievementSaveData`](/docs/projects/SlimeRush/AchievementSystem/AchievementSaveData)