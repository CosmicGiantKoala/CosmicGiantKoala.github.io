# AchievementInteractor

## 개요

`AchievementInteractor` 클래스는 SlimeRush 게임의 업적 시스템에서 `IAchievementInteractor` 인터페이스를 구현하는 구체적인 데이터 인터랙터입니다. 이 클래스는 업적 데이터의 로드, 저장, 초기화 기능을 제공하며, JSON 직렬화를 통해 데이터를 영구 저장소에 저장하고 로드합니다. 클라우드 동기화 및 로컬 저장소를 지원하며, 의존성 주입을 통해 유연한 데이터 소스 관리를 제공합니다.

## 역할

- 업적 시트 데이터 로드
- 업적 저장 데이터 로드 및 저장
- 업적 데이터 초기화
- JSON 직렬화/역직렬화 처리
- 데이터 저장소와의 상호작용

## 멤버

### 의존성 주입

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
```

### 내부 필드

```csharp
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
/// <returns>업적 시트 데이터 목록</returns>
public List<AchievementSheetData> LoadAchievementData()

/// <summary>
/// 업적 저장 데이터 저장
/// </summary>
/// <param name="saveData">저장할 업적 데이터 목록</param>
public void SaveAchievementData(List<AchievementSaveData> saveData)

/// <summary>
/// 업적 저장 데이터 로드
/// </summary>
/// <returns>업적 저장 데이터 목록</returns>
public List<AchievementSaveData> LoadAchievementSaveData()

/// <summary>
/// 업적 데이터 초기화
/// </summary>
/// <param name="onClearCompleteCallBack">초기화 완료 시 호출될 콜백</param>
public void ClearAchievementData(Action onClearCompleteCallBack = null)
```

## 주요 코드 스니펫

### 데이터 로드 및 캐싱

```csharp
public List<AchievementSheetData> LoadAchievementData()
{
    return _sheetData ??= _projectStreamingAssets.LoadAchievementSheetData();
}
```

### 데이터 저장 (JSON 직렬화)

```csharp
public void SaveAchievementData(List<AchievementSaveData> saveData)
{
    var saveDataJson = JsonConvert.SerializeObject(saveData, Formatting.Indented);
    _achievementRepository.SaveAchievementData(saveDataJson);
}
```

### 데이터 로드 (JSON 역직렬화)

```csharp
public List<AchievementSaveData> LoadAchievementSaveData()
{
    var achievementSaveData = new List<AchievementSaveData>();
    var saveDataJson = _achievementRepository.LoadAchievementSaveData();

    if (saveDataJson.Length > 0)
    {
        achievementSaveData = JsonConvert.DeserializeObject<List<AchievementSaveData>>(saveDataJson);
    }

    return achievementSaveData;
}
```

### 데이터 초기화

```csharp
public void ClearAchievementData(Action onClearCompleteCallBack = null)
{
    var clearedSaveData = _sheetData.Select(data =>
        new AchievementSaveData(data.iD, DefaultSuccessCount, DefaultSuccessTrigger)).ToList();
    var saveDataJson = JsonConvert.SerializeObject(clearedSaveData, Formatting.Indented);
    _achievementRepository.SaveAchievementData(saveDataJson);
    onClearCompleteCallBack?.Invoke();
}
```

## 기능 설명

### 데이터 로드 기능

- 시트 데이터 로드 및 캐싱
- 저장 데이터 로드 및 JSON 역직렬화
- 빈 데이터 처리 (초기 상태)

### 데이터 저장 기능

- JSON 직렬화를 통한 데이터 저장
- 포맷팅된 JSON 출력
- 저장소 인터페이스를 통한 유연한 저장

### 데이터 초기화 기능

- 모든 업적 데이터를 기본값으로 재설정
- 시트 데이터를 기반으로 초기화
- 콜백을 통한 완료 알림

### 캐싱 시스템

- 시트 데이터 캐싱을 통한 성능 최적화
- 중복 로드 방지
- 메모리 효율성 향상

## 의존성/상속 관계

- `IAchievementInteractor` 인터페이스 구현
- `ProjectStreamingAssets` 클래스에 의존 (의존성 주입)
- `IAchievementRepository` 인터페이스에 의존 (의존성 주입)
- `Newtonsoft.Json` 라이브러리에 의존 (JSON 처리)
- `Zenject` DI 프레임워크 사용
- `Reward.Entity` 네임스페이스 사용

## 사용 예시

### AchievementSystem에서 사용

```csharp
// 의존성 주입을 통한 사용
[Inject]
private IAchievementInteractor _achievementInteractor;

// 데이터 로드
var sheetData = _achievementInteractor.LoadAchievementData();
var saveData = _achievementInteractor.LoadAchievementSaveData();

// 데이터 저장
_achievementInteractor.SaveAchievementData(saveDataList);

// 데이터 초기화
_achievementInteractor.ClearAchievementData(() => {
    Debug.Log("업적 데이터가 초기화되었습니다.");
    CreateAchievements(); // 재생성
});
```

### 데이터 흐름

```csharp
// 데이터 로드 → 업적 생성 → 데이터 저장 흐름
var sheetData = _achievementInteractor.LoadAchievementData();
var saveData = _achievementInteractor.LoadAchievementSaveData();
var achievements = _achievementCreator.Create(sheetData, saveData);
// 게임 진행...
_achievementInteractor.SaveAchievementData(saveDataList);
```

## 관련 클래스

- [`IAchievementInteractor`](/docs/projects/rfice/SlimeRush/AchievementSystem/IAchievementInteractor): 구현하는 인터페이스
- [`AchievementSystem`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementSystem): 업적 시스템 관리자
- [`AchievementRepository`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementRepository): 데이터 저장소 인터페이스
- [`ProjectStreamingAssets`](/docs/projects/rfice/SlimeRush/Common/ProjectStreamingAssets): 스트리밍 에셋 접근
- [`AchievementCreator`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementCreator): 업적 생성기

## 전체 코드

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using Common;
using Newtonsoft.Json;
using Reward;
using Reward.Entity;
using Zenject;

namespace Steamworks.NET.CloudSync
{
	public class AchievementInteractor : IAchievementInteractor
	{
		[Inject]
		private ProjectStreamingAssets _projectStreamingAssets;
		[Inject]
		private IAchievementRepository _achievementRepository;

		private List<AchievementSheetData> _sheetData;
		private const int DefaultSuccessCount = 0;
		private const bool DefaultSuccessTrigger = false;

		public List<AchievementSheetData> LoadAchievementData()
		{
			return _sheetData ??= _projectStreamingAssets.LoadAchievementSheetData();
		}

		public void SaveAchievementData(List<AchievementSaveData> saveData)
		{
			var saveDataJson = JsonConvert.SerializeObject(saveData, Formatting.Indented);
			_achievementRepository.SaveAchievementData(saveDataJson);
		}

		public List<AchievementSaveData> LoadAchievementSaveData()
		{
			var achievementSaveData = new List<AchievementSaveData>();
			var saveDataJson = _achievementRepository.LoadAchievementSaveData();

			if (saveDataJson.Length > 0)
			{
				achievementSaveData = JsonConvert.DeserializeObject<List<AchievementSaveData>>(saveDataJson);
			}

			return achievementSaveData;
		}

		public void ClearAchievementData(Action onClearCompleteCallBack = null)
		{
			var clearedSaveData = _sheetData.Select(data => new AchievementSaveData(data.iD, DefaultSuccessCount, DefaultSuccessTrigger)).ToList();
			var saveDataJson = JsonConvert.SerializeObject(clearedSaveData, Formatting.Indented);
			_achievementRepository.SaveAchievementData(saveDataJson);
			onClearCompleteCallBack?.Invoke();
		}
	}
}
