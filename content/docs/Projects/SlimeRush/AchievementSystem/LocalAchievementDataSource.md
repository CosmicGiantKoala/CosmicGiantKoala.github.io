+++
title = "LocalAchievementDataSource"
description = "업적 시스템에서 `IAchievementDataSource` 인터페이스를 구현하는 로컬 데이터 소스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 201
+++
## 개요
`LocalAchievementDataSource` 클래스는 SlimeRush 게임의 업적 시스템에서 `IAchievementDataSource` 인터페이스를 구현하는 로컬 데이터 소스입니다. 이 클래스는 로컬 파일 시스템을 통해 업적 데이터를 저장하고 로드하며, JSON 형식의 데이터를 Unity의 영구 저장소 경로에 저장합니다. 로컬 저장소로의 데이터 영속성을 제공하며, 오프라인 환경에서도 업적 진행 상황을 유지할 수 있도록 합니다.

## 역할
- 로컬 파일 시스템을 통한 데이터 저장
- 로컬 파일 시스템을 통한 데이터 로드
- 파일 입출력 오류 처리
- 로컬 저장소 경로 관리
- 파일 I/O 관리

## 멤버
```csharp
/// <summary>
/// 로컬 저장 파일 이름
/// </summary>
private const string LocalAchievementDataPath = "AchievementData.json";

/// <summary>
/// 완전한 데이터 파일 경로
/// </summary>
private readonly string _dataPath = Path.Combine(Application.persistentDataPath, LocalAchievementDataPath);
```

### 메서드

```csharp
/// <summary>
/// 업적 저장 데이터를 로드합니다.
/// </summary>
/// <returns>업적 저장 데이터 JSON 문자열</returns>
public string LoadAchievementSaveData()

/// <summary>
/// 업적 데이터를 저장합니다.
/// </summary>
/// <param name="saveData">저장할 업적 데이터 JSON 문자열</param>
public void SaveAchievementData(string saveData)
```

## 주요 코드 스니펫
### 데이터 로드
```csharp
public string LoadAchievementSaveData()
{
    // 업적 데이터 로드 시작을 로그로 출력합니다
    RLog.V($"[LocalAchievementDataSystem] Load AchievementData");
    // 기본값으로 빈 문자열을 설정합니다
    string saveData = string.Empty;
    // 저장 파일이 존재하는지 확인합니다
    if (File.Exists(_dataPath))
    {
        // 파일이 존재하면 모든 내용을 읽어옵니다
        saveData = File.ReadAllText(_dataPath);
    }

    // 읽은 데이터를 반환합니다 (파일이 없으면 빈 문자열이 반환됩니다)
    return saveData;
}
```

### 데이터 저장
```csharp
public void SaveAchievementData(string saveData)
{
    // 업적 데이터 저장 시작을 로그로 출력합니다
    RLog.V($"[LocalAchievementDataSystem] Save AchievementData");
    try
    {
        // JSON 문자열 데이터를 파일로 저장합니다
        File.WriteAllText(_dataPath, saveData);
    }
    catch
    {
        // 파일 저장 중 오류가 발생하면 실패 로그를 출력합니다
        RLog.V($"[LocalAchievementDataSystem] Save AchievementData Fail");
    }
}
```

## 기능 설명
### 로컬 저장소 관리
- Unity의 영구 저장소 경로 사용
- 플랫폼별 적절한 경로 자동 설정
- 파일 시스템 접근 추상화

### 파일 시스템 관리
- **파일 경로**: Application.persistentDataPath에 저장
- **파일 이름**: AchievementData.json
- **파일 형식**: JSON 텍스트 파일

### 데이터 저장 프로세스
1. **로그 출력**: 데이터 저장 시작 로그
2. **파일 쓰기**: JSON 데이터 파일로 쓰기
3. **예외 처리**: 파일 쓰기 실패 시 예외 처리
4. **로그 출력**: 저장 실패 시 실패 로그

### 데이터 로드 프로세스
1. **로그 출력**: 데이터 로드 시작 로그
2. **파일 존재 확인**: 파일 존재 여부 확인
3. **파일 읽기**: 파일 존재 시 전체 내용 읽기
4. **데이터 반환**: 읽은 데이터 또는 빈 문자열 반환

### 간단한 인터페이스
- 문자열 기반 데이터 입출력
- 직렬화/역직렬화는 상위 계층에서 처리
- 유연한 데이터 형식 지원

## 의존성/상속 관계
- `IAchievementDataSource` 인터페이스 구현
- `System.IO` 네임스페이스 사용 (파일 입출력)

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

- [`IAchievementDataSource`](/docs/projects/rfice/SlimeRush/AchievementSystem/IAchievementDataSource)
- [`AchievementInteractor`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementInteractor)
- [`AchievementRepository`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementRepository)
- [`CloudSyncDataSource`](/docs/projects/rfice/SlimeRush/AchievementSystem/CloudSyncDataSource)