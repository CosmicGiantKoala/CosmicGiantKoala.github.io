+++
title = "PlacementType"
description = "오브젝트 배치 타입을 정의하는 열거형"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 499
+++

## 개요
`PlacementType`은 MyRoomEditor에서 오브젝트 배치 타입을 정의하는 열거형입니다. 오브젝트가 배치될 수 있는 영역의 종류를 지정하며, 레이어 설정과 배치 로직에 사용됩니다.

## 역할
- 프로퍼티 배치 영역 타입 정의
- 배치 가능 영역의 분류 기준 제공
- 레이어 및 배치 검증 로직에 활용

## 선언
```csharp
public enum PlacementType
```

## 열거형 값
```csharp
public enum PlacementType
{
    Floor,      // 바닥
    Wall,       // 벽
    Ceiling,    // 천장
    Skybox      // 배경 전망
}
```

## 값 설명
### Floor (바닥)
- **설명**: 바닥면에 배치되는 오브젝트 타입
- **특징**: 자유로운 이동과 회전이 가능
- **예시**: 가구, 장식품, 러그 등

### Wall (벽)
- **설명**: 벽면에 부착되는 오브젝트 타입
- **특징**: 벽면 고정, 회전 제한, 방향 기반 기즈모
- **예시**: 그림, 벽걸이 장식, 스크린 등

### Ceiling (천장)
- **설명**: 천장면에 배치되는 오브젝트 타입
- **특징**: 자유로운 이동과 회전이 가능
- **예시**: 천장 조명, 천장 장식 등

### Skybox (배경 전망)
- **설명**: 배경 전망을 위한 특별한 배치 타입
- **특징**: 환경 배경 요소
- **예시**: 창문, 배경 풍경 등

## 관련 클래스
- [`IPlaceableArea`](/docs/projects/rfice/HousingSystem/IPlaceableArea)
- [`PlacementAreaProp`](/docs/projects/rfice/HousingSystem/PlacementAreaProp)
- [`PlacementAreaInProp`](/docs/projects/rfice/HousingSystem/PlacementAreaInProp)
- [`MyRoomProp`](/docs/projects/rfice/HousingSystem/MyRoomProp)