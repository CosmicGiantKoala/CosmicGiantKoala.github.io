# LocalAchievementDataSource

## 개요

`LocalAchievementDataSource` 클래스는 SlimeRush 게임의 업적 시스템에서 `IAchievementDataSource` 인터페이스를 구현하는 로컬 데이터 소스입니다. 이 클래스는 로컬 파일 시스템을 통해 업적 데이터를 저장하고 로드하며, JSON 형식의 데이터를 Unity의 영구 저장소 경로에 저장합니다. 로컬 저장소로의 데이터 영속성을 제공하며, 오프라인 환경에서도 업적 진행 상황을 유지할 수 있도록 합니다.

## 역할

- 로컬 파일 시스템을 통한 데이터 저장
- 로컬 파일 시스템을 통한 데이터 로드
- 파일 입출력 오류 처리
- 로컬 저장소 경로 관리

## 멤버

### 상수

```csharp
/// <summary>
/// 로컬 저장 파일 이름
/// </summary>
private const string LocalAchievementDataPath = "AchievementData.json";
```

### 내부 필드

```csharp
/// <summary>
/// 완전한 데이터 파일 경로
/// </summary>
private readonly string _dataPath = Path.Combine(Application.persistentDataPath, LocalAchievementDataPath);
```

### 메서드

```csharp
/// <summary>
/// 업적 저장 데이터 로드
/// </summary>
/// <returns>저장된 데이터 문자열 (JSON 형식)</returns>
public string LoadAchievementSaveData()

/// <summary>
/// 업적 데이터 저장
/// </summary>
/// <param name="saveData">저장할 데이터 문자열 (JSON 형식)</param>
public void SaveAchievementData(string saveData)
```

## 주요 코드 스니펫

### 데이터 로드

```csharp
public string LoadAchievementSaveData()
{
    RLog.V($"[LocalAchievementDataSystem] Load AchievementData");
    string saveData = string.Empty;
    if (File.Exists(_dataPath))
    {
        saveData = File.ReadAllText(_dataPath);
    }

    return saveData;
}
```

### 데이터 저장

```csharp
public void SaveAchievementData(string saveData)
{
    RLog.V($"[LocalAchievementDataSystem] Save AchievementData");
    try
    {
        File.WriteAllText(_dataPath, saveData);
    }
    catch
    {
        RLog.V($"[LocalAchievementDataSystem] Save AchievementData Fail");
    }
}
```

### 파일 경로 설정

```csharp
private readonly string _dataPath = Path.Combine(Application.persistentDataPath, LocalAchievementDataPath);
```

## 기능 설명

### 로컬 저장소 관리

- Unity의 영구 저장소 경로 사용
- 플랫폼별 적절한 경로 자동 설정
- 파일 시스템 접근 추상화

### 데이터 영속성

- JSON 형식의 데이터 저장
- 파일 기반 영구 저장
- 게임 세션 간 데이터 유지

### 오류 처리

- 파일 읽기/쓰기 오류 처리
- 로깅을 통한 오류 추적
- 안정적인 데이터 처리

### 간단한 인터페이스

- 문자열 기반 데이터 입출력
- 직렬화/역직렬화는 상위 계층에서 처리
- 유연한 데이터 형식 지원

## 의존성/상속 관계

- `IAchievementDataSource` 인터페이스 구현
- `System.IO` 네임스페이스 사용 (파일 입출력)
- `Common.Tools` 네임스페이스 사용 (로깅)
- `UnityEngine` 네임스페이스 사용 (영구 저장소 경로)

## 사용 예시

### AchievementInteractor에서 사용

```csharp
// 의존성 주입을 통한 사용
[Inject]
private IAchievementDataSource _achievementDataSource;

// 데이터 저장
_achievementDataSource.SaveAchievementData(jsonData);

// 데이터 로드
string loadedData = _achievementDataSource.LoadAchievementSaveData();
```

### 데이터 흐름

```csharp
// JSON 직렬화 → 로컬 저장 → JSON 역직렬화 흐름
var saveDataJson = JsonConvert.SerializeObject(saveData);
_localAchievementDataSource.SaveAchievementData(saveDataJson);
// ...
string loadedJson = _localAchievementDataSource.LoadAchievementSaveData();
var loadedData = JsonConvert.DeserializeObject<List<AchievementSaveData>>(loadedJson);
```

## 관련 클래스

- [`IAchievementDataSource`](/docs/projects/rfice/SlimeRush/AchievementSystem/IAchievementDataSource): 구현하는 인터페이스
- [`AchievementInteractor`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementInteractor): 데이터 인터랙터
- [`AchievementRepository`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementRepository): 데이터 저장소
- [`CloudSyncDataSource`](/docs/projects/rfice/SlimeRush/AchievementSystem/CloudSyncDataSource): 클라우드 데이터 소스

## 전체 코드

```csharp
using System.IO;
using Common.Tools;
using UnityEngine;

namespace Reward.Data
{
    public class LocalAchievementDataSource : IAchievementDataSource
    {
        private const string LocalAchievementDataPath = "AchievementData.json";
        private readonly string _dataPath = Path.Combine(Application.persistentDataPath, LocalAchievementDataPath);

        public string LoadAchievementSaveData()
        {
            RLog.V($"[LocalAchievementDataSystem] Load AchievementData");
            string saveData = string.Empty;
            if (File.Exists(_dataPath))
            {
                saveData = File.ReadAllText(_dataPath);
            }

            return saveData;
        }

        public void SaveAchievementData(string saveData)
        {
            RLog.V($"[LocalAchievementDataSystem] Save AchievementData");
            try
            {
                File.WriteAllText(_dataPath, saveData);
            }
            catch
            {
                RLog.V($"[LocalAchievementDataSystem] Save AchievementData Fail");
            }
        }
    }
}
