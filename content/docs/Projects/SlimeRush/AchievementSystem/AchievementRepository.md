# AchievementRepository

## 개요

`AchievementRepository` 클래스는 SlimeRush 게임의 업적 시스템에서 `IAchievementRepository` 인터페이스를 구현하는 구체적인 데이터 저장소입니다. 이 클래스는 데이터 소스 계층과 업적 시스템 간의 브리지 역할을 하며, 의존성 주입을 통해 다양한 데이터 소스(로컬, 클라우드 등)를 유연하게 사용할 수 있도록 합니다. 저장소 패턴을 구현하여 데이터 접근을 추상화합니다.

## 역할

- 데이터 소스와 시스템 간의 브리지
- 데이터 저장 기능 제공
- 데이터 로드 기능 제공
- 의존성 주입을 통한 유연한 데이터 소스 관리

## 멤버

### 의존성 주입

```csharp
/// <summary>
/// 데이터 소스 (의존성 주입)
/// </summary>
[Inject]
private IAchievementDataSource _achievementDataSource;
```

### 메서드

```csharp
/// <summary>
/// 업적 데이터 저장
/// </summary>
/// <param name="saveDataJson">저장할 데이터 문자열 (JSON 형식)</param>
public void SaveAchievementData(string saveDataJson)

/// <summary>
/// 업적 저장 데이터 로드
/// </summary>
/// <returns>저장된 데이터 문자열 (JSON 형식)</returns>
public string LoadAchievementSaveData()
```

## 주요 코드 스니펫

### 데이터 저장

```csharp
public void SaveAchievementData(string saveDataJson)
{
    _achievementDataSource.SaveAchievementData(saveDataJson);
}
```

### 데이터 로드

```csharp
public string LoadAchievementSaveData()
{
    return _achievementDataSource.LoadAchievementSaveData();
}
```

## 기능 설명

### 저장소 패턴 구현

- 데이터 접근 추상화
- 데이터 소스 교체 용이
- 테스트 용이성 향상

### 데이터 흐름 관리

- 상위 계층에서 데이터 전달
- 데이터 소스로 데이터 전달
- 결과 반환

### 의존성 주입

- `IAchievementDataSource` 인터페이스 사용
- 다양한 데이터 소스 지원
- 유연한 아키텍처

## 의존성/상속 관계

- `IAchievementRepository` 인터페이스 구현
- `IAchievementDataSource` 인터페이스에 의존 (의존성 주입)
- `Zenject` DI 프레임워크 사용
- `Reward` 네임스페이스 사용
- `Reward.Data` 네임스페이스 사용

## 사용 예시

### AchievementInteractor에서 사용

```csharp
// 의존성 주입을 통한 사용
[Inject]
private IAchievementRepository _achievementRepository;

// 데이터 저장
_achievementRepository.SaveAchievementData(jsonData);

// 데이터 로드
string loadedData = _achievementRepository.LoadAchievementSaveData();
```

### 데이터 흐름

```csharp
// AchievementInteractor → AchievementRepository → IAchievementDataSource 흐름
var saveDataJson = JsonConvert.SerializeObject(saveData);
_achievementRepository.SaveAchievementData(saveDataJson);
// ...
string loadedJson = _achievementRepository.LoadAchievementSaveData();
var loadedData = JsonConvert.DeserializeObject<List<AchievementSaveData>>(loadedJson);
```

## 관련 클래스

- [`IAchievementRepository`](/docs/projects/rfice/SlimeRush/AchievementSystem/IAchievementRepository): 구현하는 인터페이스
- [`IAchievementDataSource`](/docs/projects/rfice/SlimeRush/AchievementSystem/IAchievementDataSource): 데이터 소스 인터페이스
- [`LocalAchievementDataSource`](/docs/projects/rfice/SlimeRush/AchievementSystem/LocalAchievementDataSource): 로컬 데이터 소스 구현체
- [`AchievementInteractor`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementInteractor): 데이터 인터랙터

## 전체 코드

```csharp
using Reward;
using Reward.Data;
using Zenject;

namespace Steamworks.NET.CloudSync
{
	public class AchievementRepository : IAchievementRepository
	{
		[Inject]
		private IAchievementDataSource _achievementDataSource;

		public void SaveAchievementData(string saveDataJson)
		{
			_achievementDataSource.SaveAchievementData(saveDataJson);
		}

		public string LoadAchievementSaveData()
		{
			return _achievementDataSource.LoadAchievementSaveData();
		}
	}
}
