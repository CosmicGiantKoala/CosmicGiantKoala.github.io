# IAchievementRepository

## 개요

`IAchievementRepository` 인터페이스는 SlimeRush 게임의 업적 시스템에서 데이터 저장소의 기본 기능을 정의합니다. 이 인터페이스는 업적 데이터의 로드와 저장 기능을 추상화하여, 다양한 저장소 구현체(로컬, 클라우드 등)에서 일관된 방식으로 업적 데이터를 관리할 수 있도록 합니다. 저장소 계층의 추상화를 통해 유연한 데이터 관리 아키텍처를 제공합니다.

## 역할

- 업적 데이터 로드 기능 정의
- 업적 데이터 저장 기능 정의
- 저장소 계층 추상화 제공
- 데이터 영속성 관리

## 멤버

### 메서드

```csharp
/// <summary>
/// 업적 저장 데이터 로드
/// </summary>
/// <returns>저장된 데이터 문자열 (JSON 형식)</returns>
string LoadAchievementSaveData();

/// <summary>
/// 업적 데이터 저장
/// </summary>
/// <param name="saveDataJson">저장할 데이터 문자열 (JSON 형식)</param>
void SaveAchievementData(string saveDataJson);
```

## 주요 코드 스니펫

### 인터페이스 정의

```csharp
public interface IAchievementRepository
{
    string LoadAchievementSaveData();
    void SaveAchievementData(string saveDataJson);
}
```

## 기능 설명

### 데이터 로드 기능

- 저장된 업적 데이터를 문자열로 반환
- JSON 형식의 데이터 로드
- 빈 문자열 반환 시 초기 상태로 간주

### 데이터 저장 기능

- JSON 형식의 데이터를 저장
- 문자열 기반 데이터 저장
- 구현체에서 실제 저장소에 저장

### 저장소 추상화

- 구체적인 저장소 구현 숨김
- 인터페이스를 통한 일관된 접근
- 다양한 저장소 백엔드 지원

## 의존성/상속 관계

- `Reward` 네임스페이스 사용

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

### 구현체 예시

```csharp
// AchievementRepository 구현 예시
public class AchievementRepository : IAchievementRepository
{
    private IAchievementDataSource _dataSource;

    public string LoadAchievementSaveData()
    {
        return _dataSource.LoadAchievementSaveData();
    }

    public void SaveAchievementData(string saveDataJson)
    {
        _dataSource.SaveAchievementData(saveDataJson);
    }
}
```

## 관련 클래스

- [`AchievementInteractor`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementInteractor): 데이터 인터랙터
- [`AchievementRepository`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementRepository): 저장소 구현체
- [`IAchievementDataSource`](/docs/projects/rfice/SlimeRush/AchievementSystem/IAchievementDataSource): 데이터 소스 인터페이스
- [`LocalAchievementDataSource`](/docs/projects/rfice/SlimeRush/AchievementSystem/LocalAchievementDataSource): 로컬 데이터 소스

## 전체 코드

```csharp
using System;

namespace Reward
{
	public interface IAchievementRepository
	{
		string LoadAchievementSaveData();
		void SaveAchievementData(string saveDataJson);
	}
}
