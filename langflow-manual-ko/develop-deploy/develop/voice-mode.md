# 음성 모드 사용하기
> 원문: https://docs.langflow.org/next/concepts-voice-mode

경고

음성 모드(Voice mode)는 Langflow 1.10부터 더 이상 사용되지 않습니다(deprecated).

**Playground**의  **Microphone** 버튼은 이제 음성-텍스트 변환(speech-to-text)만 활성화하며, 추가적인 음성 모드 기능은 제공하지 않습니다.
Speech-to-text는 음성을 Playground의 채팅 입력 필드로 받아쓰지만, Langflow UI와의 음성 상호작용이나 텍스트-음성 변환(text-to-speech) 응답은 제공하지 않습니다.

아래에서 설명하는 `api/v1/voice` WebSocket 엔드포인트는 여전히 사용할 수 있습니다.

정보

음성 모드는 Langflow Desktop에서는 사용할 수 없습니다.
음성 모드를 사용하려면 [Langflow OSS Python 패키지를 설치](https://docs.langflow.org/get-started-installation#install-and-run-the-langflow-oss-python-package)하세요.

Langflow의 음성 모드를 사용하면 마이크와 스피커를 통해 플로우와 음성으로 상호작용할 수 있습니다.

## 사전 요구 사항[​](#prerequisites "사전 요구 사항으로 바로 가기")

음성 모드를 사용하려면 다음이 필요합니다.

- **Chat Input**, **Language Model**, **Chat Output** 컴포넌트로 구성된 플로우.

    플로우에 **Agent** 컴포넌트가 있다면, 에이전트가 어떤 도구를 사용할지 정확히 선택할 수 있도록 플로우 내 도구들의 이름과 설명이 정확한지 확인하세요.

    또한 음성 모드는 **Agent** 컴포넌트의 **Agent Instructions** 필드에 입력된 지시문을 재정의(override)한다는 점에 유의하세요.

- [OpenAI](https://platform.openai.com/) 계정과 OpenAI API 키. Langflow는 음성 입력을 처리하고 응답을 생성하기 위해 OpenAI API를 사용합니다.

- 선택 사항: LLM 응답에 더 다양한 음성 옵션을 사용하려면 [ElevenLabs](https://elevenlabs.io) API 키가 필요합니다.

- 마이크와 스피커.

    최적의 음성 인식을 위해 고품질 마이크와 최소한의 배경 소음을 권장합니다.

## Playground에서 음성 모드 테스트하기[​](#test-voice-mode-in-the-playground "Playground에서 음성 모드 테스트하기로 바로 가기")

**Playground**에서  **Microphone**을 클릭하면 음성 모드를 활성화하여 마이크와 스피커로 플로우와 음성으로 상호작용할 수 있습니다.

다음 단계는 **Simple Agent** 템플릿을 사용해 음성 모드를 활성화하는 방법을 보여줍니다.

1. **Simple Agent** 템플릿을 기반으로 플로우를 만듭니다.

2. **Agent** 컴포넌트에 **OpenAI API key** 자격 증명을 추가합니다.

3. **Playground**를 클릭합니다.

4. **Voice mode** 대화 상자를 열려면  **Microphone** 아이콘을 클릭합니다.

5. OpenAI API 키를 입력한 다음 **Save**를 클릭합니다. Langflow는 이 키를 [글로벌 변수](https://docs.langflow.org/configuration-global-variables)로 저장합니다.

6. 마이크 접근 권한을 요청받으면 음성 모드를 사용하기 위해 반드시 마이크 접근을 허용해야 합니다.
마이크 접근이 차단되면 음성 입력을 제공할 수 없습니다.

7. **Audio Input**에서 음성 모드에 사용할 입력 장치를 선택합니다.

8. 선택 사항: LLM 응답에 더 다양한 음성을 사용하려면 ElevenLabs API 키를 추가합니다.
Langflow는 이 키를 글로벌 변수로 저장합니다.

9. **Preferred Language**에서 LLM과의 대화에 사용할 언어를 선택합니다.
이 옵션은 예상되는 입력 언어와 응답 언어를 모두 변경합니다.

10. 마이크에 대고 말하면 채팅이 시작됩니다.

    올바르게 구성되었다면 파형이 입력을 인식하고, 이후 에이전트의 로직과 응답이 음성과 **Playground** 화면에 함께 표시됩니다.

## 웹소켓 엔드포인트로 애플리케이션 개발하기[​](#develop-applications-with-websockets-endpoints "웹소켓 엔드포인트로 애플리케이션 개발하기로 바로 가기")

Langflow는 플로우를 위해 OpenAI Realtime API와 호환되는 웹소켓 엔드포인트를 제공합니다.
[OpenAI Realtime API 웹소켓](https://platform.openai.com/docs/guides/realtime#connect-with-websockets)에 맞춰 개발하는 것과 동일한 방식으로 이 엔드포인트에 대해 애플리케이션을 개발할 수 있습니다.

Langflow API의 웹소켓 엔드포인트는 인증을 위해 [OpenAI API 키](https://platform.openai.com/docs/overview)를 필요로 하며, ElevenLabs API 키를 이용한 선택적 [ElevenLabs](https://elevenlabs.io) 통합도 지원합니다.

또한 이 엔드포인트는 엔드포인트 경로에 플로우 ID를 포함해야 합니다.

### 음성-텍스트 오디오 전사[​](#speech-to-text-audio-transcription "음성-텍스트 오디오 전사로 바로 가기")

`/ws/flow_tts/$FLOW_ID` 엔드포인트는 [OpenAI Realtime 음성 전사](https://platform.openai.com/docs/guides/realtime-transcription)를 사용해 오디오를 텍스트로 변환한 다음, 각 전사 결과에 대해 지정된 플로우를 직접 호출합니다.

이 모드는 Langflow **Playground**에서 사용되는 모드입니다.

### 웹소켓 엔드포인트의 세션 ID[​](#session-ids-for-websockets-endpoints "웹소켓 엔드포인트의 세션 ID로 바로 가기")

이 엔드포인트는 대화에 고유 ID를 부여하기 위한 선택적 `/$SESSION_ID` 경로 매개변수를 받습니다.
생략하면 Langflow는 플로우 ID를 [세션 ID](https://docs.langflow.org/session-id)로 사용합니다.

다만 음성 모드는 현재 대화 인스턴스 내에서만 컨텍스트를 유지한다는 점에 유의하세요.
**Playground**를 닫거나 채팅을 종료하면 음성 채팅 기록은 폐기되며 이후 채팅 세션에서 사용할 수 없습니다.

## 참고[​](#see-also "참고로 바로 가기")

- [Playground에서 플로우 테스트하기](https://docs.langflow.org/concepts-playground)
- [음성 모드 문제 해결](https://docs.langflow.org/troubleshoot#voice-mode)
