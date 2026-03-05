+++
title = "NetworkHeroInput"
description = "로컬 플레이어 입력을 수집하여 네트워크로 전송하는 입력 수집기 클래스"
icon = "code"
date = "2025-02-24T16:35:00+09:00"
lastmod = "2025-02-24T16:35:00+09:00"
draft = false
toc = true
weight = 220
+++

## 개요
`NetworkHeroInput` 클래스는 Photon Fusion의 [`NetworkBehaviour`](https://doc.photonengine.com/fusion/current/manual/network-behaviour)를 랩핑한 `NetworkBehaviourCallBack` 클래스를 상속받아, 로컬 플레이어가 누른 키/버튼 입력을 [`HeroInputData`](/docs/projects/rfist/HeroNetworkSystem/HeroInputData) 구조체로 변환하고 네트워크로 전송합니다. 입력 권한(`Input Authority`)을 가진 클라이언트에서만 동작하며, 실제 게임 로직은 실행하지 않습니다.

## 역할
- Fusion의 [`NetworkInput`](https://doc.photonengine.com/fusion/v1/manual/network-input) 시스템을 통해 네트워크로 입력 데이터 전송
- [`IHeroInput`](/docs/projects/rfist/herocontrolsystem/)을 구현한 입력소스로 부터 입력 수집
- 수집된 입력을 [`HeroInputData`](/docs/projects/rfist/herocontrolsystem/HeroInputData) 구조체로 변환
- 이동(수평/수직), 공격, 가드, 대시, 포커스 등 다양한 입력 처리
- 입력 타임스탬프 기록으로 네트워크 지연 측정 지원
- 입력 권한([`Input Authority`](https://doc.photonengine.com/fusion/current/manual/network-object)) 검증

## 선언

```csharp
public class NetworkHeroInput: NetworkBehaviourCallback
```

## 멤버
### 메서드
```csharp
/// <summary>
/// 네트워크 입력이 필요할 때 Fusion에 의해 호출되는 콜백
/// 로컬 플레이어의 입력을 수집하여 NetworkInput에 설정합니다.
/// </summary>
/// <param name="runner">NetworkRunner 인스턴스</param>
/// <param name="input">설정할 NetworkInput</param>
public override void OnInput(NetworkRunner runner, NetworkInput input)
```

## 코드 스니펫
### 입력 수집 및 네트워크 전송
```csharp
public override void OnInput(NetworkRunner runner, NetworkInput input)
{
    // 입력 권한이 없으면 처리하지 않음
    if (!Object.HasInputAuthority) return;
    
    // 새로운 입력 데이터 생성
    var heroInputData = new HeroInputData();
    
    // 등록된 모든 입력 소스에서 입력 수집
    foreach (var heroInput in BaseHeroInput.HeroInputList)
    {
        // 수평 및 수직 이동 입력 수집
        heroInputData.Horizontal = heroInput.GetHorizontal();    
        heroInputData.Vertical = heroInput.GetVertical();
        
        // 타임스탬프 기록
        heroInputData.AttackTimeStamp = runner.SimulationTime;   
        
        
        // 대시 입력 수집
        if (heroInput.IsDash())
        {
            heroInputData.Buttons |= HeroInputData.Dash;
        }
        
        // 공격 입력 수집
        if (heroInput.IsAttack())
        {
            heroInputData.Buttons |= HeroInputData.Attack;
        }

        // 공격 홀드(차지) 입력 수집
        if (heroInput.IsAttackHold())
        {
            heroInputData.Buttons |= HeroInputData.AttackHold;
        }

        // 가드 입력 수집
        if (heroInput.IsGuard())
        {
            heroInputData.Buttons |= HeroInputData.Guard;  
        }

        // 포커스 모드 입력 수집
        if (heroInput.IsFocusMode())
        {
            heroInputData.Buttons |= HeroInputData.FocusMode;
        }

        // 포커스 변경 입력 수집
        if (heroInput.IsFocusChange())
        {
            heroInputData.Buttons |= HeroInputData.FocusChange;
        }

        // 궁극기 입력 수집
        if (heroInput.IsUltimateAttack())
        {
            heroInputData.Buttons |= HeroInputData.UltimateAttack;
        }

        // 공격+가드 동시 입력 수집
        if (heroInput.IsAttackGuardDualInput())
        {
            heroInputData.Buttons |= HeroInputData.AttackGuardDualInput;
        }
    }
    
    // 수집된 입력 데이터를 네트워크 입력으로 설정
    input.Set(heroInputData);
}
```

## 기능 설명
### 입력 수집 흐름
1. **권한 검증**: [`HasInputAuthority`](https://doc.photonengine.com/fusion/current/manual/network-object)를 확인하여 로컬 플레이어만 입력 수집
2. **데이터 초기화**: 새로운 [`HeroInputData`](/docs/projects/rfist/herocontrolsystem/HeroInputData) 구조체 생성
3. **입력 소스 순회**: [`IHeroInput`](/docs/projects/rfist/HeroControlSystem/IHeroInput)을 구현한 입력소스로 부터 입력 수집
4. **이동 입력**: 수평(Horizontal) 및 수직(Vertical) 이동 입력 수집
5. **버튼 입력**: 비트 플래그를 사용하여 다양한 액션 입력 수집
6. **타임스탬프 기록**: 공격 관련 입력에 시뮬레이션 타임 기록
7. **네트워크 설정**: 수집된 데이터를 [`NetworkInput`](https://doc.photonengine.com/fusion/v1/manual/network-input)에 설정

### 지원하는 입력 타입

| 입력 | 상수 | 설명 |
|------|------|------|
| 이동 | Horizontal, Vertical | WASD/스틱 이동 입력 |
| 공격 | Attack | 공격 버튼 |
| 공격 홀드 | AttackHold | 공격 버튼 홀드(차지) |
| 가드 | Guard | 가드/방어 버튼 |
| 대시 | Dash | 회피/대시 버튼 |
| 포커스 모드 | FocusMode | 타겟 고정 모드 토글 |
| 포커스 변경 | FocusChange | 타겟 변경 |
| 궁극기 | UltimateAttack | 궁극기 스킬 버튼 |
| 공격+가드 | AttackGuardDualInput | 특수 스킬 발동 입력 |

### 타임스탬프 동기화
- [`runner.SimulationTime](https://doc.photonengine.com/fusion/current/concepts-and-patterns/networked-controller-code)을 기록
- [`NetworkHeroController.HeroInputSyncData`](/docs/projects/rfist/heronetworksystem/networkherocontroller/#중첩-구조체)를 통해 네트워크 지연 계산에 활용
- 클라이언트-서버 간 시간 동기화에 사용

## 의존성/상속 관계
- `NetworkBehaviourCallback` 랩핑 클래스를 상속함
- [`BaseHeroInput`](/docs/projects/rfist/HeroControlSystem/BaseHeroInput) 클래스를 통해 입력 소스 수집
- [`HeroInputData`](/docs/projects/rfist/HeroControlSystem/HeroInputData) 구조체가 [`NetworkInput`](https://doc.photonengine.com/fusion/v1/manual/network-input) 구현 및 네트워크 동기화됨

## 관련 클래스
- [`NetworkRunner`](https://doc.photonengine.com/fusion/current/manual/network-runner)
- [`NetworkInput`](https://doc.photonengine.com/fusion/v1/manual/network-input)
- [`NetworkHeroController`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroController)
- [`BaseHeroInput`](/docs/projects/rfist/HeroControlSystem/BaseHeroInput)
- [`HeroInputData`](/docs/projects/rfist/HeroControlSystem/HeroInputData)
- [`IHeroInput`](/docs/projects/rfist/HeroControlSystem/IHeroInput)
- [`HeroKeyInput`](/docs/projects/rfist/HeroControlSystem/HeroKeyInput)
