import {Fragment, useRef, useState} from "react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatBot = () => {
  // 저체 메세지 목록
  const [message, setMessage] = useState<Message[]>([]);
  // 입력값 읽기
  const [input, setInput] = useState("");

  // AI메세지를 직접 생성 = HTML에 적용
  const streamingRef = useRef<HTMLDivElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  // AI가 보내준 데이터를 다 읽었는 지 확인
  const isStreaming = useRef(false);

  // 🔥 타이핑 효과용
  const typingQueue = useRef<string[]>([]);
  const typingTimer = useRef<number | null>(null);

  // 타이핑 시작
  const startTyping = () => {
    if (typingTimer.current !== null) return;

    typingTimer.current = window.setInterval(() => {
      if (!streamingRef.current) return;

      if (typingQueue.current.length === 0) {
        if (!isStreaming.current) {
          clearInterval(typingTimer.current!);
          typingTimer.current = null;
        }
        return;
      }

      if (streamingRef.current && typingQueue.current.length > 0) {
        streamingRef.current.textContent =
          (streamingRef.current.textContent ?? "") +
          typingQueue.current.shift()!;
      }
    }, 30); // ⏱ 타이핑 속도
  };

  // => return 안에 있는 데이터는 XML {} => if / for => 제어문 사용 금지
  // { data &&   => HTML만 츨력
  const sendMessage = async () => {
    // 1. 입력값이 없는 경우
    if (!input.trim()) return;

    // 2. 사용자 메세지를 state에 추가
    setMessage((prev) => [
      ...prev,  // 이전 데이터를 복사
      { role: 'user', content: input }, // 사용자가 보낸 메세지
      { role: 'assistant', content: ''} // AI가 보낸 메세지
    ]);

    const userMessage = input;
    setInput('');
    isStreaming.current = true;

    // AI가 보낸 데이터를 출력
    try {
      // 1. 서버연결 => fetch / axios
      // 2. 데이터를 수신 루프
      // 3. DOM직접 업데이트 => HTML을 생성해서 추가
      // 4. 스트리밍 종료후 state 반영

      // 2. 스트리밍 API 호출
      const response = await fetch(
        "http://localhost:8080/chat/stream?message="+encodeURIComponent(userMessage)
      );

      const reader = response.body!.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullContent = "";

      // 3. 스트리밍 수신 루프
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder
          .decode(value)
          .replaceAll("data:", "");

        fullContent += chunk;

        // 🔥 문자 단위 큐 적재
        for (const ch of chunk) {
          typingQueue.current.push(ch);
        }

        // 타이핑 시작
        startTyping();
      }

      // 스트리밍 종료
      isStreaming.current = false;

      // 5. 스트리밍 종료 후 state 반영
      setMessage((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: fullContent,
        };
        return updated;
      });

      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Fragment>
      <div className="breadcumb-area" style={{ backgroundImage: "url(/img/bg-img/breadcumb.jpg)" }}>
        <div className="container h-100">
          <div className="row h-100 align-items-center">
            <div className="col-12">
              <div className="bradcumb-title text-center">
                <h2>챗봇</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="breadcumb-nav">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">챗봇</li>
                  <li className="breadcrumb-item active" aria-current="page">챗봇</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <section className="archive-area section_padding_80">
        <div className="container">
          <div className="row chat-container" style={{ margin: "0 auto" }}>
            <div className="chat-header">Spring AI Chat (WebFlux)</div>
            <div className="chat-box" id="chatBox" ref={chatBoxRef}>
              {message.map((msg, index) => {
                const isLast = index === message.length - 1;
                const isAssistant = msg.role === "assistant";

                return (
                  <div
                    key={index}
                    className={`message ${msg.role}`}
                  >
                    <div
                      className="message-content"
                      ref={isAssistant && isLast ? streamingRef : null}
                    >
                      {msg.content}
                    </div>
                  </div>
                )
              })}

            </div>
            <div className="input-area">
              <div className="input-group">
                <input
                  type="text" id="messageInput" placeholder={"메세지 입력"}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button id="sendButton" onClick={sendMessage}>전송</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
)
}

export default ChatBot;