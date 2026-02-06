+++
title = "CloudSyncDataSource"
description = "`IAchievementDataSource` 인터페이스를 구현하는 클라우드 데이터 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 201
+++
## 개요
`CloudSyncDataSource` 클래스는 SlimeRush 게임의 업적 시스템에서 [`IAchievementDataSource`](/docs/projects/SlimeRush/AchievementSystem/IAchievementDataSource)
인터페이스를 구현하는 클라우드 데이터 소스입니다. 이 클래스는 Steam 클라우드 저장소(Steam
Remote Storage)를 통해 업적 데이터를 저장하고 로드하며, 클라우드 동기화를 통해 여러 기기 간에 업적
진행 상황을 공유할 수 있도록 합니다. [Steamworks.NET](https://steamworks.github.io/) 라이브러리를 사용하여 Steam 클라우드와 상호작용합니다.

## 역할
- Steam 클라우드 저장소를 통한 데이터 저장
- Steam 클라우드 저장소를 통한 데이터 로드
- 클라우드 동기화 지원
- 오류 처리 및 로깅

## 선언
```csharp
public class CloudSyncDataSource : IAchievementDataSource
```

## 멤버
### 속성
```csharp
/// <summary>
/// Steam 클라우드 저장소에 업적 데이터를 저장할 때 사용하는 파일 키
/// </summary>
private const string KeySteamAchievementData = "AchievementData.json";
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

/// <summary>
/// 데이터 저장
/// </summary>
/// <param name="fileName">파일 이름</param>
/// <param name="saveDataJson">저장할 데이터</param>
private void SaveData(string fileName, string saveDataJson)

/// <summary>
/// 데이터 로드
/// </summary>
/// <param name="fileName">파일 이름</param>
/// <returns>로드된 데이터</returns>
private string LoadData(string fileName)
```

## 주요 코드 스니펫
### 데이터 저장
```csharp
// Steam 클라우드 저장소에 업적 데이터를 저장할 때 사용하는 파일 키
private const string KeySteamAchievementData = "AchievementData.json";

public void SaveAchievementData(string saveDataJson)
{
    // 업적 데이터를 Steam 클라우드 저장소에 저장하기 위해 내부 SaveData 메서드 호출
    SaveData(KeySteamAchievementData, saveDataJson);
}

private void SaveData(string fileName, string saveDataJson)
{
    // JSON 문자열을 UTF-8 바이트 배열로 변환
    var dataByte = Encoding.UTF8.GetBytes(saveDataJson);
    // Steam 클라우드 저장소에 파일 쓰기 시도
    var result = SteamRemoteStorage.FileWrite(fileName, dataByte, dataByte.Length);

    // 저장 결과에 따라 로그 기록
    if (result)
    {
        RLog.V($"[SteamCloudDataSource] Save {fileName} Success");
    }
    else
    {
        RLog.V($"[SteamCloudDataSource] Save {fileName} Fail");
    }
}
```

### 데이터 로드
```csharp
public string LoadAchievementSaveData()
{
    // Steam 클라우드 저장소에서 업적 데이터를 로드하기 위해 내부 LoadData 메서드 호출
    return LoadData(KeySteamAchievementData);
}

private string LoadData(string fileName)
{
    // 기본값으로 빈 문자열 초기화
    string saveDataJson = string.Empty;

    // 파일이 존재하는지 확인
    if (SteamRemoteStorage.FileExists(fileName))
    {
        // 파일 크기에 맞는 바이트 배열 생성
        var dataByte = new byte[SteamRemoteStorage.GetFileSize(fileName)];

        // 파일 읽기 시도
        if (SteamRemoteStorage.FileRead(fileName, dataByte, dataByte.Length) != 0)
        {
            // 읽기 성공 시 로그 기록 및 바이트 배열을 UTF-8 문자열로 변환
            RLog.V($"[SteamCloudDataSource] Load {fileName} Success");
            saveDataJson = Encoding.UTF8.GetString(dataByte);
        }
        else
        {
            // 읽기 실패 시 로그 기록
            RLog.V($"[SteamCloudDataSource] Load {fileName} Fail");
        }
    }
    else
    {
        // 파일이 존재하지 않을 경우 로그 기록
        RLog.V($"[SteamCloudDataSource] {fileName} Does Not Exist");
    }

    // 최종 결과 반환 (성공 시 데이터 문자열, 실패 시 빈 문자열)
    return saveDataJson;
}
```

## 기능 설명
### 클라우드 저장소 관리
- Steam Remote Storage 사용
- 클라우드 기반 데이터 저장
- 여러 기기 간 동기화 지원
- UTF-8 인코딩 사용
- 바이트 배열 변환

### 데이터 저장 프로세스
1. **데이터 변환**: JSON 문자열을 바이트 배열로 변환
2. **클라우드 쓰기**: `SteamRemoteStorage.FileWrite()` 호출
3. **결과 확인**: 저장 성공 여부 확인
4. **로그 출력**: 저장 결과 로그 출력

### 데이터 로드 프로세스
1. **파일 존재 확인**: `SteamRemoteStorage.FileExists(string)` 호출
2. **파일 크기 확인**: `SteamRemoteStorage.GetFileSize(string)` 호출
3. **데이터 읽기**: `SteamRemoteStorage.FileRead(string, byte[], int)` 호출
4. **데이터 변환**: 바이트 배열을 JSON 문자열로 변환
5. **로그 출력**: 로드 결과 로그 출력

## 의존성/상속 관계
- [`IAchievementDataSource`](/docs/projects/SlimeRush/AchievementSystem/IAchievementDataSource) 인터페이스를 구현
- [`Steamworks.NET`](https://steamworks.github.io/) 라이브러리를 통해 [`Steamworks API`](https://partner.steamgames.com/doc/sdk/api)사용

## 사용 예시
#### [`AchievementRepository`](/docs/projects/SlimeRush/AchievementSystem/AchievementRepository)에서 저장 및 로드시 사용
```csharp
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
```

## 관련 클래스
- [`IAchievementDataSource`](/docs/projects/SlimeRush/AchievementSystem/IAchievementDataSource)
- [`LocalAchievementDataSource`](/docs/projects/SlimeRush/AchievementSystem/LocalAchievementDataSource)
- [`AchievementRepository`](/docs/projects/SlimeRush/AchievementSystem/AchievementRepository)
- [`AchievementInteractor`](/docs/projects/SlimeRush/AchievementSystem/AchievementInteractor)