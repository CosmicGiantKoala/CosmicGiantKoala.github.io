+++
title = "탈것 시스템(작성중)"
# description = "Rfice 개요"
icon = "directions_bike"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 306
+++

🚀 Vehicle 시스템 구조 및 기능 분석
📋 전체 시스템 아키텍처
1. 핵심 컴포넌트 구조```
   Vehicle System
   ├── PlayerVehicleController (메인 컨트롤러)
   ├── VehicleObject (실제 탈것 오브젝트)
   ├── VehicleObjectPooling (오브젝트 풀링 관리)
   ├── VehicleType (탈것 타입 정의)
   └── External Dependencies
   ├── VehicleInputDispatcher (입력 디스패처)
   ├── PlayerController (플레이어 컨트롤러)
   ├── PlayerAnimatorController (애니메이션 컨트롤러)
   └── IPlayerStateInfo (플레이어 상태 정보)
```

2. 이벤트 기반 연결 구조
🔄 이벤트 흐름도``` 
User Input → VehicleInputDispatcher → PlayerVehicleController
    ↓
PlayerStateInfo → Network Sync → Other Players
    ↓
VehicleObject Pool → Vehicle Spawn/Despawn
    ↓
PlayerController → Movement Control
    ↓
PlayerAnimator → Animation State
```

🎯 주요 기능 분석
1. PlayerVehicleController - 메인 컨트롤러
   역할: 탈것 시스템의 중앙 관리자
   핵심 메서드 분석:``` csharp
   // 탈것 탑승
   private void GetOnVehicle()
   {
   _vehicleObject = _vehicleObjectPooling.GetPoolingObject();
   _vehicleObject.gameObject.SetActive(true);
   _vehicleObject.GetOnVehicle(gameObject.transform);
   playerController.StartRide(KickBoardSpeed);
   }
```

주요 특징:
의존성 주입: Zenject를 활용한 느슨한 결합
이벤트 기반: Observer 패턴으로 상태 변화 감지
네트워크 동기화: 멀티플레이어 환경 지원
상태 관리: VehicleType enum을 통한 명확한 상태 구분
이벤트 구독/해제:``` csharp
private void Awake()
{
    GetComponentInParent<IActor>().OnStarted += OnStartActor; 
    _vehicleInputDispatcher.OnOpenVehicleUI += OnSetVehicleState;
    playerAnimator.OnPoseChanged += OnPoseChange;
    _vehicleObjectPooling = VehicleObjectPooling.Instance;
}
```

2. VehicleObject - 탈것 오브젝트
   역할: 실제 탈것(킥보드) 표시 및 위치 관리``` csharp
   public void GetOnVehicle(Transform parents)
   {
   kickboard.SetActive(true);
   transform.parent = parents;
   transform.position = parents.position;
   transform.rotation = parents.rotation;
   }
```

주요 특징:
Transform 관리: 부모-자식 관계를 통한 위치 동기화
활성화/비활성화: 메모리 효율적인 상태 관리
풀링 시스템과 연동: 재사용 가능한 구조
3. VehicleObjectPooling - 오브젝트 풀링
역할: 성능 최적화를 위한 객체 재사용 시스템``` csharp
private void CreateVehicle(RfNetPlayer obj)
{
    if (_roomInfo.GetPlayers().Count >= QueueCount)
    {
        CreateObject();
    }
}
```

주요 특징:
동적 풀 관리: 플레이어 수에 따른 동적 객체 생성
네트워크 이벤트 연동: 플레이어 입장 시 자동 객체 생성
메모리 최적화: 객체 재사용으로 GC 부하 최소화
4. VehicleType - 상태 정의``` csharp
   public enum VehicleType
   {
   None = 0,
   KickBoard = 1,
   }
```

확장성: 새로운 탈것 타입 추가 용이
🔧 핵심 기술적 구현
1. 상태 동기화 시스템``` csharp
private void OnChangedPlayerState()
{
    if (_vehicleType == (VehicleType)_playerStateInfo.GetPlayerVehicleState()) return;
    _vehicleType = (VehicleType)_playerStateInfo.GetPlayerVehicleState();
    
    switch (_vehicleType)
    {
        case VehicleType.None:
            _isRiding = false;
            if (_vehicleObject != null) GetOffVehicle();
            break;
        case VehicleType.KickBoard:
            _isRiding = true;
            if (_vehicleObject == null) GetOnVehicle();
            break;
    }
}
```

기술적 특징:
상태 비교: 불필요한 업데이트 방지
Switch 패턴: 확장 가능한 상태 처리
동기화: 로컬과 네트워크 상태 일치
2. 애니메이션 연동 시스템``` csharp
   private void OnPoseChange(bool isPose)
   {
   if (!_isMine) return;
   if (isPose)
   {
   _playerStateInfo.SetPlayerVehicleState(VehicleType.None);
   _vehicleInputDispatcher.VehicleEnable(false);
   }
   else
   {
   _vehicleInputDispatcher.VehicleEnable(true);
   }
   }
```

주요 기능:
포즈 감지: 특정 애니메이션 상태에서 탈것 비활성화
입력 제어: 상황에 맞는 입력 시스템 활성화/비활성화
3. 네트워크 동기화``` csharp
public void InitNetworkedVehicleState(IPlayerStateInfo playerStateInfo)
{
    _playerStateInfo = playerStateInfo;
    _playerStateInfo.OnPlayerStateInfoChanged += OnChangedPlayerState;
}
```
**네트워크 특징**:
- **멀티플레이어 지원**: 모든 플레이어의 탈것 상태 동기화
- **이벤트 기반**: 상태 변화 즉시 반영
- **소유권 구분**: `_isMine`을 통한 권한 관리

## 💡 설계 패턴 활용
### 1. **Observer Pattern**
- 이벤트 기반 통신으로 컴포넌트 간 결합도 최소화
- 상태 변화 시 관련 컴포넌트들이 자동으로 반응

### 2. **Object Pool Pattern**
- 런타임 성능 최적화
- 메모리 할당/해제 비용 최소화

### 3. **State Pattern**
- VehicleType enum을 통한 명확한 상태 관리
- 확장 가능한 상태 시스템

### 4. **Dependency Injection**
- Zenject 활용으로 테스트 용이성 확보
- 모듈 간 느슨한 결합

## 🚀 시스템의 장점 및 특징
### **1. 확장성**
- 새로운 탈것 타입 추가 시 VehicleType enum만 수정하면 확장 가능
- 모듈화된 구조로 기능 추가/수정 용이

### **2. 성능 최적화**
- Object Pooling을 통한 메모리 관리
- 불필요한 상태 업데이트 방지

### **3. 네트워크 안정성**
- 소유권 기반 입력 처리
- 상태 동기화를 통한 일관성 유지

### **4. 유지보수성**
- 이벤트 기반 아키텍처로 코드 가독성 향상
- 단일 책임 원칙 준수

이 Vehicle 시스템은 **Unity 멀티플레이어 게임**에서 **확장 가능하고 성능 최적화된 탈것 시스템**을 구현한 예시로, 포트폴리오에서 **아키텍처 설계 능력**과 **성능 최적화 기술**을 보여주는 좋은 사례입니다.