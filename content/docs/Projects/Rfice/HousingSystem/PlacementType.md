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

`PlacementType`은 MyRoomEditor 시스템에서 오브젝트가 배치될 수 있는 공간의 타입을 정의하는 열거형.

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

## 사용 방식

### 오브젝트 배치 시
```csharp
// 배치 영역 타입 확인
if (placementArea.GetPlacementType() == PlacementType.Wall)
{
    // 벽 배치 로직
    transform.rotation = placementArea.GetPlacementRotation();
}
```

## 관련 클래스

- **MyRoomProp**: placementType 필드 사용
- **IPlaceableArea**: GetPlacementType() 메서드
- **SpawnablePropBase**: PlacementType 속성
- **배치 매니저**: 타입 기반 배치 로직

## 설계 고려사항

### 확장성
새로운 배치 타입이 추가될 경우 열거형에 값만 추가하면 됨

### 일관성
모든 배치 관련 로직에서 동일한 PlacementType 값을 사용

### 타입 안전성
컴파일 타임에 잘못된 타입 사용 방지
