# IAchievementInteractor

## 개요

`IAchievementInteractor` 인터페이스는 SlimeRush 게임의 업적 시스템에서 데이터 저장소와 상호작용하는 메서드들을 정의합니다. 이 인터페이스는 업적 데이터의 로드, 저장, 초기화 기능을 추상화하여, 다양한 데이터 소스(로컬, 클라우드 등)에서 일관된 방식으로 업적 데이터를 관리할 수 있도록 합니다.

## 역할

- 업적 시트 데이터 로드
- 업적 저장 데이터 로드
- 업적 데이터 저장
- 업적 데이터 초기화

## 멤버

### 메서드

```csharp
/// <summary>
/// 업적 시트 데이터 로드
/// </summary>
/// <returns>업적 시트 데이터 목록</returns>
List<AchievementSheetData> LoadAchievementData();

/// <summary>
/// 업적 저장 데이터 로드
/// </summary>
/// <returns>업적 저장 데이터 목록</returns>
List<AchievementSaveData> LoadAchievementSaveData();

/// <summary>
/// 업적 데이터 저장
/// </summary>
/// <param name="saveData">저장할 업적 데이터 목록</param>
void SaveAchievementData(List<AchievementSaveData> saveData);

/// <summary>
/// 업적 데이터 초기화
/// </summary>
/// <param name="onClearCompleteCallBack">초기화 완료 시 호출될 콜백</param>
void ClearAchievementData(Action onClearCompleteCallBack = null);
```

## 주요 코드 스니펫

### 인터페이스 정의

```csharp
public interface IAchievementInteractor
{
    List<AchievementSheetData> LoadAchievementData();
    List<AchievementSaveData> LoadAchievementSaveData();
    void SaveAchievementData(List<AchievementSaveData> saveData);
    void ClearAchievementData(Action onClearCompleteCallBack = null);
}
```

## 기능 설명

### 데이터 로드 기능

- `LoadAchievementData()`: 게임 디자인 데이터(시트 데이터) 로드
- `LoadAchievementSaveData()`: 플레이어 진행 상황 데이터(저장 데이터) 로드
- 두 메서드를 통해 완전한 업적 정보를 구성할 수 있음

### 데이터 저장 기능

- `SaveAchievementData()`: 플레이어의 업적 진행 상황 저장
- 저장 데이터 목록을 받아 일괄 처리
- 게임 종료 시 자동으로 호출되어 진행 상황 유지

### 데이터 초기화 기능

- `ClearAchievementData()`: 모든 업적 데이터 초기화
- 콜백 패턴을 통해 초기화 완료 시 알림
- 테스트 또는 게임 재시작 시 사용

## 의존성/상속 관계

- `AchievementSheetData` 클래스에 의존
- `AchievementSaveData` 클래스에 의존
- `Reward.Entity` 네임스페이스 사용

## 사용 예시

### AchievementSystem에서 사용

```csharp
// AchievementSystem에서 인터페이스 구현체 사용 예시
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

### 의존성 주입 예시

```csharp
// Zenject를 사용한 의존성 주입
public class AchievementSystem : MonoBehaviour
{
    [Inject]
    private IAchievementInteractor _achievementInteractor;

    // 인터페이스를 통해 데이터 소스와 상호작용
}
```

## 관련 클래스

- [`AchievementSystem`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementSystem): 업적 시스템 관리자
- [`AchievementSheetData`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementSheetData): 업적 시트 데이터 모델
- [`AchievementSaveData`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementSaveData): 업적 저장 데이터 모델
- [`LocalAchievementDataSource`](/docs/projects/rfice/SlimeRush/AchievementSystem/LocalAchievementDataSource): 로컬 데이터 소스 구현체
- [`CloudSyncDataSource`](/docs/projects/rfice/SlimeRush/AchievementSystem/CloudSyncDataSource): 클라우드 데이터 소스 구현체

## 전체 코드

```csharp
using System;
using System.Collections.Generic;
using Reward.Entity;

namespace Reward
{
	public interface IAchievementInteractor
	{
		List<AchievementSheetData> LoadAchievementData();
		List<AchievementSaveData> LoadAchievementSaveData();
		void SaveAchievementData(List<AchievementSaveData> saveData);
		void ClearAchievementData(Action onClearCompleteCallBack = null);
	}
}
