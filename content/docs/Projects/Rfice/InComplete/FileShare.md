+++
title = "실시간 파일 공유 오브젝트 기능(작성중)"
# description = "Rfice 개요"
icon = "connected_tv"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 304
+++

# NetworkedScreen 기능 상세 분석 및 정리
## 1. 개요
NetworkedScreen은 Unity 메타버스 환경에서 다중 사용자가 실시간으로 화면을 공유하고 상호작용할 수 있는 네트워크 기반 스크린 시스템입니다. Fusion 네트워킹을 통해 동기화되며, 화면 공유, 파일 뷰어, 비디오 채팅 등의 기능을 제공합니다.
## 2. 시스템 아키텍처
### 2.1 핵심 구성 요소```
NetworkedScreenManager (관리자)
├── NetworkedScreenHandler (핸들러)
│   └── NetworkedScreen (네트워크 오브젝트)
│       ├── UI Handler (사용자 인터페이스)
│       ├── File Viewers (파일 뷰어들)
│       └── Display System (화면 출력)
└── NetworkedScreenShareManager (공유 관리자)
```

3. 핵심 클래스 분석
3.1 NetworkedScreenManager
역할: 전체 시스템의 중앙 관리자``` csharp
// 핵심 코드 분석
public void AddNetworkedScreenHandler(NetworkedScreenHandler handler)
{
    if (_handlers.TryAdd(handler.UniqueId, handler))
    {
        handler.OnDeSpawnedNetworkedScreen += OnDeSpawnedNetworkedScreen;
    }

    if (!_rficeNetwork.IsMasterClient()) return;
    
    if (_isMyRoom)
    {
        Debug.Log($"####### MyRoomSpawn {handler.gameObject.name}");
        Spawn(handler, _myRoomClientInfo);
    }
    else
    {
        Spawn(handler);
    }
}
```

주요 기능:
스크린 핸들러 등록 및 관리
네트워크 스폰/디스폰 제어
비디오채팅 연동
방 타입별 차별화 처리 (MyRoom vs 일반 Room)
3.2 NetworkedScreenHandler
역할: 개별 스크린의 생명주기 관리``` csharp
public void Spawn(IRficeVideoRoom.ClientInfo clientInfo = default)
{
if (IsSpawned) return;
_spawnedNetworkedScreen = _rficeNetwork.Spawn(_networkedScreenManager.NetworkedScreenPrefab)
.GetComponent<INetworkedScreen>();
_spawnedNetworkedScreen.ScreenReady(UniqueId, clientInfo);
}
```

핵심 기능:
VideoChatArea와 연결 관리
NetworkedScreen 인스턴스 생성/삭제
고유 ID 기반 스크린 식별
3.3 NetworkedScreen (핵심 클래스)
역할: 실제 스크린 기능 구현 및 네트워크 동기화
네트워크 상태 동기화``` csharp
[Networked]
[SerializeField]
private ref NetworkedScreenInfo NetworkedScreenInfo => ref MakeRef<NetworkedScreenInfo>();

public override void Render()
{
    foreach (var change in _changes.DetectChanges(this))
    {
        switch (change)
        {
            case nameof(NetworkedScreenInfo):
                OnChangedNetworkedScreenViewerInfo();
                break;
        }
    }
}
```

컨텐츠 추가 및 뷰어 관리``` csharp
private void AddToScreen(IFloatingDataInfo dataInfo)
{
if (_isSpawned == false) return;
_currentDataInfo = dataInfo;

    var viewerType = GetViewerType(_currentDataInfo.FloatingDataType);
    
    if (IsFileType(viewerType))
    {
        _fileDataInfo = (FloatingFileDataInfo)_currentDataInfo;
        SetViewerData(
            activeViewer: viewerType,
            shareActor: _currentDataInfo.ActorNumber,
            dataId: _currentDataInfo.DataID,
            fileboxInfo: new NetworkedFileBoxInfo(...));
    }
    else
    {
        SetViewerData(
            activeViewer: viewerType,
            shareActor: _currentDataInfo.ActorNumber,
            dataId: _currentDataInfo.DataID,
            fileboxInfo: new NetworkedFileBoxInfo());
        _screenSharingUser = true;
    }

    ChangeViewerState();
}
```

4. 주요 기능 분석
4.1 멀티 뷰어 시스템``` csharp
public enum ActiveViewer
{
    None = 0,
    DisplayShare = 1<<1,    // 화면 공유
    WhiteBoard = 1<<2,      // 화이트보드
    Image = 1<<3,           // 이미지 뷰어
    Video = 1<<4,           // 비디오 뷰어
    Document = 1<<5,        // 문서 뷰어
    FileType = Image | Video | Document,        // 파일 타입
    NonFileType = DisplayShare | WhiteBoard     // 비파일 타입
}
```

4.2 실시간 권한 관리``` csharp
private IEnumerator CoRequestAuthority(Action requestCallback)
{
GetNetworkObject().RequestStateAuthority();
yield return new WaitUntil(() => HasStateAuthority);
requestCallback?.Invoke();
}
```

4.3 화면 공유 권한 시스템``` csharp
private IEnumerator RequestDisplayActorAuthority(string requestShareActorNumber)
{
    var joinedUser = _videoChatManager.GetAllClientsActorNum().ConvertAll(x => x.ToString()).ToArray();
    yield return new WaitUntil(() => 
        _screenShareUserIsNotNull && NetworkedScreenInfo.ShareActor.ToString() == requestShareActorNumber);
    
    _displayShareChannel.RequestDisplayActorAuthority(
        displayGameObject.GetActorId(),
        joinedUser,
        int.Parse(NetworkedScreenInfo.ShareActor.ToString()));
}
```

5. 기술적 특징
   5.1 네트워크 최적화
   Change Detection: 상태 변화 감지를 통한 효율적인 업데이트
   Authority System: 권한 기반 상태 수정 제어
   Lazy Loading: 필요시점에만 컴포넌트 로드
   5.2 비동기 처리 패턴
   Coroutine 기반: 네트워크 대기 상황 처리
   Event-Driven: 콜백 기반 느슨한 결합
   State Machine: 명확한 상태 전환 관리
   5.3 플랫폼 대응``` csharp
   #if UNITY_WEBGL
   _targetButtonUI = webButton;
   _isMobileUI = false;
   #elif UNITY_ANDROID || UNITY_IOS
   _targetButtonUI = mobileButton;
   _isMobileUI = true;
   #endif
```

6. 포트폴리오 핵심 포인트
6.1 기술적 역량
멀티플레이어 네트워킹: Fusion을 활용한 실시간 동기화
아키텍처 설계: 관심사 분리와 모듈화된 구조
상태 관리: 복잡한 네트워크 상태의 일관성 보장
6.2 사용자 경험
크로스 플랫폼: 웹, 모바일 환경별 최적화된 UI
실시간 협업: 다중 사용자 동시 상호작용
다양한 미디어: 이미지, 비디오, 문서 등 통합 지원
6.3 비즈니스 가치
확장성: 새로운 뷰어 타입 쉽게 추가 가능
안정성: 네트워크 연결 끊김, 권한 충돌 등 예외 상황 처리
성능: 효율적인 리소스 관리와 메모리 해제
이 시스템은 메타버스 환경에서 필수적인 협업 도구로, 실시간 멀티플레이어 환경에서의 복잡한 상태 동기화와 사용자 상호작용을 성공적으로 구현한 사례입니다.
