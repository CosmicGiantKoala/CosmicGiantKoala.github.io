+++
title = "HeroInputData"
description = "Fusion 네트워크 전송을 위한 입력 데이터 컨테이너"
icon = "code"
date = "2025-03-06T23:36:00+09:00"
lastmod = "2025-03-06T23:36:00+09:00"
draft = false
toc = true
weight = 275
+++

## 개요
`HeroInputData` 구조체는 RFist 게임의 Fusion 네트워크 전송을 위한 입력 데이터를 담는 컨테이너입니다.
비트 마스크(Bit Mask)를 사용하여 효율적인 네트워크 전송을 지원하며, 이동 및 전투 입력 데이터를 캡슐화합니다.

## 역할
- 동기화할 입력 데이터 캡슐화
- 비트 마스크를 활용한 효율적인 버튼 상태 표현
- Fusion NetworkRunner에 의한 자동 직렬화/전송 대상 데이터 제공
- 이동 및 전투 입력 데이터 보관
- [`INetworkInput`](https://doc.photonengine.com/fusion/v1/manual/network-input) 구현체

## 선언
```csharp
public struct HeroInputData: INetworkInput
```

## 멤버
### 버튼 비트 마스크 정의
```csharp
/// <summary>
/// 공격 버튼 비트 마스크
/// </summary>
public const uint Attack = 0x0000_0001;

/// <summary>
/// 공격 홀드 버튼 비트 마스크
/// </summary>
public const uint AttackHold = 0x0000_0002;

/// <summary>
/// 가드 버튼 비트 마스크
/// </summary>
public const uint Guard = 0x0000_0004;

/// <summary>
/// 공격+가드 동시 입력 버튼 비트 마스크
/// </summary>
public const uint AttackGuardDualInput = 0x0000_0005;

/// <summary>
/// 궁극기 버튼 비트 마스크
/// </summary>
public const uint UltimateAttack = 0x0000_0100;

/// <summary>
/// 대시 버튼 비트 마스크
/// </summary>
public const uint Dash = 0x0001_0000;

/// <summary>
/// 포커스 모드 버튼 비트 마스크
/// </summary>
public const uint FocusMode = 0x0010_0000;

/// <summary>
/// 포커스 변경 버튼 비트 마스크
/// </summary>
public const uint FocusChange = 0x0020_0000;
```

### 속성
```csharp
/// <summary>
/// 수평 이동 입력값 (-1 ~ 1)
/// </summary>
public float Horizontal { get; set; }

/// <summary>
/// 수직 이동 입력값 (-1 ~ 1)
/// </summary>
public float Vertical { get; set; }

/// <summary>
/// 공격 타임스탬프
/// </summary>
public float AttackTimeStamp { get; set; }

/// <summary>
/// 버튼 상태 비트 마스크
/// </summary>
public uint Buttons { get; set; }
```

### 메서드
```csharp
/// <summary>
/// 공격 입력 여부 확인
/// </summary>
/// <returns>공격 입력 여부</returns>
public bool IsAttack() => (Buttons & Attack) == Attack;

/// <summary>
/// 공격 홀드 입력 여부 확인
/// </summary>
/// <returns>공격 홀드 입력 여부</returns>
public bool IsAttackHold() => (Buttons & AttackHold) == AttackHold;

/// <summary>
/// 가드 입력 여부 확인
/// </summary>
/// <returns>가드 입력 여부</returns>
public bool IsGuard() => (Buttons & Guard) == Guard;

/// <summary>
/// 대시 입력 여부 확인
/// </summary>
/// <returns>대시 입력 여부</returns>
public bool IsDash() => (Buttons & Dash) == Dash;

/// <summary>
/// 포커스 모드 입력 여부 확인
/// </summary>
/// <returns>포커스 모드 입력 여부</returns>
public bool IsFocusMode() => (Buttons & FocusMode) == FocusMode;

/// <summary>
/// 포커스 변경 입력 여부 확인
/// </summary>
/// <returns>포커스 변경 입력 여부</returns>
public bool IsFocusChange() => (Buttons & FocusChange) == FocusChange;

/// <summary>
/// 궁극기 입력 여부 확인
/// </summary>
/// <returns>궁극기 입력 여부</returns>
public bool IsUltimateSkill() => (Buttons & UltimateAttack) == UltimateAttack;

/// <summary>
/// 공격+가드 동시 입력 여부 확인
/// </summary>
/// <returns>공격+가드 동시 입력 여부</returns>
public bool IsAttackGuardDualInput() => (Buttons & AttackGuardDualInput) == AttackGuardDualInput;
```

## 기능 설명
### 비트 마스크 구조
- `HeroInputData`는 uint 타입의 `Buttons` 필드에 여러 버튼 상태를 비트 단위로 저장

| 상수 | 비트 위치 | 16진수 값      | 설명 |
|------|----------|-------------|------|
| `Attack` | 0 | 0x0000_0001 | 공격 |
| `AttackHold` | 1 | 0x0000_0002 | 공격 홀드 |
| `Guard` | 2 | 0x0000_0004 | 가드 |
| `AttackGuardDualInput` | 3 | 0x0000_0005 | 공격+가드 동시 입력 |
| `UltimateAttack` | 8 | 0x0000_0100 | 궁극기 |
| `Dash` | 16 | 0x0001_0000 | 대시 |
| `FocusMode` | 20 | 0x0010_0000 | 포커스 모드 |
| `FocusChange` | 21 | 0x0020_0000 | 포커스 변경 |

### 네트워크 전송 구조체
- `HeroInputData`는 [`INetworkInput`](https://doc.photonengine.com/fusion/v1/manual/network-input) 인터페이스를 구현하여 Fusion의 네트워크 시스템에서 사용됨
- 클라이언트에서 입력 데이터 생성
- `Buttons` 비트 마스크로 효율적인 직렬화

### 입력 데이터 구성
- Horizontal / Vertical(float) : 8bytes
- AttackTimeStamp(float) : 4bytes
- Buttons(uint) : 4bytes

## 의존성/상속 관계
- [`INetworkInput`](https://doc.photonengine.com/fusion/v1/manual/network-input) (Fusion 인터페이스) 구현
- [`NetworkHeroController`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroController)에서 입력 수집 및 동기화
- [`NetworkHeroInput`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroInput)에서 로컬 입력을 HeroInputData로 변환

## 사용 예시
#### [`NetworkHeroInput`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroInput)에서 `HeroInputData` 생성
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
        // 수평 이동 입력 수집 (이미 값이 있으면 건드리지 않음)
        if (heroInputData.Horizontal == 0)
        {
            heroInputData.Horizontal = heroInput.GetHorizontal();    
        }

        // 수직 이동 입력 수집 (이미 값이 있으면 건드리지 않음)
        if (heroInputData.Vertical == 0)
        {
            heroInputData.Vertical = heroInput.GetVertical();    
        }

        // 대시 입력 수집
        if (heroInput.IsDash())
        {
            heroInputData.Buttons |= HeroInputData.Dash;
        }
        
        // 공격 입력 수집 및 타임스탬프 기록
        if (heroInput.IsAttack())
        {
            heroInputData.Buttons |= HeroInputData.Attack;
            heroInputData.AttackTimeStamp = runner.SimulationTime;
        }

        // 공격 홀드(차지) 입력 수집 및 타임스탬프 기록
        if (heroInput.IsAttackHold())
        {
            heroInputData.Buttons |= HeroInputData.AttackHold;
            heroInputData.AttackTimeStamp = runner.SimulationTime;
        }
        else
        {
            // 홀드 해제 시에도 타임스탬프 갱신
            heroInputData.AttackTimeStamp = runner.SimulationTime;
        }

        // 가드 입력 수집 및 타임스탬프 기록
        if (heroInput.IsGuard())
        {
            heroInputData.Buttons |= HeroInputData.Guard;  
            heroInputData.AttackTimeStamp = runner.SimulationTime;   
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

        // 궁극기 입력 수집 및 타임스탬프 기록
        if (heroInput.IsUltimateAttack())
        {
            heroInputData.Buttons |= HeroInputData.UltimateAttack;
            heroInputData.AttackTimeStamp = runner.SimulationTime;
        }

        // 공격+가드 동시 입력 수집 및 타임스탬프 기록
        if (heroInput.IsAttackGuardDualInput())
        {
            heroInputData.Buttons |= HeroInputData.AttackGuardDualInput;
            heroInputData.AttackTimeStamp = runner.SimulationTime;   
        }
    }
    
    // 수집된 입력 데이터를 네트워크 입력으로 설정
    input.Set(heroInputData);
}
```

#### [`NetworkHeroController`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroController)에서 입력데이터 수신 및 전송
```csharp
public override void FixedUpdateNetwork()
{
    if (GetInput<HeroInputData>(out var heroInputData))
    {
        // 컨트롤러가 비활성화된 경우 기본값 전송
        if (heroController.IsActive == false)
        {
            RPC_UpdateHeroInputData(default);
            return;
        }
        // 입력 데이터를 모든 클라이언트에 동기화
        RPC_UpdateHeroInputData(heroInputData);
        FixedInputData = heroInputData;
    }
}

[Rpc(RpcSources.InputAuthority, RpcTargets.All)]
private void RPC_UpdateHeroInputData(HeroInputData heroInputData)
{
    // 이동 입력 처리
    heroController.Move(heroInputData.Horizontal, heroInputData.Vertical, Runner.DeltaTime);
    
    // 개별 스킬/액션 입력 처리
    ProcessDash(heroInputData);
    ProcessAttack(heroInputData);
    ProcessAttackHold(heroInputData);
    ProcessFocus(heroInputData);
    ProcessGuard(heroInputData);
    ProcessUltimateSkill(heroInputData);
}
```

## 관련 클래스
- [`NetworkHeroController`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroController)
- [`NetworkHeroInput`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroInput)
- [`HeroKeyInput`](/docs/projects/rfist/HeroControlSystem/HeroKeyInput)
- [`BaseHeroInput`](/docs/projects/rfist/HeroControlSystem/BaseHeroInput)
- [`IHeroInput`](/docs/projects/rfist/HeroControlSystem/IHeroInput)
