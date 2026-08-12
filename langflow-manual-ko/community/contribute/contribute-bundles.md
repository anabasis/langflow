# 컴포넌트 번들 기여하기

> 원문: https://docs.langflow.org/next/contributing-bundles

[**번들(Bundles)**](https://docs.langflow.org/components-bundle-components)은 특정 서비스 제공자와 관련된 컴포넌트들의 그룹입니다.
여러분이 만든 커스텀 컴포넌트를 Langflow 프로젝트에 기여하고 싶다면, 이를 번들에 넣어야 합니다.

Langflow 비주얼 에디터에서 **번들**에 컴포넌트를 추가하려면 다음 단계를 따르세요.
이 예제는 `DarthVader`라는 번들을 추가합니다.

커스텀 컴포넌트를 만드는 방법에 대한 자세한 내용은 [커스텀 Python 컴포넌트 만들기](https://docs.langflow.org/components-custom-components)를 참고하세요.

## lfx components 폴더에 번들 추가하기[​](#add-the-bundle-to-the-lfx-components-folder "Direct link to Add the bundle to the lfx components folder")

1. Langflow 저장소의 lfx 디렉터리로 이동하여 번들을 위한 새 폴더를 만듭니다.
새 컴포넌트의 경로는 `src/lfx/src/lfx/components/darth_vader`입니다.
Langflow 저장소의 [components 폴더](https://github.com/langflow-ai/langflow/tree/main/src/lfx/src/lfx/components)를 참고할 수 있습니다.

2. 새로 만든 `darth_vader` 폴더 안에 다음 파일을 추가합니다.

  - `darth_vader_component.py` — 새 번들의 백엔드 로직을 담는 파일입니다. 여러 컴포넌트를 위해 여러 개의 `.py` 파일을 만드세요.
  - `__init__.py` — 번들 컴포넌트를 초기화하는 파일입니다. 구조를 확인하려면 기존의 아무 `__init__.py`나 예시로 사용할 수 있습니다.

    번들에 여러 컴포넌트를 추가하는 예시는 [Notion](https://github.com/langflow-ai/langflow/tree/main/src/lfx/src/lfx/components/Notion) 번들을 참고하세요.

## 프런트엔드 폴더에 번들 추가하기[​](#add-the-bundle-to-the-frontend-folder "Direct link to Add the bundle to the frontend folder")

1. Langflow 저장소의 프런트엔드 디렉터리로 이동하여 번들의 아이콘을 추가합니다.
새 컴포넌트 아이콘의 경로는 `src/frontend/src/icons/DarthVader`입니다. Langflow 저장소의 [icons 폴더](https://github.com/langflow-ai/langflow/tree/main/src/frontend/src/icons)를 참고할 수 있습니다.
아이콘을 추가하려면 `icons/darth_vader` 폴더 안에 **세 개**의 파일을 만드세요.

2. `icons/darth_vader` 폴더에 아이콘의 원본 SVG 파일을 추가합니다. 예: `darth_vader-icon.svg`.

  팁
      SVG 파일을 JSX 형식으로 변환하려면 SVG to JSX와 같은 온라인 도구를 사용할 수 있습니다.
원본의 더 가벼운 버전의 SVG를 사용하는 것이 강력히 권장됩니다.

3. `icons/darth_vader` 폴더에 JSX 형식의 React 컴포넌트로 아이콘을 추가합니다. 예: `DarthVaderIcon.jsx`.

4. 올바른 컴포넌트 이름과 구조를 포함하도록 JSX 파일을 업데이트합니다.
JSX 파일에 `{...props}` 스프레드 연산자를 포함해야 합니다.
예를 들어, `DarthVaderIcon.jsx`는 다음과 같습니다.

```jsx
const DarthVaderIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 32 32"
    fill="none"
    style={{ backgroundColor: "#9100ff", borderRadius: "6px" }}
    {...props}
  >
    <g transform="translate(7, 7)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.27406 0.685082C8.46664 -0.228361 10.9302 -0.228361 13.1229 0.685082C14.6773 1.33267 16.0054 2.40178 16.9702 3.75502C17.6126 4.65574 17.0835 5.84489 16.045 6.21613L13.5108 7.12189C12.9962 7.30585 12.4289 7.26812 11.9429 7.01756C11.8253 6.95701 11.7298 6.86089 11.6696 6.74266L10.2591 3.97469C10.0249 3.51519 9.37195 3.51519 9.13783 3.97469L7.72731 6.74274C7.66714 6.86089 7.57155 6.95701 7.454 7.01756L4.70187 8.43618C4.24501 8.67169 4.24501 9.3284 4.70187 9.56391L7.454 10.9825C7.57155 11.0431 7.66714 11.1392 7.72731 11.2574L9.13783 14.0254C9.37195 14.4849 10.0249 14.4849 10.2591 14.0254L11.6696 11.2574C11.7298 11.1392 11.8253 11.0431 11.9428 10.9825C12.429 10.7319 12.9965 10.6942 13.5112 10.8781L16.045 11.7838C17.0835 12.1551 17.6126 13.3442 16.9704 14.245C16.0054 15.5982"
        fill={props.isdark === "true" ? "white" : "black"}
      />
    </g>
  </svg>
);

export default DarthVaderIcon;
```

5. `icons/darth_vader` 폴더에 TypeScript 형식으로 React 컴포넌트 자체를 추가합니다. 예: `index.tsx`.
아이콘의 React 컴포넌트 이름이 방금 만든 JSX 컴포넌트와 일치하는지 확인하세요. 예: `DarthVaderIcon`:

```tsx
import { useDarkStore } from "@/stores/darkStore";
import React, { forwardRef } from "react";
import DarthVaderIconSVG from "./DarthVaderIcon";

export const DarthVaderIcon = forwardRef<
  SVGSVGElement,
  React.PropsWithChildren<{}>
>((props, ref) => {
  const isdark = useDarkStore((state) => state.dark).toString();

  return <DarthVaderIconSVG ref={ref} isdark={isdark} {...props} />;
});

export default DarthVaderIcon;
```

6. 새 번들을 프런트엔드에 연결하려면 `/src/frontend/src/icons/lazyIconImports.ts`를 엽니다.
Langflow 저장소의 [lazyIconImports.ts](https://github.com/langflow-ai/langflow/blob/main/src/frontend/src/icons/lazyIconImports.ts)를 참고할 수 있습니다.

7. `.tsx` 파일에서 사용한 아이콘 이름과 일치하는 아이콘 이름을 추가합니다.
예를 들면 다음과 같습니다.

```ts
  CrewAI: () =>
    import("@/icons/CrewAI").then((mod) => ({ default: mod.CrewAiIcon })),
  DarthVader: () =>
    import("@/icons/DarthVader").then((mod) => ({ default: mod.DarthVaderIcon })),
  DeepSeek: () =>
    import("@/icons/DeepSeek").then((mod) => ({ default: mod.DeepSeekIcon })),
```

8. **번들** 메뉴에 번들을 추가하려면 `/src/frontend/src/utils/styleUtils.ts`의 [`SIDEBAR_BUNDLES` 배열](https://github.com/langflow-ai/langflow/blob/main/src/frontend/src/utils/styleUtils.ts#L243)을 편집합니다.

    다음 키를 가진 객체를 배열에 추가합니다.

  - `display_name`: Langflow 비주얼 에디터에 표시되는 텍스트 레이블
  - `name`: `/src/lfx/src/lfx/components` 디렉터리 안에 만든 폴더 이름
  - `icon`: 이전 단계에서 정의한 번들 아이콘의 이름

    예를 들면 다음과 같습니다.

```ts
{ display_name: "AssemblyAI", name: "assemblyai", icon: "AssemblyAI" },
{ display_name: "DarthVader", name: "darth_vader", icon: "DarthVader" },
{ display_name: "DataStax", name: "datastax", icon: "AstraDB" },
```

## 번들 컴포넌트에 아이콘 업데이트하기[​](#update-bundle-components-with-icons "Direct link to Update bundle components with icons")

번들 컴포넌트에서, 아이콘 변수를 새 번들과 연결합니다.

`darth_vader_component.py` 파일의 컴포넌트 클래스에서, 프런트엔드에 정의한 아이콘을 포함하세요.
`icon`은 `src/frontend/src/icons` 디렉터리 안에 만든 아이콘 디렉터리를 가리켜야 합니다.
예를 들면 다음과 같습니다.

```python
class DarthVaderAPIComponent(LCToolComponent):
    display_name: str = "Darth Vader Tools"
    description: str = "Use the force to run actions with your agent"
    name = "DarthVaderAPI"
    icon = "DarthVader"
```

## 애플리케이션이 컴포넌트 번들을 빌드하는지 확인하기[​](#ensure-the-application-builds-your-component-bundle "Direct link to Ensure the application builds your component bundle")

1. 백엔드와 프런트엔드를 다시 빌드하려면 `make install_frontend && make build_frontend && make install_backend && uv run langflow run --port 7860`을 실행합니다.

2. 프런트엔드 애플리케이션을 새로고침합니다.
`DarthVader`라는 새 번들이 비주얼 에디터의 **번들** 메뉴에서 사용 가능해집니다.
