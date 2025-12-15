+++
title = "MyRoomEditorInputUtils"
description = "입력 유틸리티 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 413
+++

## 개요

`MyRoomEditorInputUtils`는 입력 유틸리티 클래스입니다. UI 검증, Raycast 실행, 포인터 델타 계산 등 입력 관련 헬퍼 함수를 제공합니다.

## 주요 역할

- **Raycast 수행**: 화면 포인터 위치에서 3D 공간으로의 Raycast 실행
- **UI 검증**: 포인터가 UI 요소 위에 있는지 확인
- **포인터 정보**: 포인터 위치 및 델타 값 제공
- **충돌 필터링**: 배치 영역 및 오브젝트 무시 로직

## 주요 멤버

### 필드
```csharp
[SerializeField]
private Camera raycastCamera;

[SerializeField]
private float raycastMaxDistance = 50f;

[SerializeField]
private float raycastMinDistance = 0.5f;

private EventSystem _eventSystem = EventSystem.current;
private const int RaycastLimit = 10;
```

### 주요 메서드
```csharp
public bool GetRaycastHit(out RaycastHit raycastHit, LayerMask targetLayerMask, SpawnablePropBase ignoreObject)
public bool GetRaycastHit(out RaycastHit raycastHit, LayerMask targetLayerMask, int priorityLayer)
public Vector2 PointerDelta()
public bool IsPointerOnUI()
```

## 코드 스니펫

### 전체 클래스 코드
```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.InputSystem;
using UnityEngine.Serialization;
using UnityEngine.UI;

namespace Dev.Scripts.Rsup.Scenes.MyRoomEditor
{
    public class MyRoomEditorInputUtils : MonoBehaviour
    {
        [SerializeField]
        private Camera raycastCamera;

        [SerializeField]
        private float raycastMaxDistance = 50f;

        [SerializeField]
        private float raycastMinDistance = 0.5f;

        private EventSystem _eventSystem = EventSystem.current;
        private const int RaycastLimit = 10;

        public Vector2 PointerDelta()
        {
            return InputSystem.GetDevice<Pointer>().delta.ReadValue();
        }

        private Vector2 PointerPosition()
        {
            return InputSystem.GetDevice<Pointer>().position.ReadValue();
        }
        
        /// <summary>
        /// ignoreObject를 제외한 레이캐스트 반환
        /// </summary>
        /// <param name="raycastHit">반환받을 RaycastHit</param>
        /// <param name="targetLayerMask">Raycast 대상 LayerMask</param>
        /// <param name="ignoreObject">Raycast 결과에서 무시할 게임오브젝트</param>
        public bool GetRaycastHit(out RaycastHit raycastHit, LayerMask targetLayerMask, SpawnablePropBase ignoreObject)
        {
            var ray = raycastCamera.ScreenPointToRay(PointerPosition());
            RaycastHit[] results = new RaycastHit[RaycastLimit];
            var hitLength = Physics.RaycastNonAlloc(ray, results, raycastMaxDistance, targetLayerMask);
            if (hitLength == 0)
            {
                raycastHit = new RaycastHit();
                return false;
            }

            results = Array.FindAll(results, raycastHit => 
                raycastHit.collider is BoxCollider
                && raycastHit.distance > raycastMinDistance);

            if (results.Length == 0)
            {
                raycastHit = new RaycastHit();
                return false;
            }

            results = RemoveIgnoring(results, ignoreObject);
            if (results.Length == 0)
            {
                raycastHit = new RaycastHit();
                return false;
                
            }
            Array.Sort(results, (raycast1, raycast2) => raycast1.distance.CompareTo(raycast2.distance));
            
            raycastHit = results.First();
            return true;                
        }

        /// <summary>
        /// priorityLayer를 바탕으로 우선순위 레이캐스트
        /// </summary>
        /// <param name="raycastHit">반환받을 RaycastHit</param>
        /// <param name="targetLayerMask">Raycast 대상 LayerMask</param>
        /// <param name="priorityLayer">여러 타겟이 Raycast에 감지될경우 우선시할 레이어</param>
        public bool GetRaycastHit(out RaycastHit raycastHit, LayerMask targetLayerMask, int priorityLayer)
        {
            var ray = raycastCamera.ScreenPointToRay(PointerPosition());
            RaycastHit[] results = new RaycastHit[RaycastLimit];
            var hitLength = Physics.RaycastNonAlloc(ray, results, raycastMaxDistance, targetLayerMask);
            if (hitLength == 0)
            {
                raycastHit = new RaycastHit();
                return false;
            }

            results = Array.FindAll(results, raycastHit => 
                raycastHit.collider != null
                && raycastHit.distance > raycastMinDistance);
            if (results.Length == 0)
            {
                raycastHit = new RaycastHit();
                return false;
            }
            Array.Sort(results, (raycast1, raycast2) => raycast1.distance.CompareTo(raycast2.distance));

            if (priorityLayer == -1)
            {
                raycastHit = results.First();
            }
            else
            {
                var priorityRaycastHits = results.Where(hits => hits.transform.gameObject.layer == priorityLayer).ToArray();
                raycastHit = priorityRaycastHits.Length != 0 ? priorityRaycastHits.First() : results.First();
            }
            return true;
        }

        private RaycastHit[] RemoveIgnoring(RaycastHit[] raycastHits, SpawnablePropBase ignoreObject)
        {
            var result = Array.FindAll(raycastHits, hit =>
                hit.collider.TryGetComponent<IPlaceableArea>(out var area)
                && (area.IsPlacementAreaInProp(out var propBase) == false || propBase != ignoreObject));
            return result;
        }

        public bool IsPointerOnUI()
        {
            var graphicRaycaster = FindObjectsOfType<GraphicRaycaster>();
            var pointerEvent = new PointerEventData(_eventSystem);
            var raycastResult = new List<RaycastResult>();
            pointerEvent.position = PointerPosition();
            foreach (var raycaster in graphicRaycaster)
            {
                raycaster.Raycast(pointerEvent, raycastResult);
            }

            return raycastResult.Count > 0;
        }
    }
}
```

### 우선순위 기반 Raycast
```csharp
public bool GetRaycastHit(out RaycastHit raycastHit, LayerMask targetLayerMask, int priorityLayer)
{
    var ray = raycastCamera.ScreenPointToRay(PointerPosition());
    RaycastHit[] results = new RaycastHit[RaycastLimit];
    var hitLength = Physics.RaycastNonAlloc(ray, results, raycastMaxDistance, targetLayerMask);
    if (hitLength == 0)
    {
        raycastHit = new RaycastHit();
        return false;
    }

    results = Array.FindAll(results, raycastHit => 
        raycastHit.collider != null
        && raycastHit.distance > raycastMinDistance);
    if (results.Length == 0)
    {
        raycastHit = new RaycastHit();
        return false;
    }
    Array.Sort(results, (raycast1, raycast2) => raycast1.distance.CompareTo(raycast2.distance));

    if (priorityLayer == -1)
    {
        raycastHit = results.First();
    }
    else
    {
        var priorityRaycastHits = results.Where(hits => hits.transform.gameObject.layer == priorityLayer).ToArray();
        raycastHit = priorityRaycastHits.Length != 0 ? priorityRaycastHits.First() : results.First();
    }
    return true;
}
```

### UI 포인터 검증
```csharp
public bool IsPointerOnUI()
{
    var graphicRaycaster = FindObjectsOfType<GraphicRaycaster>();
    var pointerEvent = new PointerEventData(_eventSystem);
    var raycastResult = new List<RaycastResult>();
    pointerEvent.position = PointerPosition();
    foreach (var raycaster in graphicRaycaster)
    {
        raycaster.Raycast(pointerEvent, raycastResult);
    }

    return raycastResult.Count > 0;
}
```

### 무시 오브젝트 필터링
```csharp
private RaycastHit[] RemoveIgnoring(RaycastHit[] raycastHits, SpawnablePropBase ignoreObject)
{
    var result = Array.FindAll(raycastHits, hit =>
        hit.collider.TryGetComponent<IPlaceableArea>(out var area)
        && (area.IsPlacementAreaInProp(out var propBase) == false || propBase != ignoreObject));
    return result;
}
```

## 주요 기능 설명

### Raycast 수행
- **Physics.RaycastNonAlloc**: 가비지 생성 방지를 위한 비할당 Raycast
- **결과 제한**: 최대 10개의 충돌 결과만 처리
- **거리 필터링**: 최소/최대 거리 기반 필터링

### 충돌 필터링
- **BoxCollider만 허용**: 정확한 충돌 감지를 위해
- **거리 검증**: 너무 가까운 충돌 무시
- **오브젝트 무시**: 특정 SpawnablePropBase 제외

### 우선순위 처리
- **레이어 우선순위**: 특정 레이어의 오브젝트를 우선 선택
- **거리 정렬**: 가장 가까운 오브젝트 우선

### UI 검증
- **GraphicRaycaster 사용**: UI 요소에 대한 Raycast
- **모든 Raycaster 검색**: 씬의 모든 GraphicRaycaster 확인

## 의존성

- `Camera`: Raycast를 위한 카메라
- `EventSystem`: UI 이벤트 시스템
- `InputSystem`: 포인터 입력 디바이스

## 관련 클래스

- **사용자**: 모든 편집 관련 클래스들
- **관련 인터페이스**: `IPlaceableArea`
