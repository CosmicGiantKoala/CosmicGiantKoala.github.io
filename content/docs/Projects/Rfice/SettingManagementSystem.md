+++
title = "세팅시스템"
# description = "Rfice 개요"
icon = "settings"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 305
+++

SettingsPresenter 완전 아키텍처 분석 (Clean Architecture)
1. 전체 아키텍처 레이어 구조
   1.1 Clean Architecture 기반 계층 구조``` mermaid
   graph TB
   A[Presentation Layer] --> B[Domain Layer] --> C[Data Layer]

   subgraph "Presentation Layer"
   A1[SettingsPresenter]
   A2[MobileSettingsPresenter]
   A3[CommonCommandController]
   end

   subgraph "Domain Layer"
   B1[ISettingsInteractor]
   B2[SettingsInteractor]
   B3[Business Logic]
   end

   subgraph "Data Layer"
   C1[Repository Pattern]
   C2[Local Storage]
   C3[External APIs]
   end
```

1.2 계층별 역할과 책임
Presentation Layer (프레젠테이션 레이어)

SettingsPresenter: 설정 관련 UI 상태 관리 및 이벤트 처리

MobileSettingsPresenter: 모바일 전용 설정 및 디바이스 적응

CommonCommandController: 외부 명령 및 시스템 레벨 통신
Domain Layer (도메인 레이어)

ISettingsInteractor: 설정 비즈니스 로직 인터페이스

SettingsInteractor: 구체적인 설정 비즈니스 로직 구현

Entities: 설정 도메인 모델들
Data Layer (데이터 레이어)
Repository 패턴을 통한 데이터 접근
로컬 저장소 (PlayerPrefs, JSON 등)
외부 API 통신
2. 핵심 컴포넌트 상세 분석
2.1 ISettingsInteractor (Domain Interface)``` csharp
// 추정 인터페이스 구조 (Clean Architecture 패턴)
public interface ISettingsInteractor
{
    // 이벤트 퍼블리싱
    event Action<bool> OnVideoChatStateChanged;
    event Action<bool> OnAudioZoneEnableChanged;
    event Action<float> OnBackgroundSoundVolumeChanged;
    event Action<PlayerCommunicationStatus> OnPlayerCommunicationStatusChanged;

    // 비즈니스 로직 메서드들
    bool GetVideoChatEnable();
    void SetVideoChatVideoEnable(bool enable);
    bool GetVideoChatVideoEnable();
    void SetVideoChatAudioEnable(bool enable);
    bool GetVideoChatAudioEnable();
    
    // 오디오존 관리
    void EnableAudioZone(bool enable);
    bool IsAudioZoneEnabled();
    void ActiveAudioZone(bool active);
    bool IsActiveAudioZone();
    
    // 배경음 관리
    void SetBackgroundSoundVolume(float volume);
    float GetBackgroundSoundVolume();
    void SetBackgroundSoundMute(bool mute);
    bool GetBackgroundSoundMute();
    
    // 모바일 컨트롤러 설정
    void SetMobileControllerScale(MobileControllerMoveUIScale scale);
    MobileControllerMoveUIScale GetMobileControllerScale();
}
```

2.2 SettingsInteractor (Domain Implementation)``` csharp
// 추정 구현 구조
public class SettingsInteractor : ISettingsInteractor, IDisposable, IInitializable
{
// Repository 의존성
private ISettingsRepository _settingsRepository;
private IDeviceRepository _deviceRepository;

    // 도메인 서비스들
    private IAudioZoneService _audioZoneService;
    private IVideoChatService _videoChatService;
    
    public void Initialize()
    {
        // 초기화 로직
        LoadSettingsFromRepository();
        SetupEventHandlers();
    }
    
    public bool GetVideoChatEnable()
    {
        return _settingsRepository.GetBool("VideoChat.Enable", false);
    }
    
    public void SetVideoChatVideoEnable(bool enable)
    {
        _settingsRepository.SetBool("VideoChat.Video.Enable", enable);
        OnVideoChatStateChanged?.Invoke(enable);
    }
    
    public void Dispose()
    {
        // 리소스 정리
    }
}
```

3. CommonCommandController 상세 분석
3.1 External Command Pattern 구현``` csharp
public class CommonCommandController : MonoBehaviour
{
    // 외부 시스템과의 통신 이벤트들
    public event Action<DeviceStatus> OnDeviceStatus;
    public event Action<GraphicQualityState> OnGraphicQualityState;
    public event Action<MobileControllerTypePayload> OnMobileControllerTypeChange;
    public event Action<MobileControllerScalePayload> OnMobileControllerScaleChange;
    public event Action<MobileControllerAlignPayload> OnMobileControllerAlignChange;
    public event Action<DeviceMarginPayload> OnDeviceMarginChanged;
    
    // WebGL/Native 플러그인과의 통신
    public void SendCommandToExternal(string command, object payload)
    {
        // 외부 시스템으로 명령 전송
    }
    
    // 외부에서 받은 이벤트 처리
    public void OnExternalEvent(string eventType, string payload)
    {
        switch (eventType)
        {
            case "DeviceStatus":
                var deviceStatus = JsonUtility.FromJson<DeviceStatus>(payload);
                OnDeviceStatus?.Invoke(deviceStatus);
                break;
            case "GraphicQualityState":
                var qualityState = JsonUtility.FromJson<GraphicQualityState>(payload);
                OnGraphicQualityState?.Invoke(qualityState);
                break;
        }
    }
}
```

4. 데이터 흐름 분석
   4.1 설정 변경 데이터 플로우``` mermaid
   sequenceDiagram
   participant UI as UI Component
   participant SP as SettingsPresenter
   participant SI as SettingsInteractor
   participant Repo as Settings Repository
   participant CCC as CommonCommandController
   participant Ext as External System

   UI->>SP: SetVideoChatVideoEnable(true)
   SP->>SI: SetVideoChatVideoEnable(true)
   SI->>Repo: SaveSetting("VideoChat.Video", true)
   SI->>SI: OnVideoChatStateChanged.Invoke(true)
   SI-->>SP: Event Callback
   SP->>SP: OnVideoEnableChanged.Invoke(true)
   SP-->>UI: UI Update

   Note over CCC,Ext: 외부 디바이스 상태 동기화
   Ext->>CCC: DeviceStatus Event
   CCC->>SP: OnDeviceStatus Event
   SP->>SI: SetDeviceInfoInitialized(true)
   SP->>SP: SetupDeviceRealTimeStatus()
```

4.2 Mobile Settings 특화 플로우``` mermaid
sequenceDiagram
    participant MSP as MobileSettingsPresenter
    participant SI as SettingsInteractor
    participant CCC as CommonCommandController
    participant Canvas as Unity Canvas
    participant Native as Native Layer

    Native->>CCC: OnDeviceMarginChanged
    CCC->>MSP: DeviceMarginPayload
    MSP->>MSP: _payload = payload
    MSP->>MSP: OnScreenMarginChanged.Invoke()
    
    Canvas->>MSP: GetScreenMargin(canvas)
    MSP->>MSP: Calculate Screen Margins
    MSP->>Canvas: Return Adjusted Margins
```

5. 주요 디자인 패턴 적용
   5.1 Repository Pattern (데이터 레이어)``` csharp
   public interface ISettingsRepository
   {
   T GetValue<T>(string key, T defaultValue);
   void SetValue<T>(string key, T value);
   void Save();
   event Action<string, object> OnValueChanged;
   }

public class SettingsRepository : ISettingsRepository
{
private Dictionary<string, object> _cache = new();

    public T GetValue<T>(string key, T defaultValue)
    {
        if (_cache.ContainsKey(key))
            return (T)_cache[key];
        
        // PlayerPrefs나 JSON 파일에서 로드
        var value = LoadFromPersistence<T>(key, defaultValue);
        _cache[key] = value;
        return value;
    }
    
    public void SetValue<T>(string key, T value)
    {
        _cache[key] = value;
        SaveToPersistence(key, value);
        OnValueChanged?.Invoke(key, value);
    }
}
```

5.2 Command Pattern (외부 통신)``` csharp
public abstract class ExternalCommand
{
    public abstract void Execute();
    public abstract void Undo();
}

public class DeviceStatusCommand : ExternalCommand
{
    private DeviceStatus _status;
    private SettingsPresenter _presenter;
    
    public override void Execute()
    {
        _presenter.OnDeviceStatusEvent(_status);
    }
}
```

6. 모바일 최적화 아키텍처
   6.1 MobileSettingsPresenter 전용 기능``` csharp
   public class MobileSettingsPresenter : MonoBehaviour, IScreenMarginEvent
   {
   // 디바이스별 화면 여백 계산
   public IScreenMarginEvent.ScreenMargin GetScreenMargin(Canvas canvas, bool useHeaderHeight = true)
   {
   // 1. 스크린 해상도 확인
   var screenResolution = _payload.screenResolution;

        // 2. 캔버스 스케일러 정보 획득
        var scaler = canvas.GetComponent<CanvasScaler>();
        var renderingDisplaySize = GetRenderingDisplaySize(canvas, scaler);
        
        // 3. 비율 계산으로 정확한 여백 계산
        var headerHeight = (useHeaderHeight) ? _payload.headerHeight : 0.0f;
        return new IScreenMarginEvent.ScreenMargin(
            (_payload.topMargin + headerHeight) * renderingDisplaySize.y / screenResolution.height,
            _payload.leftMargin * renderingDisplaySize.x / screenResolution.width,
            _payload.bottomMargin * renderingDisplaySize.y / screenResolution.height,
            _payload.rightMargin * renderingDisplaySize.x / screenResolution.width);
   }
   }
```

7. 포트폴리오 핵심 기술 요소
7.1 Clean Architecture 구현
계층 분리: Presentation → Domain → Data
의존성 역전: 인터페이스 기반 설계
단일 책임 원칙: 각 클래스의 명확한 역할 분담
7.2 확장 가능한 이벤트 시스템
Observer Pattern: 느슨한 결합 구현
Event Aggregator: 중앙화된 이벤트 관리
메모리 안전성: 완벽한 구독/해제 패턴
7.3 플랫폼 특화 대응
모바일 최적화: 화면 비율, 터치 인터페이스 대응
Cross-Platform: WebGL, Native 플러그인 통합
실시간 동기화: 외부 디바이스 상태와 Unity 내부 상태
7.4 Enterprise 급 설계
DI Container: Zenject 기반 의존성 관리
Repository Pattern: 데이터 접근 추상화
Command Pattern: 외부 시스템 통신 표준화
이 구조는 대규모 멀티미디어 플랫폼에서 복잡한 설정 시스템을 효율적으로 관리하는 엔터프라이즈급 아키텍처의 완벽한 사례입니다.






----------------------------------

SettingsPresenter 아키텍처 분석
1. 전체 구조 개요
SettingsPresenter는 MVP(Model-View-Presenter) 패턴의 Presenter 역할을 하는 핵심 컴포넌트입니다. Unity의 설정 관리를 중앙화하고, 다양한 시스템 간의 상태 동기화를 담당합니다.
2. 의존성 주입 구조 (DI Architecture)``` csharp
[Inject] private ISettingsInteractor _settingsInteractor;
[Inject(Optional = true)] private IVideoChatInteractor _videoChatInteractor;
[Inject] private CommonCommandController _commonCommandController;
```

Zenject 기반 의존성 주입을 통해 느슨한 결합을 구현했습니다.
3. 이벤트 중심 아키텍처 (Event-Driven Architecture)
   3.1 발행 이벤트 (Publisher Events)``` csharp
   public event Action<bool> OnVideoChatEnableChanged;
   public event Action<bool> OnAudioZoneEnableChanged;
   public event Action<float> OnBackgroundSoundVolumeChangedEvent;
   public event Action<PlayerCommunicationStatus> OnPlayerCommunicationStatusChanged;
```

3.2 구독 이벤트 (Subscriber Events)``` csharp
// Settings Interactor 구독
_settingsInteractor.OnAudioZoneEnableChanged += OnAudioZoneEnableChangedEvent;
_settingsInteractor.OnVideoChatStateChanged += OnUpdateVideoChatEnable;

// VideoChat Interactor 구독
_videoChatInteractor.OnEnableChanged += OnUpdateVideoChatEnable;
_videoChatInteractor.OnVideoEnableChanged += OnVideoEnableChangedEvent;

// External Command 구독
_commonCommandController.OnDeviceStatus += OnDeviceStatusEvent;
```

4. 핵심 기능 분석
   4.1 비디오챗 상태 관리``` csharp
   public bool GetVideoChatEnable()
   {
   var isSettingsEnable = _settingsInteractor.GetVideoChatEnable();
   var isVideoChatActive = _videoChatInteractor?.GetEnable() ?? false;
   return isSettingsEnable && isVideoChatActive;  // AND 연산으로 최종 상태 결정
   }
```

핵심: 두 개의 독립적인 상태를 AND 연산으로 결합하여 최종 활성화 여부를 결정
4.2 디바이스 상태 실시간 동기화``` csharp
private void OnDeviceStatusEvent(DeviceStatus status)
{
    _settingsInteractor.SetDeviceInfoInitialized(true);
    SetDeviceAvailable(status);          // 디바이스 가용성 설정
    SetupDeviceRealTimeStatus(status);   // 실시간 상태 동기화
}

private void SetupDeviceRealTimeStatus(DeviceStatus status)
{
    SetVideoChatVideoEnable(status.payload.camera.state);
    SetVideoChatAudioEnable(status.payload.microphone.state);
}
```

4.3 오디오존 관리 시스템``` csharp
/// <summary>
/// SceneType이 Space일 경우 "오디오존 사용 불가" 옵션
/// </summary>
public void ActiveAudioZone(bool activeAudioZone)
{
_settingsInteractor.ActiveAudioZone(activeAudioZone);
OnAudioZoneActiveChanged?.Invoke(activeAudioZone);
}
```

5. 연관된 코드들과의 관계도
5.1 MobileSettingsPresenter 관계``` mermaid
graph TD
    A[SettingsPresenter] --> B[ISettingsInteractor]
    C[MobileSettingsPresenter] --> B
    A --> D[CommonCommandController]
    C --> D
    D --> E[External Commands]
```

공통점: 같은 ISettingsInteractor와 CommonCommandController 의존성 공유 차이점: MobileSettingsPresenter는 모바일 특화 UI 설정 담당
5.2 NetworkedScreen과의 연관성``` csharp
// NetworkedScreen.cs에서 SettingsPresenter 사용
[Inject] private SettingsPresenter _settingsPresenter;

// 오디오존 상태에 따른 비디오챗 영역 결정
if (_settingsPresenter.IsActiveAudioZone() && roomType != BaseScene.MeetingRoomScene)
{
_videoChatArea = _networkedScreenHandler.GetTargetVideoChatArea();
}
```

6. 핵심 디자인 패턴
6.1 Observer Pattern (옵저버 패턴)``` csharp
private void OnAudioZoneEnableChangedEvent(bool isEnabled)
{
    OnAudioZoneEnableChanged?.Invoke(isEnabled);  // 이벤트 재발행
}
```

6.2 Facade Pattern (파사드 패턴)
SettingsPresenter는 여러 복잡한 하위 시스템들을 하나의 간단한 인터페이스로 통합
6.3 Command Pattern (커맨드 패턴)``` csharp
public void SetBackgroundSoundVolume(float volume)
{
_settingsInteractor.SetBackgroundSoundVolume(volume);
}
```

7. 라이프사이클 관리
7.1 초기화 (Awake)
모든 이벤트 구독 등록
의존성 주입된 객체들과 연결 설정
7.2 정리 (OnDestroy)
메모리 누수 방지를 위한 이벤트 구독 해제
완전한 대칭적 정리 구조
8. 포트폴리오 핵심 포인트
8.1 기술적 강점
SOLID 원칙 준수: 단일 책임, 의존성 역전 원칙 적용
Clean Architecture: 계층화된 의존성 구조
이벤트 중심 설계: 느슨한 결합과 높은 확장성
메모리 관리: 완벽한 이벤트 구독/해제 패턴
8.2 실무적 가치
중앙화된 설정 관리: 모든 설정을 하나의 지점에서 관리
실시간 동기화: 외부 디바이스 상태와 Unity 내부 상태 동기화
확장성: 새로운 설정 추가가 용이한 구조
디버깅 편의성: Unity Editor용 테스트 메서드 제공