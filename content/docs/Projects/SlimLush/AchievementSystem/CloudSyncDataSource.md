# CloudSyncDataSource

## 개요

`CloudSyncDataSource` 클래스는 SlimeRush 게임의 업적 시스템에서 `IAchievementDataSource` 인터페이스를 구현하는 클라우드 데이터 소스입니다. 이 클래스는 Steam 클라우드 저장소(Steam Remote Storage)를 통해 업적 데이터를 저장하고 로드하며, 클라우드 동기화를 통해 여러 기기 간에 업적 진행 상황을 공유할 수 있도록 합니다. Steamworks.NET 라이브러리를 사용하여 Steam 클라우드와 상호작용합니다.

## 역할

- Steam 클라우드 저장소를 통한 데이터 저장
- Steam 클라우드 저장소를 통한 데이터 로드
- 클라우드 동기화 지원
- 오류 처리 및 로깅

## 멤버

### 상수

```csharp
/// <summary>
/// Steam 클라우드 저장소 키
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
```

### 내부 메서드

```csharp
/// <summary>
/// 데이터 저장 (내부 사용)
/// </summary>
/// <param name="fileName">파일 이름</param>
/// <param name="saveDataJson">저장할 데이터</param>
private void SaveData(string fileName, string saveDataJson)

/// <summary>
/// 데이터 로드 (내부 사용)
/// </summary>
/// <param name="fileName">파일 이름</param>
/// <returns>로드된 데이터</returns>
private string LoadData(string fileName)
```

## 주요 코드 스니펫

### 데이터 저장

```csharp
public void SaveAchievementData(string saveDataJson)
{
    SaveData(KeySteamAchievementData, saveDataJson);
}

private void SaveData(string fileName, string saveDataJson)
{
    var dataByte = Encoding.UTF8.GetBytes(saveDataJson);
    var result = SteamRemoteStorage.FileWrite(fileName, dataByte, dataByte.Length);

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
    return LoadData(KeySteamAchievementData);
}

private string LoadData(string fileName)
{
    string saveDataJson = string.Empty;
    if (SteamRemoteStorage.FileExists(fileName))
    {
        var dataByte = new byte[SteamRemoteStorage.GetFileSize(fileName)];

        if (SteamRemoteStorage.FileRead(fileName, dataByte, dataByte.Length) != 0)
        {
            RLog.V($"[SteamCloudDataSource] Load {fileName} Success");
            saveDataJson = Encoding.UTF8.GetString(dataByte);
        }
        else
        {
            RLog.V($"[SteamCloudDataSource] Load {fileName} Fail");
        }
    }
    else
    {
        RLog.V($"[SteamCloudDataSource] {fileName} Does Not Exist");
    }

    return saveDataJson;
}
```

## 기능 설명

### 클라우드 저장소 관리

- Steam Remote Storage 사용
- 클라우드 기반 데이터 저장
- 여러 기기 간 동기화 지원

### 데이터 인코딩/디코딩

- UTF-8 인코딩 사용
- 바이트 배열 변환
- 문자열 변환

### 오류 처리

- 파일 존재 여부 확인
- 읽기/쓰기 오류 처리
- 로깅을 통한 오류 추적

### Steamworks 통합

- Steam Remote Storage API 사용
- Steam 클라우드 기능 활용
- Steam 사용자 계정 연동

## 의존성/상속 관계

- `IAchievementDataSource` 인터페이스 구현
- `Steamworks.NET` 라이브러리에 의존
- `Common.Tools` 네임스페이스 사용 (로깅)
- `Reward.Data` 네임스페이스 사용

## 사용 예시

### AchievementRepository에서 사용

```csharp
// 의존성 주입을 통한 사용
[Inject]
private IAchievementDataSource _achievementDataSource;

// 데이터 저장
_achievementDataSource.SaveAchievementData(jsonData);

// 데이터 로드
string loadedData = _achievementDataSource.LoadAchievementSaveData();
```

### 클라우드 동기화 흐름

```csharp
// 로컬 데이터 변경 → 클라우드 저장 → 다른 기기에서 클라우드 로드 흐름
var saveDataJson = JsonConvert.SerializeObject(saveData);
_cloudSyncDataSource.SaveAchievementData(saveDataJson);
// 다른 기기에서...
string loadedJson = _cloudSyncDataSource.LoadAchievementSaveData();
var loadedData = JsonConvert.DeserializeObject<List<AchievementSaveData>>(loadedJson);
```

## 관련 클래스

- [`IAchievementDataSource`](/docs/projects/rfice/SlimeRush/AchievementSystem/IAchievementDataSource): 구현하는 인터페이스
- [`LocalAchievementDataSource`](/docs/projects/rfice/SlimeRush/AchievementSystem/LocalAchievementDataSource): 로컬 데이터 소스
- [`AchievementRepository`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementRepository): 데이터 저장소
- [`AchievementInteractor`](/docs/projects/rfice/SlimeRush/AchievementSystem/AchievementInteractor): 데이터 인터랙터

## 전체 코드

```csharp
using System.Text;
using Common.Tools;
using Reward.Data;

namespace Steamworks.NET.CloudSync
{
	public class CloudSyncDataSource : IAchievementDataSource
	{
		private const string KeySteamAchievementData = "AchievementData.json";

		#region Achievement

		public void SaveAchievementData(string saveDataJson)
		{
			SaveData(KeySteamAchievementData, saveDataJson);
		}

		public string LoadAchievementSaveData()
		{
			return LoadData(KeySteamAchievementData);
		}

		#endregion

		private void SaveData(string fileName, string saveDataJson)
		{
			var dataByte = Encoding.UTF8.GetBytes(saveDataJson);
			var result = SteamRemoteStorage.FileWrite(fileName, dataByte, dataByte.Length);

			if (result)
			{
				RLog.V($"[SteamCloudDataSource] Save {fileName} Success");
			}
			else
			{
				RLog.V($"[SteamCloudDataSource] Save {fileName} Fail");
			}
		}

		private string LoadData(string fileName)
		{
			string saveDataJson = string.Empty;
			if (SteamRemoteStorage.FileExists(fileName))
			{
				var dataByte = new byte[SteamRemoteStorage.GetFileSize(fileName)];

				if (SteamRemoteStorage.FileRead(fileName, dataByte, dataByte.Length) != 0)
				{
					RLog.V($"[SteamCloudDataSource] Load {fileName} Success");
					saveDataJson = Encoding.UTF8.GetString(dataByte);
				}
				else
				{
					RLog.V($"[SteamCloudDataSource] Load {fileName} Fail");
				}
			}
			else
			{
				RLog.V($"[SteamCloudDataSource] {fileName} Does Not Exist");
			}

			return saveDataJson;
		}
	}
}
