+++
title = "보조렌더링 유틸리티"
# description = "Rfice 개요"
icon = "videocam"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 308
+++

# AssistCamera 유틸리티 기능 분석
는 Unity에서 3D 오브젝트를 특정 각도에서 렌더링하여 프리뷰를 제공하는 카메라 시스템입니다. `AssistCamera`
## 핵심 구성 요소
### 1. **AssistCameraComponent** (메인 컴포넌트)
3D 오브젝트를 렌더링하는 보조 카메라를 생성하고 제어합니다.
#### 주요 기능:
- **자동 카메라 배치**: SkinnedMeshRenderer의 Bounds를 계산하여 오브젝트 전체가 보이도록 카메라 위치 자동 설정
- **RenderTexture 생성**: 지정된 해상도로 렌더링 결과를 텍스처로 출력 (iOS: 1x AA, 기타: 4x AA)
- **6방향 뷰**: Front, Behind, Left, Right, Top, Bottom 중 선택 가능
- **파츠별 렌더링**: 머리, 상체, 하체 등 특정 파츠만 집중해서 보여주기
- **카메라 제어**:
    - **Rotate**: Y축 기준 회전
    - **Zoom**: 지정된 범위 내에서 줌 인/아웃

### 2. **AssistCameraHandler** (중앙 관리자)
여러 AssistCamera를 Dictionary로 관리하는 싱글톤 핸들러입니다.
#### 제공 메서드:``` csharp
// 카메라 등록/해제
AddAssistCamera(string targetKey, AssistCameraComponent camera)
RemoveAssistCamera(string targetKey)

// 렌더링 제어
StartRendering(string targetKey)  // 초기화 및 렌더링 시작
StopRendering(string targetKey)   // 렌더링 중지 및 리소스 해제

// 렌더 텍스처 가져오기
GetRenderTexture(string targetKey)

// 파츠 변경
ChangeRenderingParts(string targetKey, string partsName)

// 카메라 이동
MoveAssistCamera(string targetKey, AssistCameraCommand type, float value)
```

예약 시스템:
카메라가 아직 등록되지 않은 상태에서 호출 시 자동으로 대기열에 추가 후 실행
3. AssistCameraPartsList (파츠 데이터 관리)
렌더링할 파츠별 카메라 위치와 주시점을 저장합니다.
4. AssistCameraInstaller (Zenject 바인딩)
의존성 주입을 위한 Installer로 AssistCameraHandler를 싱글톤으로 등록합니다.
사용 사례
전형적인 용도:
아바타 커스터마이징: 캐릭터 의상/헤어 변경 시 프리뷰
인벤토리 아이템 미리보기: 3D 아이템 회전 뷰
마이룸 가구 편집: 배치 전 가구 미리보기
캐릭터 선택 화면: 여러 캐릭터 썸네일 생성
워크플로우 예시:``` csharp
// 1. 씬에 AssistCameraComponent 배치 (targetKey: "Avatar")
// 2. Handler를 통한 제어
handler.StartRendering("Avatar");                    // 렌더링 시작
handler.ChangeRenderingParts("Avatar", "Head");      // 머리 파츠 포커스
handler.MoveAssistCamera("Avatar", Rotate, 45f);     // 45도 회전
var texture = handler.GetRenderTexture("Avatar");    // UI에 표시
handler.StopRendering("Avatar");                      // 완료 시 정리
```

설정 파라미터
Inspector 설정:
targetRoot: 렌더링할 GameObject (SkinnedMeshRenderer 필요)
targetKey: Handler에서 식별할 고유 키
viewOrientation: 초기 카메라 시점
defaultCameraOffset: 기본 카메라 오프셋
renderTextureSize: 출력 해상도 (예: 512x512)
renderParts: 파츠별 렌더러와 오프셋 목록
cameraSpeed: 카메라 이동 속도
nearestDistance/longestDistance: 줌 제한 범위
cameraFov: 카메라 시야각
outputRawImage: (옵션) 자동으로 표시할 RawImage UI
기술적 특징
최적화:
한 번 생성된 카메라는 재사용 (_wasUsed 플래그)
iOS에서 안티앨리어싱을 1x로 제한하여 성능 확보
사용하지 않을 때 카메라 비활성화 및 RenderTexture 해제
자동 Bounds 계산:
여러 SkinnedMeshRenderer가 있을 경우 모든 Bounds를 포함하도록 자동 결합
FOV와 Bounds 크기를 기반으로 오브젝트가 화면에 꽉 차도록 거리 자동 계산
부드러운 카메라 이동:
Coroutine 기반 Lerp 보간으로 자연스러운 이동
_isMoving 플래그로 중복 이동 방지
이 유틸리티는 Unity의 다중 카메라 렌더링을 활용하여 메인 씬과 독립적으로 특정 오브젝트의 프리뷰를 효율적으로 생성하는 완성도 높은 시스템입니다.